import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';

/**
 * Route API Google Drive - URL d'autorisation
 * GET /api/googledrive/auth/url - Génère l'URL d'autorisation OAuth2
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!googleDriveClient.isConfigured()) {
      return NextResponse.json(
        {
          error: 'Google Drive API non configurée',
          message: 'Configurez GOOGLE_DRIVE_CLIENT_ID et GOOGLE_DRIVE_CLIENT_SECRET dans .env.local',
        },
        { status: 503 }
      );
    }

    const authUrl = googleDriveClient.getAuthUrl();

    return NextResponse.json({ 
      success: true, 
      authUrl,
      message: 'Utilisez cette URL pour autoriser l\'accès à Google Drive',
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la génération de l\'URL d\'autorisation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


