export default function Results() {
  const metrics = [
    { label: 'Total Investment', value: '$1,700,000', change: 'CAPEX', color: 'var(--text-primary)' },
    { label: 'NPV (4 years)', value: '$2,450,000', change: '+44.1%', color: '#C5FFA7' },
    { label: 'IRR', value: '28.5%', change: 'Annual return', color: '#C5FFA7' },
    { label: 'Payback Period', value: '2.8 years', change: 'Break-even', color: 'var(--text-primary)' },
    { label: 'Total Revenue (4y)', value: '$8,920,000', change: 'Cumulative', color: '#C5FFA7' },
    { label: 'Total Profit (4y)', value: '$3,240,000', change: 'After costs', color: '#C5FFA7' }
  ];

  const yearlyProjection = [
    { year: 'Year 1', revenue: 1850000, costs: 1250000, profit: 600000, cumulative: 600000 },
    { year: 'Year 2', revenue: 2150000, costs: 1320000, profit: 830000, cumulative: 1430000 },
    { year: 'Year 3', revenue: 2480000, costs: 1400000, profit: 1080000, cumulative: 2510000 },
    { year: 'Year 4', revenue: 2420000, costs: 1450000, profit: 970000, cumulative: 3480000 }
  ];

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Results</h2>
          <p className="page-subtitle">Analysis results and financial metrics</p>
        </div>
        <button className="btn-primary">Export Report</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        {metrics.map((metric, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{metric.label}</div>
            <div className="stat-value" style={{ color: metric.color }}>{metric.value}</div>
            <div className="stat-change">{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Yearly Financial Projection</h3>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Year</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Revenue</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Costs</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Profit</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {yearlyProjection.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{row.year}</td>
                  <td style={{ padding: 'var(--space-3)', color: '#C5FFA7', textAlign: 'right' }}>${row.revenue.toLocaleString()}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', textAlign: 'right' }}>${row.costs.toLocaleString()}</td>
                  <td style={{ padding: 'var(--space-3)', color: '#C5FFA7', textAlign: 'right', fontWeight: 600 }}>${row.profit.toLocaleString()}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', textAlign: 'right' }}>${row.cumulative.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Key Assumptions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>BTC Price Growth</span>
              <span style={{ color: 'var(--text-primary)' }}>+8% annually</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Difficulty Increase</span>
              <span style={{ color: 'var(--text-primary)' }}>+15% annually</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Energy Cost</span>
              <span style={{ color: 'var(--text-primary)' }}>$0.07/kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Uptime</span>
              <span style={{ color: 'var(--text-primary)' }}>95%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Risk Factors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Price Volatility</span>
                <span style={{ color: '#ffa500' }}>Medium</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Regulatory Risk</span>
                <span style={{ color: '#C5FFA7' }}>Low</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Technical Risk</span>
                <span style={{ color: '#C5FFA7' }}>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

