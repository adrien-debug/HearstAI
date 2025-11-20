import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pour l'instant, retourner des données mockées
    // TODO: Implémenter la logique réelle pour récupérer les prompts
    return NextResponse.json({
      prompts: [],
      message: 'Prompts feature coming soon',
    })
  } catch (error) {
    console.error('Error getting prompts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pour l'instant, retourner une erreur
    // TODO: Implémenter la création de prompts
    return NextResponse.json(
      { error: 'Prompts feature not yet implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

