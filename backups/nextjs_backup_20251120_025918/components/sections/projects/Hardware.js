import { useState } from 'react';

export default function Hardware() {
  const [selectedMachine, setSelectedMachine] = useState('s23');

  const machines = [
    { id: 's23', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500, units: 150 },
    { id: 's21', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008, units: 50 },
    { id: 'm60s', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800, units: 0 }
  ];

  const totalHashrate = machines.reduce((sum, m) => sum + (m.hashrate * m.units), 0);
  const totalPower = machines.reduce((sum, m) => sum + (m.power * m.units), 0);
  const totalCost = machines.reduce((sum, m) => sum + (m.price * m.units), 0);

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Hardware</h2>
          <p className="page-subtitle">ASIC fleet configuration and optimization</p>
        </div>
        <button className="btn btn-primary">+ Add Machine</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Hashrate</div>
          <div className="stat-value green">{(totalHashrate / 1000).toFixed(2)} PH/s</div>
          <div className="stat-change">Combined capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Power</div>
          <div className="stat-value">{(totalPower / 1000).toFixed(2)} MW</div>
          <div className="stat-change">Power consumption</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Units</div>
          <div className="stat-value">{machines.reduce((sum, m) => sum + m.units, 0)}</div>
          <div className="stat-change">Active miners</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Investment</div>
          <div className="stat-value green">${totalCost.toLocaleString()}</div>
          <div className="stat-change">Hardware CAPEX</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>ASIC Models</h3>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {machines.map((machine) => (
            <div
              key={machine.id}
              className={`card ${selectedMachine === machine.id ? 'selected' : ''}`}
              onClick={() => setSelectedMachine(machine.id)}
              style={{
                cursor: 'pointer',
                border: selectedMachine === machine.id ? '2px solid #C5FFA7' : '1px solid var(--grey-100)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                    {machine.name}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Hashrate</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{machine.hashrate} TH/s</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Power</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{machine.power}W</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Efficiency</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: '#C5FFA7' }}>{machine.efficiency} J/TH</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Price</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>${machine.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7', marginBottom: 'var(--space-1)' }}>
                    {machine.units}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Units</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

