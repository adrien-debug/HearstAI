import { NextRequest, NextResponse } from 'next/server'
import { hostersStorage } from '@/lib/datas-storage'

/**
 * API Routes pour un Hoster spécifique
 * GET /api/datas/hosters/[id] - Récupère un hoster
 * PUT /api/datas/hosters/[id] - Met à jour un hoster
 * DELETE /api/datas/hosters/[id] - Supprime un hoster
 */

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hoster = hostersStorage.getById(params.id)
    
    if (!hoster) {
      return NextResponse.json(
        { success: false, error: 'Hoster not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: hoster })
  } catch (error: any) {
    console.error('Error fetching hoster:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch hoster' },
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
    
    // Parser les nombres si fournis
    const updates: any = { ...body }
    if (body.electricityPrice !== undefined) {
      updates.electricityPrice = parseFloat(body.electricityPrice)
    }
    if (body.additionalFees !== undefined) {
      updates.additionalFees = parseFloat(body.additionalFees)
    }
    if (body.deposit !== undefined) {
      updates.deposit = parseFloat(body.deposit)
    }
    
    const updatedHoster = hostersStorage.update(params.id, updates)
    
    if (!updatedHoster) {
      return NextResponse.json(
        { success: false, error: 'Hoster not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: updatedHoster })
  } catch (error: any) {
    console.error('Error updating hoster:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update hoster' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = hostersStorage.delete(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Hoster not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Hoster deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting hoster:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete hoster' },
      { status: 500 }
    )
  }
}

