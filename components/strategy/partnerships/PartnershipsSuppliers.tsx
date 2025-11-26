'use client'

import { useState } from 'react'

export default function PartnershipsSuppliers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const suppliers = [
    {
      id: 1,
      name: 'Antminer Supply Co.',
      category: 'Hardware',
      status: 'active',
      products: 'ASIC Miners, Power Supplies',
      annualVolume: '$500K',
      startDate: '2023-04-01',
      contact: 'sales@antminer-supply.com',
    },
    {
      id: 2,
      name: 'Cooling Solutions Inc.',
      category: 'Infrastructure',
      status: 'active',
      products: 'Cooling Systems, Ventilation',
      annualVolume: '$300K',
      startDate: '2023-05-15',
      contact: 'partners@cooling-solutions.com',
    },
    {
      id: 3,
      name: 'Power Grid Partners',
      category: 'Energy',
      status: 'active',
      products: 'Electricity Supply, Grid Access',
      annualVolume: '$1.2M',
      startDate: '2023-03-10',
      contact: 'business@powergrid.com',
    },
    {
      id: 4,
      name: 'Network Equipment Pro',
      category: 'Hardware',
      status: 'discussion',
      products: 'Network Switches, Cables',
      annualVolume: 'TBD',
      startDate: 'TBD',
      contact: 'partnerships@networkpro.com',
    },
  ]

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.products.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter
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
            placeholder="Search suppliers..."
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

      {/* Suppliers Grid */}
      <div className="partnership-detail-grid">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="partnership-detail-card">
            <div className="partnership-detail-header">
              <h3 className="partnership-detail-title">{supplier.name}</h3>
              <span className={`partnership-status-badge ${supplier.status}`}>
                <span className="partnership-status-dot"></span>
                {supplier.status}
              </span>
            </div>
            
            <div className="partnership-detail-meta">
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Category:</span>
                <span className="partnership-detail-meta-value">{supplier.category}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Products:</span>
                <span className="partnership-detail-meta-value">{supplier.products}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Annual Volume:</span>
                <span className="partnership-detail-meta-value">{supplier.annualVolume}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Start Date:</span>
                <span className="partnership-detail-meta-value">{supplier.startDate}</span>
              </div>
              <div className="partnership-detail-meta-item">
                <span className="partnership-detail-meta-label">Contact:</span>
                <span className="partnership-detail-meta-value" style={{ fontSize: 'var(--text-xs)' }}>
                  {supplier.contact}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="partnership-empty-state">
          <div className="partnership-empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="partnership-empty-state-title">No suppliers found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}



