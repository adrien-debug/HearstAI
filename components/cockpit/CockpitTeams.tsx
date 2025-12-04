'use client'

import { useEffect, useState, useRef } from 'react'
import { contractsAPI } from '@/lib/api'
import './Cockpit.css'

interface Team {
  name: string
  members: number
  department: string
  status: string
  userId: string
}

export default function CockpitTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch contracts to group by users (teams)
        const contractsResponse = await contractsAPI.getAll()

        let loadedContracts: any[] = []
        if (contractsResponse?.contracts && Array.isArray(contractsResponse.contracts)) {
          loadedContracts = contractsResponse.contracts
        } else if (Array.isArray(contractsResponse)) {
          loadedContracts = contractsResponse
        }

        // Group contracts by user to create teams
        const teamsMap = new Map<string, {
          user: any
          contracts: any[]
        }>()

        loadedContracts.forEach((contract) => {
          const user = contract.user || {}
          const userId = user.id?.toString() || 'unknown'
          const teamName = user.companyName || user.username || user.email || 'Unknown Team'

          if (!teamsMap.has(userId)) {
            teamsMap.set(userId, {
              user,
              contracts: [],
            })
          }

          teamsMap.get(userId)!.contracts.push(contract)
        })

        // Convert to teams
        const teamsData: Team[] = []
        teamsMap.forEach((teamData, userId) => {
          const hasActiveContracts = teamData.contracts.some(c => 
            c.status === 'ACTIVE' || c.status === 'active'
          )

          teamsData.push({
            name: teamData.user.companyName || teamData.user.username || teamData.user.email || 'Unknown',
            members: 1, // Simplified - would need actual team member count
            department: 'Operations', // Default department
            status: hasActiveContracts ? 'Active' : 'Inactive',
            userId,
          })
        })

        setTeams(teamsData.sort((a, b) => a.name.localeCompare(b.name)))
      } catch (err) {
        console.error('Failed to load teams data:', err)
        setTeams([])
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
        Loading teams data...
      </div>
    )
  }

  return (
    <div>
      {/* Teams Management Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Teams</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Members</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <tr key={team.userId}>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>{team.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{team.members}</td>
                      <td>{team.department}</td>
                      <td>
                        <span className={team.status === 'Active' ? 'cockpit-badge cockpit-badge-success' : 'cockpit-badge cockpit-badge-warning'}>
                          {team.status}
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
                      No teams yet. Create your first team!
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
