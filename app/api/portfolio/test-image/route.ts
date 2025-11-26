import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Route de test pour vérifier qu'une image peut être servie
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')

    if (!imagePath) {
      return NextResponse.json({ error: 'path parameter is required' }, { status: 400 })
    }

    // Sécuriser le chemin pour éviter les path traversal attacks
    const sanitizedPath = imagePath.replace(/\.\./g, '').replace(/^\/+/, '')
    const fullPath = path.join(process.cwd(), 'public', sanitizedPath)

    // Vérifier que le fichier existe dans public/
    if (!existsSync(fullPath) || !fullPath.startsWith(path.join(process.cwd(), 'public'))) {
      return NextResponse.json(
        { error: 'Image not found', path: sanitizedPath },
        { status: 404 }
      )
    }

    // Lire et servir le fichier
    const fileBuffer = await readFile(fullPath)
    const mimeType = getMimeType(path.extname(fullPath))

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error serving test image:', error)
    return NextResponse.json(
      { error: 'Failed to serve image', message: error.message },
      { status: 500 }
    )
  }
}

function getMimeType(ext: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream'
}

