import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Contracts() {
  const [filter, setFilter] = useState('all');

  const contracts = [
    { 
      id: 'AKT02A', 
      provider: 'Hearst', 
      type: 'Hosting', 
      startDate: '2024-01-15', 
      endDate: '2025-01-15',
      workers: 55,
      power: 3068,
      costPerKwh: 0.063,
      status: 'active',
      monthlyCost: 1474.70
    },
    { 
      id: 'AKT06A', 
      provider: 'Hearst', 
      type: 'Hosting', 
      startDate: '2024-02-01', 
      endDate: '2025-02-01',
      workers: 111,
      power: 3350,
      costPerKwh: 0.063,
      status: 'active',
      monthlyCost: 722.95
    },
    { 
      id: 'LR02', 
      provider: 'Enegix', 
      type: 'Hosting', 
      startDate: '2024-03-10', 
      endDate: '2025-03-10',
      workers: 2,
      power: 150,
      costPerKwh: 0.055,
      status: 'maintenance',
      monthlyCost: 0
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'badge-success', text: 'ACTIVE' },
      maintenance: { class: 'badge-warning', text: 'MAINTENANCE' },
      expired: { class: 'badge-danger', text: 'EXPIRED' },
      pending: { class: 'badge-info', text: 'PENDING' }
    };
    return badges[status] || badges.pending;
  };

  const filteredContracts = filter === 'all' 
    ? contracts 
    : contracts.filter(c => c.status === filter);

  const totalMonthlyCost = contracts
    .filter(c => c.status === 'active')
    .reduce((sum, c) => sum + c.monthlyCost, 0);

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Contracts Management</h2>
        <button className="btn btn-primary">+ New Contract</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Contracts</div>
          <div className="stat-value">{contracts.length}</div>
          <div className="stat-change">All providers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Contracts</div>
          <div className="stat-value green">
            {contracts.filter(c => c.status === 'active').length}
          </div>
          <div className="stat-change">Currently running</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Workers</div>
          <div className="stat-value">
            {contracts.reduce((sum, c) => sum + c.workers, 0)}
          </div>
          <div className="stat-change">Across all contracts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Cost</div>
          <div className="stat-value green">${totalMonthlyCost.toFixed(2)}</div>
          <div className="stat-change">Active contracts only</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <h2 className="card-title">All Contracts</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['all', 'active', 'maintenance', 'expired'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: filter === f ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                  border: `1px solid ${filter === f ? '#C5FFA7' : 'var(--grey-100)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: filter === f ? '#C5FFA7' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Contract ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Provider</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Period</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Workers</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Cost/kWh</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Monthly Cost</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => {
                const badge = getStatusBadge(contract.status);
                return (
                  <tr key={contract.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{contract.id}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.provider}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.type}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                      {formatDateShort(contract.startDate)} - {formatDateShort(contract.endDate)}
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.workers}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>${contract.costPerKwh.toFixed(5)}</td>
                    <td style={{ padding: 'var(--space-3)', color: contract.status === 'active' ? '#C5FFA7' : 'var(--text-primary)', fontWeight: 600 }}>
                      ${contract.monthlyCost.toFixed(2)}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-sm btn-ghost">View</button>
                        <button className="btn btn-sm btn-ghost">Edit</button>
                      </div>
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

