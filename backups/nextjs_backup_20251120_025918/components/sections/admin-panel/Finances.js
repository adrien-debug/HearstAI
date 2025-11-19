import { useState } from 'react';

export default function Finances() {
  const [period, setPeriod] = useState('month');

  const revenue = [
    { label: 'Total Revenue', value: '$2,450,000', change: '+12.5%', icon: 'revenue' },
    { label: 'Recurring Revenue', value: '$1,890,000', change: '+8.3%', icon: 'recurring' },
    { label: 'Operating Expenses', value: '$1,650,000', change: '+5.2%', icon: 'expenses' },
    { label: 'Net Profit', value: '$800,000', change: '+18.7%', icon: 'profit', green: true }
  ];

  const revenueBreakdown = [
    { category: 'Product Sales', amount: 1450000, percentage: 59.2, color: '#C5FFA7' },
    { category: 'Services', amount: 680000, percentage: 27.8, color: '#6fdc66' },
    { category: 'Subscriptions', amount: 210000, percentage: 8.6, color: '#5ac44a' },
    { category: 'Other', amount: 110000, percentage: 4.4, color: '#4aad3a' }
  ];

  const expenses = [
    { category: 'Salaries', amount: 850000, percentage: 51.5 },
    { category: 'Infrastructure', amount: 320000, percentage: 19.4 },
    { category: 'Marketing', amount: 280000, percentage: 17.0 },
    { category: 'Operations', amount: 200000, percentage: 12.1 }
  ];

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="section-title">Vue Financière</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['week', 'month', 'quarter', 'year'].map(p => (
            <button
              key={p}
              className={`btn ${period === p ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriod(p)}
              style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {revenue.map((item, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-label">{item.label}</div>
              <div className="kpi-icon">
                <svg viewBox="0 0 24 24">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div className={`kpi-value ${item.green ? 'green' : ''}`}>{item.value}</div>
            <div className="kpi-trend trend-positive">
              ↗ {item.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Revenue Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {revenueBreakdown.map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.category}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    ${item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${item.percentage}%`, 
                      height: '100%', 
                      background: item.color, 
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Expenses Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {expenses.map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.category}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    ${item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${item.percentage}%`, 
                      height: '100%', 
                      background: '#ffa500', 
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

