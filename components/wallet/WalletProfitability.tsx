'use client'

import { useState } from 'react'

export default function WalletProfitability() {
  const [activeSubSection, setActiveSubSection] = useState('overview')

  const subSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'reports', label: 'Reports' },
  ]

  return (
    <div>
      {/* Sub-navigation */}
      <nav className="wallet-nav-tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {subSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSubSection(section.id)}
            className={`wallet-nav-tab ${activeSubSection === section.id ? 'active' : ''}`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Overview Section */}
      {activeSubSection === 'overview' && (
        <div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Profitability Index</div>
              <div className="kpi-value">87.5%</div>
              <div className="kpi-description">Overall score</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">ROI</div>
              <div className="kpi-value">245%</div>
              <div className="kpi-description">Return on investment</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Profit/Loss</div>
              <div className="kpi-value" style={{ color: '#C5FFA7' }}>+$1,247,890</div>
              <div className="kpi-description">Total profit</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Break-even</div>
              <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>8 months</div>
              <div className="kpi-description">Time to break-even</div>
            </div>
          </div>

          <div className="wallet-grid-2">
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Performance Trends</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Chart: Performance over time<br />
                  (Chart.js integration would go here)
                </div>
              </div>
            </div>
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Key Indicators</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Revenue Efficiency</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>92.3%</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Cost Efficiency</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>85.7%</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Market Performance</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>78.9%</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Risk Score</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#FFA500', fontWeight: 'var(--font-bold)' }}>Medium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      {activeSubSection === 'metrics' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Detailed Metrics</div>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Target</th>
                    <th>Status</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Revenue Growth</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+45.2%</td>
                    <td>+30%</td>
                    <td><span className="wallet-badge wallet-badge-success">Above Target</span></td>
                    <td style={{ color: '#C5FFA7' }}>↑ +5.3%</td>
                  </tr>
                  <tr>
                    <td>Cost Reduction</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>-12.8%</td>
                    <td>-10%</td>
                    <td><span className="wallet-badge wallet-badge-success">Above Target</span></td>
                    <td style={{ color: '#C5FFA7' }}>↑ +2.8%</td>
                  </tr>
                  <tr>
                    <td>Profit Margin</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>34.5%</td>
                    <td>35%</td>
                    <td><span className="wallet-badge wallet-badge-warning">Below Target</span></td>
                    <td style={{ color: '#FFA500' }}>→ 0.0%</td>
                  </tr>
                  <tr>
                    <td>Cash Flow</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$245,890</td>
                    <td>$200,000</td>
                    <td><span className="wallet-badge wallet-badge-success">Above Target</span></td>
                    <td style={{ color: '#C5FFA7' }}>↑ +22.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Section */}
      {activeSubSection === 'comparison' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Wallet Comparison</div>
              <button className="wallet-btn">Compare Wallets</button>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Balance</th>
                    <th>Profitability Index</th>
                    <th>ROI</th>
                    <th>Profit/Loss</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mining Wallet</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>8.563 BTC</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>87.5%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+$1,247,890</td>
                    <td><span className="wallet-badge wallet-badge-success">Excellent</span></td>
                  </tr>
                  <tr>
                    <td>Collateral Wallet</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>12.450 BTC</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>76.3%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>182%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+$892,340</td>
                    <td><span className="wallet-badge wallet-badge-success">Good</span></td>
                  </tr>
                  <tr>
                    <td>ETH Main</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245.789 ETH</td>
                    <td style={{ color: '#FFA500', fontWeight: 'var(--font-bold)' }}>58.9%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>124%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>+$356,120</td>
                    <td><span className="wallet-badge wallet-badge-warning">Average</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      {activeSubSection === 'reports' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Generate Report</div>
            </div>
            <div className="wallet-card-body">
              <div className="wallet-grid-3">
                <div>
                  <label className="wallet-label">Report Type</label>
                  <select className="wallet-select">
                    <option>Profitability Summary</option>
                    <option>Detailed Analysis</option>
                    <option>Comparison Report</option>
                    <option>Custom Report</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Date Range</label>
                  <select className="wallet-select">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Format</label>
                  <select className="wallet-select">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Generate Report</button>
                <button className="wallet-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
              </div>
            </div>
          </div>

          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Report History</div>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Report Type</th>
                    <th>Period</th>
                    <th>Format</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-01-15 14:30:00</td>
                    <td>Profitability Summary</td>
                    <td>Last 30 days</td>
                    <td>PDF</td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2025-01-10 09:15:00</td>
                    <td>Detailed Analysis</td>
                    <td>Last 90 days</td>
                    <td>Excel</td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


