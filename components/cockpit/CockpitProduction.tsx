'use client'

import { useEffect, useState } from 'react'
import { cockpitAPI } from '@/lib/api'
import './Cockpit.css'

export default function CockpitProduction() {
  // Initialize with 0 values - no mock data (same as dashboard)
  const [data, setData] = useState<any>({
    btcProduction24h: 0,
    btcProduction24hUSD: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await cockpitAPI.getData()
        if (response && response.data) {
          setData(response.data)
        } else {
          // If no data, set to 0 values
          setData({
            btcProduction24h: 0,
            btcProduction24hUSD: 0,
          })
        }
      } catch (err) {
        // If API fails, set to 0 values - no mock data
        console.error('Failed to load production data:', err)
        setData({
          btcProduction24h: 0,
          btcProduction24hUSD: 0,
        })
      }
    }
    
    // Try to load real data silently in the background (same as dashboard)
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Daily Production</div>
          <div className="kpi-value">{(data?.btcProduction24h ?? 0).toFixed(6)} BTC</div>
          <div className="kpi-description">Last 24 hours</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Monthly Production</div>
          <div className="kpi-value">0 BTC</div>
          <div className="kpi-description">Current month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Efficiency</div>
          <div className="kpi-value">0%</div>
          <div className="kpi-description">Average efficiency</div>
        </div>
      </div>

      {/* Production History - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Production History</h3>
        </div>
        <div className="cockpit-card-body">
          <div style={{ 
            padding: 'var(--space-8)', 
            background: 'rgba(255, 255, 255, 0.02)', 
            borderRadius: 'var(--radius-md)', 
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>Production charts will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
