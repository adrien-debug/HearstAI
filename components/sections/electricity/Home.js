export default function Home() {
  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value green">$127,589</div>
          <div className="stat-change">+12.5% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workers</div>
          <div className="stat-value">3,068</div>
          <div className="stat-change">+5.2% uptime</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value">2,041 TH/s</div>
          <div className="stat-change">Stable performance</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Electricity Cost</div>
          <div className="stat-value">$0.063/kWh</div>
          <div className="stat-change">Optimized rate</div>
        </div>
      </div>
      
      <div className="section" style={{ marginTop: '32px' }}>
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="btn btn-secondary">View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Contract</th>
                <th>Workers</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-11-18</td>
                <td>AKT02A</td>
                <td>55</td>
                <td>$1,474.70</td>
                <td><span style={{ color: 'var(--primary-green)' }}>Active</span></td>
              </tr>
              <tr>
                <td>2025-11-18</td>
                <td>AKT06A</td>
                <td>111</td>
                <td>$722.95</td>
                <td><span style={{ color: 'var(--primary-green)' }}>Active</span></td>
              </tr>
              <tr>
                <td>2025-11-17</td>
                <td>LR02</td>
                <td>2</td>
                <td>$0.00</td>
                <td><span style={{ color: 'var(--text-muted)' }}>Maintenance</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

