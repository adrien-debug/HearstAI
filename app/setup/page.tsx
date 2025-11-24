'use client'

import { useState } from 'react'
import SetupOverview from '@/components/setup/SetupOverview'
import SetupConfiguration from '@/components/setup/SetupConfiguration'
import SetupWallets from '@/components/setup/SetupWallets'
import SetupAPIKeys from '@/components/setup/SetupAPIKeys'
import SetupSecurity from '@/components/setup/SetupSecurity'
import SetupNotifications from '@/components/setup/SetupNotifications'
import SetupBackup from '@/components/setup/SetupBackup'
import '@/components/setup/Setup.css'

export default function SetupPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'wallets', label: 'Wallets' },
    { id: 'api-keys', label: 'API Keys' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'backup', label: 'Backup' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Setup</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="setup-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`setup-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && <SetupOverview />}
        {activeSection === 'configuration' && <SetupConfiguration />}
        {activeSection === 'wallets' && <SetupWallets />}
        {activeSection === 'api-keys' && <SetupAPIKeys />}
        {activeSection === 'security' && <SetupSecurity />}
        {activeSection === 'notifications' && <SetupNotifications />}
        {activeSection === 'backup' && <SetupBackup />}
      </div>
    </div>
  )
}


