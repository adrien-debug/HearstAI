'use client'

import { useEffect, useState } from 'react'
import CockpitDashboard from '@/components/cockpit/CockpitDashboard'
import '@/components/cockpit/Cockpit.css'
import CockpitOperations from '@/components/cockpit/CockpitOperations'
import CockpitProduction from '@/components/cockpit/CockpitProduction'
import CockpitIncidents from '@/components/cockpit/CockpitIncidents'
import CockpitClients from '@/components/cockpit/CockpitClients'
import CockpitCustomerBatch from '@/components/cockpit/CockpitCustomerBatch'
import CockpitMiners from '@/components/cockpit/CockpitMiners'

export default function CockpitPage() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const sections = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'operations', label: 'Operations' },
    { id: 'production', label: 'Production' },
    { id: 'incidents-sla', label: 'Incidents & SLA' },
    { id: 'clients', label: 'Clients' },
    { id: 'customer-batch', label: 'Customer Batch' },
    { id: 'miners-activity', label: 'Miners Activity' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Cockpit</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="cockpit-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`cockpit-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'dashboard' && <CockpitDashboard />}
        {activeSection === 'operations' && <CockpitOperations />}
        {activeSection === 'production' && <CockpitProduction />}
        {activeSection === 'incidents-sla' && <CockpitIncidents />}
        {activeSection === 'clients' && <CockpitClients />}
        {activeSection === 'customer-batch' && <CockpitCustomerBatch />}
        {activeSection === 'miners-activity' && <CockpitMiners />}
      </div>
    </div>
  )
}

