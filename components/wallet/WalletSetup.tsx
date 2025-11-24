'use client'

import { useState } from 'react'

export default function WalletSetup() {
  const [activeSubSection, setActiveSubSection] = useState('configuration')

  const subSections = [
    { id: 'configuration', label: 'Configuration' },
    { id: 'wallets', label: 'Wallet Management' },
    { id: 'connections', label: 'API Connections' },
    { id: 'settings', label: 'Settings' },
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

      {/* Configuration Section */}
      {activeSubSection === 'configuration' && (
        <div>
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Total Wallets</div>
              <div className="kpi-value">12</div>
              <div className="kpi-description">Configured wallets</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Active Connections</div>
              <div className="kpi-value">8</div>
              <div className="kpi-description">API connections</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Total Balance</div>
              <div className="kpi-value">45.234 BTC</div>
              <div className="kpi-description">Across all wallets</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Last Sync</div>
              <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>2 min ago</div>
              <div className="kpi-description">Last data sync</div>
            </div>
          </div>

          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Quick Setup</div>
            </div>
            <div className="wallet-card-body">
              <div className="wallet-grid-2">
                <div>
                  <label className="wallet-label">Wallet Name</label>
                  <input type="text" className="wallet-input" placeholder="My Wallet" />
                </div>
                <div>
                  <label className="wallet-label">Wallet Type</label>
                  <select className="wallet-select">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>Multi-chain</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Address</label>
                  <input type="text" className="wallet-input" placeholder="Enter wallet address" />
                </div>
                <div>
                  <label className="wallet-label">Network</label>
                  <select className="wallet-select">
                    <option>Mainnet</option>
                    <option>Testnet</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Add Wallet</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management Section */}
      {activeSubSection === 'wallets' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Managed Wallets</div>
              <button className="wallet-btn">Add New Wallet</button>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mining Wallet</td>
                    <td>BTC</td>
                    <td className="wallet-address">bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>8.563 BTC</td>
                    <td><span className="wallet-badge wallet-badge-success">Active</span></td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Collateral Wallet</td>
                    <td>BTC</td>
                    <td className="wallet-address">bc1qtsgpnjqq54t6n7upzk0rw8nyylfqw7l2f3vlly</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>12.450 BTC</td>
                    <td><span className="wallet-badge wallet-badge-success">Active</span></td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>ETH Main</td>
                    <td>ETH</td>
                    <td className="wallet-address">0x581cd214EE109Caa719559e41341CE8C1d9cC638</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245.789 ETH</td>
                    <td><span className="wallet-badge wallet-badge-success">Active</span></td>
                    <td>
                      <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* API Connections Section */}
      {activeSubSection === 'connections' && (
        <div>
          <div className="wallet-grid-2">
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Blockchain Explorers</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="wallet-label">Blockchain.com API</label>
                  <input type="text" className="wallet-input" placeholder="API Key" />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="wallet-label">Etherscan API</label>
                  <input type="text" className="wallet-input" placeholder="API Key" />
                </div>
                <div>
                  <button className="wallet-btn">Save Connection</button>
                </div>
              </div>
            </div>
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-title">Mining Pools</div>
              </div>
              <div className="wallet-card-body">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="wallet-label">F2Pool API</label>
                  <input type="text" className="wallet-input" placeholder="API Key" />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label className="wallet-label">Antpool API</label>
                  <input type="text" className="wallet-input" placeholder="API Key" />
                </div>
                <div>
                  <button className="wallet-btn">Save Connection</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSubSection === 'settings' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">General Settings</div>
            </div>
            <div className="wallet-card-body">
              <div className="wallet-grid-2">
                <div>
                  <label className="wallet-label">Auto-sync Interval</label>
                  <select className="wallet-select">
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Every hour</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Currency Display</label>
                  <select className="wallet-select">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>BTC</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Default Network</label>
                  <select className="wallet-select">
                    <option>Mainnet</option>
                    <option>Testnet</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Notifications</label>
                  <select className="wallet-select">
                    <option>Enabled</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


