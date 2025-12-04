'use client'

import { useEffect, useState, useRef } from 'react'
import { hostersService } from '@/services/hostersService'
import { contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Hoster {
  id: number
  name: string
  country: string
  capacity_mw?: number
  status?: string
}

export default function CockpitHosters() {
  const [hosters, setHosters] = useState<Hoster[]>([])
  const [totalProviders, setTotalProviders] = useState(0)
  const [totalCapacity, setTotalCapacity] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch hosters and contracts to calculate miners per hoster
        const [hostersData, contractsResponse] = await Promise.all([
          hostersService.getAll().catch(() => []),
          contractsAPI.getAll().catch(() => ({ contracts: [] })),
        ])

        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Process hosters data
        const processedHosters: Hoster[] = Array.isArray(hostersData) ? hostersData.map((h: any) => ({
          id: h.id,
          name: h.name || h.provider_name || 'Unknown Provider',
          country: h.country || h.location || 'Unknown',
          capacity_mw: h.capacity_mw || h.capacity || 0,
          status: h.status || 'active',
        })) : []

        // Calculate total capacity
        const capacity = processedHosters.reduce((sum, h) => sum + (h.capacity_mw || 0), 0)

        setHosters(processedHosters)
        setTotalProviders(processedHosters.length)
        setTotalCapacity(capacity)
      } catch (err) {
        console.error('Failed to load hosters data:', err)
        setHosters([])
        setTotalProviders(0)
        setTotalCapacity(0)
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

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading hosters data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Providers</div>
          <div className="kpi-value" style={{ color: totalProviders > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalProviders}
          </div>
          <div className="kpi-description">Active providers</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Capacity</div>
          <div className="kpi-value" style={{ color: totalCapacity > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalCapacity.toFixed(2)} MW
          </div>
          <div className="kpi-description">Combined capacity</div>
        </div>
      </div>

      {/* Hosting Providers Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Hosting Providers</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hosters.length > 0 ? (
                  hosters.map((hoster) => (
                    <tr key={hoster.id}>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>{hoster.name}</td>
                      <td>{hoster.country}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#C5FFA7' }}>
                        {hoster.capacity_mw ? `${hoster.capacity_mw.toFixed(2)} MW` : 'N/A'}
                      </td>
                      <td>
                        <span className={hoster.status === 'active' ? 'cockpit-badge cockpit-badge-success' : 'cockpit-badge cockpit-badge-warning'}>
                          {hoster.status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No hosting providers configured yet
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
