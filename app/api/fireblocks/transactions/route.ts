import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fireblocksClient } from '@/lib/fireblocks/fireblocks-client';
import type { TransactionRequest } from '@/lib/fireblocks/fireblocks-types';

/**
 * Route API Fireblocks - Transactions
 * GET /api/fireblocks/transactions - Liste les transactions
 * POST /api/fireblocks/transactions - Crée une transaction
 */

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

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
    const txId = searchParams.get('id');

    if (txId) {
      // Récupérer une transaction spécifique
      const transaction = await fireblocksClient.getTransaction(txId);
      return NextResponse.json({ success: true, data: transaction });
    }

    // Liste des transactions (nécessite implémentation dans le client)
    return NextResponse.json(
      {
        success: true,
        message: 'Liste des transactions - À implémenter',
        data: [],
      },
      { status: 501 }
    );
  } catch (error: any) {
    console.error('[Fireblocks API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des transactions Fireblocks',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ne pas exiger l'authentification pour permettre le développement
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (!fireblocksClient.isConfigured()) {
      return NextResponse.json(
        {
          error: 'Fireblocks API non configurée',
          message: 'Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY dans .env.local',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const transactionRequest: TransactionRequest = body;

    // Validation basique
    if (!transactionRequest.assetId || !transactionRequest.source || !transactionRequest.destination || !transactionRequest.amount) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          message: 'assetId, source, destination et amount sont requis',
        },
        { status: 400 }
      );
    }

    const transaction = await fireblocksClient.createTransaction(transactionRequest);

    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error: any) {
    console.error('[Fireblocks API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création de la transaction Fireblocks',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


