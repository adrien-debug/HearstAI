'use client'

import { useState } from 'react'

export default function WalletScraperOverview() {
  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Scans</div>
          <div className="kpi-value">348</div>
          <div className="kpi-description">Completed scans</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Wallets Analyzed</div>
          <div className="kpi-value">127</div>
          <div className="kpi-description">Unique addresses</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Last Scan</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>5 min ago</div>
          <div className="kpi-description">Most recent scan</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Scan Status</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)', color: '#C5FFA7' }}>Ready</div>
          <div className="kpi-description">System status</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Recent Scans</div>
          <button className="wallet-scraper-btn-secondary">View All</button>
        </div>
        <div className="wallet-scraper-table-container">
          <table className="wallet-scraper-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Address</th>
                <th>Network</th>
                <th>Transactions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-01-15 14:20:00</td>
                <td className="wallet-scraper-address">bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst</td>
                <td>BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>1,247</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span></td>
                <td>
                  <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
              <tr>
                <td>2025-01-15 10:15:30</td>
                <td className="wallet-scraper-address">0x581cd214EE109Caa719559e41341CE8C1d9cC638</td>
                <td>ETH</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>892</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span></td>
                <td>
                  <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
              <tr>
                <td>2025-01-14 16:45:12</td>
                <td className="wallet-scraper-address">bc1qtsgpnjqq54t6n7upzk0rw8nyylfqw7l2f3vlly</td>
                <td>BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>456</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span></td>
                <td>
                  <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="wallet-scraper-grid-2">
        <div className="wallet-scraper-card">
          <div className="wallet-scraper-card-header">
            <div className="wallet-scraper-card-title">Network Distribution</div>
          </div>
          <div className="wallet-scraper-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bitcoin (BTC)</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>234 scans</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '67%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ethereum (ETH)</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>89 scans</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '26%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Multi-chain</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>25 scans</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '7%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="wallet-scraper-card">
          <div className="wallet-scraper-card-header">
            <div className="wallet-scraper-card-title">System Health</div>
          </div>
          <div className="wallet-scraper-card-body">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>API Status</span>
                <span className="wallet-scraper-status">
                  <span className="wallet-scraper-status-dot"></span>
                  <span style={{ color: '#C5FFA7' }}>Operational</span>
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Queue Status</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>2 pending</span>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Scan Time</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>12.5 sec</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Success Rate</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>98.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


