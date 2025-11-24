import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fireblocksClient } from '@/lib/fireblocks/fireblocks-client';

/**
 * Route API Fireblocks - Vault Accounts
 * GET /api/fireblocks/vaults - Liste les comptes vault
 * GET /api/fireblocks/vaults?id=xxx - Récupère un compte vault spécifique
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fireblocksClient.isConfigured()) {
      return NextResponse.json(
        {
          error: 'Fireblocks API non configurée',
          message: 'Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY dans .env.local',
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('id');

    if (vaultId) {
      // Récupérer un compte vault spécifique
      const vault = await fireblocksClient.getVaultAccount(vaultId);
      return NextResponse.json({ success: true, data: vault });
    }

    // Liste tous les comptes vault
    const vaults = await fireblocksClient.getVaultAccounts();
    return NextResponse.json({ success: true, data: vaults });
  } catch (error: any) {
    console.error('[Fireblocks API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des comptes vault Fireblocks',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


