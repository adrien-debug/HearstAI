import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { buildCollateralClientFromDeBank } from '@/lib/debank'

export const dynamic = 'force-dynamic'

/**
 * API Route pour analyser un identifiant et récupérer ses données DeBank
 * 
 * GET /api/data-analysis/[identifier]
 * 
 * Supporte:
 * - Adresses ERC20 (0x...) - récupération directe depuis DeBank
 * - Identifiants personnalisés (recherche dans la DB puis DeBank si adresse trouvée)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { identifier: string } }
) {
  try {
    const identifier = params.identifier
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifiant requis' },
        { status: 400 }
      )
    }
    
    // Identifier le type
    const type = identifyType(identifier)
    
    const result: any = {
      identifier,
      type,
      timestamp: new Date().toISOString(),
      data: null,
      database: null,
    }
    
    // Récupérer les données selon le type
    if (type === 'erc20_address') {
      try {
        const client = await buildCollateralClientFromDeBank(identifier.toLowerCase(), {
          chains: ['eth', 'arb', 'base', 'op'],
          allowedProtocols: [],
        })
        
        result.data = {
          type: 'erc20_address',
          address: identifier,
          data: {
            name: client.name,
            tag: client.tag,
            totalValue: client.totalValue,
            totalDebt: client.totalDebt,
            healthFactor: client.healthFactor,
            positions: client.positions,
            lastUpdate: client.lastUpdate,
          },
          source: 'debank',
        }
      } catch (error: any) {
        result.data = {
          type: 'erc20_address',
          address: identifier,
          error: error.message,
          source: 'debank',
        }
      }
    } else if (type === 'custom_id') {
      // Rechercher dans la base de données
      const customers = await prisma.customer.findMany({
        where: {
          OR: [
            { erc20Address: { contains: identifier, mode: 'insensitive' } },
            { name: { contains: identifier, mode: 'insensitive' } },
            { fireblocksVaultId: { contains: identifier, mode: 'insensitive' } },
            { fireblocksWalletId: { contains: identifier, mode: 'insensitive' } },
          ],
        },
      })
      
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: identifier, mode: 'insensitive' } },
            { id: identifier },
          ],
        },
      })
      
      result.database = {
        customers,
        projects,
      }
      
      // Si trouvé comme adresse ERC20 dans un customer, récupérer les données DeBank
      if (customers.length > 0 && customers[0].erc20Address) {
        try {
          const client = await buildCollateralClientFromDeBank(
            customers[0].erc20Address.toLowerCase(),
            {
              chains: ['eth', 'arb', 'base', 'op'],
              allowedProtocols: [],
            }
          )
          
          result.data = {
            type: 'erc20_address',
            address: customers[0].erc20Address,
            data: {
              name: client.name,
              tag: client.tag,
              totalValue: client.totalValue,
              totalDebt: client.totalDebt,
              healthFactor: client.healthFactor,
              positions: client.positions,
              lastUpdate: client.lastUpdate,
            },
            source: 'debank',
          }
        } catch (error: any) {
          result.data = {
            type: 'erc20_address',
            address: customers[0].erc20Address,
            error: error.message,
            source: 'debank',
          }
        }
      }
    }
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API Data Analysis] Erreur:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'analyse',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * Identifie le type d'identifiant
 */
function identifyType(identifier: string): string {
  const id = identifier.trim()
  
  // Adresse ERC20
  if (/^0x[a-fA-F0-9]{40}$/.test(id)) {
    return 'erc20_address'
  }
  
  // Identifiant court
  if (/^[a-zA-Z0-9]{8,}$/.test(id)) {
    return 'custom_id'
  }
  
  return 'unknown'
}

