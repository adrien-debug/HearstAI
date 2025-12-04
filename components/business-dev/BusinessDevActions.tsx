'use client'

import { useState, useEffect } from 'react'
import { contactsAPI, dealsAPI, tasksAPI, activitiesAPI, metricsAPI } from '@/lib/api/business-dev'

interface QuickAction {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  action: () => void
}

export default function BusinessDevActions() {
  const [contacts, setContacts] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeDeals: 0,
    pipelineValue: 0,
    conversionRate: 0,
  })

  // Load contacts for deal creation
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await contactsAPI.getAll({ limit: 100 })
        setContacts(data.contacts)
      } catch (err) {
        console.error('Error loading contacts:', err)
      }
    }
    loadContacts()
  }, [])

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const metrics = await metricsAPI.getMetrics()
        setStats({
          totalContacts: metrics.totalContacts.value,
          activeDeals: metrics.activeDeals.value,
          pipelineValue: metrics.pipelineValue.value,
          conversionRate: metrics.conversionRate.value,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    }
    loadStats()
  }, [])

  const [actions] = useState<QuickAction[]>([
    {
      id: 1,
      title: 'Ajouter un contact',
      description: 'Créer un nouveau contact dans votre CRM',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      color: 'var(--primary-green)',
      action: () => {
        // Trigger contact modal in parent page
        window.dispatchEvent(new CustomEvent('openContactModal'))
      },
    },
    {
      id: 2,
      title: 'Créer un deal',
      description: 'Lancer un nouveau deal dans le pipeline',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      color: 'var(--accent-secondary)',
      action: () => {
        // Trigger deal creation modal
        window.dispatchEvent(new CustomEvent('createDeal'))
      },
    },
    {
      id: 3,
      title: 'Planifier un meeting',
      description: 'Organiser une réunion avec un prospect',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      color: 'var(--accent-info)',
      action: () => {
        // For now, show alert - can be enhanced with modal later
        alert('Fonctionnalité de planification de meeting - À implémenter avec modal')
      },
    },
    {
      id: 4,
      title: 'Créer une tâche',
      description: 'Ajouter une nouvelle tâche à votre liste',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: 'var(--accent-warning)',
      action: () => {
        // For now, show alert - can be enhanced with modal later
        alert('Fonctionnalité de création de tâche - À implémenter avec modal')
      },
    },
    {
      id: 5,
      title: 'Exporter les données',
      description: 'Télécharger vos contacts et deals en CSV',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      color: 'var(--accent-success)',
      action: async () => {
        try {
          // Export contacts and deals to CSV
          const [contactsData, dealsData] = await Promise.all([
            contactsAPI.getAll({ limit: 1000 }),
            dealsAPI.getAll({ limit: 1000 }),
          ])

          // Create CSV content
          let csv = 'Type,Name,Company,Email,Value,Status,Stage\n'
          
          // Add contacts
          contactsData.contacts.forEach(contact => {
            csv += `Contact,"${contact.name}","${contact.company}","${contact.email}","${contact.estimatedValue || ''}","${contact.status}",\n`
          })

          // Add deals
          dealsData.deals.forEach(deal => {
            csv += `Deal,"${deal.title}","${deal.contact?.company || ''}","${deal.contact?.email || ''}","${deal.estimatedValue || ''}","${deal.status}","${deal.stage}"\n`
          })

          // Download CSV
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `business-dev-export-${new Date().toISOString().split('T')[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        } catch (err: any) {
          alert(`Erreur lors de l'export: ${err.message}`)
        }
      },
    },
    {
      id: 6,
      title: 'Voir les métriques',
      description: 'Consulter les statistiques détaillées',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      color: 'var(--primary-green)',
      action: () => {
        // Scroll to overview tab or show metrics
        window.dispatchEvent(new CustomEvent('switchToOverview'))
      },
    },
  ])

  const handleActionClick = (action: QuickAction) => {
    action.action()
  }

  return (
    <div>
      <div style={{
        marginBottom: 'var(--space-6)',
        background: 'rgba(14, 14, 14, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.04)',
        borderLeft: '3px solid var(--primary-green)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)'
      }}>
        <h2 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: 'var(--space-2)'
        }}>
          Actions rapides
        </h2>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)'
        }}>
          Accédez rapidement aux fonctionnalités les plus utilisées de votre CRM
        </p>
      </div>

      <div className="business-dev-actions-grid">
        {actions.map((action) => (
          <div
            key={action.id}
            className="action-card"
            onClick={() => handleActionClick(action)}
          >
            <div className="action-icon" style={{ background: `${action.color}20` }}>
              <div style={{ color: action.color }}>
                {action.icon}
              </div>
            </div>
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </div>
        ))}
      </div>

      {/* Section Statistiques rapides */}
      <div style={{
        marginTop: 'var(--space-6)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        <div style={{
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--primary-green)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-mono)'
          }}>
            {stats.totalContacts}
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            Contacts totaux
          </div>
        </div>

        <div style={{
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--accent-secondary)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-mono)'
          }}>
            {stats.activeDeals}
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            Deals actifs
          </div>
        </div>

        <div style={{
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--accent-info)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-mono)'
          }}>
            {stats.pipelineValue >= 1000000 
              ? `€${(stats.pipelineValue / 1000000).toFixed(1)}M`
              : stats.pipelineValue >= 1000
              ? `€${(stats.pipelineValue / 1000).toFixed(0)}K`
              : `€${stats.pipelineValue.toFixed(0)}`}
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            Pipeline valeur
          </div>
        </div>

        <div style={{
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--accent-warning)',
            marginBottom: 'var(--space-2)',
            fontFamily: 'var(--font-mono)'
          }}>
            {stats.conversionRate.toFixed(1)}%
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            Taux de conversion
          </div>
        </div>
      </div>
    </div>
  )
}



