import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Helper function to fetch real-time hashrate data from last 7 days (aggregated by date)
async function fetchRealTimeHashrate(): Promise<Array<{ date: Date; total_speed_ph: number }>> {
  try {
    console.log('[Hashrate Chart API] Starting fetchRealTimeHashrate...')
    
    // Query to fetch actual hashrate data from the last 7 complete days (excluding today)
    // Speed is already in PH/s, no conversion needed
    // Only include data from active contracts
    // Exclude today's date as it will be updated tomorrow
    const result = await prisma.$queryRaw<Array<{
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
  } catch (error) {
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
    const result = await prisma.$queryRaw<Array<{
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
  } catch (error) {
    console.error('[Hashrate Chart API] Error fetching current hashrate:', error)
    return 0
  }
}

// Helper function to fetch theoretical hashrate
async function fetchTheoreticalHashrate(): Promise<number> {
  try {
    console.log('[Hashrate Chart API] Starting fetchTheoreticalHashrate...')
    
    // Query to calculate maximum possible hashrate from active contracts
    const result = await prisma.$queryRaw<Array<{
      active_contracts: number
      total_machines: number
      theoretical_hashrate_ph: number
    }>>`
      SELECT 
        COUNT(*)::int as active_contracts,
        SUM("numberOfMachines")::int as total_machines,
        SUM(("machineTH" * "numberOfMachines") / 1000.0)::float as theoretical_hashrate_ph
      FROM contract
      WHERE status = 'Active'
    `
    
    if (result && result.length > 0) {
      const data = result[0]
      console.log('[Hashrate Chart API] Theoretical hashrate:', data.theoretical_hashrate_ph)
      return data.theoretical_hashrate_ph || 0
    }
    
    return 0
  } catch (error) {
    console.error('[Hashrate Chart API] Error fetching theoretical hashrate:', error)
    return 0
  }
}

export async function GET(request: NextRequest) {
  try {
    // In development, allow access without authentication for testing
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

