'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import { collectAllTransactions, formatRelativeDate, truncateHash, formatCurrency } from './collateralUtils'
import type { Client } from './collateralUtils'
import Icon from '@/components/Icon'
import './Collateral.css'

export default function CollateralTransactions() {
  const [data, setData] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralTransactions] Chargement des données...')
        
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
          console.log('[CollateralTransactions] Données reçues:', {
            clients: response?.clients?.length || 0,
            source: response?.source
          })
          setData(response)
        } else {
          setData({ clients: [] })
        }
      } catch (err: any) {
        console.error('[CollateralTransactions] Erreur lors du chargement:', err)
        // Fallback sur données vides si erreur
        setData({ clients: [] })
      } finally {
        setLoading(false)
      }
    }
    loadData()
    
    // Auto-refresh every 30 seconds pour données en temps réel
    const interval = setInterval(loadData, 30000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading transactions...
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
  
  const allTransactions = collectAllTransactions(enrichedClients)

  // Calculer les statistiques
  const totalSupply = allTransactions.filter(t => t.type === 'Supply').reduce((sum, t) => sum + t.assetValue, 0)
  const totalBorrow = allTransactions.filter(t => t.type === 'Borrow').reduce((sum, t) => sum + t.assetValue, 0)
  const totalRepay = allTransactions.filter(t => t.type === 'Repay').reduce((sum, t) => sum + t.assetValue, 0)
  const completedCount = allTransactions.filter(t => t.status === 'Completed').length

  return (
    <div>
      {/* Premium Stats Summary */}
      <div className="premium-stats-section">
        <div className="premium-stats-grid">
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="transaction" />
              </div>
              <div className="premium-stat-label">Total Transactions</div>
            </div>
            <div className="premium-stat-value">{allTransactions.length}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">All time</span>
            </div>
          </div>
          <div className="premium-stat-box premium-stat-box-highlight">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="arrow-up" />
              </div>
              <div className="premium-stat-label">Total Supply</div>
            </div>
            <div className="premium-stat-value premium-stat-value-green">{formatCurrency(totalSupply)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Deposited</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="arrow-down" />
              </div>
              <div className="premium-stat-label">Total Borrow</div>
            </div>
            <div className="premium-stat-value">{formatCurrency(totalBorrow)}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Borrowed</span>
            </div>
          </div>
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="check" />
              </div>
              <div className="premium-stat-label">Completed</div>
            </div>
            <div className="premium-stat-value">{completedCount}</div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Successful transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Transaction History</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Asset</th>
                  <th>Protocol</th>
                  <th>Status</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.length > 0 ? (
                  allTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{formatRelativeDate(tx.date)}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: 'var(--text-xs)',
                          background: tx.type === 'Supply' 
                            ? 'rgba(197, 255, 167, 0.2)' 
                            : tx.type === 'Borrow'
                            ? 'rgba(255, 165, 0, 0.2)'
                            : 'rgba(100, 150, 255, 0.2)',
                          color: tx.type === 'Supply' 
                            ? '#C5FFA7' 
                            : tx.type === 'Borrow'
                            ? '#FFA500'
                            : '#6496FF'
                        }}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.clientName}</td>
                      <td className={tx.type === 'Supply' || tx.type === 'Repay' ? 'collateral-value-green' : 'collateral-value-red'}>
                        {tx.type === 'Supply' || tx.type === 'Repay' ? '+' : '-'}{tx.amount.toLocaleString('en-US', { maximumFractionDigits: tx.asset === 'USDC' || tx.asset === 'USDT' ? 0 : 4 })} {tx.asset}
                      </td>
                      <td>{tx.asset}</td>
                      <td>{tx.protocol}</td>
                      <td>
                        <span style={{ 
                          color: tx.status === 'Completed' ? '#C5FFA7' : tx.status === 'Active' ? '#FFA500' : 'var(--text-secondary)'
                        }}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        {tx.txHash ? (
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }} title={tx.txHash}>
                            {truncateHash(tx.txHash)}
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic'
                          }}>
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No transactions yet
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
