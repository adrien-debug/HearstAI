import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fireblocksClient } from '@/lib/fireblocks/fireblocks-client'
import {
  associateVaultToCustomer,
  associateWalletToCustomer,
  getCustomerFireblocksInfo,
  listAvailableVaults,
  listAvailableWallets,
} from '@/lib/fireblocks-customer'

/**
 * API Route pour gérer la connexion Fireblocks d'un customer
 * 
 * GET /api/customers/[id]/fireblocks - Récupère les infos Fireblocks du customer
 * POST /api/customers/[id]/fireblocks - Associe un vault/wallet au customer
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id

    // Vérifier que le customer existe
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les infos Fireblocks
    const fireblocksInfo = await getCustomerFireblocksInfo(customerId)

    // Si Fireblocks n'est pas configuré, retourner juste les IDs
    if (!fireblocksClient.isConfigured()) {
      return NextResponse.json({
        configured: false,
        message: 'Fireblocks API non configurée',
        vaultId: customer.fireblocksVaultId,
        walletId: customer.fireblocksWalletId,
      })
    }

    // Liste des vaults/wallets disponibles pour association
    const availableVaults = await listAvailableVaults()
    const availableWallets = await listAvailableWallets()

    return NextResponse.json({
      configured: true,
      customer: {
        id: customer.id,
        name: customer.name,
        erc20Address: customer.erc20Address,
      },
      fireblocks: fireblocksInfo,
      available: {
        vaults: availableVaults.map(v => ({
          id: v.id,
          name: v.name,
          assets: v.assets?.map(a => ({
            id: a.id,
            total: a.total,
            available: a.available,
          })),
        })),
        wallets: availableWallets.map(w => ({
          id: w.id,
          name: w.name,
          assets: w.assets?.map(a => ({
            id: a.id,
            address: a.address,
            status: a.status,
          })),
        })),
      },
    })
  } catch (error: any) {
    console.error('[API Customer Fireblocks] Erreur GET:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des infos Fireblocks',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id
    const body = await request.json()
    const { vaultId, walletId } = body

    // Vérifier que le customer existe
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer non trouvé' },
        { status: 404 }
      )
    }

    if (!fireblocksClient.isConfigured()) {
      return NextResponse.json(
        {
          error: 'Fireblocks API non configurée',
          message: 'Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY',
        },
        { status: 503 }
      )
    }

    // Associer vault si fourni
    if (vaultId) {
      await associateVaultToCustomer(customerId, vaultId)
    }

    // Associer wallet si fourni
    if (walletId) {
      await associateWalletToCustomer(customerId, walletId)
    }

    // Récupérer les infos mises à jour
    const fireblocksInfo = await getCustomerFireblocksInfo(customerId)

    return NextResponse.json({
      success: true,
      message: 'Association Fireblocks mise à jour',
      fireblocks: fireblocksInfo,
    })
  } catch (error: any) {
    console.error('[API Customer Fireblocks] Erreur POST:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'association Fireblocks',
        details: error.message,
      },
      { status: 500 }
    )
  }
}





