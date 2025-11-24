'use client'

import { useState } from 'react'

export default function WalletTransactions() {
  const [activeSubSection, setActiveSubSection] = useState('all')

  const subSections = [
    { id: 'all', label: 'All Transactions' },
    { id: 'received', label: 'Received' },
    { id: 'sent', label: 'Sent' },
    { id: 'mining', label: 'Mining Payouts' },
    { id: 'filters', label: 'Filters' },
  ]

  const transactions = [
    {
      id: '1',
      date: '2025-01-15 14:23:45',
      type: 'Received',
      from: 'F2Pool Mining',
      to: 'bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst',
      amount: '0.125 BTC',
      amount_usd: '$11,875',
      txid: 'a1b2c3d4e5f6...',
      confirmations: 6,
      status: 'confirmed',
    },
    {
      id: '2',
      date: '2025-01-15 08:12:33',
      type: 'Received',
      from: 'Antpool',
      to: 'bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst',
      amount: '0.098 BTC',
      amount_usd: '$9,310',
      txid: 'f6e5d4c3b2a1...',
      confirmations: 120,
      status: 'confirmed',
    },
    {
      id: '3',
      date: '2025-01-14 22:45:12',
      type: 'Sent',
      from: 'bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst',
      to: 'bc1qer7vzgvwnmduq6udac86gay7n80vuwg67vkd5f',
      amount: '-0.05 BTC',
      amount_usd: '-$4,750',
      txid: '9876543210ab...',
      confirmations: 3,
      status: 'pending',
    },
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

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">1,247</div>
          <div className="kpi-description">All time</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Received</div>
          <div className="kpi-value">45.234 BTC</div>
          <div className="kpi-description">$4,297,230</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Sent</div>
          <div className="kpi-value">12.789 BTC</div>
          <div className="kpi-description">$1,214,955</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending</div>
          <div className="kpi-value" style={{ color: '#FFA500' }}>3</div>
          <div className="kpi-description">Awaiting confirmation</div>
        </div>
      </div>

      {/* Filters Card */}
      {activeSubSection === 'filters' && (
        <div className="wallet-card">
          <div className="wallet-card-header">
            <div className="wallet-card-title">Transaction Filters</div>
          </div>
          <div className="wallet-card-body">
            <div className="wallet-grid-4">
              <div>
                <label className="wallet-label">Date Range</label>
                <input type="date" className="wallet-input" />
              </div>
              <div>
                <label className="wallet-label">Wallet</label>
                <select className="wallet-select">
                  <option>All Wallets</option>
                  <option>Mining Wallet</option>
                  <option>Collateral Wallet</option>
                </select>
              </div>
              <div>
                <label className="wallet-label">Type</label>
                <select className="wallet-select">
                  <option>All Types</option>
                  <option>Received</option>
                  <option>Sent</option>
                  <option>Mining</option>
                </select>
              </div>
              <div>
                <label className="wallet-label">Status</label>
                <select className="wallet-select">
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <button className="wallet-btn">Apply Filters</button>
              <button className="wallet-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {(activeSubSection === 'all' || activeSubSection === 'received' || activeSubSection === 'sent' || activeSubSection === 'mining') && (
        <div className="wallet-card">
          <div className="wallet-card-header">
            <div className="wallet-card-title">
              {activeSubSection === 'all' && 'All Transactions'}
              {activeSubSection === 'received' && 'Received Transactions'}
              {activeSubSection === 'sent' && 'Sent Transactions'}
              {activeSubSection === 'mining' && 'Mining Payouts'}
            </div>
            <button className="wallet-btn">Export CSV</button>
          </div>
          <div className="wallet-table-container">
            <table className="wallet-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>From/To</th>
                  <th>Amount</th>
                  <th>USD Value</th>
                  <th>TX ID</th>
                  <th>Confirmations</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>
                      <span className={`wallet-badge ${tx.type === 'Received' ? 'wallet-badge-success' : 'wallet-badge-error'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="wallet-address">{tx.to.slice(0, 16)}...</td>
                    <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>
                      {tx.amount}
                    </td>
                    <td>{tx.amount_usd}</td>
                    <td className="wallet-address">{tx.txid}</td>
                    <td>{tx.confirmations}</td>
                    <td>
                      <span className={`wallet-badge ${tx.status === 'confirmed' ? 'wallet-badge-success' : 'wallet-badge-warning'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


