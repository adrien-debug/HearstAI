'use client'

import './Setup.css'

export default function SetupOverview() {
  const setupStatus = [
    { label: 'Configuration', status: 'complete', value: '100%' },
    { label: 'Wallets Connected', status: 'complete', value: '3' },
    { label: 'API Keys', status: 'warning', value: '2/5' },
    { label: 'Security', status: 'complete', value: 'Enabled' },
    { label: 'Notifications', status: 'incomplete', value: '0/3' },
    { label: 'Backup', status: 'warning', value: '7 days ago' },
  ]

  const recentActivity = [
    { action: 'API Key Added', date: '2 hours ago', type: 'success' },
    { action: 'Wallet Connected', date: '1 day ago', type: 'success' },
    { action: 'Configuration Updated', date: '3 days ago', type: 'info' },
    { action: 'Backup Created', date: '7 days ago', type: 'info' },
  ]

  return (
    <div className="setup-content">
      {/* KPI Cards */}
      <div className="setup-kpi-grid">
        {setupStatus.map((item, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value" style={{ 
              color: item.status === 'complete' ? '#8afd81' : item.status === 'warning' ? '#FFA500' : 'var(--text-secondary)' 
            }}>
              {item.value}
            </div>
            <div className="kpi-description">
              {item.status === 'complete' && '✓ Configured'}
              {item.status === 'warning' && '⚠ Needs attention'}
              {item.status === 'incomplete' && '○ Not configured'}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Recent Activity</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="setup-activity-item">
                <div className="setup-activity-info">
                  <span className="setup-activity-action">{activity.action}</span>
                  <span className="setup-activity-date">{activity.date}</span>
                </div>
                <span className={`setup-badge setup-badge-${activity.type}`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Quick Actions</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-actions-grid">
            <button className="setup-btn-primary">
              Add Wallet
            </button>
            <button className="setup-btn-secondary">
              Generate API Key
            </button>
            <button className="setup-btn-secondary">
              Run Backup
            </button>
            <button className="setup-btn-secondary">
              Test Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


