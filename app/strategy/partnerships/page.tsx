'use client'

import { useState } from 'react'
import PartnershipsOverview from '@/components/strategy/partnerships/PartnershipsOverview'
import PartnershipsMining from '@/components/strategy/partnerships/PartnershipsMining'
import PartnershipsProviders from '@/components/strategy/partnerships/PartnershipsProviders'
import PartnershipsSuppliers from '@/components/strategy/partnerships/PartnershipsSuppliers'
import PartnershipsInvestmentFunds from '@/components/strategy/partnerships/PartnershipsInvestmentFunds'
import PartnershipsMarketing from '@/components/strategy/partnerships/PartnershipsMarketing'
import PartnershipsNew from '@/components/strategy/partnerships/PartnershipsNew'
import PartnershipsActive from '@/components/strategy/partnerships/PartnershipsActive'
import '@/components/strategy/partnerships/Partnerships.css'

export default function PartnershipsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'mining', label: 'Mining Partners' },
    { id: 'providers', label: 'Providers' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'investment-funds', label: 'Investment Funds' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'new', label: 'New & In Discussion' },
    { id: 'active', label: 'Active Partners' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Partnerships</h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Strategic partnerships management & collaboration hub
          </p>
          
          {/* Navigation tabs - Premium Style */}
          <nav className="partnerships-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`partnerships-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <PartnershipsOverview />}
        {activeSection === 'mining' && <PartnershipsMining />}
        {activeSection === 'providers' && <PartnershipsProviders />}
        {activeSection === 'suppliers' && <PartnershipsSuppliers />}
        {activeSection === 'investment-funds' && <PartnershipsInvestmentFunds />}
        {activeSection === 'marketing' && <PartnershipsMarketing />}
        {activeSection === 'new' && <PartnershipsNew />}
        {activeSection === 'active' && <PartnershipsActive />}
      </div>
    </div>
  )
}

