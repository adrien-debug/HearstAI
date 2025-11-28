'use client'

import { useState, useEffect } from 'react'

export default function PartnershipsOverview() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    inDiscussion: 0,
    mining: 0,
    providers: 0,
    suppliers: 0,
    investmentFunds: 0,
    marketing: 0,
  })

  useEffect(() => {
    // Simuler des données - à remplacer par un appel API réel
    setStats({
      total: 24,
      active: 18,
      new: 6,
      inDiscussion: 4,
      mining: 8,
      providers: 5,
      suppliers: 4,
      investmentFunds: 3,
      marketing: 4,
    })
  }, [])

  const statCards = [
    {
      label: 'Total Partnerships',
      value: stats.total,
      change: '+3',
      changeType: 'positive' as const,
    },
    {
      label: 'Active Partnerships',
      value: stats.active,
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      label: 'New & In Discussion',
      value: stats.new,
      change: '+1',
      changeType: 'positive' as const,
    },
    {
      label: 'Mining Partners',
      value: stats.mining,
      change: null,
      changeType: null,
    },
    {
      label: 'Providers',
      value: stats.providers,
      change: null,
      changeType: null,
    },
    {
      label: 'Suppliers',
      value: stats.suppliers,
      change: null,
      changeType: null,
    },
    {
      label: 'Investment Funds',
      value: stats.investmentFunds,
      change: null,
      changeType: null,
    },
    {
      label: 'Marketing Partners',
      value: stats.marketing,
      change: null,
      changeType: null,
    },
  ]

  const recentPartnerships = [
    {
      id: 1,
      name: 'Bitmain Technologies',
      category: 'Mining',
      status: 'active',
      date: '2024-01-15',
      value: '$2.5M',
    },
    {
      id: 2,
      name: 'Genesis Mining',
      category: 'Mining',
      status: 'active',
      date: '2024-01-10',
      value: '$1.8M',
    },
    {
      id: 3,
      name: 'Crypto Investment Fund Alpha',
      category: 'Investment Funds',
      status: 'discussion',
      date: '2024-01-20',
      value: 'TBD',
    },
    {
      id: 4,
      name: 'Digital Marketing Pro',
      category: 'Marketing',
      status: 'new',
      date: '2024-01-22',
      value: '$500K',
    },
  ]

  return (
    <div>
      {/* Stats Grid */}
      <div className="partnership-stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="partnership-stat-card">
            <div className="partnership-stat-label">{stat.label}</div>
            <div className="partnership-stat-value">{stat.value}</div>
            {stat.change && (
              <div className={`partnership-stat-change ${stat.changeType}`}>
                {stat.changeType === 'positive' ? '↑' : '↓'} {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Partnerships */}
      <div className="partnership-card">
        <h2 style={{ 
          fontSize: 'var(--text-xl)', 
          fontWeight: 'var(--font-semibold)', 
          marginBottom: 'var(--space-6)',
          letterSpacing: '-0.01em'
        }}>
          Recent Partnerships
        </h2>
        
        <div className="partnership-table-container">
          <table className="partnership-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {recentPartnerships.map((partner) => (
                <tr key={partner.id}>
                  <td style={{ fontWeight: 'var(--font-medium)' }}>
                    {partner.name}
                  </td>
                  <td>{partner.category}</td>
                  <td>
                    <span className={`partnership-status-badge ${partner.status}`}>
                      <span className="partnership-status-dot"></span>
                      {partner.status}
                    </span>
                  </td>
                  <td>{partner.date}</td>
                  <td>{partner.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="partnership-card" style={{ marginTop: 'var(--space-6)' }}>
        <h2 style={{ 
          fontSize: 'var(--text-xl)', 
          fontWeight: 'var(--font-semibold)', 
          marginBottom: 'var(--space-6)',
          letterSpacing: '-0.01em'
        }}>
          Quick Actions
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          <button className="partnership-btn partnership-btn-primary">
            Add New Partnership
          </button>
          <button className="partnership-btn partnership-btn-secondary">
            Export Data
          </button>
          <button className="partnership-btn partnership-btn-secondary">
            View Reports
          </button>
        </div>
      </div>
    </div>
  )
}




