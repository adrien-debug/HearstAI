'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import { collectAllAssets, computeGlobalMetrics } from './collateralUtils'
import type { Client } from './collateralUtils'
import './Collateral.css'

export default function CollateralAssets() {
  const [data, setData] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('[CollateralAssets] Chargement des données...')
        
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
          console.log('[CollateralAssets] Données reçues:', {
            clients: response?.clients?.length || 0,
            source: response?.source
          })
          setData(response)
        } else {
          setData({ clients: [] })
        }
      } catch (err: any) {
        console.error('[CollateralAssets] Erreur lors du chargement:', err)
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
        Loading assets...
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
  
  // Collecter tous les assets avec les utilitaires partagés
  const allAssets = collectAllAssets(enrichedClients)
  
  // Calculer les totaux par asset type
  const assetsByType: { [key: string]: { amount: number; value: number } } = {}
  allAssets.forEach((asset) => {
    if (!assetsByType[asset.asset]) {
      assetsByType[asset.asset] = { amount: 0, value: 0 }
    }
    assetsByType[asset.asset].amount += asset.amount
    assetsByType[asset.asset].value += asset.totalValue
  })

  const totalValue = allAssets.reduce((sum, a) => sum + a.totalValue, 0)

  return (
    <div>
      {/* Summary KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Assets Value</div>
          <div className="kpi-value">${(totalValue / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">All collateral assets</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Asset Types</div>
          <div className="kpi-value">{Object.keys(assetsByType).length}</div>
          <div className="kpi-description">Different asset types</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Positions</div>
          <div className="kpi-value">{allAssets.length}</div>
          <div className="kpi-description">Active positions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Protocols</div>
          <div className="kpi-value">{new Set(allAssets.map(a => a.protocol)).size}</div>
          <div className="kpi-description">Different protocols</div>
        </div>
      </div>

      {/* Assets List Table */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Collateral Assets</h3>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Asset Type</th>
                  <th>Amount</th>
                  <th>Price (USD)</th>
                  <th>Value (USD)</th>
                  <th>Protocol</th>
                  <th>Chain</th>
                  <th>Clients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAssets.length > 0 ? (
                  allAssets.map((asset, idx) => (
                    <tr key={idx}>
                      <td><strong>{asset.asset}</strong></td>
                      <td>{asset.amount.toLocaleString('en-US', { maximumFractionDigits: asset.asset === 'USDC' || asset.asset === 'USDT' ? 0 : 4 })}</td>
                      <td>${asset.priceUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                      <td className="collateral-value-green">${asset.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td>{asset.protocol}</td>
                      <td><span style={{ textTransform: 'capitalize', fontSize: 'var(--text-xs)' }}>{asset.chain}</span></td>
                      <td>
                        <span style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)'
                        }} title={asset.clients.join(', ')}>
                          {asset.clients.length > 2 
                            ? `${asset.clients.slice(0, 2).join(', ')} +${asset.clients.length - 2}`
                            : asset.clients.join(', ')
                          }
                        </span>
                      </td>
                      <td>
                        <button className="collateral-btn-secondary">View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assets by Type Summary */}
      <div className="collateral-card">
        <div className="collateral-card-header">
          <h3 className="collateral-card-title">Assets Summary by Type</h3>
        </div>
        <div className="collateral-card-body">
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {Object.entries(assetsByType).map(([assetType, data]) => (
              <div className="kpi-card" key={assetType}>
                <div className="kpi-label">{assetType}</div>
                <div className="kpi-value">{data.amount.toLocaleString('en-US', { maximumFractionDigits: assetType === 'USDC' || assetType === 'USDT' ? 0 : 2 })}</div>
                <div className="kpi-description">${data.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
