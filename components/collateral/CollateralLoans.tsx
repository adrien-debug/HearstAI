'use client'

import { useEffect, useState, useRef } from 'react'
import { collateralAPI } from '@/lib/api'
import { collectAllLoans, formatCurrency } from './collateralUtils'
import type { Client } from './collateralUtils'
import Icon from '@/components/Icon'
import './Collateral.css'

export default function CollateralLoans() {
  const [data, setData] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralLoans] Chargement des données...')
        
        // Charger les clients depuis la base de données avec refresh DeBank
        const { customersAPI } = await import('@/lib/api')
        const customersResponse = await customersAPI.getAll()
        const loadedCustomers = customersResponse.customers || []
        setCustomers(loadedCustomers)
        
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
          console.log('[CollateralLoans] Données reçues:', {
            clients: response?.clients?.length || 0,
            source: response?.source
          })
          setData(response)
        } else {
          setData({ clients: [] })
        }
      } catch (err: any) {
        console.error('[CollateralLoans] Erreur lors du chargement:', err)
        // Fallback sur données vides si erreur
        setData({ clients: [] })
      } finally {
        setLoading(false)
      }
    }
    loadData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 300000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading loans...
      </div>
    )
  }

  // Enrichir les clients avec les noms de la DB
  const customersMap = new Map(
    customers.map((c: any) => [c.erc20Address?.toLowerCase(), c.name])
  )
  
  const enrichedClients: Client[] = (data?.clients || []).map((client: Client) => ({
    ...client,
    name: customersMap.get(client.id?.toLowerCase()) || client.name || client.id
  }))
  
  const allLoans = collectAllLoans(enrichedClients)

  // Calculer les totaux
  const totalPrincipal = allLoans.reduce((sum, loan) => sum + loan.principal, 0)
  const totalCollateralValue = allLoans.reduce((sum, loan) => sum + loan.collateralValue, 0)
  const avgInterestRate = allLoans.length > 0 
    ? allLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / allLoans.length 
    : 0

  return (
    <div>
      {/* Premium Stats Summary */}
      <div className="premium-stats-section">
        <div className="premium-stats-grid">
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="list" />
              </div>
              <div className="premium-stat-label">Active Loans</div>
            </div>
            <div className="premium-stat-value">{allLoans.length}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Outstanding loans</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="dollar" />
              </div>
              <div className="premium-stat-label">Total Principal</div>
            </div>
            <div className="premium-stat-value">{formatCurrency(totalPrincipal)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Total borrowed</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="trend-up" />
              </div>
              <div className="premium-stat-label">Average Interest Rate</div>
            </div>
            <div className="premium-stat-value">{avgInterestRate.toFixed(2)}%</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Weighted average APR</span>
            </div>
          </div>
          <div className="premium-stat-box premium-stat-box-highlight">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="shield" />
              </div>
              <div className="premium-stat-label">Total Collateral</div>
            </div>
            <div className="premium-stat-value premium-stat-value-green">{formatCurrency(totalCollateralValue)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Securing loans</span>
            </div>
          </div>
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
                  allLoans.map((loan) => (
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
