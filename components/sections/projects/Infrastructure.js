export default function Infrastructure() {
  const facilities = [
    { name: 'Facility Alpha', location: 'Texas, USA', capacity: 5.0, pue: 1.12, cooling: 'Immersion', status: 'operational' },
    { name: 'Facility Beta', location: 'Quebec, Canada', capacity: 3.5, pue: 1.08, cooling: 'Air', status: 'operational' },
    { name: 'Facility Gamma', location: 'Iceland', capacity: 4.2, pue: 1.05, cooling: 'Natural', status: 'construction' }
  ];

  const totalCapacity = facilities.reduce((sum, f) => sum + f.capacity, 0);
  const avgPUE = facilities.reduce((sum, f) => sum + f.pue, 0) / facilities.length;

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Infrastructure</h2>
          <p className="page-subtitle">Facility design and cooling systems</p>
        </div>
        <button className="btn btn-primary">+ New Facility</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Capacity</div>
          <div className="stat-value green">{totalCapacity.toFixed(1)} MW</div>
          <div className="stat-change">Combined facilities</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average PUE</div>
          <div className="stat-value green">{avgPUE.toFixed(2)}</div>
          <div className="stat-change">Power efficiency</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Facilities</div>
          <div className="stat-value">{facilities.filter(f => f.status === 'operational').length}</div>
          <div className="stat-change">Operational sites</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Investment</div>
          <div className="stat-value green">$12.5M</div>
          <div className="stat-change">Infrastructure CAPEX</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Facilities</h3>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="card"
              style={{
                border: '1px solid var(--grey-100)',
                padding: 'var(--space-4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                    {facility.name}
                  </h4>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{facility.location}</div>
                </div>
                <span className={`badge ${facility.status === 'operational' ? 'badge-success' : 'badge-warning'}`}>
                  {facility.status.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Capacity</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: '#C5FFA7' }}>{facility.capacity} MW</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>PUE</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{facility.pue}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Cooling</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{facility.cooling}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Cooling Systems</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Immersion Cooling</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>1 facility</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#C5FFA7', borderRadius: '3px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Air Cooling</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>1 facility</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#C5FFA7', borderRadius: '3px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Natural Cooling</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>1 facility</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#C5FFA7', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Efficiency Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Average PUE</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>{avgPUE.toFixed(2)}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: '#C5FFA7', borderRadius: '4px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Cooling Efficiency</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>92%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: '#C5FFA7', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

