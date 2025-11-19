import { formatDateShort } from '../../../lib/dateUtils';

export default function Energy() {
  const energyData = [
    { date: '2024-12-15', consumption: '2.45', cost: '$17,150', efficiency: '0.42 J/TH', pue: '1.15' },
    { date: '2024-12-14', consumption: '2.43', cost: '$17,010', efficiency: '0.42 J/TH', pue: '1.14' },
    { date: '2024-12-13', consumption: '2.41', cost: '$16,870', efficiency: '0.43 J/TH', pue: '1.16' },
    { date: '2024-12-12', consumption: '2.44', cost: '$17,080', efficiency: '0.42 J/TH', pue: '1.15' },
    { date: '2024-12-11', consumption: '2.40', cost: '$16,800', efficiency: '0.43 J/TH', pue: '1.16' }
  ];

  const totalConsumption = energyData.reduce((sum, d) => sum + parseFloat(d.consumption), 0).toFixed(2);
  const avgPUE = (energyData.reduce((sum, d) => sum + parseFloat(d.pue), 0) / energyData.length).toFixed(2);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Consumption (7d)</div>
          <div className="stat-value">{totalConsumption} MWh</div>
          <div className="stat-change">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average PUE</div>
          <div className="stat-value">{avgPUE}</div>
          <div className="stat-change">Power Usage Effectiveness</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Efficiency</div>
          <div className="stat-value">{energyData[0]?.efficiency || '0 J/TH'}</div>
          <div className="stat-change">Energy per TH</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Daily Average Cost</div>
          <div className="stat-value">${(energyData.reduce((sum, d) => sum + parseFloat(d.cost.replace('$', '').replace(',', '')), 0) / energyData.length).toFixed(0)}</div>
          <div className="stat-change">Per day</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Energy Consumption History</h3>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Consumption (MWh)</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Cost</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Efficiency</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>PUE</th>
              </tr>
            </thead>
            <tbody>
              {energyData.map((data, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{formatDateShort(data.date)}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{data.consumption} MWh</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{data.cost}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{data.efficiency}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{data.pue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

