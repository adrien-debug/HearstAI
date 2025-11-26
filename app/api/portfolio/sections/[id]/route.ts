import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer une section par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const section = await prisma.portfolioSection.findFirst({
      where: {
        id: params.id,
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
    })

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    return NextResponse.json({ section })
  } catch (error: any) {
    console.error('Error fetching portfolio section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio section', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une section
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier que la section appartient à l'utilisateur
    const existingSection = await prisma.portfolioSection.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      order,
      isVisible,
      backgroundColor,
      textColor,
      layout,
      columns,
      metadata,
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (order !== undefined) updateData.order = order
    if (isVisible !== undefined) updateData.isVisible = isVisible
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor
    if (textColor !== undefined) updateData.textColor = textColor
    if (layout !== undefined) updateData.layout = layout
    if (columns !== undefined) updateData.columns = columns
    if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata)

    const section = await prisma.portfolioSection.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: {
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
    })

    return NextResponse.json({ section })
  } catch (error: any) {
    console.error('Error updating portfolio section:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio section', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier que la section appartient à l'utilisateur
    const existingSection = await prisma.portfolioSection.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Supprimer la section (les images seront supprimées en cascade)
    await prisma.portfolioSection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting portfolio section:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio section', message: error.message },
      { status: 500 }
    )
  }
}

