import { NextResponse } from 'next/server'

// En production, utiliser BACKEND_URL ou NEXT_PUBLIC_API_URL si défini
// Sinon, utiliser les routes API Next.js directement (chemin relatif)
const getBackendUrl = () => {
  // Si BACKEND_URL est défini (pour backend externe comme Railway)
  if (process.env.BACKEND_URL && process.env.BACKEND_URL !== 'http://localhost:5001') {
    return process.env.BACKEND_URL
  }
  // Si NEXT_PUBLIC_API_URL est défini et contient une URL complète
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
    return process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
  }
  // En développement local uniquement
  if (process.env.NODE_ENV === 'development') {
    return process.env.BACKEND_URL || 'http://localhost:5001'
  }
  // En production, utiliser les routes API Next.js (ne devrait pas arriver ici)
  return null
}

export async function GET() {
  try {
    const backendUrl = getBackendUrl()
    
    // Si pas de backend configuré, retourner une erreur explicite
    if (!backendUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Backend not configured',
          message: 'BACKEND_URL environment variable is not set. Please configure it in Vercel environment variables or use the Next.js API routes directly.'
        },
        { status: 503 }
      )
    }

    const response = await fetch(`${backendUrl}/api/calculator/metrics`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching calculator metrics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch calculator metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

