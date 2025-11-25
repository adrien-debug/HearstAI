'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

export default function CollateralTransactions() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralTransactions] Chargement des données...')
        // Récupérer les données depuis DeBank en temps réel
        const response = await collateralAPI.getAll()
        console.log('[CollateralTransactions] Données reçues:', {
          clients: response?.clients?.length || 0,
          source: response?.source
        })
        setData(response)
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
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading transactions...
      </div>
    )
  }

  // Transactions vides - seront récupérées depuis l'API ou la DB plus tard
  // Pour l'instant, on affiche uniquement les positions actuelles comme transactions
  const allTransactions: any[] = []
  const clients = data?.clients || []
  
  // Créer des transactions basées uniquement sur les positions actuelles (pas de données mockées)
  clients.forEach((client: any) => {
    const lastUpdate = client.lastUpdate ? new Date(client.lastUpdate) : new Date()
    
    client.positions?.forEach((pos: any, posIdx: number) => {
      // Transaction de supply (collatéral déposé) - basée sur la position actuelle
      if (pos.collateralAmount > 0) {
        allTransactions.push({
          id: `${client.id}-supply-${posIdx}`,
          date: lastUpdate.toISOString(), // Utiliser la date de dernière mise à jour
          type: 'Supply',
          amount: pos.collateralAmount,
          asset: pos.asset,
          assetValue: pos.collateralAmount * (pos.collateralPriceUsd || 0),
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          status: 'Active', // Position active
          txHash: null, // Pas de hash de transaction disponible
          clientName: client.name,
        })
      }
      
      // Transaction de borrow (emprunt) - basée sur la position actuelle
      if (pos.debtAmount > 0) {
        allTransactions.push({
          id: `${client.id}-borrow-${posIdx}`,
          date: lastUpdate.toISOString(), // Utiliser la date de dernière mise à jour
          type: 'Borrow',
          amount: pos.debtAmount,
          asset: pos.debtToken || 'USD',
          assetValue: pos.debtAmount,
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          status: 'Active', // Emprunt actif
          txHash: null, // Pas de hash de transaction disponible
          clientName: client.name,
        })
      }
    })
  })

  // Trier par date (plus récent en premier)
  allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Formater les dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Calculer les statistiques
  const totalSupply = allTransactions.filter(t => t.type === 'Supply').reduce((sum, t) => sum + t.assetValue, 0)
  const totalBorrow = allTransactions.filter(t => t.type === 'Borrow').reduce((sum, t) => sum + t.assetValue, 0)
  const totalRepay = allTransactions.filter(t => t.type === 'Repay').reduce((sum, t) => sum + t.assetValue, 0)
  const completedCount = allTransactions.filter(t => t.status === 'Completed').length

  // Tronquer le hash pour l'affichage (si disponible)
  const truncateHash = (hash: string | null) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <div>
      {/* Summary KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">{allTransactions.length}</div>
          <div className="kpi-description">All time</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Supply</div>
          <div className="kpi-value">${(totalSupply / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">Deposited</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Borrow</div>
          <div className="kpi-value">${(totalBorrow / 1000).toFixed(0)}K</div>
          <div className="kpi-description">Borrowed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed</div>
          <div className="kpi-value">{completedCount}</div>
          <div className="kpi-description">Successful transactions</div>
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
                      <td>{formatDate(tx.date)}</td>
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
