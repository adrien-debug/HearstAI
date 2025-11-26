'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { addDocumentToSend, removeDocumentFromSend, isDocumentInSend, clearDocumentsToSend, getDocumentsToSend } from '@/lib/documents-selection'
import '@/components/documents-vault/DocumentsVault.css'

// Icônes SVG vectorielles en vert
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClientIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 6 9 17 4 12" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CancelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const categories = [
  {
    id: 'contracts',
    name: 'Contrats',
    count: 156,
    size: '8.4 GB',
    description: 'Contrats et accords miniers',
  },
  {
    id: 'invoices',
    name: 'Factures',
    count: 269,
    size: '2.6 GB',
    description: 'Factures et reçus',
  },
  {
    id: 'reports',
    name: 'Rapports',
    count: 234,
    size: '12.3 GB',
    description: 'Rapports mensuels et trimestriels',
  },
  {
    id: 'financial',
    name: 'Financier',
    count: 189,
    size: '9.8 GB',
    description: 'États financiers et audits',
  },
  {
    id: 'technical',
    name: 'Technique',
    count: 312,
    size: '6.2 GB',
    description: 'Spécifications et manuels techniques',
  },
  {
    id: 'legal',
    name: 'Juridique',
    count: 87,
    size: '3.5 GB',
    description: 'Documents juridiques et certificats',
  },
  {
    id: 'archive',
    name: 'Archives',
    count: 145,
    size: '5.8 GB',
    description: 'Documents archivés et historiques',
  },
  {
    id: 'certificates',
    name: 'Certificats',
    count: 98,
    size: '2.1 GB',
    description: 'Certificats et accréditations',
  },
]

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string
  const category = categories.find(c => c.id === categoryId)

  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Contrat_Mining_2024.pdf',
      category: 'Contrats',
      size: '2.4 MB',
      uploaded: '2025-01-15',
      client: 'Client A',
    },
    {
      id: '2',
      name: 'Contrat_Partenaire_2024.pdf',
      category: 'Contrats',
      size: '1.8 MB',
      uploaded: '2025-01-14',
      client: 'Client B',
    },
    {
      id: '3',
      name: 'Contrat_Service_2024.pdf',
      category: 'Contrats',
      size: '3.2 MB',
      uploaded: '2025-01-13',
      client: 'Client A',
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'name' | 'client' | null>(null)
  const [editName, setEditName] = useState('')
  const [editClient, setEditClient] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterClient, setFilterClient] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'client'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedCount, setSelectedCount] = useState(0)

  useEffect(() => {
    // Filtrer les documents par catégorie
    if (category) {
      // En production, charger depuis l'API
      const categoryDocs = documents.filter(doc => doc.category === category.name)
      setDocuments(categoryDocs)
    }
    
    // Mettre à jour le compteur de sélection
    const updateCount = () => {
      setSelectedCount(getDocumentsToSend().length)
    }
    updateCount()
    window.addEventListener('documents-selection-changed', updateCount)
    return () => window.removeEventListener('documents-selection-changed', updateCount)
  }, [categoryId])

  if (!category) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Catégorie non trouvée</h1>
            <button className="documents-btn" onClick={() => router.push('/documents-vault')}>
              Retour à la vue d'ensemble
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleEdit = (doc: typeof documents[0], field: 'name' | 'client') => {
    setEditingId(doc.id)
    setEditingField(field)
    if (field === 'name') {
      setEditName(doc.name)
    } else {
      setEditClient(doc.client || '')
    }
  }

  const handleSave = (id: string) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === id) {
        if (editingField === 'name') {
          return { ...doc, name: editName }
        } else {
          return { ...doc, client: editClient }
        }
      }
      return doc
    }))
    setEditingId(null)
    setEditingField(null)
    setEditName('')
    setEditClient('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingField(null)
    setEditName('')
    setEditClient('')
  }

  // Récupérer la liste unique des clients
  const clients = Array.from(new Set(documents.map(doc => doc.client).filter(Boolean)))

  // Gérer le dossier à envoyer (global)
  const toggleDocumentToSend = (doc: typeof documents[0]) => {
    if (isDocumentInSend(doc.id)) {
      removeDocumentFromSend(doc.id)
    } else {
      addDocumentToSend({
        id: doc.id,
        name: doc.name,
        category: doc.category,
        size: doc.size,
        uploaded: doc.uploaded,
        client: doc.client,
      })
    }
    setSelectedCount(getDocumentsToSend().length)
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.client && doc.client.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesClient = filterClient === 'all' || doc.client === filterClient
    return matchesSearch && matchesClient
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === 'date') {
      comparison = a.uploaded.localeCompare(b.uploaded)
    } else if (sortBy === 'size') {
      const sizeA = parseFloat(a.size.replace(/[^\d.]/g, ''))
      const sizeB = parseFloat(b.size.replace(/[^\d.]/g, ''))
      comparison = sizeA - sizeB
    } else if (sortBy === 'client') {
      const clientA = a.client || ''
      const clientB = b.client || ''
      comparison = clientA.localeCompare(clientB)
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const totalSize = sortedDocuments.reduce((sum, doc) => {
    const size = parseFloat(doc.size.replace(/[^\d.]/g, ''))
    return sum + size
  }, 0).toFixed(2)

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <button
                className="documents-btn-secondary"
                onClick={() => router.push('/documents-vault')}
                style={{ marginBottom: 'var(--space-3)' }}
              >
                ← Retour
              </button>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-2)' }}>
                {category.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                {category.description} • {category.count} documents • {category.size}
              </p>
            </div>
          </div>
        </div>

        {/* Recherche et tri */}
        <div className="documents-card" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="documents-card-body">
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <label className="documents-label">Rechercher</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="Rechercher par nom de document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ minWidth: '200px' }}>
                <label className="documents-label">Filtrer par client</label>
                <select
                  className="documents-select"
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="all">Tous les clients</option>
                  {clients.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: '200px' }}>
                <label className="documents-label">Trier par</label>
                <select
                  className="documents-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size' | 'client')}
                  style={{ width: '100%' }}
                >
                  <option value="name">Nom</option>
                  <option value="client">Client</option>
                  <option value="date">Date</option>
                  <option value="size">Taille</option>
                </select>
              </div>
              <div>
                <label className="documents-label">Ordre</label>
                <button
                  className="documents-btn-secondary"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  style={{ padding: 'var(--space-3) var(--space-4)' }}
                >
                  {sortOrder === 'asc' ? '↑ Croissant' : '↓ Décroissant'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur de sélection globale */}
        {selectedCount > 0 && (
          <div className="documents-card" style={{ marginBottom: 'var(--space-4)', border: '1px solid rgba(197, 255, 167, 0.3)' }}>
            <div className="documents-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#C5FFA7', fontWeight: 'var(--font-semibold)' }}>
                    {selectedCount} document{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    dans toutes les catégories
                  </span>
                </div>
                <button
                  className="documents-btn"
                  onClick={() => {
                    router.push('/documents-vault')
                    setTimeout(() => {
                      const shareTab = document.querySelector('[data-tab="share"]') as HTMLElement
                      if (shareTab) shareTab.click()
                    }, 100)
                  }}
                >
                  Aller à la page Partager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau premium avec édition */}
        <div className="premium-transaction-table-container">
          <table className="premium-transaction-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>À envoyer</th>
                <th>Date</th>
                <th>Nom du document</th>
                <th>Client</th>
                <th>Taille</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.length > 0 ? (
                sortedDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isDocumentInSend(doc.id)}
                        onChange={() => toggleDocumentToSend(doc)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#C5FFA7',
                        }}
                        title="Ajouter au dossier à envoyer"
                      />
                    </td>
                    <td>{doc.uploaded}</td>
                    <td>
                      {editingId === doc.id && editingField === 'name' ? (
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="documents-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ flex: 1, fontSize: 'var(--text-sm)', padding: 'var(--space-2)' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(doc.id)
                              if (e.key === 'Escape') handleCancel()
                            }}
                            autoFocus
                          />
                          <button
                            className="documents-btn"
                            onClick={() => handleSave(doc.id)}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <SaveIcon />
                          </button>
                          <button
                            className="documents-btn-secondary"
                            onClick={handleCancel}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <CancelIcon />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                            {doc.name}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === doc.id && editingField === 'client' ? (
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="documents-input"
                            value={editClient}
                            onChange={(e) => setEditClient(e.target.value)}
                            placeholder="Nom du client"
                            style={{ flex: 1, fontSize: 'var(--text-sm)', padding: 'var(--space-2)' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(doc.id)
                              if (e.key === 'Escape') handleCancel()
                            }}
                            autoFocus
                          />
                          <button
                            className="documents-btn"
                            onClick={() => handleSave(doc.id)}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <SaveIcon />
                          </button>
                          <button
                            className="documents-btn-secondary"
                            onClick={handleCancel}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <CancelIcon />
                          </button>
                        </div>
                      ) : (
                        <span 
                          style={{ 
                            color: doc.client ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontStyle: doc.client ? 'normal' : 'italic',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEdit(doc, 'client')}
                        >
                          {doc.client || 'Cliquer pour ajouter un client'}
                        </span>
                      )}
                    </td>
                    <td className="premium-transaction-amount">{doc.size}</td>
                    <td>
                      {editingId === doc.id ? null : (
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <button
                            className="documents-btn-secondary"
                            onClick={() => handleEdit(doc, 'name')}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <EditIcon />
                            <span>Nom</span>
                          </button>
                          <button
                            className="documents-btn-secondary"
                            onClick={() => handleEdit(doc, 'client')}
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <ClientIcon />
                            <span>Client</span>
                          </button>
                          <button
                            className="documents-btn-secondary"
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                          >
                            <DownloadIcon />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                    Aucun document trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="premium-transaction-total">
            <strong>Total: <span className="premium-transaction-total-amount">{totalSize} MB</span></strong>
            <span style={{ marginLeft: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              {sortedDocuments.length} document(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

