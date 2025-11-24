'use client'

import { useState } from 'react'
import WalletSetup from '@/components/wallet/WalletSetup'
import WalletTransactions from '@/components/wallet/WalletTransactions'
import WalletScrapper from '@/components/wallet/WalletScrapper'
import WalletProfitability from '@/components/wallet/WalletProfitability'
import WalletDocuments from '@/components/wallet/WalletDocuments'
import '@/components/wallet/Wallet.css'

export default function WalletPage() {
  const [activeSection, setActiveSection] = useState('setup')

  const sections = [
    { id: 'setup', label: 'Setup' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'scrapper', label: 'Wallet Scrapper' },
    { id: 'profitability', label: 'Profitability Index' },
    { id: 'documents', label: 'Documents Vault' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Wallet</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="wallet-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`wallet-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'setup' && <WalletSetup />}
        {activeSection === 'transactions' && <WalletTransactions />}
        {activeSection === 'scrapper' && <WalletScrapper />}
        {activeSection === 'profitability' && <WalletProfitability />}
        {activeSection === 'documents' && <WalletDocuments />}
      </div>
    </div>
  )
}


