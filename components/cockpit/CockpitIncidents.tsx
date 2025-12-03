'use client'

import { useEffect, useState, useRef } from 'react'
import { cockpitAPI } from '@/lib/api'
import './Cockpit.css'

interface Incident {
  id: number
  type: string
  severity: string
  status: string
  created: string
  resolved: string | null
  description: string
  user: { id: number; name: string } | null
}

export default function CockpitIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [openIncidents, setOpenIncidents] = useState(0)
  const [resolved24h, setResolved24h] = useState(0)
  const [averageResolution, setAverageResolution] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)
        const response = await cockpitAPI.getIncidents()
        
        if (response) {
          setOpenIncidents(response.openIncidents || 0)
          setResolved24h(response.resolved24h || 0)
          setAverageResolution(response.averageResolutionHours || 0)
          setIncidents(response.recentIncidents || [])
        }
      } catch (err) {
        console.error('Failed to load incidents data:', err)
        setOpenIncidents(0)
        setResolved24h(0)
        setAverageResolution(0)
        setIncidents([])
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#ff4d4d'
      case 'high':
        return '#ff9500'
      case 'medium':
        return '#ffa500'
      case 'low':
        return '#9EFF00'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Open' ? '#ff4d4d' : '#9EFF00'
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading incidents data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Open Incidents</div>
          <div className="kpi-value" style={{ color: openIncidents > 0 ? '#ff4d4d' : '#9EFF00' }}>
            {openIncidents}
          </div>
          <div className="kpi-description">Active incidents</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Resolved (24h)</div>
          <div className="kpi-value" style={{ color: resolved24h > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {resolved24h}
          </div>
          <div className="kpi-description">Last 24 hours</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Resolution</div>
          <div className="kpi-value" style={{ color: averageResolution > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {averageResolution > 0 ? `${averageResolution}h` : '0h'}
          </div>
          <div className="kpi-description">Mean time to resolve</div>
        </div>
      </div>

      {/* Recent Incidents Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Recent Incidents</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length > 0 ? (
                  incidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>
                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                          #{incident.id}
                        </strong>
                      </td>
                      <td>{incident.type}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            background: `${getSeverityColor(incident.severity)}20`,
                            color: getSeverityColor(incident.severity),
                          }}
                        >
                          {incident.severity}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            background:
                              incident.status === 'Open'
                                ? 'rgba(255, 77, 77, 0.2)'
                                : 'rgba(158, 255, 0, 0.2)',
                            color: getStatusColor(incident.status),
                          }}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td>{formatDate(incident.created)}</td>
                      <td>
                        {incident.resolved ? formatDate(incident.resolved) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No incidents recorded
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
