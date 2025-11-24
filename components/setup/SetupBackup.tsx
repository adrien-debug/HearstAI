'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupBackup() {
  const [backups] = useState([
    { id: '1', name: 'Full Backup', date: '2025-01-24 10:30', size: '2.5 GB', type: 'automatic', status: 'completed' },
    { id: '2', name: 'Incremental Backup', date: '2025-01-23 10:30', size: '150 MB', type: 'automatic', status: 'completed' },
    { id: '3', name: 'Full Backup', date: '2025-01-22 10:30', size: '2.4 GB', type: 'automatic', status: 'completed' },
    { id: '4', name: 'Manual Backup', date: '2025-01-17 14:15', size: '2.3 GB', type: 'manual', status: 'completed' },
  ])

  return (
    <div className="setup-content">
      {/* Backup Actions */}
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
        <button className="setup-btn-primary">
          Create Backup Now
        </button>
        <button className="setup-btn-secondary">
          Restore from Backup
        </button>
      </div>

      {/* Backup Status */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Backup Status</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Last Backup</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>7 hours ago</div>
              <div className="kpi-description">2025-01-24 10:30</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Total Backups</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>24</div>
              <div className="kpi-description">4 this week</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Storage Used</div>
              <div className="kpi-value" style={{ color: '#8afd81' }}>45.2 GB</div>
              <div className="kpi-description">of 100 GB</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Next Backup</div>
              <div className="kpi-value" style={{ color: '#FFA500' }}>In 17 hours</div>
              <div className="kpi-description">2025-01-25 10:30</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Backup History</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-table-container">
            <table className="setup-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id}>
                    <td style={{ fontFamily: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {backup.name}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                      {backup.date}
                    </td>
                    <td style={{ 
                      color: '#8afd81', 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 'var(--font-semibold)'
                    }}>
                      {backup.size}
                    </td>
                    <td>
                      <span className={`setup-badge ${backup.type === 'automatic' ? 'setup-badge-info' : 'setup-badge-warning'}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td>
                      <span className="setup-badge setup-badge-success">
                        {backup.status}
                      </span>
                    </td>
                    <td>
                      <button className="setup-btn-small">Download</button>
                      <button className="setup-btn-small">Restore</button>
                      <button className="setup-btn-small setup-btn-small-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


