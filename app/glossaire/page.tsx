'use client'

import React, { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import '@/components/home/Home.css'
import './GlossairePage.css'

// Types pour les données éditables
interface GlossaireData {
  formules: {
    [key: string]: {
      title: string
      formula: string
      params?: string
      example: string
    }
  }
  termes: {
    [key: string]: {
      title: string
      items: Array<{ term: string; definition: string }>
    }
  }
  donnees: {
    [key: string]: {
      title: string
      code: string
    }
  }
  constantes: {
    [key: string]: {
      title: string
      items: Array<{ label: string; value: string }>
    }
  }
  design: {
    [key: string]: {
      title: string
      items: Array<{ label: string; value: string }>
    }
  }
}

// Données par défaut
const DEFAULT_GLOSSAIRE: GlossaireData = {
  formules: {
    'production-btc': {
      title: '1. Production BTC par jour',
      formula: 'BTC/jour = (Hashrate Machine / Hashrate Réseau Total) × (Blocs/jour × BTC/bloc)',
      params: 'Blocs/jour : 144 (1 bloc toutes les 10 minutes)\nBTC/bloc : 3.125 (après le halving 2024)',
      example: 'Machine 605 TH/s, Réseau 600 EH/s (600,000,000 TH/s)\nBTC/jour = (605 / 600,000,000) × (144 × 3.125) = 0.000452 BTC/jour'
    },
    'revenu-brut': {
      title: '2. Revenu Brut par jour',
      formula: 'Revenu Brut/jour = BTC/jour × Prix BTC',
      example: '0.000452 BTC/jour × $95,000 = $42.94/jour'
    },
    'opex': {
      title: '3. OPEX (Opérations) par jour',
      formula: 'OPEX/jour = (Power kW × 24h) × Prix Électricité + (Frais Additionnels / 30)',
      example: 'Machine 5870W (5.87 kW), Électricité $0.072/kWh, Frais $25/mois\nOPEX/jour = (5.87 × 24) × 0.072 + (25 / 30) = $10.14 + $0.83 = $10.97/jour'
    },
    'revenu-net': {
      title: '4. Revenu Net par jour',
      formula: 'Revenu Net/jour = Revenu Brut/jour - OPEX/jour',
      example: '$42.94 - $10.97 = $31.97/jour'
    },
    'roi': {
      title: '5. ROI (Return on Investment)',
      formula: 'ROI (jours) = CAPEX / Revenu Net/jour',
      example: 'Machine $8,500, Revenu Net $31.97/jour\nROI = 8,500 / 31.97 = 266 jours ≈ 8.9 mois'
    },
    'break-even': {
      title: '6. Break-even',
      formula: 'Break-even = ROI (même formule)',
      example: 'Le break-even correspond au moment où les revenus nets cumulés égalent l\'investissement initial (CAPEX).'
    },
    'revenue-th': {
      title: '7. Revenue par TH/s par jour',
      formula: 'Revenue TH/$ = (BTC produits par jour / Hashrate Réseau Total) × Prix BTC',
      example: '(144 × 3.125) / 600,000,000 × $95,000 = $0.0710 par TH/s/jour'
    }
  },
  termes: {
    'machines': {
      title: 'Machines (Miners)',
      items: [
        { term: 'Hashrate (TH/s)', definition: 'Puissance de calcul de la machine en TéraHash par seconde' },
        { term: 'Power (W)', definition: 'Consommation électrique en Watts' },
        { term: 'Efficiency (J/TH)', definition: 'Efficacité énergétique en Joules par TéraHash' },
        { term: 'Price (CAPEX)', definition: 'Coût d\'achat de la machine en USD' }
      ]
    },
    'hosters': {
      title: 'Hosters (Centres de données)',
      items: [
        { term: 'Location', definition: 'Localisation géographique du centre de données' },
        { term: 'Electricity Rate ($/kWh)', definition: 'Prix de l\'électricité par kilowatt-heure' },
        { term: 'Additional Fees ($/mo)', definition: 'Frais additionnels mensuels (maintenance, location, etc.)' },
        { term: 'Deposit (mois)', definition: 'Caution demandée en nombre de mois' }
      ]
    }
  },
  donnees: {},
  constantes: {},
  design: {}
}

export default function GlossairePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>('formules') // Ouvrir la première section par défaut
  const [glossaireData, setGlossaireData] = useState<GlossaireData>(DEFAULT_GLOSSAIRE)
  const [mounted, setMounted] = useState(false)

  // Charger depuis localStorage
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('glossaire-data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Fusionner avec les données par défaut pour éviter les clés manquantes
        setGlossaireData({
          ...DEFAULT_GLOSSAIRE,
          ...parsed,
          formules: { ...DEFAULT_GLOSSAIRE.formules, ...parsed.formules },
          termes: { ...DEFAULT_GLOSSAIRE.termes, ...parsed.termes }
        })
      } catch (error) {
        console.error('Error loading glossaire data:', error)
      }
    }
  }, [])

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('glossaire-data', JSON.stringify(glossaireData))
    }
  }, [glossaireData, mounted])

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  const updateFormule = (key: string, field: string, value: string) => {
    setGlossaireData(prev => ({
      ...prev,
      formules: {
        ...prev.formules,
        [key]: {
          ...prev.formules[key],
          [field]: value
        }
      }
    }))
  }

  const updateTerme = (category: string, index: number, field: string, value: string) => {
    setGlossaireData(prev => ({
      ...prev,
      termes: {
        ...prev.termes,
        [category]: {
          ...prev.termes[category],
          items: prev.termes[category].items.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    }))
  }

  return (
    <div className="dashboard-view" style={{ paddingTop: 0, marginTop: 0 }}>
      <div className="dashboard-content">
        {/* Header Premium */}
        <div className="glossaire-header-premium">
          <div>
            <h1 className="glossaire-title-premium">Glossaire Technique</h1>
            <p className="glossaire-subtitle-premium">
              Référence complète de toutes les formules, appellations et données utilisées dans l'application
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsEditing(!isEditing)
            }}
            className={`glossaire-edit-btn ${isEditing ? 'active' : ''}`}
            title={isEditing ? 'Désactiver le mode édition' : 'Activer le mode édition'}
            type="button"
          >
            <Icon name={isEditing ? "versions" : "jobs"} />
            <span>{isEditing ? 'Mode Édition Actif' : 'Activer Édition'}</span>
          </button>
        </div>

        {/* SECTION 1: FORMULES DE CALCUL */}
        <div className="glossaire-section-premium">
          <div 
            className="glossaire-section-header-premium"
            onClick={() => toggleSection('formules')}
          >
            <div className="glossaire-section-header-content">
              <div className="premium-stat-icon">
                <Icon name="jobs" />
              </div>
              <h2 className="glossaire-section-title-premium">Formules de Calcul</h2>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={`glossaire-arrow ${activeSection === 'formules' ? 'open' : ''}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {activeSection === 'formules' && (
            <div className="glossaire-section-content-premium">
              {Object.entries(glossaireData.formules).map(([key, formule]) => (
                <div key={key} className="glossaire-card-premium">
                  {isEditing ? (
                    <div className="glossaire-edit-mode">
                      <label className="glossaire-edit-label">Titre</label>
                      <input
                        type="text"
                        value={formule.title || ''}
                        onChange={(e) => updateFormule(key, 'title', e.target.value)}
                        className="glossaire-edit-input-title"
                        placeholder="Titre de la formule"
                      />
                      <label className="glossaire-edit-label">Formule</label>
                      <textarea
                        value={formule.formula || ''}
                        onChange={(e) => updateFormule(key, 'formula', e.target.value)}
                        className="glossaire-edit-textarea"
                        placeholder="Formule"
                        rows={2}
                      />
                      <label className="glossaire-edit-label">Paramètres (optionnel)</label>
                      <textarea
                        value={formule.params || ''}
                        onChange={(e) => updateFormule(key, 'params', e.target.value)}
                        className="glossaire-edit-textarea"
                        placeholder="Paramètres par défaut"
                        rows={3}
                      />
                      <label className="glossaire-edit-label">Exemple</label>
                      <textarea
                        value={formule.example || ''}
                        onChange={(e) => updateFormule(key, 'example', e.target.value)}
                        className="glossaire-edit-textarea"
                        placeholder="Exemple de calcul"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="glossaire-card-title-premium">{formule.title}</h3>
                      <div className="glossaire-formula-premium">
                        <div className="glossaire-formula-text">{formule.formula}</div>
                      </div>
                      {formule.params && (
                        <div className="glossaire-formula-params">
                          <strong>Paramètres par défaut :</strong>
                          <pre>{formule.params}</pre>
                        </div>
                      )}
                      <div className="glossaire-formula-example-premium">
                        <strong>Exemple :</strong>
                        <pre>{formule.example}</pre>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: APPellations */}
        <div className="glossaire-section-premium">
          <div 
            className="glossaire-section-header-premium"
            onClick={() => toggleSection('appellations')}
          >
            <div className="glossaire-section-header-content">
              <div className="premium-stat-icon">
                <Icon name="projects" />
              </div>
              <h2 className="glossaire-section-title-premium">Appellations et Termes Techniques</h2>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={`glossaire-arrow ${activeSection === 'appellations' ? 'open' : ''}`}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {activeSection === 'appellations' && (
            <div className="glossaire-section-content-premium">
              {Object.entries(glossaireData.termes).map(([category, terme]) => (
                <div key={category} className="glossaire-card-premium">
                  {isEditing ? (
                    <div className="glossaire-edit-mode">
                      <label className="glossaire-edit-label">Titre de la catégorie</label>
                      <input
                        type="text"
                        value={terme.title || ''}
                        onChange={(e) => setGlossaireData(prev => ({
                          ...prev,
                          termes: {
                            ...prev.termes,
                            [category]: { ...prev.termes[category], title: e.target.value }
                          }
                        }))}
                        className="glossaire-edit-input-title"
                        placeholder="Titre de la catégorie"
                      />
                      <label className="glossaire-edit-label">Termes et définitions</label>
                      {terme.items.map((item, index) => (
                        <div key={index} className="glossaire-edit-term-row">
                          <input
                            type="text"
                            value={item.term || ''}
                            onChange={(e) => updateTerme(category, index, 'term', e.target.value)}
                            className="glossaire-edit-input"
                            placeholder="Terme"
                          />
                          <textarea
                            value={item.definition || ''}
                            onChange={(e) => updateTerme(category, index, 'definition', e.target.value)}
                            className="glossaire-edit-textarea"
                            placeholder="Définition"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <h3 className="glossaire-card-title-premium">{terme.title}</h3>
                      <div className="glossaire-terms-list">
                        {terme.items.map((item, index) => (
                          <div key={index} className="glossaire-term-item-premium">
                            <strong>{item.term}</strong> : {item.definition}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message d'aide pour le mode édition */}
        {isEditing && (
          <div className="glossaire-edit-notice">
            <Icon name="running" />
            <div>
              <strong>Mode Édition Actif</strong>
              <p>Tous les contenus sont maintenant éditables. Les modifications sont sauvegardées automatiquement.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
