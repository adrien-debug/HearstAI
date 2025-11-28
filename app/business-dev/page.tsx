'use client'

import { useState } from 'react'
import BusinessDevOverview from '@/components/business-dev/BusinessDevOverview'
import BusinessDevPipeline from '@/components/business-dev/BusinessDevPipeline'
import BusinessDevContacts from '@/components/business-dev/BusinessDevContacts'
import BusinessDevActions from '@/components/business-dev/BusinessDevActions'
import { BusinessIcon, OverviewIcon, PipelineIcon, ContactsIcon, ActionsIcon } from '@/components/business-dev/BusinessDevIcons'
import { businessDevContactsAPI } from '@/lib/api/business-dev-contacts'
import '@/components/business-dev/BusinessDev.css'

export default function BusinessDevPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [showAddContactModal, setShowAddContactModal] = useState(false)

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
                  background: '#C5FFA7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(197, 255, 167, 0.3)'
                }}>
                  <BusinessIcon size={24} color="#000" />
                </div>
                <div>
                  <h1 style={{ 
                    fontSize: 'var(--text-2xl)', 
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: 'var(--space-1)',
                    color: '#ffffff',
                    position: 'relative',
                    zIndex: 10
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
                setShowAddContactModal(true)
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
                    <IconComponent size={18} color={activeSection === section.id ? '#C5FFA7' : 'currentColor'} />
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

      {/* Modal pour ajouter un nouveau contact */}
      {showAddContactModal && (
        <AddContactModal 
          onClose={() => setShowAddContactModal(false)}
          onSuccess={() => {
            setShowAddContactModal(false)
            // Basculer vers l'onglet contacts si on n'y est pas déjà
            if (activeSection !== 'contacts') {
              setActiveSection('contacts')
            }
          }}
        />
      )}

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

// Modal pour ajouter un nouveau contact
function AddContactModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'pending' as 'active' | 'pending' | 'inactive',
    value: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Créer le contact via l'API
      await businessDevContactsAPI.create({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone || undefined,
        status: formData.status,
        estimatedValue: formData.value || undefined,
      })
      
      // Déclencher un événement personnalisé pour notifier les composants
      window.dispatchEvent(new CustomEvent('businessDevContactAdded'))
      
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: '#ffffff' }}>
            Nouveau contact
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Ajoutez un nouveau contact à votre CRM Business Development
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Nom complet *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="Jean Dupont"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Entreprise *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="TechCorp Solutions"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="jean.dupont@techcorp.com"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'pending' | 'inactive' })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              <option value="pending">En attente</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}>
              Valeur estimée
            </label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
              }}
              placeholder="€120K"
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-3)',
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#ff4d4d',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: loading ? 'var(--primary-grey)' : '#C5FFA7',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#B0FF8F'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#C5FFA7'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                }
              }}
            >
              {loading ? 'Création...' : 'Créer le contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

