'use client'

import { useState } from 'react'
import TransactionsOverview from '@/components/transactions/TransactionsOverview'
import TransactionsAll from '@/components/transactions/TransactionsAll'
import TransactionsPending from '@/components/transactions/TransactionsPending'
import TransactionsFilters from '@/components/transactions/TransactionsFilters'
import TransactionsAnalytics from '@/components/transactions/TransactionsAnalytics'
import TransactionsSettings from '@/components/transactions/TransactionsSettings'
import '@/components/transactions/Transactions.css'

export default function TransactionsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'all', label: 'All Transactions' },
    { id: 'pending', label: 'Pending' },
    { id: 'filters', label: 'Filters & Search' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Transactions</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="transactions-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`transactions-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <TransactionsOverview />}
        {activeSection === 'all' && <TransactionsAll />}
        {activeSection === 'pending' && <TransactionsPending />}
        {activeSection === 'filters' && <TransactionsFilters />}
        {activeSection === 'analytics' && <TransactionsAnalytics />}
        {activeSection === 'settings' && <TransactionsSettings />}
      </div>
    </div>
  )
}


