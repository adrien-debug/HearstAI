'use client'

import { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import '@/components/home/Home.css'
import './MinerDataPage.css'

interface Miner {
  id: string
  name: string
  hashrate: number // TH/s
  power: number // W
  efficiency: number // J/TH
  price: number // USD
  coolingType: 'hydro' | 'air' | 'immersion' // Type de refroidissement
  manufacturer?: string
  model?: string
  releaseDate?: string
  photo?: string // URL de la photo (base64 ou URL)
  notes?: string
}

export default function MinerDataPage() {
  const [miners, setMiners] = useState<Miner[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeCoolingType, setActiveCoolingType] = useState<'hydro' | 'air' | 'immersion' | 'all'>('all')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Partial<Miner>>({
    name: '',
    hashrate: 0,
    power: 0,
    efficiency: 0,
    price: 0,
    coolingType: 'air',
    manufacturer: '',
    model: '',
    releaseDate: '',
    notes: '',
  })

  // Charger les données depuis l'API Railway
  useEffect(() => {
    const loadMiners = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/miners`
          : '/api/datas/miners'
        
        const response = await fetch(baseUrl)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Convertir les données Railway au format frontend
            const formattedMiners = result.data.map((m: any) => ({
              id: m.id.toString(),
              name: m.name,
              hashrate: parseFloat(m.hashrate),
              power: parseFloat(m.power),
              efficiency: parseFloat(m.efficiency),
              price: parseFloat(m.price),
              coolingType: m.cooling_type || m.coolingType,
              manufacturer: m.manufacturer || '',
              model: m.model || '',
              releaseDate: m.release_date || m.releaseDate || '',
              photo: m.photo || null,
              notes: m.notes || '',
            }))
            setMiners(formattedMiners)
          }
        } else {
          console.error('Failed to load miners from API')
          // Fallback sur localStorage si l'API échoue
          const savedMiners = localStorage.getItem('miners-data')
          if (savedMiners) {
            try {
              setMiners(JSON.parse(savedMiners))
            } catch (error) {
              console.error('Error loading miners from localStorage:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error loading miners:', error)
        // Fallback sur localStorage
        const savedMiners = localStorage.getItem('miners-data')
        if (savedMiners) {
          try {
            setMiners(JSON.parse(savedMiners))
          } catch (e) {
            console.error('Error loading miners from localStorage:', e)
          }
        }
      }
    }
    
    loadMiners()
  }, [])

  // Sauvegarder dans l'API Railway et localStorage (fallback)
  const saveMiners = async (newMiners: Miner[]) => {
    setMiners(newMiners)
    // Sauvegarder aussi dans localStorage comme backup
    localStorage.setItem('miners-data', JSON.stringify(newMiners))
  }

  const handleAdd = () => {
    setIsAdding(true)
    setImagePreview(null)
    setImageFile(null)
    setFormData({
      name: '',
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      coolingType: 'air',
      manufacturer: '',
      model: '',
      releaseDate: '',
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

  const handleEdit = (miner: Miner) => {
    setIsEditing(miner.id)
    setFormData(miner)
    setImagePreview(miner.photo || null)
    setImageFile(null)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/miners`
          : '/api/datas/miners'
        
        const response = await fetch(`${baseUrl}/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Recharger les données depuis l'API
          const loadResponse = await fetch(baseUrl)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success && loadResult.data) {
              const formattedMiners = loadResult.data.map((m: any) => ({
                id: m.id.toString(),
                name: m.name,
                hashrate: parseFloat(m.hashrate),
                power: parseFloat(m.power),
                efficiency: parseFloat(m.efficiency),
                price: parseFloat(m.price),
                coolingType: m.cooling_type || m.coolingType,
                manufacturer: m.manufacturer || '',
                model: m.model || '',
                releaseDate: m.release_date || m.releaseDate || '',
                photo: m.photo || null,
                notes: m.notes || '',
              }))
              setMiners(formattedMiners)
              localStorage.setItem('miners-data', JSON.stringify(formattedMiners))
            }
          }
        } else {
          throw new Error('Failed to delete miner')
        }
      } catch (error) {
        console.error('Error deleting miner:', error)
        // Fallback: supprimer localement
        const newMiners = miners.filter(m => m.id !== id)
        saveMiners(newMiners)
      }
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.hashrate || !formData.power || !formData.price || !formData.coolingType) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const photoData = imagePreview || formData.photo

    if (isEditing) {
      // Modifier
      const newMiners = miners.map(m => 
        m.id === isEditing ? { ...formData, id: isEditing, photo: photoData } as Miner : m
      )
      saveMiners(newMiners)
      setIsEditing(null)
    } else if (isAdding) {
      // Ajouter
      const newMiner: Miner = {
        id: `miner-${Date.now()}`,
        name: formData.name!,
        hashrate: formData.hashrate!,
        power: formData.power!,
        efficiency: formData.efficiency || (formData.power! / formData.hashrate!),
        price: formData.price!,
        coolingType: formData.coolingType!,
        manufacturer: formData.manufacturer || '',
        model: formData.model || '',
        releaseDate: formData.releaseDate || '',
        photo: photoData,
        notes: formData.notes || '',
      }
      saveMiners([...miners, newMiner])
      setIsAdding(false)
    }

    // Réinitialiser le formulaire
    setImagePreview(null)
    setImageFile(null)
    setFormData({
      name: '',
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      coolingType: 'air',
      manufacturer: '',
      model: '',
      releaseDate: '',
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
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      coolingType: 'air',
      manufacturer: '',
      model: '',
      releaseDate: '',
      notes: '',
    })
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  // Filtrer les machines selon le type de refroidissement
  const filteredMiners = activeCoolingType === 'all' 
    ? miners 
    : miners.filter(m => m.coolingType === activeCoolingType)

  const coolingTypes = [
    { id: 'all', label: 'Tous' },
    { id: 'hydro', label: 'Hydro Cooling' },
    { id: 'air', label: 'Air Cooling' },
    { id: 'immersion', label: 'Immersion Cooling' },
  ]

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
            Données Machines (Miners)
          </h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Gérez toutes les données des machines de mining
          </p>
          
          {/* Navigation tabs - Cooling Type */}
          <nav className="miner-nav-tabs" style={{ marginTop: 'var(--space-4)' }}>
            {coolingTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveCoolingType(type.id as any)}
                className={`miner-nav-tab ${activeCoolingType === type.id ? 'active' : ''}`}
              >
                {type.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bouton Ajouter */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <button
            onClick={handleAdd}
            className="miner-data-add-btn"
            disabled={isAdding || isEditing !== null}
          >
            <Icon name="projects" />
            <span>Ajouter une Machine</span>
          </button>
        </div>

        {/* Formulaire d'ajout/modification */}
        {(isAdding || isEditing) && (
          <div className="miner-data-form-card">
            <div className="miner-data-form-header">
              <h3>{isEditing ? 'Modifier la Machine' : 'Nouvelle Machine'}</h3>
              <div className="miner-data-form-actions">
                <button onClick={handleSave} className="miner-data-save-btn">
                  Enregistrer
                </button>
                <button onClick={handleCancel} className="miner-data-cancel-btn">
                  Annuler
                </button>
              </div>
            </div>
            
            {/* Section Photo - Pleine largeur en haut */}
            <div className="miner-data-photo-section">
              <label className="miner-data-photo-label">Photo de la Machine</label>
              <div className="miner-data-photo-upload">
                {imagePreview ? (
                  <div className="miner-data-photo-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button"
                      className="miner-data-photo-remove"
                      onClick={handleRemoveImage}
                      title="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="miner-data-photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="miner-data-photo-upload-placeholder">
                      <div className="miner-data-photo-icon">📷</div>
                      <div className="miner-data-photo-text">
                        <span className="miner-data-photo-text-main">Cliquez pour ajouter une photo</span>
                        <span className="miner-data-photo-text-sub">JPG, PNG, WEBP (max 5MB)</span>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Section Informations principales */}
            <div className="miner-data-form-section">
              <h4 className="miner-data-form-section-title">Informations principales</h4>
              <div className="miner-data-form-grid">
                <div className="miner-data-form-group">
                  <label>Nom de la Machine *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Antminer S23 Hydro"
                  />
                </div>

                <div className="miner-data-form-group">
                  <label>Fabricant</label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Ex: Bitmain"
                  />
                </div>

                <div className="miner-data-form-group">
                  <label>Modèle</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ex: S23 Hydro"
                  />
                </div>

                <div className="miner-data-form-group">
                  <label>Date de Sortie</label>
                  <input
                    type="date"
                    value={formData.releaseDate || ''}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section Spécifications techniques */}
            <div className="miner-data-form-section">
              <h4 className="miner-data-form-section-title">Spécifications techniques</h4>
              <div className="miner-data-form-grid">
                <div className="miner-data-form-group">
                  <label>Hashrate (TH/s) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hashrate || ''}
                    onChange={(e) => {
                      const hashrate = parseFloat(e.target.value) || 0
                      const power = formData.power || 0
                      setFormData({ 
                        ...formData, 
                        hashrate,
                        efficiency: power > 0 && hashrate > 0 ? power / hashrate : formData.efficiency
                      })
                    }}
                    placeholder="Ex: 605"
                  />
                </div>

                <div className="miner-data-form-group">
                  <label>Consommation (W) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.power || ''}
                    onChange={(e) => {
                      const power = parseFloat(e.target.value) || 0
                      const hashrate = formData.hashrate || 0
                      setFormData({ 
                        ...formData, 
                        power,
                        efficiency: power > 0 && hashrate > 0 ? power / hashrate : formData.efficiency
                      })
                    }}
                    placeholder="Ex: 5870"
                  />
                </div>

                <div className="miner-data-form-group">
                  <label>Efficacité (J/TH)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.efficiency || ''}
                    onChange={(e) => setFormData({ ...formData, efficiency: parseFloat(e.target.value) || 0 })}
                    placeholder="Calculé automatiquement"
                    readOnly
                  />
                  <small>Calculé automatiquement : Power / Hashrate</small>
                </div>

                <div className="miner-data-form-group">
                  <label>Type de Refroidissement *</label>
                  <select
                    value={formData.coolingType || 'air'}
                    onChange={(e) => setFormData({ ...formData, coolingType: e.target.value as 'hydro' | 'air' | 'immersion' })}
                  >
                    <option value="air">Air Cooling</option>
                    <option value="hydro">Hydro Cooling</option>
                    <option value="immersion">Immersion Cooling</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Prix */}
            <div className="miner-data-form-section">
              <h4 className="miner-data-form-section-title">Prix</h4>
              <div className="miner-data-form-grid">
                <div className="miner-data-form-group">
                  <label>Prix (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Ex: 8500"
                  />
                </div>
              </div>
            </div>

            {/* Section Notes */}
            <div className="miner-data-form-section">
              <h4 className="miner-data-form-section-title">Notes supplémentaires</h4>
              <div className="miner-data-form-group miner-data-form-group-full">
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

        {/* Liste des Machines */}
        <div className="miner-data-list-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="premium-stat-icon">
                  <Icon name="projects" />
                </div>
                <span>Machines Enregistrées ({filteredMiners.length}{activeCoolingType !== 'all' ? ` / ${miners.length}` : ''})</span>
              </div>
            </h3>
          </div>

          {filteredMiners.length === 0 ? (
            <div className="miner-data-empty">
              <div className="calculator-empty-icon">
                <Icon name="projects" />
              </div>
              <div className="calculator-empty-text">
                Aucune machine enregistrée. Cliquez sur "Ajouter une Machine" pour commencer.
              </div>
            </div>
          ) : (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Photo</th>
                    <th>Nom</th>
                    <th>Hashrate</th>
                    <th>Consommation</th>
                    <th>Efficacité</th>
                    <th>Refroidissement</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMiners.map((miner) => (
                    <tr key={miner.id}>
                      <td>
                        {miner.photo ? (
                          <div className="miner-table-photo">
                            <img src={miner.photo} alt={miner.name} />
                          </div>
                        ) : (
                          <div className="miner-table-photo-placeholder">
                            <Icon name="projects" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 'var(--font-semibold)', textAlign: 'center' }}>{miner.name}</div>
                        {miner.manufacturer && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'center' }}>
                            {miner.manufacturer} {miner.model && `- ${miner.model}`}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>{miner.hashrate} TH/s</td>
                      <td style={{ textAlign: 'center' }}>{miner.power} W</td>
                      <td style={{ textAlign: 'center' }}>{miner.efficiency.toFixed(2)} J/TH</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span className={`miner-cooling-badge miner-cooling-${miner.coolingType}`}>
                            {miner.coolingType === 'hydro' ? 'Hydro' : miner.coolingType === 'air' ? 'Air' : 'Immersion'}
                          </span>
                        </div>
                      </td>
                      <td className="premium-transaction-amount" style={{ textAlign: 'center' }}>${formatNumber(miner.price, 0)}</td>
                      <td>
                        <div className="miner-data-actions">
                          <button
                            onClick={() => handleEdit(miner)}
                            className="miner-data-action-btn miner-data-edit-btn"
                            disabled={isAdding || isEditing !== null}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(miner.id)}
                            className="miner-data-action-btn miner-data-delete-btn"
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

