import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// URL du backend Railway
const RAILWAY_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'https://hearstaibackend-production.up.railway.app'

/**
 * API Route pour gérer un contact Business Development spécifique
 * 
 * GET /api/business-dev/contacts/[id] - Récupère un contact
 * PUT /api/business-dev/contacts/[id] - Met à jour un contact
 * DELETE /api/business-dev/contacts/[id] - Supprime un contact
 */

export const dynamic = 'force-dynamic'

// GET - Récupère un contact par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${RAILWAY_API_URL}/api/business-dev/contacts/${params.id}`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Contact non trouvé' }))
      return NextResponse.json(
        { error: error.error || 'Contact non trouvé' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur GET [id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contact', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Met à jour un contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const response = await fetch(`${RAILWAY_API_URL}/api/business-dev/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur lors de la mise à jour du contact' }))
      return NextResponse.json(
        { error: error.error || 'Erreur lors de la mise à jour du contact', details: error.details },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur PUT:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contact', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprime un contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const response = await fetch(`${RAILWAY_API_URL}/api/business-dev/contacts/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur lors de la suppression du contact' }))
      return NextResponse.json(
        { error: error.error || 'Erreur lors de la suppression du contact', details: error.details },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact', details: error.message },
      { status: 500 }
    )
  }
}

