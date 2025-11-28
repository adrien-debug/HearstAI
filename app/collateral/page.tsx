'use client'

import { useState, useEffect } from 'react'
import CollateralOverview from '@/components/collateral/CollateralOverview'
import '@/components/collateral/Collateral.css'
import CollateralAssets from '@/components/collateral/CollateralAssets'
import CollateralLoans from '@/components/collateral/CollateralLoans'
import CollateralTransactions from '@/components/collateral/CollateralTransactions'
import CollateralAnalytics from '@/components/collateral/CollateralAnalytics'
import CollateralClients from '@/components/collateral/CollateralClients'
import IconsLoader from '@/components/IconsLoader'

export default function CollateralPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'clients', label: 'Clients' },
    { id: 'assets', label: 'Assets' },
    { id: 'loans', label: 'Loans' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'analytics', label: 'Analytics' },
  ]

  useEffect(() => {
    // Load icons when section changes - optimized to avoid multiple calls
    if (typeof window === 'undefined' || !(window as any).Icons) {
      return
    }
    
    const loadIcons = () => {
      document.querySelectorAll('[data-icon]').forEach(el => {
        const iconName = el.getAttribute('data-icon')
        if (iconName && !el.innerHTML.trim()) {
          const iconSvg = (window as any).Icons[iconName]
          if (iconSvg) {
            el.innerHTML = iconSvg
          }
        }
      })
    }
    
    // Load icons with a single delay after section change
    const timeout = setTimeout(loadIcons, 100)
    
    return () => {
      clearTimeout(timeout)
    }
  }, [activeSection])

  return (
    <div className="dashboard-view">
      <IconsLoader />
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Collateral</h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Collateral management & DeBank integration hub
          </p>
          
          {/* Navigation tabs - Premium Style */}
          <nav className="collateral-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`collateral-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <CollateralOverview />}
        {activeSection === 'clients' && <CollateralClients />}
        {activeSection === 'assets' && <CollateralAssets />}
        {activeSection === 'loans' && <CollateralLoans />}
        {activeSection === 'transactions' && <CollateralTransactions />}
        {activeSection === 'analytics' && <CollateralAnalytics />}
      </div>
    </div>
  )
}

