'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import Link from 'next/link'
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
  repoUrl?: string
  repoBranch?: string
  localPath?: string
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

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const getStatusBadgeClass = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper === 'ACTIVE') return 'projects-badge projects-badge-success'
    if (statusUpper === 'ARCHIVED') return 'projects-badge projects-badge-error'
    return 'projects-badge projects-badge-warning'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(138, 253, 129, 0.2)',
              borderTopColor: '#8afd81',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--space-4)',
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
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--space-8)',
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <p style={{ color: '#ff4d4d', marginBottom: 'var(--space-4)' }}>
              Error: {error || 'Project not found'}
            </p>
            <button 
              className="projects-btn-secondary"
              onClick={() => router.push('/projects')}
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link 
            href="/projects" 
            style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: 'var(--text-sm)', 
              marginBottom: 'var(--space-2)', 
              display: 'inline-block',
              transition: 'color var(--duration-fast) var(--ease-in-out)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8afd81'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Back to Projects
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: '#ffffff', position: 'relative', zIndex: 10 }}>
                {project.name}
              </h1>
              {project.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginTop: 'var(--space-2)' }}>
                  {project.description}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <span className={getStatusBadgeClass(project.status)}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Project Image */}
        {project.imageUrl && (
          <div style={{ 
            width: '100%', 
            height: '400px', 
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 'var(--space-6)',
            background: 'rgba(10, 10, 10, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <img 
              src={project.imageUrl} 
              alt={project.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Versions</div>
            <div className="kpi-value" style={{ color: '#8afd81', fontFamily: 'var(--font-mono)' }}>
              {project.versions?.length || 0}
            </div>
            <div className="kpi-description">All versions</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Jobs</div>
            <div className="kpi-value" style={{ color: '#8afd81', fontFamily: 'var(--font-mono)' }}>
              {project.jobs?.length || 0}
            </div>
            <div className="kpi-description">All jobs</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Project Type</div>
            <div className="kpi-value" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
              {project.type}
            </div>
            <div className="kpi-description">Application type</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Repository</div>
            <div className="kpi-value" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
              {project.repoType}
            </div>
            <div className="kpi-description">Repository type</div>
          </div>
        </div>

        {/* Project Information */}
        <div className="projects-detail-card">
          <div className="projects-detail-card-header">
            <h3 className="projects-detail-card-title">Project Information</h3>
          </div>
          <div className="projects-detail-card-body">
            <div className="projects-detail-info-grid">
              <div className="projects-detail-info-item">
                <span className="projects-detail-info-label">Created</span>
                <span className="projects-detail-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                  {formatDate(project.createdAt)}
                </span>
              </div>
              <div className="projects-detail-info-item">
                <span className="projects-detail-info-label">Last Updated</span>
                <span className="projects-detail-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                  {formatDate(project.updatedAt)}
                </span>
              </div>
              {project.repoUrl && (
                <div className="projects-detail-info-item">
                  <span className="projects-detail-info-label">Repository URL</span>
                  <span className="projects-detail-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: '#8afd81' }}>
                    {project.repoUrl}
                  </span>
                </div>
              )}
              {project.repoBranch && (
                <div className="projects-detail-info-item">
                  <span className="projects-detail-info-label">Branch</span>
                  <span className="projects-detail-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                    {project.repoBranch}
                  </span>
                </div>
              )}
              {project.localPath && (
                <div className="projects-detail-info-item">
                  <span className="projects-detail-info-label">Local Path</span>
                  <span className="projects-detail-info-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                    {project.localPath}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Versions Table */}
        {project.versions && project.versions.length > 0 && (
          <div className="projects-detail-card" style={{ marginTop: 'var(--space-6)' }}>
            <div className="projects-detail-card-header">
              <h3 className="projects-detail-card-title">Versions</h3>
            </div>
            <div className="projects-detail-card-body">
              <div className="projects-table-container">
                <table className="projects-table">
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
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                          <strong>{version.version}</strong>
                        </td>
                        <td>
                          <span className={
                            version.status === 'stable' ? 'projects-badge projects-badge-success' :
                            version.status === 'deprecated' ? 'projects-badge projects-badge-error' :
                            'projects-badge projects-badge-warning'
                          }>
                            {version.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                          {formatDate(version.createdAt)}
                        </td>
                        <td>
                          <button className="projects-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Table */}
        {project.jobs && project.jobs.length > 0 && (
          <div className="projects-detail-card" style={{ marginTop: 'var(--space-6)' }}>
            <div className="projects-detail-card-header">
              <h3 className="projects-detail-card-title">Recent Jobs</h3>
            </div>
            <div className="projects-detail-card-body">
              <div className="projects-table-container">
                <table className="projects-table">
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
                        <td style={{ fontSize: 'var(--text-sm)' }}>{job.type}</td>
                        <td>
                          <span className={
                            job.status === 'SUCCESS' ? 'projects-badge projects-badge-success' :
                            job.status === 'FAILED' ? 'projects-badge projects-badge-error' :
                            'projects-badge projects-badge-warning'
                          }>
                            {job.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                          {formatDate(job.createdAt)}
                        </td>
                        <td>
                          <Link href={`/jobs/${job.id}`}>
                            <button className="projects-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

