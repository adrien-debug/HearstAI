'use client'

import { useState } from 'react'

export default function PartnershipsInvestmentFunds() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const investmentFunds = [
    {
      id: 1,
      name: 'Crypto Investment Fund Alpha',
      type: 'Venture Capital',
      status: 'discussion',
      aum: '$500M',
      investmentFocus: 'Mining Infrastructure',
      potentialInvestment: '$5M',
      contact: 'partners@crypto-alpha.com',
    },
    {
      id: 2,
      name: 'Blockchain Ventures',
      type: 'Private Equity',
      status: 'active',
      aum: '$1.2B',
      investmentFocus: 'Crypto Mining',
      potentialInvestment: '$10M',
      contact: 'investments@blockchain-ventures.com',
    },
    {
      id: 3,
      name: 'Digital Assets Capital',
      type: 'Hedge Fund',
      status: 'new',
      aum: '$800M',
      investmentFocus: 'Mining Operations',
      potentialInvestment: '$7.5M',
      contact: 'partnerships@digitalassets.com',
    },
  ]

  const filteredFunds = investmentFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || fund.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      {/* Filters */}
      <div className="partnership-filters">
        <div className="partnership-search">
          <svg className="partnership-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search investment funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="partnership-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="discussion">In Discussion</option>
          <option value="new">New</option>
        </select>
      </div>

      {/* Funds Grid */}
      <div className="partnership-detail-grid">
        {filteredFunds.map((fund) => (
          <div key={fund.id} className="partnership-detail-card">
            <div className="partnership-detail-header">
              <h3 className="partnership-detail-title">{fund.name}</h3>
              <span className={`partnership-status-badge ${fund.status}`}>
                <span className="partnership-status-dot"></span>
                {fund.status}
              </span>
            </div>
            
            <div className="partnership-detail-meta">
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Type:</span>
                <span className="partnership-detail-meta-value">{fund.type}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">AUM:</span>
                <span className="partnership-detail-meta-value">{fund.aum}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Investment Focus:</span>
                <span className="partnership-detail-meta-value">{fund.investmentFocus}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Potential Investment:</span>
                <span className="partnership-detail-meta-value" style={{ color: 'var(--hearst-green)' }}>
                  {fund.potentialInvestment}
                </span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contact:</span>
                <span className="partnership-detail-meta-value" style={{ fontSize: 'var(--text-xs)' }}>
                  {fund.contact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFunds.length === 0 && (
        <div className="partnership-empty-state">
          <div className="partnership-empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="partnership-empty-state-title">No investment funds found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}

