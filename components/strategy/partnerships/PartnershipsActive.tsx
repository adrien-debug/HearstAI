'use client'

import { useState } from 'react'

export default function PartnershipsActive() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const activePartnerships = [
    {
      id: 1,
      name: 'Bitmain Technologies',
      category: 'Mining',
      status: 'active',
      contractValue: '$2.5M',
      startDate: '2023-06-15',
      endDate: '2025-06-15',
      performance: 'Excellent',
      contact: 'partnerships@bitmain.com',
    },
    {
      id: 2,
      name: 'Genesis Mining',
      category: 'Mining',
      status: 'active',
      contractValue: '$1.8M',
      startDate: '2023-08-20',
      endDate: '2025-08-20',
      performance: 'Good',
      contact: 'partners@genesis-mining.com',
    },
    {
      id: 3,
      name: 'AWS Cloud Services',
      category: 'Providers',
      status: 'active',
      contractValue: '$180K',
      startDate: '2023-05-01',
      endDate: '2024-05-01',
      performance: 'Excellent',
      contact: 'partnerships@aws.com',
    },
    {
      id: 4,
      name: 'Crypto PR Agency',
      category: 'Marketing',
      status: 'active',
      contractValue: '$240K',
      startDate: '2023-11-15',
      endDate: '2024-11-15',
      performance: 'Good',
      contact: 'business@cryptopr.com',
    },
    {
      id: 5,
      name: 'Antminer Supply Co.',
      category: 'Suppliers',
      status: 'active',
      contractValue: '$500K',
      startDate: '2023-04-01',
      endDate: '2024-04-01',
      performance: 'Excellent',
      contact: 'sales@antminer-supply.com',
    },
    {
      id: 6,
      name: 'Blockchain Ventures',
      category: 'Investment Funds',
      status: 'active',
      contractValue: '$10M',
      startDate: '2023-07-01',
      endDate: '2026-07-01',
      performance: 'Excellent',
      contact: 'investments@blockchain-ventures.com',
    },
  ]

  const filteredPartnerships = activePartnerships.filter(partnership => {
    const matchesSearch = partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partnership.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || partnership.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return 'var(--hearst-green)'
      case 'Good':
        return '#ffc107'
      case 'Average':
        return '#ff9800'
      default:
        return 'var(--text-secondary)'
    }
  }

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
            placeholder="Search active partnerships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="partnership-filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Mining">Mining</option>
          <option value="Providers">Providers</option>
          <option value="Suppliers">Suppliers</option>
          <option value="Investment Funds">Investment Funds</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Partnerships Table */}
      <div className="partnership-card">
        <div className="partnership-table-container">
          <table className="partnership-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Contract Value</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Performance</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartnerships.map((partnership) => (
                <tr key={partnership.id}>
                  <td style={{ fontWeight: 'var(--font-medium)' }}>
                    {partnership.name}
                  </td>
                  <td>{partnership.category}</td>
                  <td>
                    <span className={`partnership-status-badge ${partnership.status}`}>
                      <span className="partnership-status-dot"></span>
                      {partnership.status}
                    </span>
                  </td>
                  <td>{partnership.contractValue}</td>
                  <td>{partnership.startDate}</td>
                  <td>{partnership.endDate}</td>
                  <td>
                    <span style={{ 
                      color: getPerformanceColor(partnership.performance),
                      fontWeight: 'var(--font-medium)'
                    }}>
                      {partnership.performance}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>
                    {partnership.contact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPartnerships.length === 0 && (
        <div className="partnership-empty-state">
          <div className="partnership-empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="partnership-empty-state-title">No active partnerships found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}



