'use client'

import { useEffect, useState, useRef } from 'react'
import { customersAPI, contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Client {
  id: string
  name?: string
  email?: string
  companyName?: string
  contact?: string
  status: string
  contractCount: number
}

export default function CockpitClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch customers and contracts in parallel
        const [customersResponse, contractsResponse] = await Promise.all([
          customersAPI.getAll(),
          contractsAPI.getActive(),
        ])

        // Handle contracts response first (this is the primary source)
        let loadedContracts: any[] = []
        if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        } else if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (contractsResponse?.data && Array.isArray(contractsResponse.data)) {
          loadedContracts = contractsResponse.data
        }

        setContracts(loadedContracts)

        // Group contracts by user
        const contractsByUser = new Map<string, { contracts: any[], user: any }>()
        loadedContracts.forEach((contract) => {
          const userId = contract.userId?.toString() || contract.user?.id?.toString() || 'unknown'
          const user = contract.user || {}
          
          if (!contractsByUser.has(userId)) {
            contractsByUser.set(userId, { contracts: [], user })
          }
          contractsByUser.get(userId)!.contracts.push(contract)
        })

        // Build clients list from users who have contracts
        const clientsData: Client[] = []
        contractsByUser.forEach(({ contracts: userContracts, user }, userId) => {
          clientsData.push({
            id: userId,
            name: user.companyName || user.username || user.email || 'Unknown',
            email: user.email || '',
            companyName: user.companyName || '',
            contact: user.email || 'N/A',
            status: userContracts.length > 0 ? 'Active' : 'Inactive',
            contractCount: userContracts.length,
          })
        })

        // Also include customers that might not have contracts yet
        let loadedCustomers: any[] = []
        if (Array.isArray(customersResponse)) {
          loadedCustomers = customersResponse
        } else if (customersResponse?.customers && Array.isArray(customersResponse.customers)) {
          loadedCustomers = customersResponse.customers
        } else if (customersResponse?.data && Array.isArray(customersResponse.data)) {
          loadedCustomers = customersResponse.data
        }

        // Add customers that aren't already in the list
        loadedCustomers.forEach((customer) => {
          const customerId = customer.id?.toString() || 'unknown'
          const existingClient = clientsData.find(c => c.id === customerId)
          
          if (!existingClient) {
            clientsData.push({
              id: customerId,
              name: customer.name || 'Unknown',
              email: customer.email || '',
              companyName: customer.name || '',
              contact: customer.email || 'N/A',
              status: 'Inactive',
              contractCount: 0,
            })
          }
        })

        setClients(clientsData)
      } catch (err) {
        console.error('Failed to load clients data:', err)
        setClients([])
        setContracts([])
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

  const totalClients = clients.length
  const activeContracts = contracts.length
  const activeClients = clients.filter(c => c.status === 'Active').length

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading clients data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Clients</div>
          <div className="kpi-value" style={{ color: totalClients > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {totalClients}
          </div>
          <div className="kpi-description">Active clients: {activeClients}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Contracts</div>
          <div className="kpi-value" style={{ color: activeContracts > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {activeContracts}
          </div>
          <div className="kpi-description">Current contracts</div>
        </div>
      </div>

      {/* Clients List Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Clients List</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Contracts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.name}</strong>
                        {client.companyName && client.companyName !== client.name && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {client.companyName}
                          </div>
                        )}
                      </td>
                      <td>{client.contact}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            background:
                              client.status === 'Active'
                                ? 'rgba(158, 255, 0, 0.2)'
                                : 'rgba(255, 255, 255, 0.05)',
                            color: client.status === 'Active' ? '#9EFF00' : 'var(--text-secondary)',
                          }}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td>{client.contractCount}</td>
                      <td>
                        <button
                          className="cockpit-btn-secondary"
                          onClick={() => {
                            // Navigate to client details or contract view
                            window.location.href = `/collateral/${client.id}`
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No clients yet. Add your first client!
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
