'use client'

import { useState } from 'react'

export default function ProfitabilityIndexMetrics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  return (
    <div>
      {/* Period Selector */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Period Selection</div>
        </div>
        <div className="profitability-card-body">
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
                className={selectedPeriod === period.id ? 'profitability-btn' : 'profitability-btn-secondary'}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Detailed Metrics</div>
          <button className="profitability-btn">Export CSV</button>
        </div>
        <div className="profitability-table-container">
          <table className="profitability-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Target</th>
                <th>Status</th>
                <th>Trend</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Revenue Growth</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+45.2%</td>
                <td>+30%</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↑</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+5.3%</td>
              </tr>
              <tr>
                <td>Cost Reduction</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>-12.8%</td>
                <td>-10%</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↓</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+2.8%</td>
              </tr>
              <tr>
                <td>Profit Margin</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>34.5%</td>
                <td>35%</td>
                <td><span className="profitability-badge profitability-badge-warning">Below Target</span></td>
                <td style={{ color: '#FFA500' }}>→</td>
                <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>0.0%</td>
              </tr>
              <tr>
                <td>Cash Flow</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>$245,890</td>
                <td>$200,000</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↑</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+22.9%</td>
              </tr>
              <tr>
                <td>Operating Efficiency</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>87.3%</td>
                <td>85%</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↑</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+2.3%</td>
              </tr>
              <tr>
                <td>Return on Assets (ROA)</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>18.7%</td>
                <td>15%</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↑</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+3.7%</td>
              </tr>
              <tr>
                <td>Return on Equity (ROE)</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>32.4%</td>
                <td>25%</td>
                <td><span className="profitability-badge profitability-badge-success">Above Target</span></td>
                <td style={{ color: '#C5FFA7' }}>↑</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+7.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics Breakdown Cards */}
      <div className="profitability-grid-3">
        <div className="profitability-card">
          <div className="profitability-card-header">
            <div className="profitability-card-title">Revenue Metrics</div>
          </div>
          <div className="profitability-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Revenue</div>
              <div style={{ fontSize: 'var(--text-xl)', color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>$2,847,230</div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Average Monthly</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$237,269</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Growth Rate</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+45.2%</div>
            </div>
          </div>
        </div>
        <div className="profitability-card">
          <div className="profitability-card-header">
            <div className="profitability-card-title">Cost Metrics</div>
          </div>
          <div className="profitability-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Costs</div>
              <div style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>$1,599,340</div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Average Monthly</div>
              <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>$133,278</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Cost Reduction</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>-12.8%</div>
            </div>
          </div>
        </div>
        <div className="profitability-card">
          <div className="profitability-card-header">
            <div className="profitability-card-title">Profit Metrics</div>
          </div>
          <div className="profitability-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Net Profit</div>
              <div style={{ fontSize: 'var(--text-xl)', color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>$1,247,890</div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Profit Margin</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>43.8%</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>ROI</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>245.0%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


