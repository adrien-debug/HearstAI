'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { collateralAPI, customersAPI } from '@/lib/api'
import { computeClientMetrics } from '@/components/collateral/collateralUtils'
import type { Client } from '@/components/collateral/collateralUtils'
import AddClientModal from '@/components/collateral/AddClientModal'
import '@/components/collateral/Collateral.css'

export default function ClientViewPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [collateralData, setCollateralData] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (clientId) {
      loadData()
    }
  }, [clientId])

  const loadData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      // Charger le customer depuis la DB
      const customerResponse = await customersAPI.getById(clientId)
      const loadedCustomer = customerResponse.customer
      setCustomer(loadedCustomer)

      if (!loadedCustomer) {
        setLoading(false)
        setRefreshing(false)
        return
      }

      // Charger les données collateral
      const erc20Address = loadedCustomer.erc20Address || loadedCustomer.id
      let chains: string[] = ['eth']
      try {
        chains = loadedCustomer.chains ? JSON.parse(loadedCustomer.chains) : ['eth']
      } catch {
        chains = ['eth']
      }

      let protocols: string[] = []
      try {
        if (loadedCustomer.protocols) {
          if (Array.isArray(loadedCustomer.protocols)) {
            protocols = loadedCustomer.protocols
          } else {
            const protocolsStr = typeof loadedCustomer.protocols === 'string' 
              ? loadedCustomer.protocols.trim() 
              : String(loadedCustomer.protocols)
            if (protocolsStr && protocolsStr !== '[]' && protocolsStr !== '') {
              protocols = JSON.parse(protocolsStr)
            }
          }
        }
      } catch (e) {
        console.warn('Error parsing protocols:', e)
        protocols = []
      }

      const response = await collateralAPI.getAll(
        [erc20Address],
        chains,
        protocols
      )

      const clientData = response.clients?.find((c: Client) => 
        c.id?.toLowerCase() === erc20Address?.toLowerCase()
      )

      setCollateralData(clientData || null)
    } catch (error) {
      console.error('Error loading data:', error)
      setCollateralData(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await customersAPI.delete(clientId)
      router.push('/collateral')
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      alert('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'))
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Chargement des données du client...
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Client non trouvé
          </div>
        </div>
      </div>
    )
  }

  const metrics = collateralData ? computeClientMetrics(collateralData) : null
  const positions = collateralData?.positions || []
  const erc20Address = customer.erc20Address || customer.id || 'N/A'
  
  let chains: string[] = []
  let protocols: string[] = []
  
  try {
    if (customer.chains) {
      if (Array.isArray(customer.chains)) {
        chains = customer.chains
      } else {
        const chainsStr = typeof customer.chains === 'string' ? customer.chains.trim() : String(customer.chains)
        if (chainsStr && chainsStr !== '[]' && chainsStr !== '') {
          chains = JSON.parse(chainsStr)
        } else {
          chains = ['eth']
        }
      }
    } else {
      chains = ['eth']
    }
  } catch (e) {
    chains = ['eth']
  }
  
  try {
    if (customer.protocols) {
      if (Array.isArray(customer.protocols)) {
        protocols = customer.protocols
      } else {
        const protocolsStr = typeof customer.protocols === 'string' ? customer.protocols.trim() : String(customer.protocols)
        if (protocolsStr && protocolsStr !== '[]' && protocolsStr !== '') {
          protocols = JSON.parse(protocolsStr)
        }
      }
    }
  } catch (e) {
    protocols = []
  }

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return '#C5FFA7' // Vert Hearst - Safe
    if (hf >= 1.5) return 'rgba(197, 255, 167, 0.7)' // Vert clair - Warning
    if (hf >= 1.2) return 'rgba(197, 255, 167, 0.5)' // Vert très clair - At Risk
    return 'rgba(255, 255, 255, 0.4)' // Gris - Critical
  }

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: 'Faible', color: '#C5FFA7' }
    if (risk < 60) return { label: 'Modéré', color: 'rgba(197, 255, 167, 0.7)' }
    if (risk < 80) return { label: 'Élevé', color: 'rgba(197, 255, 167, 0.5)' }
    return { label: 'Critique', color: 'rgba(255, 255, 255, 0.4)' }
  }

  // Calcul pour la jauge de collateral - Utilisation réelle
  const utilizationPercent = metrics 
    ? Math.min(100, metrics.utilizationRate)
    : 0
  
  // Health Factor pour déterminer la couleur (plus fiable que l'utilisation)
  const getGaugeColor = () => {
    if (!metrics) return 'rgba(255, 255, 255, 0.2)'
    if (metrics.healthFactor >= 2) return '#C5FFA7' // Vert Hearst - Safe
    if (metrics.healthFactor >= 1.5) return 'rgba(197, 255, 167, 0.6)' // Vert clair - Warning
    if (metrics.healthFactor >= 1.2) return 'rgba(197, 255, 167, 0.4)' // Vert très clair - At Risk
    return 'rgba(255, 255, 255, 0.3)' // Gris - Critical
  }
  
  const gaugeColor = getGaugeColor()

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header avec boutons */}
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button 
              className="collateral-btn-secondary"
              onClick={() => router.push('/collateral?section=clients')}
              style={{ marginBottom: 'var(--space-2)' }}
            >
              ← Retour
            </button>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginTop: 'var(--space-2)' }}>
              {customer.name || 'Client'}
            </h1>
            <div style={{ 
              marginTop: '4px', 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              {erc20Address}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="collateral-btn-secondary" 
              onClick={() => loadData(true)}
              disabled={refreshing}
            >
              {refreshing ? '🔄 Actualisation...' : '🔄 Actualiser'}
            </button>
            <button 
              className="collateral-btn-primary" 
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Modifier
            </button>
            <button 
              className="collateral-btn-secondary" 
              onClick={() => setShowDeleteConfirm(true)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>

        {!collateralData ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
            Aucune donnée disponible pour ce client
          </div>
        ) : (
          <>
            {/* Jauge de Collateral Premium */}
            {metrics && (
              <div className="collateral-card" style={{ 
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                border: '1px solid rgba(197, 255, 167, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(197, 255, 167, 0.05)'
              }}>
                <div className="collateral-card-header" style={{ 
                  borderBottom: '1px solid rgba(197, 255, 167, 0.1)',
                  background: 'linear-gradient(90deg, rgba(197, 255, 167, 0.05) 0%, transparent 100%)'
                }}>
                  <h3 className="collateral-card-title" style={{ color: '#C5FFA7' }}>
                    Jauge de Collateral
                  </h3>
                </div>
                <div className="collateral-card-body" style={{ padding: 'var(--space-8)' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-12)', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {/* Jauge circulaire Premium */}
                    <div style={{ 
                      position: 'relative', 
                      width: '240px', 
                      height: '240px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="240" height="240">
                        {/* Cercle de fond - Gris Hearst */}
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="20"
                        />
                        {/* Cercle de progression - Vert Hearst (commence à droite, tourne dans le sens horaire) */}
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke={gaugeColor}
                          strokeWidth="20"
                          strokeDasharray={`${2 * Math.PI * 100}`}
                          strokeDashoffset={`${2 * Math.PI * 100 * (1 - utilizationPercent / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 120 120)"
                          style={{ 
                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: 'drop-shadow(0 0 8px rgba(197, 255, 167, 0.3))'
                          }}
                        />
                        {/* Cercle intérieur décoratif */}
                        <circle
                          cx="120"
                          cy="120"
                          r="70"
                          fill="none"
                          stroke="rgba(197, 255, 167, 0.05)"
                          strokeWidth="1"
                        />
                      </svg>
                      <div style={{ 
                        position: 'absolute', 
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          fontSize: 'var(--text-3xl)', 
                          fontWeight: 'var(--font-bold)',
                          color: '#C5FFA7',
                          lineHeight: '1.2',
                          textShadow: '0 0 20px rgba(197, 255, 167, 0.5)'
                        }}>
                          {utilizationPercent.toFixed(1)}%
                        </div>
                        <div style={{ 
                          fontSize: 'var(--text-xs)', 
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginTop: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          fontWeight: 'var(--font-medium)'
                        }}>
                          Utilisation
                        </div>
                        <div style={{ 
                          fontSize: 'var(--text-xs)', 
                          color: 'rgba(197, 255, 167, 0.6)',
                          marginTop: '4px',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          HF: {metrics.healthFactor === 999 ? '∞' : metrics.healthFactor.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Métriques Premium à côté de la jauge */}
                    <div style={{ flex: 1, minWidth: '350px' }}>
                      <div className="kpi-grid" style={{ 
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'var(--space-4)'
                      }}>
                        <div className="kpi-card" style={{
                          background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                          border: '1px solid rgba(197, 255, 167, 0.1)'
                        }}>
                          <div className="kpi-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Collatéral</div>
                          <div className="kpi-value" style={{ color: '#C5FFA7', textShadow: '0 0 10px rgba(197, 255, 167, 0.3)' }}>
                            ${(metrics.totalCollateralUsd / 1000).toFixed(0)}K
                          </div>
                          <div className="kpi-description" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            Valeur totale
                          </div>
                        </div>
                        <div className="kpi-card" style={{
                          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(20, 20, 20, 0.7) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <div className="kpi-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Dette</div>
                          <div className="kpi-value" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            ${(metrics.totalDebtUsd / 1000).toFixed(0)}K
                          </div>
                          <div className="kpi-description" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            Emprunt actif
                          </div>
                        </div>
                        <div className="kpi-card" style={{
                          background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                          border: `1px solid ${gaugeColor}40`
                        }}>
                          <div className="kpi-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Health Factor</div>
                          <div className="kpi-value" style={{ 
                            color: gaugeColor,
                            textShadow: `0 0 10px ${gaugeColor}50`
                          }}>
                            {metrics.healthFactor === 999 ? '∞' : metrics.healthFactor.toFixed(2)}
                          </div>
                          <div className="kpi-description" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            Ratio de sécurité
                          </div>
                        </div>
                        <div className="kpi-card" style={{
                          background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                          border: '1px solid rgba(197, 255, 167, 0.1)'
                        }}>
                          <div className="kpi-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Crédit Disponible</div>
                          <div className="kpi-value" style={{ color: '#C5FFA7', textShadow: '0 0 10px rgba(197, 255, 167, 0.3)' }}>
                            ${(metrics.availableCredit / 1000).toFixed(0)}K
                          </div>
                          <div className="kpi-description" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            Capacité restante
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informations générales */}
            <div className="collateral-card" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="collateral-card-header">
                <h3 className="collateral-card-title">Informations générales</h3>
              </div>
              <div className="collateral-card-body">
                <div className="client-detail-grid">
                  <div className="client-detail-item">
                    <span className="client-detail-label">Tag</span>
                    <span className="client-detail-value">{customer.tag || 'Client'}</span>
                  </div>
                  <div className="client-detail-item">
                    <span className="client-detail-label">Chains surveillées</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {chains.map((chain: string, idx: number) => (
                        <span key={idx} className="chain-badge">{chain}</span>
                      ))}
                    </div>
                  </div>
                  <div className="client-detail-item">
                    <span className="client-detail-label">Protocoles autorisés</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {protocols.length > 0 ? (
                        protocols.map((protocol: string, idx: number) => (
                          <span key={idx} className="protocol-badge">{protocol}</span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>Tous</span>
                      )}
                    </div>
                  </div>
                  <div className="client-detail-item">
                    <span className="client-detail-label">Dernière mise à jour</span>
                    <span className="client-detail-value">
                      {collateralData.lastUpdate 
                        ? new Date(collateralData.lastUpdate).toLocaleString('fr-FR')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Métriques détaillées Premium */}
            {metrics && (
              <div className="collateral-card" style={{ 
                marginBottom: 'var(--space-6)',
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                border: '1px solid rgba(197, 255, 167, 0.1)'
              }}>
                <div className="collateral-card-header" style={{ 
                  borderBottom: '1px solid rgba(197, 255, 167, 0.1)',
                  background: 'linear-gradient(90deg, rgba(197, 255, 167, 0.05) 0%, transparent 100%)'
                }}>
                  <h3 className="collateral-card-title" style={{ color: '#C5FFA7' }}>Métriques détaillées</h3>
                </div>
                <div className="collateral-card-body">
                  <div className="metrics-grid">
                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                      border: '1px solid rgba(197, 255, 167, 0.1)'
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Collatéral</div>
                      <div className="metric-value" style={{ color: '#C5FFA7', textShadow: '0 0 10px rgba(197, 255, 167, 0.3)' }}>
                        ${metrics.totalCollateralUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        {metrics.totalBtcCollateral > 0 && (
                          <span>BTC: {metrics.totalBtcCollateral.toFixed(4)}</span>
                        )}
                        {metrics.totalEthCollateral > 0 && (
                          <span>ETH: {metrics.totalEthCollateral.toFixed(4)}</span>
                        )}
                        {metrics.totalUsdcCollateral > 0 && (
                          <span>USDC: {metrics.totalUsdcCollateral.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(20, 20, 20, 0.7) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Dette</div>
                      <div className="metric-value" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        ${metrics.totalDebtUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>Taux moyen: {metrics.avgBorrowRate.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                      border: `1px solid ${getHealthFactorColor(metrics.healthFactor)}40`
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Health Factor</div>
                      <div 
                        className="metric-value" 
                        style={{ 
                          color: getHealthFactorColor(metrics.healthFactor),
                          textShadow: `0 0 10px ${getHealthFactorColor(metrics.healthFactor)}50`
                        }}
                      >
                        {metrics.healthFactor === 999 ? '∞' : metrics.healthFactor.toFixed(2)}
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>Ratio: {(metrics.collateralizationRatio * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                      border: `1px solid ${getRiskLevel(metrics.riskPercent).color}40`
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Niveau de risque</div>
                      <div 
                        className="metric-value" 
                        style={{ 
                          color: getRiskLevel(metrics.riskPercent).color,
                          textShadow: `0 0 10px ${getRiskLevel(metrics.riskPercent).color}50`
                        }}
                      >
                        {getRiskLevel(metrics.riskPercent).label}
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>{metrics.riskPercent.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(197, 255, 167, 0.05) 0%, rgba(26, 26, 26, 0.7) 100%)',
                      border: '1px solid rgba(197, 255, 167, 0.1)'
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Crédit disponible</div>
                      <div className="metric-value" style={{ color: '#C5FFA7', textShadow: '0 0 10px rgba(197, 255, 167, 0.3)' }}>
                        ${metrics.availableCredit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>Max safe: ${(metrics.totalCollateralUsd * 0.9).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="metric-card" style={{
                      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(20, 20, 20, 0.7) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div className="metric-label" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Taux d'utilisation</div>
                      <div className="metric-value" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {metrics.utilizationRate.toFixed(1)}%
                      </div>
                      <div className="metric-breakdown" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        <span>Dette / Collatéral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Positions détaillées */}
            <div className="collateral-card">
              <div className="collateral-card-header">
                <h3 className="collateral-card-title">
                  Positions ({positions.length})
                </h3>
              </div>
              <div className="collateral-card-body">
                {positions.length > 0 ? (
                  <div className="positions-table-container">
                    <table className="positions-table">
                      <thead>
                        <tr>
                          <th>Asset</th>
                          <th>Protocole</th>
                          <th>Chain</th>
                          <th>Collatéral</th>
                          <th>Prix USD</th>
                          <th>Valeur USD</th>
                          <th>Dette</th>
                          <th>Token Dette</th>
                          <th>APR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.map((pos: any, idx: number) => {
                          const collateralValue = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
                          return (
                            <tr key={idx}>
                              <td>
                                <span className="asset-badge">{pos.asset}</span>
                              </td>
                              <td>{pos.protocol}</td>
                              <td>
                                <span className="chain-badge-small">{pos.chain}</span>
                              </td>
                              <td style={{ fontFamily: 'var(--font-mono)' }}>
                                {pos.collateralAmount?.toLocaleString('en-US', { maximumFractionDigits: 4 }) || '0'}
                              </td>
                              <td style={{ fontFamily: 'var(--font-mono)' }}>
                                ${pos.collateralPriceUsd?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'}
                              </td>
                              <td style={{ 
                                fontFamily: 'var(--font-mono)',
                                color: '#C5FFA7',
                                fontWeight: 'var(--font-semibold)'
                              }}>
                                ${collateralValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ 
                                fontFamily: 'var(--font-mono)',
                                color: pos.debtAmount > 0 ? '#ff4d4d' : 'var(--text-secondary)'
                              }}>
                                {pos.debtAmount?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'}
                              </td>
                              <td>{pos.debtToken || 'N/A'}</td>
                              <td>
                                {pos.borrowApr > 0 ? (
                                  <span style={{ color: '#FFA500' }}>
                                    {pos.borrowApr.toFixed(2)}%
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--text-secondary)' }}>0%</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--space-8)', 
                    color: 'var(--text-secondary)' 
                  }}>
                    Aucune position active
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Modal d'édition */}
        {showEditModal && customer && (
          <AddClientModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false)
              loadData(true)
            }}
            customer={customer}
          />
        )}

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2>Confirmer la suppression</h2>
                <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>×</button>
              </div>
              <div className="modal-form">
                <p style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                  Êtes-vous sûr de vouloir supprimer le client <strong>{customer.name}</strong> ?
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                  Cette action est irréversible.
                </p>
                <div className="modal-actions">
                  <button 
                    className="collateral-btn-secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Annuler
                  </button>
                  <button 
                    className="collateral-btn-primary"
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ 
                      background: '#ff4d4d',
                      color: '#fff'
                    }}
                  >
                    {deleting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

