import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Wrapper pour Next.js 13+ App Router
// NextAuth v4 nécessite une conversion Request/Response
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }