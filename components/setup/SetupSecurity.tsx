'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupSecurity() {
  const [security] = useState({
    twoFactorAuth: true,
    emailVerification: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
  })

  const [securityLogs] = useState([
    { action: 'Login from new device', ip: '192.168.1.100', date: '2 hours ago', status: 'success' },
    { action: 'Password changed', ip: '192.168.1.1', date: '1 day ago', status: 'success' },
    { action: 'Failed login attempt', ip: '203.0.113.42', date: '2 days ago', status: 'failed' },
    { action: 'API key created', ip: '192.168.1.1', date: '3 days ago', status: 'success' },
  ])

  return (
    <div className="setup-content">
      {/* Security Settings */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Security Settings</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-form">
            <div className="setup-form-group setup-form-group-checkbox">
              <label className="setup-checkbox-label">
                <input 
                  type="checkbox"
                  className="setup-checkbox"
                  checked={security.twoFactorAuth}
                  onChange={() => {}}
                />
                <span>Enable Two-Factor Authentication (2FA)</span>
              </label>
            </div>

            <div className="setup-form-group setup-form-group-checkbox">
              <label className="setup-checkbox-label">
                <input 
                  type="checkbox"
                  className="setup-checkbox"
                  checked={security.emailVerification}
                  onChange={() => {}}
                />
                <span>Require Email Verification for Login</span>
              </label>
            </div>

            <div className="setup-form-group">
              <label className="setup-label">Password Expiry (days)</label>
              <input 
                type="number"
                className="setup-input"
                value={security.passwordExpiry}
                onChange={() => {}}
              />
            </div>

            <div className="setup-form-group">
              <label className="setup-label">Session Timeout (minutes)</label>
              <input 
                type="number"
                className="setup-input"
                value={security.sessionTimeout}
                onChange={() => {}}
              />
            </div>

            <div className="setup-form-group">
              <label className="setup-label">IP Whitelist</label>
              <textarea 
                className="setup-textarea"
                value={security.ipWhitelist.join('\n')}
                onChange={() => {}}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Security Logs</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-table-container">
            <table className="setup-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {securityLogs.map((log, index) => (
                  <tr key={index}>
                    <td style={{ fontFamily: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {log.action}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                      {log.ip}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {log.date}
                    </td>
                    <td>
                      <span className={`setup-badge ${log.status === 'success' ? 'setup-badge-success' : 'setup-badge-error'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="setup-actions">
        <button className="setup-btn-primary">Save Security Settings</button>
      </div>
    </div>
  )
}


