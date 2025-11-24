import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildCollateralClientFromDeBank } from '@/lib/debank'
import { prisma } from '@/lib/db'

/**
 * Route API pour récupérer les données collatérales depuis DeBank
 * 
 * GET /api/collateral?wallets=0x1234...,0xABCD...&chains=eth,arb&protocols=morpho
 * 
 * Query params:
 * - wallets (requis): liste de wallets séparés par des virgules
 * - chains (optionnel): liste de chains séparées par des virgules (défaut: "eth")
 * - protocols (optionnel): liste de protocoles autorisés séparés par des virgules
 * 
 * Retourne:
 * {
 *   clients: [
 *     {
 *       id: "0x...",
 *       name: "...",
 *       tag: "...",
 *       wallets: ["0x..."],
 *       positions: [...],
 *       lastUpdate: "2025-01-20T10:00:00Z"
 *     }
 *   ]
 * }
 */
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
        console.warn('[API Collateral] Erreur DB, utilisation des wallets par défaut:', dbError);
        // Fallback sur wallets par défaut
        wallets = [
          '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        ];
      }
    }
    
    if (wallets.length === 0) {
      return NextResponse.json({ clients: [] });
    }

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

