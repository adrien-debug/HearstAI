'use client'

import { useState } from 'react'

export default function WalletScrapper() {
  const [activeSubSection, setActiveSubSection] = useState('scan')

  const subSections = [
    { id: 'scan', label: 'Scan Wallet' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'history', label: 'Scan History' },
    { id: 'batch', label: 'Batch Scan' },
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

      {/* Scan Section */}
      {activeSubSection === 'scan' && (
        <div>
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

          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Scan Wallet Address</div>
            </div>
            <div className="wallet-card-body">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="wallet-label">Wallet Address</label>
                <input type="text" className="wallet-input" placeholder="Enter BTC, ETH, or multi-chain address" />
              </div>
              <div className="wallet-grid-3">
                <div>
                  <label className="wallet-label">Network</label>
                  <select className="wallet-select">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>Multi-chain</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Scan Depth</label>
                  <select className="wallet-select">
                    <option>Standard (100 txs)</option>
                    <option>Deep (500 txs)</option>
                    <option>Full (All txs)</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Include NFTs</label>
                  <select className="wallet-select">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Start Scan</button>
                <button className="wallet-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {activeSubSection === 'analysis' && (
        <div>
          <div className="wallet-grid-2">
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Wallet Summary</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Address</div>
                  <div className="wallet-address wallet-address-highlight">bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Balance</div>
                  <div style={{ fontSize: 'var(--text-2xl)', color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>8.563 BTC</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Received</div>
                  <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>45.234 BTC</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Sent</div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>36.671 BTC</div>
                </div>
              </div>
            </div>
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Transaction Analysis</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Transactions</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>1,247</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Top Counterparty</div>
                  <div className="wallet-address">F2Pool Mining (234 txs)</div>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>First Transaction</div>
                  <div style={{ color: 'var(--text-primary)' }}>2024-03-29</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Last Activity</div>
                  <div style={{ color: 'var(--text-primary)' }}>2025-01-15 14:23:45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      {activeSubSection === 'history' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Scan History</div>
              <button className="wallet-btn">Clear History</button>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Network</th>
                    <th>Status</th>
                    <th>Transactions Found</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-01-15 14:20:00</td>
                    <td className="wallet-address">bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst</td>
                    <td>BTC</td>
                    <td><span className="wallet-badge wallet-badge-success">Completed</span></td>
                    <td>1,247</td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                  <tr>
                    <td>2025-01-15 10:15:30</td>
                    <td className="wallet-address">0x581cd214EE109Caa719559e41341CE8C1d9cC638</td>
                    <td>ETH</td>
                    <td><span className="wallet-badge wallet-badge-success">Completed</span></td>
                    <td>892</td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Batch Scan Section */}
      {activeSubSection === 'batch' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Batch Scan</div>
            </div>
            <div className="wallet-card-body">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="wallet-label">Addresses (one per line)</label>
                <textarea 
                  className="wallet-input" 
                  rows={10}
                  placeholder="bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst&#10;bc1qtsgpnjqq54t6n7upzk0rw8nyylfqw7l2f3vlly&#10;0x581cd214EE109Caa719559e41341CE8C1d9cC638"
                  style={{ fontFamily: 'var(--font-mono)', resize: 'vertical' }}
                />
              </div>
              <div className="wallet-grid-2">
                <div>
                  <label className="wallet-label">Network</label>
                  <select className="wallet-select">
                    <option>Auto-detect</option>
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Scan Mode</label>
                  <select className="wallet-select">
                    <option>Standard</option>
                    <option>Deep</option>
                    <option>Full</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Start Batch Scan</button>
                <button className="wallet-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


