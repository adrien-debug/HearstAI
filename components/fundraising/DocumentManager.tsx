'use client'

import { Investor, Document } from '@/types/fundraising'
import { useState } from 'react'

interface DocumentManagerProps {
  investor: Investor
  onDocumentAdded: (document: Document) => void
  onUpdate: (investor: Investor) => void
}

export default function DocumentManager({ investor, onDocumentAdded, onUpdate }: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const documentTypes: Record<Document['type'], { label: string; icon: string }> = {
    'pitch-deck': { label: 'Pitch Deck', icon: '📊' },
    'financial': { label: 'Documents Financiers', icon: '💰' },
    'contract': { label: 'Contrats', icon: '📄' },
    'other': { label: 'Autre', icon: '📎' },
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    for (const file of Array.from(files)) {
      try {
        // Simuler un upload progressif
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 100)

        // Convertir le fichier en base64 pour stockage local
        const reader = new FileReader()
        reader.onloadend = () => {
          clearInterval(progressInterval)
          setUploadProgress(100)

          const document: Document = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: detectDocumentType(file.name),
            file: reader.result as string, // Base64 string
            uploadedAt: new Date().toISOString(),
            size: file.size,
            mimeType: file.type,
          }

          onDocumentAdded(document)
          setUploadProgress(0)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Erreur lors de l\'upload du fichier')
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }

  const detectDocumentType = (filename: string): Document['type'] => {
    const lower = filename.toLowerCase()
    if (lower.includes('pitch') || lower.includes('deck') || lower.includes('presentation')) {
      return 'pitch-deck'
    }
    if (lower.includes('financial') || lower.includes('financial') || lower.includes('balance') || lower.includes('income')) {
      return 'financial'
    }
    if (lower.includes('contract') || lower.includes('agreement') || lower.includes('term')) {
      return 'contract'
    }
    return 'other'
  }

  const handleDownload = (document: Document) => {
    if (typeof document.file === 'string' && typeof window !== 'undefined') {
      // Base64 string
      const link = window.document.createElement('a')
      link.href = document.file
      link.download = document.name
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
    }
  }

  const handleDelete = (documentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      const updated = {
        ...investor,
        documents: investor.documents?.filter(doc => doc.id !== documentId) || [],
        updatedAt: new Date().toISOString(),
      }
      onUpdate(updated)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const documents = investor.documents || []

  return (
    <div className="fundraising-documents-container">
      <div className="fundraising-documents-header">
        <div>
          <h2>Documents - {investor.firstName} {investor.lastName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Gérer les documents liés à cet investisseur (Pitch Deck, documents financiers, contrats...)
          </p>
        </div>
        <label className="fundraising-btn-primary" style={{ cursor: 'pointer' }}>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)' }}>
            <path d="M8 11V3M5 6l3-3 3 3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isUploading ? `Upload... ${uploadProgress}%` : 'Ajouter des Documents'}
        </label>
      </div>

      {isUploading && (
        <div className="fundraising-upload-progress">
          <div className="fundraising-progress-bar">
            <div 
              className="fundraising-progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="fundraising-empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }}>
            <path d="M16 16h32v32H16V16z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M20 20h24v24H20V20z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
            Aucun document pour le moment. Ajoutez votre premier document !
          </p>
        </div>
      ) : (
        <div className="fundraising-documents-grid">
          {documents.map((document) => (
            <div key={document.id} className="fundraising-document-card">
              <div className="fundraising-document-icon">
                {documentTypes[document.type].icon}
              </div>
              <div className="fundraising-document-info">
                <h4 className="fundraising-document-name">{document.name}</h4>
                <div className="fundraising-document-meta">
                  <span className="fundraising-document-type">
                    {documentTypes[document.type].label}
                  </span>
                  <span className="fundraising-document-separator">•</span>
                  <span className="fundraising-document-size">
                    {formatFileSize(document.size)}
                  </span>
                  <span className="fundraising-document-separator">•</span>
                  <span className="fundraising-date-label">
                    {formatDate(document.uploadedAt)}
                  </span>
                </div>
              </div>
              <div className="fundraising-document-actions">
                <button
                  onClick={() => handleDownload(document)}
                  className="fundraising-icon-button"
                  title="Télécharger"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 12.5V3.5M6 9.5l3 3 3-3M3 15.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="fundraising-icon-button danger"
                  title="Supprimer"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

