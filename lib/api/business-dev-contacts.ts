// Utiliser l'API Next.js qui fait le proxy vers Railway
const API_BASE = '/api/business-dev/contacts'

export interface BusinessDevContact {
  id: string
  name: string
  company: string
  email: string
  phone?: string | null
  status: 'active' | 'pending' | 'inactive'
  estimatedValue?: string | null
  lastContact: string
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateContactData {
  name: string
  company: string
  email: string
  phone?: string
  status?: 'active' | 'pending' | 'inactive'
  estimatedValue?: string
  notes?: string
}

export interface UpdateContactData extends Partial<CreateContactData> {
  lastContact?: string
}

export const businessDevContactsAPI = {
  // Récupérer tous les contacts
  async getAll(params?: {
    status?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<{ contacts: BusinessDevContact[]; count: number; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.search) searchParams.append('search', params.search)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const response = await fetch(`${API_BASE}?${searchParams.toString()}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la récupération des contacts')
    }
    return response.json()
  },

  // Récupérer un contact par ID
  async getById(id: string): Promise<BusinessDevContact> {
    const response = await fetch(`${API_BASE}/${id}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la récupération du contact')
    }
    const data = await response.json()
    return data.contact
  },

  // Créer un nouveau contact
  async create(data: CreateContactData): Promise<BusinessDevContact> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création du contact')
    }
    const result = await response.json()
    return result.contact
  },

  // Mettre à jour un contact
  async update(id: string, data: UpdateContactData): Promise<BusinessDevContact> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour du contact')
    }
    const result = await response.json()
    return result.contact
  },

  // Supprimer un contact
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression du contact')
    }
  },
}

