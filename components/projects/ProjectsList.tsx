'use client'

import { useEffect, useState } from 'react'
import { projectsAPI } from '@/lib/api'
import AddProjectModal from './AddProjectModal'
import ProjectCard from './ProjectCard'
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
      <div className="projects-header-premium">
        <div>
          <h1 className="projects-title-premium">Projects</h1>
          <p className="projects-subtitle-premium">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} en cours
          </p>
        </div>
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
        <div className="projects-grid-premium">
          {projects.map((project, index) => (
            <ProjectCard key={`project-${project.id}-${index}`} project={project} />
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
