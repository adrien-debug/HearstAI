'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PromptsPage() {
  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Prompt Templates</h1>
            <Button>+ New Template</Button>
          </div>
        </div>

        <Card>
          <CardContent style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}>
              📝
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Prompt Templates
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '500px', margin: '0 auto var(--space-6)' }}>
              Save and reuse your best Claude prompts:
            </p>
            <ul style={{
              textAlign: 'left',
              maxWidth: '400px',
              margin: '0 auto var(--space-6)',
              listStyle: 'none',
              padding: 0,
              color: 'var(--text-secondary)',
            }}>
              <li style={{ padding: 'var(--space-2) 0', paddingLeft: 'var(--space-6)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--hearst-green)' }}>✓</span>
                Create reusable prompt templates
              </li>
              <li style={{ padding: 'var(--space-2) 0', paddingLeft: 'var(--space-6)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--hearst-green)' }}>✓</span>
                Organize by categories (debug, refactor, etc.)
              </li>
              <li style={{ padding: 'var(--space-2) 0', paddingLeft: 'var(--space-6)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--hearst-green)' }}>✓</span>
                Use variables for dynamic content
              </li>
              <li style={{ padding: 'var(--space-2) 0', paddingLeft: 'var(--space-6)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--hearst-green)' }}>✓</span>
                Share prompts across projects
              </li>
            </ul>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              Coming soon: Build your prompt library for faster job creation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

