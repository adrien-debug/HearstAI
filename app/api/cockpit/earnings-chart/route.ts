import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Helper function to fetch earnings data based on timeframe
async function fetchEarningsData(timeframe: 'week' | 'month' | 'year'): Promise<Array<{ date: Date; total_earnings: number }>> {
  try {
    console.log(`[Earnings Chart API] Starting fetchEarningsData for timeframe: ${timeframe}`)
    
    let result: Array<{ date: Date; total_earnings: number }> = []
    
    if (timeframe === 'week') {
      // Week View - Daily Earnings (Last 7 Days, excluding today)
      result = await prisma.$queryRaw<Array<{
        date: Date
        total_earnings: number
      }>>`
        SELECT
          h.date,
          COALESCE(SUM(h.earning), 0)::float as total_earnings
        FROM
          public.hashrate h
        JOIN
          public.contract c
          ON c.id = h."contractId"
        WHERE
          c.currency = 'Bitcoin'
          AND h.date >= CURRENT_DATE - INTERVAL '7 days'
          AND h.date < CURRENT_DATE
        GROUP BY
          h.date
        ORDER BY
          h.date ASC
      `
    } else if (timeframe === 'month') {
      // Month View - Weekly Earnings (Last 7 Weeks)
      result = await prisma.$queryRaw<Array<{
        date: Date
        total_earnings: number
      }>>`
        SELECT
          DATE_TRUNC('week', h.date)::date AS date,
          COALESCE(SUM(h.earning), 0)::float as total_earnings
        FROM
          public.hashrate h
        JOIN
          public.contract c
          ON c.id = h."contractId"
        WHERE
          c.currency = 'Bitcoin'
          AND h.date >= CURRENT_DATE - INTERVAL '49 days'
          AND h.date < CURRENT_DATE
        GROUP BY
          DATE_TRUNC('week', h.date)
        ORDER BY
          DATE_TRUNC('week', h.date) ASC
        LIMIT 7
      `
    } else if (timeframe === 'year') {
      // Year View - Monthly Earnings (Last 12 Months)
      // Display data for all contracts, not only active ones
      result = await prisma.$queryRaw<Array<{
        date: Date
        total_earnings: number
      }>>`
        SELECT
          DATE_TRUNC('month', h.date)::date AS date,
          COALESCE(SUM(h.earning), 0)::float as total_earnings
        FROM
          public.hashrate h
        JOIN
          public.contract c
          ON c.id = h."contractId"
        WHERE
          c.currency = 'Bitcoin'
          AND h.date >= CURRENT_DATE - INTERVAL '365 days'
          AND h.date < CURRENT_DATE
        GROUP BY
          DATE_TRUNC('month', h.date)
        ORDER BY
          DATE_TRUNC('month', h.date) ASC
        LIMIT 12
      `
    }
    
    console.log(`[Earnings Chart API] Earnings records found: ${result.length}`)
    return result || []
  } catch (error) {
    console.error('[Earnings Chart API] Error fetching earnings data:', error)
    return []
  }
}

// Helper function to calculate target earnings (10% above average)
function calculateTarget(earningsData: number[]): number[] {
  if (earningsData.length === 0) return []
  
  const avgEarnings = earningsData.reduce((a, b) => a + b, 0) / earningsData.length
  const targetValue = avgEarnings * 1.1 // 10% above average
  
  return Array(earningsData.length).fill(targetValue)
}

