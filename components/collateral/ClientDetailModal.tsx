'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

interface ClientDetailModalProps {
  isOpen: boolean
  onClose: () => void
  customer: any
}

// Fonction pour calculer les métriques d'un client
function computeClientMetrics(client: any) {
  let totalCollateralUsd = 0
  let totalDebtUsd = 0
  let weightedRateNumerator = 0
  let totalBtcCollateral = 0
  let totalEthCollateral = 0
  let totalOtherCollateral = 0

  client.positions?.forEach((pos: any) => {
    const collatUsd = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    const debtUsd = pos.debtAmount || 0
    totalCollateralUsd += collatUsd
    totalDebtUsd += debtUsd
    weightedRateNumerator += debtUsd * (pos.borrowApr || 0)

    if (pos.asset === 'BTC') totalBtcCollateral += pos.collateralAmount || 0
    else if (pos.asset === 'ETH') totalEthCollateral += pos.collateralAmount || 0
    else totalOtherCollateral += collatUsd
  })

  const collateralizationRatio = totalDebtUsd === 0 ? Infinity : totalCollateralUsd / totalDebtUsd
  const healthFactor = collateralizationRatio === Infinity ? 999 : collateralizationRatio
  const threshold = 0.9
  const maxDebtSafe = totalCollateralUsd * threshold
  const riskRaw = maxDebtSafe === 0 ? 0 : totalDebtUsd / maxDebtSafe
  const riskPercent = Math.max(0, Math.min(100, riskRaw * 100))
  const avgBorrowRate = totalDebtUsd === 0 ? 0 : weightedRateNumerator / totalDebtUsd
  const availableCredit = Math.max(0, maxDebtSafe - totalDebtUsd)
  const utilizationRate = totalCollateralUsd > 0 ? (totalDebtUsd / totalCollateralUsd) * 100 : 0

  return {
    totalCollateralUsd,
    totalDebtUsd,
    collateralizationRatio,
    healthFactor,
    riskPercent,
    avgBorrowRate,
    availableCredit,
    utilizationRate,
    totalBtcCollateral,
    totalEthCollateral,
    totalOtherCollateral,
  }
}

