import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildCollateralClientFromDeBank } from '@/lib/debank'

/**
 * API Route pour gérer les customers (clients avec adresses ERC20)
 * Utilise l'API DeBank pour récupérer les données réelles
 * 
 * GET /api/customers - Liste tous les customers avec leurs données DeBank
 * POST /api/customers - Crée un nouveau customer
 * PUT /api/customers/:id - Met à jour un customer
 * DELETE /api/customers/:id - Supprime un customer
 */

// Wallets par défaut pour les tests (peuvent être remplacés par une base de données)
const DEFAULT_WALLETS = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
]

// GET - Liste tous les customers avec leurs données DeBank
export async function GET(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions)
    
    // Récupérer les wallets depuis les query params ou utiliser les defaults
    const { searchParams } = new URL(request.url)
    const walletsParam = searchParams.get('wallets')
    const wallets = walletsParam 
      ? walletsParam.split(',').map(w => w.trim()).filter(Boolean)
      : DEFAULT_WALLETS

    if (wallets.length === 0) {
      return NextResponse.json({ customers: [] })
    }

    // Récupérer les données DeBank pour chaque wallet
    const customersData = await Promise.all(
      wallets.map(async (wallet, index) => {
        try {
          // Récupérer les données collatérales depuis DeBank
          const collateralClient = await buildCollateralClientFromDeBank(wallet, {
            tag: 'Client',
            chains: ['eth'],
            allowedProtocols: [],
          })

          // Construire l'objet customer avec les données DeBank
          return {
            id: index + 1,
            name: collateralClient.name || `Client ${wallet.substring(0, 8)}...`,
            erc20Address: wallet,
            tag: collateralClient.tag || 'Client',
            totalValue: collateralClient.totalValue || 0,
            totalDebt: collateralClient.totalDebt || 0,
            healthFactor: collateralClient.healthFactor || 0,
            positions: collateralClient.positions || [],
            lastUpdate: collateralClient.lastUpdate || new Date().toISOString(),
            // Données supplémentaires pour compatibilité
            email: null,
            btcWallet: null,
            positionValue: collateralClient.totalValue || 0,
            status: collateralClient.healthFactor > 1.5 ? 'active' : 'warning',
          }
        } catch (error: any) {
          console.warn(`[API Customers] Erreur pour wallet ${wallet}:`, error.message)
          // Retourner un customer avec données minimales en cas d'erreur
          return {
            id: index + 1,
            name: `Client ${wallet.substring(0, 8)}...`,
            erc20Address: wallet,
            tag: 'Client',
            totalValue: 0,
            totalDebt: 0,
            healthFactor: 0,
            positions: [],
            lastUpdate: new Date().toISOString(),
            email: null,
            btcWallet: null,
            positionValue: 0,
            status: 'unknown',
            error: error.message,
          }
        }
      })
    )

    return NextResponse.json({ 
      customers: customersData,
      count: customersData.length,
      source: 'debank',
    })
  } catch (error: any) {
    console.error('[API Customers] Erreur GET:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des customers', 
        details: error.message,
        customers: [] // Retourner un tableau vide au lieu d'une erreur 500
      },
      { status: 200 } // Retourner 200 avec un tableau vide pour ne pas casser le frontend
    )
  }
}

// POST - Crée un nouveau customer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      // Retourner une erreur soft si pas de session (ne pas bloquer l'UI)
      return NextResponse.json({ 
        error: 'Authentification requise',
        message: 'Vous devez être connecté pour créer un customer'
      }, { status: 401 })
    }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('[API Customers] Prisma client est undefined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    // Vérifier que le modèle Customer existe (vérification dynamique pour éviter les erreurs TypeScript)
    const prismaAny = prisma as any
    if (!prismaAny.customer) {
      console.error('[API Customers] Prisma.customer est undefined - le modèle Customer n\'existe pas dans le client généré')
      console.error('[API Customers] Modèles disponibles:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')))
      console.error('[API Customers] Type de prisma:', typeof prisma)
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Le modèle Customer n\'est pas disponible. Veuillez redémarrer le serveur après avoir exécuté: npx prisma generate' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, erc20Address, tag, chains, protocols } = body

    // Validation
    if (!name || !erc20Address) {
      return NextResponse.json(
        { error: 'Le nom et l\'adresse ERC20 sont requis' },
        { status: 400 }
      )
    }

    // Validation format adresse ERC20 (0x suivi de 40 caractères hexadécimaux)
    const erc20Regex = /^0x[a-fA-F0-9]{40}$/
    if (!erc20Regex.test(erc20Address)) {
      return NextResponse.json(
        { error: 'Format d\'adresse ERC20 invalide (doit commencer par 0x et contenir 40 caractères hexadécimaux)' },
        { status: 400 }
      )
    }

    // Vérifier si l'adresse existe déjà
    const existing = await (prisma as any).customer.findFirst({
      where: { erc20Address: erc20Address.toLowerCase() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Cette adresse ERC20 est déjà enregistrée' },
        { status: 409 }
      )
    }

    // Créer le customer
    const customer = await (prisma as any).customer.create({
      data: {
        name,
        erc20Address: erc20Address.toLowerCase(),
        tag: tag || 'Client',
        chains: JSON.stringify(chains || ['eth']),
        protocols: JSON.stringify(protocols || []),
      }
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error: any) {
    console.error('[API Customers] Erreur POST:', error)
    console.error('[API Customers] Stack:', error.stack)
    console.error('[API Customers] Prisma disponible:', !!prisma)
    console.error('[API Customers] Prisma.customer disponible:', !!(prisma && 'customer' in prisma))
    
    // Messages d'erreur plus détaillés selon le type d'erreur
    let errorMessage = 'Erreur lors de la création du customer'
    let errorDetails = error.message
    
    if (error.message?.includes('Cannot read properties of undefined') || error.message?.includes('findFirst')) {
      errorMessage = 'Erreur de configuration serveur'
      errorDetails = 'Le client Prisma n\'est pas correctement initialisé. Veuillez redémarrer le serveur.'
    } else if (error.code === 'P2002') {
      errorMessage = 'Cette adresse ERC20 est déjà enregistrée'
      errorDetails = 'Un customer avec cette adresse existe déjà'
    } else if (error.code === 'P2003') {
      errorMessage = 'Erreur de référence'
      errorDetails = error.message
    } else if (error.message?.includes('Unique constraint')) {
      errorMessage = 'Cette adresse ERC20 est déjà enregistrée'
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

