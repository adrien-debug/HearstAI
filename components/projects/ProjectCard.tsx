'use client'

import { useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/Icon'
import './Projects.css'

interface ProjectCardProps {
  project: {
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
    _count?: {
      versions: number
      jobs: number
    }
    user?: {
      id: string
      name?: string | null
      email: string
      image?: string | null
    } | null
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false)

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper === 'ACTIVE') return { bg: 'rgba(138, 253, 129, 0.15)', color: '#8afd81', border: 'rgba(138, 253, 129, 0.3)' }
    if (statusUpper === 'ARCHIVED') return { bg: 'rgba(136, 136, 136, 0.15)', color: '#888', border: 'rgba(136, 136, 136, 0.3)' }
    return { bg: 'rgba(255, 165, 0, 0.15)', color: '#FFA500', border: 'rgba(255, 165, 0, 0.3)' }
  }

  const statusStyle = getStatusColor(project.status)

  return (
    <Link 
      href={`/projects/${project.id}`} 
      style={{ textDecoration: 'none', display: 'block', width: '100%' }}
    >
      <div className="project-card-premium">
        {/* Image Header */}
        <div className="project-card-image-container">
          {project.imageUrl && !imageError ? (
            <img 
              src={project.imageUrl} 
              alt={project.name}
              className="project-card-image"
              onError={() => {
                setImageError(true)
              }}
              style={{ 
                display: 'block', 
                width: '100%', 
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div className="project-card-image-placeholder">
              <div className="project-card-image-icon">
                <Icon name="folder" />
              </div>
              <div className="project-card-image-text">{project.name.charAt(0).toUpperCase()}</div>
            </div>
          )}
          <div className="project-card-overlay">
            <div className="project-card-status-badge" style={{
              background: statusStyle.bg,
              color: statusStyle.color,
              borderColor: statusStyle.border
            }}>
              {project.status}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="project-card-content">
          <div className="project-card-header">
            <h3 className="project-card-title">{project.name}</h3>
            {project.user?.image && (
              <img 
                src={project.user.image} 
                alt={project.user.name || 'User'}
                className="project-card-avatar"
              />
            )}
          </div>

          {project.description && (
            <p className="project-card-description">
              {project.description.length > 100 
                ? `${project.description.substring(0, 100)}...` 
                : project.description}
            </p>
          )}

          <div className="project-card-meta">
            <div className="project-card-meta-item">
              <span className="project-card-meta-label">Type</span>
              <span className="project-card-meta-value">{project.type}</span>
            </div>
            <div className="project-card-meta-item">
              <span className="project-card-meta-label">Repo</span>
              <span className="project-card-meta-value">{project.repoType}</span>
            </div>
          </div>

          <div className="project-card-stats">
            <div className="project-card-stat">
              <div className="project-card-stat-icon premium-stat-icon">
                <Icon name="versions" />
              </div>
              <div className="project-card-stat-content">
                <span className="project-card-stat-value">{project._count?.versions || 0}</span>
                <span className="project-card-stat-label">Versions</span>
              </div>
            </div>
            <div className="project-card-stat">
              <div className="project-card-stat-icon premium-stat-icon">
                <Icon name="jobs" />
              </div>
              <div className="project-card-stat-content">
                <span className="project-card-stat-value">{project._count?.jobs || 0}</span>
                <span className="project-card-stat-label">Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

