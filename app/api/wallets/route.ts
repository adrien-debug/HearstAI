import { NextRequest, NextResponse } from 'next/server'

// Mock data - À remplacer par une vraie base de données
let wallets = {
  source: [
    {
      id: 'wallet-001',
      name: 'Main Mining Wallet',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      type: 'source',
      balance: 2.5000,
      currency: 'BTC',
      network: 'Bitcoin Mainnet',
      enabled: true
    }
  ],
  destination: [
    {
      id: 'wallet-101',
      name: 'Cold Storage Vault',
      address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
      type: 'destination',
      network: 'Bitcoin Mainnet',
      enabled: true
    }
  ]
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'source') {
      return NextResponse.json({ success: true, data: wallets.source })
    } else if (type === 'destination') {
      return NextResponse.json({ success: true, data: wallets.destination })
    }
    
    return NextResponse.json({ success: true, data: wallets })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wallets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...walletData } = body
    
    const newWallet = {
      id: `wallet-${type === 'source' ? String(wallets.source.length + 1).padStart(3, '0') : String(wallets.destination.length + 1).padStart(3, '0')}`,
      type,
      currency: 'BTC',
      network: 'Bitcoin Mainnet',
      enabled: true,
      ...walletData,
      createdAt: new Date().toISOString()
    }
    
    if (type === 'source') {
      wallets.source.push(newWallet)
    } else {
      wallets.destination.push(newWallet)
    }
    
    return NextResponse.json({ success: true, data: newWallet }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create wallet' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, type, ...updates } = body
    
    if (type === 'source') {
      const index = wallets.source.findIndex(w => w.id === id)
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Wallet not found' },
          { status: 404 }
        )
      }
      wallets.source[index] = {
        ...wallets.source[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return NextResponse.json({ success: true, data: wallets.source[index] })
    } else {
      const index = wallets.destination.findIndex(w => w.id === id)
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Wallet not found' },
          { status: 404 }
        )
      }
      wallets.destination[index] = {
        ...wallets.destination[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return NextResponse.json({ success: true, data: wallets.destination[index] })
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update wallet' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    
    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'Wallet ID and type required' },
        { status: 400 }
      )
    }
    
    if (type === 'source') {
      const index = wallets.source.findIndex(w => w.id === id)
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Wallet not found' },
          { status: 404 }
        )
      }
      wallets.source.splice(index, 1)
    } else {
      const index = wallets.destination.findIndex(w => w.id === id)
      if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Wallet not found' },
          { status: 404 }
        )
      }
      wallets.destination.splice(index, 1)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete wallet' },
      { status: 500 }
    )
  }
}

