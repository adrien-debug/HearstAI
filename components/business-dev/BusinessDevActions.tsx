'use client'

import { useState } from 'react'

interface QuickAction {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

export default function BusinessDevActions() {
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
      color: 'var(--primary-green)'
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
      color: 'var(--accent-secondary)'
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
      color: 'var(--accent-info)'
    },
    {
      id: 4,
      title: 'Envoyer une proposition',
      description: 'Créer et envoyer une proposition commerciale',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      color: 'var(--accent-warning)'
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
      color: 'var(--accent-success)'
    },
    {
      id: 6,
      title: 'Générer un rapport',
      description: 'Créer un rapport de performance personnalisé',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      color: 'var(--primary-green)'
    }
  ])

  const handleActionClick = (actionId: number) => {
    // Ici vous pouvez ajouter la logique pour chaque action
    console.log(`Action clicked: ${actionId}`)
    
    // Exemple d'actions possibles :
    switch (actionId) {
      case 1:
        // Ouvrir modal d'ajout de contact
        alert('Fonctionnalité : Ajouter un contact')
        break
      case 2:
        // Ouvrir modal de création de deal
        alert('Fonctionnalité : Créer un deal')
        break
      case 3:
        // Ouvrir calendrier
        alert('Fonctionnalité : Planifier un meeting')
        break
      case 4:
        // Ouvrir éditeur de proposition
        alert('Fonctionnalité : Envoyer une proposition')
        break
      case 5:
        // Exporter les données
        alert('Fonctionnalité : Exporter les données')
        break
      case 6:
        // Générer rapport
        alert('Fonctionnalité : Générer un rapport')
        break
      default:
        break
    }
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
            onClick={() => handleActionClick(action.id)}
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
            247
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
            18
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
            €2.4M
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
            23.4%
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

