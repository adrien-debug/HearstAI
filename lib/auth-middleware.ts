// Middleware authentication helper
// Validates JWT tokens from cookies

import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-production';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function getTokenFromRequest(request: NextRequest): { user: AuthUser } | null {
  try {
    // Try to get token from cookie
    const tokenCookie = request.cookies.get('auth_token');
    let token = tokenCookie?.value;

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
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
    return null;
  }
}

