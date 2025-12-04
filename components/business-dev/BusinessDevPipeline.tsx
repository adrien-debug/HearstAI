'use client'

import { useState, useEffect } from 'react'
import { pipelineAPI, dealsAPI, contactsAPI } from '@/lib/api/business-dev'

interface PipelineCard {
  id: string
  company: string
  contact: string
  value: string
  stage: string
  tags: string[]
  lastActivity: string
}

export default function BusinessDevPipeline() {
  const [pipeline, setPipeline] = useState<{
    prospect: PipelineCard[]
    qualification: PipelineCard[]
    proposal: PipelineCard[]
    negotiation: PipelineCard[]
    closed: PipelineCard[]
  }>({
    prospect: [],
    qualification: [],
    proposal: [],
    negotiation: [],
    closed: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDealModal, setShowCreateDealModal] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])

  // Load contacts for deal creation
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await contactsAPI.getAll({ limit: 100 })
        setContacts(data.contacts)
      } catch (err) {
        console.error('Error loading contacts:', err)
      }
    }
    loadContacts()
  }, [])

  // Listen for create deal event from Quick Actions
  useEffect(() => {
    const handleCreateDeal = () => {
      setShowCreateDealModal(true)
    }
    window.addEventListener('createDeal', handleCreateDeal)
    return () => {
      window.removeEventListener('createDeal', handleCreateDeal)
    }
  }, [])

  // Format currency
  const formatCurrency = (value: number, currency: string = 'EUR'): string => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`
    }
    return `€${value.toFixed(0)}`
  }

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return `Il y a ${diffMins}min`
      } else if (diffHours < 24) {
        return `Il y a ${diffHours}h`
      } else {
        return `Il y a ${diffDays}j`
      }
    } catch {
      return 'Récemment'
    }
  }

  // Load pipeline data function
  const loadPipeline = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await pipelineAPI.getPipeline()
      
      // Transform pipeline data to cards
      const transformToCards = (deals: any[]): PipelineCard[] => {
        return deals.map(deal => ({
          id: deal.id,
          company: deal.company || 'Unknown',
          contact: deal.contactName || 'Unknown',
          value: formatCurrency(deal.value, deal.currency),
          stage: deal.stage,
          tags: deal.tags || [],
          lastActivity: formatTimeAgo(deal.updatedAt),
        }))
      }

        setPipeline({
          prospect: transformToCards(data.pipeline.prospect || []),
          qualification: transformToCards(data.pipeline.qualification || []),
          proposal: transformToCards(data.pipeline.proposal || []),
          negotiation: transformToCards(data.pipeline.negotiation || []),
          closed: transformToCards(data.pipeline.closed || []),
        })
      } catch (err: any) {
        console.error('Error loading pipeline:', err)
        setError(err.message || 'Erreur lors du chargement du pipeline')
      } finally {
        setLoading(false)
      }
    }

  // Initial load
  useEffect(() => {
    loadPipeline()
  }, [])

  // Reload pipeline when deals are added/updated
  useEffect(() => {
    const handleDealUpdated = () => {
      loadPipeline()
    }
    window.addEventListener('dealCreated', handleDealUpdated)
    window.addEventListener('dealUpdated', handleDealUpdated)
    return () => {
      window.removeEventListener('dealCreated', handleDealUpdated)
      window.removeEventListener('dealUpdated', handleDealUpdated)
    }
  }, [])

  const stages = [
    { id: 'prospect', label: 'Prospects', color: 'var(--accent-info)' },
    { id: 'qualification', label: 'Qualification', color: 'var(--accent-warning)' },
    { id: 'proposal', label: 'Proposition', color: 'var(--accent-secondary)' },
    { id: 'negotiation', label: 'Négociation', color: 'var(--primary-green)' },
    { id: 'closed', label: 'Clôturés', color: 'var(--accent-success)' }
  ]

  // Get the next stage in sequence
  const getNextStage = (currentStageId: string) => {
    const stageOrder = ['prospect', 'qualification', 'proposal', 'negotiation', 'closed']
    const currentIndex = stageOrder.indexOf(currentStageId)
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      const nextStageId = stageOrder[currentIndex + 1]
      return stages.find(s => s.id === nextStageId)
    }
    return null
  }

  const getCardsByStage = (stageId: string): PipelineCard[] => {
    return pipeline[stageId as keyof typeof pipeline] || []
  }

  const getStageTotal = (stageId: string) => {
    const stageCards = getCardsByStage(stageId)
    return stageCards.reduce((sum, card) => {
      // Extract numeric value from formatted string like "€120K" or "€2.4M"
      const match = card.value.match(/€([\d.]+)([KM]?)/)
      if (match) {
        let value = parseFloat(match[1])
        if (match[2] === 'M') value *= 1000
        return sum + value
      }
      return sum
    }, 0)
  }

  if (loading) {
    return (
      <div style={{
        padding: 'var(--space-12)',
        textAlign: 'center',
        background: 'rgba(14, 14, 14, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--text-primary)',
        }}>
          Chargement du pipeline...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: 'var(--space-4)',
        background: 'rgba(255, 77, 77, 0.1)',
        border: '1px solid rgba(255, 77, 77, 0.3)',
        borderRadius: 'var(--radius-md)',
        color: '#ff4d4d',
        fontSize: 'var(--text-sm)',
      }}>
        {error}
      </div>
    )
  }

  // Handle stage change (move deal to different stage)
  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      await dealsAPI.updateStage(dealId, newStage as any)
      window.dispatchEvent(new CustomEvent('dealUpdated'))
      loadPipeline()
    } catch (err: any) {
      console.error('Error updating deal stage:', err)
      alert(`Erreur lors du déplacement du deal: ${err.message}`)
    }
  }

  return (
    <div>
      {/* Header with Create Deal button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
      }}>
        <div>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-1)',
          }}>
            Pipeline des deals
          </h2>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}>
            Gérez vos opportunités et suivez leur progression
          </p>
        </div>
        <button
          className="btn-primary-hearst"
          onClick={() => setShowCreateDealModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nouveau deal
        </button>
      </div>

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
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span>{card.lastActivity}</span>
                    {(() => {
                      const nextStage = getNextStage(stage.id)
                      if (!nextStage) return null
                      
                      return (
                        <button
                          onClick={() => handleStageChange(card.id, nextStage.id)}
                          style={{
                            padding: 'var(--space-1) var(--space-2)',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--text-xs)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = nextStage.color
                            e.currentTarget.style.color = nextStage.color
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.color = 'var(--text-secondary)'
                          }}
                          title={`Déplacer vers ${nextStage.label}`}
                        >
                          →
                        </button>
                      )
                    })()}
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
                  {stage.id === 'prospect' && (
                    <button
                      onClick={() => setShowCreateDealModal(true)}
                      style={{
                        display: 'block',
                        margin: 'var(--space-4) auto 0',
                        padding: 'var(--space-2) var(--space-4)',
                        background: 'transparent',
                        border: '1px solid var(--primary-green)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--primary-green)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(197, 255, 167, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      + Créer un deal
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>

      {/* Create Deal Modal */}
      {showCreateDealModal && (
        <CreateDealModal
          contacts={contacts}
          onClose={() => setShowCreateDealModal(false)}
          onSuccess={() => {
            setShowCreateDealModal(false)
            window.dispatchEvent(new CustomEvent('dealCreated'))
            loadPipeline()
          }}
        />
      )}
    </div>
  )
}

// Create Deal Modal Component
function CreateDealModal({ 
  contacts, 
  onClose, 
  onSuccess 
}: { 
  contacts: any[]
  onClose: () => void
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    stage: 'prospect' as 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed',
    estimatedValue: '',
    currency: 'EUR',
    probability: '0',
    expectedCloseDate: '',
    tags: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!formData.title || !formData.contactId) {
        throw new Error('Le titre et le contact sont requis')
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

      await dealsAPI.create({
        title: formData.title,
        contactId: formData.contactId,
        stage: formData.stage,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
        currency: formData.currency,
        probability: formData.probability ? parseInt(formData.probability, 10) : 0,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        notes: formData.notes || undefined,
      })

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du deal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
            Nouveau deal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Créez un nouveau deal dans votre pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Titre du deal *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="Ex: Partenariat avec TechCorp"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Contact *
            </label>
            <select
              required
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              <option value="">Sélectionner un contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} - {contact.company}
                </option>
              ))}
            </select>
            {contacts.length === 0 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                Aucun contact disponible. <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openContactModal')); }} style={{ color: 'var(--primary-green)' }}>Créer un contact</a>
              </p>
            )}
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Étape initiale
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              <option value="prospect">Prospects</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposition</option>
              <option value="negotiation">Négociation</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                Valeur estimée
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-mono)',
                }}
                placeholder="120000"
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                Devise
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                }}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Probabilité (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
              }}
              placeholder="0"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Date de clôture prévue
            </label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="Mining, Partnership, Enterprise"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
                resize: 'vertical',
              }}
              placeholder="Notes supplémentaires sur ce deal..."
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-3)',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#ff4d4d',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: loading ? 'var(--primary-grey)' : '#C5FFA7',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              {loading ? 'Création...' : 'Créer le deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



