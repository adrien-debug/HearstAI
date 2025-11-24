'use client'

export default function CockpitOperations() {
  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Active Operations</div>
          <div className="kpi-value">24</div>
          <div className="kpi-description">Currently running</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completed Today</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>156</div>
          <div className="kpi-description">Operations completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Success Rate</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>98.7%</div>
          <div className="kpi-description">Last 30 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Duration</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>12 min</div>
          <div className="kpi-description">Per operation</div>
        </div>
      </div>

      {/* Operations Table */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <div className="cockpit-card-title">Recent Operations</div>
          <button className="cockpit-btn-secondary">View All</button>
        </div>
        <div className="cockpit-table-container">
          <table className="cockpit-table">
            <thead>
              <tr>
                <th>Operation ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Duration</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>OP-2025-001</td>
                <td>Maintenance</td>
                <td><span className="cockpit-badge cockpit-badge-success">Completed</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>2025-01-15 14:30</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>15 min</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>Success</td>
                <td>
                  <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>OP-2025-002</td>
                <td>Update</td>
                <td><span className="cockpit-badge cockpit-badge-warning">In Progress</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>2025-01-15 15:00</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>8 min</td>
                <td style={{ color: '#FFA500' }}>Processing</td>
                <td>
                  <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>OP-2025-003</td>
                <td>Deployment</td>
                <td><span className="cockpit-badge cockpit-badge-success">Completed</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>2025-01-15 13:45</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>22 min</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>Success</td>
                <td>
                  <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


