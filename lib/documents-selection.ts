// Gestion globale des sélections de documents
const STORAGE_KEY = 'hearst_documents_to_send'

export interface DocumentToSend {
  id: string
  name: string
  category: string
  size: string
  uploaded: string
  client?: string
}

export const getDocumentsToSend = (): DocumentToSend[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const addDocumentToSend = (doc: DocumentToSend) => {
  if (typeof window === 'undefined') return
  const current = getDocumentsToSend()
  if (!current.find(d => d.id === doc.id)) {
    const updated = [...current, doc]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('documents-selection-changed'))
  }
}

export const removeDocumentFromSend = (docId: string) => {
  if (typeof window === 'undefined') return
  const current = getDocumentsToSend()
  const updated = current.filter(d => d.id !== docId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('documents-selection-changed'))
}

export const clearDocumentsToSend = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('documents-selection-changed'))
}

export const isDocumentInSend = (docId: string): boolean => {
  const current = getDocumentsToSend()
  return current.some(d => d.id === docId)
}




