'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

// Fonction pour calculer les métriques complètes
function computeClientMetrics(client: any) {
  let totalCollateralUsd = 0
  let totalDebtUsd = 0
  let weightedRateNumerator = 0
  let totalBtcCollateral = 0
  let totalEthCollateral = 0
  let totalUsdcCollateral = 0

  client.positions?.forEach((pos: any) => {
    const collatUsd = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    const debtUsd = pos.debtAmount || 0

    totalCollateralUsd += collatUsd
    totalDebtUsd += debtUsd
    weightedRateNumerator += debtUsd * (pos.borrowApr || 0)

    if (pos.asset === 'BTC') totalBtcCollateral += pos.collateralAmount || 0
    if (pos.asset === 'ETH') totalEthCollateral += pos.collateralAmount || 0
    if (pos.asset === 'USDC' || pos.asset === 'USDT') totalUsdcCollateral += pos.collateralAmount || 0
  })

  const collateralizationRatio = totalDebtUsd === 0 ? Infinity : totalCollateralUsd / totalDebtUsd
  const healthFactor = collateralizationRatio === Infinity ? 999 : collateralizationRatio
  const threshold = 0.9
  const maxDebtSafe = totalCollateralUsd * threshold
  const riskRaw = maxDebtSafe === 0 ? 0 : totalDebtUsd / maxDebtSafe
  const riskPercent = Math.max(0, Math.min(100, riskRaw * 100))
  const avgBorrowRate = totalDebtUsd === 0 ? 0 : weightedRateNumerator / totalDebtUsd
  const utilizationRate = totalCollateralUsd > 0 ? (totalDebtUsd / totalCollateralUsd) * 100 : 0

  // Calcul du prix de liquidation pour BTC et ETH
  let btcLiqPrice = null
  if (totalBtcCollateral > 0 && totalDebtUsd > 0) {
    btcLiqPrice = totalDebtUsd / (threshold * totalBtcCollateral)
  }

  let ethLiqPrice = null
  if (totalEthCollateral > 0 && totalDebtUsd > 0) {
    ethLiqPrice = totalDebtUsd / (threshold * totalEthCollateral)
  }

  return {
    totalCollateralUsd,
    totalDebtUsd,
    collateralizationRatio,
    healthFactor,
    riskPercent,
    avgBorrowRate,
    utilizationRate,
    totalBtcCollateral,
    totalEthCollateral,
    totalUsdcCollateral,
    btcLiqPrice,
    ethLiqPrice,
  }
}

export default function CollateralAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Récupérer les données depuis DeBank en temps réel
        const response = await collateralAPI.getAll()
        setData(response)
      } catch (err) {
        console.error('Error loading collateral data:', err)
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

  const clients = data?.clients || []
  
  // Calculer les métriques globales
  const allMetrics = clients.map((client: any) => computeClientMetrics(client))
  const totalCollateral = allMetrics.reduce((sum, m) => sum + m.totalCollateralUsd, 0)
  const totalDebt = allMetrics.reduce((sum, m) => sum + m.totalDebtUsd, 0)
  const totalDeposits = totalCollateral // Pour simplifier, on considère que le collatéral = dépôts
  const totalWithdrawals = 0 // Pas de données de retrait disponibles
  const totalInterestEarned = 0 // Pas de données d'intérêt disponibles pour l'instant
  const avgUtilizationRate = allMetrics.length > 0 
    ? allMetrics.reduce((sum, m) => sum + m.utilizationRate, 0) / allMetrics.length 
    : 0
  const avgHealthFactor = allMetrics.length > 0 
    ? allMetrics.filter(m => m.totalDebtUsd > 0).reduce((sum, m) => sum + m.healthFactor, 0) / allMetrics.filter(m => m.totalDebtUsd > 0).length 
    : 0

  // Répartition par protocole
  const protocolBreakdown: { [key: string]: { collateral: number; debt: number; positions: number } } = {}
  clients.forEach((client: any) => {
    client.positions?.forEach((pos: any) => {
      const protocol = pos.protocol || 'Unknown'
      if (!protocolBreakdown[protocol]) {
        protocolBreakdown[protocol] = { collateral: 0, debt: 0, positions: 0 }
      }
      protocolBreakdown[protocol].collateral += (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
      protocolBreakdown[protocol].debt += pos.debtAmount || 0
      protocolBreakdown[protocol].positions += 1
    })
  })

  // Répartition par asset
  const assetBreakdown: { [key: string]: { amount: number; value: number } } = {}
  clients.forEach((client: any) => {
    client.positions?.forEach((pos: any) => {
      const asset = pos.asset || 'UNKNOWN'
      if (!assetBreakdown[asset]) {
        assetBreakdown[asset] = { amount: 0, value: 0 }
      }
      assetBreakdown[asset].amount += pos.collateralAmount || 0
      assetBreakdown[asset].value += (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    })
  })

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
