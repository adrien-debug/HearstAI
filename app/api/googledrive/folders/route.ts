import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';
import { prisma } from '@/lib/db';

/**
 * Route API Google Drive - Dossiers
 * POST /api/googledrive/folders - Crée un dossier
 */
export async function POST(request: NextRequest) {
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

    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google-drive',
          providerAccountId: session.user.id,
        },
      },
    });

    if (!account?.access_token) {
      return NextResponse.json(
        {
          error: 'Non authentifié',
          message: 'Vous devez d\'abord vous connecter à Google Drive via /api/googledrive/auth/url',
        },
        { status: 401 }
      );
    }

    googleDriveClient.setTokens({
      access_token: account.access_token,
      refresh_token: account.refresh_token || undefined,
      expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
    });

    const body = await request.json();
    const { name, parents } = body;

    if (!name) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          message: 'Le nom du dossier est requis',
        },
        { status: 400 }
      );
    }

    const folder = await googleDriveClient.createFolder(name, parents);

    return NextResponse.json({ 
      success: true, 
      data: folder,
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création du dossier',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


