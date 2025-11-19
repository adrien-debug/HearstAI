import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    { label: 'Total Energy Consumed', value: '2,847 MWh', change: '+12.5%', trend: 'up' },
    { label: 'Average Cost/kWh', value: '$0.062', change: '-3.2%', trend: 'down' },
    { label: 'Peak Demand', value: '3,450 kW', change: '+8.1%', trend: 'up' },
    { label: 'Efficiency Score', value: '94.2%', change: '+2.3%', trend: 'up' }
  ];

  const consumptionData = [
    { month: 'Jan', value: 2450, cost: 151900 },
    { month: 'Feb', value: 2680, cost: 166160 },
    { month: 'Mar', value: 2847, cost: 176514 },
    { month: 'Apr', value: 2750, cost: 170500 },
    { month: 'May', value: 2900, cost: 179800 },
    { month: 'Jun', value: 2847, cost: 176514 }
  ];

  const maxValue = Math.max(...consumptionData.map(d => d.value));

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Analytics Dashboard</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              className={`btn ${timeRange === range ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange(range)}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {metrics.map((metric, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{metric.label}</div>
            <div className="stat-value green">{metric.value}</div>
            <div className={`stat-change ${metric.trend === 'up' ? 'positive' : ''}`}>
              {metric.trend === 'up' ? '↗' : '↘'} {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <h3 className="card-title">Energy Consumption Trend</h3>
        </div>
        <div style={{ padding: 'var(--space-6)', minHeight: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', height: '250px', borderBottom: '1px solid var(--grey-100)' }}>
            {consumptionData.map((data, index) => {
              const height = (data.value / maxValue) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%', 
                    background: 'linear-gradient(180deg, #C5FFA7 0%, rgba(197, 255, 167, 0.3) 100%)',
                    height: `${height}%`,
                    minHeight: '20px',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    marginBottom: 'var(--space-2)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap'
                    }}>
                      {data.value} MWh
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Cost Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {consumptionData.slice(-3).map((data, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{data.month}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${data.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Efficiency Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Power Usage Effectiveness</span>
                <span style={{ color: '#C5FFA7', fontWeight: 600 }}>1.15</span>
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

