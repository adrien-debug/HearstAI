import { NextRequest, NextResponse } from 'next/server';
import { apiManager } from '@/lib/api-manager';

/**
 * Route API - Statut des connexions API
 * GET /api/status - Retourne le statut de toutes les APIs configurées
 */

export async function GET(request: NextRequest) {
  try {
    const status = apiManager.getStatus();
    const testResults = await apiManager.testAllConnections();

    return NextResponse.json({
      success: true,
      status,
      testResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API Status] Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération du statut des APIs',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


