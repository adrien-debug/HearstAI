'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { versionsAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Version {
  id: string
  label: string
  description?: string
  isStable: boolean
  createdAt: string
  projectId: string
  project?: {
    id: string
    name: string
  }
  files?: Array<{
    id: string
    path: string
    filename: string
    sizeBytes: number
  }>
}

export default function VersionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const versionId = params.id as string
  const [version, setVersion] = useState<Version | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVersion = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await versionsAPI.getById(versionId)
        setVersion(response.version || response)
      } catch (err) {
        console.error('Error loading version:', err)
        setError(err instanceof Error ? err.message : 'Failed to load version')
      } finally {
        setLoading(false)
      }
    }

    if (versionId) {
      loadVersion()
    }
  }, [versionId])

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
            <p style={{ color: 'var(--text-secondary)' }}>Loading version...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !version) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="error-state">
            <p>Error: {error || 'Version not found'}</p>
            <Button style={{ marginTop: 'var(--space-4)' }} onClick={() => router.push('/versions')}>
              Back to Versions
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
              <Link href="/versions" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', display: 'block' }}>
                ← Back to Versions
              </Link>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>
                Version {version.label}
              </h1>
            </div>
            {version.isStable && (
              <span style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                background: 'rgba(165, 255, 156, 0.2)',
                color: 'var(--hearst-green)',
              }}>
                STABLE
              </span>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Version Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Label
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                    {version.label}
                  </div>
                </div>
                {version.description && (
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      Description
                    </div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {version.description}
                    </div>
                  </div>
                )}
                {version.project && (
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                      Project
                    </div>
                    <div>
                      <Link href={`/projects/${version.project.id}`} style={{ color: 'var(--hearst-green)', textDecoration: 'none' }}>
                        {version.project.name}
                      </Link>
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Status
                  </div>
                  <div style={{ color: version.isStable ? 'var(--hearst-green)' : 'var(--text-secondary)' }}>
                    {version.isStable ? 'Stable' : 'Draft'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Created
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>
                    {formatDate(version.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Files ({version.files?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {version.files && version.files.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th>Filename</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {version.files.map((file) => (
                      <tr key={file.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{file.path}</td>
                        <td>{file.filename}</td>
                        <td>{(file.sizeBytes / 1024).toFixed(2)} KB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                No files in this version
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

