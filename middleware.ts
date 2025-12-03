import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenFromRequest } from '@/lib/auth-middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // PRIORITÉ ABSOLUE : Exclure TOUS les fichiers statiques et assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/js/') ||
    pathname.startsWith('/css/') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/storage/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2|ttf|eot|map)$/i)
  ) {
    return NextResponse.next()
  }

  try {
    // Check for JWT authentication token
    const session = getTokenFromRequest(request)

    // If no session and trying to access protected route, redirect to login
    if (!session && pathname !== '/auth/signin') {
      // Vérifier qu'on n'est pas déjà en train de rediriger (éviter les boucles)
      const referer = request.headers.get('referer')
      if (referer && referer.includes('/auth/signin')) {
        console.warn('[Middleware] ⚠️ Redirection depuis /auth/signin détectée, laisser passer pour éviter boucle')
        return NextResponse.next()
      }
      
      // Check if this is a client-side navigation
      // For client-side navigations, allow them to proceed - the client-side check in LayoutWrapper will handle authentication
      // This prevents the flash of login page during navigation
      const isClientNavigation = 
        request.headers.get('sec-fetch-mode') === 'navigate' ||
        request.headers.get('sec-fetch-mode') === 'same-origin' ||
        (referer && !referer.includes('/auth/signin') && referer.includes(request.nextUrl.origin))
      
      // For client-side navigations from within the app, let the client handle auth
      // This prevents redirect loops and flashing
      if (isClientNavigation) {
        // Allow the request to proceed - LayoutWrapper will handle auth check on client side
        return NextResponse.next()
      }
      
      // For direct navigation (typing URL, refresh, etc.), redirect to login
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      console.log('[Middleware] Redirection vers /auth/signin depuis:', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If session exists and trying to access login page, redirect to home or callbackUrl
    if (session && pathname === '/auth/signin') {
      let callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
      
      if (!callbackUrl || callbackUrl.trim() === '') {
        callbackUrl = '/'
      } else {
        try {
          if (callbackUrl.startsWith('%')) {
            callbackUrl = decodeURIComponent(callbackUrl)
          } else {
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
    '/((?!_next/|api/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2|ttf|eot|map)$).*)',
  ],
}
