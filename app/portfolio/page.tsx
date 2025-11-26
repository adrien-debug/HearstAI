'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'
import ProjectModalMarketing from '@/components/projects/ProjectModalMarketing'
import AddProjectModal from '@/components/projects/AddProjectModal'
import './Portfolio.css'

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
  _count?: {
    versions: number
    jobs: number
  }
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getAll()
      
      // Helper function to check if URL is valid (not a blob URL)
      const isValidImageUrl = (url: string | null | undefined): boolean => {
        if (!url || typeof url !== 'string') return false
        // Reject blob URLs
        if (url.startsWith('blob:')) return false
        // Accept data URLs (base64)
        if (url.startsWith('data:image/')) return true
        // Accept HTTP/HTTPS URLs
        if (url.startsWith('http://') || url.startsWith('https://')) return true
        // Accept relative URLs
        if (url.startsWith('/')) return true
        return false
      }
      
      const projectsList = (response.projects || []).map((project: any) => {
        if (!project.imageUrl && project.metadata) {
          try {
            const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
            const imageUrl = metadata.imageUrl || null
            // Only set imageUrl if it's valid
            if (isValidImageUrl(imageUrl)) {
              project.imageUrl = imageUrl
            }
            // Filter photos to only include valid URLs
            const photos = metadata.photos || []
            project.photos = photos.filter((photo: string) => isValidImageUrl(photo))
          } catch (e) {
            console.error('Error parsing project metadata:', e)
          }
        } else if (project.imageUrl && !isValidImageUrl(project.imageUrl)) {
          // If imageUrl exists but is invalid (blob), remove it
          project.imageUrl = null
        }
        return project
      })
      
      setProjects(projectsList)
    } catch (err) {
      console.error('Error loading projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter.toUpperCase()
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesFilter && matchesSearch
  })

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
    loadProjects() // Reload to get updated photos
  }

  const handleProjectAdded = () => {
    setShowAddModal(false)
    loadProjects()
  }

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-loading">
          <div className="portfolio-spinner"></div>
          <p>Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <div className="portfolio-hero">
        <div className="portfolio-hero-content">
          <h1 className="portfolio-hero-title">
            Nos <span className="portfolio-hero-highlight">Projets</span>
          </h1>
          <p className="portfolio-hero-subtitle">
            Découvrez nos réalisations et solutions innovantes pour le secteur minier et énergétique
          </p>
          <button
            className="portfolio-hero-btn"
            onClick={() => setShowAddModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Créer un nouveau projet
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="portfolio-controls">
        <div className="portfolio-search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="portfolio-search-input"
          />
        </div>
        <div className="portfolio-filters">
          <button
            className={`portfolio-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`portfolio-filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Actifs
          </button>
          <button
            className={`portfolio-filter-btn ${filter === 'archived' ? 'active' : ''}`}
            onClick={() => setFilter('archived')}
          >
            Archivés
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="portfolio-grid">
        {filteredProjects.length === 0 ? (
          <div className="portfolio-empty">
            <div className="portfolio-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <p>
              {projects.length === 0 
                ? "Aucun projet pour le moment. Créez votre premier projet !"
                : "Aucun projet ne correspond à votre recherche"}
            </p>
            {projects.length === 0 && (
              <button
                className="portfolio-hero-btn"
                onClick={() => setShowAddModal(true)}
                style={{ marginTop: 'var(--space-4)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Créer mon premier projet
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="portfolio-card"
              onClick={() => handleProjectClick(project)}
            >
              {/* Image Container */}
              <div className="portfolio-card-image-wrapper">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="portfolio-card-image"
                    onError={(e) => {
                      console.error('Erreur de chargement de l\'image:', project.imageUrl)
                      // Remplacer par le placeholder en cas d'erreur
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const placeholder = target.nextElementSibling as HTMLElement
                      if (placeholder && placeholder.classList.contains('portfolio-card-placeholder')) {
                        placeholder.style.display = 'flex'
                      }
                    }}
                    loading="lazy"
                  />
                ) : null}
                <div className="portfolio-card-placeholder" style={{ display: project.imageUrl ? 'none' : 'flex' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="portfolio-card-overlay">
                  <div className="portfolio-card-status">
                    {project.status}
                  </div>
                  <div className="portfolio-card-hover-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Voir les détails</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="portfolio-card-content">
                <h3 className="portfolio-card-title">{project.name}</h3>
                {project.description && (
                  <p className="portfolio-card-description">
                    {project.description.length > 120
                      ? `${project.description.substring(0, 120)}...`
                      : project.description}
                  </p>
                )}
                <div className="portfolio-card-footer">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-card-type">{project.type}</span>
                    {project._count && (
                      <span className="portfolio-card-stats">
                        {project._count.versions} versions
                      </span>
                    )}
                  </div>
                  {project.user?.image && (
                    <img
                      src={project.user.image}
                      alt={project.user.name || 'User'}
                      className="portfolio-card-avatar"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModalMarketing
          project={selectedProject}
          onClose={handleCloseModal}
          onUpdate={loadProjects}
        />
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleProjectAdded}
        />
      )}
    </div>
  )
}

