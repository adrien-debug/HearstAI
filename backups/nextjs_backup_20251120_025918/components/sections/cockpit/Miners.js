import { useState } from 'react';

export default function Miners() {
  const [filter, setFilter] = useState('all');

  const miners = [
    { id: 'MIN001', model: 'Antminer S21', hashrate: '200 TH/s', power: '3550W', efficiency: '17.75 J/TH', status: 'Online', location: 'Facility A', temperature: '65°C' },
    { id: 'MIN002', model: 'Antminer S21', hashrate: '200 TH/s', power: '3520W', efficiency: '17.6 J/TH', status: 'Online', location: 'Facility A', temperature: '63°C' },
    { id: 'MIN003', model: 'Antminer S19 Pro', hashrate: '110 TH/s', power: '3250W', efficiency: '29.5 J/TH', status: 'Degraded', location: 'Facility B', temperature: '72°C' },
    { id: 'MIN004', model: 'Antminer S21', hashrate: '200 TH/s', power: '3580W', efficiency: '17.9 J/TH', status: 'Online', location: 'Facility A', temperature: '66°C' },
    { id: 'MIN005', model: 'Antminer S19 XP', hashrate: '140 TH/s', power: '3010W', efficiency: '21.5 J/TH', status: 'Online', location: 'Facility C', temperature: '61°C' }
  ];

  const filteredMiners = filter === 'all' ? miners : miners.filter(m => m.status === filter);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Miners</div>
          <div className="stat-value">{miners.length}</div>
          <div className="stat-change">All hardware</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Online</div>
          <div className="stat-value green">{miners.filter(m => m.status === 'Online').length}</div>
          <div className="stat-change">Operational</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value">{miners.reduce((sum, m) => sum + parseFloat(m.hashrate), 0).toFixed(0)} TH/s</div>
          <div className="stat-change">Combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Power</div>
          <div className="stat-value">{(miners.reduce((sum, m) => sum + parseFloat(m.power), 0) / 1000).toFixed(2)} kW</div>
          <div className="stat-change">Consumption</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Miner Hardware</h3>
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
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Model</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Power</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Efficiency</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {filteredMiners.map((miner) => (
                <tr key={miner.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{miner.id}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{miner.model}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{miner.hashrate}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{miner.power}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{miner.efficiency}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${miner.status === 'Online' ? 'badge-success' : miner.status === 'Degraded' ? 'badge-warning' : 'badge-danger'}`}>
                      {miner.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>{miner.location}</td>
                  <td style={{ padding: 'var(--space-3)', color: parseFloat(miner.temperature) > 70 ? '#e74c3c' : 'var(--text-primary)' }}>{miner.temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


