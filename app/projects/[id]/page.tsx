'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import EditProjectModal from '@/components/projects/EditProjectModal'

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
    version: string
    status: string
    createdAt: string
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
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: 'var(--space-3) var(--space-6)',
                    background: 'transparent',
                    border: '1px solid rgba(255, 77, 77, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    color: '#FF4D4D',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all var(--duration-normal) var(--ease-in-out)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.5)'
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 77, 77, 0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Delete Project
                </button>
                <Button style={{ 
                  background: '#C5FFA7',
                  color: '#000',
                  border: 'none'
                }}>
                  New Job
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--space-4)', 
          marginBottom: 'var(--space-6)' 
        }}>
          <Card style={{
            background: 'rgba(197, 255, 167, 0.05)',
            border: '1px solid rgba(197, 255, 167, 0.1)'
          }}>
            <CardContent style={{ padding: 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Versions
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>
                {project.versions?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(197, 255, 167, 0.05)',
            border: '1px solid rgba(197, 255, 167, 0.1)'
          }}>
            <CardContent style={{ padding: 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Jobs
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>
                {project.jobs?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent style={{ padding: 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Project Type
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                {project.type}
              </div>
            </CardContent>
          </Card>

          <Card style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <CardContent style={{ padding: 'var(--space-5)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Repository
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                {project.repoType}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Information */}
        <Card style={{ marginBottom: 'var(--space-6)' }}>
          <CardHeader>
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
        <Card style={{ marginBottom: 'var(--space-6)' }}>
          <CardHeader>
            <CardTitle>Versions</CardTitle>
          </CardHeader>
          <CardContent>
            {project.versions && project.versions.length > 0 ? (
              <div className="table-container">
                <table className="table">
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
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{version.version}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            background: version.status === 'stable' 
                              ? 'rgba(197, 255, 167, 0.15)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            color: version.status === 'stable' ? '#C5FFA7' : 'var(--text-secondary)',
                            border: `1px solid ${version.status === 'stable' ? 'rgba(197, 255, 167, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                          }}>
                            {version.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                          {formatDate(version.createdAt)}
                        </td>
                        <td>
                          <Link href={`/versions/${version.id}`}>
                            <Button variant="outline" size="sm" style={{
                              borderColor: 'rgba(197, 255, 167, 0.3)',
                              color: '#C5FFA7'
                            }}>
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--space-8)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>No versions yet</p>
                <Button variant="outline" size="sm">
                  Create First Version
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {project.jobs && project.jobs.length > 0 ? (
              <div className="table-container">
                <table className="table">
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
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{job.type}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
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
                        <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                          {formatDate(job.createdAt)}
                        </td>
                        <td>
                          <Link href={`/jobs/${job.id}`}>
                            <Button variant="outline" size="sm" style={{
                              borderColor: 'rgba(197, 255, 167, 0.3)',
                              color: '#C5FFA7'
                            }}>
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--space-8)',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ marginBottom: 'var(--space-4)' }}>No jobs yet</p>
                <Button style={{
                  background: '#C5FFA7',
                  color: '#000',
                  border: 'none'
                }}>
                  Create First Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
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
              border: '1px solid rgba(255, 77, 77, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: 700, 
              marginBottom: 'var(--space-4)',
              color: '#FF4D4D'
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
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: deleting ? 'rgba(255, 77, 77, 0.5)' : '#FF4D4D',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: '#fff',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = '#ff3333'
                    e.currentTarget.style.transform = 'scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    e.currentTarget.style.background = '#FF4D4D'
                    e.currentTarget.style.transform = 'scale(1)'
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

