'use client'

import { useState } from 'react'

export default function PartnershipsMining() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const miningPartners = [
    {
      id: 1,
      name: 'Bitmain Technologies',
      location: 'Beijing, China',
      status: 'active',
      hashrate: '500 PH/s',
      contractValue: '$2.5M',
      startDate: '2023-06-15',
      endDate: '2025-06-15',
      contact: 'partnerships@bitmain.com',
    },
    {
      id: 2,
      name: 'Genesis Mining',
      location: 'Reykjavik, Iceland',
      status: 'active',
      hashrate: '300 PH/s',
      contractValue: '$1.8M',
      startDate: '2023-08-20',
      endDate: '2025-08-20',
      contact: 'partners@genesis-mining.com',
    },
    {
      id: 3,
      name: 'Hut 8 Mining',
      location: 'Toronto, Canada',
      status: 'active',
      hashrate: '250 PH/s',
      contractValue: '$1.5M',
      startDate: '2023-09-10',
      endDate: '2025-09-10',
      contact: 'business@hut8.com',
    },
    {
      id: 4,
      name: 'Riot Blockchain',
      location: 'Castle Rock, USA',
      status: 'discussion',
      hashrate: '400 PH/s',
      contractValue: 'TBD',
      startDate: 'TBD',
      endDate: 'TBD',
      contact: 'partnerships@riotblockchain.com',
    },
    {
      id: 5,
      name: 'Marathon Digital',
      location: 'Las Vegas, USA',
      status: 'new',
      hashrate: '350 PH/s',
      contractValue: '$2.0M',
      startDate: '2024-02-01',
      endDate: '2026-02-01',
      contact: 'partners@marathondh.com',
    },
  ]

  const filteredPartners = miningPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search mining partners..."
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
                <span className="partnership-detail-meta-label">Location:</span>
                <span className="partnership-detail-meta-value">{partner.location}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Hashrate:</span>
                <span className="partnership-detail-meta-value">{partner.hashrate}</span>
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
          <div className="partnership-empty-state-title">No mining partners found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}

