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
  responseTime?: number // Response time in minutes
  resolutionTime?: number // Resolution time in minutes
  slaTarget?: number // SLA target in minutes
  slaStatus?: 'MET' | 'WARNING' | 'BREACHED' // SLA compliance status
}

export default function CockpitIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [openIncidents, setOpenIncidents] = useState(0)
  const [resolved24h, setResolved24h] = useState(0)
  const [averageResolution, setAverageResolution] = useState(0)
  const [averageResponseTime, setAverageResponseTime] = useState(0)
  const [slaCompliance, setSlaCompliance] = useState(0) // SLA compliance percentage
  const [slaBreached, setSlaBreached] = useState(0) // Number of SLA breaches
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
          setAverageResponseTime(response.averageResponseTimeMinutes || 0)
          setSlaCompliance(response.slaCompliance || 0)
          setSlaBreached(response.slaBreached || 0)
          
          // Process incidents with SLA data
          const processedIncidents = (response.recentIncidents || []).map((incident: any) => {
            // Calculate response time (time from created to first response/acknowledgment)
            const created = new Date(incident.created)
            const responseTime = incident.responseTime 
              ? incident.responseTime 
              : incident.acknowledgedAt 
                ? Math.round((new Date(incident.acknowledgedAt).getTime() - created.getTime()) / (1000 * 60))
                : incident.resolved 
                  ? Math.round((new Date(incident.resolved).getTime() - created.getTime()) / (1000 * 60))
                  : null

            // Calculate resolution time
            const resolutionTime = incident.resolved 
              ? Math.round((new Date(incident.resolved).getTime() - created.getTime()) / (1000 * 60))
              : null

            // Determine SLA target based on severity
            const slaTarget = incident.severity?.toLowerCase() === 'critical' ? 60 // 1 hour for critical
              : incident.severity?.toLowerCase() === 'high' ? 240 // 4 hours for high
              : incident.severity?.toLowerCase() === 'medium' ? 480 // 8 hours for medium
              : 1440 // 24 hours for low

            // Determine SLA status
            let slaStatus: 'MET' | 'WARNING' | 'BREACHED' = 'MET'
            if (resolutionTime) {
              const timeToResolve = resolutionTime
              const warningThreshold = slaTarget * 0.8
              if (timeToResolve > slaTarget) {
                slaStatus = 'BREACHED'
              } else if (timeToResolve > warningThreshold) {
                slaStatus = 'WARNING'
              }
            } else if (responseTime) {
              const warningThreshold = slaTarget * 0.8
              if (responseTime > slaTarget) {
                slaStatus = 'BREACHED'
              } else if (responseTime > warningThreshold) {
                slaStatus = 'WARNING'
              }
            } else {
              // For open incidents, check if we're approaching SLA
              const timeSinceCreated = Math.round((Date.now() - created.getTime()) / (1000 * 60))
              const warningThreshold = slaTarget * 0.8
              if (timeSinceCreated > slaTarget) {
                slaStatus = 'BREACHED'
              } else if (timeSinceCreated > warningThreshold) {
                slaStatus = 'WARNING'
              }
            }

            return {
              ...incident,
              responseTime,
              resolutionTime,
              slaTarget,
              slaStatus,
            }
          })
          
          setIncidents(processedIncidents)
        }
      } catch (err) {
        console.error('Failed to load incidents data:', err)
        setOpenIncidents(0)
        setResolved24h(0)
        setAverageResolution(0)
        setAverageResponseTime(0)
        setSlaCompliance(0)
        setSlaBreached(0)
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
          <div className="kpi-label">SLA Compliance</div>
          <div className="kpi-value" style={{ 
            color: slaCompliance >= 95 ? '#9EFF00' : slaCompliance >= 90 ? '#FFA500' : '#ff4d4d' 
          }}>
            {slaCompliance.toFixed(1)}%
          </div>
          <div className="kpi-description">SLA compliance rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Response Time</div>
          <div className="kpi-value" style={{ color: averageResponseTime > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {averageResponseTime > 0 ? `${Math.round(averageResponseTime)}m` : '0m'}
          </div>
          <div className="kpi-description">Mean time to respond</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Resolution</div>
          <div className="kpi-value" style={{ color: averageResolution > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {averageResolution > 0 ? `${averageResolution}h` : '0h'}
          </div>
          <div className="kpi-description">Mean time to resolve</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SLA Breaches</div>
          <div className="kpi-value" style={{ color: slaBreached > 0 ? '#ff4d4d' : '#9EFF00' }}>
            {slaBreached}
          </div>
          <div className="kpi-description">Incidents exceeding SLA</div>
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
                  <th>Response Time</th>
                  <th>Resolution Time</th>
                  <th>SLA Status</th>
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
                      <td>
                        {incident.responseTime !== null && incident.responseTime !== undefined
                          ? `${incident.responseTime}m`
                          : incident.status === 'Open'
                            ? '-'
                            : 'N/A'}
                      </td>
                      <td>
                        {incident.resolutionTime !== null && incident.resolutionTime !== undefined
                          ? `${Math.round(incident.resolutionTime / 60)}h ${incident.resolutionTime % 60}m`
                          : incident.status === 'Open'
                            ? '-'
                            : 'N/A'}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: 'var(--text-xs)',
                            background:
                              incident.slaStatus === 'BREACHED'
                                ? 'rgba(255, 77, 77, 0.2)'
                                : incident.slaStatus === 'WARNING'
                                  ? 'rgba(255, 165, 0, 0.2)'
                                  : 'rgba(158, 255, 0, 0.2)',
                            color:
                              incident.slaStatus === 'BREACHED'
                                ? '#ff4d4d'
                                : incident.slaStatus === 'WARNING'
                                  ? '#FFA500'
                                  : '#9EFF00',
                          }}
                        >
                          {incident.slaStatus || 'MET'}
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
                    <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
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
