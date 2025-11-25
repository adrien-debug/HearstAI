'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

// Fonction pour calculer les métriques d'un client
function computeClientMetrics(client: any) {
  let totalCollateralUsd = 0
  let totalDebtUsd = 0
  let weightedRateNumerator = 0
  let totalBtcCollateral = 0
  let totalEthCollateral = 0

  client.positions?.forEach((pos: any) => {
    const collatUsd = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    const debtUsd = pos.debtAmount || 0

    totalCollateralUsd += collatUsd
    totalDebtUsd += debtUsd
    weightedRateNumerator += debtUsd * (pos.borrowApr || 0)

    if (pos.asset === 'BTC') totalBtcCollateral += pos.collateralAmount || 0
    if (pos.asset === 'ETH') totalEthCollateral += pos.collateralAmount || 0
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
  }
}

export default function CollateralOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralOverview] Chargement des données...')
        const response = await collateralAPI.getAll()
        console.log('[CollateralOverview] Données reçues:', {
          clients: response?.clients?.length || 0,
          source: response?.source,
          count: response?.count
        })
        setData(response)
      } catch (err: any) {
        console.error('[CollateralOverview] Erreur lors du chargement:', err)
        // Fallback sur données vides si erreur
        setData({ clients: [] })
      } finally {
        setLoading(false)
      }
    }
    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading collateral data...
      </div>
    )
  }

  const clients = data?.clients || []
  
  // Calculer les totaux globaux
  const allMetrics = clients.map((client: any) => computeClientMetrics(client))
  const totalCollateral = allMetrics.reduce((sum: number, m: any) => sum + m.totalCollateralUsd, 0)
  const totalDebt = allMetrics.reduce((sum: number, m: any) => sum + m.totalDebtUsd, 0)
  const totalAvailable = allMetrics.reduce((sum: number, m: any) => sum + m.availableCredit, 0)
  const utilizationRate = totalCollateral > 0 ? ((totalDebt / totalCollateral) * 100).toFixed(1) : '0'

  // Générer les activités récentes depuis les positions
  const recentActivities: any[] = []
  clients.forEach((client: any) => {
    client.positions?.forEach((pos: any, idx: number) => {
      if (pos.collateralAmount > 0) {
        recentActivities.push({
          id: `${client.id}-${idx}`,
          type: 'Supply',
          amount: `${pos.collateralAmount.toFixed(2)} ${pos.asset}`,
          protocol: pos.protocol || 'Unknown',
          date: client.lastUpdate ? new Date(client.lastUpdate).toLocaleDateString() : 'N/A',
          status: 'Completed',
          value: (pos.collateralAmount * (pos.collateralPriceUsd || 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        })
      }
      if (pos.debtAmount > 0) {
        recentActivities.push({
          id: `${client.id}-${idx}-borrow`,
          type: 'Borrow',
          amount: `${pos.debtAmount.toLocaleString()} ${pos.debtToken}`,
          protocol: pos.protocol || 'Unknown',
          date: client.lastUpdate ? new Date(client.lastUpdate).toLocaleDateString() : 'N/A',
          status: 'Active',
          value: `-${pos.debtAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
        })
      }
    })
  })
  
  // Trier par date (plus récent en premier)
  recentActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const displayActivities = recentActivities.slice(0, 10)

  return (
    <div>
      {/* KPI Cards - Totaux Globaux */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Collateral</div>
          <div className="kpi-value">${(totalCollateral / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">Total value locked</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Loans</div>
          <div className="kpi-value">{clients.filter((c: any) => (computeClientMetrics(c).totalDebtUsd > 0)).length}</div>
          <div className="kpi-description">Clients with outstanding loans</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Utilization Rate</div>
          <div className="kpi-value" style={{ color: parseFloat(utilizationRate) < 50 ? '#C5FFA7' : parseFloat(utilizationRate) < 80 ? '#FFA500' : '#ff4d4d' }}>
            {utilizationRate}%
          </div>
          <div className="kpi-description">Collateral utilization</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Available Credit</div>
          <div className="kpi-value">${(totalAvailable / 1000).toFixed(0)}K</div>
          <div className="kpi-description">Available to borrow</div>
        </div>
      </div>

      {/* Liste des Clients avec leurs Positions */}
      <div className="collateral-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Clients & Positions</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Tag</th>
                  <th>Total Collateral</th>
                  <th>Total Debt</th>
                  <th>Health Factor</th>
                  <th>Positions</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client: any) => {
                  const metrics = computeClientMetrics(client)
                  const positionsCount = client.positions?.length || 0
                  return (
                    <tr key={client.id}>
                      <td><strong>{client.name}</strong></td>
                      <td><span style={{ padding: '4px 8px', background: 'rgba(197, 255, 167, 0.1)', borderRadius: '4px', fontSize: 'var(--text-xs)' }}>{client.tag}</span></td>
                      <td className="collateral-value-green">${metrics.totalCollateralUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td style={{ color: metrics.totalDebtUsd > 0 ? '#ff4d4d' : 'var(--text-secondary)' }}>${metrics.totalDebtUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td style={{ color: metrics.healthFactor >= 2 ? '#C5FFA7' : metrics.healthFactor >= 1.5 ? '#FFA500' : '#ff4d4d' }}>{metrics.healthFactor.toFixed(2)}</td>
                      <td>{positionsCount}</td>
                      <td>{client.lastUpdate ? new Date(client.lastUpdate).toLocaleString() : 'N/A'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Recent Activity</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Protocol</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayActivities.length > 0 ? (
                  displayActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.type}</td>
                      <td className={activity.type === 'Supply' ? 'collateral-value-green' : 'collateral-value-red'}>
                        {activity.type === 'Supply' ? '+' : '-'}{activity.amount}
                      </td>
                      <td>{activity.protocol}</td>
                      <td>{activity.date}</td>
                      <td><span className={activity.status === 'Completed' ? 'collateral-value-green' : ''}>{activity.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No recent activity
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
