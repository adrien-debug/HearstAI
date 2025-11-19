import { useState } from 'react';

export default function Energy() {
  const [energyMix, setEnergyMix] = useState({ renewable: 75, grid: 25 });

  const sources = [
    { name: 'Hydroelectric', percentage: 45, cost: 0.045, capacity: 2.5, color: '#4a90e2' },
    { name: 'Solar', percentage: 20, cost: 0.052, capacity: 1.1, color: '#f5a623' },
    { name: 'Wind', percentage: 10, cost: 0.048, capacity: 0.6, color: '#7ed321' },
    { name: 'Grid', percentage: 25, cost: 0.070, capacity: 1.4, color: '#d0021b' }
  ];

  const totalCapacity = sources.reduce((sum, s) => sum + s.capacity, 0);
  const weightedCost = sources.reduce((sum, s) => sum + (s.cost * s.percentage / 100), 0);
  const renewablePercentage = sources.filter(s => s.name !== 'Grid').reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Energy</h2>
          <p className="page-subtitle">Renewable energy integration and optimization</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Capacity</div>
          <div className="stat-value green">{totalCapacity.toFixed(1)} MW</div>
          <div className="stat-change">Available power</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Renewable Mix</div>
          <div className="stat-value green">{renewablePercentage}%</div>
          <div className="stat-change">Clean energy</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Weighted Cost</div>
          <div className="stat-value">${weightedCost.toFixed(3)}/kWh</div>
          <div className="stat-change">Average rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Cost</div>
          <div className="stat-value green">${(totalCapacity * 1000 * 24 * 30 * weightedCost).toLocaleString()}</div>
          <div className="stat-change">Estimated</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Energy Sources</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {sources.map((source, index) => (
            <div key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: '12px', height: '12px', background: source.color, borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{source.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{source.percentage}%</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>${source.cost.toFixed(3)}/kWh</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{source.capacity} MW</span>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${source.percentage}%`, 
                    height: '100%', 
                    background: source.color, 
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Carbon Impact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                CO2 Emissions Avoided
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>
                1,245 tCO2/year
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                Carbon Intensity
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                0.12 kg CO2/kWh
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Cost Savings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                vs Grid-Only
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>
                -$125,000/year
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                Savings Rate
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
                18.5%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

