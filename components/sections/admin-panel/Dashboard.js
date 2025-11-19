export default function AdminDashboard() {
  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Revenu Total</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">$2.4M</div>
          <div className="kpi-trend trend-positive">
            ↗ +12.5% vs mois dernier
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Clients Actifs</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">1,247</div>
          <div className="kpi-trend trend-positive">
            ↗ +8.3% vs mois dernier
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Taux de Conversion</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">34.2%</div>
          <div className="kpi-trend trend-negative">
            ↘ -2.1% vs mois dernier
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Score Satisfaction</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
          </div>
          <div className="kpi-value">4.8/5</div>
          <div className="kpi-trend trend-positive">
            ↗ +0.3 vs mois dernier
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: '32px' }}>
        <div className="section-header">
          <h2 className="section-title">Actions Prioritaires</h2>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <p>Actions prioritaires section coming soon</p>
        </div>
      </div>
    </div>
  );
}

