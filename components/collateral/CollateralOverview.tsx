'use client'

import { useEffect, useState, useRef } from 'react'
import { collateralAPI } from '@/lib/api'
import { computeClientMetrics, computeGlobalMetrics, collectAllTransactions, formatRelativeDate, formatCurrency } from './collateralUtils'
import type { Client } from './collateralUtils'
import Icon from '@/components/Icon'
import DebankStatusIndicator from './DebankStatusIndicator'
import './Collateral.css'

export default function CollateralOverview() {
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
        console.log('[CollateralOverview] Chargement des données...')
        
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
          console.log('[CollateralOverview] Données reçues:', {
            clients: response?.clients?.length || 0,
            source: response?.source,
            count: response?.count
          })
          setData(response)
        } else {
          setData({ clients: [] })
        }
      } catch (err: any) {
        console.error('[CollateralOverview] Erreur lors du chargement:', err)
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
        Loading collateral data...
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
  
  // Calculer les totaux globaux avec les utilitaires partagés
  const globalMetrics = computeGlobalMetrics(enrichedClients)
  const totalCollateral = globalMetrics.totalCollateral
  const totalDebt = globalMetrics.totalDebt
  const totalAvailable = globalMetrics.totalAvailable
  const utilizationRate = globalMetrics.utilizationRate.toFixed(1)

  // Générer les activités récentes depuis les positions
  const allTransactions = collectAllTransactions(enrichedClients)
  const displayActivities = allTransactions.slice(0, 10).map(tx => ({
    id: tx.id,
    type: tx.type,
    amount: tx.type === 'Supply' 
      ? `${tx.amount.toFixed(2)} ${tx.asset}`
      : `${tx.amount.toLocaleString()} ${tx.asset}`,
    protocol: tx.protocol,
    date: formatRelativeDate(tx.date),
    status: tx.status,
    value: tx.type === 'Supply'
      ? `+${tx.assetValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
      : `-${tx.assetValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
  }))

  return (
    <div>
      {/* DeBank API Status Indicator */}
      <DebankStatusIndicator />

      {/* Premium Stats Cards - Totaux Globaux */}
      <div className="premium-stats-section">
        <div className="premium-stats-grid">
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="collateral" />
              </div>
              <div className="premium-stat-label">Total Collateral</div>
            </div>
            <div className="premium-stat-value premium-stat-value-green">{formatCurrency(totalCollateral)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Total value locked</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="chart" />
              </div>
              <div className="premium-stat-label">Active Loans</div>
            </div>
            <div className="premium-stat-value">{globalMetrics.clientsWithDebt}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Clients with outstanding loans</span>
            </div>
          </div>
          <div className="premium-stat-box premium-stat-box-highlight">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="flash" />
              </div>
              <div className="premium-stat-label">Utilization Rate</div>
            </div>
            <div className="premium-stat-value" style={{ color: parseFloat(utilizationRate) < 50 ? '#C5FFA7' : parseFloat(utilizationRate) < 80 ? 'rgba(197, 255, 167, 0.7)' : 'rgba(255, 255, 255, 0.5)' }}>
              {utilizationRate}%
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Collateral utilization</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="card" />
              </div>
              <div className="premium-stat-label">Available Credit</div>
            </div>
            <div className="premium-stat-value premium-stat-value-green">{formatCurrency(totalAvailable)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Available to borrow</span>
            </div>
          </div>
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
                {enrichedClients.map((client) => {
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
