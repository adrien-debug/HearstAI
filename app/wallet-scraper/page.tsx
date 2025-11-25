'use client'

import { useState } from 'react'
import WalletScraperOverview from '@/components/wallet-scraper/WalletScraperOverview'
import WalletScraperScan from '@/components/wallet-scraper/WalletScraperScan'
import WalletScraperAnalysis from '@/components/wallet-scraper/WalletScraperAnalysis'
import WalletScraperHistory from '@/components/wallet-scraper/WalletScraperHistory'
import WalletScraperBatch from '@/components/wallet-scraper/WalletScraperBatch'
import WalletScraperSettings from '@/components/wallet-scraper/WalletScraperSettings'
import '@/components/wallet-scraper/WalletScraper.css'

export default function WalletScraperPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'scan', label: 'Scan Wallet' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'history', label: 'History' },
    { id: 'batch', label: 'Batch Scan' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Wallet Scraper</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="wallet-scraper-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`wallet-scraper-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <WalletScraperOverview />}
        {activeSection === 'scan' && <WalletScraperScan />}
        {activeSection === 'analysis' && <WalletScraperAnalysis />}
        {activeSection === 'history' && <WalletScraperHistory />}
        {activeSection === 'batch' && <WalletScraperBatch />}
        {activeSection === 'settings' && <WalletScraperSettings />}
      </div>
    </div>
  )
}


