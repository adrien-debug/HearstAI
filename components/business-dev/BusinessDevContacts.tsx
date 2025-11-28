'use client'

import { useState, useEffect } from 'react'
import { SearchIcon } from './BusinessDevIcons'
import { businessDevContactsAPI, BusinessDevContact } from '@/lib/api/business-dev-contacts'

interface Contact {
  id: string
  name: string
  company: string
  email: string
  phone: string | null
  status: 'active' | 'pending' | 'inactive'
  value: string | null
  lastContact: string
}

export default function BusinessDevContacts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les contacts depuis l'API
  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await businessDevContactsAPI.getAll({
        status: activeFilter === 'all' ? undefined : activeFilter,
        search: searchTerm || undefined,
      })
      
      // Convertir les contacts de l'API au format attendu
      const formattedContacts: Contact[] = data.contacts.map((contact: BusinessDevContact) => ({
        id: contact.id,
        name: contact.name,
        company: contact.company,
        email: contact.email,
        phone: contact.phone || '',
        status: contact.status,
        value: contact.estimatedValue || '€0',
        lastContact: formatLastContact(contact.lastContact),
      }))
      
      setContacts(formattedContacts)
    } catch (err: any) {
      console.error('Erreur lors du chargement des contacts:', err)
      setError(err.message || 'Erreur lors du chargement des contacts')
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  // Formater la date de dernier contact
  const formatLastContact = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return `Il y a ${diffMins}min`
      } else if (diffHours < 24) {
        return `Il y a ${diffHours}h`
      } else {
        return `Il y a ${diffDays}j`
      }
    } catch {
      return 'Récemment'
    }
  }

  // Charger les contacts au montage et quand les filtres changent
  useEffect(() => {
    loadContacts()
  }, [activeFilter, searchTerm])

  // Écouter les événements de création de contact
  useEffect(() => {
    const handleContactAdded = () => {
      loadContacts()
    }

    window.addEventListener('businessDevContactAdded', handleContactAdded)
    return () => {
      window.removeEventListener('businessDevContactAdded', handleContactAdded)
    }
  }, [activeFilter, searchTerm])

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'active', label: 'Actifs' },
    { id: 'pending', label: 'En attente' },
    { id: 'inactive', label: 'Inactifs' }
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      {/* Header avec recherche et filtres */}
      <div className="business-dev-contacts-header">
        <div className="business-dev-search">
          <svg className="business-dev-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un contact, entreprise ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="business-dev-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`business-dev-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message de chargement */}
      {loading && (
        <div style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--space-6)'
        }}>
          <div style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
          }}>
            Chargement des contacts...
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && !loading && (
        <div style={{
          padding: 'var(--space-4)',
          background: 'rgba(255, 77, 77, 0.1)',
          border: '1px solid rgba(255, 77, 77, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#ff4d4d',
          fontSize: 'var(--text-sm)',
          marginTop: 'var(--space-6)'
        }}>
          {error}
        </div>
      )}

      {/* Grille de contacts */}
      {!loading && !error && (
        <div className="business-dev-contacts-grid">
          {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-card-header">
              <div className="contact-avatar">
                {getInitials(contact.name)}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-company">{contact.company}</div>
              </div>
              <div className={`contact-status ${contact.status}`}>
                {contact.status === 'active' && 'Actif'}
                {contact.status === 'pending' && 'En attente'}
                {contact.status === 'inactive' && 'Inactif'}
              </div>
            </div>

            <div style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)'
              }}>
                Valeur estimée
              </div>
              <div style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--primary-green)',
                fontFamily: 'var(--font-mono)'
              }}>
                {contact.value}
              </div>
            </div>

            <div className="contact-details">
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {contact.email}
                </span>
              </div>
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{contact.phone}</span>
              </div>
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{contact.lastContact}</span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div style={{
          padding: 'var(--space-12)',
          textAlign: 'center',
          background: 'rgba(14, 14, 14, 0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '0.5px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--space-6)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--space-2)'
          }}>
            <SearchIcon size={48} color="var(--text-muted)" />
          </div>
          <div style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-1)'
          }}>
            Aucun contact trouvé
          </div>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            Essayez de modifier vos critères de recherche
          </div>
        </div>
      )}
    </div>
  )
}

