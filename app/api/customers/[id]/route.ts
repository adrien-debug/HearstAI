import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API Route pour gérer un customer spécifique
 * 
 * GET /api/customers/:id - Récupère un customer
 * PUT /api/customers/:id - Met à jour un customer
 * DELETE /api/customers/:id - Supprime un customer
 */

// GET - Récupère un customer
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // En développement, permettre l'accès sans authentification
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const customer = await (prisma as any).customer.findUnique({
      where: { id: params.id }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ customer })
  } catch (error: any) {
    console.error('[API Customers] Erreur GET:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du customer', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Met à jour un customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // En développement, permettre l'accès sans authentification
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await request.json()
    const { name, erc20Address, tag, chains, protocols } = body

    // Validation adresse ERC20 si fournie
    if (erc20Address) {
      const erc20Regex = /^0x[a-fA-F0-9]{40}$/
      if (!erc20Regex.test(erc20Address)) {
        return NextResponse.json(
          { error: 'Format d\'adresse ERC20 invalide' },
          { status: 400 }
        )
      }

      // Vérifier si l'adresse existe déjà pour un autre customer
      const existing = await (prisma as any).customer.findFirst({
        where: {
          erc20Address: erc20Address.toLowerCase(),
          NOT: { id: params.id }
        }
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Cette adresse ERC20 est déjà utilisée par un autre customer' },
          { status: 409 }
        )
      }
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (erc20Address) updateData.erc20Address = erc20Address.toLowerCase()
    if (tag) updateData.tag = tag
    if (chains) updateData.chains = JSON.stringify(chains)
    if (protocols) updateData.protocols = JSON.stringify(protocols)

    const customer = await (prisma as any).customer.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ customer })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer non trouvé' },
        { status: 404 }
      )
    }
    console.error('[API Customers] Erreur PUT:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du customer', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprime un customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // En développement, permettre l'accès sans authentification
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    await (prisma as any).customer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer non trouvé' },
        { status: 404 }
      )
    }
    console.error('[API Customers] Erreur DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du customer', details: error.message },
      { status: 500 }
    )
  }
}

