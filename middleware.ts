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

    // Check if NEXTAUTH_SECRET is defined
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn('NEXTAUTH_SECRET is not defined, allowing access')
      return NextResponse.next()
    }

    // Check for authentication token
    let token = null
    try {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      })
      console.log('[Middleware] Token check:', { 
        hasToken: !!token, 
        pathname,
        cookieName: process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token'
      })
    } catch (error) {
      console.error('[Middleware] Error getting token:', error)
      // If token check fails, allow access to avoid blocking the app
      return NextResponse.next()
    }

    // If no token and trying to access protected route, redirect to login
    if (!token && pathname !== '/auth/signin') {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If token exists and trying to access login page, redirect to home or callbackUrl
    if (token && pathname === '/auth/signin') {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/'
      // Décoder le callbackUrl si encodé
      let decodedCallbackUrl = callbackUrl
      try {
        decodedCallbackUrl = decodeURIComponent(callbackUrl)
      } catch (e) {
        decodedCallbackUrl = callbackUrl
      }
      
      // S'assurer qu'on ne redirige pas vers /auth/signin
      if (decodedCallbackUrl === '/auth/signin' || decodedCallbackUrl.startsWith('/auth/signin?')) {
        decodedCallbackUrl = '/'
      }
      
      // Vérifier que callbackUrl est une URL relative valide (sécurité)
      if (decodedCallbackUrl.startsWith('/') && !decodedCallbackUrl.startsWith('//')) {
        console.log('[Middleware] Redirection depuis /auth/signin vers:', decodedCallbackUrl)
        return NextResponse.redirect(new URL(decodedCallbackUrl, request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
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
