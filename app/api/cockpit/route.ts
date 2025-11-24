import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Données mockées réalistes pour le cockpit
    return NextResponse.json({
      data: {
        globalHashrate: 245.8, // PH/s
        theoreticalHashrate: 250.0, // PH/s
        btcProduction24h: 0.084521,
        btcProduction7d: 0.591647,
        totalMiners: 124,
        onlineMiners: 118,
        degradedMiners: 4,
        offlineMiners: 2,
        totalWorkers: 342,
        activeWorkers: 328,
        totalRevenue: 2450000, // USD
        electricityCost: 125000, // USD
        profit: 2325000, // USD
        miningAccounts: [
          { id: '1', name: 'AKT04', hashrate: 2041.42, btc24h: 0.084521, status: 'active' },
          { id: '2', name: 'AKT05', hashrate: 1987.23, btc24h: 0.082156, status: 'active' },
          { id: '3', name: 'AKT06', hashrate: 2156.78, btc24h: 0.089234, status: 'active' },
        ],
        workers: [
          { id: '1', name: 'Worker-001', hashrate: 98.5, status: 'online', miner: 'Antminer S21' },
          { id: '2', name: 'Worker-002', hashrate: 97.2, status: 'online', miner: 'Antminer S21' },
          { id: '3', name: 'Worker-003', hashrate: 0, status: 'offline', miner: 'Antminer S19' },
        ],
        miners: [
          { id: '1', model: 'Antminer S21', count: 45, hashrate: 98.5, status: 'active' },
          { id: '2', model: 'Antminer S19 Pro', count: 38, hashrate: 110.0, status: 'active' },
          { id: '3', model: 'Antminer S19', count: 41, hashrate: 95.0, status: 'degraded' },
        ],
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

