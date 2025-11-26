'use client'

import { Investor } from '@/types/fundraising'
import { useState } from 'react'

interface InvestorListProps {
  investors: Investor[]
  onSelectInvestor: (investor: Investor) => void
  onDeleteInvestor: (id: string) => void
}

export default function InvestorList({ investors, onSelectInvestor, onDeleteInvestor }: InvestorListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'date' | 'interest'>('date')

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

  const filteredAndSorted = investors
    .filter(inv => {
      const matchesSearch = 
        `${inv.firstName} ${inv.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.company?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || inv.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'interest':
          return (b.investmentInterest || 0) - (a.investmentInterest || 0)
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

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
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="fundraising-list-container">
      {/* Filters and Search */}
      <div className="fundraising-list-controls">
        <div className="fundraising-search-box">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="m15 15-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un investisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fundraising-search-input"
          />
        </div>

        <div className="fundraising-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="fundraising-select"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="fundraising-select"
          >
            <option value="date">Plus récent</option>
            <option value="name">Nom</option>
            <option value="status">Statut</option>
            <option value="interest">Intérêt</option>
          </select>
        </div>
      </div>

      {/* Investors Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="fundraising-empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }}>
            <path d="M32 32a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 4c-8 0-24 4-24 12v4h48v-4c0-8-16-12-24-12z" fill="currentColor"/>
          </svg>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Aucun investisseur trouvé' 
              : 'Aucun investisseur pour le moment. Ajoutez votre premier contact !'}
          </p>
        </div>
      ) : (
        <div className="fundraising-investors-grid">
          {filteredAndSorted.map((investor) => (
            <div
              key={investor.id}
              className="fundraising-investor-card"
              onClick={() => onSelectInvestor(investor)}
            >
              <div className="fundraising-investor-card-header">
                <div className="fundraising-investor-avatar">
                  {investor.firstName.charAt(0)}{investor.lastName.charAt(0)}
                </div>
                <div className="fundraising-investor-info">
                  <h3 className="fundraising-investor-name">
                    {investor.firstName} {investor.lastName}
                  </h3>
                  {investor.company && (
                    <p className="fundraising-investor-company">{investor.company}</p>
                  )}
                  {investor.position && (
                    <p className="fundraising-investor-position">{investor.position}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Supprimer ${investor.firstName} ${investor.lastName} ?`)) {
                      onDeleteInvestor(investor.id)
                    }
                  }}
                  className="fundraising-icon-button"
                  style={{ marginLeft: 'auto' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="fundraising-investor-card-body">
                <div className="fundraising-investor-detail-row">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
                    <path d="M2 4l6 4 6-4M2 4h12v8H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <span className="fundraising-investor-email">{investor.email}</span>
                </div>

                {investor.investmentInterest && (
                  <div className="fundraising-investor-detail-row highlight">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>
                      {formatCurrency(investor.investmentInterest)}
                    </span>
                  </div>
                )}

                <div className="fundraising-investor-meta">
                  <span
                    className="fundraising-status-badge"
                    style={{
                      backgroundColor: `${statusColors[investor.status]}20`,
                      borderColor: statusColors[investor.status],
                      color: statusColors[investor.status],
                    }}
                  >
                    {statusLabels[investor.status]}
                  </span>
                  <span className="fundraising-date-label">
                    {formatDate(investor.updatedAt)}
                  </span>
                </div>
              </div>

              {investor.documents && investor.documents.length > 0 && (
                <div className="fundraising-investor-footer">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
                    <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="currentColor"/>
                  </svg>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {investor.documents.length} document{investor.documents.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



