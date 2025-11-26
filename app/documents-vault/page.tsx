'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DocumentsVaultOverview from '@/components/documents-vault/DocumentsVaultOverview'
import DocumentsVaultUpload from '@/components/documents-vault/DocumentsVaultUpload'
import DocumentsVaultShare from '@/components/documents-vault/DocumentsVaultShare'
import '@/components/documents-vault/DocumentsVault.css'

function DocumentsVaultContent() {
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    // If coming with share parameter, open Share page directly
    if (searchParams?.get('share')) {
      setActiveSection('share')
    }
    // If coming with tab parameter, open corresponding tab
    const tab = searchParams?.get('tab')
    if (tab && ['overview', 'upload', 'share'].includes(tab)) {
      setActiveSection(tab)
    }
  }, [searchParams])

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'upload', label: 'Upload' },
    { id: 'share', label: 'Share' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Documents Vault</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="documents-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                data-tab={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`documents-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <DocumentsVaultOverview />}
        {activeSection === 'upload' && <DocumentsVaultUpload />}
        {activeSection === 'share' && <DocumentsVaultShare />}
      </div>
    </div>
  )
}

export default function DocumentsVaultPage() {
  return (
    <Suspense fallback={
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-6)' }}>
            Loading...
          </div>
        </div>
      </div>
    }>
      <DocumentsVaultContent />
    </Suspense>
  )
}


