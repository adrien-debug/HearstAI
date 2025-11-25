import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // PrismaAdapter n'est pas nécessaire avec CredentialsProvider
  // adapter: PrismaAdapter(prisma),
  debug: true, // Activer les logs pour le débogage
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
      // Si l'URL est la page de login, rediriger vers la page d'accueil
      if (url.includes('/auth/signin')) {
        return baseUrl
      }
      
      // Permettre les redirections vers des URLs relatives
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      // Permettre les redirections vers le même domaine
      try {
        const urlObj = new URL(url)
        if (urlObj.origin === baseUrl) {
          return url
        }
      } catch (e) {
        // Si l'URL n'est pas valide, rediriger vers la page d'accueil
        return baseUrl
      }
      
      // Par défaut, rediriger vers la page d'accueil
      return baseUrl
    },
  },
}
