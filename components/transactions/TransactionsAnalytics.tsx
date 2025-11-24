'use client'

import { useState } from 'react'

export default function TransactionsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  return (
    <div>
      {/* Period Selector */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Analytics Period</div>
        </div>
        <div className="transactions-card-body">
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '6m', label: '6 Months' },
              { id: '12m', label: '12 Months' },
              { id: 'all', label: 'All Time' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={selectedPeriod === period.id ? 'transactions-btn' : 'transactions-btn-secondary'}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="transactions-grid-2">
        <div className="transactions-chart-container">
          <div className="transactions-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="transactions-card-title">Transaction Volume</div>
          </div>
          <div className="transactions-chart-placeholder">
            Chart: Transaction volume over time<br />
            (Chart.js Area Chart would go here)
          </div>
        </div>
        <div className="transactions-chart-container">
          <div className="transactions-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="transactions-card-title">Transaction Count</div>
          </div>
          <div className="transactions-chart-placeholder">
            Chart: Number of transactions over time<br />
            (Chart.js Line Chart would go here)
          </div>
        </div>
      </div>

      <div className="transactions-grid-2">
        <div className="transactions-chart-container">
          <div className="transactions-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="transactions-card-title">Fees Paid</div>
          </div>
          <div className="transactions-chart-placeholder">
            Chart: Transaction fees over time<br />
            (Chart.js Bar Chart would go here)
          </div>
        </div>
        <div className="transactions-chart-container">
          <div className="transactions-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="transactions-card-title">Transaction Types Distribution</div>
          </div>
          <div className="transactions-chart-placeholder">
            Chart: Pie chart of transaction types<br />
            (Chart.js Pie Chart would go here)
          </div>
        </div>
      </div>

      {/* Analytics Statistics */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Analytics Statistics</div>
        </div>
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Last 7 Days</th>
                <th>Last 30 Days</th>
                <th>Last 90 Days</th>
                <th>All Time</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Transactions</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>89</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>324</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>891</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>1,247</td>
                <td style={{ color: '#C5FFA7' }}>↑ +15%</td>
              </tr>
              <tr>
                <td>Total Volume (BTC)</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>12.45</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>245.89</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>678.23</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>1,234.56</td>
                <td style={{ color: '#C5FFA7' }}>↑ +8%</td>
              </tr>
              <tr>
                <td>Total Fees (BTC)</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.0089</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.1247</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.3567</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.4567</td>
                <td style={{ color: '#C5FFA7' }}>↑ +3%</td>
              </tr>
              <tr>
                <td>Average Transaction Size</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.140 BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.758 BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.761 BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>0.989 BTC</td>
                <td style={{ color: '#C5FFA7' }}>↑ +5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


