'use client'

import { useState } from 'react'

export default function PartnershipsMarketing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const marketingPartners = [
    {
      id: 1,
      name: 'Digital Marketing Pro',
      service: 'SEO & Content Marketing',
      status: 'new',
      monthlyBudget: '$15K',
      contractValue: '$180K',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      contact: 'partners@digitalmarketingpro.com',
    },
    {
      id: 2,
      name: 'Crypto PR Agency',
      service: 'Public Relations & Media',
      status: 'active',
      monthlyBudget: '$20K',
      contractValue: '$240K',
      startDate: '2023-11-15',
      endDate: '2024-11-15',
      contact: 'business@cryptopr.com',
    },
    {
      id: 3,
      name: 'Social Media Experts',
      service: 'Social Media Management',
      status: 'active',
      monthlyBudget: '$12K',
      contractValue: '$144K',
      startDate: '2023-10-01',
      endDate: '2024-10-01',
      contact: 'partnerships@socialmediaexperts.com',
    },
    {
      id: 4,
      name: 'Influencer Network',
      service: 'Influencer Marketing',
      status: 'discussion',
      monthlyBudget: 'TBD',
      contractValue: 'TBD',
      startDate: 'TBD',
      endDate: 'TBD',
      contact: 'partners@influencernetwork.com',
    },
  ]

  const filteredPartners = marketingPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
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
            placeholder="Search marketing partners..."
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

      {/* Partners Grid */}
      <div className="partnership-detail-grid">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="partnership-detail-card">
            <div className="partnership-detail-header">
              <h3 className="partnership-detail-title">{partner.name}</h3>
              <span className={`partnership-status-badge ${partner.status}`}>
                <span className="partnership-status-dot"></span>
                {partner.status}
              </span>
            </div>
            
            <div className="partnership-detail-meta">
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Service:</span>
                <span className="partnership-detail-meta-value">{partner.service}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Monthly Budget:</span>
                <span className="partnership-detail-meta-value">{partner.monthlyBudget}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contract Value:</span>
                <span className="partnership-detail-meta-value">{partner.contractValue}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Start Date:</span>
                <span className="partnership-detail-meta-value">{partner.startDate}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">End Date:</span>
                <span className="partnership-detail-meta-value">{partner.endDate}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contact:</span>
                <span className="partnership-detail-meta-value" style={{ fontSize: 'var(--text-xs)' }}>
                  {partner.contact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="partnership-empty-state">
          <div className="partnership-empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="partnership-empty-state-title">No marketing partners found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}