// Helper function to fetch Bitcoin prices for specific dates
async function fetchBitcoinPricesForDates(dates: Date[], timeframe: 'week' | 'month' | 'year'): Promise<Map<string, number>> {
  try {
    const { Pool } = await import('pg')
    
    const dbHost = process.env.EXTERNAL_DB_HOST
    const dbName = process.env.EXTERNAL_DB_NAME
    const dbUser = process.env.EXTERNAL_DB_USER
    const dbPassword = process.env.EXTERNAL_DB_PASSWORD
    const dbPort = process.env.EXTERNAL_DB_PORT

    if (!dbHost || !dbName || !dbUser || !dbPassword || !dbPort) {
      console.warn('[Earnings Chart API] External database not configured')
      return new Map()
    }

    const pool = new Pool({
      host: dbHost,
      database: dbName,
      user: dbUser,
      password: dbPassword,
      port: parseInt(dbPort),
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    const priceMap = new Map<string, number>()

    if (timeframe === 'week') {
      // For week view: Get daily prices for each date
      const dateStrings = dates.map(d => {
        const date = d instanceof Date ? d : new Date(d)
        return date.toISOString().split('T')[0]
      })
      
      const query = `
        SELECT date, "Bitcoin"
        FROM crypto_daily_prices
        WHERE date IN (${dateStrings.map((_, i) => `$${i + 1}`).join(', ')})
        ORDER BY date ASC
      `
      
      const result = await pool.query(query, dateStrings)
      
      result.rows.forEach((row: any) => {
        const dateKey = row.date.toISOString().split('T')[0]
        priceMap.set(dateKey, parseFloat(row.Bitcoin) || 0)
      })
    } else if (timeframe === 'month') {
      // For month view: Get average weekly prices for each week
      const weekDates = dates.map(d => {
        const date = d instanceof Date ? d : new Date(d)
        return date.toISOString().split('T')[0]
      })
      
      const query = `
        SELECT 
          DATE_TRUNC('week', date)::date AS week_start,
          AVG("Bitcoin")::float AS avg_price
        FROM crypto_daily_prices
        WHERE DATE_TRUNC('week', date)::date IN (${weekDates.map((_, i) => `$${i + 1}`).join(', ')})
        GROUP BY DATE_TRUNC('week', date)
        ORDER BY week_start ASC
      `
      
      const result = await pool.query(query, weekDates)
      
      result.rows.forEach((row: any) => {
        const weekStart = row.week_start.toISOString().split('T')[0]
        priceMap.set(weekStart, parseFloat(row.avg_price) || 0)
      })
    } else {
      // For year view: Get average monthly prices for each month
      const monthDates = dates.map(d => {
        const date = d instanceof Date ? d : new Date(d)
        // Get first day of month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        return firstDay.toISOString().split('T')[0]
      })
      
      const query = `
        SELECT 
          DATE_TRUNC('month', date)::date AS month_start,
          AVG("Bitcoin")::float AS avg_price
        FROM crypto_daily_prices
        WHERE DATE_TRUNC('month', date)::date IN (${monthDates.map((_, i) => `$${i + 1}`).join(', ')})
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY month_start ASC
      `
      
      const result = await pool.query(query, monthDates)
      
      result.rows.forEach((row: any) => {
        const monthStart = row.month_start.toISOString().split('T')[0]
        priceMap.set(monthStart, parseFloat(row.avg_price) || 0)
      })
    }
    
    await pool.end()
    console.log(`[Earnings Chart API] Fetched ${priceMap.size} Bitcoin prices`)
    return priceMap
  } catch (error) {
    console.error('[Earnings Chart API] Error fetching Bitcoin prices:', error)
    return new Map()
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

    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get('timeframe') || 'week') as 'week' | 'month' | 'year'

    console.log(`[Earnings Chart API] GET request received for timeframe: ${timeframe}`)

    // Fetch earnings data based on timeframe
    const earningsData = await fetchEarningsData(timeframe)
    
    // Create a map of date -> earnings from the query results
    const dateMap = new Map<string, number>()
    
    earningsData.forEach((record) => {
      const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
      const dateKey = dateObj.toISOString().split('T')[0]
      dateMap.set(dateKey, record.total_earnings || 0)
    })

    // Build arrays for data points based on timeframe
    const dates: string[] = []
    const btcEarningsValues: number[] = []
    
    if (timeframe === 'week') {
      // Week: Last 7 complete days (excluding today)
      for (let i = 7; i >= 1; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split('T')[0]
        const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
        dates.push(dateLabel)
        btcEarningsValues.push(dateMap.get(dateKey) || 0)
      }
    } else if (timeframe === 'month') {
      // Month: Last 7 weeks - use the data from query (already grouped by week, limited to 7)
      earningsData.forEach((record) => {
        const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
        const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        dates.push(dateLabel)
        btcEarningsValues.push(record.total_earnings || 0)
      })
    } else {
      // Year: Last 12 months - use the data from query (already grouped by month, limited to 12)
      earningsData.forEach((record) => {
        const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
        const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        dates.push(dateLabel)
        btcEarningsValues.push(record.total_earnings || 0)
      })
    }

    // Calculate target values (10% above average)
    const targetValues = calculateTarget(btcEarningsValues)

    // Calculate statistics
    const actualDataValues = btcEarningsValues.filter(v => v > 0)
    
    // Latest: Most recent earnings value
    const latest = btcEarningsValues.length > 0 ? btcEarningsValues[btcEarningsValues.length - 1] : 0
    
    // 7-day/week/month total: Sum of all earnings
    const total7Day = btcEarningsValues.reduce((a, b) => a + b, 0)
    
    // USD Value: Calculate by multiplying each period's earnings by its corresponding Bitcoin price
    // This ensures accurate USD conversion using the price at the time of each earning period
    let usdValue = 0
    
    if (timeframe === 'week') {
      // For week view: Use daily prices for each day
      const earningsDates = earningsData.map(r => r.date instanceof Date ? r.date : new Date(r.date))
      const bitcoinPrices = await fetchBitcoinPricesForDates(earningsDates, timeframe)
      
      earningsData.forEach((record) => {
        const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
        const dateKey = dateObj.toISOString().split('T')[0]
        const btcEarnings = record.total_earnings || 0
        const btcPrice = bitcoinPrices.get(dateKey) || 0
        
        // Multiply each day's earnings by that day's Bitcoin price
        usdValue += btcEarnings * btcPrice
      })
    } else {
      // For month/year views: Use the earningsData dates directly
      const earningsDates = earningsData.map(r => r.date instanceof Date ? r.date : new Date(r.date))
      const bitcoinPrices = await fetchBitcoinPricesForDates(earningsDates, timeframe)
      
      earningsData.forEach((record) => {
        const dateObj = record.date instanceof Date ? record.date : new Date(record.date)
        const dateKey = dateObj.toISOString().split('T')[0]
        const btcEarnings = record.total_earnings || 0
        const btcPrice = bitcoinPrices.get(dateKey) || 0
        
        // Multiply each period's earnings by its corresponding average Bitcoin price
        usdValue += btcEarnings * btcPrice
      })
    }
    
    // If no prices found, fallback to latest price
    if (usdValue === 0 && total7Day > 0) {
      const { Pool } = await import('pg')
      const dbHost = process.env.EXTERNAL_DB_HOST
      const dbName = process.env.EXTERNAL_DB_NAME
      const dbUser = process.env.EXTERNAL_DB_USER
      const dbPassword = process.env.EXTERNAL_DB_PASSWORD
      const dbPort = process.env.EXTERNAL_DB_PORT
      
      if (dbHost && dbName && dbUser && dbPassword && dbPort) {
        try {
          const pool = new Pool({
            host: dbHost,
            database: dbName,
            user: dbUser,
            password: dbPassword,
            port: parseInt(dbPort),
            max: 1,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          })
          
          const result = await pool.query(`
            SELECT "Bitcoin"
            FROM crypto_daily_prices
            ORDER BY date DESC
            LIMIT 1
          `)
          await pool.end()
          
          if (result.rows && result.rows.length > 0) {
            const latestPrice = parseFloat(result.rows[0].Bitcoin) || 0
            usdValue = total7Day * latestPrice
          }
        } catch (error) {
          console.error('[Earnings Chart API] Error fetching fallback Bitcoin price:', error)
        }
      }
    }
    
    // Peak Day: Maximum earnings
    const peakDay = actualDataValues.length > 0 ? Math.max(...actualDataValues) : 0

    return NextResponse.json({
      dates,
      btcEarnings: btcEarningsValues,
      target: targetValues,
      stats: {
        latest,
        total7Day,
        usdValue,
        peakDay,
      },
    })
  } catch (error) {
    console.error('[Earnings Chart API] Error getting earnings chart data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

