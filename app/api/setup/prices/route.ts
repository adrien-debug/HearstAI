import { NextRequest, NextResponse } from 'next/server'

// Mock data - À remplacer par une vraie base de données ou API externe
let prices = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    value: 85000.00,
    change24h: 2.5,
    source: 'CoinGecko',
    lastUpdated: new Date().toISOString()
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    value: 3200.00,
    change24h: 1.8,
    source: 'CoinGecko',
    lastUpdated: new Date().toISOString()
  }
]

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    let filteredPrices = [...prices]
    
    if (symbol) {
      filteredPrices = filteredPrices.filter(p => p.symbol === symbol.toUpperCase())
    }
    
    return NextResponse.json({ success: true, data: filteredPrices })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const existingIndex = prices.findIndex(p => p.symbol === body.symbol?.toUpperCase())
    
    if (existingIndex !== -1) {
      // Update existing
      prices[existingIndex] = {
        ...prices[existingIndex],
        ...body,
        lastUpdated: new Date().toISOString()
      }
      return NextResponse.json({ success: true, data: prices[existingIndex] })
    } else {
      // Create new
      const newPrice = {
        ...body,
        symbol: body.symbol?.toUpperCase(),
        lastUpdated: new Date().toISOString()
      }
      prices.push(newPrice)
      return NextResponse.json({ success: true, data: newPrice }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create/update price' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbol, ...updates } = body
    
    const index = prices.findIndex(p => p.symbol === symbol?.toUpperCase())
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Price not found' },
        { status: 404 }
      )
    }
    
    prices[index] = {
      ...prices[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json({ success: true, data: prices[index] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update price' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol required' },
        { status: 400 }
      )
    }
    
    const index = prices.findIndex(p => p.symbol === symbol.toUpperCase())
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Price not found' },
        { status: 404 }
      )
    }
    
    prices.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete price' },
      { status: 500 }
    )
  }
}

