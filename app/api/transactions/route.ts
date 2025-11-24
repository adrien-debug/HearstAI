import { NextRequest, NextResponse } from 'next/server'

// Mock data - À remplacer par une vraie base de données
let transactions = [
  {
    id: 'TX-2024-001',
    date: '2024-11-22T14:30:00Z',
    timestamp: 1732282200000,
    from: {
      walletId: 'wallet-001',
      name: 'Main Mining Wallet',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    to: {
      walletId: 'wallet-101',
      name: 'Cold Storage Vault',
      address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy'
    },
    amount: 0.5000,
    currency: 'BTC',
    amountUSD: 42500.00,
    fee: 0.0001,
    total: 0.5001,
    status: 'pending',
    notes: 'Weekly automatic transfer to cold storage',
    period: 'weekly',
    validated: false,
    validatedAt: null,
    txHash: null
  },
  {
    id: 'TX-2024-002',
    date: '2024-11-22T09:15:00Z',
    timestamp: 1732263300000,
    from: {
      walletId: 'wallet-001',
      name: 'Main Mining Wallet',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    to: {
      walletId: 'wallet-102',
      name: 'Exchange Wallet',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    amount: 0.2500,
    currency: 'BTC',
    amountUSD: 21250.00,
    fee: 0.00008,
    total: 0.25008,
    status: 'validated',
    notes: 'Daily operations transfer',
    period: 'daily',
    validated: true,
    validatedAt: '2024-11-22T09:20:00Z',
    txHash: 'a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d'
  },
  {
    id: 'TX-2024-003',
    date: '2024-11-21T18:00:00Z',
    timestamp: 1732208400000,
    from: {
      walletId: 'wallet-002',
      name: 'Secondary Wallet',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
    },
    to: {
      walletId: 'wallet-101',
      name: 'Cold Storage Vault',
      address: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy'
    },
    amount: 1.0000,
    currency: 'BTC',
    amountUSD: 85000.00,
    fee: 0.00012,
    total: 1.00012,
    status: 'validated',
    notes: 'Monthly consolidation transfer',
    period: 'monthly',
    validated: true,
    validatedAt: '2024-11-21T18:05:00Z',
    txHash: 'b2186ec55e527d4ca288g66c7195f3226c0456f27d6dg413gd91fa6egcg6e59e'
  },
  {
    id: 'TX-2024-004',
    date: '2024-11-22T12:00:00Z',
    timestamp: 1732273200000,
    from: {
      walletId: 'wallet-001',
      name: 'Main Mining Wallet',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    to: {
      walletId: 'wallet-103',
      name: 'Payment Processor',
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5'
    },
    amount: 0.1500,
    currency: 'BTC',
    amountUSD: 12750.00,
    fee: 0.00006,
    total: 0.15006,
    status: 'pending',
    notes: 'Supplier payment',
    period: 'daily',
    validated: false,
    validatedAt: null,
    txHash: null
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const period = searchParams.get('period')
    
    let filtered = [...transactions]
    
    if (status && status !== 'all') {
      filtered = filtered.filter(tx => tx.status === status)
    }
    
    if (period && period !== 'all') {
      const now = new Date()
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date)
        switch (period) {
          case 'daily':
            return txDate.toDateString() === now.toDateString()
          case 'weekly':
            const weekAgo = new Date(now)
            weekAgo.setDate(now.getDate() - 7)
            return txDate >= weekAgo && txDate <= now
          case 'monthly':
            return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
          default:
            return true
        }
      })
    }
    
    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newTx = {
      id: `TX-2024-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    transactions.push(newTx)
    
    return NextResponse.json({ success: true, data: newTx }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const index = transactions.findIndex(tx => tx.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({ success: true, data: transactions[index] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
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
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      )
    }
    
    const index = transactions.findIndex(tx => tx.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    transactions.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

