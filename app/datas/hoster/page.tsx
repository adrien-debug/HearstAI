'use client'

import { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import '@/components/home/Home.css'
import './HosterDataPage.css'

interface Hoster {
  id: string
  name: string
  country: string // Pays
  location: string // Localisation précise
  electricityPrice: number // $/kWh
  additionalFees: number // USD/mois
  deposit: number // Nombre de mois de dépôt
  notes?: string
}

export default function HosterDataPage() {
  const [hosters, setHosters] = useState<Hoster[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeCountry, setActiveCountry] = useState<string>('all')
  const [formData, setFormData] = useState<Partial<Hoster>>({
    name: '',
    country: '',
    location: '',
    electricityPrice: 0,
    additionalFees: 0,
    deposit: 0,
    notes: '',
  })

  // Liste des pays disponibles (ordre d'affichage dans les tabs)
  const countries = [
    'États-Unis',
    'Canada',
    'Islande',
    'Norvège',
    'Suède',
    'Finlande',
    'République Tchèque',
    'Kazakhstan',
    'Russie',
    'Chine',
    'Paraguay',
    'Venezuela',
    'Autre',
  ]

  // Charger les données depuis le localStorage ou API
  useEffect(() => {
    const savedHosters = localStorage.getItem('hosters-data')
    if (savedHosters) {
      try {
        setHosters(JSON.parse(savedHosters))
      } catch (error) {
        console.error('Error loading hosters data:', error)
      }
    }
  }, [])

  // Sauvegarder dans localStorage
  const saveHosters = (newHosters: Hoster[]) => {
    setHosters(newHosters)
    localStorage.setItem('hosters-data', JSON.stringify(newHosters))
  }

  // Construire la liste des tabs avec tous les pays (pas seulement ceux avec hosters)
  const countryTabs = [
    { id: 'all', label: 'Tous' },
    ...countries.map(country => ({ id: country, label: country }))
  ]

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      name: '',
      country: '',
      location: '',
      electricityPrice: 0,
      additionalFees: 0,
      deposit: 0,
      notes: '',
    })
  }

  const handleEdit = (hoster: Hoster) => {
    setIsEditing(hoster.id)
    setFormData(hoster)
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce hoster ?')) {
      const newHosters = hosters.filter(h => h.id !== id)
      saveHosters(newHosters)
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.country || !formData.location || formData.electricityPrice === undefined || formData.additionalFees === undefined || formData.deposit === undefined) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (isEditing) {
      // Modifier
      const newHosters = hosters.map(h => 
        h.id === isEditing ? { ...formData, id: isEditing } as Hoster : h
      )
      saveHosters(newHosters)
      setIsEditing(null)
    } else if (isAdding) {
      // Ajouter
      const newHoster: Hoster = {
        id: `hoster-${Date.now()}`,
        name: formData.name!,
        country: formData.country!,
        location: formData.location!,
        electricityPrice: formData.electricityPrice!,
        additionalFees: formData.additionalFees!,
        deposit: formData.deposit!,
        notes: formData.notes || '',
      }
      saveHosters([...hosters, newHoster])
      setIsAdding(false)
    }

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      country: '',
      location: '',
      electricityPrice: 0,
      additionalFees: 0,
      deposit: 0,
      notes: '',
    })
  }

  const handleCancel = () => {
    setIsEditing(null)
    setIsAdding(false)
    setFormData({
      name: '',
      country: '',
      location: '',
      electricityPrice: 0,
      additionalFees: 0,
      deposit: 0,
      notes: '',
    })
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  // Filtrer les hosters selon le pays sélectionné
  const filteredHosters = activeCountry === 'all' 
    ? hosters 
    : hosters.filter(h => h.country === activeCountry)
  
  // Compter les hosters par pays pour afficher dans les tabs
  const getHostersCount = (countryId: string) => {
    if (countryId === 'all') return hosters.length
    return hosters.filter(h => h.country === countryId).length
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Page Title */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            marginBottom: 'var(--space-4)'
          }}>
            Données Hosters
          </h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Gérez toutes les données des hosters de mining
          </p>
          
          {/* Navigation tabs - Countries */}
          <nav className="hoster-nav-tabs" style={{ marginTop: 'var(--space-4)' }}>
            {countryTabs.map((tab) => {
              const count = getHostersCount(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCountry(tab.id)}
                  className={`hoster-nav-tab ${activeCountry === tab.id ? 'active' : ''} ${count === 0 ? 'hoster-nav-tab-empty' : ''}`}
                >
                  {tab.label}
                  {count > 0 && <span className="hoster-nav-tab-count">({count})</span>}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bouton Ajouter */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <button
            onClick={handleAdd}
            className="hoster-data-add-btn"
            disabled={isAdding || isEditing !== null}
          >
            <Icon name="server" />
            <span>Ajouter un Hoster</span>
          </button>
        </div>

        {/* Formulaire d'ajout/modification */}
        {(isAdding || isEditing) && (
          <div className="hoster-data-form-card">
            <div className="hoster-data-form-header">
              <h3>{isEditing ? 'Modifier le Hoster' : 'Nouveau Hoster'}</h3>
              <div className="hoster-data-form-actions">
                <button onClick={handleSave} className="hoster-data-save-btn">
                  Enregistrer
                </button>
                <button onClick={handleCancel} className="hoster-data-cancel-btn">
                  Annuler
                </button>
              </div>
            </div>
            
            <div className="hoster-data-form-grid">
              <div className="hoster-data-form-group">
                <label>Nom du Hoster *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Bitmain Hosting"
                />
              </div>

              <div className="hoster-data-form-group">
                <label>Pays *</label>
                <select
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="hoster-data-form-group">
                <label>Localisation *</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Texas, USA"
                />
              </div>

              <div className="hoster-data-form-group">
                <label>Prix Électricité ($/kWh) *</label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.electricityPrice || ''}
                  onChange={(e) => setFormData({ ...formData, electricityPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 0.05"
                />
              </div>

              <div className="hoster-data-form-group">
                <label>Frais Supplémentaires (USD/mois) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.additionalFees || ''}
                  onChange={(e) => setFormData({ ...formData, additionalFees: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 50"
                />
              </div>

              <div className="hoster-data-form-group">
                <label>Dépôt (nombre de mois) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.deposit || ''}
                  onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 3"
                />
              </div>

              <div className="hoster-data-form-group hoster-data-form-group-full">
                <label>Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Liste des Hosters */}
        <div className="hoster-data-list-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="premium-stat-icon">
                  <Icon name="server" />
                </div>
                <span>Hosters Enregistrés ({filteredHosters.length}{activeCountry !== 'all' ? ` / ${hosters.length}` : ''})</span>
              </div>
            </h3>
          </div>

          {filteredHosters.length === 0 ? (
            <div className="hoster-data-empty">
              <div className="calculator-empty-icon">
                <Icon name="server" />
              </div>
              <div className="calculator-empty-text">
                Aucun hoster enregistré. Cliquez sur "Ajouter un Hoster" pour commencer.
              </div>
            </div>
          ) : (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Pays</th>
                    <th>Localisation</th>
                    <th>Prix Électricité</th>
                    <th>Frais Supplémentaires</th>
                    <th>Dépôt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHosters.map((hoster) => (
                    <tr key={hoster.id}>
                      <td>
                        <div style={{ fontWeight: 'var(--font-semibold)' }}>{hoster.name}</div>
                      </td>
                      <td>
                        <span className="hoster-country-badge">
                          {hoster.country}
                        </span>
                      </td>
                      <td>{hoster.location}</td>
                      <td className="premium-transaction-amount">${formatNumber(hoster.electricityPrice, 3)}/kWh</td>
                      <td className="premium-transaction-amount">${formatNumber(hoster.additionalFees, 2)}/mois</td>
                      <td>{hoster.deposit} mois</td>
                      <td>
                        <div className="hoster-data-actions">
                          <button
                            onClick={() => handleEdit(hoster)}
                            className="hoster-data-action-btn hoster-data-edit-btn"
                            disabled={isAdding || isEditing !== null}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(hoster.id)}
                            className="hoster-data-action-btn hoster-data-delete-btn"
                            disabled={isAdding || isEditing !== null}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

