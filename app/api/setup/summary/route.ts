import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les données depuis les autres endpoints
    const minersRes = await fetch(`${request.nextUrl.origin}/api/setup/miners`)
    const hostersRes = await fetch(`${request.nextUrl.origin}/api/setup/hosters`)
    const pricesRes = await fetch(`${request.nextUrl.origin}/api/setup/prices`)
    
    const minersData = await minersRes.json()
    const hostersData = await hostersRes.json()
    const pricesData = await pricesRes.json()
    
    const miners = minersData.data || []
    const hosters = hostersData.data || []
    const prices = pricesData.data || []
    
    // Calculs
    const totalMiners = miners.length
    const activeMiners = miners.filter((m: any) => m.status === 'active').length
    const totalHashrate = miners.reduce((sum: number, m: any) => sum + m.hashrate, 0) / 1000
    const totalPower = miners.reduce((sum: number, m: any) => sum + m.power, 0) / 1000
    
    // Coûts
    const totalElectricity = miners.reduce((sum: number, m: any) => {
      const hoster = hosters.find((h: any) => h.id === m.hosterId)
      return sum + (m.power / 1000 * (hoster?.electricityRate || 0.085) * 24 * 30)
    }, 0)
    
    const totalHostingFees = miners.reduce((sum: number, m: any) => {
      const hoster = hosters.find((h: any) => h.id === m.hosterId)
      return sum + (hoster?.hostingFee || 0)
    }, 0)
    
    const totalOpEx = totalElectricity + totalHostingFees
    
    // Revenue estimé
    const btcPrice = prices.find((p: any) => p.symbol === 'BTC')?.value || 85000
    const expectedRevenue = totalHashrate * 1000 * 0.00000001 * btcPrice * 30
    const netProfit = expectedRevenue - totalOpEx
    const roi = totalOpEx > 0 ? (netProfit / totalOpEx) * 100 : 0
    
    // Distribution par hoster
    const deploymentByHoster = hosters.map((hoster: any) => {
      const hosterMiners = miners.filter((m: any) => m.hosterId === hoster.id)
      return {
        hosterId: hoster.id,
        hosterName: hoster.name,
        minerCount: hosterMiners.length,
        percentage: totalMiners > 0 ? (hosterMiners.length / totalMiners) * 100 : 0
      }
    })
    
    // Distribution par modèle
    const hashrateByModel = miners.reduce((acc: any, m: any) => {
      if (!acc[m.model]) {
        acc[m.model] = 0
      }
      acc[m.model] += m.hashrate
      return acc
    }, {})
    
    const summary = {
      stats: {
        totalMiners,
        activeMiners,
        totalHashrate: totalHashrate.toFixed(2),
        totalPower: totalPower.toFixed(2)
      },
      costs: {
        electricity: totalElectricity.toFixed(2),
        hostingFees: totalHostingFees.toFixed(2),
        totalOpEx: totalOpEx.toFixed(2)
      },
      revenue: {
        expectedRevenue: expectedRevenue.toFixed(2),
        netProfit: netProfit.toFixed(2),
        roi: roi.toFixed(1)
      },
      deployment: {
        byHoster: deploymentByHoster,
        byModel: Object.entries(hashrateByModel).map(([model, hashrate]: [string, any]) => ({
          model,
          hashrate: (hashrate / 1000).toFixed(2)
        }))
      },
      configuration: {
        minersConfigured: totalMiners,
        pricesUpdated: prices.length > 0,
        hostersConfigured: hosters.length,
        contractsValid: miners.filter((m: any) => new Date(m.contractEnd) > new Date()).length,
        monitoringOnline: activeMiners
      }
    }
    
    return NextResponse.json({ success: true, data: summary })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}

