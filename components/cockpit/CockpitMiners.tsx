'use client'

import { useEffect, useState, useRef } from 'react'
import { cockpitAPI, contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Miner {
  id: string
  model: string
  hashrate: number
  power: number
  temperature: number
  status: string
  contractId: number
  customer: string
}

export default function CockpitMiners() {
  const [miners, setMiners] = useState<Miner[]>([])
  const [totalMiners, setTotalMiners] = useState(0)
  const [onlineMiners, setOnlineMiners] = useState(0)
  const [offlineMiners, setOfflineMiners] = useState(0)
  const [degradedMiners, setDegradedMiners] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch cockpit data for miner stats
        const [cockpitResponse, contractsResponse] = await Promise.all([
          cockpitAPI.getData(),
          contractsAPI.getAll(),
        ])

        // Get miner stats from cockpit data
        if (cockpitResponse?.data) {
          setTotalMiners(cockpitResponse.data.totalMiners || 0)
          setOnlineMiners(cockpitResponse.data.onlineMiners || 0)
          setOfflineMiners(cockpitResponse.data.offlineMiners || 0)
          setDegradedMiners(cockpitResponse.data.degradedMiners || 0)
        }

        // Process contracts to create miner list
        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Get hashrate data for each contract
        const minersData: Miner[] = []
        
        // Fetch recent hashrate to get actual performance
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        // For each contract, create miner entries
        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const customerName = user.companyName || user.username || user.email || 'Unknown'
          const machineModel = contract.machineModel || 'Unknown Model'
          const machineTH = Number(contract.machineTH) || 0
          const numberOfMachines = contract.numberOfMachines || 0
          const machineWatt = Number(contract.machineWatt) || 0

          // Create individual miner entries
          for (let i = 0; i < numberOfMachines; i++) {
            // Estimate hashrate per miner (divide total by number of machines)
            const estimatedHashrate = machineTH / numberOfMachines
            
            // Determine status based on contract status
            let status = 'OFFLINE'
            if (contract.status === 'ACTIVE' || contract.status === 'active') {
              // If contract is active, assume miners are online
              // In a real system, this would come from actual miner monitoring
              status = estimatedHashrate > 0 ? 'ONLINE' : 'OFFLINE'
            }

            minersData.push({
              id: `MINER-${contract.id}-${i + 1}`,
              model: machineModel,
              hashrate: estimatedHashrate,
              power: machineWatt,
              temperature: 0, // Not available in contract data
              status,
              contractId: contract.id,
              customer: customerName,
            })
          }
        })

        // Sort by status (online first), then by hashrate
        minersData.sort((a, b) => {
          if (a.status !== b.status) {
            const statusOrder = { 'ONLINE': 0, 'DEGRADED': 1, 'OFFLINE': 2 }
            return (statusOrder[a.status as keyof typeof statusOrder] || 2) - 
                   (statusOrder[b.status as keyof typeof statusOrder] || 2)
          }
          return b.hashrate - a.hashrate
        })

        setMiners(minersData)
      } catch (err) {
        console.error('Failed to load miners data:', err)
        setTotalMiners(0)
        setOnlineMiners(0)
        setOfflineMiners(0)
        setDegradedMiners(0)
        setMiners([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      hasLoadedRef.current = false
      loadData()
    }, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const formatHashrate = (th: number) => {
    if (th >= 1000) {
      return `${(th / 1000).toFixed(2)} PH/s`
    }
    return `${th.toFixed(1)} TH/s`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return '#9EFF00'
      case 'DEGRADED':
        return '#FFA500'
      case 'OFFLINE':
        return '#ff4d4d'
      default:
        return 'var(--text-secondary)'
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading miners data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Miners</div>
          <div className="kpi-value" style={{ color: totalMiners > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalMiners}
          </div>
          <div className="kpi-description">Fleet size</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Online</div>
          <div className="kpi-value" style={{ color: onlineMiners > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {onlineMiners}
          </div>
          <div className="kpi-description">Currently mining</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Degraded</div>
          <div className="kpi-value" style={{ color: degradedMiners > 0 ? '#FFA500' : 'var(--text-secondary)' }}>
            {degradedMiners}
          </div>
          <div className="kpi-description">Performance issues</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Offline</div>
          <div className="kpi-value" style={{ color: offlineMiners > 0 ? '#ff4d4d' : 'var(--text-secondary)' }}>
            {offlineMiners}
          </div>
          <div className="kpi-description">Requires attention</div>
        </div>
      </div>

      {/* Miners List Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Miners List</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Miner ID</th>
                  <th>Model</th>
                  <th>Customer</th>
                  <th>Hashrate</th>
                  <th>Power</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {miners.length > 0 ? (
                  miners.map((miner) => (
                    <tr key={miner.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{miner.id}</td>
                      <td>{miner.model}</td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{miner.customer}</td>
                      <td className="cockpit-value-green" style={{ fontFamily: 'var(--font-mono)' }}>
                        {miner.hashrate > 0 ? formatHashrate(miner.hashrate) : '0 TH/s'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {miner.power > 0 ? `${miner.power} W` : 'N/A'}
                      </td>
                      <td>
                        <span style={{ color: getStatusColor(miner.status) }}>
                          {miner.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No miners found
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
