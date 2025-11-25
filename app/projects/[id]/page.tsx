'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import EditProjectModal from '@/components/projects/EditProjectModal'
import ProjectRoadmap from '@/components/projects/ProjectRoadmap'
import PhotoGallery from '@/components/projects/PhotoGallery'
import '@/components/home/Home.css'

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
    version?: string
  }>
  jobs?: Array<{
    id: string
    type: string
    status: string
    createdAt: string
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper === 'ACTIVE') return '#a5ff9c'
    if (statusUpper === 'ARCHIVED') return '#888'
    return '#ffa500'
  }

  const loadProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await projectsAPI.getById(projectId)
      let projectData = response.project || response
      
      // Extract imageUrl from metadata if not directly available
      if (!projectData.imageUrl && projectData.metadata) {
        try {
          const metadata = typeof projectData.metadata === 'string' ? JSON.parse(projectData.metadata) : projectData.metadata
          projectData.imageUrl = metadata.imageUrl || null
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      setProject(projectData)
    } catch (err) {
      console.error('Error loading project:', err)
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return
    
    setDeleting(true)
    try {
      await projectsAPI.delete(project.id)
      router.push('/projects')
    } catch (err) {
      console.error('Error deleting project:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    loadProject()
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="loading-state">
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(165, 255, 156, 0.2)',
              borderTopColor: '#a5ff9c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="error-state">
            <p>Error: {error || 'Project not found'}</p>
            <Button style={{ marginTop: 'var(--space-4)' }} onClick={() => router.push('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header with Back Button */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link 
            href="/projects" 
            style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: 'var(--text-sm)', 
              marginBottom: 'var(--space-4)', 
              display: 'inline-block',
              transition: 'color var(--duration-fast) var(--ease-in-out)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C5FFA7'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Back to Projects
          </Link>
          
          {/* Project Header with Image Preview */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: project.imageUrl ? '300px 1fr' : '1fr',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-6)'
          }}>
            {/* Image Preview */}
            {project.imageUrl && (
              <div style={{
                width: '100%',
                aspectRatio: '4/3',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative'
              }}>
                <img 
                  src={project.imageUrl} 
                  alt={project.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  {project.user?.image && (
                    <img 
                      src={project.user.image} 
                      alt={project.user.name || 'User'}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid rgba(197, 255, 167, 0.3)'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      Project Manager
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#C5FFA7' }}>
                      {project.user?.name || project.user?.email || 'Unassigned'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Project Info */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ 
                    fontSize: 'var(--text-3xl)', 
                    fontWeight: 700, 
                    marginBottom: 'var(--space-2)',
                    position: 'relative',
                    zIndex: 10,
                    background: 'linear-gradient(135deg, #C5FFA7 0%, #8afd81 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {project.name}
                  </h1>
                  {project.description && (
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: 'var(--text-base)', 
                      lineHeight: 1.6,
                      marginTop: 'var(--space-2)'
                    }}>
                      {project.description}
                    </p>
                  )}
                  
                  {/* Project Manager Info (if no image) */}
                  {!project.imageUrl && project.user && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-3)',
                      marginTop: 'var(--space-4)',
                      padding: 'var(--space-3)',
                      background: 'rgba(197, 255, 167, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(197, 255, 167, 0.1)'
                    }}>
                      {project.user.image && (
                        <img 
                          src={project.user.image} 
                          alt={project.user.name || 'User'}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: '2px solid rgba(197, 255, 167, 0.3)'
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          Project Manager
                        </div>
                        <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: '#C5FFA7' }}>
                          {project.user.name || project.user.email}
                        </div>
                        {project.user.email && project.user.name && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            {project.user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <span style={{
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    background: project.status === 'ACTIVE' 
                      ? 'rgba(197, 255, 167, 0.15)' 
                      : project.status === 'ARCHIVED'
                      ? 'rgba(136, 136, 136, 0.15)'
                      : 'rgba(255, 165, 0, 0.15)',
                    color: getStatusColor(project.status),
                    border: `1px solid ${getStatusColor(project.status)}40`
                  }}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{
                    padding: 'var(--space-3) var(--space-6)',
                    background: 'transparent',
                    border: '1px solid rgba(197, 255, 167, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    color: '#C5FFA7',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all var(--duration-normal) var(--ease-in-out)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(197, 255, 167, 0.5)'
                    e.currentTarget.style.background = 'rgba(197, 255, 167, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(197, 255, 167, 0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Edit Project
                </button>
                <button className="home-btn">
                  New Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Versions</div>
            <div className="kpi-value">{project.versions?.length || 0}</div>
            <div className="kpi-description">All project versions</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Total Jobs</div>
            <div className="kpi-value">{project.jobs?.length || 0}</div>
            <div className="kpi-description">All project jobs</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Project Type</div>
            <div className="kpi-value">{project.type}</div>
            <div className="kpi-description">Project category</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Repository</div>
            <div className="kpi-value">{project.repoType}</div>
            <div className="kpi-description">Repository type</div>
          </div>
        </div>

        {/* Roadmap & Gallery Section */}
        <div className="project-detail-sections-grid">
          <Card style={{ 
            marginBottom: 0,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}>
            <CardHeader style={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(180deg, #454646 0%, #3a3a3a 100%)'
            }}>
              <CardTitle>Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectRoadmap project={project} />
            </CardContent>
          </Card>

          <Card style={{ 
            marginBottom: 0,
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}>
            <CardHeader style={{ 
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(180deg, #454646 0%, #3a3a3a 100%)'
            }}>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoGallery 
                photos={(() => {
                  const photos: string[] = []
                  if (project.imageUrl) {
                    photos.push(project.imageUrl)
                  }
                  // Extraire les photos supplémentaires depuis les métadonnées
                  if (project.metadata) {
                    try {
                      const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
                      if (metadata.photos && Array.isArray(metadata.photos)) {
                        photos.push(...metadata.photos)
                      }
                      if (metadata.additionalImages && Array.isArray(metadata.additionalImages)) {
                        photos.push(...metadata.additionalImages)
                      }
                    } catch (e) {
                      // Ignore parsing errors
                    }
                  }
                  return photos
                })()} 
                projectName={project.name} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Project Information */}
        <Card style={{ 
          marginBottom: 'var(--space-6)',
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
          <CardHeader style={{ 
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'linear-gradient(180deg, #454646 0%, #3a3a3a 100%)'
          }}>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 'var(--space-4)' 
            }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Created
                </div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                  {formatDate(project.createdAt)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Updated
                </div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                  {formatDate(project.updatedAt)}
                </div>
              </div>
              {project.user && (
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Project Manager
                  </div>
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
                    <span style={{ color: '#C5FFA7', fontWeight: 'var(--font-medium)' }}>
                      {project.user.name || project.user.email || 'Unassigned'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Versions */}
        <div className="premium-transaction-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">Versions</h3>
          </div>
          {project.versions && project.versions.length > 0 ? (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.versions.map((version) => (
                      <tr key={version.id}>
                        <td className="premium-transaction-amount">{version.label || version.version}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            background: version.isStable 
                              ? 'rgba(197, 255, 167, 0.15)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            color: version.isStable ? '#C5FFA7' : 'var(--text-secondary)',
                            border: `1px solid ${version.isStable ? 'rgba(197, 255, 167, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                          }}>
                            {version.isStable ? 'Stable' : 'Development'}
                          </span>
                        </td>
                        <td>{formatDate(version.createdAt)}</td>
                        <td>
                          <Link href={`/versions/${version.id}`}>
                            <button className="home-btn-secondary" style={{
                              textDecoration: 'none'
                            }}>
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {project.versions.length > 0 && (
                  <div className="premium-transaction-total">
                    <strong>Total: <span className="premium-transaction-total-amount">{project.versions.length} version{project.versions.length > 1 ? 's' : ''}</span></strong>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--space-8)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>No versions yet</p>
                <button className="home-btn-secondary">
                  Create First Version
                </button>
              </div>
            )}
        </div>

        {/* Jobs */}
        <div className="premium-transaction-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">Recent Jobs</h3>
          </div>
          {project.jobs && project.jobs.length > 0 ? (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.jobs.slice(0, 10).map((job) => (
                      <tr key={job.id}>
                        <td>{job.type}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: job.status === 'SUCCESS' 
                              ? 'rgba(197, 255, 167, 0.15)' 
                              : job.status === 'FAILED'
                              ? 'rgba(255, 77, 77, 0.15)'
                              : 'rgba(255, 255, 255, 0.05)',
                            color: job.status === 'SUCCESS' 
                              ? '#C5FFA7' 
                              : job.status === 'FAILED'
                              ? '#FF4D4D'
                              : 'var(--text-secondary)',
                            border: `1px solid ${job.status === 'SUCCESS' 
                              ? 'rgba(197, 255, 167, 0.3)' 
                              : job.status === 'FAILED'
                              ? 'rgba(255, 77, 77, 0.3)'
                              : 'rgba(255, 255, 255, 0.1)'}`
                          }}>
                            {job.status}
                          </span>
                        </td>
                        <td>
                          {formatDate(job.createdAt)}
                        </td>
                        <td>
                          <Link href={`/jobs/${job.id}`}>
                            <button className="home-btn-secondary" style={{
                              textDecoration: 'none'
                            }}>
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {project.jobs.length > 0 && (
                  <div className="premium-transaction-total">
                    <strong>Total: <span className="premium-transaction-total-amount">{project.jobs.length} job{project.jobs.length > 1 ? 's' : ''}</span></strong>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--space-8)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>No jobs yet</p>
                <button className="home-btn">
                  Create First Job
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && project && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            style={{
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 77, 77, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: 'var(--font-semibold)', 
              marginBottom: 'var(--space-4)',
              color: '#FF4D4D',
              letterSpacing: '-0.02em'
            }}>
              Delete Project
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: 'var(--space-6)',
              lineHeight: 1.6
            }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{project?.name}</strong>? 
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="home-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="home-btn-secondary"
                style={{
                  background: deleting ? 'rgba(255, 77, 77, 0.3)' : 'transparent',
                  color: deleting ? 'rgba(255, 77, 77, 0.5)' : '#FF4D4D',
                  borderColor: '#FF4D4D',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'
                    e.currentTarget.style.borderColor = '#ff3333'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = '#FF4D4D'
                  }
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

