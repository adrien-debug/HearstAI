import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';
import { prisma } from '@/lib/db';
import type { UpdateFileRequest } from '@/lib/googledrive/googledrive-types';

/**
 * Route API Google Drive - Fichier spécifique
 * GET /api/googledrive/files/[fileId] - Récupère un fichier
 * PATCH /api/googledrive/files/[fileId] - Met à jour un fichier
 * DELETE /api/googledrive/files/[fileId] - Supprime un fichier
 */

async function getAuthenticatedClient(userId: string) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google-drive',
        providerAccountId: userId,
      },
    },
  });

  if (!account?.access_token) {
    throw new Error('Non authentifié - Connectez-vous d\'abord à Google Drive');
  }

  googleDriveClient.setTokens({
    access_token: account.access_token,
    refresh_token: account.refresh_token || undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  return googleDriveClient;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
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

    const client = await getAuthenticatedClient(session.user.id);
    const file = await client.getFile(params.fileId);

    return NextResponse.json({ 
      success: true, 
      data: file,
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération du fichier',
        details: error.message,
      },
      { status: error.message.includes('Non authentifié') ? 401 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
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

    const client = await getAuthenticatedClient(session.user.id);
    const body: UpdateFileRequest = await request.json();
    const file = await client.updateFile(params.fileId, body);

    return NextResponse.json({ 
      success: true, 
      data: file,
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la mise à jour du fichier',
        details: error.message,
      },
      { status: error.message.includes('Non authentifié') ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
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

    const client = await getAuthenticatedClient(session.user.id);
    await client.deleteFile(params.fileId);

    return NextResponse.json({ 
      success: true, 
      message: 'Fichier supprimé avec succès',
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la suppression du fichier',
        details: error.message,
      },
      { status: error.message.includes('Non authentifié') ? 401 : 500 }
    );
  }
}


