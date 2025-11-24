import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route API pour initialiser l'utilisateur par défaut
 * Utile pour Vercel où la base de données est vide au premier déploiement
 * GET /api/init-user - Crée l'utilisateur admin@hearst.ai s'il n'existe pas
 */
export async function GET(request: NextRequest) {
  try {
    const email = process.env.DEFAULT_USER_EMAIL || 'admin@hearst.ai'
    const name = process.env.DEFAULT_USER_NAME || 'Admin User'

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Utilisateur déjà existant',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      })
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      credentials: {
        email,
        password: 'n\'importe quel mot de passe',
      },
    })
  } catch (error: any) {
    console.error('[Init User API] Erreur:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

