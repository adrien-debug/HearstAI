'use client'

import { useState } from 'react'

export default function TransactionsSettings() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    emailNotifications: false,
    confirmationsRequired: 6,
    defaultFee: 'medium',
    currency: 'USD',
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Display Settings */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Display Settings</div>
        </div>
        <div className="transactions-card-body">
          <div className="transactions-grid-2">
            <div>
              <label className="transactions-label">Default Currency</label>
              <select
                className="transactions-select"
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Items Per Page</label>
              <select className="transactions-select">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Refresh Settings */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Auto-Refresh Settings</div>
        </div>
        <div className="transactions-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Enable Auto-Refresh</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Automatically refresh transaction list
                </div>
              </div>
            </label>
          </div>
          {settings.autoRefresh && (
            <div>
              <label className="transactions-label">Refresh Interval (seconds)</label>
              <input
                type="number"
                className="transactions-input"
                value={settings.refreshInterval}
                onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                min="10"
                max="300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Notification Settings</div>
        </div>
        <div className="transactions-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Browser Notifications</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Show browser notifications for new transactions
                </div>
              </div>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Email Notifications</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Send email notifications for important transactions
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Transaction Settings */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Transaction Settings</div>
        </div>
        <div className="transactions-card-body">
          <div className="transactions-grid-2">
            <div>
              <label className="transactions-label">Confirmations Required</label>
              <select
                className="transactions-select"
                value={settings.confirmationsRequired}
                onChange={(e) => updateSetting('confirmationsRequired', parseInt(e.target.value))}
              >
                <option value="1">1 Confirmation</option>
                <option value="3">3 Confirmations</option>
                <option value="6">6 Confirmations (Recommended)</option>
                <option value="12">12 Confirmations</option>
                <option value="24">24 Confirmations</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Default Fee Priority</label>
              <select
                className="transactions-select"
                value={settings.defaultFee}
                onChange={(e) => updateSetting('defaultFee', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Export Settings */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Export Settings</div>
        </div>
        <div className="transactions-card-body">
          <div className="transactions-grid-2">
            <div>
              <label className="transactions-label">Default Export Format</label>
              <select className="transactions-select">
                <option>CSV</option>
                <option>Excel</option>
                <option>JSON</option>
                <option>PDF</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Include Columns</label>
              <select className="transactions-select" multiple style={{ height: '120px' }}>
                <option selected>Transaction ID</option>
                <option selected>Type</option>
                <option selected>From</option>
                <option selected>To</option>
                <option selected>Amount</option>
                <option selected>Value</option>
                <option selected>Fee</option>
                <option selected>Status</option>
                <option selected>Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        <button className="transactions-btn">Save All Settings</button>
      </div>
    </div>
  )
}


