import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildCollateralClientFromDeBank } from '@/lib/debank'
import { prisma } from '@/lib/db'

/**
 * @swagger
 * /api/collateral:
 *   get:
 *     tags: [collateral]
 *     summary: Get collateral data from DeBank
 *     description: Retrieve collateral data for specified wallets from DeBank API
 *     parameters:
 *       - in: query
 *         name: wallets
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of wallet addresses
 *         example: "0x1234...,0xABCD..."
 *       - in: query
 *         name: chains
 *         schema:
 *           type: string
 *         description: Comma-separated list of chains (default: "eth")
 *         example: "eth,arb,base"
 *       - in: query
 *         name: protocols
 *         schema:
 *           type: string
 *         description: Comma-separated list of allowed protocols
 *         example: "morpho,aave"
 *       - in: query
 *         name: refresh
 *         schema:
 *           type: boolean
 *         description: Force refresh from DeBank
 *     responses:
 *       200:
 *         description: Collateral data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CollateralClient'
 *                 count:
 *                   type: number
 *                 source:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams;
    const walletsParam = searchParams.get('wallets');
    const refresh = searchParams.get('refresh') === 'true';
    
    // Si des wallets sont fournis dans les query params, les utiliser
    // Sinon, récupérer tous les customers depuis la base de données
    let wallets: string[] = [];
    let customersFromDb: any[] = [];
    
    if (walletsParam) {
      wallets = walletsParam.split(',').map(w => w.trim()).filter(Boolean);
    } else {
      // Récupérer tous les customers depuis la base de données
      try {
        const { prisma } = await import('@/lib/db');
        customersFromDb = await prisma.customer.findMany({
          orderBy: { createdAt: 'desc' }
        });
        wallets = customersFromDb.map(c => c.erc20Address);
      } catch (dbError) {
        console.error('[API Collateral] Erreur DB:', dbError);
        // Pas de fallback - retourner tableau vide si erreur DB
        wallets = [];
      }
    }
    
    if (wallets.length === 0) {
      console.log('[API Collateral] Aucun wallet trouvé, retour tableau vide');
      return NextResponse.json({ clients: [], count: 0, source: 'database' });
    }

    console.log(`[API Collateral] Récupération données pour ${wallets.length} wallet(s):`, wallets);

    const chainsParam = searchParams.get('chains') || 'eth';
    const protocolsParam = searchParams.get('protocols') || '';
    
    const chains = chainsParam.split(',').map(c => c.trim()).filter(Boolean);
    const allowedProtocols = protocolsParam.split(',').map(p => p.trim()).filter(Boolean);

    // Récupérer les données DeBank en temps réel pour chaque wallet
    const clients = await Promise.all(
      wallets.map(async (wallet, index) => {
        try {
          // Trouver les infos du customer dans la DB si disponible
          const dbCustomer = customersFromDb.find(c => c.erc20Address.toLowerCase() === wallet.toLowerCase());
          const customerChains = dbCustomer ? JSON.parse(dbCustomer.chains || '["eth"]') : chains;
          const customerProtocols = dbCustomer ? JSON.parse(dbCustomer.protocols || '[]') : allowedProtocols;
          
          const client = await buildCollateralClientFromDeBank(wallet, {
            name: dbCustomer?.name,
            tag: dbCustomer?.tag || 'Client',
            chains: customerChains,
            allowedProtocols: customerProtocols,
          });

          return client;
        } catch (error: any) {
          console.warn(`[API Collateral] Erreur pour wallet ${wallet}:`, error.message);
          // Retourner un client avec données minimales en cas d'erreur
          const dbCustomer = customersFromDb.find(c => c.erc20Address.toLowerCase() === wallet.toLowerCase());
          return {
            id: wallet,
            name: dbCustomer?.name || `Client ${wallet.substring(0, 8)}...`,
            tag: dbCustomer?.tag || 'Client',
            wallets: [wallet],
            positions: [],
            totalValue: dbCustomer?.totalValue || 0,
            totalDebt: dbCustomer?.totalDebt || 0,
            healthFactor: dbCustomer?.healthFactor || 0,
            lastUpdate: dbCustomer?.lastUpdate?.toISOString() || new Date().toISOString(),
            error: error.message,
          };
        }
      })
    );

    console.log(`[API Collateral] ✅ ${clients.length} client(s) récupéré(s) avec succès`);
    const clientsWithPositions = clients.filter(c => c.positions && c.positions.length > 0).length;
    console.log(`[API Collateral] 📊 ${clientsWithPositions} client(s) avec positions`);

    return NextResponse.json({ 
      clients,
      count: clients.length,
      source: 'debank',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API Collateral] Erreur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données DeBank',
        details: error.message,
        clients: [] // Retourner un tableau vide au lieu d'une erreur 500
      },
      { status: 200 } // Retourner 200 avec un tableau vide pour ne pas casser le frontend
    )
  }
}

