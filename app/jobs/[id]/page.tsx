'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { jobsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Job {
  id: string
  type: string
  status: string
  inputPrompt?: string
  createdAt: string
  updatedAt: string
  startedAt?: string
  completedAt?: string
  project?: {
    id: string
    name: string
  }
  logs?: Array<{
    id: string
    level: string
    message: string
    createdAt: string
  }>
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await jobsAPI.getById(jobId)
        setJob(response.job || response)
      } catch (err) {
        console.error('Error loading job:', err)
        setError(err instanceof Error ? err.message : 'Failed to load job')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      loadJob()
    }
  }, [jobId])

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper === 'SUCCESS') return '#a5ff9c'
    if (statusUpper === 'FAILED') return '#ff4d4d'
    if (statusUpper === 'RUNNING') return '#ffa500'
    return '#888'
  }

  const handleCancel = async () => {
    if (!job) return
    try {
      await jobsAPI.cancel(jobId)
      // Reload job data
      const response = await jobsAPI.getById(jobId)
      setJob(response.job || response)
    } catch (err) {
      console.error('Error cancelling job:', err)
      alert('Failed to cancel job')
    }
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="loading-state">
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(165, 255, 156, 0.2)',
              borderTopColor: '#a5ff9c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading job...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="error-state">
            <p>Error: {error || 'Job not found'}</p>
            <Button style={{ marginTop: 'var(--space-4)' }} onClick={() => router.push('/jobs')}>
              Back to Jobs
            </Button>
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
            <div>
              <Link href="/jobs" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', display: 'block' }}>
                ← Back to Jobs
              </Link>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>
                Job #{job.id.slice(0, 8)}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {job.status === 'RUNNING' && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              {job.status === 'PENDING' && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Type
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>
                    {job.type}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Status
                  </div>
                  <div style={{ color: getStatusColor(job.status), fontWeight: 600 }}>
                    {job.status}
                  </div>
                </div>
                {job.project && (
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      Project
                    </div>
                    <div>
                      <Link href={`/projects/${job.project.id}`} style={{ color: 'var(--hearst-green)', textDecoration: 'none' }}>
                        {job.project.name}
                      </Link>
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Created
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>
                    {formatDate(job.createdAt)}
                  </div>
                </div>
                {job.startedAt && (
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      Started
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {formatDate(job.startedAt)}
                    </div>
                  </div>
                )}
                {job.completedAt && (
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      Completed
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {formatDate(job.completedAt)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {job.inputPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Input Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  fontSize: 'var(--text-sm)',
                }}>
                  {job.inputPrompt}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {job.logs && job.logs.length > 0 ? (
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: 'var(--text-sm)',
                maxHeight: '500px',
                overflowY: 'auto',
              }}>
                {job.logs.map((log) => (
                  <div key={log.id} style={{ marginBottom: 'var(--space-2)', lineHeight: '1.6' }}>
                    <span style={{ color: 'var(--text-secondary)', marginRight: 'var(--space-2)' }}>
                      [{formatDate(log.createdAt)}]
                    </span>
                    <span style={{
                      color: log.level === 'ERROR' ? '#ff4d4d' : log.level === 'WARN' ? '#ffa500' : 'var(--hearst-green)',
                      marginRight: 'var(--space-2)',
                    }}>
                      [{log.level}]
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                No logs available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

