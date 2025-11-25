'use client'

import { useEffect, useState } from 'react'
import { jobsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setError(null)
        const data = await jobsAPI.getAll()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error('Error loading jobs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
    const interval = setInterval(loadJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower === 'success' || statusLower === 'completed') return 'var(--hearst-green)'
    if (statusLower === 'failed' || statusLower === 'error') return '#ff4d4d'
    if (statusLower === 'running') return '#ffa500'
    if (statusLower === 'pending') return '#a5ff9c'
    return 'var(--text-secondary)'
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
            <p style={{ color: 'var(--text-secondary)' }}>Loading jobs...</p>
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
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Jobs</h1>
            <Button>+ New Job</Button>
          </div>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', marginBottom: 'var(--space-4)' }}>
            Error: {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  No jobs yet. Create your first job!
                </p>
                <Button>+ New Job</Button>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          {job.project?.name ? (
                            <Link href={`/projects/${job.project.id}`} style={{ color: 'var(--hearst-green)', textDecoration: 'none' }}>
                              {job.project.name}
                            </Link>
                          ) : (
                            <span>Unknown</span>
                          )}
                        </td>
                        <td>{job.type}</td>
                        <td>
                          <span style={{ color: getStatusColor(job.status?.toLowerCase() || 'pending'), fontWeight: 600 }}>
                            {job.status}
                          </span>
                        </td>
                        <td>{formatDate(job.createdAt)}</td>
                        <td>
                          <Link href={`/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
