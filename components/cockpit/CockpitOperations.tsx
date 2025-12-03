'use client'

import { useEffect, useState, useRef } from 'react'
import { eventsAPI, jobsAPI } from '@/lib/api'
import './Cockpit.css'

interface Operation {
  id: string
  type: string
  status: string
  startTime: string
  duration: string
  result: string
  description?: string
}

export default function CockpitOperations() {
  const [operations, setOperations] = useState<Operation[]>([])
  const [activeOperations, setActiveOperations] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)
  const [successRate, setSuccessRate] = useState(0)
  const [averageDuration, setAverageDuration] = useState(0)
  const [loading, setLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const loadData = async () => {
      try {
        setLoading(true)

        // Fetch events (MAINTENANCE, UPDATE, etc.) and jobs
        const [eventsResponse, jobsResponse] = await Promise.all([
          eventsAPI.getAll(undefined, undefined, undefined, undefined, 50),
          jobsAPI.getAll(),
        ])

        // Process events
        let loadedEvents: any[] = []
        if (eventsResponse?.events && Array.isArray(eventsResponse.events)) {
          loadedEvents = eventsResponse.events
        } else if (Array.isArray(eventsResponse)) {
          loadedEvents = eventsResponse
        }

        // Process jobs
        let loadedJobs: any[] = []
        if (jobsResponse?.jobs && Array.isArray(jobsResponse.jobs)) {
          loadedJobs = jobsResponse.jobs
        } else if (Array.isArray(jobsResponse)) {
          loadedJobs = jobsResponse
        }

        // Combine events and jobs into operations
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const allOperations: Operation[] = []
        let activeCount = 0
        let completedTodayCount = 0
        let successCount = 0
        let totalDuration = 0
        let completedCount = 0

        // Process events as operations
        loadedEvents.forEach((event) => {
          const eventDate = event.createdAt instanceof Date ? event.createdAt : new Date(event.createdAt)
          const isToday = eventDate >= today
          const isActive = event.type === 'Maintenance' || event.type === 'Update'
          
          if (isActive) activeCount++
          if (isToday && !isActive) completedTodayCount++

          allOperations.push({
            id: `EVT-${event.id}`,
            type: event.type || 'Operation',
            status: isActive ? 'In Progress' : 'Completed',
            startTime: eventDate.toISOString(),
            duration: isActive ? 'Ongoing' : 'N/A',
            result: isActive ? 'Processing' : 'Success',
            description: event.description,
          })
        })

        // Process jobs as operations
        loadedJobs.forEach((job) => {
          const jobDate = job.createdAt instanceof Date ? job.createdAt : new Date(job.createdAt)
          const isToday = jobDate >= today
          const isRunning = job.status === 'running' || job.status === 'RUNNING'
          const isCompleted = job.status === 'success' || job.status === 'SUCCESS' || job.status === 'completed'
          const isFailed = job.status === 'failed' || job.status === 'FAILED'
          
          if (isRunning) activeCount++
          if (isToday && isCompleted) {
            completedTodayCount++
            successCount++
          }
          if (isToday && isFailed) completedTodayCount++

          const duration = job.durationSeconds 
            ? `${Math.floor(job.durationSeconds / 60)} min`
            : isRunning ? 'Ongoing' : 'N/A'
          
          if (job.durationSeconds) {
            totalDuration += job.durationSeconds
            completedCount++
          }

          allOperations.push({
            id: `JOB-${job.id}`,
            type: 'Job Execution',
            status: isRunning ? 'In Progress' : (isCompleted ? 'Completed' : isFailed ? 'Failed' : 'Pending'),
            startTime: job.startedAt || job.createdAt,
            duration,
            result: isCompleted ? 'Success' : isFailed ? 'Failed' : isRunning ? 'Processing' : 'Pending',
            description: job.name || job.description,
          })
        })

        // Sort by start time (most recent first)
        allOperations.sort((a, b) => {
          const dateA = new Date(a.startTime).getTime()
          const dateB = new Date(b.startTime).getTime()
          return dateB - dateA
        })

        // Calculate success rate (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const recentJobs = loadedJobs.filter((job) => {
          const jobDate = job.createdAt instanceof Date ? job.createdAt : new Date(job.createdAt)
          return jobDate >= thirtyDaysAgo
        })
        const recentCompleted = recentJobs.filter(j => 
          j.status === 'success' || j.status === 'SUCCESS' || j.status === 'completed'
        )
        const recentFailed = recentJobs.filter(j => 
          j.status === 'failed' || j.status === 'FAILED'
        )
        const totalRecent = recentCompleted.length + recentFailed.length
        const calculatedSuccessRate = totalRecent > 0 
          ? (recentCompleted.length / totalRecent) * 100 
          : 0

        // Calculate average duration
        const avgDuration = completedCount > 0 
          ? Math.round(totalDuration / completedCount / 60) 
          : 0

        setActiveOperations(activeCount)
        setCompletedToday(completedTodayCount)
        setSuccessRate(calculatedSuccessRate)
        setAverageDuration(avgDuration)
        setOperations(allOperations.slice(0, 20)) // Show last 20 operations
      } catch (err) {
        console.error('Failed to load operations data:', err)
        setActiveOperations(0)
        setCompletedToday(0)
        setSuccessRate(0)
        setAverageDuration(0)
        setOperations([])
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
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    if (status === 'Completed' || status === 'Success') {
      return <span className="cockpit-badge cockpit-badge-success">Completed</span>
    } else if (status === 'In Progress' || status === 'Processing') {
      return <span className="cockpit-badge cockpit-badge-warning">In Progress</span>
    } else if (status === 'Failed') {
      return <span className="cockpit-badge" style={{ background: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d' }}>Failed</span>
    }
    return <span className="cockpit-badge cockpit-badge-warning">{status}</span>
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading operations data...
      </div>
    )
  }

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Active Operations</div>
          <div className="kpi-value" style={{ color: activeOperations > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {activeOperations}
          </div>
          <div className="kpi-description">Currently running</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed Today</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: completedToday > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {completedToday}
          </div>
          <div className="kpi-description">Operations completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Success Rate</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: successRate > 90 ? '#9EFF00' : successRate > 70 ? '#FFA500' : 'var(--text-secondary)' }}>
            {successRate.toFixed(1)}%
          </div>
          <div className="kpi-description">Last 30 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Duration</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)', color: averageDuration > 0 ? '#9EFF00' : 'var(--text-secondary)' }}>
            {averageDuration > 0 ? `${averageDuration} min` : '0 min'}
          </div>
          <div className="kpi-description">Per operation</div>
        </div>
      </div>

      {/* Operations Table */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <div className="cockpit-card-title">Recent Operations</div>
          <button className="cockpit-btn-secondary">View All</button>
        </div>
        <div className="cockpit-table-container">
          <table className="cockpit-table">
            <thead>
              <tr>
                <th>Operation ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {operations.length > 0 ? (
                operations.map((op) => (
                  <tr key={op.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{op.id}</td>
                    <td>{op.type}</td>
                    <td>{getStatusBadge(op.status)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(op.startTime)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{op.duration}</td>
                    <td style={{ 
                      color: op.result === 'Success' ? '#C5FFA7' : op.result === 'Failed' ? '#ff4d4d' : '#FFA500',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {op.result}
                    </td>
                    <td>
                      <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                    No operations recorded
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


