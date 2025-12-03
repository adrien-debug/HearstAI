'use client'

import { useEffect, useState, useRef } from 'react'
import { contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Batch {
  id: string
  customer: string
  machines: number
  status: string
  startDate: string
  progress: number
  contractId: number
}

export default function CockpitCustomerBatch() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [totalBatches, setTotalBatches] = useState(0)
  const [activeBatches, setActiveBatches] = useState(0)
  const [totalMachines, setTotalMachines] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch all contracts
        const contractsResponse = await contractsAPI.getAll()
        
        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Group contracts by user/customer to create batches
        const batchesMap = new Map<string, {
          customer: string
          contracts: any[]
          totalMachines: number
          activeContracts: number
        }>()

        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const userId = user.id?.toString() || 'unknown'
          const customerName = user.companyName || user.username || user.email || 'Unknown Customer'

          if (!batchesMap.has(userId)) {
            batchesMap.set(userId, {
              customer: customerName,
              contracts: [],
              totalMachines: 0,
              activeContracts: 0,
            })
          }

          const batch = batchesMap.get(userId)!
          batch.contracts.push(contract)
          batch.totalMachines += contract.numberOfMachines || 0
          if (contract.status === 'ACTIVE' || contract.status === 'active') {
            batch.activeContracts++
          }
        })

        // Convert to batch format
        const batchesData: Batch[] = []
        let totalMachinesCount = 0
        let activeBatchesCount = 0
        let totalProgress = 0

        batchesMap.forEach((batchData, userId) => {
          const isActive = batchData.activeContracts > 0
          if (isActive) activeBatchesCount++
          
          // Calculate progress based on active contracts vs total contracts
          const progress = batchData.contracts.length > 0
            ? Math.round((batchData.activeContracts / batchData.contracts.length) * 100)
            : 0
          
          totalProgress += progress
          totalMachinesCount += batchData.totalMachines

          // Get earliest contract date as start date
          const earliestContract = batchData.contracts.reduce((earliest, contract) => {
            const contractDate = contract.contractStartingDate || contract.createdAt || contract.plugDate
            if (!contractDate) return earliest
            const date = contractDate instanceof Date ? contractDate : new Date(contractDate)
            if (!earliest || date < earliest) return date
            return earliest
          }, null as Date | null)

          batchesData.push({
            id: `BATCH-${userId}`,
            customer: batchData.customer,
            machines: batchData.totalMachines,
            status: isActive ? 'active' : 'pending',
            startDate: earliestContract 
              ? earliestContract.toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
            progress,
            contractId: batchData.contracts[0]?.id || 0,
          })
        })

        // Calculate average completion rate
        const avgCompletionRate = batchesData.length > 0
          ? Math.round(totalProgress / batchesData.length)
          : 0

        setTotalBatches(batchesData.length)
        setActiveBatches(activeBatchesCount)
        setTotalMachines(totalMachinesCount)
        setCompletionRate(avgCompletionRate)
        setBatches(batchesData.sort((a, b) => {
          // Sort by status (active first), then by machines
          if (a.status !== b.status) {
            return a.status === 'active' ? -1 : 1
          }
          return b.machines - a.machines
        }))
      } catch (err) {
        console.error('Failed to load customer batch data:', err)
        setTotalBatches(0)
        setActiveBatches(0)
        setTotalMachines(0)
        setCompletionRate(0)
        setBatches([])
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
        Loading customer batch data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Batches</div>
          <div className="kpi-value" style={{ color: totalBatches > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalBatches}
          </div>
          <div className="kpi-description">All batches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Batches</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: activeBatches > 0 ? '#C5FFA7' : 'var(--text-secondary)' }}>
            {activeBatches}
          </div>
          <div className="kpi-description">Currently running</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Machines</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: totalMachines > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalMachines}
          </div>
          <div className="kpi-description">In all batches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completion Rate</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: completionRate > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {completionRate}%
          </div>
          <div className="kpi-description">Average progress</div>
        </div>
      </div>

      {/* Customer Batches Table */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <div className="cockpit-card-title">Customer Batches</div>
          <button className="cockpit-btn">Create Batch</button>
        </div>
        <div className="cockpit-table-container">
          <table className="cockpit-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Customer</th>
                <th>Machines</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{batch.id}</td>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{batch.customer}</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{batch.machines}</td>
                    <td>
                      {batch.status === 'active' && (
                        <span className="cockpit-badge cockpit-badge-success">Active</span>
                      )}
                      {batch.status === 'pending' && (
                        <span className="cockpit-badge cockpit-badge-warning">Pending</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{batch.startDate}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${batch.progress}%`, background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                        <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', minWidth: '40px' }}>{batch.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="cockpit-btn-secondary" 
                        style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                        onClick={() => {
                          window.location.href = `/collateral/${batch.contractId}`
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                    No customer batches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


