import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer une image par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const image = await prisma.portfolioImage.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Convertir BigInt en string pour la réponse JSON
    const imageResponse = {
      ...image,
      size: image.size ? image.size.toString() : null,
    }

    return NextResponse.json({ image: imageResponse })
  } catch (error: any) {
    console.error('Error fetching portfolio image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio image', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier que l'image appartient à l'utilisateur
    const existingImage = await prisma.portfolioImage.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
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
      order,
      isVisible,
      category,
      tags,
      metadata,
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (alt !== undefined) updateData.alt = alt
    if (url !== undefined) updateData.url = url
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (storagePath !== undefined) updateData.storagePath = storagePath
    if (mimeType !== undefined) updateData.mimeType = mimeType
    if (size !== undefined) updateData.size = size ? BigInt(size) : null
    if (width !== undefined) updateData.width = width
    if (height !== undefined) updateData.height = height
    if (order !== undefined) updateData.order = order
    if (isVisible !== undefined) updateData.isVisible = isVisible
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)
    if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata)

    const image = await prisma.portfolioImage.update({
      where: { id: params.id },
      data: updateData,
    })

    // Convertir BigInt en string pour la réponse JSON
    const imageResponse = {
      ...image,
      size: image.size ? image.size.toString() : null,
    }

    return NextResponse.json({ image: imageResponse })
  } catch (error: any) {
    console.error('Error updating portfolio image:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio image', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Vérifier que l'image appartient à l'utilisateur
    const existingImage = await prisma.portfolioImage.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // TODO: Supprimer le fichier du stockage si storagePath existe
    // await deleteFileFromStorage(existingImage.storagePath)

    await prisma.portfolioImage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting portfolio image:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio image', message: error.message },
      { status: 500 }
    )
  }
}


