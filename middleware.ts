import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Allow access to auth pages, API routes, and public assets
    if (
      pathname.startsWith('/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') || // Allow all API routes
      pathname === '/favicon.ico' ||
      pathname.startsWith('/js/') ||
      pathname.startsWith('/css/') ||
      pathname.startsWith('/public/') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.json')
    ) {
      return NextResponse.next()
    }

    // MODE DEBUG LOCAL : Désactiver les redirections si on est en local sur le port 6001
    const isLocalDebug = process.env.NODE_ENV === 'development' && 
                         (request.url.includes('localhost:6001') || request.url.includes('127.0.0.1:6001'))
    
    if (isLocalDebug) {
      console.log('[Middleware] 🔧 MODE DEBUG LOCAL - Redirections désactivées pour:', pathname)
      return NextResponse.next()
    }

    // Check if NEXTAUTH_SECRET is defined
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn('NEXTAUTH_SECRET is not defined, allowing access')
      return NextResponse.next()
    }

    // Vérifier les cookies directement pour éviter les problèmes de timing
    const cookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
    
    const hasAuthCookie = request.cookies.has(cookieName)
    
    // Check for authentication token
    let token = null
    try {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: cookieName,
      })
      console.log('[Middleware] Token check:', { 
        hasToken: !!token, 
        hasCookie: hasAuthCookie,
        pathname,
        cookieName
      })
    } catch (error) {
      console.error('[Middleware] Error getting token:', error)
      // Si on a le cookie mais que getToken échoue, laisser passer (cookie en cours de traitement)
      if (hasAuthCookie) {
        console.log('[Middleware] Cookie présent mais getToken échoué, laisser passer')
        return NextResponse.next()
      }
      // Sinon, rediriger vers login seulement si on n'est pas déjà sur /auth/signin
      if (pathname !== '/auth/signin') {
        const signInUrl = new URL('/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(signInUrl)
      }
      return NextResponse.next()
    }

    // Si on a le cookie mais pas de token, laisser passer (cookie en cours de traitement par NextAuth)
    if (hasAuthCookie && !token) {
      console.log('[Middleware] Cookie présent mais token non disponible, laisser passer (cookie en traitement)')
      return NextResponse.next()
    }

    // If no token and trying to access protected route, redirect to login
    if (!token && pathname !== '/auth/signin') {
      // Vérifier qu'on n'est pas déjà en train de rediriger (éviter les boucles)
      const referer = request.headers.get('referer')
      if (referer && referer.includes('/auth/signin')) {
        console.warn('[Middleware] ⚠️ Redirection depuis /auth/signin détectée, laisser passer pour éviter boucle')
        return NextResponse.next()
      }
      
      // Vérifier si on vient d'une authentification réussie (flag _auth=success)
      const authSuccess = request.nextUrl.searchParams.get('_auth')
      if (authSuccess === 'success') {
        console.log('[Middleware] Flag _auth=success détecté, laisser passer (cookie en cours de traitement)')
        return NextResponse.next()
      }
      
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      console.log('[Middleware] Redirection vers /auth/signin depuis:', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If token exists and trying to access login page, redirect to home or callbackUrl
    if (token && pathname === '/auth/signin') {
      let callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
      
      // Si callbackUrl est null ou vide, utiliser '/'
      if (!callbackUrl || callbackUrl.trim() === '') {
        callbackUrl = '/'
      } else {
        // Décoder le callbackUrl si encodé (%2F -> /)
        try {
          // Si ça commence par % c'est encore encodé
          if (callbackUrl.startsWith('%')) {
            callbackUrl = decodeURIComponent(callbackUrl)
          } else {
            // Sinon, essayer quand même de décoder (au cas où)
            callbackUrl = decodeURIComponent(callbackUrl)
          }
        } catch (e) {
          console.warn('[Middleware] Erreur décodage callbackUrl, utilisation de /:', e)
          callbackUrl = '/'
        }
      }
      
      // S'assurer qu'on ne redirige pas vers /auth/signin (éviter les boucles)
      if (callbackUrl === '/auth/signin' || callbackUrl.startsWith('/auth/signin?') || callbackUrl.includes('/auth/signin')) {
        console.warn('[Middleware] ⚠️ CallbackUrl pointe vers /auth/signin, forcer vers /')
        callbackUrl = '/'
      }
      
      // Vérifier que callbackUrl est une URL relative valide (sécurité)
      if (!callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) {
        console.warn('[Middleware] ⚠️ CallbackUrl invalide, forcer vers /')
        callbackUrl = '/'
      }
      
      console.log('[Middleware] Redirection depuis /auth/signin vers:', callbackUrl)
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to proceed to avoid blocking the app
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/* (all API routes - handled in middleware logic above)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
