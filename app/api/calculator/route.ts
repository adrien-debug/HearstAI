import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Vérifier si le fichier existe
    const filePath = path.join(process.cwd(), 'frontend', 'calculator.html')
    
    // En production sur Vercel, le fichier peut ne pas exister
    // Vérifier d'abord si le fichier existe
    if (!fs.existsSync(filePath)) {
      // Retourner une réponse JSON indiquant que la page calculator n'est pas disponible
      // ou rediriger vers une page Next.js si elle existe
      return NextResponse.json(
        { 
          error: 'Calculator page not found',
          message: 'The calculator.html file is not available. Please use the Next.js calculator page instead.',
          redirect: '/calculator'
        },
        { status: 404 }
      )
    }

    const htmlContent = fs.readFileSync(filePath, 'utf-8')

    // Ajouter cache-busting pour forcer le rechargement
    const modifiedHtml = htmlContent
      .replace('href="/css/calculator.css"', 'href="/css/calculator.css?v=' + Date.now() + '"')
      .replace('src="/js/calculator.js"', 'src="/js/calculator.js?v=' + Date.now() + '"')

    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error serving calculator:', error)
    return NextResponse.json(
      { 
        error: 'Calculator page not found',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 404 }
    )
  }
}

