import { NextRequest, NextResponse } from 'next/server'
import { minersStorage } from '@/lib/datas-storage'

/**
 * API Routes pour les Miners de la section Data
 * GET /api/datas/miners - Liste tous les miners
 * POST /api/datas/miners - Crée un nouveau miner
 */

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coolingType = searchParams.get('coolingType')
    
    const miners = minersStorage.getAll({ 
      coolingType: coolingType || undefined 
    })
    
    return NextResponse.json({ 
      success: true, 
      data: miners,
      total: miners.length
    })
  } catch (error: any) {
    console.error('Error fetching miners:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch miners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.hashrate || !body.power || !body.price || !body.coolingType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, hashrate, power, price, coolingType' 
        },
        { status: 400 }
      )
    }
    
    // Calculer l'efficacité si non fournie
    const efficiency = body.efficiency || (body.power / body.hashrate)
    
    const newMiner = minersStorage.create({
      name: body.name,
      hashrate: parseFloat(body.hashrate),
      power: parseFloat(body.power),
      efficiency: efficiency,
      price: parseFloat(body.price),
      coolingType: body.coolingType,
      manufacturer: body.manufacturer || '',
      model: body.model || '',
      releaseDate: body.releaseDate || '',
      photo: body.photo || null,
      notes: body.notes || ''
    })
    
    return NextResponse.json({ 
      success: true, 
      data: newMiner 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating miner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create miner' },
      { status: 500 }
    )
  }
}

