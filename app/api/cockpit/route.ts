import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'
export const revalidate = 30 // Cache pour 30 secondes (Next.js 14+)
export const maxDuration = 60 // 60 secondes max pour Vercel Pro (10s pour Hobby)

// External database connection for crypto prices
function getExternalDbConnection(): Pool | null {
  const dbHost = process.env.EXTERNAL_DB_HOST
  const dbName = process.env.EXTERNAL_DB_NAME
  const dbUser = process.env.EXTERNAL_DB_USER
  const dbPassword = process.env.EXTERNAL_DB_PASSWORD
  const dbPort = process.env.EXTERNAL_DB_PORT

  if (!dbHost || !dbName || !dbUser || !dbPassword || !dbPort) {
    console.warn('[Cockpit API] External database credentials are not configured. Skipping external DB queries.')
    return null
  }

  try {
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
  } catch (error) {
    console.error('[Cockpit API] Error creating external DB connection:', error)
    return null
  }
}

// Helper function to fetch customers from Hearst API (shared)
// According to MINING_OPERATIONS_API.pdf documentation
async function fetchCustomers(hearstApiUrl: string, headers: HeadersInit): Promise<any[]> {
  // GET /api/mining-operations/customers
  // Response structure: { data: [...], totalPages: number, currentPage: number }
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
  // According to API doc: response has 'data' field, not 'users'
  const users = customersData.data || customersData.users || []
  
  if (!Array.isArray(users) || users.length === 0) {
    console.warn('[Cockpit API] No users found in API response')
    return []
  }
  
  return users
}

