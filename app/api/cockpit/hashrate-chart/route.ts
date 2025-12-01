import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaProd } from '@/lib/db'
import { getHearstApiConfig, isHearstApiConfigured } from '@/lib/hearst-api-config'

export const dynamic = 'force-dynamic'

// Helper function to fetch real-time hashrate data from last 7 days (aggregated by date)
async function fetchRealTimeHashrate(): Promise<Array<{ date: Date; total_speed_ph: number }>> {
  try {
    console.log('[Hashrate Chart API] Starting fetchRealTimeHashrate...')
    
    // Query to fetch actual hashrate data from the last 7 complete days (excluding today)
    // Speed is already in PH/s, no conversion needed
    // Only include data from active contracts
    // Exclude today's date as it will be updated tomorrow
    const result = await prismaProd.$queryRaw<Array<{
      date: Date
      total_speed_ph: number
    }>>`
      SELECT
        h.date,
        COALESCE(SUM(h.speed), 0)::float as total_speed_ph
      FROM
        public.hashrate h
      JOIN
        public.contract c
        ON c.id = h."contractId"
      WHERE
        h.date >= CURRENT_DATE - INTERVAL '7 days'
        AND h.date < CURRENT_DATE
        AND c.status = 'Active'
      GROUP BY
        h.date
      ORDER BY
        h.date ASC
    `
    
    console.log('[Hashrate Chart API] Real-time hashrate records found:', result.length)
    return result || []
  } catch (error: any) {
    // Expected error if database tables don't exist - silently return empty array
    if (error?.code === 'P2010' || error?.meta?.code === '42P01') {
      return []
    }
    console.error('[Hashrate Chart API] Error fetching real-time hashrate:', error)
    return []
  }
}

// Helper function to fetch current (latest) hashrate from database
async function fetchCurrentHashrate(): Promise<number> {
  try {
    console.log('[Hashrate Chart API] Starting fetchCurrentHashrate...')
    
    // Get the most recent hashrate value from active contracts (excluding today)
    // Speed is already in PH/s, no conversion needed
    // Exclude today's date as it will be updated tomorrow
    const result = await prismaProd.$queryRaw<Array<{
      total_speed_ph: number
    }>>`
      SELECT
        COALESCE(SUM(h.speed), 0)::float as total_speed_ph
      FROM
        public.hashrate h
      JOIN
        public.contract c
        ON c.id = h."contractId"
      WHERE
        h.date = (
          SELECT MAX(h2.date)
          FROM public.hashrate h2
          JOIN public.contract c2 ON c2.id = h2."contractId"
          WHERE c2.status = 'Active'
            AND h2.date < CURRENT_DATE
        )
        AND c.status = 'Active'
    `
    
    if (result && result.length > 0) {
      const current = result[0].total_speed_ph || 0
      console.log('[Hashrate Chart API] Current hashrate:', current)
      return current
    }
    
    return 0
  } catch (error: any) {
    // Expected error if database tables don't exist - silently return 0
    if (error?.code === 'P2010' || error?.meta?.code === '42P01') {
      return 0
    }
    console.error('[Hashrate Chart API] Error fetching current hashrate:', error)
    return 0
  }
}

// Helper function to fetch customers from API
async function fetchCustomers(apiConfig: { baseUrl: string; headers: HeadersInit }): Promise<any[]> {
  try {
    const customersUrl = `${apiConfig.baseUrl}/api/mining-operations/customers?limit=1000&pageNumber=1`
    const customersResponse = await fetch(customersUrl, {
      method: 'GET',
      headers: apiConfig.headers,
    })

    if (!customersResponse.ok) {
      if (customersResponse.status === 401 || customersResponse.status === 403) {
        return []
      }
      return []
    }

    const customersData = await customersResponse.json()
    return customersData.users || []
  } catch (error) {
    return []
  }
}

// Helper function to fetch customer contracts from API
async function fetchCustomerContracts(
  apiConfig: { baseUrl: string; headers: HeadersInit },
  customerId: string | number,
  currency?: string
): Promise<any[]> {
  try {
    const currencyParam = currency ? `&currency=${currency}` : ''
    const contractsUrl = `${apiConfig.baseUrl}/api/mining-operations/customers/${customerId}/contracts?limit=1000&pageNumber=1${currencyParam}`
    const contractsResponse = await fetch(contractsUrl, { method: 'GET', headers: apiConfig.headers })
    if (!contractsResponse.ok) {
      if (contractsResponse.status === 404) { return [] }
      return []
    }
    const contractsData = await contractsResponse.json()
    const contracts = contractsData.contracts || contractsData.data || []
    return Array.isArray(contracts) ? contracts : []
  } catch (error) {
    return []
  }
}

