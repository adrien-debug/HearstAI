// Business Development API Client
// Uses the main API client to call the NestJS backend

import { fetchAPI } from '../api'

const API_BASE = '/business-dev'

// ========== TYPES ==========

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

export interface BusinessDevDeal {
  id: string
  title: string
  contactId: string
  contact?: BusinessDevContact
  stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed'
  status: 'open' | 'won' | 'lost'
  estimatedValue?: number | null
  currency: string
  probability: number
  expectedCloseDate?: string | null
  actualCloseDate?: string | null
  tags?: string[] | null
  notes?: string | null
  userId?: string | null
  createdAt: string
  updatedAt: string
}

export interface BusinessDevActivity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'proposal' | 'follow_up'
  title: string
  description?: string | null
  contactId?: string | null
  contact?: BusinessDevContact | null
  dealId?: string | null
  deal?: BusinessDevDeal | null
  activityDate: string
  duration?: number | null
  userId?: string | null
  createdAt: string
  updatedAt: string
}

export interface BusinessDevTask {
  id: string
  title: string
  description?: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  contactId?: string | null
  contact?: BusinessDevContact | null
  dealId?: string | null
  deal?: BusinessDevDeal | null
  dueDate?: string | null
  completedAt?: string | null
  userId?: string | null
  createdAt: string
  updatedAt: string
}

export interface Metrics {
  totalContacts: { value: number; change: number }
  pipelineValue: { value: number; change: number }
  conversionRate: { value: number; change: number }
  activeDeals: { value: number; change: number }
  revenueThisMonth: { value: number; change: number }
  avgCycleTime: { value: number; change: number }
}

export interface Pipeline {
  prospect: Array<{
    id: string
    title: string
    contactName: string
    company: string
    value: number
    currency: string
    stage: string
    tags: string[]
    probability: number
    expectedCloseDate?: string | null
    updatedAt: string
  }>
  qualification: Array<{
    id: string
    title: string
    contactName: string
    company: string
    value: number
    currency: string
    stage: string
    tags: string[]
    probability: number
    expectedCloseDate?: string | null
    updatedAt: string
  }>
  proposal: Array<{
    id: string
    title: string
    contactName: string
    company: string
    value: number
    currency: string
    stage: string
    tags: string[]
    probability: number
    expectedCloseDate?: string | null
    updatedAt: string
  }>
  negotiation: Array<{
    id: string
    title: string
    contactName: string
    company: string
    value: number
    currency: string
    stage: string
    tags: string[]
    probability: number
    expectedCloseDate?: string | null
    updatedAt: string
  }>
  closed: Array<{
    id: string
    title: string
    contactName: string
    company: string
    value: number
    currency: string
    stage: string
    tags: string[]
    probability: number
    expectedCloseDate?: string | null
    updatedAt: string
  }>
}

// ========== CONTACTS ==========