export default function ClientDetailModal({ isOpen, onClose, customer }: ClientDetailModalProps) {
  const [collateralData, setCollateralData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isOpen && customer) {
      loadCollateralData()
    }
  }, [isOpen, customer])

  const loadCollateralData = async (refresh = false) => {
    if (!customer) return

    try {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const erc20Address = customer.erc20Address || customer.id
      let chains: string[] = ['eth']
      try {
        chains = customer.chains ? JSON.parse(customer.chains) : ['eth']
      } catch {
        chains = ['eth']
      }

      let protocols: string[] = []
      try {
        if (customer.protocols) {
          // Si c'est déjà un tableau, l'utiliser directement
          if (Array.isArray(customer.protocols)) {
            protocols = customer.protocols
          } else {
            // Sinon, parser la string JSON
            const protocolsStr = typeof customer.protocols === 'string' ? customer.protocols.trim() : String(customer.protocols)
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

      const clientData = response.clients?.find((c: any) => 
        c.id?.toLowerCase() === erc20Address?.toLowerCase()
      )

      setCollateralData(clientData || null)
    } catch (error) {
      console.error('Error loading collateral data:', error)
      setCollateralData(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (!isOpen || !customer) return null

  const metrics = collateralData ? computeClientMetrics(collateralData) : null
  const positions = collateralData?.positions || []
  const erc20Address = customer.erc20Address || customer.id || 'N/A'
  let chains: string[] = []
  let protocols: string[] = []
  
  try {
    if (customer.chains) {
      // Si c'est déjà un tableau, l'utiliser directement
      if (Array.isArray(customer.chains)) {
        chains = customer.chains
      } else {
        // Sinon, parser la string JSON
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
    console.warn('Error parsing chains:', e)
    chains = ['eth']
  }
  
  try {
    if (customer.protocols) {
      // Si c'est déjà un tableau, l'utiliser directement
      if (Array.isArray(customer.protocols)) {
        protocols = customer.protocols
      } else {
        // Sinon, parser la string JSON
        const protocolsStr = typeof customer.protocols === 'string' ? customer.protocols.trim() : String(customer.protocols)
        if (protocolsStr && protocolsStr !== '[]' && protocolsStr !== '') {
          protocols = JSON.parse(protocolsStr)
        }
      }
    }
  } catch (e) {
    console.warn('Error parsing protocols:', e)
    protocols = []
  }

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return '#C5FFA7'
    if (hf >= 1.5) return '#FFA500'
    if (hf >= 1.2) return '#FF6B6B'
    return '#FF0000'
  }

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: 'Faible', color: '#C5FFA7' }
    if (risk < 60) return { label: 'Modéré', color: '#FFA500' }
    if (risk < 80) return { label: 'Élevé', color: '#FF6B6B' }
    return { label: 'Critique', color: '#FF0000' }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content client-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{customer.name || 'Client'}</h2>
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
              onClick={() => loadCollateralData(true)}
              disabled={refreshing}
            >
              {refreshing ? '🔄' : '🔄'}
            </button>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: 'var(--space-6)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
              Chargement des données...
            </div>
          ) : !collateralData ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
              Aucune donnée disponible pour ce client
            </div>
          ) : (
            <>
              {/* Informations générales */}
              <div className="client-detail-section">
                <h3 className="client-detail-section-title">Informations générales</h3>
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

              {/* Métriques principales */}
              {metrics && (
                <div className="client-detail-section">
                  <h3 className="client-detail-section-title">Métriques principales</h3>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-label">Total Collatéral</div>
                      <div className="metric-value" style={{ color: '#C5FFA7' }}>
                        ${metrics.totalCollateralUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown">
                        {metrics.totalBtcCollateral > 0 && (
                          <span>BTC: {metrics.totalBtcCollateral.toFixed(4)}</span>
                        )}
                        {metrics.totalEthCollateral > 0 && (
                          <span>ETH: {metrics.totalEthCollateral.toFixed(4)}</span>
                        )}
                        {metrics.totalOtherCollateral > 0 && (
                          <span>Autres: ${metrics.totalOtherCollateral.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-label">Total Dette</div>
                      <div className="metric-value" style={{ color: '#ff4d4d' }}>
                        ${metrics.totalDebtUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown">
                        <span>Taux moyen: {metrics.avgBorrowRate.toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-label">Health Factor</div>
                      <div 
                        className="metric-value" 
                        style={{ color: getHealthFactorColor(metrics.healthFactor) }}
                      >
                        {metrics.healthFactor === 999 ? '∞' : metrics.healthFactor.toFixed(2)}
                      </div>
                      <div className="metric-breakdown">
                        <span>Ratio: {(metrics.collateralizationRatio * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-label">Niveau de risque</div>
                      <div 
                        className="metric-value" 
                        style={{ color: getRiskLevel(metrics.riskPercent).color }}
                      >
                        {getRiskLevel(metrics.riskPercent).label}
                      </div>
                      <div className="metric-breakdown">
                        <span>{metrics.riskPercent.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-label">Crédit disponible</div>
                      <div className="metric-value" style={{ color: '#C5FFA7' }}>
                        ${metrics.availableCredit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </div>
                      <div className="metric-breakdown">
                        <span>Max safe: ${(metrics.totalCollateralUsd * 0.9).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-label">Taux d'utilisation</div>
                      <div className="metric-value">
                        {metrics.utilizationRate.toFixed(1)}%
                      </div>
                      <div className="metric-breakdown">
                        <span>Dette / Collatéral</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Positions détaillées */}
              <div className="client-detail-section">
                <h3 className="client-detail-section-title">
                  Positions ({positions.length})
                </h3>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

