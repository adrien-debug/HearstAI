'use client'

import { useState } from 'react'
import BusinessDevOverview from '@/components/business-dev/BusinessDevOverview'
import BusinessDevPipeline from '@/components/business-dev/BusinessDevPipeline'
import BusinessDevContacts from '@/components/business-dev/BusinessDevContacts'
import BusinessDevActions from '@/components/business-dev/BusinessDevActions'
import { BusinessIcon, OverviewIcon, PipelineIcon, ContactsIcon, ActionsIcon } from '@/components/business-dev/BusinessDevIcons'
import '@/components/business-dev/BusinessDev.css'

export default function BusinessDevPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: OverviewIcon },
    { id: 'pipeline', label: 'Pipeline', icon: PipelineIcon },
    { id: 'contacts', label: 'Contacts', icon: ContactsIcon },
    { id: 'actions', label: 'Actions rapides', icon: ActionsIcon },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header Premium */}
        <div style={{ 
          marginBottom: 'var(--space-6)',
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-2)'
            }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary-green), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(138, 253, 129, 0.3)'
                }}>
                  <BusinessIcon size={24} color="#000" />
                </div>
                <div>
                  <h1 style={{ 
                    fontSize: 'var(--text-2xl)', 
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: 'var(--space-1)',
                    color: 'var(--text-primary)'
                  }}>
                    Business Development
                  </h1>
                  <p style={{ 
                    fontSize: 'var(--text-sm)', 
                    color: 'var(--text-secondary)', 
                    fontWeight: 400
                  }}>
                    CRM simplifié - Gestion des leads et partenariats
                  </p>
                </div>
              </div>
            </div>
            <button 
              className="btn-primary-hearst"
              onClick={() => {
                // Action pour ajouter un nouveau contact
                console.log('Nouveau contact')
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nouveau contact
            </button>
          </div>
          
          {/* Navigation tabs - Premium Style */}
          <nav className="business-dev-nav-tabs">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`business-dev-nav-tab ${activeSection === section.id ? 'active' : ''}`}
                >
                  <span className="nav-tab-icon">
                    <IconComponent size={18} color={activeSection === section.id ? 'var(--primary-green)' : 'currentColor'} />
                  </span>
                  <span className="nav-tab-label">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Section Content avec animation */}
        <div style={{
          animation: 'fadeIn 0.4s ease-in-out'
        }}>
          {activeSection === 'overview' && <BusinessDevOverview />}
          {activeSection === 'pipeline' && <BusinessDevPipeline />}
          {activeSection === 'contacts' && <BusinessDevContacts />}
          {activeSection === 'actions' && <BusinessDevActions />}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

