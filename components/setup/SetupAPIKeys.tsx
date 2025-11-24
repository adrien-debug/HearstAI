'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupAPIKeys() {
  const [apiKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'pk_live_51...', created: '2025-01-15', lastUsed: '2 hours ago', permissions: ['read', 'write'], active: true },
    { id: '2', name: 'Development API Key', key: 'pk_test_42...', created: '2025-01-10', lastUsed: '5 days ago', permissions: ['read'], active: true },
    { id: '3', name: 'Analytics API Key', key: 'pk_analytics_33...', created: '2025-01-05', lastUsed: 'Never', permissions: ['read'], active: false },
  ])

  return (
    <div className="setup-content">
      {/* Add API Key Button */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button className="setup-btn-primary">
          + Generate New API Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">API Keys</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-table-container">
            <table className="setup-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id}>
                    <td style={{ fontFamily: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {apiKey.name}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                      {apiKey.key}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {apiKey.created}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {apiKey.lastUsed}
                    </td>
                    <td>
                      {apiKey.permissions.map((perm, idx) => (
                        <span key={idx} className="setup-badge setup-badge-info" style={{ marginRight: '4px' }}>
                          {perm}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`setup-badge ${apiKey.active ? 'setup-badge-success' : 'setup-badge-error'}`}>
                        {apiKey.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="setup-btn-small">Copy</button>
                      <button className="setup-btn-small">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* API Usage Stats */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">API Usage Statistics</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Requests Today</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>12,458</div>
              <div className="kpi-description">+15% from yesterday</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Rate Limit</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>87.5%</div>
              <div className="kpi-description">12,458 / 14,400</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Errors</div>
              <div className="kpi-value" style={{ color: '#FFA500' }}>23</div>
              <div className="kpi-description">0.18% error rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


