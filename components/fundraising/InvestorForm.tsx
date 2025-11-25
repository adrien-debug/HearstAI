'use client'

import { Investor } from '@/types/fundraising'
import { useState } from 'react'

interface InvestorFormProps {
  investor?: Investor
  onSave: (investor: Investor) => void
  onCancel: () => void
}

export default function InvestorForm({ investor, onSave, onCancel }: InvestorFormProps) {
  const [formData, setFormData] = useState<Partial<Investor>>({
    firstName: investor?.firstName || '',
    lastName: investor?.lastName || '',
    email: investor?.email || '',
    phone: investor?.phone || '',
    company: investor?.company || '',
    position: investor?.position || '',
    status: investor?.status || 'lead',
    investmentInterest: investor?.investmentInterest || undefined,
    notes: investor?.notes || '',
    tags: investor?.tags || [],
  })

  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const investorData: Investor = {
      ...formData,
      id: investor?.id || '',
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email!,
      status: formData.status || 'lead',
      tags: formData.tags || [],
      documents: investor?.documents || [],
      interactions: investor?.interactions || [],
      createdAt: investor?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Investor

    onSave(investorData)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    })
  }

  return (
    <div className="fundraising-form-container">
      <div className="fundraising-form-card">
        <div className="fundraising-form-header">
          <h2>{investor ? 'Modifier l\'investisseur' : 'Nouveau Contact Investisseur'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Remplissez les informations pour créer un nouveau contact investisseur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fundraising-form">
          <div className="fundraising-form-row">
            <div className="fundraising-form-group">
              <label className="fundraising-form-label">
                Prénom <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value })
                  if (errors.firstName) setErrors({ ...errors, firstName: '' })
                }}
                className={`fundraising-form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="John"
              />
              {errors.firstName && (
                <span className="fundraising-form-error">{errors.firstName}</span>
              )}
            </div>

            <div className="fundraising-form-group">
              <label className="fundraising-form-label">
                Nom <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  if (errors.lastName) setErrors({ ...errors, lastName: '' })
                }}
                className={`fundraising-form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <span className="fundraising-form-error">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="fundraising-form-group">
            <label className="fundraising-form-label">
              Email <span style={{ color: 'var(--accent-danger)' }}>*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              className={`fundraising-form-input ${errors.email ? 'error' : ''}`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <span className="fundraising-form-error">{errors.email}</span>
            )}
          </div>

          <div className="fundraising-form-row">
            <div className="fundraising-form-group">
              <label className="fundraising-form-label">Téléphone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="fundraising-form-input"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="fundraising-form-group">
              <label className="fundraising-form-label">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Investor['status'] })}
                className="fundraising-form-input"
              >
                <option value="lead">Lead</option>
                <option value="contacted">Contacté</option>
                <option value="meeting">Meeting</option>
                <option value="proposal">Proposition</option>
                <option value="negotiation">Négociation</option>
                <option value="closed">Clôturé</option>
                <option value="declined">Décliné</option>
              </select>
            </div>
          </div>

          <div className="fundraising-form-row">
            <div className="fundraising-form-group">
              <label className="fundraising-form-label">Entreprise</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="fundraising-form-input"
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div className="fundraising-form-group">
              <label className="fundraising-form-label">Poste</label>
              <input
                type="text"
                value={formData.position || ''}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="fundraising-form-input"
                placeholder="Directeur Général"
              />
            </div>
          </div>

          <div className="fundraising-form-group">
            <label className="fundraising-form-label">Intérêt d'investissement (€)</label>
            <input
              type="number"
              value={formData.investmentInterest || ''}
              onChange={(e) => setFormData({ ...formData, investmentInterest: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="fundraising-form-input"
              placeholder="50000"
              min="0"
              step="1000"
            />
          </div>

          <div className="fundraising-form-group">
            <label className="fundraising-form-label">Tags</label>
            <div className="fundraising-tags-input">
              <div className="fundraising-tags-list">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="fundraising-tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="fundraising-tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="fundraising-form-input"
                placeholder="Ajouter un tag..."
                style={{ marginTop: formData.tags && formData.tags.length > 0 ? 'var(--space-2)' : '0' }}
              />
            </div>
          </div>

          <div className="fundraising-form-group">
            <label className="fundraising-form-label">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="fundraising-form-input"
              placeholder="Notes supplémentaires sur cet investisseur..."
              rows={4}
            />
          </div>

          <div className="fundraising-form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="fundraising-btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="fundraising-btn-primary"
            >
              {investor ? 'Mettre à jour' : 'Créer le contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

