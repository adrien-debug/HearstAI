import { formatDateTime } from '../../../lib/dateUtils';

export default function MiningAccounts() {
  const accounts = [
    { id: 'AKT01', name: 'Account Alpha', hashrate: '500 TH/s', workers: 25, status: 'Online', efficiency: '98.5%', lastUpdate: '2024-12-15T14:30:00Z' },
    { id: 'AKT02', name: 'Account Beta', hashrate: '300 TH/s', workers: 15, status: 'Online', efficiency: '97.8%', lastUpdate: '2024-12-15T14:28:00Z' },
    { id: 'AKT03', name: 'Account Gamma', hashrate: '200 TH/s', workers: 10, status: 'Degraded', efficiency: '95.2%', lastUpdate: '2024-12-15T14:25:00Z' },
    { id: 'AKT04', name: 'Account Delta', hashrate: '400 TH/s', workers: 20, status: 'Online', efficiency: '98.1%', lastUpdate: '2024-12-15T14:30:00Z' }
  ];

  const totalHashrate = accounts.reduce((sum, a) => sum + parseFloat(a.hashrate), 0).toFixed(0);
  const totalWorkers = accounts.reduce((sum, a) => sum + a.workers, 0);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Accounts</div>
          <div className="stat-value">{accounts.length}</div>
          <div className="stat-change">All accounts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value green">{totalHashrate} TH/s</div>
          <div className="stat-change">Combined</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Workers</div>
          <div className="stat-value">{totalWorkers}</div>
          <div className="stat-change">Active workers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Online</div>
          <div className="stat-value green">{accounts.filter(a => a.status === 'Online').length}</div>
          <div className="stat-change">Operational</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Mining Accounts</h3>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Workers</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Efficiency</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 600 }}>{account.id}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{account.name}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{account.hashrate}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{account.workers}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${account.status === 'Online' ? 'badge-success' : account.status === 'Degraded' ? 'badge-warning' : 'badge-danger'}`}>
                      {account.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{account.efficiency}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {formatDateTime(account.lastUpdate)}
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

