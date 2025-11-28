import { NextRequest, NextResponse } from 'next/server'
import { hostersStorage } from '@/lib/datas-storage'

/**
 * API Routes pour les Hosters de la section Data
 * GET /api/datas/hosters - Liste tous les hosters
 * POST /api/datas/hosters - Crée un nouveau hoster
 */

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    
    const hosters = hostersStorage.getAll({ 
      country: country || undefined 
    })
    
    return NextResponse.json({ 
      success: true, 
      data: hosters,
      total: hosters.length
    })
  } catch (error: any) {
    console.error('Error fetching hosters:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch hosters' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.country || !body.location || 
        body.electricityPrice === undefined || 
        body.additionalFees === undefined || 
        body.deposit === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, country, location, electricityPrice, additionalFees, deposit' 
        },
        { status: 400 }
      )
    }
    
    const newHoster = hostersStorage.create({
      name: body.name,
      country: body.country,
      location: body.location,
      electricityPrice: parseFloat(body.electricityPrice),
      additionalFees: parseFloat(body.additionalFees),
      deposit: parseFloat(body.deposit),
      photo: body.photo || null,
      notes: body.notes || ''
    })
    
    return NextResponse.json({ 
      success: true, 
      data: newHoster 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating hoster:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create hoster' },
      { status: 500 }
    )
  }
}

