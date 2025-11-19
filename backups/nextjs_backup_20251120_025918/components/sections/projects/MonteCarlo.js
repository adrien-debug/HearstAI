import { useState } from 'react';

export default function MonteCarlo() {
  const [simulations, setSimulations] = useState(10000);
  const [confidence, setConfidence] = useState(95);

  const results = {
    p10: 1850000,
    p50: 2450000,
    p90: 3200000,
    mean: 2480000,
    stdDev: 450000
  };

  const scenarios = [
    { name: 'Bull Case', probability: 25, npv: 3200000, color: '#C5FFA7' },
    { name: 'Base Case', probability: 50, npv: 2450000, color: '#6fdc66' },
    { name: 'Bear Case', probability: 25, npv: 1850000, color: '#ffa500' }
  ];

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Monte Carlo</h2>
          <p className="page-subtitle">Probabilistic risk analysis</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Running simulation...')}>Run Simulation</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Simulation Parameters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Number of Simulations
              </label>
              <input
                type="number"
                value={simulations}
                onChange={(e) => setSimulations(parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Confidence Level (%)
              </label>
              <input
                type="number"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value) || 0)}
                min="80"
                max="99"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Variables Analyzed
              </div>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                <li>BTC Price Volatility</li>
                <li>Network Difficulty Changes</li>
                <li>Energy Cost Fluctuations</li>
                <li>Hardware Efficiency Degradation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Statistical Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="stat-card">
              <div className="stat-label">Mean NPV</div>
              <div className="stat-value green">${results.mean.toLocaleString()}</div>
              <div className="stat-change">Expected value</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Standard Deviation</div>
              <div className="stat-value">${results.stdDev.toLocaleString()}</div>
              <div className="stat-change">Risk measure</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>P10</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: '#ffa500' }}>${(results.p10 / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>P50 (Median)</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: '#C5FFA7' }}>${(results.p50 / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>P90</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: '#C5FFA7' }}>${(results.p90 / 1000).toFixed(0)}k</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Scenario Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          {scenarios.map((scenario, index) => (
            <div key={index} style={{ 
              padding: 'var(--space-4)', 
              background: 'rgba(197, 255, 167, 0.05)', 
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${scenario.color}40`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scenario.name}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: scenario.color }}>{scenario.probability}%</div>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: scenario.color, marginBottom: 'var(--space-2)' }}>
                ${(scenario.npv / 1000).toFixed(0)}k
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>NPV (4 years)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

