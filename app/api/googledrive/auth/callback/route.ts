import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { googleDriveClient } from '@/lib/googledrive/googledrive-client';
import { prisma } from '@/lib/db';

/**
 * Route API Google Drive - Callback OAuth2
 * GET /api/googledrive/auth/callback?code=... - Échange le code d'autorisation contre des tokens
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

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json(
        {
          error: 'Erreur d\'autorisation',
          message: error,
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          error: 'Code d\'autorisation manquant',
          message: 'Le paramètre "code" est requis',
        },
        { status: 400 }
      );
    }

    // Échanger le code contre des tokens
    const tokens = await googleDriveClient.getTokensFromCode(code);

    // Stocker les tokens dans la base de données (associés à l'utilisateur)
    // Note: Vous devrez peut-être créer une table Account dans Prisma pour stocker les tokens OAuth
    try {
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: 'google-drive',
            providerAccountId: session.user.id,
          },
        },
        update: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
          token_type: tokens.token_type,
          scope: tokens.scope,
        },
        create: {
          userId: session.user.id,
          type: 'oauth',
          provider: 'google-drive',
          providerAccountId: session.user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
          token_type: tokens.token_type,
          scope: tokens.scope,
        },
      });
    } catch (dbError: any) {
      console.error('[Google Drive API] Erreur DB:', dbError);
      // Si la table Account n'existe pas, on continue quand même
    }

    // Initialiser le client avec les tokens
    googleDriveClient.setTokens(tokens);

    return NextResponse.json({ 
      success: true, 
      message: 'Connexion à Google Drive réussie',
      authenticated: true,
    });
  } catch (error: any) {
    console.error('[Google Drive API] Erreur:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'échange du code d\'autorisation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


