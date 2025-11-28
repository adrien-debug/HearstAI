import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les sections du portfolio de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sections = await prisma.portfolioSection.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        images: {
          where: {
            isVisible: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ sections })
  } catch (error: any) {
    console.error('Error fetching portfolio sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio sections', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle section
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type = 'gallery',
      order = 0,
      isVisible = true,
      backgroundColor,
      textColor,
      layout = 'grid',
      columns = 3,
      metadata = {},
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Trouver l'ordre maximum si non spécifié
    let finalOrder = order
    if (order === 0) {
      const maxOrder = await prisma.portfolioSection.findFirst({
        where: { userId: session.user.id },
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      finalOrder = maxOrder ? maxOrder.order + 1 : 0
    }

    const section = await prisma.portfolioSection.create({
      data: {
        userId: session.user.id,
        title,
        description,
        type,
        order: finalOrder,
        isVisible,
        backgroundColor,
        textColor,
        layout,
        columns,
        metadata: JSON.stringify(metadata),
      },
      include: {
        images: true,
        _count: {
          select: {
            images: true,
          },
        },
      },
    })

    return NextResponse.json({ section }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating portfolio section:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio section', message: error.message },
      { status: 500 }
    )
  }
}


