'use client'

import { useEffect, useState } from 'react'
import { collateralAPI, customersAPI } from '@/lib/api'
import AddClientModal from './AddClientModal'
import ClientDetailModal from './ClientDetailModal'
import { computeClientMetrics, computeGlobalMetrics } from './collateralUtils'
import type { Client } from './collateralUtils'
import './Collateral.css'

export default function CollateralClients() {
  const [customers, setCustomers] = useState<any[]>([])
  const [collateralData, setCollateralData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const loadData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      // Charger les clients depuis la base de données avec refresh DeBank
      let customersResponse
      try {
        customersResponse = await customersAPI.getAll()
        const loadedCustomers = customersResponse.customers || []
        setCustomers(loadedCustomers)
        
        // Charger les données collatérales depuis DeBank
        // Utiliser les wallets des customers chargés
        try {
          const customerWallets = loadedCustomers.map((c: any) => c.erc20Address).filter(Boolean)
          if (customerWallets.length > 0) {
            const collateralResponse = await collateralAPI.getAll(
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
            setCollateralData(collateralResponse)
          } else {
            setCollateralData({ clients: [] })
          }
        } catch (collateralErr) {
          console.error('Error loading collateral data:', collateralErr)
          setCollateralData({ clients: [] })
        }
      } catch (customerErr) {
        console.error('Error loading customers:', customerErr)
        setCustomers([])
        setCollateralData({ clients: [] })
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => loadData(true), 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading clients...
      </div>
    )
  }

  // Fonction pour trouver les données collatérales d'un client
  const getCollateralData = (customer: any): Client | undefined => {
    const erc20Address = customer.erc20Address || customer.id
    return collateralData?.clients?.find((c: Client) => 
      c.id === erc20Address || c.id?.toLowerCase() === erc20Address?.toLowerCase()
    )
  }

  // Calculer les statistiques globales avec les utilitaires partagés
  const collateralClients: Client[] = collateralData?.clients || []
  const globalMetrics = computeGlobalMetrics(collateralClients)
  const totalClients = customers.length
  const clientsWithPositions = customers.filter(c => {
    const collateral = getCollateralData(c)
    return collateral && collateral.positions && collateral.positions.length > 0
  }).length
  const totalCollateral = globalMetrics.totalCollateral
  const totalDebt = globalMetrics.totalDebt

  return (
    <div>
      {/* Summary KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Clients</div>
          <div className="kpi-value">{totalClients}</div>
          <div className="kpi-description">All registered clients</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Clients</div>
          <div className="kpi-value">{clientsWithPositions}</div>
          <div className="kpi-description">Clients with positions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Collateral</div>
          <div className="kpi-value">${(totalCollateral / 1000000).toFixed(2)}M</div>
          <div className="kpi-description">All clients collateral</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Debt</div>
          <div className="kpi-value">${(totalDebt / 1000).toFixed(0)}K</div>
          <div className="kpi-description">All clients debt</div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="collateral-card">
        <div className="collateral-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="collateral-card-title">Clients List</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="collateral-btn-secondary" 
              onClick={() => loadData(true)}
              disabled={refreshing}
            >
              {refreshing ? '🔄 Actualisation...' : '🔄 Actualiser'}
            </button>
            <button 
              className="collateral-btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              + Ajouter un client
            </button>
          </div>
        </div>
        <div className="collateral-card-body">
          <div className="collateral-table-container">
            <table className="collateral-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tag</th>
                  <th>ERC20 Address</th>
                  <th>Chains</th>
                  <th>Protocols</th>
                  <th>Total Collateral</th>
                  <th>Total Debt</th>
                  <th>Health Factor</th>
                  <th>Positions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => {
                    const collateral = getCollateralData(customer)
                    const metrics = collateral ? computeClientMetrics(collateral) : null
                    const positionsCount = collateral?.positions?.length || 0
                    
                    // Parser les chains et protocols
                    let chains: string[] = []
                    let protocols: string[] = []
                    try {
                      chains = customer.chains ? JSON.parse(customer.chains) : []
                      protocols = customer.protocols ? JSON.parse(customer.protocols) : []
                    } catch (e) {
                      // Si le parsing échoue, utiliser les valeurs par défaut
                      chains = ['eth']
                    }
                    
                    const erc20Address = customer.erc20Address || customer.id || 'N/A'
                    const truncatedAddress = erc20Address.length > 20 
                      ? `${erc20Address.slice(0, 10)}...${erc20Address.slice(-8)}`
                      : erc20Address

                    return (
                      <tr key={customer.id}>
                        <td><strong>{customer.name || 'N/A'}</strong></td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            background: 'rgba(197, 255, 167, 0.1)', 
                            borderRadius: '4px', 
                            fontSize: 'var(--text-xs)',
                            color: '#C5FFA7'
                          }}>
                            {customer.tag || 'Client'}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary)'
                          }} title={erc20Address}>
                            {truncatedAddress}
                          </span>
                        </td>
                        <td>
                          {chains.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {chains.map((chain: string, idx: number) => (
                                <span key={idx} style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  fontSize: 'var(--text-xs)',
                                  textTransform: 'capitalize'
                                }}>
                                  {chain}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
                          )}
                        </td>
                        <td>
                          {protocols.length > 0 ? (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {protocols.map((protocol: string, idx: number) => (
                                <span key={idx} style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(197, 255, 167, 0.1)',
                                  color: '#C5FFA7',
                                  fontSize: 'var(--text-xs)',
                                  textTransform: 'capitalize'
                                }}>
                                  {protocol}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
                          )}
                        </td>
                        <td className={metrics && metrics.totalCollateralUsd > 0 ? 'collateral-value-green' : 'var(--text-secondary)'}>
                          {metrics ? `$${metrics.totalCollateralUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '$0'}
                        </td>
                        <td style={{ color: metrics && metrics.totalDebtUsd > 0 ? '#ff4d4d' : 'var(--text-secondary)' }}>
                          {metrics ? `$${metrics.totalDebtUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '$0'}
                        </td>
                        <td style={{ 
                          color: metrics && metrics.healthFactor >= 2 ? '#C5FFA7' : metrics && metrics.healthFactor >= 1.5 ? '#FFA500' : 'var(--text-secondary)',
                          fontWeight: metrics ? 'var(--font-semibold)' : 'normal'
                        }}>
                          {metrics ? metrics.healthFactor.toFixed(2) : 'N/A'}
                        </td>
                        <td>{positionsCount}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: 'var(--text-xs)',
                            background: positionsCount > 0 
                              ? 'rgba(197, 255, 167, 0.2)' 
                              : 'rgba(255, 255, 255, 0.05)',
                            color: positionsCount > 0 ? '#C5FFA7' : 'var(--text-secondary)'
                          }}>
                            {positionsCount > 0 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="collateral-btn-secondary"
                            onClick={() => {
                              window.location.href = `/collateral/${customer.id}`
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No clients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un client */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadData(true)
        }}
      />

      {/* Modal pour voir les détails d'un client */}
      <ClientDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedCustomer(null)
        }}
        customer={selectedCustomer}
      />
    </div>
  )
}

