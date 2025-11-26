'use client'

import { Investor } from '@/types/fundraising'
import { useState } from 'react'
import InvestorForm from './InvestorForm'

interface InvestorDetailProps {
  investor: Investor
  onUpdate: (investor: Investor) => void
  onDelete: () => void
  onBack: () => void
}

export default function InvestorDetail({ investor, onUpdate, onDelete, onBack }: InvestorDetailProps) {
  const [isEditing, setIsEditing] = useState(false)

  const statusColors: Record<string, string> = {
    lead: '#666666',
    contacted: '#4ecdc4',
    meeting: '#f6c344',
    proposal: '#3498db',
    negotiation: '#9b59b6',
    closed: '#8afd81',
    declined: '#e74c3c',
  }

  const statusLabels: Record<string, string> = {
    lead: 'Lead',
    contacted: 'Contacté',
    meeting: 'Meeting',
    proposal: 'Proposition',
    negotiation: 'Négociation',
    closed: 'Clôturé',
    declined: 'Décliné',
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isEditing) {
    return (
      <InvestorForm
        investor={investor}
        onSave={(updated) => {
          onUpdate(updated)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="fundraising-detail-container">
      {/* Header */}
      <div className="fundraising-detail-header">
        <button onClick={onBack} className="fundraising-icon-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="fundraising-detail-title-group">
          <div className="fundraising-investor-avatar large">
            {investor.firstName.charAt(0)}{investor.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="fundraising-detail-name">
              {investor.firstName} {investor.lastName}
            </h2>
            {investor.position && investor.company && (
              <p className="fundraising-detail-subtitle">
                {investor.position} @ {investor.company}
              </p>
            )}
          </div>
        </div>
        <div className="fundraising-detail-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="fundraising-btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)' }}>
              <path d="M11.333 2a1.414 1.414 0 0 1 2 2L4.667 12.667 2 13.333l.667-2.667L9.333 3.333a1.414 1.414 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            Modifier
          </button>
          <button
            onClick={onDelete}
            className="fundraising-btn-danger"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)' }}>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="fundraising-detail-grid">
        {/* Main Info Card */}
        <div className="fundraising-detail-card">
          <div className="fundraising-card-header">
            <h3>Informations Principales</h3>
          </div>
          <div className="fundraising-detail-content">
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Email</span>
              <a href={`mailto:${investor.email}`} className="fundraising-detail-value link">
                {investor.email}
              </a>
            </div>
            {investor.phone && (
              <div className="fundraising-detail-item">
                <span className="fundraising-detail-label">Téléphone</span>
                <a href={`tel:${investor.phone}`} className="fundraising-detail-value link">
                  {investor.phone}
                </a>
              </div>
            )}
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Statut</span>
              <span
                className="fundraising-status-badge"
                style={{
                  backgroundColor: `${statusColors[investor.status]}20`,
                  borderColor: statusColors[investor.status],
                  color: statusColors[investor.status],
                  fontSize: 'var(--text-sm)',
                  padding: 'var(--space-2) var(--space-4)',
                }}
              >
                {statusLabels[investor.status]}
              </span>
            </div>
            {investor.investmentInterest && (
              <div className="fundraising-detail-item highlight">
                <span className="fundraising-detail-label">Intérêt d'investissement</span>
                <span className="fundraising-detail-value" style={{ color: 'var(--primary-green)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                  {formatCurrency(investor.investmentInterest)}
                </span>
              </div>
            )}
            {investor.tags && investor.tags.length > 0 && (
              <div className="fundraising-detail-item">
                <span className="fundraising-detail-label">Tags</span>
                <div className="fundraising-tags-list">
                  {investor.tags.map(tag => (
                    <span key={tag} className="fundraising-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Card */}
        {investor.notes && (
          <div className="fundraising-detail-card">
            <div className="fundraising-card-header">
              <h3>Notes</h3>
            </div>
            <div className="fundraising-detail-content">
              <p style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                margin: 0
              }}>
                {investor.notes}
              </p>
            </div>
          </div>
        )}

        {/* Stats Card */}
        <div className="fundraising-detail-card">
          <div className="fundraising-card-header">
            <h3>Statistiques</h3>
          </div>
          <div className="fundraising-detail-content">
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Documents</span>
              <span className="fundraising-detail-value">
                {investor.documents?.length || 0}
              </span>
            </div>
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Emails envoyés</span>
              <span className="fundraising-detail-value">
                {investor.interactions?.filter(i => i.status === 'sent' || i.status === 'delivered' || i.status === 'opened').length || 0}
              </span>
            </div>
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Créé le</span>
              <span className="fundraising-detail-value">
                {formatDate(investor.createdAt)}
              </span>
            </div>
            <div className="fundraising-detail-item">
              <span className="fundraising-detail-label">Dernière mise à jour</span>
              <span className="fundraising-detail-value">
                {formatDate(investor.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Interactions */}
        {investor.interactions && investor.interactions.length > 0 && (
          <div className="fundraising-detail-card full-width">
            <div className="fundraising-card-header">
              <h3>Historique des Interactions</h3>
            </div>
            <div className="fundraising-detail-content">
              <div className="fundraising-interactions-list">
                {investor.interactions
                  .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
                  .slice(0, 5)
                  .map((interaction) => (
                    <div key={interaction.id} className="fundraising-interaction-item">
                      <div className="fundraising-interaction-header">
                        <span className="fundraising-interaction-subject">{interaction.subject}</span>
                        <span className="fundraising-date-label">{formatDate(interaction.sentAt)}</span>
                      </div>
                      <span
                        className="fundraising-status-badge"
                        style={{
                          backgroundColor: `${statusColors[interaction.status] || '#666666'}20`,
                          borderColor: statusColors[interaction.status] || '#666666',
                          color: statusColors[interaction.status] || '#666666',
                          fontSize: 'var(--text-xs)',
                          marginTop: 'var(--space-2)',
                        }}
                      >
                        {interaction.status === 'sent' ? 'Envoyé' : 
                         interaction.status === 'delivered' ? 'Livré' :
                         interaction.status === 'opened' ? 'Ouvert' : 'Répondu'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



