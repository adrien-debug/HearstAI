import { useState } from 'react';
import { formatDateTime } from '../../../lib/dateUtils';

export default function Workers() {
  const [filter, setFilter] = useState('all');

  const workers = [
    { id: 'WRK001', name: 'Worker Alpha-01', account: 'AKT01', hashrate: '20 TH/s', status: 'Online', uptime: '99.8%', lastSeen: '2024-12-15T14:30:00Z' },
    { id: 'WRK002', name: 'Worker Alpha-02', account: 'AKT01', hashrate: '20 TH/s', status: 'Online', uptime: '99.5%', lastSeen: '2024-12-15T14:30:00Z' },
    { id: 'WRK003', name: 'Worker Beta-01', account: 'AKT02', hashrate: '20 TH/s', status: 'Online', uptime: '98.9%', lastSeen: '2024-12-15T14:28:00Z' },
    { id: 'WRK004', name: 'Worker Gamma-01', account: 'AKT03', hashrate: '20 TH/s', status: 'Degraded', uptime: '95.2%', lastSeen: '2024-12-15T14:25:00Z' },
    { id: 'WRK005', name: 'Worker Delta-01', account: 'AKT04', hashrate: '20 TH/s', status: 'Online', uptime: '99.1%', lastSeen: '2024-12-15T14:30:00Z' }
  ];

  const filteredWorkers = filter === 'all' ? workers : workers.filter(w => w.status === filter);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Workers</div>
          <div className="stat-value">{workers.length}</div>
          <div className="stat-change">All workers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Online</div>
          <div className="stat-value green">{workers.filter(w => w.status === 'Online').length}</div>
          <div className="stat-change">Operational</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value">{workers.reduce((sum, w) => sum + parseFloat(w.hashrate), 0).toFixed(0)} TH/s</div>
          <div className="stat-change">Combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Uptime</div>
          <div className="stat-value green">{(workers.reduce((sum, w) => sum + parseFloat(w.uptime), 0) / workers.length).toFixed(1)}%</div>
          <div className="stat-change">Fleet average</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Worker Management</h3>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--primary-grey)',
              border: '1px solid var(--grey-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Degraded">Degraded</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Account</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Uptime</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{worker.id}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{worker.name}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{worker.account}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{worker.hashrate}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${worker.status === 'Online' ? 'badge-success' : worker.status === 'Degraded' ? 'badge-warning' : 'badge-danger'}`}>
                      {worker.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{worker.uptime}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {formatDateTime(worker.lastSeen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

