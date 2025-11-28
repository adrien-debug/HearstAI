import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
    // Vérifier que Prisma est disponible
    if (!prisma) {
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const contact = await (prisma as any).businessDevContact.findUnique({
      where: { id: params.id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ contact })
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
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    // }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { name, company, email, phone, status, estimatedValue, notes, lastContact } = body

    // Vérifier que le contact existe
    const existing = await (prisma as any).businessDevContact.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    // Validation email si fourni
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        )
      }

      // Vérifier si l'email est déjà utilisé par un autre contact
      const emailExists = await (prisma as any).businessDevContact.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre contact' },
          { status: 409 }
        )
      }
    }

    // Validation du statut si fourni
    if (status && !['active', 'pending', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Construire les données à mettre à jour
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (company !== undefined) updateData.company = company.trim()
    if (email !== undefined) updateData.email = email.toLowerCase().trim()
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (status !== undefined) updateData.status = status
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue?.trim() || null
    if (notes !== undefined) updateData.notes = notes?.trim() || null
    if (lastContact !== undefined) updateData.lastContact = new Date(lastContact)

    // Mettre à jour le contact
    const contact = await (prisma as any).businessDevContact.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ contact })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur PUT:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

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
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    // }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const { id } = params

    // Vérifier que le contact existe
    const existing = await (prisma as any).businessDevContact.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le contact
    await (prisma as any).businessDevContact.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Contact supprimé avec succès',
      id 
    })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur DELETE:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact', details: error.message },
      { status: 500 }
    )
  }
}

