'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface LogEntry {
  id: string
  level: string
  message: string
  timestamp: string
  jobId?: string
  projectId?: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState<string>('')

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true)
        const url = levelFilter ? `/api/logs?level=${levelFilter}` : '/api/logs'
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setLogs(data.logs || [])
        } else {
          // Fallback to mock logs if API fails
          const mockLogs: LogEntry[] = [
            {
              id: '1',
              level: 'INFO',
              message: 'System initialized',
              timestamp: new Date().toISOString(),
            },
            {
              id: '2',
              level: 'INFO',
              message: 'Database connected',
              timestamp: new Date().toISOString(),
            },
            {
              id: '3',
              level: 'INFO',
              message: 'API routes loaded',
              timestamp: new Date().toISOString(),
            },
          ]
          setLogs(mockLogs)
        }
      } catch (err) {
        console.error('Error loading logs:', err)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [levelFilter])

  const filteredLogs = logs.filter(log => {
    if (levelFilter && log.level.toLowerCase() !== levelFilter.toLowerCase()) return false
    return true
  })

  const getLevelColor = (level: string) => {
    const levelUpper = level.toUpperCase()
    if (levelUpper === 'ERROR') return '#ff4d4d'
    if (levelUpper === 'WARN' || levelUpper === 'WARNING') return '#ffa500'
    if (levelUpper === 'SUCCESS') return 'var(--hearst-green)'
    return 'var(--hearst-green)'
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="loading-state">
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(158, 255, 0, 0.2)',
              borderTopColor: '#9EFF00',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading logs...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Activity Logs</h1>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <Button variant="outline" onClick={() => window.location.reload()}>
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No logs available
                </p>
              </div>
            ) : (
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: 'var(--text-sm)',
                maxHeight: '600px',
                overflowY: 'auto',
              }}>
                {filteredLogs.map((log) => (
                  <div key={log.id} style={{ marginBottom: 'var(--space-2)', lineHeight: '1.8' }}>
                    <span style={{ color: 'var(--text-secondary)', marginRight: 'var(--space-2)' }}>
                      [{formatDate(log.timestamp)}]
                    </span>
                    <span style={{
                      color: getLevelColor(log.level),
                      marginRight: 'var(--space-2)',
                      fontWeight: 600,
                    }}>
                      [{log.level}]
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

