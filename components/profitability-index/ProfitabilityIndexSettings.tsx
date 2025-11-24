'use client'

import { useState } from 'react'

export default function ProfitabilityIndexSettings() {
  const [settings, setSettings] = useState({
    calculationMethod: 'weighted',
    updateFrequency: 'realtime',
    includeProjections: true,
    benchmarkComparison: true,
    riskWeighting: 'medium',
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Calculation Settings */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Calculation Settings</div>
        </div>
        <div className="profitability-card-body">
          <div className="profitability-grid-2">
            <div>
              <label className="profitability-label">Calculation Method</label>
              <select
                className="profitability-select"
                value={settings.calculationMethod}
                onChange={(e) => updateSetting('calculationMethod', e.target.value)}
              >
                <option value="weighted">Weighted Average</option>
                <option value="simple">Simple Average</option>
                <option value="median">Median</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Update Frequency</label>
              <select
                className="profitability-select"
                value={settings.updateFrequency}
                onChange={(e) => updateSetting('updateFrequency', e.target.value)}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Risk Weighting</label>
              <select
                className="profitability-select"
                value={settings.riskWeighting}
                onChange={(e) => updateSetting('riskWeighting', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Include Projections</label>
              <select
                className="profitability-select"
                value={settings.includeProjections ? 'yes' : 'no'}
                onChange={(e) => updateSetting('includeProjections', e.target.value === 'yes')}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Settings */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Benchmark Settings</div>
        </div>
        <div className="profitability-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.benchmarkComparison}
                onChange={(e) => updateSetting('benchmarkComparison', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: 'var(--text-primary)' }}>Enable benchmark comparison</span>
            </label>
          </div>
          <div className="profitability-grid-2">
            <div>
              <label className="profitability-label">Industry Benchmark</label>
              <select className="profitability-select">
                <option>Mining Industry Average</option>
                <option>Cryptocurrency Mining</option>
                <option>Bitcoin Mining</option>
                <option>Custom Benchmark</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Comparison Period</label>
              <select className="profitability-select">
                <option>Same Period Last Year</option>
                <option>Last Quarter</option>
                <option>Last Month</option>
                <option>Custom Period</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Display Settings</div>
        </div>
        <div className="profitability-card-body">
          <div className="profitability-grid-3">
            <div>
              <label className="profitability-label">Currency</label>
              <select className="profitability-select">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>BTC</option>
                <option>ETH</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Number Format</label>
              <select className="profitability-select">
                <option>Standard (1,234.56)</option>
                <option>Compact (1.2K)</option>
                <option>Scientific (1.23e3)</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Chart Theme</label>
              <select className="profitability-select">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>High Contrast</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Notification Settings</div>
        </div>
        <div className="profitability-card-body">
          <div className="profitability-grid-2">
            <div>
              <label className="profitability-label">Alert Threshold</label>
              <input
                type="number"
                className="profitability-input"
                placeholder="80"
                step="0.1"
              />
              <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
                Alert when Profitability Index drops below this value
              </small>
            </div>
            <div>
              <label className="profitability-label">Notification Method</label>
              <select className="profitability-select">
                <option>Email</option>
                <option>Webhook</option>
                <option>Both</option>
                <option>None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        <button className="profitability-btn">Save All Settings</button>
      </div>
    </div>
  )
}


