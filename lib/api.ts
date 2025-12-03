// API Client for NestJS Backend
// All API calls go directly to the NestJS backend (port 4000)

// Helper pour obtenir l'URL de base de l'API NestJS
const getBaseUrl = () => {
  // Use NEXT_PUBLIC_API_URL if set, otherwise default to localhost:4000 for development
  // In production, this should be set to the production backend URL
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default to localhost:4000
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    return `${apiUrl}/api`
  }
  
  // Server-side: use environment variable or default to localhost:4000
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:4000'
  return `${apiUrl}/api`
}

// Helper to get auth token (client-side only)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Helper to get user ID (client-side only)
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id;
  } catch {
    return null;
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  // Always log in development for debugging
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
    console.log(`[API] Calling: ${url}`, {
      baseUrl,
      endpoint,
      fullUrl: url,
      usingRailway: baseUrl.includes('railway.app') || baseUrl.includes('railway'),
      usingLocal: baseUrl.includes('localhost') || baseUrl.startsWith('/api'),
    })
  }
  
  // Get auth token if available (client-side)
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`
      
      try {
        const text = await response.text()
        try {
          const errorData = JSON.parse(text)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          errorMessage = text || errorMessage
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      throw new Error(errorMessage)
    }

    const jsonData = await response.json()
    return jsonData
  } catch (error) {
    // Gérer les erreurs de réseau (Failed to fetch, CORS, etc.)
    if (error instanceof TypeError && (
      error.message === 'Failed to fetch' || 
      error.message.includes('fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed')
    )) {
      throw new Error(
        `Impossible de se connecter au serveur à ${url}. Vérifiez que le serveur est démarré et accessible.`
      )
    }
    
    // Re-lancer les autres erreurs telles quelles
    throw error
  }
}

// File upload helper for portfolio images
export async function uploadPortfolioImage(
  file: File,
  sectionId: string,
  metadata?: {
    title?: string;
    description?: string;
    alt?: string;
    category?: string;
  }
): Promise<any> {
  const userId = getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('sectionId', sectionId);
  if (metadata?.title) formData.append('title', metadata.title);
  if (metadata?.description) formData.append('description', metadata.description);
  if (metadata?.alt) formData.append('alt', metadata.alt);
  if (metadata?.category) formData.append('category', metadata.category);

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/portfolio/upload?userId=${userId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type for FormData, browser will set it with boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Projects API
export const projectsAPI = {
  getAll: () => fetchAPI<{ projects: any[] }>('/projects'),
  getById: (id: string) => fetchAPI<{ project: any }>(`/projects/${id}`),
  create: (data: any) => fetchAPI<{ project: any }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<{ project: any }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
}

// Jobs API
export const jobsAPI = {
  getAll: () => fetchAPI<{ jobs: any[]; total: number }>('/jobs'),
  getById: (id: string) => fetchAPI<{ job: any }>(`/jobs/${id}`),
  create: (data: any) => fetchAPI<{ job: any; message: string }>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  execute: (id: string) => fetchAPI<{ message: string; jobId: string }>(`/jobs/${id}/execute`, { method: 'POST' }),
  cancel: (id: string) => fetchAPI<{ job: any; message: string }>(`/jobs/${id}`, { method: 'DELETE' }),
}

// Versions API
export const versionsAPI = {
  getByProject: (projectId: string) => fetchAPI<{ versions: any[] }>(`/versions?projectId=${projectId}`),
  getById: (id: string) => fetchAPI<{ version: any }>(`/versions/${id}`),
  create: (data: any) => fetchAPI<{ version: any }>('/versions', { method: 'POST', body: JSON.stringify(data) }),
}

// Stats API
export const statsAPI = {
  getStats: () => fetchAPI<{ stats: {
    total_projects: number
    total_versions: number
    total_jobs: number
    jobs_running: number
    jobs_success_rate: number
    last_7_days_jobs: number
    total_storage_mb: number
  } }>('/stats'),
}

// Health check
export const healthAPI = {
  check: () => fetchAPI('/health'),
}

// Electricity API
export async function getElectricity() {
  try {
    return await fetchAPI<any>('/electricity')
  } catch (error) {
    return {
      data: null,
      message: 'Electricity API not implemented yet',
    }
  }
}

// Collateral API
export const collateralAPI = {
  getAll: (wallets?: string[], chains?: string[], protocols?: string[]) => {
    const params = new URLSearchParams()
    if (wallets && wallets.length > 0) {
      params.append('wallets', wallets.join(','))
    }
    if (chains && chains.length > 0) {
      params.append('chains', chains.join(','))
    }
    if (protocols && protocols.length > 0) {
      params.append('protocols', protocols.join(','))
    }
    const queryString = params.toString()
    const endpoint = `/collateral${queryString ? `?${queryString}` : ''}`
    return fetchAPI<any>(endpoint)
  },
}

// Customers API
export const customersAPI = {
  getAll: () => fetchAPI<{ customers: any[] }>('/customers'),
  getById: (id: string) => fetchAPI<{ customer: any }>(`/customers/${id}`),
  create: (data: { name: string; erc20Address: string; tag?: string; chains?: string[]; protocols?: string[] }) => 
    fetchAPI<{ customer: any }>('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { name?: string; erc20Address?: string; tag?: string; chains?: string[]; protocols?: string[] }) => 
    fetchAPI<{ customer: any }>(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/customers/${id}`, { method: 'DELETE' }),
}