// Helper function to fetch theoretical hashrate from API (preferred) or database (fallback)
async function fetchTheoreticalHashrate(): Promise<number> {
  try {
    // Try API first
    const apiConfig = getHearstApiConfig()
    if (isHearstApiConfigured()) {
      try {
        const customers = await fetchCustomers(apiConfig)
        if (customers.length > 0) {
          let totalTheoreticalHashrate = 0
          
          // Fetch contracts for all customers in parallel
          const contractPromises = customers.map(async (customer: any) => {
            if (!customer.id) return []
            const contracts = await fetchCustomerContracts(apiConfig, customer.id, 'Bitcoin')
            return contracts
          })

          const contractArrays = await Promise.all(contractPromises)
          for (const contracts of contractArrays) {
            for (const contract of contracts) {
              if (contract.status === 'Active' || contract.status === 'active') {
                const machineTH = contract.machineTH || contract.machine_th || contract.hashrate || 0
                const numberOfMachines = contract.numberOfMachines || contract.number_of_machines || contract.machines || 1
                if (machineTH > 0 && numberOfMachines > 0) {
                  const hashratePH = (machineTH * numberOfMachines) / 1000.0
                  totalTheoreticalHashrate += hashratePH
                }
              }
            }
          }
          
          if (totalTheoreticalHashrate > 0) {
            return totalTheoreticalHashrate
          }
        }
      } catch (error) {
        // Fall through to database query
      }
    }

    // Fallback to database
    const result = await prismaProd.$queryRaw<Array<{
      theoretical_hashrate_ph: number
    }>>`
      SELECT 
        COALESCE(SUM(("machineTH" * "numberOfMachines") / 1000.0), 0)::float as theoretical_hashrate_ph
      FROM contract
      WHERE status = 'Active'
    `
    
    if (result && result.length > 0) {
      return result[0].theoretical_hashrate_ph || 0
    }
    
    return 0
  } catch (error: any) {
    // Expected error if database tables don't exist - silently return 0
    if (error?.code === 'P2010' || error?.meta?.code === '42P01') {
      return 0
    }
    // Don't log expected errors
    return 0
  }
}

export async function GET(request: NextRequest) {
  try {
    // In development, allow access without authentication for testing
    const isDevelopment = process.env.NODE_ENV === 'development'
    // In production, try to get session but don't block if not authenticated
    // Return empty data instead of 401 to prevent "Failed to fetch" errors
    if (!isDevelopment) {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
          console.warn('[Hashrate Chart API] No session found, returning empty data')
          // Return empty data structure instead of 401 error
          return NextResponse.json({
            dates: [],
            realTime: [],
            theoretical: [],
            stats: {
              current: 0,
              avg7Day: 0,
              peak: 0,
              theoretical: 0,
            },
          })
        }
      } catch (authError) {
        console.error('[Hashrate Chart API] Error checking authentication:', authError)
        // Return empty data instead of failing
        return NextResponse.json({
          dates: [],
          realTime: [],
          theoretical: [],
          stats: {
            current: 0,
            avg7Day: 0,
            peak: 0,
            theoretical: 0,
          },
        })
      }
    }

    console.log('[Hashrate Chart API] GET request received')

    // Fetch real-time hashrate data (already aggregated by date)
    const realTimeData = await fetchRealTimeHashrate()
    
    // Fetch current (latest) hashrate
    const currentHashrate = await fetchCurrentHashrate()
    
    // Fetch theoretical hashrate
    const theoreticalHashrate = await fetchTheoreticalHashrate()

    // Create a map of date -> hashrate from the query results
    const dateMap = new Map<string, number>()
    
    realTimeData.forEach((record) => {
      // Convert Date to YYYY-MM-DD string for key
      const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
      const dateKey = dateObj.toISOString().split('T')[0]
      dateMap.set(dateKey, record.total_speed_ph || 0)
    })

    // Get last 7 complete days (excluding today) and build arrays
    const dates: string[] = []
    const realTimeValues: number[] = []
    const theoreticalValues: number[] = []
    
    // Get actual data values (non-zero) for statistics
    const actualDataValues: number[] = []
    
    // Start from yesterday (i=1) and go back 7 days (i=1 to i=7)
    for (let i = 7; i >= 1; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const hashrateValue = dateMap.get(dateKey) || 0
      
      dates.push(dateLabel)
      realTimeValues.push(hashrateValue)
      theoreticalValues.push(theoreticalHashrate)
      
      // Collect actual data points (non-zero) for statistics
      if (hashrateValue > 0) {
        actualDataValues.push(hashrateValue)
      }
    }

    // Calculate statistics from actual data
    // Current: Use the fetched current hashrate (latest from database)
    const current = currentHashrate > 0 ? currentHashrate : (realTimeValues[realTimeValues.length - 1] || 0)
    
    // 7-day average: Calculate from actual data points only
    const avg7Day = actualDataValues.length > 0
      ? actualDataValues.reduce((a, b) => a + b, 0) / actualDataValues.length
      : 0
    
    // Peak: Maximum from actual data points
    const peak = actualDataValues.length > 0 ? Math.max(...actualDataValues) : 0

    return NextResponse.json({
      dates,
      realTime: realTimeValues,
      theoretical: theoreticalValues,
      stats: {
        current,
        avg7Day,
        peak,
        theoretical: theoreticalHashrate,
      },
    })
  } catch (error) {
    console.error('[Hashrate Chart API] Error getting hashrate chart data:', error)
    // Return empty data structure instead of error 500
    return NextResponse.json({
      dates: [],
      realTime: [],
      theoretical: [],
      stats: {
        current: 0,
        avg7Day: 0,
        peak: 0,
        theoretical: 0,
      },
    })
  }
}

