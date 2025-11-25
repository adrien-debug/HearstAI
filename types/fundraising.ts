export interface Investor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: 'lead' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'closed' | 'declined'
  investmentInterest?: number // Montant d'intérêt en euros
  notes?: string
  tags?: string[]
  documents?: Document[]
  interactions?: EmailInteraction[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  name: string
  type: 'pitch-deck' | 'financial' | 'contract' | 'other'
  file: File | string // File object ou URL/base64
  uploadedAt: string
  size?: number
  mimeType?: string
}

export interface EmailInteraction {
  id: string
  subject: string
  body: string
  sentAt: string
  attachments?: string[] // IDs des documents attachés
  status: 'sent' | 'delivered' | 'opened' | 'replied'
  reply?: {
    receivedAt: string
    body: string
  }
}

export interface FundraisingStats {
  totalInvestors: number
  leads: number
  contacted: number
  meetings: number
  proposals: number
  totalInterest: number // Somme des montants d'intérêt
}

