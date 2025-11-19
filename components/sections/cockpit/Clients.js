import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: 'CLI001', name: 'Client Alpha', status: 'Active', contracts: 3, hashrate: '500 TH/s', revenue: '$12,500', lastActivity: '2024-12-15' },
    { id: 'CLI002', name: 'Client Beta', status: 'Active', contracts: 2, hashrate: '300 TH/s', revenue: '$7,500', lastActivity: '2024-12-14' },
    { id: 'CLI003', name: 'Client Gamma', status: 'Inactive', contracts: 1, hashrate: '150 TH/s', revenue: '$3,750', lastActivity: '2024-12-10' },
    { id: 'CLI004', name: 'Client Delta', status: 'Active', contracts: 4, hashrate: '800 TH/s', revenue: '$20,000', lastActivity: '2024-12-15' }
  ];

  const filteredClients = !searchTerm 
    ? clients 
    : clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Clients</div>
          <div className="stat-value">{clients.length}</div>
          <div className="stat-change">All clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{clients.filter(c => c.status === 'Active').length}</div>
          <div className="stat-change">Currently active</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value">{clients.reduce((sum, c) => sum + parseFloat(c.hashrate), 0).toFixed(0)} TH/s</div>
          <div className="stat-change">Combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Revenue</div>
          <div className="stat-value green">${clients.reduce((sum, c) => sum + parseFloat(c.revenue.replace('$', '').replace(',', '')), 0).toLocaleString()}</div>
          <div className="stat-change">Total</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Client Management</h3>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--primary-grey)',
              border: '1px solid var(--grey-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              minWidth: '200px'
            }}
          />
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Contracts</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Revenue</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{client.id}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{client.name}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${client.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{client.contracts}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{client.hashrate}</td>
                  <td style={{ padding: 'var(--space-3)', color: '#C5FFA7', fontWeight: 600 }}>{client.revenue}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {formatDateShort(client.lastActivity)}
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

