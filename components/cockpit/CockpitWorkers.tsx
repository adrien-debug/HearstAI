'use client'

import { useEffect, useState, useRef } from 'react'
import { contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Worker {
  name: string
  role: string
  team: string
  status: string
  userId: string
}

export default function CockpitWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [totalWorkers, setTotalWorkers] = useState(0)
  const [onDuty, setOnDuty] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch contracts to get users (workers)
        const contractsResponse = await contractsAPI.getAll()

        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Extract unique users from contracts
        const workersMap = new Map<string, {
          user: any
          hasActiveContracts: boolean
        }>()

        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const userId = user.id?.toString() || 'unknown'

          if (!workersMap.has(userId)) {
            workersMap.set(userId, {
              user,
              hasActiveContracts: false,
            })
          }

          if (contract.status === 'ACTIVE' || contract.status === 'active') {
            workersMap.get(userId)!.hasActiveContracts = true
          }
        })

        // Convert to workers
        const workersData: Worker[] = []
        let onDutyCount = 0

        workersMap.forEach((workerData, userId) => {
          if (workerData.hasActiveContracts) onDutyCount++

          workersData.push({
            name: workerData.user.companyName || workerData.user.username || workerData.user.email || 'Unknown',
            role: workerData.user.role || 'Operator',
            team: workerData.user.companyName || 'Operations',
            status: workerData.hasActiveContracts ? 'On Duty' : 'Off Duty',
            userId,
          })
        })

        setWorkers(workersData.sort((a, b) => a.name.localeCompare(b.name)))
        setTotalWorkers(workersData.length)
        setOnDuty(onDutyCount)
      } catch (err) {
        console.error('Failed to load workers data:', err)
        setWorkers([])
        setTotalWorkers(0)
        setOnDuty(0)
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
        Loading workers data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Workers</div>
          <div className="kpi-value" style={{ color: totalWorkers > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalWorkers}
          </div>
          <div className="kpi-description">Active workers</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">On Duty</div>
          <div className="kpi-value" style={{ color: onDuty > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {onDuty}
          </div>
          <div className="kpi-description">Currently working</div>
        </div>
      </div>

      {/* Workers List Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Workers List</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.length > 0 ? (
                  workers.map((worker) => (
                    <tr key={worker.userId}>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>{worker.name}</td>
                      <td>{worker.role}</td>
                      <td>{worker.team}</td>
                      <td>
                        <span className={worker.status === 'On Duty' ? 'cockpit-badge cockpit-badge-success' : 'cockpit-badge cockpit-badge-warning'}>
                          {worker.status}
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
                      No workers registered yet
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
