'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupNotifications() {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'email', name: 'Transaction Alerts', enabled: true, channel: 'email' },
    { id: '2', type: 'push', name: 'Security Alerts', enabled: true, channel: 'push' },
    { id: '3', type: 'sms', name: 'Critical Alerts', enabled: false, channel: 'sms' },
    { id: '4', type: 'email', name: 'Daily Reports', enabled: true, channel: 'email' },
    { id: '5', type: 'push', name: 'Price Alerts', enabled: false, channel: 'push' },
  ])

  return (
    <div className="setup-content">
      {/* Notifications List */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Notification Preferences</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-table-container">
            <table className="setup-table">
              <thead>
                <tr>
                  <th>Notification Type</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td style={{ fontFamily: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {notification.name}
                    </td>
                    <td>
                      <span className="setup-badge setup-badge-info">{notification.channel}</span>
                    </td>
                    <td>
                      <label className="setup-toggle">
                        <input 
                          type="checkbox"
                          checked={notification.enabled}
                          onChange={(e) => {
                            setNotifications(notifications.map(n => 
                              n.id === notification.id ? {...n, enabled: e.target.checked} : n
                            ))
                          }}
                        />
                        <span className="setup-toggle-slider"></span>
                      </label>
                    </td>
                    <td>
                      <button className="setup-btn-small">Configure</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Notification Channels</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Email</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>verified@example.com</div>
              <div className="kpi-description">✓ Verified</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">SMS</div>
              <div className="kpi-value" style={{ color: 'var(--text-secondary)' }}>+33 6 XX XX XX XX</div>
              <div className="kpi-description">○ Not configured</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Push Notifications</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>Enabled</div>
              <div className="kpi-description">✓ Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


