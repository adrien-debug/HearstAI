export default function CollateralSection() {
  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h1 className="section-title">Collateral Management</h1>
          <p className="section-subtitle">Manage client positions and collateral across protocols</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary">Export Data</button>
          <button className="btn btn-primary">New Position</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total BTC Collateral</div>
          <div className="stat-value green">124.8 BTC</div>
          <div className="stat-change">≈ $11,830,400 USD</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">USDT Borrowed</div>
          <div className="stat-value">$4.2M</div>
          <div className="stat-change">+35.6% utilization</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">USDC Borrowed</div>
          <div className="stat-value">$3.6M</div>
          <div className="stat-change">+30.5% utilization</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Health Factor</div>
          <div className="stat-value green">1.68</div>
          <div className="stat-change">Safe Range</div>
        </div>
      </div>

      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '32px' }}>
        <p>Collateral positions table coming soon</p>
      </div>
    </div>
  );
}

