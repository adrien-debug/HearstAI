import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

// External database connection for crypto prices
function getExternalDbConnection() {
  const dbHost = process.env.EXTERNAL_DB_HOST
  const dbName = process.env.EXTERNAL_DB_NAME
  const dbUser = process.env.EXTERNAL_DB_USER
  const dbPassword = process.env.EXTERNAL_DB_PASSWORD
  const dbPort = process.env.EXTERNAL_DB_PORT

  if (!dbHost || !dbName || !dbUser || !dbPassword || !dbPort) {
    throw new Error('External database credentials are not configured. Please set EXTERNAL_DB_HOST, EXTERNAL_DB_NAME, EXTERNAL_DB_USER, EXTERNAL_DB_PASSWORD, and EXTERNAL_DB_PORT in .env.local')
  }

  return new Pool({
    host: dbHost,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    port: parseInt(dbPort),
    max: 1, // Limit connections for this external DB
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
}

// Helper function to fetch customers from Hearst API (shared)
async function fetchCustomers(hearstApiUrl: string, headers: HeadersInit): Promise<any[]> {
  const customersUrl = `${hearstApiUrl}/api/mining-operations/customers?limit=1000&pageNumber=1`
  
  const customersResponse = await fetch(customersUrl, {
    method: 'GET',
    headers,
  })

  if (!customersResponse.ok) {
    const errorText = await customersResponse.text().catch(() => '')
    console.error('[Cockpit API] Failed to fetch customers:', {
      status: customersResponse.status,
      error: errorText
    })
    throw new Error(`Failed to fetch customers: ${customersResponse.status}`)
  }

  const customersData = await customersResponse.json()
  const users = customersData.users || []
  
  if (!Array.isArray(users) || users.length === 0) {
    console.warn('[Cockpit API] No users found in API response')
    return []
  }
  
  return users
}

// Helper function to fetch global hashrate and total miners from external API (optimized with parallel calls)
async function fetchGlobalHashrateAndMiners(): Promise<{ globalHashrate: number; totalMiners: number }> {
  try {
    // Get HEARST_API_URL from environment, default to https://api.hearstcorporation.io
    const hearstApiUrl = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
    
    // Get API token from environment
    const apiToken = process.env.HEARST_API_TOKEN
    if (!apiToken) {
      console.error('[Cockpit API] HEARST_API_TOKEN is not configured in environment variables')
      return { globalHashrate: 0, totalMiners: 0 }
    }
    
    // Prepare headers with authentication token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-token': apiToken,
    }
    
    // Step 1: Fetch all customers once
    const users = await fetchCustomers(hearstApiUrl, headers)
    
    if (users.length === 0) {
      return { globalHashrate: 0, totalMiners: 0 }
    }

    // Step 2: Make parallel calls for both hashrate/chart and hashrate/statistics for each user
    const allPromises = users.map(async (user: any) => {
      try {
        const userId = user.id
        if (!userId) {
          return { hashrate: 0, machines: 0 }
        }

        // Make both API calls in parallel for each user
        const [hashrateResponse, statisticsResponse] = await Promise.all([
          fetch(`${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/chart`, {
            method: 'GET',
            headers,
          }),
          fetch(`${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/statistics`, {
            method: 'GET',
            headers,
          })
        ])

        // Process hashrate response
        let hashrate = 0
        if (hashrateResponse.ok) {
          const hashrateData = await hashrateResponse.json()
          const statistics = hashrateData.statistics || hashrateData.data?.statistics || {}
          hashrate = statistics.hashrateRealTime || 0
        }

        // Process statistics response
        let machines = 0
        if (statisticsResponse.ok) {
          const statisticsData = await statisticsResponse.json()
          machines = statisticsData.machines || statisticsData.data?.machines || 0
        }

        return { hashrate, machines }
      } catch (error) {
        console.error(`[Cockpit API] Error fetching data for user ${user.id}:`, error)
        return { hashrate: 0, machines: 0 }
      }
    })

    // Wait for all requests to complete in parallel
    const results = await Promise.all(allPromises)
    
    // Aggregate results
    const totalHashrate = results.reduce((sum, r) => sum + (r.hashrate || 0), 0)
    const totalMiners = results.reduce((sum, r) => sum + (r.machines || 0), 0)

    return { globalHashrate: totalHashrate, totalMiners }
  } catch (error) {
    console.error('[Cockpit API] Error fetching global hashrate and miners:', error)
    return { globalHashrate: 0, totalMiners: 0 }
  }
}

// Helper function to fetch global hashrate from external API (kept for backward compatibility)
async function fetchGlobalHashrate(): Promise<number> {
  const result = await fetchGlobalHashrateAndMiners()
  return result.globalHashrate
}

// Helper function to fetch total miners from external API (uses optimized parallel function)
async function fetchTotalMiners(): Promise<number> {
  const result = await fetchGlobalHashrateAndMiners()
  return result.totalMiners
}

// Helper function to fetch theoretical hashrate from database
async function fetchTheoreticalHashrate(): Promise<{
  theoreticalHashratePH: number
  activeContracts: number
  totalMachines: number
}> {
  try {
    // Query to calculate theoretical hashrate from active contracts
    const result = await prisma.$queryRaw<Array<{
      active_contracts: number
      total_machines: number
      theoretical_hashrate_ph: number
    }>>`
      SELECT 
        COUNT(*)::int as active_contracts,
        COALESCE(SUM("numberOfMachines")::int, 0) as total_machines,
        COALESCE(SUM(("machineTH" * "numberOfMachines") / 1000.0), 0)::float as theoretical_hashrate_ph
      FROM contract
      WHERE status = 'Active'
    `
    
    if (result && result.length > 0) {
      const data = result[0]
      return {
        theoreticalHashratePH: data.theoretical_hashrate_ph || 0,
        activeContracts: data.active_contracts || 0,
        totalMachines: data.total_machines || 0,
      }
    } else {
      return {
        theoreticalHashratePH: 0,
        activeContracts: 0,
        totalMachines: 0,
      }
    }
  } catch (error) {
    console.error('[Cockpit API] Error calculating theoretical hashrate:', error)
    return {
      theoreticalHashratePH: 0,
      activeContracts: 0,
      totalMachines: 0,
    }
  }
}

// Helper function to fetch BTC production (24h) from database
async function fetchBTCProduction24h(): Promise<number> {
  try {
    // Combined query: Get earnings from hashrate table for active Bitcoin contracts in last 24 hours
    // Using subquery to get active Bitcoin contract IDs
    const earningsResult = await prisma.$queryRaw<Array<{
      record_count: number
      total_earning: number
    }>>`
      SELECT 
        COUNT(*)::int as record_count,
        COALESCE(SUM(earning), 0)::float as total_earning
      FROM hashrate
      WHERE "contractId" IN (
        SELECT id
        FROM contract
        WHERE status = 'Active'
          AND currency = 'Bitcoin'
      )
        AND date >= CURRENT_DATE - INTERVAL '1 day'
    `
    
    if (earningsResult && earningsResult.length > 0) {
      const data = earningsResult[0]
      return data.total_earning || 0
    } else {
      return 0
    }
  } catch (error) {
    console.error('[Cockpit API] Error calculating BTC production 24h:', error)
    return 0
  }
}

// Helper function to fetch Bitcoin price for yesterday from external database
async function fetchBitcoinPriceYesterday(): Promise<number> {
  let pool: Pool | null = null
  try {
    pool = getExternalDbConnection()
    
    // Query to get Bitcoin price for yesterday's date
    const query = `
      SELECT "Bitcoin"
      FROM crypto_daily_prices
      WHERE date = CURRENT_DATE - INTERVAL '1 day'
      ORDER BY date DESC
      LIMIT 1
    `
    
    const result = await pool.query(query)
    
    if (result.rows && result.rows.length > 0) {
      const bitcoinPrice = parseFloat(result.rows[0].Bitcoin) || 0
      return bitcoinPrice
    } else {
      console.warn('[Cockpit API] No Bitcoin price found for yesterday')
      return 0
    }
  } catch (error) {
    console.error('[Cockpit API] Error fetching Bitcoin price:', error)
    return 0
  } finally {
    if (pool) {
      await pool.end()
    }
  }
}

// Helper function to fetch mining accounts summary from database
async function fetchMiningAccounts(bitcoinPrice: number): Promise<Array<{
  id: string
  name: string
  hashrate: number
  btc24h: number
  usd24h: number
  status: string
}>> {
  try {
    // Optimized query: Get all Bitcoin contracts with their earnings in last 24h in a single query
    const accountsResult = await prisma.$queryRaw<Array<{
      id: string
      name: string
      status: string
      machine_th: number
      number_of_machines: number
      btc24h: number
    }>>`
      SELECT 
        c.id,
        c.name,
        c.status,
        c."machineTH" as machine_th,
        c."numberOfMachines" as number_of_machines,
        COALESCE(SUM(h.earning), 0)::float as btc24h
      FROM contract c
      LEFT JOIN hashrate h ON h."contractId" = c.id 
        AND h.date >= CURRENT_DATE - INTERVAL '1 day'
      WHERE c.currency = 'Bitcoin'
      GROUP BY c.id, c.name, c.status, c."machineTH", c."numberOfMachines"
      ORDER BY c.id ASC
    `
    
    if (!accountsResult || accountsResult.length === 0) {
      return []
    }
    
    // Process accounts and calculate hashrate and USD 24h
    const miningAccounts = accountsResult.map((account) => {
      // Calculate hashrate: machineTH * numberOfMachines (in TH/s)
      const hashrateTH = (account.machine_th || 0) * (account.number_of_machines || 0)
      
      // BTC 24h is already calculated in the query
      const btc24h = account.btc24h || 0
      
      // Calculate USD 24h: BTC 24h * Bitcoin price
      const usd24h = btc24h * bitcoinPrice
      
      return {
        id: account.id,
        name: account.name || 'Unnamed Account',
        hashrate: hashrateTH,
        btc24h: btc24h,
        usd24h: usd24h,
        status: account.status || 'unknown',
      }
    })
    
    return miningAccounts
  } catch (error) {
    console.error('[Cockpit API] Error fetching mining accounts:', error)
    return []
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
    } else {
      console.log('[Cockpit API] Development mode - skipping authentication')
    }

    // Fetch real-time global hashrate and total miners from external API (optimized parallel calls)
    const { globalHashrate, totalMiners } = await fetchGlobalHashrateAndMiners()

    // Fetch theoretical hashrate from database
    const theoreticalData = await fetchTheoreticalHashrate()

    // Fetch BTC production (24h) from database
    const btcProduction24h = await fetchBTCProduction24h()

    // Fetch Bitcoin price for yesterday to calculate USD value
    const bitcoinPrice = await fetchBitcoinPriceYesterday()
    
    // Calculate USD value of BTC production
    const btcProduction24hUSD = btcProduction24h * bitcoinPrice

    // Fetch mining accounts summary
    const miningAccounts = await fetchMiningAccounts(bitcoinPrice)

    return NextResponse.json({
      data: {
        globalHashrate: globalHashrate || 0, // PH/s (from real API, 0 if API fails)
        theoreticalHashrate: theoreticalData.theoreticalHashratePH, // PH/s (from database)
        btcProduction24h: btcProduction24h || 0, // BTC (from database, last 24 hours)
        btcProduction24hUSD: btcProduction24hUSD || 0, // USD (BTC production * Bitcoin price)
        btcProduction7d: 0, // No data available yet
        totalMiners: totalMiners || 0, // Total miners from external API
        onlineMiners: 0, // No data available yet
        degradedMiners: 0, // No data available yet
        offlineMiners: 0, // No data available yet
        totalWorkers: 0, // No data available yet
        activeWorkers: 0, // No data available yet
        totalRevenue: 0, // No data available yet
        electricityCost: 0, // No data available yet
        profit: 0, // No data available yet
        miningAccounts: miningAccounts, // Mining accounts from database
        workers: [], // No data available yet
        miners: [], // No data available yet
      },
      message: 'Cockpit data retrieved successfully',
    })
  } catch (error) {
    console.error('Error getting cockpit data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

