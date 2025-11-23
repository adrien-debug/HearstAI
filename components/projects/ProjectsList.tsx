'use client'

import { useEffect, useState } from 'react'
import { projectsAPI } from '@/lib/api'
import Link from 'next/link'
import AddProjectModal from './AddProjectModal'
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
  _count?: {
    versions: number
    jobs: number
  }
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await projectsAPI.getAll()
      
      const projectsList = (response.projects || []).map((project: any) => {
        if (!project.imageUrl && project.metadata) {
          try {
            const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
            project.imageUrl = metadata.imageUrl || null
          } catch (e) {
            // Ignore parsing errors
          }
        }
        return project
      })
      
      setProjects(projectsList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleProjectAdded = () => {
    setShowAddModal(false)
    loadProjects()
  }

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 9999 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Projects</h1>
        <button 
          className="projects-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Project
        </button>
      </div>

      {loading ? (
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="projects-empty-state">
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            No projects yet. Create your first project!
          </p>
          <button 
            className="projects-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div 
          className="projects-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '16px',
            width: '100%'
          }}
        >
          {projects.map((project, index) => (
            <div key={`project-${project.id}-${index}`} style={{ width: '100%' }}>
              <Link 
                href={`/projects/${project.id}`} 
                style={{ textDecoration: 'none', display: 'block', width: '100%' }}
              >
                <div 
                  className="projects-box" 
                  style={{
                    background: 'rgba(26, 26, 26, 0.9)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '2px solid rgba(138, 253, 129, 0.3)',
                    borderRadius: '16px',
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    width: '100%',
                    minHeight: '250px',
                    padding: '0',
                    boxSizing: 'border-box',
                    visibility: 'visible',
                    opacity: 1,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {project.imageUrl && (
                    <div className="projects-box-image">
                      <img src={project.imageUrl} alt={project.name} />
                    </div>
                  )}
                  
                  <div style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      marginBottom: '12px',
                      gap: '8px'
                    }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 600, 
                        color: '#fff', 
                        margin: 0,
                        flex: 1
                      }}>
                        {project.name}
                      </h3>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        background: project.status === 'ACTIVE' ? 'rgba(138, 253, 129, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                        color: project.status === 'ACTIVE' ? '#8afd81' : '#FFA500',
                        border: project.status === 'ACTIVE' ? '1px solid rgba(138, 253, 129, 0.3)' : '1px solid rgba(255, 165, 0, 0.3)'
                      }}>
                        {project.status}
                      </span>
                    </div>
                    
                    {project.description && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        margin: '0 0 16px 0',
                        lineHeight: '1.5'
                      }}>
                        {project.description}
                      </p>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px', 
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Type
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#fff',
                          fontFamily: 'monospace'
                        }}>
                          {project.type}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Repository
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#fff',
                          fontFamily: 'monospace'
                        }}>
                          {project.repoType}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column' 
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Versions
                        </span>
                        <span style={{ 
                          fontSize: '18px', 
                          fontWeight: 700, 
                          color: '#8afd81',
                          fontFamily: 'monospace'
                        }}>
                          {project._count?.versions || 0}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column' 
                      }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '4px'
                        }}>
                          Jobs
                        </span>
                        <span style={{ 
                          fontSize: '18px', 
                          fontWeight: 700, 
                          color: '#8afd81',
                          fontFamily: 'monospace'
                        }}>
                          {project._count?.jobs || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleProjectAdded}
        />
      )}
    </div>
  )
}
