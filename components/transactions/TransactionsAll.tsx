'use client'

import { useState } from 'react'

export default function TransactionsAll() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  const transactions = [
    {
      id: 'tx_001',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qrs...9h0i',
      amount: '0.125 BTC',
      value: '$5,245.67',
      fee: '0.0001 BTC',
      confirmations: 6,
      status: 'completed',
      date: '2025-01-15 14:30:25',
    },
    {
      id: 'tx_002',
      type: 'Receive',
      from: 'bc1qrs...9h0i',
      to: 'bc1qxy...7f8g',
      amount: '0.250 BTC',
      value: '$10,491.34',
      fee: '0.0001 BTC',
      confirmations: 12,
      status: 'completed',
      date: '2025-01-15 12:15:10',
    },
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
    },
    {
      id: 'tx_004',
      type: 'Receive',
      from: 'bc1qcd...4e5f',
      to: 'bc1qxy...7f8g',
      amount: '1.500 BTC',
      value: '$62,945.10',
      fee: '0.0001 BTC',
      confirmations: 24,
      status: 'completed',
      date: '2025-01-14 18:20:15',
    },
    {
      id: 'tx_005',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qef...6g7h',
      amount: '0.075 BTC',
      value: '$3,147.25',
      fee: '0.0001 BTC',
      confirmations: 18,
      status: 'completed',
      date: '2025-01-14 15:10:30',
    },
  ]

  return (
    <div>
      {/* Filters and Options */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">All Transactions</div>
        </div>
        <div className="transactions-card-body">
          <div className="transactions-grid-4">
            <div>
              <label className="transactions-label">Items per page</label>
              <select
                className="transactions-select"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Sort By</label>
              <select className="transactions-select">
                <option>Date (Newest)</option>
                <option>Date (Oldest)</option>
                <option>Amount (Highest)</option>
                <option>Amount (Lowest)</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Type</label>
              <select className="transactions-select">
                <option>All Types</option>
                <option>Send</option>
                <option>Receive</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Status</label>
              <select className="transactions-select">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Transactions List</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="transactions-btn-secondary">Export CSV</button>
            <button className="transactions-btn-secondary">Export Excel</button>
          </div>
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
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
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
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.confirmations}</td>
                  <td>
                    {tx.status === 'completed' && (
                      <span className="transactions-badge transactions-badge-success">Completed</span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="transactions-badge transactions-badge-warning">Pending</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{tx.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Copy</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="transactions-btn-secondary" disabled={currentPage === 1} style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>Previous</button>
            <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>{currentPage}</button>
            <button className="transactions-btn-secondary" disabled={currentPage * itemsPerPage >= transactions.length} style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}


