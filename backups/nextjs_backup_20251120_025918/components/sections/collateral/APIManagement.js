import { useState } from 'react';

export default function APIManagement() {
  const [activeAPIs, setActiveAPIs] = useState({
    vacnelian: true,
    aave: true,
    compound: true
  });

  const stats = [
    { label: 'Total API Calls Today', value: '24,847', change: '+18.2% vs yesterday' },
    { label: 'Active Connections', value: '3 / 3', change: 'All systems operational', green: true },
    { label: 'Avg Response Time', value: '124ms', change: '-12ms improvement' },
    { label: 'Success Rate', value: '99.7%', change: 'Excellent performance', green: true }
  ];

  const apis = [
    {
      name: 'Vancelian API',
      status: 'ACTIVE',
      healthy: true,
      calls: '12,450',
      responseTime: '98ms',
      successRate: '99.9%',
      lastSync: '2 min ago'
    },
    {
      name: 'Aave API',
      status: 'ACTIVE',
      healthy: true,
      calls: '8,234',
      responseTime: '145ms',
      successRate: '99.5%',
      lastSync: '5 min ago'
    },
    {
      name: 'Compound API',
      status: 'ACTIVE',
      healthy: true,
      calls: '4,163',
      responseTime: '112ms',
      successRate: '99.8%',
      lastSync: '1 min ago'
    }
  ];

  const toggleAPI = (apiName) => {
    setActiveAPIs(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">API Management</h1>
          <p className="section-subtitle">DeFi Protocol APIs</p>
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

      <div style={{ display: 'grid', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        {apis.map((api, index) => (
          <div key={index} className="card">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <h3 className="card-title" style={{ margin: 0 }}>{api.name}</h3>
                <span className={`badge ${api.healthy ? 'badge-success' : 'badge-danger'}`}>
                  {api.status}
                </span>
              </div>
              <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input
                  type="checkbox"
                  checked={activeAPIs[api.name.toLowerCase().replace(' ', '')]}
                  onChange={() => toggleAPI(api.name.toLowerCase().replace(' ', ''))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)'
            }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                  API Calls (24h)
                </div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {api.calls}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                  Response Time
                </div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {api.responseTime}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                  Success Rate
                </div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--primary-green)' }}>
                  {api.successRate}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                  Last Sync
                </div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {api.lastSync}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

