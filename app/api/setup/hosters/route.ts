import { NextRequest, NextResponse } from 'next/server'

// Mock data - À remplacer par une vraie base de données
let hosters = [
  {
    id: 'hoster-001',
    name: 'DataCenter USA',
    company: 'DataCenter LLC',
    location: 'Austin, Texas, USA',
    country: 'USA',
    email: 'john@dc.com',
    phone: '+1 512 555 0123',
    website: 'https://datacenter.com',
    electricityRate: 0.072,
    hostingFee: 25,
    setupFee: 150,
    billingCycle: 'monthly',
    paymentMethods: ['Bank Transfer'],
    maxPower: 500,
    uptimeSLA: 99.5,
    coolingType: 'Air Cooling',
    securityLevel: 'High',
    internetSpeed: 10000,
    backupPower: true,
    monitoring: '24/7',
    contractStart: '2024-01-01',
    contractDuration: 12,
    minimumTerm: 12,
    noticePeriod: 30,
    autoRenew: true,
    specialConditions: 'Premium tier - priority support',
    activeMiners: 8,
    totalHashrate: 880,
    monthlyCost: 5250
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    
    let filteredHosters = [...hosters]
    
    if (country) {
      filteredHosters = filteredHosters.filter(h => h.country === country)
    }
    
    return NextResponse.json({ success: true, data: filteredHosters })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hosters' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newHoster = {
      id: `hoster-${String(hosters.length + 1).padStart(3, '0')}`,
      ...body,
      activeMiners: 0,
      totalHashrate: 0,
      monthlyCost: 0,
      createdAt: new Date().toISOString()
    }
    
    hosters.push(newHoster)
    
    return NextResponse.json({ success: true, data: newHoster }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create hoster' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const index = hosters.findIndex(h => h.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Hoster not found' },
        { status: 404 }
      )
    }
    
    hosters[index] = { ...hosters[index], ...updates, updatedAt: new Date().toISOString() }
    
    return NextResponse.json({ success: true, data: hosters[index] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update hoster' },
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
        { success: false, error: 'Hoster ID required' },
        { status: 400 }
      )
    }
    
    const index = hosters.findIndex(h => h.id === id)
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Hoster not found' },
        { status: 404 }
      )
    }
    
    hosters.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete hoster' },
      { status: 500 }
    )
  }
}

