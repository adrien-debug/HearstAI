'use client'

import { useState } from 'react'
import { customersAPI } from '@/lib/api'
import './Collateral.css'

interface AddClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AVAILABLE_CHAINS = ['eth', 'arb', 'base', 'op', 'bsc', 'polygon', 'avax']
const AVAILABLE_PROTOCOLS = ['morpho', 'aave', 'compound', 'maker', 'spark']

export default function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    erc20Address: '',
    tag: 'Client',
    chains: ['eth'] as string[],
    protocols: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Valider l'adresse ERC20
      if (!formData.erc20Address || !formData.erc20Address.startsWith('0x')) {
        throw new Error('Adresse ERC20 invalide (doit commencer par 0x)')
      }

      if (formData.erc20Address.length !== 42) {
        throw new Error('Adresse ERC20 invalide (doit faire 42 caractères)')
      }

      // Créer le client
      await customersAPI.create({
        name: formData.name,
        erc20Address: formData.erc20Address.toLowerCase(),
        tag: formData.tag,
        chains: formData.chains,
        protocols: formData.protocols,
      })

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        erc20Address: '',
        tag: 'Client',
        chains: ['eth'],
        protocols: [],
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du client')
    } finally {
      setLoading(false)
    }
  }

  const toggleChain = (chain: string) => {
    setFormData(prev => ({
      ...prev,
      chains: prev.chains.includes(chain)
        ? prev.chains.filter(c => c !== chain)
        : [...prev.chains, chain]
    }))
  }

  const toggleProtocol = (protocol: string) => {
    setFormData(prev => ({
      ...prev,
      protocols: prev.protocols.includes(protocol)
        ? prev.protocols.filter(p => p !== protocol)
        : [...prev.protocols, protocol]
    }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajouter un nouveau client</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="modal-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nom du client *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Ex: Dennis STEIRH"
            />
          </div>

          <div className="form-group">
            <label htmlFor="erc20Address">Adresse ERC20 (Wallet) *</label>
            <input
              id="erc20Address"
              type="text"
              value={formData.erc20Address}
              onChange={(e) => setFormData(prev => ({ ...prev, erc20Address: e.target.value }))}
              required
              placeholder="0x..."
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Adresse Ethereum du wallet à surveiller
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tag">Tag</label>
            <input
              id="tag"
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
              placeholder="Ex: VIP, Restaurant, etc."
            />
          </div>

          <div className="form-group">
            <label>Chains à surveiller *</label>
            <div className="checkbox-group">
              {AVAILABLE_CHAINS.map(chain => (
                <label key={chain} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.chains.includes(chain)}
                    onChange={() => toggleChain(chain)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{chain}</span>
                </label>
              ))}
            </div>
            {formData.chains.length === 0 && (
              <small style={{ color: '#ff4d4d' }}>Sélectionnez au moins une chain</small>
            )}
          </div>

          <div className="form-group">
            <label>Protocoles autorisés (optionnel)</label>
            <div className="checkbox-group">
              {AVAILABLE_PROTOCOLS.map(protocol => (
                <label key={protocol} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.protocols.includes(protocol)}
                    onChange={() => toggleProtocol(protocol)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{protocol}</span>
                </label>
              ))}
            </div>
            <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Si aucun protocole n'est sélectionné, tous les protocoles seront surveillés
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" className="collateral-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button 
              type="submit" 
              className="collateral-btn-primary" 
              disabled={loading || formData.chains.length === 0}
            >
              {loading ? 'Création...' : 'Créer le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