// Portfolio API
export const portfolioAPI = {
  getSections: (userId: string) => fetchAPI<{ sections: any[] }>(`/portfolio/sections?userId=${userId}`),
  getSectionById: (id: string, userId: string) => fetchAPI<{ section: any }>(`/portfolio/sections/${id}?userId=${userId}`),
  createSection: (userId: string, data: any) => fetchAPI<{ section: any }>(`/portfolio/sections?userId=${userId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateSection: (id: string, userId: string, data: any) => fetchAPI<{ section: any }>(`/portfolio/sections/${id}?userId=${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSection: (id: string, userId: string) => fetchAPI(`/portfolio/sections/${id}?userId=${userId}`, { method: 'DELETE' }),
  getImages: (sectionId: string, userId: string) => fetchAPI<{ images: any[] }>(`/portfolio/images?sectionId=${sectionId}&userId=${userId}`),
  getImageById: (id: string, userId: string) => fetchAPI<{ image: any }>(`/portfolio/images/${id}?userId=${userId}`),
  createImage: (userId: string, data: any) => fetchAPI<{ image: any }>(`/portfolio/images?userId=${userId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateImage: (id: string, userId: string, data: any) => fetchAPI<{ image: any }>(`/portfolio/images/${id}?userId=${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteImage: (id: string, userId: string) => fetchAPI(`/portfolio/images/${id}?userId=${userId}`, { method: 'DELETE' }),
  uploadImage: uploadPortfolioImage,
}

// Contracts API
export const contractsAPI = {
  getAll: (userId?: string, status?: string) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (status) params.append('status', status)
    const queryString = params.toString()
    return fetchAPI<{ contracts: any[] }>(`/contracts${queryString ? `?${queryString}` : ''}`)
  },
  getActive: (userId?: string) => {
    const queryString = userId ? `?userId=${userId}` : ''
    return fetchAPI<{ contracts: any[] }>(`/contracts/active${queryString}`)
  },
  getById: (id: string) => fetchAPI<{ contract: any }>(`/contracts/${id}`),
  create: (data: any) => fetchAPI<{ contract: any }>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<{ contract: any }>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/contracts/${id}`, { method: 'DELETE' }),
}

// Events API
export const eventsAPI = {
  getAll: (userId?: string, type?: string, startDate?: string, endDate?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (type) params.append('type', type)
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    if (limit) params.append('limit', limit.toString())
    const queryString = params.toString()
    return fetchAPI<{ events: any[]; count: number }>(`/events${queryString ? `?${queryString}` : ''}`)
  },
  getById: (id: string) => fetchAPI<{ event: any }>(`/events/${id}`),
  getRecentAlerts: (limit?: number) => {
    const queryString = limit ? `?limit=${limit}` : ''
    return fetchAPI<{ events: any[]; count: number }>(`/events/alerts${queryString}`)
  },
  create: (data: any) => fetchAPI<{ event: any }>('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<{ event: any }>(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/events/${id}`, { method: 'DELETE' }),
}

// Cockpit API
export const cockpitAPI = {
  getData: () => fetchAPI<any>('/cockpit'),
  getEarningsChart: (timeframe?: string) => fetchAPI<any>(`/cockpit/earnings-chart${timeframe ? `?timeframe=${timeframe}` : ''}`),
  getHashrateChart: (timeframe?: string) => fetchAPI<any>(`/cockpit/hashrate-chart${timeframe ? `?timeframe=${timeframe}` : ''}`),
  getIncidents: () => fetchAPI<any>('/cockpit/incidents'),
}

// DeBank API Health Check
export const debankAPI = {
  health: () => fetchAPI<{ 
    status: 'operational' | 'error' | 'not_configured'
    configured: boolean
    message: string
    testResult?: any
    error?: string
    instructions?: string[]
  }>('/debank/health'),
}

// Fireblocks API
export const fireblocksAPI = {
  getVaults: (vaultId?: string) => {
    const url = vaultId ? `/fireblocks/vaults?id=${vaultId}` : '/fireblocks/vaults'
    return fetchAPI<{ success: boolean; data: any }>(url)
  },
  getTransaction: (txId: string) => {
    return fetchAPI<{ success: boolean; data: any }>(`/fireblocks/transactions?id=${txId}`)
  },
  createTransaction: (transactionRequest: any) => {
    return fetchAPI<{ success: boolean; data: any }>('/fireblocks/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionRequest),
    })
  },
}

// Data Analysis API
export const dataAnalysisAPI = {
  analyze: (identifier: string) => fetchAPI<any>(`/data-analysis/${identifier}`),
}

// Users API
export const usersAPI = {
  initUser: () => fetchAPI<any>('/init-user'),
}
