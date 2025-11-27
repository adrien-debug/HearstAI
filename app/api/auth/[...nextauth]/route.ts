import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { NextRequest } from 'next/server'

const handler = NextAuth(authOptions)

// Wrapper pour Next.js 13+ App Router
// NextAuth v4 nécessite une conversion Request/Response
async function handleAuthRequest(
  request: NextRequest,
  method: 'GET' | 'POST'
) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    const searchParams = url.searchParams
    
    // Extraire les segments de nextauth depuis le pathname
    const nextauthSegments = pathname.split('/api/auth/')[1]?.split('/').filter(Boolean) || []
    
    // Créer un objet req compatible avec NextAuth
    const req: any = {
      method,
      headers: Object.fromEntries(request.headers.entries()),
      query: {
        nextauth: nextauthSegments,
        ...(method === 'GET' ? Object.fromEntries(searchParams.entries()) : {})
      },
      url: pathname + (method === 'GET' ? url.search : ''),
      body: method === 'POST' ? await request.text() : null,
    }

    // Créer un objet res qui capture la réponse correctement
    let finalResponse: any = null
    let statusCode = 200
    
    const res: any = {
      status: function(code: number) {
        statusCode = code
        return this
      },
      json: function(data: any) {
        // S'assurer que data est toujours sérialisé en JSON
        const jsonString = typeof data === 'string' ? data : JSON.stringify(data)
        finalResponse = new Response(jsonString, {
          status: statusCode || 200,
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        })
        return this
      },
      send: function(data: any) {
        // Si data est une string, l'utiliser directement
        // Sinon, le convertir en JSON
        let body: string
        let contentType: string
        
        if (typeof data === 'string') {
          body = data
          contentType = 'text/plain'
        } else {
          body = JSON.stringify(data)
          contentType = 'application/json'
        }
        
        finalResponse = new Response(body, {
          status: statusCode || 200,
          headers: { 
            'Content-Type': contentType,
            'Cache-Control': 'no-store, max-age=0'
          }
        })
        return this
      },
      redirect: function(url: string) {
        finalResponse = Response.redirect(url, statusCode || 302)
        return this
      },
      setHeader: function() {},
      getHeader: function() { return null },
    }
    
    // Appeler le handler NextAuth
    const result = await handler(req, res)
    
    // Si le handler retourne directement une Response, l'utiliser
    if (result instanceof Response) {
      // S'assurer que la réponse a le bon Content-Type
      const contentType = result.headers.get('Content-Type')
      if (!contentType || !contentType.includes('application/json')) {
        // Si ce n'est pas du JSON, vérifier le body
        const clonedResponse = result.clone()
        const text = await clonedResponse.text()
        try {
          // Essayer de parser comme JSON
          JSON.parse(text)
          // Si ça fonctionne, créer une nouvelle réponse avec le bon Content-Type
          return new Response(text, {
            status: result.status,
            headers: {
              ...Object.fromEntries(result.headers.entries()),
              'Content-Type': 'application/json'
            }
          })
        } catch (e) {
          // Ce n'est pas du JSON, retourner tel quel
          console.log('[NextAuth Route] Réponse non-JSON détectée:', { contentType, text: text.substring(0, 100) })
          return result
        }
      }
      return result
    }
    
    // Si res.json() ou res.send() a été appelé, utiliser finalResponse
    if (finalResponse) {
      // Vérifier que la réponse est bien du JSON
      const clonedResponse = finalResponse.clone()
      const text = await clonedResponse.text()
      try {
        JSON.parse(text)
      } catch (e) {
        console.error('[NextAuth Route] Erreur: finalResponse n\'est pas du JSON valide:', text)
        // Forcer la sérialisation JSON
        return new Response(JSON.stringify({ error: 'Invalid response format' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return finalResponse
    }
    
    // Par défaut, retourner une réponse JSON vide
    return new Response(JSON.stringify({}), {
      status: statusCode || 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  } catch (error: any) {
    console.error('[NextAuth Route] Erreur:', error)
    const errorResponse = {
      error: 'Authentication error',
      message: error?.message || 'Unknown error'
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function GET(request: NextRequest) {
  return handleAuthRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleAuthRequest(request, 'POST')
}
