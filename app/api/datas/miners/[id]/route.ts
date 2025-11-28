import { NextRequest, NextResponse } from 'next/server'
import { minersStorage } from '@/lib/datas-storage'

/**
 * API Routes pour un Miner spécifique
 * GET /api/datas/miners/[id] - Récupère un miner
 * PUT /api/datas/miners/[id] - Met à jour un miner
 * DELETE /api/datas/miners/[id] - Supprime un miner
 */

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const miner = minersStorage.getById(params.id)
    
    if (!miner) {
      return NextResponse.json(
        { success: false, error: 'Miner not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: miner })
  } catch (error: any) {
    console.error('Error fetching miner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch miner' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Calculer l'efficacité si nécessaire
    if (body.power && body.hashrate && !body.efficiency) {
      body.efficiency = body.power / body.hashrate
    }
    
    const updatedMiner = minersStorage.update(params.id, body)
    
    if (!updatedMiner) {
      return NextResponse.json(
        { success: false, error: 'Miner not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: updatedMiner })
  } catch (error: any) {
    console.error('Error updating miner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update miner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = minersStorage.delete(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Miner not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Miner deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting miner:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete miner' },
      { status: 500 }
    )
  }
}

