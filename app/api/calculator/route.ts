import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'frontend', 'calculator.html')
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
      { error: 'Calculator page not found' },
      { status: 404 }
    )
  }
}

