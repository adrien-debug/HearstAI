'use client'

import { useState } from 'react'

interface PipelineCard {
  id: number
  company: string
  contact: string
  value: string
  stage: string
  tags: string[]
  lastActivity: string
}

export default function BusinessDevPipeline() {
  const [cards, setCards] = useState<PipelineCard[]>([
    {
      id: 1,
      company: 'TechCorp Solutions',
      contact: 'Jean Dupont',
      value: '€120K',
      stage: 'prospect',
      tags: ['Mining', 'Partnership'],
      lastActivity: 'Il y a 2h'
    },
    {
      id: 2,
      company: 'Green Energy Co',
      contact: 'Marie Martin',
      value: '€200K',
      stage: 'prospect',
      tags: ['Energy', 'Renewable'],
      lastActivity: 'Il y a 1j'
    },
    {
      id: 3,
      company: 'Crypto Ventures',
      contact: 'Pierre Bernard',
      value: '€180K',
      stage: 'qualification',
      tags: ['Investment', 'Crypto'],
      lastActivity: 'Il y a 3j'
    },
    {
      id: 4,
      company: 'Mining Partners Inc',
      contact: 'Sophie Laurent',
      value: '€350K',
      stage: 'qualification',
      tags: ['Mining', 'Enterprise'],
      lastActivity: 'Il y a 5h'
    },
    {
      id: 5,
      company: 'Blockchain Hub',
      contact: 'Thomas Moreau',
      value: '€95K',
      stage: 'proposal',
      tags: ['Tech', 'Startup'],
      lastActivity: 'Il y a 1j'
    },
    {
      id: 6,
      company: 'Digital Assets Group',
      contact: 'Laura Petit',
      value: '€280K',
      stage: 'proposal',
      tags: ['Investment', 'Assets'],
      lastActivity: 'Il y a 2j'
    },
    {
      id: 7,
      company: 'Energy Solutions',
      contact: 'Marc Dubois',
      value: '€150K',
      stage: 'negotiation',
      tags: ['Energy', 'Enterprise'],
      lastActivity: 'Il y a 4h'
    },
    {
      id: 8,
      company: 'Crypto Mining Co',
      contact: 'Emma Rousseau',
      value: '€420K',
      stage: 'negotiation',
      tags: ['Mining', 'Large'],
      lastActivity: 'Il y a 6h'
    },
    {
      id: 9,
      company: 'Sustainable Mining',
      contact: 'Lucas Martin',
      value: '€195K',
      stage: 'closed',
      tags: ['Mining', 'Green'],
      lastActivity: 'Il y a 1j'
    }
  ])

  const stages = [
    { id: 'prospect', label: 'Prospects', color: 'var(--accent-info)' },
    { id: 'qualification', label: 'Qualification', color: 'var(--accent-warning)' },
    { id: 'proposal', label: 'Proposition', color: 'var(--accent-secondary)' },
    { id: 'negotiation', label: 'Négociation', color: 'var(--primary-green)' },
    { id: 'closed', label: 'Clôturés', color: 'var(--accent-success)' }
  ]

  const getCardsByStage = (stageId: string) => {
    return cards.filter(card => card.stage === stageId)
  }

  const getStageTotal = (stageId: string) => {
    const stageCards = getCardsByStage(stageId)
    return stageCards.reduce((sum, card) => {
      const value = parseInt(card.value.replace(/[€K]/g, ''))
      return sum + value
    }, 0)
  }

  return (
    <div className="business-dev-pipeline">
      {stages.map((stage) => {
        const stageCards = getCardsByStage(stage.id)
        const total = getStageTotal(stage.id)
        
        return (
          <div key={stage.id} className="pipeline-column">
            <div className="pipeline-column-header">
              <div className="pipeline-column-title">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: stage.color
                }} />
                <span>{stage.label}</span>
              </div>
              <div className="pipeline-column-count">{stageCards.length}</div>
            </div>
            
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              Total: <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>€{total}K</span>
            </div>

            <div className="pipeline-column-content">
              {stageCards.map((card) => (
                <div key={card.id} className="pipeline-card">
                  <div className="pipeline-card-header">
                    <div style={{ flex: 1 }}>
                      <div className="pipeline-card-company">{card.company}</div>
                      <div className="pipeline-card-contact">{card.contact}</div>
                    </div>
                    <div className="pipeline-card-value">{card.value}</div>
                  </div>
                  
                  <div className="pipeline-card-meta">
                    {card.tags.map((tag, index) => (
                      <span key={index} className="pipeline-card-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginTop: 'var(--space-2)',
                    paddingTop: 'var(--space-2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    {card.lastActivity}
                  </div>
                </div>
              ))}
              
              {stageCards.length === 0 && (
                <div style={{
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-sm)'
                }}>
                  Aucun deal dans cette étape
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}



