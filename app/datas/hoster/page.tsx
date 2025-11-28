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
  photo?: string // URL de la photo (base64 ou URL)
  notes?: string
}

export default function HosterDataPage() {
  const [hosters, setHosters] = useState<Hoster[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeCountry, setActiveCountry] = useState<string>('all')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
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
    'Kazakhstan',
    'Russie',
    'Chine',
    'Paraguay',
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
    setImagePreview(null)
    setImageFile(null)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image doit être inférieure à 5MB')
        return
      }
      
      setImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({ ...formData, photo: undefined })
  }

  const handleEdit = (hoster: Hoster) => {
    setIsEditing(hoster.id)
    setFormData(hoster)
    setImagePreview(hoster.photo || null)
    setImageFile(null)
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

    const photoData = imagePreview || formData.photo

    if (isEditing) {
      // Modifier
      const newHosters = hosters.map(h => 
        h.id === isEditing ? { ...formData, id: isEditing, photo: photoData } as Hoster : h
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
        photo: photoData,
        notes: formData.notes || '',
      }
      saveHosters([...hosters, newHoster])
      setIsAdding(false)
    }

    // Réinitialiser le formulaire
    setImagePreview(null)
    setImageFile(null)
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
    setImagePreview(null)
    setImageFile(null)
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
            
            {/* Section Photo - Pleine largeur en haut */}
            <div className="hoster-data-photo-section">
              <label className="hoster-data-photo-label">Photo du Hoster</label>
              <div className="hoster-data-photo-upload">
                {imagePreview ? (
                  <div className="hoster-data-photo-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button"
                      className="hoster-data-photo-remove"
                      onClick={handleRemoveImage}
                      title="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="hoster-data-photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="hoster-data-photo-upload-placeholder">
                      <div className="hoster-data-photo-icon">📷</div>
                      <div className="hoster-data-photo-text">
                        <span className="hoster-data-photo-text-main">Cliquez pour ajouter une photo</span>
                        <span className="hoster-data-photo-text-sub">JPG, PNG, WEBP (max 5MB)</span>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Section Informations principales */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Informations principales</h4>
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

                <div className="hoster-data-form-group hoster-data-form-group-full">
                  <label>Localisation *</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Texas, USA"
                  />
                </div>
              </div>
            </div>

            {/* Section Coûts */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Coûts et conditions</h4>
              <div className="hoster-data-form-grid">
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
              </div>
            </div>

            {/* Section Notes */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Notes supplémentaires</h4>
              <div className="hoster-data-form-group hoster-data-form-group-full">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ajoutez des notes ou informations complémentaires..."
                  rows={4}
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
                    <th style={{ width: '120px' }}>Photo</th>
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
                        {hoster.photo ? (
                          <div className="hoster-table-photo">
                            <img src={hoster.photo} alt={hoster.name} />
                          </div>
                        ) : (
                          <div className="hoster-table-photo-placeholder">
                            <Icon name="server" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 'var(--font-semibold)', textAlign: 'center' }}>{hoster.name}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span className="hoster-country-badge">
                            {hoster.country}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{hoster.location}</td>
                      <td className="premium-transaction-amount" style={{ textAlign: 'center' }}>${formatNumber(hoster.electricityPrice, 3)}/kWh</td>
                      <td className="premium-transaction-amount" style={{ textAlign: 'center' }}>${formatNumber(hoster.additionalFees, 2)}/mois</td>
                      <td style={{ textAlign: 'center' }}>{hoster.deposit} mois</td>
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

