export default function CollateralDashboard() {
  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Customer Collateral Management</h1>
          <p className="section-subtitle">Overview & KPIs</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">TOTAL CLIENTS</div>
          <div className="stat-value">247</div>
          <div className="stat-change">+12 ce mois</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AVERAGE HEALTH</div>
          <div className="stat-value green">156%</div>
          <div className="stat-change">↗ +3.2% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">CLIENT HEALTH STATUS</div>
          <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              margin: '0 auto',
              background: 'rgba(197, 255, 167, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(197, 255, 167, 0.3)'
            }}>
              Chart Placeholder
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 'var(--space-2)', 
            marginTop: 'var(--space-4)', 
            paddingTop: 'var(--space-4)', 
            borderTop: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary-green)' }}>198</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>HEALTHY</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--cockpit-orange)' }}>37</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>UNHEALTHY</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--cockpit-red)' }}>12</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>EXPOSED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

