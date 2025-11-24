'use client'

import { useState } from 'react'
import DocumentsVaultOverview from '@/components/documents-vault/DocumentsVaultOverview'
import DocumentsVaultBrowse from '@/components/documents-vault/DocumentsVaultBrowse'
import DocumentsVaultUpload from '@/components/documents-vault/DocumentsVaultUpload'
import DocumentsVaultCategories from '@/components/documents-vault/DocumentsVaultCategories'
import DocumentsVaultSearch from '@/components/documents-vault/DocumentsVaultSearch'
import DocumentsVaultSettings from '@/components/documents-vault/DocumentsVaultSettings'
import '@/components/documents-vault/DocumentsVault.css'

export default function DocumentsVaultPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'browse', label: 'Browse' },
    { id: 'upload', label: 'Upload' },
    { id: 'categories', label: 'Categories' },
    { id: 'search', label: 'Search' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Documents Vault</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="documents-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
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
        {activeSection === 'browse' && <DocumentsVaultBrowse />}
        {activeSection === 'upload' && <DocumentsVaultUpload />}
        {activeSection === 'categories' && <DocumentsVaultCategories />}
        {activeSection === 'search' && <DocumentsVaultSearch />}
        {activeSection === 'settings' && <DocumentsVaultSettings />}
      </div>
    </div>
  )
}


