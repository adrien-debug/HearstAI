import { useState } from 'react';

export default function Charts() {
  const [chartType, setChartType] = useState('revenue');

  const revenueData = [
    { month: 'Jan', value: 145000, cost: 105000 },
    { month: 'Feb', value: 152000, cost: 108000 },
    { month: 'Mar', value: 168000, cost: 112000 },
    { month: 'Apr', value: 175000, cost: 115000 },
    { month: 'May', value: 182000, cost: 118000 },
    { month: 'Jun', value: 190000, cost: 120000 }
  ];

  const maxValue = Math.max(...revenueData.map(d => Math.max(d.value, d.cost)));

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Charts</h2>
          <p className="page-subtitle">Financial visualizations and projections</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['revenue', 'profit', 'hashrate'].map(type => (
            <button
              key={type}
              className={`btn ${chartType === type ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChartType(type)}
              style={{ textTransform: 'capitalize' }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
          {chartType === 'revenue' ? 'Revenue vs Costs' : chartType === 'profit' ? 'Profit Trend' : 'Hashrate Growth'}
        </h3>
        <div style={{ padding: 'var(--space-6)', minHeight: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)', height: '350px', borderBottom: '1px solid var(--grey-100)', paddingBottom: 'var(--space-4)' }}>
            {revenueData.map((data, index) => {
              const revenueHeight = (data.value / maxValue) * 100;
              const costHeight = (data.cost / maxValue) * 100;
              const profit = data.value - data.cost;
              const profitHeight = chartType === 'profit' ? (profit / maxValue) * 100 : 0;

              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  {chartType === 'revenue' ? (
                    <>
                      <div style={{ 
                        width: '100%', 
                        background: 'linear-gradient(180deg, #C5FFA7 0%, rgba(197, 255, 167, 0.3) 100%)',
                        height: `${revenueHeight}%`,
                        minHeight: '20px',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        position: 'relative'
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
                          ${(data.value / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        background: 'linear-gradient(180deg, #ffa500 0%, rgba(255, 165, 0, 0.3) 100%)',
                        height: `${costHeight}%`,
                        minHeight: '20px',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        position: 'relative'
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
                          ${(data.cost / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      background: 'linear-gradient(180deg, #C5FFA7 0%, rgba(197, 255, 167, 0.3) 100%)',
                      height: `${profitHeight}%`,
                      minHeight: '20px',
                      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      position: 'relative'
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
                        ${(profit / 1000).toFixed(0)}k
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
          {chartType === 'revenue' && (
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '16px', height: '16px', background: '#C5FFA7', borderRadius: '4px' }}></div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '16px', height: '16px', background: '#ffa500', borderRadius: '4px' }}></div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Costs</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

