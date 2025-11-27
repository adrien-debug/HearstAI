import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes pour l'upload de gros fichiers

// POST - Uploader une image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sectionId = formData.get('sectionId') as string | null
    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null
    const alt = formData.get('alt') as string | null
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

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

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Créer le répertoire de stockage si nécessaire
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio', session.user.id)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = path.join(uploadDir, fileName)
    const publicUrl = `/uploads/portfolio/${session.user.id}/${fileName}`

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Obtenir les dimensions de l'image si possible (nécessiterait sharp ou similar)
    // Pour l'instant, on stocke juste les infos de base
    const size = buffer.length
    const mimeType = file.type

    // Trouver l'ordre maximum
    const maxOrder = await prisma.portfolioImage.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    const order = maxOrder ? maxOrder.order + 1 : 0

    // Créer l'enregistrement dans la base de données
    const image: any = await prisma.portfolioImage.create({
      data: {
        sectionId,
        userId: session.user.id,
        title: title || originalName,
        description: description || null,
        alt: alt || title || originalName,
        url: publicUrl,
        thumbnailUrl: publicUrl, // Pour l'instant, utiliser la même URL
        storagePath: filePath,
        mimeType,
        size: BigInt(size),
        order,
        isVisible: true,
        category: category || null,
        tags: JSON.stringify([]),
        metadata: JSON.stringify({
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }),
      },
    })

    // Convertir BigInt en string pour la réponse JSON
    const imageResponse = {
      ...image,
      size: image.size.toString(),
    }

    return NextResponse.json({ image: imageResponse }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading portfolio image:', error)
    return NextResponse.json(
      { error: 'Failed to upload portfolio image', message: error.message },
      { status: 500 }
    )
  }
}

