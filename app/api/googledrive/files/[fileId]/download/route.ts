import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';
import { prisma } from '@/lib/db';
import type { DownloadFileRequest } from '@/lib/googledrive/googledrive-types';

/**
 * Route API Google Drive - Téléchargement de fichier
 * GET /api/googledrive/files/[fileId]/download - Télécharge le contenu d'un fichier
 */
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

    const { searchParams } = new URL(request.url);
    const downloadRequest: DownloadFileRequest = {
      fileId: params.fileId,
      alt: (searchParams.get('alt') as 'media' | 'json') || 'media',
    };

    const fileBuffer = await googleDriveClient.downloadFile(downloadRequest);

    // Récupérer les métadonnées du fichier pour déterminer le type MIME
    const file = await googleDriveClient.getFile(params.fileId);
    const mimeType = file.mimeType || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors du téléchargement du fichier',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


