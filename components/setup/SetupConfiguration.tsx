'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupConfiguration() {
  const [config, setConfig] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    autoBackup: true,
    backupFrequency: 'daily',
    emailNotifications: true,
    smsNotifications: false,
  })

  return (
    <div className="setup-content">
      {/* Configuration Form */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">General Settings</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-form">
            <div className="setup-form-group">
              <label className="setup-label">Theme</label>
              <select 
                className="setup-select"
                value={config.theme}
                onChange={(e) => setConfig({...config, theme: e.target.value})}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="setup-form-group">
              <label className="setup-label">Language</label>
              <select 
                className="setup-select"
                value={config.language}
                onChange={(e) => setConfig({...config, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="setup-form-group">
              <label className="setup-label">Timezone</label>
              <select 
                className="setup-select"
                value={config.timezone}
                onChange={(e) => setConfig({...config, timezone: e.target.value})}
              >
                <option value="UTC">UTC</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>

            <div className="setup-form-group">
              <label className="setup-label">Currency</label>
              <select 
                className="setup-select"
                value={config.currency}
                onChange={(e) => setConfig({...config, currency: e.target.value})}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Backup Settings</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-form">
            <div className="setup-form-group setup-form-group-checkbox">
              <label className="setup-checkbox-label">
                <input 
                  type="checkbox"
                  className="setup-checkbox"
                  checked={config.autoBackup}
                  onChange={(e) => setConfig({...config, autoBackup: e.target.checked})}
                />
                <span>Enable Automatic Backup</span>
              </label>
            </div>

            {config.autoBackup && (
              <div className="setup-form-group">
                <label className="setup-label">Backup Frequency</label>
                <select 
                  className="setup-select"
                  value={config.backupFrequency}
                  onChange={(e) => setConfig({...config, backupFrequency: e.target.value})}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="setup-actions">
        <button className="setup-btn-primary">Save Configuration</button>
        <button className="setup-btn-secondary">Reset to Default</button>
      </div>
    </div>
  )
}


