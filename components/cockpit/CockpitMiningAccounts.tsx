'use client'

import { useEffect, useState, useRef } from 'react'
import { contractsAPI, cockpitAPI } from '@/lib/api'
import './Cockpit.css'

interface MiningAccount {
  account: string
  minerType: string
  realtimeHashrate: number
  last24h: number
  activeMiners: number
  status: string
  contractId: number
}

export default function CockpitMiningAccounts() {
  const [accounts, setAccounts] = useState<MiningAccount[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch contracts and cockpit data
        const [contractsResponse, cockpitResponse] = await Promise.all([
          contractsAPI.getAll(),
          cockpitAPI.getData().catch(() => null),
        ])

        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Get global hashrate for calculations
        const globalHashrate = cockpitResponse?.data?.globalHashrate || 0

        // Group contracts by user to create mining accounts
        const accountsMap = new Map<string, {
          user: any
          contracts: any[]
          totalMachines: number
          activeMachines: number
        }>()

        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const userId = user.id?.toString() || 'unknown'
          const accountName = user.companyName || user.username || user.email || 'Unknown Account'

          if (!accountsMap.has(userId)) {
            accountsMap.set(userId, {
              user,
              contracts: [],
              totalMachines: 0,
              activeMachines: 0,
            })
          }

          const account = accountsMap.get(userId)!
          account.contracts.push(contract)
          account.totalMachines += contract.numberOfMachines || 0
          if (contract.status === 'ACTIVE' || contract.status === 'active') {
            account.activeMachines += contract.numberOfMachines || 0
          }
        })

        // Convert to mining accounts
        const accountsData: MiningAccount[] = []
        const totalMachines = Array.from(accountsMap.values()).reduce((sum, acc) => sum + acc.totalMachines, 0)

        accountsMap.forEach((accountData, userId) => {
          // Calculate hashrate for this account (proportional to machines)
          const accountHashrate = totalMachines > 0
            ? (globalHashrate * accountData.totalMachines) / totalMachines
            : 0

          // Get miner type from contracts (most common)
          const minerTypes = accountData.contracts.map(c => c.machineModel || 'Unknown').filter(Boolean)
          const mostCommonMinerType = minerTypes.length > 0
            ? minerTypes.reduce((a, b, _, arr) => 
                arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
              )
            : 'Unknown'

          accountsData.push({
            account: accountData.user.companyName || accountData.user.username || accountData.user.email || 'Unknown',
            minerType: mostCommonMinerType,
            realtimeHashrate: accountHashrate,
            last24h: accountHashrate, // Simplified - would need actual 24h data
            activeMiners: accountData.activeMachines,
            status: accountData.activeMachines > 0 ? 'Active' : 'Inactive',
            contractId: accountData.contracts[0]?.id || 0,
          })
        })

        setAccounts(accountsData.sort((a, b) => b.realtimeHashrate - a.realtimeHashrate))
      } catch (err) {
        console.error('Failed to load mining accounts data:', err)
        setAccounts([])
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

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading mining accounts data...
      </div>
    )
  }

  return (
    <div>
      {/* Mining Accounts Summary Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Mining Accounts Summary</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Miner Type</th>
                  <th>Real-time Hashrate</th>
                  <th>Last 24h</th>
                  <th>Active Miners</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.map((account, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>{account.account}</td>
                      <td>{account.minerType}</td>
                      <td className="cockpit-value-green" style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatHashrate(account.realtimeHashrate)}
                      </td>
                      <td className="cockpit-value-green" style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatHashrate(account.last24h)}
                      </td>
                      <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>
                        {account.activeMiners}
                      </td>
                      <td>
                        <span className={account.status === 'Active' ? 'cockpit-badge cockpit-badge-success' : 'cockpit-badge cockpit-badge-warning'}>
                          {account.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No mining accounts configured yet
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
