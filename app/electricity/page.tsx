'use client'

import { useEffect, useState } from 'react'
import { getElectricity } from '@/lib/api'
import ElectricityView from '@/components/ElectricityView'
import ElectricityConsumption from '@/components/electricity/ElectricityConsumption'
import ElectricityCosts from '@/components/electricity/ElectricityCosts'
import ElectricityMiners from '@/components/electricity/ElectricityMiners'
import ElectricityAnalytics from '@/components/electricity/ElectricityAnalytics'
import '@/components/electricity/Electricity.css'

export default function ElectricityPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'consumption', label: 'Consumption' },
    { id: 'costs', label: 'Costs' },
    { id: 'miners', label: 'Miners' },
    { id: 'analytics', label: 'Analytics' },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const electricityData = await getElectricity()
        setData(electricityData?.data || electricityData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load electricity data')
        console.error('Error loading electricity data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

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
            <p style={{ color: 'var(--text-secondary)' }}>Loading electricity data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div className="error-state">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Électricité</h1>
          
          {/* Navigation tabs - Dashboard Style */}
          <nav className="electricity-nav-tabs">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`electricity-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Show ElectricityView for overview, or section-specific content */}
        {activeSection === 'overview' && <ElectricityView data={data} />}
        {activeSection === 'consumption' && <ElectricityConsumption />}
        {activeSection === 'costs' && <ElectricityCosts />}
        {activeSection === 'miners' && <ElectricityMiners />}
        {activeSection === 'analytics' && <ElectricityAnalytics />}
      </div>
    </div>
  )
}

