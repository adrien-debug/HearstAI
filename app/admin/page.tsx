'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminOverview from '@/components/admin/AdminOverview'
import AdminUsers from '@/components/admin/AdminUsers'
import AdminSettings from '@/components/admin/AdminSettings'
import AdminLogs from '@/components/admin/AdminLogs'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' },
    { id: 'logs', label: 'System Logs' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Admin Panel</h1>
          
          {/* Navigation tabs */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            borderBottom: '1px solid var(--border)',
            marginBottom: 'var(--space-6)',
          }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeSection === section.id ? '2px solid var(--hearst-green)' : '2px solid transparent',
                  color: activeSection === section.id ? 'var(--hearst-green)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: activeSection === section.id ? 600 : 400,
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active section */}
        {activeSection === 'overview' && <AdminOverview />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'settings' && <AdminSettings />}
        {activeSection === 'logs' && <AdminLogs />}
      </div>
    </div>
  )
}

