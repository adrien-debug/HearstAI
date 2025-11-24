'use client'

export default function HomePerformance() {
  return (
    <div>
      {/* Performance KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">System Uptime</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>99.8%</div>
          <div className="kpi-description">Last 30 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Response Time</div>
          <div className="kpi-value">142ms</div>
          <div className="kpi-description">API response time</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Job Completion Rate</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>98.5%</div>
          <div className="kpi-description">Successfully completed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Error Rate</div>
          <div className="kpi-value" style={{ color: '#FF4D4D' }}>1.5%</div>
          <div className="kpi-description">Failed jobs</div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="home-card">
        <div className="home-card-header">
          <div className="home-card-title">Performance Metrics</div>
          <button className="home-btn-secondary">View Details</button>
        </div>
        <div className="home-table-container">
          <table className="home-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Uptime</th>
                <th>Response Time</th>
                <th>Status</th>
                <th>Last Check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'var(--font-semibold)' }}>API Server</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>99.9%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>142ms</td>
                <td><span className="home-badge home-badge-success">Online</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>2 min ago</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'var(--font-semibold)' }}>Database</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>100%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>23ms</td>
                <td><span className="home-badge home-badge-success">Online</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>1 min ago</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'var(--font-semibold)' }}>Job Queue</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>99.5%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>89ms</td>
                <td><span className="home-badge home-badge-success">Online</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>30 sec ago</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'var(--font-semibold)' }}>Storage</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>100%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>156ms</td>
                <td><span className="home-badge home-badge-success">Online</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>1 min ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