// Helper function to fetch global hashrate and total miners from external API (optimized with parallel calls)
async function fetchGlobalHashrateAndMiners(): Promise<{ globalHashrate: number; totalMiners: number }> {
  // Global timeout: 8 seconds to leave margin before Vercel timeout (10s Hobby, 60s Pro)
  const GLOBAL_TIMEOUT = 8000
  const startTime = Date.now()
  
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
    
    // Step 1: Fetch all customers once (with timeout)
    const customersController = new AbortController()
    const customersTimeout = setTimeout(() => customersController.abort(), 3000)
    
    let users: any[] = []
    try {
      const customersUrl = `${hearstApiUrl}/api/mining-operations/customers?limit=1000&pageNumber=1`
      const customersResponse = await fetch(customersUrl, {
        method: 'GET',
        headers,
        signal: customersController.signal,
      })
      clearTimeout(customersTimeout)
      
      if (customersResponse.ok) {
        const customersData = await customersResponse.json()
        users = customersData.data || customersData.users || []
      }
    } catch (error: any) {
      clearTimeout(customersTimeout)
      if (error.name !== 'AbortError') {
        console.error('[Cockpit API] Error fetching customers:', error.message)
      }
    }
    
    if (users.length === 0) {
      return { globalHashrate: 0, totalMiners: 0 }
    }

    // Step 2: Limit number of users to process (max 50 for performance)
    // This prevents timeout on large datasets
    const MAX_USERS = 50
    const usersToProcess = users.slice(0, MAX_USERS)
    
    if (users.length > MAX_USERS) {
      console.warn(`[Cockpit API] Processing only first ${MAX_USERS} users out of ${users.length} total`)
    }

    // Step 3: Make parallel calls with timeout and batching for performance
    // Limit concurrent requests to avoid overwhelming the API
    const BATCH_SIZE = 10 // Reduced from 20 to 10 for faster processing
    const REQUEST_TIMEOUT = 3000 // Reduced from 5s to 3s per request
    const results: Array<{ hashrate: number; machines: number }> = []

    // Process users in batches to avoid overwhelming the API
    for (let i = 0; i < usersToProcess.length; i += BATCH_SIZE) {
      // Check global timeout before processing next batch
      const elapsed = Date.now() - startTime
      if (elapsed > GLOBAL_TIMEOUT) {
        console.warn(`[Cockpit API] Global timeout reached after ${elapsed}ms, stopping batch processing`)
        break
      }
      
      const batch = usersToProcess.slice(i, i + BATCH_SIZE)
      
      const batchPromises = batch.map(async (user: any) => {
        try {
          const userId = user.id
          if (!userId) {
            return { hashrate: 0, machines: 0 }
          }

          // Create AbortController for timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

          try {
            // Make both API calls in parallel for each user with timeout
            const [hashrateResponse, statisticsResponse] = await Promise.all([
              fetch(`${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/chart`, {
                method: 'GET',
                headers,
                signal: controller.signal,
              }),
              fetch(`${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/statistics`, {
                method: 'GET',
                headers,
                signal: controller.signal,
              })
            ])

            clearTimeout(timeoutId)

            // Process hashrate response
            // GET /api/mining-operations/customers/:id/hashrate/chart
            // Returns: Real-time hashrate, Last 24 hours hourly data, Last 30 days daily data
            let hashrate = 0
            if (hashrateResponse.ok) {
              const hashrateData = await hashrateResponse.json()
              // API doc: Returns hashrate data with statistics
              const statistics = hashrateData.statistics || hashrateData.data?.statistics || hashrateData || {}
              hashrate = statistics.hashrateRealTime || statistics.realTime || statistics.current || 0
            }

            // Process statistics response
            // GET /api/mining-operations/customers/:id/hashrate/statistics
            // Returns: Total hashrate, Total number of machines, Total investment amount
            let machines = 0
            if (statisticsResponse.ok) {
              const statisticsData = await statisticsResponse.json()
              // API doc: Returns total number of machines
              machines = statisticsData.machines || statisticsData.data?.machines || statisticsData.totalMachines || 0
            }

            return { hashrate, machines }
          } catch (fetchError: any) {
            clearTimeout(timeoutId)
            if (fetchError.name === 'AbortError') {
              // Silent timeout - don't log to avoid spam
            } else {
              console.error(`[Cockpit API] Error fetching data for user ${userId}:`, fetchError.message)
            }
            return { hashrate: 0, machines: 0 }
          }
        } catch (error: any) {
          console.error(`[Cockpit API] Error processing user ${user.id}:`, error.message)
          return { hashrate: 0, machines: 0 }
        }
      })

      // Wait for batch to complete with timeout
      try {
        const batchResults = await Promise.race([
          Promise.all(batchPromises),
          new Promise<Array<{ hashrate: number; machines: number }>>((resolve) => {
            setTimeout(() => {
              // Return zeros for incomplete batch
              resolve(batch.map(() => ({ hashrate: 0, machines: 0 })))
            }, REQUEST_TIMEOUT + 1000)
          })
        ])
        results.push(...batchResults)
      } catch (error) {
        // If batch fails, continue with zeros
        results.push(...batch.map(() => ({ hashrate: 0, machines: 0 })))
      }
    }
    
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
    
    if (!pool) {
      console.warn('[Cockpit API] External DB connection not available, returning 0 for Bitcoin price')
      return 0
    }
    
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
      try {
        await pool.end()
      } catch (error) {
        console.error('[Cockpit API] Error closing pool:', error)
      }
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
  // Global timeout wrapper: 8 seconds to leave margin before Vercel timeout
  const API_TIMEOUT = 8000
  const startTime = Date.now()
  
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    setTimeout(() => {
      console.warn('[Cockpit API] Request timeout after 8 seconds, returning partial data')
      resolve(NextResponse.json({
        data: {
          globalHashrate: 0,
          theoreticalHashrate: 0,
          btcProduction24h: 0,
          btcProduction24hUSD: 0,
          btcProduction7d: 0,
          totalMiners: 0,
          onlineMiners: 0,
          degradedMiners: 0,
          offlineMiners: 0,
          totalWorkers: 0,
          activeWorkers: 0,
          totalRevenue: 0,
          electricityCost: 0,
          profit: 0,
          miningAccounts: [],
          workers: [],
          miners: [],
        },
        message: 'Cockpit data (timeout - partial data)',
      }))
    }, API_TIMEOUT)
  })
  
  const apiPromise = (async () => {
    try {
      // In development, allow access without authentication for testing
      const isDevelopment = process.env.NODE_ENV === 'development'
      // In production, try to get session but don't block if not authenticated
      // Return empty data instead of 401 to prevent "Failed to fetch" errors
      if (!isDevelopment) {
        try {
          const session = await getServerSession(authOptions)
          if (!session?.user?.id) {
            console.warn('[Cockpit API] No session found, returning empty data')
            // Return empty data structure instead of 401 error
            return NextResponse.json({
              data: {
                globalHashrate: 0,
                theoreticalHashrate: 0,
                btcProduction24h: 0,
                btcProduction24hUSD: 0,
                btcProduction7d: 0,
                totalMiners: 0,
                onlineMiners: 0,
                degradedMiners: 0,
                offlineMiners: 0,
                totalWorkers: 0,
                activeWorkers: 0,
                totalRevenue: 0,
                electricityCost: 0,
                profit: 0,
                miningAccounts: [],
                workers: [],
                miners: [],
              },
              message: 'Cockpit data (no authentication)',
            })
          }
        } catch (authError) {
          console.error('[Cockpit API] Error checking authentication:', authError)
          // Continue with empty data instead of failing
          return NextResponse.json({
            data: {
              globalHashrate: 0,
              theoreticalHashrate: 0,
              btcProduction24h: 0,
              btcProduction24hUSD: 0,
              btcProduction7d: 0,
              totalMiners: 0,
              onlineMiners: 0,
              degradedMiners: 0,
              offlineMiners: 0,
              totalWorkers: 0,
              activeWorkers: 0,
              totalRevenue: 0,
              electricityCost: 0,
              profit: 0,
              miningAccounts: [],
              workers: [],
              miners: [],
            },
            message: 'Cockpit data (authentication error)',
          })
        }
      } else {
        console.log('[Cockpit API] Development mode - skipping authentication')
      }

      // Fetch all data with individual error handling to ensure we always return valid data
      // Use Promise.allSettled to run all fetches in parallel and handle errors gracefully
      let globalHashrate = 0
      let totalMiners = 0
      let theoreticalData = { theoreticalHashratePH: 0, activeContracts: 0, totalMachines: 0 }
      let btcProduction24h = 0
      let bitcoinPrice = 0
      let miningAccounts: Array<{
        id: string
        name: string
        hashrate: number
        btc24h: number
        usd24h: number
        status: string
      }> = []

      // Run all database queries in parallel (they're fast)
      const [hashrateResult, theoreticalResult, btcResult, priceResult, accountsResult] = await Promise.allSettled([
        fetchGlobalHashrateAndMiners(),
        fetchTheoreticalHashrate(),
        fetchBTCProduction24h(),
        fetchBitcoinPriceYesterday(),
        Promise.resolve(null), // Will fetch accounts after we have bitcoin price
      ])

      // Process hashrate result
      if (hashrateResult.status === 'fulfilled') {
        globalHashrate = hashrateResult.value.globalHashrate || 0
        totalMiners = hashrateResult.value.totalMiners || 0
      } else {
        console.error('[Cockpit API] Error fetching global hashrate:', hashrateResult.reason)
      }

      // Process theoretical hashrate result
      if (theoreticalResult.status === 'fulfilled') {
        theoreticalData = theoreticalResult.value
      } else {
        console.error('[Cockpit API] Error fetching theoretical hashrate:', theoreticalResult.reason)
      }

      // Process BTC production result
      if (btcResult.status === 'fulfilled') {
        btcProduction24h = btcResult.value
      } else {
        console.error('[Cockpit API] Error fetching BTC production:', btcResult.reason)
      }

      // Process Bitcoin price result
      if (priceResult.status === 'fulfilled') {
        bitcoinPrice = priceResult.value
      } else {
        console.error('[Cockpit API] Error fetching Bitcoin price:', priceResult.reason)
      }
      
      // Calculate USD value of BTC production
      const btcProduction24hUSD = btcProduction24h * bitcoinPrice

      // Fetch mining accounts summary (with fallback) - only if we have time
      const elapsed = Date.now() - startTime
      if (elapsed < API_TIMEOUT - 2000) { // Leave 2s margin
        try {
          miningAccounts = await fetchMiningAccounts(bitcoinPrice)
        } catch (error) {
          console.error('[Cockpit API] Error fetching mining accounts:', error)
        }
      } else {
        console.warn('[Cockpit API] Skipping mining accounts fetch due to time constraint')
      }

      // Always return valid data structure, even if some sources failed
      return NextResponse.json({
        data: {
          globalHashrate: globalHashrate || 0, // PH/s (from real API, 0 if API fails)
          theoreticalHashrate: theoreticalData.theoreticalHashratePH || 0, // PH/s (from database)
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
          miningAccounts: miningAccounts || [], // Mining accounts from database
          workers: [], // No data available yet
          miners: [], // No data available yet
        },
        message: 'Cockpit data retrieved successfully',
      })
    } catch (error) {
      // Final fallback: return empty data structure instead of error 500
      console.error('[Cockpit API] Critical error getting cockpit data:', error)
      return NextResponse.json({
        data: {
          globalHashrate: 0,
          theoreticalHashrate: 0,
          btcProduction24h: 0,
          btcProduction24hUSD: 0,
          btcProduction7d: 0,
          totalMiners: 0,
          onlineMiners: 0,
          degradedMiners: 0,
          offlineMiners: 0,
          totalWorkers: 0,
          activeWorkers: 0,
          totalRevenue: 0,
          electricityCost: 0,
          profit: 0,
          miningAccounts: [],
          workers: [],
          miners: [],
        },
        message: 'Cockpit data retrieved with fallback values',
      })
    }
  })()
  
  // Race between API call and timeout
  return Promise.race([apiPromise, timeoutPromise])
}

