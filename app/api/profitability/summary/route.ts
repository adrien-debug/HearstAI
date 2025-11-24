import { NextRequest, NextResponse } from 'next/server'

// Cache pour hashprice (même logique que dans hashprice/current)
let hashpriceCache: any = null
let hashpriceCacheTime = 0
const CACHE_DURATION = 600000 // 10 minutes

async function fetchHashprice() {
  // Vérifier le cache
  if (hashpriceCache && (Date.now() - hashpriceCacheTime) < CACHE_DURATION) {
    return hashpriceCache
  }

  try {
    // TODO: Intégrer API externe (Luxor, Hashlabs, etc.)
    // const response = await fetch('https://api.luxor.tech/hashprice/v1/latest')
    // const data = await response.json()
    
    // MOCK DATA pour démo
    const hashprice = {
      current: 45.2 + (Math.random() - 0.5) * 2,
      avg7d: 44.8,
      avg30d: 46.5,
      timestamp: new Date().toISOString(),
      source: 'Mock API'
    }
    
    hashpriceCache = hashprice
    hashpriceCacheTime = Date.now()
    
    return hashprice
  } catch (error) {
    console.error('Failed to fetch hashprice:', error)
    return hashpriceCache || { 
      current: 45.0, 
      avg7d: 44.5, 
      avg30d: 46.0,
      timestamp: new Date().toISOString(),
      source: 'Fallback'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Récupérer batches depuis DB
    // const batches = await db.getBatches()
    
    // MOCK DATA pour démo
    const batches = [
      {
        id: 'BATCH-001',
        name: 'Antminer S19 Pro Batch A',
        totalHashrate: 2.5, // PH/s
        hardwareInvestment: 125000,
        electricity: { dailyCost: 450, kwhRate: 0.08 }
      },
      {
        id: 'BATCH-002',
        name: 'Antminer S19 Pro Batch B',
        totalHashrate: 1.8, // PH/s
        hardwareInvestment: 95000,
        electricity: { dailyCost: 320, kwhRate: 0.07 }
      },
      {
        id: 'BATCH-003',
        name: 'Whatsminer M30S Batch C',
        totalHashrate: 1.2, // PH/s
        hardwareInvestment: 75000,
        electricity: { dailyCost: 280, kwhRate: 0.10 }
      },
      {
        id: 'BATCH-004',
        name: 'Antminer S19j Batch D',
        totalHashrate: 0.9, // PH/s
        hardwareInvestment: 48000,
        electricity: { dailyCost: 190, kwhRate: 0.08 }
      }
    ]
    
    const hashprice = await fetchHashprice()
    
    // Analyser chaque batch
    const analyzed = batches.map(batch => {
      const dailyRevenue = hashprice.current * batch.totalHashrate
      const dailyProfit = dailyRevenue - batch.electricity.dailyCost
      
      const dailyROI = (dailyProfit / batch.hardwareInvestment) * 100
      const monthlyROI = dailyROI * 30
      
      const breakEvenDays = dailyProfit > 0 ? 
        Math.ceil(batch.hardwareInvestment / dailyProfit) : 
        Infinity
      
      const profitMargin = (dailyProfit / dailyRevenue) * 100
      let status: 'profitable' | 'marginal' | 'unprofitable'
      if (dailyProfit < 0) {
        status = 'unprofitable'
      } else if (profitMargin < 10) {
        status = 'marginal'
      } else {
        status = 'profitable'
      }
      
      return {
        batch,
        hashprice: parseFloat(hashprice.current.toFixed(2)),
        dailyProfit: parseFloat(dailyProfit.toFixed(2)),
        monthlyProfit: parseFloat((dailyProfit * 30).toFixed(2)),
        dailyROI: parseFloat(dailyROI.toFixed(4)),
        monthlyROI: parseFloat(monthlyROI.toFixed(2)),
        breakEvenDays,
        breakEvenMonths: parseFloat((breakEvenDays / 30).toFixed(1)),
        status,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        dailyRevenue: parseFloat(dailyRevenue.toFixed(2))
      }
    })
    
    // Summary
    const totalDailyProfit = analyzed.reduce((sum, a) => sum + a.dailyProfit, 0)
    const totalInvestment = batches.reduce((sum, b) => sum + b.hardwareInvestment, 0)
    const avgMonthlyROI = (totalDailyProfit / totalInvestment) * 100 * 30
    
    return NextResponse.json({
      batches: analyzed,
      summary: {
        totalDailyProfit: parseFloat(totalDailyProfit.toFixed(2)),
        totalMonthlyProfit: parseFloat((totalDailyProfit * 30).toFixed(2)),
        avgMonthlyROI: parseFloat(avgMonthlyROI.toFixed(2)),
        profitable: analyzed.filter(a => a.status === 'profitable').length,
        marginal: analyzed.filter(a => a.status === 'marginal').length,
        unprofitable: analyzed.filter(a => a.status === 'unprofitable').length,
        total: batches.length,
        totalInvestment: parseFloat(totalInvestment.toFixed(2))
      },
      hashprice: {
        current: hashprice.current,
        avg7d: hashprice.avg7d,
        avg30d: hashprice.avg30d
      }
    })
  } catch (error) {
    console.error('Error in profitability/summary:', error)
    return NextResponse.json(
      { 
        error: 'Failed to calculate profitability summary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

