// Server-side authentication helper
// Validates JWT tokens from cookies or headers

import { cookies, headers } from 'next/headers';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export async function getServerSession(): Promise<{ user: AuthUser } | null> {
  try {
    // Try to get token from cookie first
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth_token');
    let token = tokenCookie?.value;

    // If no cookie, try Authorization header
    if (!token) {
      const headersList = await headers();
      const authHeader = headersList.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return {
      user: {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name || '',
      },
    };
  } catch (error) {
    console.error('[Auth Server] Error validating token:', error);
    return null;
  }
}



