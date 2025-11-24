'use client'

import { useEffect, useState } from 'react'
import { collateralAPI } from '@/lib/api'
import './Collateral.css'

export default function CollateralAssets() {
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
        Loading assets...
      </div>
    )
  }

  // Collecter tous les assets de tous les clients
  const allAssets: any[] = []
  const clients = data?.clients || []
  
  clients.forEach((client: any) => {
    client.positions?.forEach((pos: any) => {
      if (pos.collateralAmount > 0) {
        const existingAsset = allAssets.find(
          (a) => a.asset === pos.asset && a.protocol === pos.protocol && a.chain === pos.chain
        )
        
        if (existingAsset) {
          existingAsset.amount += pos.collateralAmount
          existingAsset.totalValue += pos.collateralAmount * (pos.collateralPriceUsd || 0)
          existingAsset.clients.push(client.name)
        } else {
          allAssets.push({
            asset: pos.asset || 'UNKNOWN',
            protocol: pos.protocol || 'Unknown',
            chain: pos.chain || 'unknown',
            amount: pos.collateralAmount,
            priceUsd: pos.collateralPriceUsd || 0,
            totalValue: pos.collateralAmount * (pos.collateralPriceUsd || 0),
            clients: [client.name],
          })
        }
      }
    })
  })

  // Trier par valeur totale (décroissant)
  allAssets.sort((a, b) => b.totalValue - a.totalValue)

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
                      <td>{asset.clients.join(', ')}</td>
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
