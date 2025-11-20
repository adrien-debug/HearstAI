'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('versions')

  const sections = [
    { id: 'versions', label: 'Versions', href: '/versions' },
    { id: 'prompts', label: 'Prompts', href: '/prompts' },
    { id: 'logs', label: 'Logs', href: '/logs' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Settings
          </h1>
          
          {/* Navigation tabs */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--border)',
            marginBottom: 'var(--space-6)',
            overflowX: 'auto',
          }}>
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeSection === section.id ? '2px solid var(--hearst-green)' : '2px solid transparent',
                  color: activeSection === section.id ? 'var(--hearst-green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              <Link href="/versions" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 'var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hearst-green)'
                  e.currentTarget.style.background = 'rgba(158, 255, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                    Versions
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    Manage project versions and track code changes
                  </p>
                </div>
              </Link>
              
              <Link href="/prompts" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 'var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hearst-green)'
                  e.currentTarget.style.background = 'rgba(158, 255, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                    Prompts
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    Create and manage AI prompt templates
                  </p>
                </div>
              </Link>
              
              <Link href="/logs" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 'var(--space-4)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hearst-green)'
                  e.currentTarget.style.background = 'rgba(158, 255, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                    Logs
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    View system activity logs and events
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

