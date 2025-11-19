export default function Structure() {
  const kpis = [
    { label: 'Effectif Total', value: '247', change: '+15 ce trimestre', icon: 'users' },
    { label: 'Départements', value: '12', change: '+2 ce trimestre', icon: 'departments' },
    { label: 'Taux de Rétention', value: '94.3%', change: '+2.1% vs année N-1', icon: 'retention' },
    { label: 'Postes Ouverts', value: '18', change: '6 en attente depuis 30j+', icon: 'positions', negative: true }
  ];

  const executives = [
    { name: 'John Doe', title: 'CEO & Founder', team: '247 personnes', avatar: 'JD', ceo: true },
    { name: 'Sarah Anderson', title: 'CTO', team: '78 personnes', avatar: 'SA' },
    { name: 'Michael Johnson', title: 'CFO', team: '32 personnes', avatar: 'MJ' },
    { name: 'Emily Davis', title: 'CMO', team: '45 personnes', avatar: 'ED' }
  ];

  return (
    <div>
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-icon">
                <svg viewBox="0 0 24 24">
                  {kpi.icon === 'users' && (
                    <>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </>
                  )}
                  {kpi.icon === 'departments' && (
                    <>
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </>
                  )}
                  {kpi.icon === 'retention' && (
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  )}
                  {kpi.icon === 'positions' && (
                    <>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </>
                  )}
                </svg>
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-trend ${kpi.negative ? 'trend-negative' : 'trend-positive'}`}>
              {kpi.negative ? '↘' : '↗'} {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <div className="section-title">Organigramme Exécutif</div>
          <button className="btn btn-secondary">Vue Détaillée</button>
        </div>

        <div className="org-chart">
          {/* CEO Level */}
          <div className="org-level">
            {executives.filter(e => e.ceo).map((exec, index) => (
              <div key={index} className="org-card org-card-ceo">
                <div className="org-avatar" style={{ background: 'linear-gradient(135deg, var(--primary-green) 0%, #6fdc66 100%)' }}>
                  {exec.avatar}
                </div>
                <div className="org-info">
                  <div className="org-name">{exec.name}</div>
                  <div className="org-title">{exec.title}</div>
                </div>
                <div className="org-team">{exec.team}</div>
              </div>
            ))}
          </div>

          {/* C-Level */}
          <div className="org-level org-level-2">
            {executives.filter(e => !e.ceo).map((exec, index) => (
              <div key={index} className="org-card">
                <div className="org-avatar">{exec.avatar}</div>
                <div className="org-info">
                  <div className="org-name">{exec.name}</div>
                  <div className="org-title">{exec.title}</div>
                </div>
                <div className="org-team">{exec.team}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

