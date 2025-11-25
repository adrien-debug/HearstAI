'use client'

import { useState, useEffect } from 'react'
import InvestorList from '@/components/fundraising/InvestorList'
import InvestorForm from '@/components/fundraising/InvestorForm'
import InvestorDetail from '@/components/fundraising/InvestorDetail'
import DocumentManager from '@/components/fundraising/DocumentManager'
import EmailComposer from '@/components/fundraising/EmailComposer'
import FundraisingStats from '@/components/fundraising/FundraisingStats'
import { Investor, Document, EmailInteraction } from '@/types/fundraising'
import '@/components/fundraising/Fundraising.css'

export default function FundraisingPage() {
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'add' | 'documents' | 'email'>('list')
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [investors, setInvestors] = useState<Investor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les investisseurs depuis localStorage
  useEffect(() => {
    const loadInvestors = () => {
      try {
        const saved = localStorage.getItem('hearst_fundraising_investors')
        if (saved) {
          const parsed = JSON.parse(saved)
          setInvestors(parsed)
        }
      } catch (error) {
        console.error('Error loading investors:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadInvestors()
  }, [])

  // Sauvegarder les investisseurs dans localStorage
  const saveInvestors = (updatedInvestors: Investor[]) => {
    try {
      localStorage.setItem('hearst_fundraising_investors', JSON.stringify(updatedInvestors))
      setInvestors(updatedInvestors)
    } catch (error) {
      console.error('Error saving investors:', error)
    }
  }

  const handleAddInvestor = (investor: Investor) => {
    const newInvestor = {
      ...investor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...investors, newInvestor]
    saveInvestors(updated)
    setSelectedInvestor(newInvestor)
    setActiveView('detail')
  }

  const handleUpdateInvestor = (updatedInvestor: Investor) => {
    const updated = investors.map(inv => 
      inv.id === updatedInvestor.id 
        ? { ...updatedInvestor, updatedAt: new Date().toISOString() }
        : inv
    )
    saveInvestors(updated)
    setSelectedInvestor(updatedInvestor)
  }

  const handleDeleteInvestor = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet investisseur ?')) {
      const updated = investors.filter(inv => inv.id !== id)
      saveInvestors(updated)
      if (selectedInvestor?.id === id) {
        setSelectedInvestor(null)
        setActiveView('list')
      }
    }
  }

  const handleSelectInvestor = (investor: Investor) => {
    setSelectedInvestor(investor)
    setActiveView('detail')
  }

  const handleDocumentAdded = (document: Document) => {
    if (selectedInvestor) {
      const updated = {
        ...selectedInvestor,
        documents: [...(selectedInvestor.documents || []), document],
        updatedAt: new Date().toISOString(),
      }
      handleUpdateInvestor(updated)
    }
  }

  const handleEmailSent = (interaction: EmailInteraction) => {
    if (selectedInvestor) {
      const updated = {
        ...selectedInvestor,
        interactions: [...(selectedInvestor.interactions || []), interaction],
        updatedAt: new Date().toISOString(),
      }
      handleUpdateInvestor(updated)
    }
  }

  if (isLoading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <div style={{ color: 'var(--text-secondary)' }}>Chargement...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 'var(--space-6)'
          }}>
            <div>
              <h1 style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 700,
                color: '#ffffff',
                position: 'relative',
                zIndex: 10,
                marginBottom: 'var(--space-2)'
              }}>
                Fundraising
              </h1>
              <p style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--text-secondary)', 
                fontWeight: 400
              }}>
                Gestion complète de vos leads investisseurs, documents et communications
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedInvestor(null)
                setActiveView('add')
              }}
              className="fundraising-btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)' }}>
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Nouveau Contact
            </button>
          </div>

          {/* Stats Overview */}
          <FundraisingStats investors={investors} />

          {/* Navigation Tabs */}
          <nav className="fundraising-nav-tabs">
            <button
              onClick={() => setActiveView('list')}
              className={`fundraising-nav-tab ${activeView === 'list' ? 'active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/>
                <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/>
                <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"/>
              </svg>
              Liste Investisseurs
            </button>
            {selectedInvestor && (
              <>
                <button
                  onClick={() => setActiveView('detail')}
                  className={`fundraising-nav-tab ${activeView === 'detail' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  Fiche Détaillée
                </button>
                <button
                  onClick={() => setActiveView('documents')}
                  className={`fundraising-nav-tab ${activeView === 'documents' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="currentColor"/>
                  </svg>
                  Documents
                </button>
                <button
                  onClick={() => setActiveView('email')}
                  className={`fundraising-nav-tab ${activeView === 'email' ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4l6 4 6-4M2 4h12v8H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  Envoyer Email
                </button>
              </>
            )}
            {activeView === 'add' && (
              <button className="fundraising-nav-tab active">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Nouveau Contact
              </button>
            )}
          </nav>
        </div>

        {/* Content Area */}
        <div className="fundraising-content-area">
          {activeView === 'list' && (
            <InvestorList
              investors={investors}
              onSelectInvestor={handleSelectInvestor}
              onDeleteInvestor={handleDeleteInvestor}
            />
          )}

          {activeView === 'add' && (
            <InvestorForm
              onSave={handleAddInvestor}
              onCancel={() => {
                setActiveView('list')
                setSelectedInvestor(null)
              }}
            />
          )}

          {activeView === 'detail' && selectedInvestor && (
            <InvestorDetail
              investor={selectedInvestor}
              onUpdate={handleUpdateInvestor}
              onDelete={() => handleDeleteInvestor(selectedInvestor.id)}
              onBack={() => {
                setActiveView('list')
                setSelectedInvestor(null)
              }}
            />
          )}

          {activeView === 'documents' && selectedInvestor && (
            <DocumentManager
              investor={selectedInvestor}
              onDocumentAdded={handleDocumentAdded}
              onUpdate={handleUpdateInvestor}
            />
          )}

          {activeView === 'email' && selectedInvestor && (
            <EmailComposer
              investor={selectedInvestor}
              onEmailSent={handleEmailSent}
            />
          )}
        </div>
      </div>
    </div>
  )
}

