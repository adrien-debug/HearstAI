'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addDocumentToSend, removeDocumentFromSend, isDocumentInSend, getDocumentsToSend } from '@/lib/documents-selection'

// Icônes SVG premium en vert
const ContractIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H8" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InvoiceIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15l3 3 6-6" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ReportIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9h18" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V9" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15h3" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18h3" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FinancialIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6v6l4 2" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12h8" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TechnicalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9h6v6H9z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LegalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17l10 5 10-5" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArchiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="4" rx="1" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12h4" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CertificateIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v5h5" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15l2 2 4-4" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function DocumentsVaultOverview() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      setSelectedCount(getDocumentsToSend().length)
    }
    updateCount()
    window.addEventListener('documents-selection-changed', updateCount)
    return () => window.removeEventListener('documents-selection-changed', updateCount)
  }, [])

  const categories = [
    {
      id: 'contracts',
      name: 'Contrats',
      count: 156,
      size: '8.4 GB',
      color: '#C5FFA7',
      description: 'Contrats et accords miniers',
      icon: ContractIcon,
    },
    {
      id: 'invoices',
      name: 'Factures',
      count: 269,
      size: '2.6 GB',
      color: '#4a9eff',
      description: 'Factures et reçus',
      icon: InvoiceIcon,
    },
    {
      id: 'reports',
      name: 'Rapports',
      count: 234,
      size: '12.3 GB',
      color: '#FFA500',
      description: 'Rapports mensuels et trimestriels',
      icon: ReportIcon,
    },
    {
      id: 'financial',
      name: 'Financier',
      count: 189,
      size: '9.8 GB',
      color: '#FF4D4D',
      description: 'États financiers et audits',
      icon: FinancialIcon,
    },
    {
      id: 'technical',
      name: 'Technique',
      count: 312,
      size: '6.2 GB',
      color: '#9d4edd',
      description: 'Spécifications et manuels techniques',
      icon: TechnicalIcon,
    },
    {
      id: 'legal',
      name: 'Juridique',
      count: 87,
      size: '3.5 GB',
      color: '#06d6a0',
      description: 'Documents juridiques et certificats',
      icon: LegalIcon,
    },
    {
      id: 'archive',
      name: 'Archives',
      count: 145,
      size: '5.8 GB',
      color: '#C5FFA7',
      description: 'Documents archivés et historiques',
      icon: ArchiveIcon,
    },
    {
      id: 'certificates',
      name: 'Certificats',
      count: 98,
      size: '2.1 GB',
      color: '#C5FFA7',
      description: 'Certificats et accréditations',
      icon: CertificateIcon,
    },
  ]

  const documents = [
    {
      id: '1',
      name: 'Contrat_Mining_2024.pdf',
      category: 'Contrats',
      size: '2.4 MB',
      uploaded: '2025-01-15',
    },
    {
      id: '2',
      name: 'Rapport_Electricite_Q4.xlsx',
      category: 'Rapports',
      size: '1.8 MB',
      uploaded: '2025-01-14',
    },
    {
      id: '3',
      name: 'Specifications_Materiel.docx',
      category: 'Technique',
      size: '3.2 MB',
      uploaded: '2025-01-13',
    },
    {
      id: '4',
      name: 'Audit_Financier_2024.pdf',
      category: 'Financier',
      size: '5.6 MB',
      uploaded: '2025-01-12',
    },
    {
      id: '5',
      name: 'Facture_Janvier_2025.pdf',
      category: 'Factures',
      size: '892 KB',
      uploaded: '2025-01-10',
    },
  ]

  // Filtrer les documents par recherche rapide
  const filteredDocuments = documents.filter(doc => {
    return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalSize = filteredDocuments.reduce((sum, doc) => {
    const size = parseFloat(doc.size.replace(/[^\d.]/g, ''))
    return sum + size
  }, 0).toFixed(2)

  return (
    <div>
      {/* Catégories en boîtes */}
      <div className="documents-grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {categories.map((category) => (
          <div
            key={category.id}
            className="documents-card"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              // Naviguer vers la page de la catégorie
              router.push(`/documents-vault/${category.id}`)
            }}
          >
            {/* Titre en haut - blanc, plus grand */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-bold)', 
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                {category.name}
              </div>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(197, 255, 167, 0.15)',
                border: '1px solid rgba(197, 255, 167, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(197, 255, 167, 0.2)',
              }}>
                {(() => {
                  const IconComponent = category.icon
                  return <IconComponent />
                })()}
              </div>
            </div>
            
            {/* Chiffre en dessous - vert, plus petit */}
            <div style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 'var(--font-bold)', 
              color: '#C5FFA7',
              marginBottom: 'var(--space-2)',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {category.count}
            </div>
            
            {/* Description */}
            <div className="documents-file-meta" style={{ marginBottom: 'var(--space-3)' }}>
              {category.description}
            </div>
            
            {/* Taille en bas */}
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: 'var(--text-sm)', 
              fontFamily: 'var(--font-mono)',
              marginTop: 'var(--space-2)'
            }}>
              {category.size}
            </div>
          </div>
        ))}
      </div>

      {/* Recherche rapide */}
      <div className="documents-card" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
        <div className="documents-card-body">
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="documents-input"
                placeholder="Recherche rapide par nom ou catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            {searchQuery && (
              <button
                className="documents-btn-secondary"
                onClick={() => setSearchQuery('')}
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tableau premium des documents - Recherche rapide */}
      <div className="premium-transaction-table-container" style={{ marginTop: 'var(--space-4)' }}>
        <table className="premium-transaction-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>À envoyer</th>
                <th>Date</th>
                <th>Nom du document</th>
                <th>Catégorie</th>
                <th>Taille</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isDocumentInSend(doc.id)}
                        onChange={() => {
                          if (isDocumentInSend(doc.id)) {
                            removeDocumentFromSend(doc.id)
                          } else {
                            addDocumentToSend({
                              id: doc.id,
                              name: doc.name,
                              category: doc.category,
                              size: doc.size,
                              uploaded: doc.uploaded,
                            })
                          }
                        }}
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
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{doc.name}</td>
                    <td><span className="documents-badge documents-badge-info">{doc.category}</span></td>
                    <td className="premium-transaction-amount">{doc.size}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                    Aucun document trouvé
                  </td>
                </tr>
              )}
          </tbody>
        </table>
        <div className="premium-transaction-total">
          <strong>Total: <span className="premium-transaction-total-amount">{totalSize} MB</span></strong>
        </div>
      </div>

      {/* Indicateur de sélection globale */}
      {selectedCount > 0 && (
        <div className="documents-card" style={{ marginTop: 'var(--space-4)', border: '1px solid rgba(197, 255, 167, 0.3)' }}>
          <div className="documents-card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#C5FFA7', fontWeight: 'var(--font-semibold)' }}>
                  {selectedCount} document{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
                </span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                  prêt{selectedCount > 1 ? 's' : ''} à être envoyé{selectedCount > 1 ? 's' : ''}
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
    </div>
  )
}


