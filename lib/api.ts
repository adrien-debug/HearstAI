// API Client for Next.js API Routes
// Replaces the old frontend/js/api.js

// Helper pour obtenir l'URL de base de l'API
// Next.js injecte NEXT_PUBLIC_* dans le code au moment du build
// Priority: Always use Next.js API routes (port 6001) for Next.js endpoints
// The NestJS backend (port 4000) should only be used for specific backend-only endpoints
const getBaseUrl = () => {
  // En client-side, TOUJOURS utiliser les routes Next.js API (port 6001)
  // Ne pas utiliser NEXT_PUBLIC_API_URL si elle pointe vers le backend NestJS (port 4000)
  // Cela garantit que les appels API utilisent les routes Next.js, pas le backend NestJS
  if (typeof window !== 'undefined') {
    // Toujours utiliser l'URL absolue basée sur l'origine actuelle (Next.js app)
    return `${window.location.origin}/api`
  }
  
  // Côté serveur, utiliser la route relative Next.js
  return '/api'
  
  // Note: Si vous avez besoin d'appeler le backend NestJS (port 4000) pour certaines routes spécifiques,
  // créez une fonction séparée getBackendUrl() et utilisez-la uniquement pour ces routes.
  // Pour les routes Next.js comme /api/customers, /api/collateral, etc., utilisez toujours getBaseUrl()
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
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
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

// Cockpit API
export const cockpitAPI = {
  getData: () => fetchAPI<any>('/cockpit'),
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
