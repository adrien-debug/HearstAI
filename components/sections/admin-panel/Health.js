export default function Health() {
  const systems = [
    { 
      name: 'API Gateway', 
      status: 'operational', 
      uptime: 99.9, 
      responseTime: '45ms',
      lastCheck: '2 min ago',
      icon: 'api'
    },
    { 
      name: 'Database', 
      status: 'operational', 
      uptime: 99.8, 
      responseTime: '12ms',
      lastCheck: '1 min ago',
      icon: 'database'
    },
    { 
      name: 'Cache Layer', 
      status: 'operational', 
      uptime: 99.7, 
      responseTime: '8ms',
      lastCheck: '30 sec ago',
      icon: 'cache'
    },
    { 
      name: 'File Storage', 
      status: 'degraded', 
      uptime: 95.2, 
      responseTime: '234ms',
      lastCheck: '5 min ago',
      icon: 'storage'
    },
    { 
      name: 'Email Service', 
      status: 'operational', 
      uptime: 99.5, 
      responseTime: '156ms',
      lastCheck: '3 min ago',
      icon: 'email'
    },
    { 
      name: 'Monitoring', 
      status: 'operational', 
      uptime: 100, 
      responseTime: '23ms',
      lastCheck: '1 min ago',
      icon: 'monitoring'
    }
  ];

  const getStatusClass = (status) => {
    const classes = {
      operational: 'health-status-operational',
      degraded: 'health-status-degraded',
      critical: 'health-status-critical'
    };
    return classes[status] || classes.operational;
  };

  const getStatusBadge = (status) => {
    const badges = {
      operational: { class: 'badge-success', text: 'OPERATIONAL' },
      degraded: { class: 'badge-warning', text: 'DEGRADED' },
      critical: { class: 'badge-danger', text: 'CRITICAL' }
    };
    return badges[status] || badges.operational;
  };

  const overallHealth = systems.filter(s => s.status === 'operational').length / systems.length * 100;

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Overall Health</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value" style={{ color: overallHealth >= 95 ? '#C5FFA7' : overallHealth >= 80 ? '#ffa500' : '#ff4444' }}>
            {overallHealth.toFixed(1)}%
          </div>
          <div className="kpi-trend trend-positive">
            {systems.filter(s => s.status === 'operational').length} / {systems.length} systems
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Avg Response Time</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="kpi-value">
            {(systems.reduce((sum, s) => sum + parseFloat(s.responseTime), 0) / systems.length).toFixed(0)}ms
          </div>
          <div className="kpi-trend trend-positive">
            Excellent performance
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Avg Uptime</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value green">
            {(systems.reduce((sum, s) => sum + s.uptime, 0) / systems.length).toFixed(2)}%
          </div>
          <div className="kpi-trend trend-positive">
            Last 30 days
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Issues Detected</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <div className="kpi-value" style={{ color: systems.filter(s => s.status !== 'operational').length > 0 ? '#ffa500' : '#C5FFA7' }}>
            {systems.filter(s => s.status !== 'operational').length}
          </div>
          <div className="kpi-trend trend-positive">
            Requires attention
          </div>
        </div>
      </div>

      <div className="health-grid">
        {systems.map((system, index) => {
          const badge = getStatusBadge(system.status);
          return (
            <div key={index} className={`health-card ${getStatusClass(system.status)}`}>
              <div className="health-card-header">
                <div className="health-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v20M2 12h20"></path>
                  </svg>
                </div>
                <span className={`health-status-badge ${badge.class}`}>
                  {badge.text}
                </span>
              </div>
              <div className="health-name">{system.name}</div>
              <div className="health-metric">
                <span className="health-value">{system.uptime}%</span>
                <span className="health-label">Uptime</span>
              </div>
              <div className="health-metric">
                <span className="health-value" style={{ fontSize: 'var(--text-lg)' }}>{system.responseTime}</span>
                <span className="health-label">Response Time</span>
              </div>
              <div className="health-detail">Last check: {system.lastCheck}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

