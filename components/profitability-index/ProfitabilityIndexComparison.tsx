'use client'

import { useState } from 'react'

export default function ProfitabilityIndexComparison() {
  const [comparisonType, setComparisonType] = useState('wallets')

  return (
    <div>
      {/* Comparison Type Selector */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Comparison Type</div>
        </div>
        <div className="profitability-card-body">
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setComparisonType('wallets')}
              className={comparisonType === 'wallets' ? 'profitability-btn' : 'profitability-btn-secondary'}
            >
              Compare Wallets
            </button>
            <button
              onClick={() => setComparisonType('periods')}
              className={comparisonType === 'periods' ? 'profitability-btn' : 'profitability-btn-secondary'}
            >
              Compare Periods
            </button>
            <button
              onClick={() => setComparisonType('markets')}
              className={comparisonType === 'markets' ? 'profitability-btn' : 'profitability-btn-secondary'}
            >
              Compare Markets
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Comparison */}
      {comparisonType === 'wallets' && (
        <div>
          <div className="profitability-card">
            <div className="profitability-card-header">
              <div className="profitability-card-title">Wallet Comparison</div>
              <button className="profitability-btn">Add Wallet</button>
            </div>
            <div className="profitability-table-container">
              <table className="profitability-table">
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Balance</th>
                    <th>Profitability Index</th>
                    <th>ROI</th>
                    <th>Profit/Loss</th>
                    <th>Profit Margin</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mining Wallet</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>8.563 BTC</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>87.5%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$1,247,890</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>43.8%</td>
                    <td><span className="profitability-badge profitability-badge-success">Excellent</span></td>
                    <td>
                      <button className="profitability-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Collateral Wallet</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>12.450 BTC</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>76.3%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>182%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$892,340</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>38.2%</td>
                    <td><span className="profitability-badge profitability-badge-success">Good</span></td>
                    <td>
                      <button className="profitability-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>ETH Main</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245.789 ETH</td>
                    <td style={{ color: '#FFA500', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>58.9%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>124%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$356,120</td>
                    <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)' }}>28.5%</td>
                    <td><span className="profitability-badge profitability-badge-warning">Average</span></td>
                    <td>
                      <button className="profitability-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Period Comparison */}
      {comparisonType === 'periods' && (
        <div>
          <div className="profitability-card">
            <div className="profitability-card-header">
              <div className="profitability-card-title">Period Comparison</div>
            </div>
            <div className="profitability-table-container">
              <table className="profitability-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Profitability Index</th>
                    <th>Revenue</th>
                    <th>Costs</th>
                    <th>Profit</th>
                    <th>ROI</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Q4 2024</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>89.2%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$712,450</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>$468,789</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$243,661</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>52.0%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>↑ +3.2%</td>
                  </tr>
                  <tr>
                    <td>Q3 2024</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>86.0%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$689,234</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>$456,123</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$233,111</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>51.1%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>↑ +5.1%</td>
                  </tr>
                  <tr>
                    <td>Q2 2024</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>80.9%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$634,567</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>$445,890</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+$188,677</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>42.3%</td>
                    <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)' }}>→ +1.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Market Comparison */}
      {comparisonType === 'markets' && (
        <div>
          <div className="profitability-card">
            <div className="profitability-card-header">
              <div className="profitability-card-title">Market Comparison</div>
            </div>
            <div className="profitability-table-container">
              <table className="profitability-table">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Profitability Index</th>
                    <th>Market Share</th>
                    <th>Performance</th>
                    <th>Risk Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bitcoin Mining</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>87.5%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>65%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>Excellent</td>
                    <td><span className="profitability-badge profitability-badge-info">Low</span></td>
                    <td><span className="profitability-badge profitability-badge-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Ethereum Staking</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 'var(--font-bold)' }}>72.3%</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>25%</td>
                    <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)' }}>Good</td>
                    <td><span className="profitability-badge profitability-badge-warning">Medium</span></td>
                    <td><span className="profitability-badge profitability-badge-success">Active</span></td>
                  </tr>
                  <tr>
                    <td>Other Altcoins</td>
                    <td style={{ color: '#FFA500', fontWeight: 'var(--font-bold)' }}>58.9%</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>10%</td>
                    <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)' }}>Average</td>
                    <td><span className="profitability-badge profitability-badge-error">High</span></td>
                    <td><span className="profitability-badge profitability-badge-warning">Monitoring</span></td>
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


