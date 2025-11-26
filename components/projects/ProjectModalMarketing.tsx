'use client'

import { useState, useEffect } from 'react'
import PhotoGallery from './PhotoGallery'
import PhotoUpload from './PhotoUpload'
import ProjectTools from './ProjectTools'
import './Projects.css'

interface Project {
  id: string
  name: string
  description?: string
  type: string
  repoType: string
  status: string
  createdAt: string
  updatedAt: string
  imageUrl?: string | null
  metadata?: string | any
  user?: {
    id: string
    name?: string | null
    email: string
    image?: string | null
  } | null
  versions?: Array<{
    id: string
    label: string
    description?: string
    isStable: boolean
    createdAt: string
  }>
  jobs?: Array<{
    id: string
    type: string
    status: string
    createdAt: string
  }>
}

interface ProjectModalMarketingProps {
  project: Project
  onClose: () => void
  onUpdate: () => void
}

export default function ProjectModalMarketing({ project, onClose, onUpdate }: ProjectModalMarketingProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'tools' | 'details'>('overview')
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    // Extract photos from project
    const projectPhotos: string[] = []
    if (project.imageUrl) {
      projectPhotos.push(project.imageUrl)
    }
    if (project.metadata) {
      try {
        const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
        if (metadata.photos && Array.isArray(metadata.photos)) {
          projectPhotos.push(...metadata.photos)
        }
        if (metadata.additionalImages && Array.isArray(metadata.additionalImages)) {
          projectPhotos.push(...metadata.additionalImages)
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    setPhotos(projectPhotos)
  }, [project])

  const handlePhotosUpdated = (newPhotos: string[]) => {
    setPhotos(newPhotos)
    onUpdate()
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper === 'ACTIVE') return { bg: 'rgba(197, 255, 167, 0.15)', color: '#C5FFA7', border: 'rgba(197, 255, 167, 0.3)' }
    if (statusUpper === 'ARCHIVED') return { bg: 'rgba(136, 136, 136, 0.15)', color: '#888', border: 'rgba(136, 136, 136, 0.3)' }
    return { bg: 'rgba(255, 165, 0, 0.15)', color: '#FFA500', border: 'rgba(255, 165, 0, 0.3)' }
  }

  const statusStyle = getStatusColor(project.status)

  return (
    <div className="project-modal-marketing-overlay" onClick={onClose}>
      <div className="project-modal-marketing" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="project-modal-marketing-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Hero Image Section */}
        {project.imageUrl && (
          <div className="project-modal-marketing-hero">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="project-modal-marketing-hero-image"
            />
            <div className="project-modal-marketing-hero-overlay">
              <div className="project-modal-marketing-hero-content">
                <h1 className="project-modal-marketing-title">{project.name}</h1>
                <div className="project-modal-marketing-hero-badges">
                  <span
                    className="project-modal-marketing-status"
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      borderColor: statusStyle.border
                    }}
                  >
                    {project.status}
                  </span>
                  <span className="project-modal-marketing-type">{project.type}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="project-modal-marketing-content">
          {/* Tabs */}
          <div className="project-modal-marketing-tabs">
            <button
              className={`project-modal-marketing-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Vue d'ensemble
            </button>
            <button
              className={`project-modal-marketing-tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Photos ({photos.length})
            </button>
            <button
              className={`project-modal-marketing-tab ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Outils
            </button>
            <button
              className={`project-modal-marketing-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Détails
            </button>
          </div>

          {/* Tab Content */}
          <div className="project-modal-marketing-tab-content">
            {activeTab === 'overview' && (
              <div className="project-modal-marketing-overview">
                {!project.imageUrl && (
                  <div className="project-modal-marketing-header-text">
                    <h1 className="project-modal-marketing-title">{project.name}</h1>
                    <div className="project-modal-marketing-hero-badges">
                      <span
                        className="project-modal-marketing-status"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          borderColor: statusStyle.border
                        }}
                      >
                        {project.status}
                      </span>
                      <span className="project-modal-marketing-type">{project.type}</span>
                    </div>
                  </div>
                )}
                {project.description && (
                  <div className="project-modal-marketing-description">
                    <h3>Description</h3>
                    <p>{project.description}</p>
                  </div>
                )}
                <div className="project-modal-marketing-stats">
                  <div className="project-modal-marketing-stat">
                    <div className="project-modal-marketing-stat-value">
                      {project.versions?.length || 0}
                    </div>
                    <div className="project-modal-marketing-stat-label">Versions</div>
                  </div>
                  <div className="project-modal-marketing-stat">
                    <div className="project-modal-marketing-stat-value">
                      {project.jobs?.length || 0}
                    </div>
                    <div className="project-modal-marketing-stat-label">Jobs</div>
                  </div>
                  <div className="project-modal-marketing-stat">
                    <div className="project-modal-marketing-stat-value">
                      {photos.length}
                    </div>
                    <div className="project-modal-marketing-stat-label">Photos</div>
                  </div>
                </div>
                {photos.length > 0 && (
                  <div className="project-modal-marketing-preview-photos">
                    <h3>Galerie</h3>
                    <div className="project-modal-marketing-preview-grid">
                      {photos.slice(0, 6).map((photo, index) => (
                        <div key={index} className="project-modal-marketing-preview-item">
                          <img src={photo} alt={`${project.name} - ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="project-modal-marketing-photos">
                <PhotoUpload
                  projectId={project.id}
                  existingPhotos={photos}
                  onPhotosUpdated={handlePhotosUpdated}
                />
                {photos.length > 0 && (
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <PhotoGallery photos={photos} projectName={project.name} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="project-modal-marketing-tools">
                <ProjectTools project={project} />
              </div>
            )}

            {activeTab === 'details' && (
              <div className="project-modal-marketing-details">
                <div className="project-modal-marketing-details-grid">
                  <div className="project-modal-marketing-details-item">
                    <label>Type de projet</label>
                    <div>{project.type}</div>
                  </div>
                  <div className="project-modal-marketing-details-item">
                    <label>Type de repository</label>
                    <div>{project.repoType}</div>
                  </div>
                  <div className="project-modal-marketing-details-item">
                    <label>Statut</label>
                    <div>{project.status}</div>
                  </div>
                  <div className="project-modal-marketing-details-item">
                    <label>Créé le</label>
                    <div>{new Date(project.createdAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div className="project-modal-marketing-details-item">
                    <label>Modifié le</label>
                    <div>{new Date(project.updatedAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                  {project.user && (
                    <div className="project-modal-marketing-details-item">
                      <label>Gestionnaire</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {project.user.image && (
                          <img
                            src={project.user.image}
                            alt={project.user.name || 'User'}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: '1px solid rgba(197, 255, 167, 0.3)'
                            }}
                          />
                        )}
                        <span>{project.user.name || project.user.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

