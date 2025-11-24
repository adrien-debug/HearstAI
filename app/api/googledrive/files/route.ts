import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';
import { prisma } from '@/lib/db';
import type { CreateFileRequest, ListFilesRequest } from '@/lib/googledrive/googledrive-types';

/**
 * Route API Google Drive - Fichiers
 * GET /api/googledrive/files - Liste les fichiers
 * POST /api/googledrive/files - Crée un fichier
 */
export const dynamic = 'force-dynamic'

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

    // Récupérer les tokens de l'utilisateur depuis la DB
    try {
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
    } catch (dbError: any) {
      return NextResponse.json(
        {
          error: 'Erreur lors de la récupération des tokens',
          message: 'Vous devez d\'abord vous connecter à Google Drive',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listRequest: ListFilesRequest = {
      q: searchParams.get('q') || undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : undefined,
      pageToken: searchParams.get('pageToken') || undefined,
      orderBy: searchParams.get('orderBy') || undefined,
    };

    const result = await googleDriveClient.listFiles(listRequest);

    return NextResponse.json({ 
      success: true, 
      data: result,
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des fichiers',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

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

    // Récupérer les tokens de l'utilisateur depuis la DB
    try {
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
    } catch (dbError: any) {
      return NextResponse.json(
        {
          error: 'Erreur lors de la récupération des tokens',
          message: 'Vous devez d\'abord vous connecter à Google Drive',
        },
        { status: 401 }
      );
    }

    const body: CreateFileRequest = await request.json();

    if (!body.name) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          message: 'Le nom du fichier est requis',
        },
        { status: 400 }
      );
    }

    const file = await googleDriveClient.createFile(body);

    return NextResponse.json({ 
      success: true, 
      data: file,
    }, { status: 201 });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la création du fichier',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


