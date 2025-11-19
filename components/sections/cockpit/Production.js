import { formatDateShort } from '../../../lib/dateUtils';

export default function Production() {
  const productionData = [
    { date: '2024-12-15', btc: '0.084521', usd: '$5,494', hashrate: '2041.42 TH/s', efficiency: '98.5%' },
    { date: '2024-12-14', btc: '0.083247', usd: '$5,411', hashrate: '2038.21 TH/s', efficiency: '98.2%' },
    { date: '2024-12-13', btc: '0.082156', usd: '$5,340', hashrate: '2035.15 TH/s', efficiency: '98.0%' },
    { date: '2024-12-12', btc: '0.081892', usd: '$5,323', hashrate: '2032.89 TH/s', efficiency: '97.8%' },
    { date: '2024-12-11', btc: '0.080654', usd: '$5,243', hashrate: '2030.12 TH/s', efficiency: '97.5%' }
  ];

  const totalBtc = productionData.reduce((sum, d) => sum + parseFloat(d.btc), 0).toFixed(6);
  const avgEfficiency = (productionData.reduce((sum, d) => sum + parseFloat(d.efficiency), 0) / productionData.length).toFixed(1);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Production (7d)</div>
          <div className="stat-value green">{totalBtc} BTC</div>
          <div className="stat-change">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Efficiency</div>
          <div className="stat-value">{avgEfficiency}%</div>
          <div className="stat-change">Fleet average</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Hashrate</div>
          <div className="stat-value">{productionData[0]?.hashrate || '0 TH/s'}</div>
          <div className="stat-change">Real-time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Daily Average</div>
          <div className="stat-value green">{(parseFloat(totalBtc) / productionData.length).toFixed(6)} BTC</div>
          <div className="stat-change">Per day</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Production History</h3>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>BTC Production</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>USD Value</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hashrate</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {productionData.map((data, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{formatDateShort(data.date)}</td>
                  <td style={{ padding: 'var(--space-3)', color: '#C5FFA7', fontWeight: 600 }}>{data.btc} BTC</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{data.usd}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{data.hashrate}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{data.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

