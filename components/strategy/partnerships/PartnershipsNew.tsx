'use client'

import { useState } from 'react'

export default function PartnershipsNew() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const newPartnerships = [
    {
      id: 1,
      name: 'Marathon Digital',
      category: 'Mining',
      status: 'new',
      stage: 'Contract Review',
      contactDate: '2024-01-20',
      nextMeeting: '2024-01-28',
      contact: 'partners@marathondh.com',
      notes: 'Initial discussions about hashrate partnership',
    },
    {
      id: 2,
      name: 'Digital Marketing Pro',
      category: 'Marketing',
      status: 'new',
      stage: 'Proposal Sent',
      contactDate: '2024-01-22',
      nextMeeting: '2024-01-30',
      contact: 'partners@digitalmarketingpro.com',
      notes: 'Waiting for proposal response',
    },
    {
      id: 3,
      name: 'Crypto Investment Fund Alpha',
      category: 'Investment Funds',
      status: 'discussion',
      stage: 'Due Diligence',
      contactDate: '2024-01-18',
      nextMeeting: '2024-01-25',
      contact: 'partners@crypto-alpha.com',
      notes: 'Investment terms under review',
    },
    {
      id: 4,
      name: 'OVHcloud',
      category: 'Providers',
      status: 'discussion',
      stage: 'Negotiation',
      contactDate: '2024-01-15',
      nextMeeting: '2024-01-27',
      contact: 'partners@ovh.com',
      notes: 'Pricing and terms negotiation',
    },
    {
      id: 5,
      name: 'Network Equipment Pro',
      category: 'Suppliers',
      status: 'discussion',
      stage: 'Initial Contact',
      contactDate: '2024-01-19',
      nextMeeting: 'TBD',
      contact: 'partnerships@networkpro.com',
      notes: 'First contact, exploring opportunities',
    },
  ]

  const filteredPartnerships = newPartnerships.filter(partnership => {
    const matchesSearch = partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partnership.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || partnership.category === categoryFilter
    return matchesSearch && matchesCategory
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
            placeholder="Search new partnerships..."
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
                <th>Stage</th>
                <th>Contact Date</th>
                <th>Next Meeting</th>
                <th>Contact</th>
                <th>Notes</th>
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
                  <td>{partnership.stage}</td>
                  <td>{partnership.contactDate}</td>
                  <td>{partnership.nextMeeting}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>
                    {partnership.contact}
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {partnership.notes}
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
          <div className="partnership-empty-state-title">No new partnerships found</div>
          <div className="partnership-empty-state-description">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}




