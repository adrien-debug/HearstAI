import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// URL du backend - Local par défaut, Railway en production
// Si NEXT_PUBLIC_API_URL n'est pas défini, utiliser le backend local
const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return process.env.BACKEND_URL || 'http://localhost:4000'
}
const RAILWAY_API_URL = getBackendUrl()

/**
 * API Route pour gérer les contacts Business Development
 * 
 * GET /api/business-dev/contacts - Liste tous les contacts
 * POST /api/business-dev/contacts - Crée un nouveau contact
 */

export const dynamic = 'force-dynamic'

// GET - Liste tous les contacts avec filtres optionnels
export async function GET(request: NextRequest) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ 
    //     error: 'Authentification requise' 
    //   }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') || '100'
    const offset = searchParams.get('offset') || '0'

    // Construire l'URL avec les paramètres de requête
    const queryParams = new URLSearchParams()
    if (status) queryParams.append('status', status)
    if (search) queryParams.append('search', search)
    queryParams.append('limit', limit)
    queryParams.append('offset', offset)

    // Appeler le backend Railway
    const response = await fetch(`${RAILWAY_API_URL}/api/business-dev/contacts?${queryParams.toString()}`)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur lors de la récupération des contacts' }))
      return NextResponse.json(
        { 
          error: error.error || 'Erreur lors de la récupération des contacts',
          details: error.details,
          contacts: []
        },
        { status: 200 } // Retourner 200 avec tableau vide pour ne pas casser le frontend
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur GET:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des contacts',
        details: error.message,
        contacts: []
      },
      { status: 200 } // Retourner 200 avec tableau vide pour ne pas casser le frontend
    )
  }
}

// POST - Crée un nouveau contact
export async function POST(request: NextRequest) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ 
    //     error: 'Authentification requise' 
    //   }, { status: 401 })
    // }

    const body = await request.json()

    // Appeler le backend Railway
    const response = await fetch(`${RAILWAY_API_URL}/api/business-dev/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur lors de la création du contact' }))
      return NextResponse.json(
        { 
          error: error.error || 'Erreur lors de la création du contact',
          details: error.details
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur POST:', error)
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création du contact',
        details: error.message || 'Erreur de connexion au backend Railway'
      },
      { status: 500 }
    )
  }
}

