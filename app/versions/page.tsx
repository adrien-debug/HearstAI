'use client'

import { useEffect, useState } from 'react'
import { versionsAPI, projectsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Version {
  id: string
  label: string
  description?: string
  isStable: boolean
  createdAt: string
  projectId: string
  project?: {
    id: string
    name: string
  }
  _count?: {
    files: number
  }
}

export default function VersionsPage() {
  const [versions, setVersions] = useState<Version[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load projects
        const projectsResponse = await projectsAPI.getAll()
        setProjects(projectsResponse.projects || [])
        
        // Load versions for all projects
        const allVersions: Version[] = []
        for (const project of projectsResponse.projects || []) {
          try {
            const versionsResponse = await versionsAPI.getByProject(project.id)
            const projectVersions = (versionsResponse.versions || []).map((v: any) => ({
              ...v,
              project: { id: project.id, name: project.name }
            }))
            allVersions.push(...projectVersions)
          } catch (err) {
            console.error(`Error loading versions for project ${project.id}:`, err)
          }
        }
        
        setVersions(allVersions)
      } catch (err) {
        console.error('Error loading versions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load versions')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredVersions = versions.filter(version => {
    if (selectedProject && version.projectId !== selectedProject) return false
    if (statusFilter === 'stable' && !version.isStable) return false
    if (statusFilter === 'draft' && version.isStable) return false
    return true
  })

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
            <p style={{ color: 'var(--text-secondary)' }}>Loading versions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Versions</h1>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                minWidth: '200px',
              }}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                minWidth: '150px',
              }}
            >
              <option value="">All Statuses</option>
              <option value="stable">Stable Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', marginBottom: 'var(--space-4)' }}>
            Error: {error}
          </div>
        )}

        {filteredVersions.length === 0 ? (
          <Card>
            <CardContent style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                {versions.length === 0 
                  ? 'No versions yet. Versions are automatically created when jobs complete successfully.'
                  : 'No versions match the selected filters.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {filteredVersions.map((version) => (
              <Card key={version.id}>
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardTitle>{version.label}</CardTitle>
                    {version.isStable && (
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        background: 'rgba(165, 255, 156, 0.2)',
                        color: 'var(--hearst-green)',
                      }}>
                        STABLE
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {version.project && (
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Project
                        </div>
                        <div>
                          <Link href={`/projects/${version.project.id}`} style={{ color: 'var(--hearst-green)', textDecoration: 'none' }}>
                            {version.project.name}
                          </Link>
                        </div>
                      </div>
                    )}
                    {version.description && (
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Description
                        </div>
                        <div style={{ color: 'var(--text-primary)' }}>
                          {version.description}
                        </div>
                      </div>
                    )}
                    {version._count && (
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                          Files
                        </div>
                        <div style={{ color: 'var(--text-primary)' }}>
                          {version._count.files}
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                        Created
                      </div>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {formatDate(version.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <Link href={`/versions/${version.id}`}>
                      <Button variant="outline" style={{ width: '100%' }}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

