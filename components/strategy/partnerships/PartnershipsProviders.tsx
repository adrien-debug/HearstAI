'use client'

import { useState } from 'react'

export default function PartnershipsProviders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const providers = [
    {
      id: 1,
      name: 'AWS Cloud Services',
      service: 'Cloud Infrastructure',
      status: 'active',
      monthlyCost: '$15K',
      contractValue: '$180K',
      startDate: '2023-05-01',
      endDate: '2024-05-01',
      contact: 'partnerships@aws.com',
    },
    {
      id: 2,
      name: 'DigitalOcean',
      service: 'Cloud Hosting',
      status: 'active',
      monthlyCost: '$8K',
      contractValue: '$96K',
      startDate: '2023-07-15',
      endDate: '2024-07-15',
      contact: 'enterprise@digitalocean.com',
    },
    {
      id: 3,
      name: 'Hetzner Online',
      service: 'Dedicated Servers',
      status: 'active',
      monthlyCost: '$12K',
      contractValue: '$144K',
      startDate: '2023-06-10',
      endDate: '2024-06-10',
      contact: 'sales@hetzner.com',
    },
    {
      id: 4,
      name: 'OVHcloud',
      service: 'Infrastructure as a Service',
      status: 'discussion',
      monthlyCost: 'TBD',
      contractValue: 'TBD',
      startDate: 'TBD',
      endDate: 'TBD',
      contact: 'partners@ovh.com',
    },
  ]

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter
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
            placeholder="Search providers..."
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

      {/* Providers Grid */}
      <div className="partnership-detail-grid">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="partnership-detail-card">
            <div className="partnership-detail-header">
              <h3 className="partnership-detail-title">{provider.name}</h3>
              <span className={`partnership-status-badge ${provider.status}`}>
                <span className="partnership-status-dot"></span>
                {provider.status}
              </span>
            </div>
            
            <div className="partnership-detail-meta">
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Service:</span>
                <span className="partnership-detail-meta-value">{provider.service}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Monthly Cost:</span>
                <span className="partnership-detail-meta-value">{provider.monthlyCost}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contract Value:</span>
                <span className="partnership-detail-meta-value">{provider.contractValue}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Start Date:</span>
                <span className="partnership-detail-meta-value">{provider.startDate}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">End Date:</span>
                <span className="partnership-detail-meta-value">{provider.endDate}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contact:</span>
                <span className="partnership-detail-meta-value" style={{ fontSize: 'var(--text-xs)' }}>
                  {provider.contact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="partnership-empty-state">
          <div className="partnership-empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="partnership-empty-state-title">No providers found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}




