// Client-side authentication for backend JWT
// Replaces NextAuth client-side usage

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${apiUrl}/api`;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:4000';
  return `${apiUrl}/api`;
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

// Get token from localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Set token in localStorage
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

// Get user from localStorage
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Set user in localStorage
export function setUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_user', JSON.stringify(user));
}

// Login function
export async function login(email: string, password: string): Promise<AuthSession> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  const session: AuthSession = {
    user: data.user,
    accessToken: data.access_token,
  };

  // Store token and user
  setToken(session.accessToken);
  setUser(session.user);

  // Set cookie for server-side access
  if (typeof document !== 'undefined') {
    document.cookie = `auth_token=${session.accessToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  }

  return session;
}

// Logout function
export function logout(): void {
  removeToken();
  // Remove cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
  }
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/signin';
  }
}

// Get current session
export function getSession(): AuthSession | null {
  const token = getToken();
  const user = getUser();
  if (!token || !user) return null;
  return { user, accessToken: token };
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser();
}

// Fetch with authentication
export async function fetchWithAuth(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const token = getToken();
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

