'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

// Fonction pour calculer les métriques d'un client
function computeClientMetrics(client: any) {
  let totalCollateralUsd = 0
  let totalDebtUsd = 0
  let weightedRateNumerator = 0

  client.positions?.forEach((pos: any) => {
    const collatUsd = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    const debtUsd = pos.debtAmount || 0
    totalCollateralUsd += collatUsd
    totalDebtUsd += debtUsd
    weightedRateNumerator += debtUsd * (pos.borrowApr || 0)
  })

  const collateralizationRatio = totalDebtUsd === 0 ? Infinity : totalCollateralUsd / totalDebtUsd
  const healthFactor = collateralizationRatio === Infinity ? 999 : collateralizationRatio
  const avgBorrowRate = totalDebtUsd === 0 ? 0 : weightedRateNumerator / totalDebtUsd

  return {
    totalCollateralUsd,
    totalDebtUsd,
    healthFactor,
    avgBorrowRate,
  }
}

export default function CollateralLoans() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralLoans] Chargement des données...')
        const response = await collateralAPI.getAll()
        console.log('[CollateralLoans] Données reçues:', {
          clients: response?.clients?.length || 0,
          source: response?.source
        })
        setData(response)
      } catch (err: any) {
        console.error('[CollateralLoans] Erreur lors du chargement:', err)
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
        Loading loans...
      </div>
    )
  }

  // Collecter tous les prêts actifs (positions avec debtAmount > 0)
  const allLoans: any[] = []
  const clients = data?.clients || []
  
  clients.forEach((client: any) => {
    const clientMetrics = computeClientMetrics(client)
    client.positions?.forEach((pos: any, posIdx: number) => {
      if (pos.debtAmount > 0) {
        const collateralValue = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
        const ltv = collateralValue > 0 ? (pos.debtAmount / collateralValue) * 100 : 0
        const status = clientMetrics.healthFactor >= 2 ? 'Safe' : clientMetrics.healthFactor >= 1.5 ? 'At Risk' : 'Critical'
        
        allLoans.push({
          loanId: `${client.id.slice(0, 8)}-${posIdx}`,
          clientName: client.name,
          clientId: client.id,
          principal: pos.debtAmount,
          debtToken: pos.debtToken || 'USD',
          interestRate: (pos.borrowApr || 0) * 100, // Convert to percentage
          collateral: `${pos.collateralAmount.toFixed(2)} ${pos.asset}`,
          collateralValue: collateralValue,
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          healthFactor: clientMetrics.healthFactor,
          ltv: ltv,
          status: status,
          lastUpdate: client.lastUpdate,
        })
      }
    })
  })

  // Trier par principal (décroissant)
  allLoans.sort((a, b) => b.principal - a.principal)

  // Calculer les totaux
  const totalPrincipal = allLoans.reduce((sum, loan) => sum + loan.principal, 0)
  const totalCollateralValue = allLoans.reduce((sum, loan) => sum + loan.collateralValue, 0)
  const avgInterestRate = allLoans.length > 0 
    ? allLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / allLoans.length 
    : 0

  return (
    <div>
      {/* Summary KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Active Loans</div>
          <div className="kpi-value">{allLoans.length}</div>
          <div className="kpi-description">Outstanding loans</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Principal</div>
          <div className="kpi-value">${(totalPrincipal / 1000).toFixed(0)}K</div>
          <div className="kpi-description">Total borrowed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Interest Rate</div>
          <div className="kpi-value">{avgInterestRate.toFixed(2)}%</div>
          <div className="kpi-description">Weighted average APR</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Collateral</div>
          <div className="kpi-value">${(totalCollateralValue / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">Securing loans</div>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Active Loans</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Client</th>
                  <th>Principal</th>
                  <th>Interest Rate</th>
                  <th>Collateral</th>
                  <th>LTV</th>
                  <th>Health Factor</th>
                  <th>Protocol</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allLoans.length > 0 ? (
                  allLoans.map((loan, idx) => (
                    <tr key={loan.loanId}>
                      <td><strong style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{loan.loanId}</strong></td>
                      <td>{loan.clientName}</td>
                      <td className="collateral-value-red">-${loan.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })} {loan.debtToken}</td>
                      <td>{loan.interestRate.toFixed(2)}%</td>
                      <td>{loan.collateral}</td>
                      <td>{loan.ltv.toFixed(1)}%</td>
                      <td style={{ 
                        color: loan.healthFactor >= 2 ? '#C5FFA7' : loan.healthFactor >= 1.5 ? '#FFA500' : '#ff4d4d',
                        fontWeight: 'var(--font-semibold)'
                      }}>
                        {loan.healthFactor.toFixed(2)}
                      </td>
                      <td>{loan.protocol}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: 'var(--text-xs)',
                          background: loan.status === 'Safe' 
                            ? 'rgba(197, 255, 167, 0.2)' 
                            : loan.status === 'At Risk'
                            ? 'rgba(255, 165, 0, 0.2)'
                            : 'rgba(255, 77, 77, 0.2)',
                          color: loan.status === 'Safe' 
                            ? '#C5FFA7' 
                            : loan.status === 'At Risk'
                            ? '#FFA500'
                            : '#ff4d4d'
                        }}>
                          {loan.status}
                        </span>
                      </td>
                      <td>
                        <button className="collateral-btn-secondary">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No active loans
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