export const contactsAPI = {
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

    return fetchAPI(`${API_BASE}/contacts?${searchParams.toString()}`)
  },

  async getById(id: string): Promise<BusinessDevContact> {
    const data = await fetchAPI<{ contact: BusinessDevContact }>(`${API_BASE}/contacts/${id}`)
    return data.contact
  },

  async create(data: {
    name: string
    company: string
    email: string
    phone?: string
    status?: 'active' | 'pending' | 'inactive'
    estimatedValue?: string
    notes?: string
  }): Promise<BusinessDevContact> {
    const result = await fetchAPI<{ success: boolean; contact: BusinessDevContact }>(
      `${API_BASE}/contacts`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return result.contact
  },

  async update(id: string, data: Partial<BusinessDevContact>): Promise<BusinessDevContact> {
    const result = await fetchAPI<{ success: boolean; contact: BusinessDevContact }>(
      `${API_BASE}/contacts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return result.contact
  },

  async delete(id: string): Promise<void> {
    await fetchAPI(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========== DEALS ==========

export const dealsAPI = {
  async getAll(params?: {
    stage?: string
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ deals: BusinessDevDeal[]; count: number; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.stage) searchParams.append('stage', params.stage)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    return fetchAPI(`${API_BASE}/deals?${searchParams.toString()}`)
  },

  async getById(id: string): Promise<BusinessDevDeal> {
    const data = await fetchAPI<{ deal: BusinessDevDeal }>(`${API_BASE}/deals/${id}`)
    return data.deal
  },

  async create(data: {
    title: string
    contactId: string
    stage?: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed'
    estimatedValue?: number
    currency?: string
    probability?: number
    expectedCloseDate?: string
    tags?: string[]
    notes?: string
  }): Promise<BusinessDevDeal> {
    const result = await fetchAPI<{ success: boolean; deal: BusinessDevDeal }>(
      `${API_BASE}/deals`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return result.deal
  },

  async update(id: string, data: Partial<BusinessDevDeal>): Promise<BusinessDevDeal> {
    const result = await fetchAPI<{ success: boolean; deal: BusinessDevDeal }>(
      `${API_BASE}/deals/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return result.deal
  },

  async updateStage(id: string, stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed'): Promise<BusinessDevDeal> {
    const result = await fetchAPI<{ success: boolean; deal: BusinessDevDeal }>(
      `${API_BASE}/deals/${id}/stage`,
      {
        method: 'PUT',
        body: JSON.stringify({ stage }),
      }
    )
    return result.deal
  },

  async delete(id: string): Promise<void> {
    await fetchAPI(`${API_BASE}/deals/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========== ACTIVITIES ==========

export const activitiesAPI = {
  async getAll(params?: {
    contactId?: string
    dealId?: string
    type?: string
    limit?: number
    offset?: number
  }): Promise<{ activities: BusinessDevActivity[]; count: number; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.contactId) searchParams.append('contactId', params.contactId)
    if (params?.dealId) searchParams.append('dealId', params.dealId)
    if (params?.type) searchParams.append('type', params.type)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    return fetchAPI(`${API_BASE}/activities?${searchParams.toString()}`)
  },

  async getById(id: string): Promise<BusinessDevActivity> {
    const data = await fetchAPI<{ activity: BusinessDevActivity }>(`${API_BASE}/activities/${id}`)
    return data.activity
  },

  async create(data: {
    type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'proposal' | 'follow_up'
    title: string
    description?: string
    contactId?: string
    dealId?: string
    activityDate?: string
    duration?: number
  }): Promise<BusinessDevActivity> {
    const result = await fetchAPI<{ success: boolean; activity: BusinessDevActivity }>(
      `${API_BASE}/activities`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return result.activity
  },

  async update(id: string, data: Partial<BusinessDevActivity>): Promise<BusinessDevActivity> {
    const result = await fetchAPI<{ success: boolean; activity: BusinessDevActivity }>(
      `${API_BASE}/activities/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return result.activity
  },

  async delete(id: string): Promise<void> {
    await fetchAPI(`${API_BASE}/activities/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========== TASKS ==========

export const tasksAPI = {
  async getAll(params?: {
    status?: string
    contactId?: string
    dealId?: string
    limit?: number
    offset?: number
  }): Promise<{ tasks: BusinessDevTask[]; count: number; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.contactId) searchParams.append('contactId', params.contactId)
    if (params?.dealId) searchParams.append('dealId', params.dealId)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    return fetchAPI(`${API_BASE}/tasks?${searchParams.toString()}`)
  },

  async getById(id: string): Promise<BusinessDevTask> {
    const data = await fetchAPI<{ task: BusinessDevTask }>(`${API_BASE}/tasks/${id}`)
    return data.task
  },

  async create(data: {
    title: string
    description?: string
    contactId?: string
    dealId?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string
  }): Promise<BusinessDevTask> {
    const result = await fetchAPI<{ success: boolean; task: BusinessDevTask }>(
      `${API_BASE}/tasks`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
    return result.task
  },

  async update(id: string, data: Partial<BusinessDevTask>): Promise<BusinessDevTask> {
    const result = await fetchAPI<{ success: boolean; task: BusinessDevTask }>(
      `${API_BASE}/tasks/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    )
    return result.task
  },

  async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<BusinessDevTask> {
    const result = await fetchAPI<{ success: boolean; task: BusinessDevTask }>(
      `${API_BASE}/tasks/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    )
    return result.task
  },

  async delete(id: string): Promise<void> {
    await fetchAPI(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========== METRICS & OVERVIEW ==========

export const metricsAPI = {
  async getMetrics(): Promise<Metrics> {
    return fetchAPI(`${API_BASE}/metrics`)
  },

  async getRecentActivities(limit: number = 10): Promise<{ activities: any[] }> {
    return fetchAPI(`${API_BASE}/overview/activities?limit=${limit}`)
  },

  async getUpcomingTasks(limit: number = 10): Promise<{ tasks: any[] }> {
    return fetchAPI(`${API_BASE}/overview/tasks?limit=${limit}`)
  },
}

// ========== PIPELINE ==========

export const pipelineAPI = {
  async getPipeline(): Promise<{ pipeline: Pipeline }> {
    return fetchAPI(`${API_BASE}/pipeline`)
  },
}

// ========== LEGACY EXPORT (for backward compatibility) ==========

export const businessDevContactsAPI = contactsAPI


