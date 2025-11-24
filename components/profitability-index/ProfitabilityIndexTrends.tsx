'use client'

import { useState } from 'react'

export default function ProfitabilityIndexTrends() {
  const [selectedMetric, setSelectedMetric] = useState('profitability')

  return (
    <div>
      {/* Metric Selector */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Trend Analysis</div>
        </div>
        <div className="profitability-card-body">
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
            {[
              { id: 'profitability', label: 'Profitability Index' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'costs', label: 'Costs' },
              { id: 'profit', label: 'Profit' },
              { id: 'roi', label: 'ROI' },
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={selectedMetric === metric.id ? 'profitability-btn' : 'profitability-btn-secondary'}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                {metric.label}
              </button>
            ))}
          </div>
          <div className="profitability-grid-2">
            <div>
              <label className="profitability-label">Date Range</label>
              <select className="profitability-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>All Time</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Granularity</label>
              <select className="profitability-select">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="profitability-grid-2">
        <div className="profitability-chart-container">
          <div className="profitability-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="profitability-card-title">Profitability Index Trend</div>
          </div>
          <div className="profitability-chart-placeholder">
            Chart: Profitability Index over time<br />
            (Chart.js Line Chart would go here)
          </div>
        </div>
        <div className="profitability-chart-container">
          <div className="profitability-card-header" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="profitability-card-title">Revenue vs Costs</div>
          </div>
          <div className="profitability-chart-placeholder">
            Chart: Revenue vs Costs comparison<br />
            (Chart.js Area Chart would go here)
          </div>
        </div>
      </div>

      {/* ROI Trend */}
      <div className="profitability-chart-container">
        <div className="profitability-card-header" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="profitability-card-title">ROI Trend Analysis</div>
        </div>
        <div className="profitability-chart-placeholder">
          Chart: ROI percentage over time<br />
          (Chart.js Line Chart would go here)
        </div>
      </div>

      {/* Trend Statistics */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Trend Statistics</div>
        </div>
        <div className="profitability-table-container">
          <table className="profitability-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>30 Days Ago</th>
                <th>90 Days Ago</th>
                <th>12 Months Ago</th>
                <th>Change (30d)</th>
                <th>Change (12m)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Profitability Index</td>
                <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>87.5%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>85.2%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>82.3%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>78.9%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+2.3%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+8.6%</td>
              </tr>
              <tr>
                <td>ROI</td>
                <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>245%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>238%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>225%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>198%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+7%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+47%</td>
              </tr>
              <tr>
                <td>Revenue (Monthly)</td>
                <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)', fontFamily: 'var(--font-mono)' }}>$245,890</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$237,234</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$223,567</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>$189,890</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+3.6%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+29.5%</td>
              </tr>
              <tr>
                <td>Profit Margin</td>
                <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>43.8%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>42.1%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>40.5%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>38.2%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+1.7%</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+5.6%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


