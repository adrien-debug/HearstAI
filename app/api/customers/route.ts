import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildCollateralClientFromDeBank } from '@/lib/debank'
import { prisma } from '@/lib/db'

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags: [customers]
 *     summary: Get all customers with DeBank data
 *     description: Retrieve all customers from the database with real-time DeBank data
 *     parameters:
 *       - in: query
 *         name: refresh
 *         schema:
 *           type: boolean
 *         description: Force refresh from DeBank API
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 count:
 *                   type: number
 *                 source:
 *                   type: string
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions)
    
    const { searchParams } = new URL(request.url)
    const refresh = searchParams.get('refresh') === 'true' // Force refresh depuis DeBank
    
    // Récupérer tous les customers depuis la base de données
    const dbCustomers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    })

    if (dbCustomers.length === 0) {
      return NextResponse.json({ customers: [], count: 0, source: 'database' })
    }

    // Récupérer les données DeBank en temps réel pour chaque customer
    const customersData = await Promise.all(
      dbCustomers.map(async (dbCustomer) => {
        try {
          // Récupérer les données collatérales depuis DeBank
          const chains = JSON.parse(dbCustomer.chains || '["eth"]')
          const protocols = JSON.parse(dbCustomer.protocols || '[]')
          
          const collateralClient = await buildCollateralClientFromDeBank(
            dbCustomer.erc20Address,
            {
              name: dbCustomer.name,
              tag: dbCustomer.tag,
              chains,
              allowedProtocols: protocols,
            }
          )

          // Mettre à jour la base de données avec les nouvelles données DeBank
          if (refresh || !dbCustomer.lastUpdate || 
              (new Date().getTime() - new Date(dbCustomer.lastUpdate).getTime()) > 5 * 60 * 1000) {
            await prisma.customer.update({
              where: { id: dbCustomer.id },
              data: {
                totalValue: collateralClient.totalValue,
                totalDebt: collateralClient.totalDebt,
                healthFactor: collateralClient.healthFactor,
                status: collateralClient.healthFactor > 1.5 ? 'active' : 
                        collateralClient.healthFactor > 1.0 ? 'warning' : 'critical',
                lastUpdate: new Date(),
              }
            })
          }

          // Construire l'objet customer avec les données DeBank
          return {
            id: dbCustomer.id,
            name: collateralClient.name || dbCustomer.name,
            erc20Address: dbCustomer.erc20Address,
            tag: collateralClient.tag || dbCustomer.tag,
            totalValue: collateralClient.totalValue,
            totalDebt: collateralClient.totalDebt,
            healthFactor: collateralClient.healthFactor,
            positions: collateralClient.positions || [],
            lastUpdate: collateralClient.lastUpdate,
            email: dbCustomer.email,
            btcWallet: dbCustomer.btcWallet,
            positionValue: collateralClient.totalValue,
            status: collateralClient.healthFactor > 1.5 ? 'active' : 
                    collateralClient.healthFactor > 1.0 ? 'warning' : 'critical',
            chains: chains,
            protocols: protocols,
          }
        } catch (error: any) {
          console.error(`[API Customers] ❌ Erreur DeBank pour wallet ${dbCustomer.erc20Address}:`, {
            message: error.message,
            stack: error.stack,
            wallet: dbCustomer.erc20Address,
          })
          // Retourner les données de la base de données en cas d'erreur DeBank
          return {
            id: dbCustomer.id,
            name: dbCustomer.name,
            erc20Address: dbCustomer.erc20Address,
            tag: dbCustomer.tag,
            totalValue: dbCustomer.totalValue,
            totalDebt: dbCustomer.totalDebt,
            healthFactor: dbCustomer.healthFactor,
            positions: [],
            lastUpdate: dbCustomer.lastUpdate.toISOString(),
            email: dbCustomer.email,
            btcWallet: dbCustomer.btcWallet,
            positionValue: dbCustomer.totalValue,
            status: dbCustomer.status,
            chains: JSON.parse(dbCustomer.chains || '["eth"]'),
            protocols: JSON.parse(dbCustomer.protocols || '[]'),
            error: error.message,
          }
        }
      })
    )

    return NextResponse.json({ 
      customers: customersData,
      count: customersData.length,
      source: 'debank',
      timestamp: new Date().toISOString(),
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

/**
 * @swagger
 * /api/customers:
 *   post:
 *     tags: [customers]
 *     summary: Create a new customer
 *     description: Create a new customer with ERC20 address and fetch DeBank data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - erc20Address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               erc20Address:
 *                 type: string
 *                 example: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
 *               tag:
 *                 type: string
 *                 example: "Client"
 *               chains:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["eth", "arb"]
 *               protocols:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["aave", "morpho"]
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Customer already exists
 */
export async function POST(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ 
    //     error: 'Authentification requise',
    //     message: 'Vous devez être connecté pour créer un customer'
    //   }, { status: 401 })
    // }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('[API Customers] Prisma client est undefined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
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
    const existing = await prisma.customer.findFirst({
      where: { erc20Address: erc20Address.toLowerCase() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Cette adresse ERC20 est déjà enregistrée' },
        { status: 409 }
      )
    }

    // Récupérer les données DeBank pour le nouveau customer
    let debankData = null
    try {
      debankData = await buildCollateralClientFromDeBank(erc20Address.toLowerCase(), {
        name,
        tag: tag || 'Client',
        chains: chains || ['eth'],
        allowedProtocols: protocols || [],
      })
    } catch (error: any) {
      console.warn(`[API Customers] Erreur DeBank lors de la création:`, error.message)
      // Continuer même si DeBank échoue
    }

    // Créer le customer avec les données DeBank si disponibles
    const customer = await prisma.customer.create({
      data: {
        name: debankData?.name || name,
        erc20Address: erc20Address.toLowerCase(),
        tag: debankData?.tag || tag || 'Client',
        chains: JSON.stringify(chains || ['eth']),
        protocols: JSON.stringify(protocols || []),
        totalValue: debankData?.totalValue || 0,
        totalDebt: debankData?.totalDebt || 0,
        healthFactor: debankData?.healthFactor || 0,
        status: debankData?.healthFactor && debankData.healthFactor > 1.5 ? 'active' : 
                debankData?.healthFactor && debankData.healthFactor > 1.0 ? 'warning' : 'unknown',
        lastUpdate: new Date(),
      }
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error: any) {
    console.error('[API Customers] Erreur POST:', error)
    console.error('[API Customers] Stack:', error.stack)
    
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

