import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les images d'une section
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')

    if (!sectionId) {
      return NextResponse.json({ error: 'sectionId is required' }, { status: 400 })
    }

    // Vérifier que la section appartient à l'utilisateur
    const section = await prisma.portfolioSection.findFirst({
      where: {
        id: sectionId,
        userId: session.user.id,
      },
    })

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    const images = await prisma.portfolioImage.findMany({
      where: {
        sectionId,
        userId: session.user.id,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json({ images })
  } catch (error: any) {
    console.error('Error fetching portfolio images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio images', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      sectionId,
      title,
      description,
      alt,
      url,
      thumbnailUrl,
      storagePath,
      mimeType,
      size,
      width,
      height,
      order = 0,
      isVisible = true,
      category,
      tags = [],
      metadata = {},
    } = body

    if (!sectionId || !url) {
      return NextResponse.json(
        { error: 'sectionId and url are required' },
        { status: 400 }
      )
    }

    // Vérifier que la section appartient à l'utilisateur
    const section = await prisma.portfolioSection.findFirst({
      where: {
        id: sectionId,
        userId: session.user.id,
      },
    })

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    // Trouver l'ordre maximum si non spécifié
    let finalOrder = order
    if (order === 0) {
      const maxOrder = await prisma.portfolioImage.findFirst({
        where: { sectionId },
        orderBy: { order: 'desc' },
        select: { order: true },
      })
      finalOrder = maxOrder ? maxOrder.order + 1 : 0
    }

    const image = await prisma.portfolioImage.create({
      data: {
        sectionId,
        userId: session.user.id,
        title,
        description,
        alt,
        url,
        thumbnailUrl,
        storagePath,
        mimeType,
        size: size ? BigInt(size) : null,
        width,
        height,
        order: finalOrder,
        isVisible,
        category,
        tags: JSON.stringify(tags),
        metadata: JSON.stringify(metadata),
      },
    })

    return NextResponse.json({ image }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating portfolio image:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio image', message: error.message },
      { status: 500 }
    )
  }
}

