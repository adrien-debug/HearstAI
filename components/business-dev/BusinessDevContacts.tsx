'use client'

import { useState } from 'react'
import { SearchIcon } from './BusinessDevIcons'

interface Contact {
  id: number
  name: string
  company: string
  email: string
  phone: string
  status: 'active' | 'pending' | 'inactive'
  value: string
  lastContact: string
}

export default function BusinessDevContacts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Jean Dupont',
      company: 'TechCorp Solutions',
      email: 'jean.dupont@techcorp.com',
      phone: '+33 6 12 34 56 78',
      status: 'active',
      value: '€120K',
      lastContact: 'Il y a 2h'
    },
    {
      id: 2,
      name: 'Marie Martin',
      company: 'Green Energy Co',
      email: 'marie.martin@greenenergy.com',
      phone: '+33 6 23 45 67 89',
      status: 'active',
      value: '€200K',
      lastContact: 'Il y a 1j'
    },
    {
      id: 3,
      name: 'Pierre Bernard',
      company: 'Crypto Ventures',
      email: 'pierre@cryptoventures.com',
      phone: '+33 6 34 56 78 90',
      status: 'pending',
      value: '€180K',
      lastContact: 'Il y a 3j'
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      company: 'Mining Partners Inc',
      email: 'sophie@miningpartners.com',
      phone: '+33 6 45 67 89 01',
      status: 'active',
      value: '€350K',
      lastContact: 'Il y a 5h'
    },
    {
      id: 5,
      name: 'Thomas Moreau',
      company: 'Blockchain Hub',
      email: 'thomas@blockchainhub.com',
      phone: '+33 6 56 78 90 12',
      status: 'active',
      value: '€95K',
      lastContact: 'Il y a 1j'
    },
    {
      id: 6,
      name: 'Laura Petit',
      company: 'Digital Assets Group',
      email: 'laura@digitalassets.com',
      phone: '+33 6 67 89 01 23',
      status: 'pending',
      value: '€280K',
      lastContact: 'Il y a 2j'
    },
    {
      id: 7,
      name: 'Marc Dubois',
      company: 'Energy Solutions',
      email: 'marc@energysolutions.com',
      phone: '+33 6 78 90 12 34',
      status: 'active',
      value: '€150K',
      lastContact: 'Il y a 4h'
    },
    {
      id: 8,
      name: 'Emma Rousseau',
      company: 'Crypto Mining Co',
      email: 'emma@cryptomining.com',
      phone: '+33 6 89 01 23 45',
      status: 'active',
      value: '€420K',
      lastContact: 'Il y a 6h'
    },
    {
      id: 9,
      name: 'Lucas Martin',
      company: 'Sustainable Mining',
      email: 'lucas@sustainablemining.com',
      phone: '+33 6 90 12 34 56',
      status: 'active',
      value: '€195K',
      lastContact: 'Il y a 1j'
    }
  ])

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'active', label: 'Actifs' },
    { id: 'pending', label: 'En attente' },
    { id: 'inactive', label: 'Inactifs' }
  ]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      activeFilter === 'all' || contact.status === activeFilter

    return matchesSearch && matchesFilter
  })

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

      {/* Grille de contacts */}
      <div className="business-dev-contacts-grid">
        {filteredContacts.map((contact) => (
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

      {filteredContacts.length === 0 && (
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

