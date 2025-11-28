import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('[API Business Dev Contacts] Prisma client est undefined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible', contacts: [] },
        { status: 200 } // Retourner 200 avec tableau vide pour ne pas casser le frontend
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // active, pending, inactive
    const search = searchParams.get('search') // Recherche par nom, email, company
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construire les filtres
    const where: any = {}
    
    if (status && ['active', 'pending', 'inactive'].includes(status)) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Récupérer les contacts
    const [contacts, total] = await Promise.all([
      (prisma as any).businessDevContact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      (prisma as any).businessDevContact.count({ where }),
    ])

    return NextResponse.json({
      contacts: contacts || [],
      count: contacts?.length || 0,
      total: total || 0,
      limit,
      offset,
    })
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

    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('[API Business Dev Contacts] Prisma client est undefined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, company, email, phone, status, estimatedValue, notes } = body

    // Validation des champs requis
    if (!name || !company || !email) {
      return NextResponse.json(
        { error: 'Le nom, l\'entreprise et l\'email sont requis' },
        { status: 400 }
      )
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du statut
    if (status && !['active', 'pending', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide (doit être: active, pending ou inactive)' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà (optionnel - selon vos besoins)
    const existing = await (prisma as any).businessDevContact.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Un contact avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Créer le contact
    const contact = await (prisma as any).businessDevContact.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        status: status || 'pending',
        estimatedValue: estimatedValue?.trim() || null,
        notes: notes?.trim() || null,
        lastContact: new Date(),
        // userId: session.user.id, // Si vous voulez lier au user
      }
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur POST:', error)
    console.error('[API Business Dev Contacts] Stack:', error.stack)
    
    // Messages d'erreur détaillés
    let errorMessage = 'Erreur lors de la création du contact'
    let errorDetails = error.message
    
    if (error.code === 'P2002') {
      errorMessage = 'Un contact avec cet email existe déjà'
      errorDetails = 'Email déjà enregistré'
    } else if (error.code === 'P2003') {
      errorMessage = 'Erreur de référence'
      errorDetails = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: error.code === 'P2002' ? 409 : 500 }
    )
  }
}

