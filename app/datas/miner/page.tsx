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
  manufacturer?: string
  model?: string
  releaseDate?: string
  notes?: string
}

export default function MinerDataPage() {
  const [miners, setMiners] = useState<Miner[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Miner>>({
    name: '',
    hashrate: 0,
    power: 0,
    efficiency: 0,
    price: 0,
    manufacturer: '',
    model: '',
    releaseDate: '',
    notes: '',
  })

  // Charger les données depuis le localStorage ou API
  useEffect(() => {
    const savedMiners = localStorage.getItem('miners-data')
    if (savedMiners) {
      try {
        setMiners(JSON.parse(savedMiners))
      } catch (error) {
        console.error('Error loading miners data:', error)
      }
    }
  }, [])

  // Sauvegarder dans localStorage
  const saveMiners = (newMiners: Miner[]) => {
    setMiners(newMiners)
    localStorage.setItem('miners-data', JSON.stringify(newMiners))
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      name: '',
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      manufacturer: '',
      model: '',
      releaseDate: '',
      notes: '',
    })
  }

  const handleEdit = (miner: Miner) => {
    setIsEditing(miner.id)
    setFormData(miner)
    setIsAdding(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      const newMiners = miners.filter(m => m.id !== id)
      saveMiners(newMiners)
    }
  }

  const handleSave = () => {
    if (!formData.name || !formData.hashrate || !formData.power || !formData.price) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (isEditing) {
      // Modifier
      const newMiners = miners.map(m => 
        m.id === isEditing ? { ...formData, id: isEditing } as Miner : m
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
        manufacturer: formData.manufacturer || '',
        model: formData.model || '',
        releaseDate: formData.releaseDate || '',
        notes: formData.notes || '',
      }
      saveMiners([...miners, newMiner])
      setIsAdding(false)
    }

    // Réinitialiser le formulaire
    setFormData({
      name: '',
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      manufacturer: '',
      model: '',
      releaseDate: '',
      notes: '',
    })
  }

  const handleCancel = () => {
    setIsEditing(null)
    setIsAdding(false)
    setFormData({
      name: '',
      hashrate: 0,
      power: 0,
      efficiency: 0,
      price: 0,
      manufacturer: '',
      model: '',
      releaseDate: '',
      notes: '',
    })
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
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
                <label>Prix (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Ex: 8500"
                />
              </div>

              <div className="miner-data-form-group miner-data-form-group-full">
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

        {/* Liste des Machines */}
        <div className="miner-data-list-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="premium-stat-icon">
                  <Icon name="projects" />
                </div>
                <span>Machines Enregistrées ({miners.length})</span>
              </div>
            </h3>
          </div>

          {miners.length === 0 ? (
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
                    <th>Nom</th>
                    <th>Hashrate</th>
                    <th>Consommation</th>
                    <th>Efficacité</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {miners.map((miner) => (
                    <tr key={miner.id}>
                      <td>
                        <div style={{ fontWeight: 'var(--font-semibold)' }}>{miner.name}</div>
                        {miner.manufacturer && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {miner.manufacturer} {miner.model && `- ${miner.model}`}
                          </div>
                        )}
                      </td>
                      <td>{miner.hashrate} TH/s</td>
                      <td>{miner.power} W</td>
                      <td>{miner.efficiency.toFixed(2)} J/TH</td>
                      <td className="premium-transaction-amount">${formatNumber(miner.price, 0)}</td>
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

