'use client'

import { useState } from 'react'
import './Setup.css'

export default function SetupWallets() {
  const [wallets] = useState([
    { id: '1', name: 'Main Wallet', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', type: 'BTC', balance: '2.548923', connected: true },
    { id: '2', name: 'Trading Wallet', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', type: 'ETH', balance: '15.234567', connected: true },
    { id: '3', name: 'Savings Wallet', address: 'bc1qrs2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', type: 'BTC', balance: '0.123456', connected: false },
  ])

  return (
    <div className="setup-content">
      {/* Add Wallet Button */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <button className="setup-btn-primary">
          + Add Wallet
        </button>
      </div>

      {/* Wallets List */}
      <div className="setup-card">
        <div className="setup-card-header">
          <h3 className="setup-card-title">Connected Wallets</h3>
        </div>
        <div className="setup-card-content">
          <div className="setup-table-container">
            <table className="setup-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id}>
                    <td style={{ fontFamily: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {wallet.name}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                      {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                    </td>
                    <td>
                      <span className="setup-badge setup-badge-info">{wallet.type}</span>
                    </td>
                    <td style={{ 
                      color: '#8afd81', 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 'var(--font-semibold)',
                      textShadow: '0 0 10px rgba(138, 253, 129, 0.2)'
                    }}>
                      {wallet.balance} {wallet.type}
                    </td>
                    <td>
                      <span className={`setup-badge ${wallet.connected ? 'setup-badge-success' : 'setup-badge-error'}`}>
                        {wallet.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </td>
                    <td>
                      <button className="setup-btn-small">Edit</button>
                      <button className="setup-btn-small setup-btn-small-danger">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


