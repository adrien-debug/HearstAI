'use client'

import { useState } from 'react'

export default function WalletScraperAnalysis() {
  const [selectedAddress, setSelectedAddress] = useState('bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst')

  return (
    <div>
      {/* Address Selector */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Select Address to Analyze</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-2">
            <div>
              <label className="wallet-scraper-label">Wallet Address</label>
              <input
                type="text"
                className="wallet-scraper-input"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">Network</label>
              <select className="wallet-scraper-select">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Multi-chain</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="wallet-scraper-btn">Load Analysis</button>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="wallet-scraper-grid-2">
        <div className="wallet-scraper-card">
          <div className="wallet-scraper-card-header">
            <div className="wallet-scraper-card-title">Wallet Summary</div>
          </div>
          <div className="wallet-scraper-card-body">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Address</div>
              <div className="wallet-scraper-address wallet-scraper-address-highlight">{selectedAddress}</div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Current Balance</div>
              <div style={{ fontSize: 'var(--text-3xl)', color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>8.563 BTC</div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Received</div>
              <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>45.234 BTC</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Sent</div>
              <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>36.671 BTC</div>
            </div>
          </div>
        </div>
        <div className="wallet-scraper-card">
          <div className="wallet-scraper-card-header">
            <div className="wallet-scraper-card-title">Transaction Analysis</div>
          </div>
          <div className="wallet-scraper-card-body">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Transactions</div>
              <div style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', fontWeight: 'var(--font-bold)' }}>1,247</div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Top Counterparty</div>
              <div className="wallet-scraper-address">F2Pool Mining</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>234 transactions</div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>First Transaction</div>
              <div style={{ color: 'var(--text-primary)' }}>2024-03-29 14:23:15</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Last Activity</div>
              <div style={{ color: 'var(--text-primary)' }}>2025-01-15 14:23:45</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Counterparties */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Top Counterparties</div>
        </div>
        <div className="wallet-scraper-table-container">
          <table className="wallet-scraper-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Type</th>
                <th>Transactions</th>
                <th>Total Volume</th>
                <th>Last Transaction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="wallet-scraper-address">F2Pool Mining</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Received</span></td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>234</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>8.563 BTC</td>
                <td>2025-01-15 14:23:45</td>
              </tr>
              <tr>
                <td className="wallet-scraper-address">Antpool</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Received</span></td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>156</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>5.234 BTC</td>
                <td>2025-01-14 22:12:33</td>
              </tr>
              <tr>
                <td className="wallet-scraper-address">bc1qer7vzgvwnmduq6udac86gay7n80vuwg67vkd5f</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-error">Sent</span></td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>89</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>-3.456 BTC</td>
                <td>2025-01-12 08:45:21</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Timeline */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Transaction Timeline</div>
          <button className="wallet-scraper-btn-secondary">Export</button>
        </div>
        <div className="wallet-scraper-table-container">
          <table className="wallet-scraper-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>From/To</th>
                <th>Amount</th>
                <th>USD Value</th>
                <th>TX ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-01-15 14:23:45</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Received</span></td>
                <td className="wallet-scraper-address">F2Pool Mining</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+0.125 BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$11,875</td>
                <td className="wallet-scraper-address">a1b2c3d4e5f6...</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Confirmed</span></td>
              </tr>
              <tr>
                <td>2025-01-15 08:12:33</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Received</span></td>
                <td className="wallet-scraper-address">Antpool</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>+0.098 BTC</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>$9,310</td>
                <td className="wallet-scraper-address">f6e5d4c3b2a1...</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Confirmed</span></td>
              </tr>
              <tr>
                <td>2025-01-14 22:45:12</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-error">Sent</span></td>
                <td className="wallet-scraper-address">bc1qer7vzgvwnmduq6udac86gay7n80vuwg67vkd5f</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>-0.05 BTC</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>-$4,750</td>
                <td className="wallet-scraper-address">9876543210ab...</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


