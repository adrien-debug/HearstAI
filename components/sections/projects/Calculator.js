import { useState } from 'react';

export default function Calculator() {
  const [machine, setMachine] = useState({ hashrate: 605, power: 5870, price: 8500, efficiency: 9.7 });
  const [units, setUnits] = useState(200);
  const [energyCost, setEnergyCost] = useState(0.07);
  const [btcPrice, setBtcPrice] = useState(65000);
  const [difficulty, setDifficulty] = useState(95.5);

  const totalHashrate = (machine.hashrate * units / 1000).toFixed(2); // PH/s
  const totalPower = (machine.power * units / 1000).toFixed(2); // MW
  const dailyRevenue = ((machine.hashrate * units * 86400 * 6.25 * btcPrice) / (difficulty * 2**32 * 1e12)).toFixed(2);
  const dailyCost = (totalPower * 1000 * 24 * energyCost).toFixed(2);
  const dailyProfit = (dailyRevenue - dailyCost).toFixed(2);
  const roi = ((machine.price * units) / (dailyProfit * 365)).toFixed(1);

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Projections Calculator</h2>
          <p className="page-subtitle">Mining profitability calculator</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Machine Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Hashrate (TH/s)
              </label>
              <input
                type="number"
                value={machine.hashrate}
                onChange={(e) => setMachine({ ...machine, hashrate: parseFloat(e.target.value) || 0 })}
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
                Power Draw (W)
              </label>
              <input
                type="number"
                value={machine.power}
                onChange={(e) => setMachine({ ...machine, power: parseFloat(e.target.value) || 0 })}
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
                Unit Price ($)
              </label>
              <input
                type="number"
                value={machine.price}
                onChange={(e) => setMachine({ ...machine, price: parseFloat(e.target.value) || 0 })}
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
                Number of Units
              </label>
              <input
                type="number"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
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
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Market Parameters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Energy Cost ($/kWh)
              </label>
              <input
                type="number"
                step="0.001"
                value={energyCost}
                onChange={(e) => setEnergyCost(parseFloat(e.target.value) || 0)}
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
                BTC Price ($)
              </label>
              <input
                type="number"
                value={btcPrice}
                onChange={(e) => setBtcPrice(parseFloat(e.target.value) || 0)}
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
                Network Difficulty (T)
              </label>
              <input
                type="number"
                step="0.1"
                value={difficulty}
                onChange={(e) => setDifficulty(parseFloat(e.target.value) || 0)}
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
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Projection Results</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Hashrate</div>
            <div className="stat-value green">{totalHashrate} PH/s</div>
            <div className="stat-change">{units} units × {machine.hashrate} TH/s</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Power</div>
            <div className="stat-value">{totalPower} MW</div>
            <div className="stat-change">{units} units × {machine.power}W</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Daily Revenue</div>
            <div className="stat-value green">${parseFloat(dailyRevenue).toLocaleString()}</div>
            <div className="stat-change">Based on current BTC price</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Daily Cost</div>
            <div className="stat-value">${parseFloat(dailyCost).toLocaleString()}</div>
            <div className="stat-change">Energy consumption</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Daily Profit</div>
            <div className="stat-value green">${parseFloat(dailyProfit).toLocaleString()}</div>
            <div className="stat-change">{((dailyProfit / dailyRevenue) * 100).toFixed(1)}% margin</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ROI Period</div>
            <div className="stat-value">{roi} years</div>
            <div className="stat-change">Break-even estimate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

