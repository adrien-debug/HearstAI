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
    // Load icons when section changes
    const loadIcons = () => {
      if (typeof window !== 'undefined' && (window as any).Icons) {
        document.querySelectorAll('[data-icon]').forEach(el => {
          const iconName = el.getAttribute('data-icon')
          if (iconName) {
            const iconSvg = (window as any).Icons[iconName]
            if (iconSvg) {
              el.innerHTML = iconSvg
            }
          }
        })
      }
    }
    
    // Load icons immediately and after delays to ensure they load
    loadIcons()
    const timeout1 = setTimeout(loadIcons, 100)
    const timeout2 = setTimeout(loadIcons, 500)
    const timeout3 = setTimeout(loadIcons, 1000)
    
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
    }
  }, [activeSection])

  return (
    <div className="dashboard-view">
      <IconsLoader />
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Collateral</h1>
          
          {/* Navigation tabs - Dashboard Style */}
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

