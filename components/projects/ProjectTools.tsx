'use client'

import { useState } from 'react'
import Link from 'next/link'
import './Projects.css'

interface Project {
  id: string
  name: string
  type: string
}

interface ProjectToolsProps {
  project: Project
}

export default function ProjectTools({ project }: ProjectToolsProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  // Tools available for projects
  const availableTools = [
    {
      id: 'calculator',
      name: 'Calculateur de Rentabilité',
      description: 'Calculez la rentabilité de vos opérations minières',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="14" x2="12" y2="14" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      link: '/calculator',
      embeddable: true
    },
    {
      id: 'electricity',
      name: 'Analyse Énergétique',
      description: 'Analysez la consommation et les coûts énergétiques',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: '/electricity',
      embeddable: true
    },
    {
      id: 'projections',
      name: 'Projections',
      description: 'Visualisez les projections de revenus et de coûts',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: '/projection',
      embeddable: true
    },
    {
      id: 'profitability',
      name: 'Indice de Rentabilité',
      description: 'Suivez l\'indice de rentabilité global',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: '/profitability-index',
      embeddable: true
    }
  ]

  // Check if project is Qatar or similar (you can customize this logic)
  const isQatarProject = project.name.toLowerCase().includes('qatar') || 
                         project.type.toLowerCase().includes('calculation')

  return (
    <div className="project-tools-container">
      <div className="project-tools-header">
        <h3>Outils disponibles</h3>
        <p>Accédez aux outils de calcul et d'analyse pour ce projet</p>
      </div>

      {isQatarProject && (
        <div className="project-tools-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p>Ce projet inclut des outils de calcul personnalisés</p>
        </div>
      )}

      <div className="project-tools-grid">
        {availableTools.map((tool) => (
          <div
            key={tool.id}
            className="project-tool-card"
            onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
          >
            <div className="project-tool-icon">{tool.icon}</div>
            <div className="project-tool-content">
              <h4 className="project-tool-name">{tool.name}</h4>
              <p className="project-tool-description">{tool.description}</p>
            </div>
            <div className="project-tool-actions">
              {tool.embeddable ? (
                <button
                  className="project-tool-btn-embed"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTool(tool.id)
                  }}
                >
                  Intégrer
                </button>
              ) : (
                <Link href={tool.link} className="project-tool-btn-link">
                  Ouvrir
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </div>
            {selectedTool === tool.id && tool.embeddable && (
              <div className="project-tool-embed">
                <div className="project-tool-embed-header">
                  <span>Outil intégré: {tool.name}</span>
                  <button
                    className="project-tool-embed-close"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTool(null)
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="project-tool-embed-content">
                  <iframe
                    src={tool.link}
                    className="project-tool-iframe"
                    title={tool.name}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isQatarProject && (
        <div className="project-tools-custom">
          <h4>Outils de calcul personnalisés</h4>
          <p>Ce projet inclut des outils de calcul spécifiques développés pour le client.</p>
          <div className="project-tools-custom-list">
            <div className="project-tools-custom-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Calculateur de ROI</strong>
                <p>Outil de calcul de retour sur investissement personnalisé</p>
              </div>
            </div>
            <div className="project-tools-custom-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="20" x2="6" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <strong>Analyse de Performance</strong>
                <p>Tableaux de bord d'analyse de performance en temps réel</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

