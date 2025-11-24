import { NextRequest, NextResponse } from 'next/server'

// Mock data - À remplacer par une vraie base de données
let miners = [
  {
    id: 'miner-001',
    model: 'Antminer S19 Pro',
    serial: 'AS19P-001-2024',
    hashrate: 110,
    power: 3250,
    efficiency: 29.5,
    status: 'active',
    hosterName: 'DataCenter USA',
    hosterId: 'hoster-001',
    purchasePrice: 4500,
    purchaseDate: '2023-12-01',
    startDate: '2024-01-15',
    contractEnd: '2025-01-15',
    rackPosition: 'A1-R03-U15',
    monitoringUrl: 'http://monitor.datacenter.com/miner001',
    apiKey: 'abc123xyz456def789',
    notes: 'Primary production unit - high priority'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const hosterId = searchParams.get('hosterId')
    
    let filteredMiners = [...miners]
    
    if (status) {
      filteredMiners = filteredMiners.filter(m => m.status === status)
    }
    
    if (hosterId) {
      filteredMiners = filteredMiners.filter(m => m.hosterId === hosterId)
    }
    
    return NextResponse.json({ success: true, data: filteredMiners })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch miners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newMiner = {
      id: `miner-${String(miners.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString()
    }
    
    miners.push(newMiner)
    
    return NextResponse.json({ success: true, data: newMiner }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create miner' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const index = miners.findIndex(m => m.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Miner not found' },
        { status: 404 }
      )
    }
    
    miners[index] = { ...miners[index], ...updates, updatedAt: new Date().toISOString() }
    
    return NextResponse.json({ success: true, data: miners[index] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update miner' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Miner ID required' },
        { status: 400 }
      )
    }
    
    const index = miners.findIndex(m => m.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Miner not found' },
        { status: 404 }
      )
    }
    
    miners.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete miner' },
      { status: 500 }
    )
  }
}

