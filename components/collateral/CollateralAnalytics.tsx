'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import { computeGlobalMetrics, computeProtocolBreakdown, computeAssetBreakdown } from './collateralUtils'
import type { Client } from './collateralUtils'
import './Collateral.css'

export default function CollateralAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralAnalytics] Chargement des données...')
        
        // Charger les clients depuis la base de données avec refresh DeBank
        const { customersAPI } = await import('@/lib/api')
        const customersResponse = await customersAPI.getAll()
        const loadedCustomers = customersResponse.customers || []
        
        // Charger les données collatérales depuis DeBank
        // Utiliser les wallets des customers chargés
        const customerWallets = loadedCustomers.map((c: any) => c.erc20Address).filter(Boolean)
        if (customerWallets.length > 0) {
          const response = await collateralAPI.getAll(
            customerWallets,
            loadedCustomers.map((c: any) => {
              try {
                return JSON.parse(c.chains || '["eth"]')
              } catch {
                return ['eth']
              }
            }).flat(),
            loadedCustomers.map((c: any) => {
              try {
                return JSON.parse(c.protocols || '[]')
              } catch {
                return []
              }
            }).flat()
          )
          console.log('[CollateralAnalytics] Données reçues:', {
            clients: response?.clients?.length || 0,
            source: response?.source
          })
          setData(response)
        } else {
          setData({ clients: [] })
        }
      } catch (err: any) {
        console.error('[CollateralAnalytics] Erreur lors du chargement:', err)
        // Fallback sur données vides si erreur
        setData({ clients: [] })
      } finally {
        setLoading(false)
      }
    }
    loadData()
    
    // Auto-refresh every 30 seconds pour données en temps réel
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading analytics...
      </div>
    )
  }

  const clients: Client[] = data?.clients || []
  
  // Calculer les métriques globales avec les utilitaires partagés
  const globalMetrics = computeGlobalMetrics(clients)
  const totalDeposits = globalMetrics.totalCollateral // Pour simplifier, on considère que le collatéral = dépôts
  const totalWithdrawals = 0 // Pas de données de retrait disponibles
  const totalInterestEarned = 0 // Pas de données d'intérêt disponibles pour l'instant
  const avgUtilizationRate = globalMetrics.avgUtilizationRate
  const avgHealthFactor = globalMetrics.avgHealthFactor

  // Répartition par protocole et asset avec les utilitaires partagés
  const protocolBreakdown = computeProtocolBreakdown(clients)
  const assetBreakdown = computeAssetBreakdown(clients)

  return (
    <div>
      {/* Analytics Summary KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Deposits</div>
          <div className="kpi-value">${(totalDeposits / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">All time deposits</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Withdrawals</div>
          <div className="kpi-value">${(totalWithdrawals / 1000).toFixed(0)}K</div>
          <div className="kpi-description">All time withdrawals</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Interest Earned</div>
          <div className="kpi-value">${(totalInterestEarned / 1000).toFixed(0)}K</div>
          <div className="kpi-description">Total interest</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Utilization</div>
          <div className="kpi-value" style={{ color: avgUtilizationRate < 50 ? '#C5FFA7' : avgUtilizationRate < 80 ? '#FFA500' : '#ff4d4d' }}>
            {avgUtilizationRate.toFixed(1)}%
          </div>
          <div className="kpi-description">Average utilization rate</div>
        </div>
      </div>

      {/* Charts Placeholders */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 'var(--space-6)' }}>
        <div className="collateral-card">
          <div className="collateral-card-header">
            <h3 className="collateral-card-title">Collateral Value Trend</h3>
          </div>
          <div className="collateral-card-body">
            <div style={{ 
              padding: 'var(--space-8)', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              minHeight: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>Chart will be displayed here</p>
            </div>
          </div>
        </div>
        <div className="collateral-card">
          <div className="collateral-card-header">
            <h3 className="collateral-card-title">Loan Utilization</h3>
          </div>
          <div className="collateral-card-body">
            <div style={{ 
              padding: 'var(--space-8)', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              minHeight: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>Chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Breakdown */}
      <div className="collateral-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Protocol Breakdown</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Protocol</th>
                  <th>Total Collateral</th>
                  <th>Total Debt</th>
                  <th>Positions</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(protocolBreakdown).map(([protocol, data]) => {
                  const utilization = data.collateral > 0 ? (data.debt / data.collateral) * 100 : 0
                  return (
                    <tr key={protocol}>
                      <td><strong>{protocol}</strong></td>
                      <td className="collateral-value-green">${data.collateral.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td style={{ color: data.debt > 0 ? '#ff4d4d' : 'var(--text-secondary)' }}>${data.debt.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td>{data.positions}</td>
                      <td style={{ color: utilization < 50 ? '#C5FFA7' : utilization < 80 ? '#FFA500' : '#ff4d4d' }}>
                        {utilization.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Asset Breakdown */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Asset Breakdown</h3>
        </div>
        <div className="collateral-card-body">
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {Object.entries(assetBreakdown).map(([asset, data]) => (
              <div className="kpi-card" key={asset}>
                <div className="kpi-label">{asset}</div>
                <div className="kpi-value">{data.amount.toLocaleString('en-US', { maximumFractionDigits: asset === 'USDC' || asset === 'USDT' ? 0 : 2 })}</div>
                <div className="kpi-description">${data.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
