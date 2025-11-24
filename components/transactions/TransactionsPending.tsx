'use client'

import { useState } from 'react'

export default function TransactionsPending() {
  const pendingTransactions = [
    {
      id: 'tx_003',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qab...2c3d',
      amount: '0.050 BTC',
      value: '$2,098.27',
      fee: '0.0001 BTC',
      confirmations: 0,
      status: 'pending',
      date: '2025-01-15 11:45:00',
      estimatedTime: '~10 minutes',
    },
    {
      id: 'tx_006',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qgh...8i9j',
      amount: '0.200 BTC',
      value: '$8,393.08',
      fee: '0.00015 BTC',
      confirmations: 0,
      status: 'pending',
      date: '2025-01-15 10:30:15',
      estimatedTime: '~15 minutes',
    },
    {
      id: 'tx_007',
      type: 'Receive',
      from: 'bc1qij...0k1l',
      to: 'bc1qxy...7f8g',
      amount: '0.500 BTC',
      value: '$20,982.70',
      fee: '0.0001 BTC',
      confirmations: 0,
      status: 'pending',
      date: '2025-01-15 09:15:45',
      estimatedTime: '~5 minutes',
    },
  ]

  return (
    <div>
      {/* Pending Summary */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Pending Transactions</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: '#FFA500' }}>12</div>
          <div className="kpi-description">Awaiting confirmation</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Pending Amount</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>2.450 BTC</div>
          <div className="kpi-description">In pending transactions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Wait Time</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>12 min</div>
          <div className="kpi-description">Until confirmation</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Pending Fees</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>0.0012 BTC</div>
          <div className="kpi-description">Fees for pending txs</div>
        </div>
      </div>

      {/* Pending Transactions Table */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Pending Transactions ({pendingTransactions.length})</div>
          <button className="transactions-btn">Refresh Status</button>
        </div>
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Fee</th>
                <th>Confirmations</th>
                <th>Estimated Time</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.id}</td>
                  <td>
                    <span className={`transactions-badge ${tx.type === 'Send' ? 'transactions-badge-error' : 'transactions-badge-success'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.from}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.to}</td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{tx.amount}</td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>{tx.value}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.fee}</td>
                  <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{tx.confirmations}/6</td>
                  <td style={{ color: '#FFA500', fontFamily: 'var(--font-mono)' }}>{tx.estimatedTime}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{tx.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Info Card */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Pending Transaction Information</div>
        </div>
        <div className="transactions-card-body">
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Pending transactions require network confirmation before they are completed.</span>
          </div>
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Most transactions are confirmed within 10-30 minutes, depending on network congestion.</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>You can cancel unconfirmed transactions, but this may take additional time to process.</span>
          </div>
        </div>
      </div>
    </div>
  )
}


