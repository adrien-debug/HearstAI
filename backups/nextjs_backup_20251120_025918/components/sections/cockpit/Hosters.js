import { useState } from 'react';

export default function Hosters() {
  const [filter, setFilter] = useState('all');

  const hosters = [
    { id: 'HST001', name: 'Hosting Provider Alpha', location: 'USA', miners: 50, hashrate: '10 PH/s', status: 'Active', contracts: 3, uptime: '99.9%' },
    { id: 'HST002', name: 'Hosting Provider Beta', location: 'Canada', miners: 30, hashrate: '6 PH/s', status: 'Active', contracts: 2, uptime: '99.5%' },
    { id: 'HST003', name: 'Hosting Provider Gamma', location: 'Iceland', miners: 20, hashrate: '4 PH/s', status: 'Active', contracts: 1, uptime: '98.8%' },
    { id: 'HST004', name: 'Hosting Provider Delta', location: 'Kazakhstan', miners: 15, hashrate: '3 PH/s', status: 'Degraded', contracts: 1, uptime: '95.2%' }
  ];

  const filteredHosters = filter === 'all' ? hosters : hosters.filter(h => h.status === filter);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Providers</div>
          <div className="stat-value">{hosters.length}</div>
          <div className="stat-change">All providers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{hosters.filter(h => h.status === 'Active').length}</div>
          <div className="stat-change">Operational</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Miners</div>
          <div className="stat-value">{hosters.reduce((sum, h) => sum + h.miners, 0)}</div>
          <div className="stat-change">Combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value green">{hosters.reduce((sum, h) => sum + parseFloat(h.hashrate), 0).toFixed(1)} PH/s</div>
          <div className="stat-change">Combined</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Hosting Providers</h3>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Degraded">Degraded</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Miners</th>
                <th>Hashrate</th>
                <th>Contracts</th>
                <th>Uptime</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosters.map((hoster) => (
                <tr key={hoster.id}>
                  <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>{hoster.id}</td>
                  <td style={{ fontWeight: 600 }}>{hoster.name}</td>
                  <td>{hoster.location}</td>
                  <td>{hoster.miners}</td>
                  <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>{hoster.hashrate}</td>
                  <td>{hoster.contracts}</td>
                  <td>{hoster.uptime}</td>
                  <td>
                    <span className={`badge ${hoster.status === 'Active' ? 'badge-success' : hoster.status === 'Degraded' ? 'badge-warning' : 'badge-danger'}`}>
                      {hoster.status}
                    </span>
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


