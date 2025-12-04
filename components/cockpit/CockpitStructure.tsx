'use client'

import { useEffect, useState, useRef } from 'react'
import { contractsAPI } from '@/lib/api'
import './Cockpit.css'

export default function CockpitStructure() {
  const [teamsCount, setTeamsCount] = useState(0)
  const [departmentsCount, setDepartmentsCount] = useState(0)
  const [rolesCount, setRolesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch contracts to analyze organizational structure
        const contractsResponse = await contractsAPI.getAll()

        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Extract unique users (teams)
        const uniqueUsers = new Set<string>()
        const uniqueRoles = new Set<string>()
        const departments = new Set<string>()

        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const userId = user.id?.toString()
          
          if (userId) {
            uniqueUsers.add(userId)
          }

          if (user.role) {
            uniqueRoles.add(user.role)
          }

          // Default department based on user company
          const department = user.companyName ? 'Operations' : 'General'
          departments.add(department)
        })

        setTeamsCount(uniqueUsers.size)
        setDepartmentsCount(departments.size || 1) // At least 1 default department
        setRolesCount(uniqueRoles.size || 1) // At least 1 default role
      } catch (err) {
        console.error('Failed to load structure data:', err)
        setTeamsCount(0)
        setDepartmentsCount(0)
        setRolesCount(0)
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
        Loading organizational structure...
      </div>
    )
  }

  return (
    <div>
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Organizational Structure</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="kpi-card">
              <div className="kpi-label">Teams</div>
              <div className="kpi-value" style={{ color: teamsCount > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
                {teamsCount}
              </div>
              <div className="kpi-description">Manage organizational teams and hierarchy</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Departments</div>
              <div className="kpi-value" style={{ color: departmentsCount > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
                {departmentsCount}
              </div>
              <div className="kpi-description">Department structure and assignments</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Roles</div>
              <div className="kpi-value" style={{ color: rolesCount > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
                {rolesCount}
              </div>
              <div className="kpi-description">Role definitions and permissions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
