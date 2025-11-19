export default function Mining() {
  const operations = [
    { id: 'OP001', name: 'Mining Farm Alpha', location: 'Texas, USA', hashrate: '2.5 PH/s', workers: 1250, status: 'active', uptime: 98.5 },
    { id: 'OP002', name: 'Mining Farm Beta', location: 'Quebec, Canada', hashrate: '1.8 PH/s', workers: 890, status: 'active', uptime: 97.2 },
    { id: 'OP003', name: 'Mining Farm Gamma', location: 'Iceland', hashrate: '3.2 PH/s', workers: 2100, status: 'degraded', uptime: 85.3 }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge-success', text: 'ACTIVE' },
      degraded: { class: 'badge-warning', text: 'DEGRADED' },
      offline: { class: 'badge-danger', text: 'OFFLINE' }
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Mining Operations</h2>
        <button className="btn btn-primary">+ New Operation</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Operations</div>
          <div className="stat-value">{operations.length}</div>
          <div className="stat-change">All locations</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value green">7.5 PH/s</div>
          <div className="stat-change">Combined capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Workers</div>
          <div className="stat-value">{operations.reduce((sum, op) => sum + op.workers, 0).toLocaleString()}</div>
          <div className="stat-change">Active miners</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Uptime</div>
          <div className="stat-value green">
            {(operations.reduce((sum, op) => sum + op.uptime, 0) / operations.length).toFixed(1)}%
          </div>
          <div className="stat-change">Last 30 days</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Workers</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Uptime</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => {
                const badge = getStatusBadge(op.status);
                return (
                  <tr key={op.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{op.id}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{op.name}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{op.location}</td>
                    <td style={{ padding: 'var(--space-3)', color: '#C5FFA7', fontWeight: 600 }}>{op.hashrate}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{op.workers.toLocaleString()}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{op.uptime.toFixed(1)}%</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <button className="btn btn-sm btn-ghost">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

