import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from './db'

export async function getSessionFromRequest(request: NextRequest) {
  try {
    // Get token from cookies using getToken
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token || !token.sub) {
      return null
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      expires: token.exp && typeof token.exp === 'number' ? new Date(token.exp * 1000).toISOString() : undefined,
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

