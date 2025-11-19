import { useState } from 'react';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const stats = [
    { label: 'Total Customers', value: '247', change: '+18 this month' },
    { label: 'Active Positions', value: '235', change: '$12.4M locked', green: true },
    { label: 'Total Exposure', value: '$7.8M', change: 'Across 3 protocols' },
    { label: 'Avg. Health Factor', value: '156%', change: 'Safe range', green: true }
  ];

  const customers = [
    { id: 'C001', name: 'John Doe', email: 'john@example.com', btcWallet: '1A1zP1...', erc20Wallet: '0x742d...', positionValue: '$125,000' },
    { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', btcWallet: '1BvBM...', erc20Wallet: '0x8ba1...', positionValue: '$89,500' },
    { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', btcWallet: '1Counter...', erc20Wallet: '0x4e83...', positionValue: '$234,200' }
  ];

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Customer Management</h1>
          <p className="section-subtitle">All customers</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary">Add Customer</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-value ${stat.green ? 'green' : ''}`}>{stat.value}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h2 className="card-title">All Customers</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                width: '250px'
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {['all', 'b2c', 'b2b', 'other'].map(f => (
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
        </div>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>BTC Wallet</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ERC-20 Wallet</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Position Value</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{customer.id}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{customer.name}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{customer.email}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{customer.btcWallet}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{customer.erc20Wallet}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{customer.positionValue}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <button className="btn btn-sm btn-ghost">View</button>
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

