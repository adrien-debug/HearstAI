'use client'

import { formatDate } from '@/lib/utils'
import './Projects.css'

interface RoadmapItem {
  id: string
  title: string
  description?: string
  status: 'completed' | 'in-progress' | 'planned'
  date: string
  version?: string
}

interface ProjectRoadmapProps {
  project: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    versions?: Array<{
      id: string
      label: string
      description?: string
      isStable: boolean
      createdAt: string
    }>
  }
}

export default function ProjectRoadmap({ project }: ProjectRoadmapProps) {
  // Générer les items de roadmap à partir des versions
  const roadmapItems: RoadmapItem[] = project.versions
    ? project.versions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((version, index) => ({
          id: version.id,
          title: `Version ${version.label}`,
          description: version.description || `Release ${version.label}`,
          status: version.isStable ? 'completed' : index === 0 ? 'in-progress' : 'planned',
          date: version.createdAt,
          version: version.label,
        }))
    : []

  // Ajouter les milestones du projet
  const milestones: RoadmapItem[] = [
    {
      id: 'project-created',
      title: 'Project Created',
      description: 'Project initialized',
      status: 'completed',
      date: project.createdAt,
    },
    {
      id: 'project-updated',
      title: 'Last Updated',
      description: 'Latest project update',
      status: 'completed',
      date: project.updatedAt,
    },
    ...roadmapItems,
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '⟳'
      case 'planned':
        return '○'
      default:
        return '○'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(138, 253, 129, 0.15)', color: '#8afd81', border: 'rgba(138, 253, 129, 0.3)' }
      case 'in-progress':
        return { bg: 'rgba(255, 165, 0, 0.15)', color: '#FFA500', border: 'rgba(255, 165, 0, 0.3)' }
      case 'planned':
        return { bg: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.5)', border: 'rgba(255, 255, 255, 0.1)' }
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.5)', border: 'rgba(255, 255, 255, 0.1)' }
    }
  }

  return (
    <div className="project-roadmap">
      <div className="project-roadmap-header">
        <h3 className="project-roadmap-title">Roadmap</h3>
        <span className="project-roadmap-subtitle">Project Timeline & Milestones</span>
      </div>

      <div className="project-roadmap-timeline">
        {milestones.length === 0 ? (
          <div className="project-roadmap-empty">
            <p>No roadmap items yet</p>
          </div>
        ) : (
          milestones.map((item, index) => {
            const statusStyle = getStatusColor(item.status)
            const isLast = index === milestones.length - 1

            return (
              <div key={item.id} className="project-roadmap-item">
                <div className="project-roadmap-line" style={{ opacity: isLast ? 0 : 1 }} />
                <div 
                  className="project-roadmap-marker"
                  style={{
                    background: statusStyle.bg,
                    borderColor: statusStyle.border,
                    color: statusStyle.color,
                  }}
                >
                  {getStatusIcon(item.status)}
                </div>
                <div className="project-roadmap-content">
                  <div className="project-roadmap-item-header">
                    <h4 className="project-roadmap-item-title">{item.title}</h4>
                    <span 
                      className="project-roadmap-item-status"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border,
                      }}
                    >
                      {item.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  {item.description && (
                    <p className="project-roadmap-item-description">{item.description}</p>
                  )}
                  <div className="project-roadmap-item-footer">
                    <span className="project-roadmap-item-date">{formatDate(item.date)}</span>
                    {item.version && (
                      <span className="project-roadmap-item-version">v{item.version}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}


