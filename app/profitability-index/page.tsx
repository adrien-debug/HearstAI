'use client'

import { useState } from 'react'
import ProfitabilityIndexOverview from '@/components/profitability-index/ProfitabilityIndexOverview'
import ProfitabilityIndexMetrics from '@/components/profitability-index/ProfitabilityIndexMetrics'
import ProfitabilityIndexComparison from '@/components/profitability-index/ProfitabilityIndexComparison'
import ProfitabilityIndexTrends from '@/components/profitability-index/ProfitabilityIndexTrends'
import ProfitabilityIndexReports from '@/components/profitability-index/ProfitabilityIndexReports'
import ProfitabilityIndexSettings from '@/components/profitability-index/ProfitabilityIndexSettings'
import '@/components/profitability-index/ProfitabilityIndex.css'

export default function ProfitabilityIndexPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'trends', label: 'Trends' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Profitability Index</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="profitability-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`profitability-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <ProfitabilityIndexOverview />}
        {activeSection === 'metrics' && <ProfitabilityIndexMetrics />}
        {activeSection === 'comparison' && <ProfitabilityIndexComparison />}
        {activeSection === 'trends' && <ProfitabilityIndexTrends />}
        {activeSection === 'reports' && <ProfitabilityIndexReports />}
        {activeSection === 'settings' && <ProfitabilityIndexSettings />}
      </div>
    </div>
  )
}


