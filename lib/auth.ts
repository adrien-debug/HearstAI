import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import CredentialsProvider from 'next-auth/providers/credentials'

// S'assurer que NEXTAUTH_URL est défini avec une valeur par défaut (côté serveur uniquement)
if (!process.env.NEXTAUTH_URL) {
  // En développement, utiliser localhost:6001 par défaut
  const port = process.env.PORT || '6001'
  process.env.NEXTAUTH_URL = `http://localhost:${port}`
  console.log(`[NextAuth] ⚠️ NEXTAUTH_URL non défini, utilisation de la valeur par défaut: ${process.env.NEXTAUTH_URL}`)
}

export const authOptions: NextAuthOptions = {
  // PrismaAdapter n'est pas nécessaire avec CredentialsProvider
  // adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development', // Activer les logs seulement en développement
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('[NextAuth] Tentative de connexion:', { email: credentials?.email })
          
          if (!credentials?.email || !credentials?.password) {
            console.log('[NextAuth] Credentials manquants')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.log('[NextAuth] Utilisateur non trouvé:', credentials.email)
            return null
          }

          console.log('[NextAuth] Utilisateur trouvé:', { id: user.id, email: user.email })

          // Pour l'instant, on accepte n'importe quel mot de passe si l'utilisateur existe
          // TODO: Implémenter la vérification du mot de passe avec bcrypt
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('[NextAuth] Erreur lors de l\'autorisation:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https://') ?? false,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('[NextAuth] Redirect callback:', { url, baseUrl })
      
      // Vérifier que baseUrl est valide
      if (!baseUrl || baseUrl === '') {
        console.error('[NextAuth] ⚠️ baseUrl est vide ou invalide, utilisation de /')
        return '/'
      }
      
      // S'assurer que baseUrl est une URL valide
      let validBaseUrl = baseUrl
      try {
        // Si baseUrl n'est pas une URL complète, essayer de la construire
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
          // Si c'est une URL relative, la préfixer avec https://
          validBaseUrl = `https://${baseUrl}`
        }
        // Tester si c'est une URL valide
        new URL(validBaseUrl)
      } catch (e) {
        console.error('[NextAuth] ⚠️ baseUrl invalide:', baseUrl, e)
        // Si baseUrl est invalide, utiliser '/' par défaut
        validBaseUrl = '/'
      }
      
      // Si l'URL est vide ou undefined, rediriger vers la page d'accueil
      if (!url || url === '') {
        console.log('[NextAuth] URL vide, redirection vers baseUrl')
        return validBaseUrl === '/' ? '/' : validBaseUrl
      }
      
      // Décoder l'URL si elle est encodée
      let decodedUrl = url
      try {
        // Si l'URL contient des caractères encodés, décoder
        if (url.includes('%')) {
          decodedUrl = decodeURIComponent(url)
        }
      } catch (e) {
        console.warn('[NextAuth] Erreur décodage URL, utilisation de l\'URL originale:', e)
        decodedUrl = url
      }
      
      // Si l'URL est la page de login, rediriger vers la page d'accueil
      if (decodedUrl.includes('/auth/signin')) {
        console.log('[NextAuth] URL contient /auth/signin, redirection vers baseUrl')
        return validBaseUrl === '/' ? '/' : validBaseUrl
      }
      
      // Permettre les redirections vers des URLs relatives
      if (decodedUrl.startsWith('/')) {
        // Vérifier que ce n'est pas /auth/signin
        if (decodedUrl === '/auth/signin' || decodedUrl.startsWith('/auth/signin?')) {
          console.log('[NextAuth] URL relative pointe vers /auth/signin, redirection vers baseUrl')
          return validBaseUrl === '/' ? '/' : validBaseUrl
        }
        // Si baseUrl est '/', retourner directement decodedUrl
        if (validBaseUrl === '/') {
          console.log('[NextAuth] URL relative, redirection vers:', decodedUrl)
          return decodedUrl
        }
        console.log('[NextAuth] URL relative, redirection vers:', `${validBaseUrl}${decodedUrl}`)
        return `${validBaseUrl}${decodedUrl}`
      }
      
      // Permettre les redirections vers le même domaine
      try {
        // Vérifier que decodedUrl est une URL valide avant de créer un objet URL
        if (decodedUrl && typeof decodedUrl === 'string' && decodedUrl.trim() !== '') {
          const urlObj = new URL(decodedUrl)
          // Comparer les origines
          const baseUrlObj = validBaseUrl === '/' ? null : new URL(validBaseUrl)
          if (baseUrlObj && urlObj.origin === baseUrlObj.origin) {
            // Vérifier que ce n'est pas /auth/signin
            if (urlObj.pathname === '/auth/signin' || urlObj.pathname.startsWith('/auth/signin')) {
              console.log('[NextAuth] URL complète pointe vers /auth/signin, redirection vers baseUrl')
              return validBaseUrl === '/' ? '/' : validBaseUrl
            }
            console.log('[NextAuth] URL même domaine, redirection vers:', decodedUrl)
            return decodedUrl
          }
        }
      } catch (e) {
        // Si l'URL n'est pas valide, rediriger vers la page d'accueil
        console.log('[NextAuth] URL invalide (erreur construction URL), redirection vers baseUrl:', e)
        return validBaseUrl === '/' ? '/' : validBaseUrl
      }
      
      // Par défaut, rediriger vers la page d'accueil
      console.log('[NextAuth] Par défaut, redirection vers baseUrl')
      return validBaseUrl === '/' ? '/' : validBaseUrl
    },
  },
}
