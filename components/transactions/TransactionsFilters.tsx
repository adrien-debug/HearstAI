'use client'

import { useState } from 'react'

export default function TransactionsFilters() {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    address: '',
    txId: '',
  })

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Filter Form */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Advanced Filters</div>
        </div>
        <div className="transactions-card-body">
          {/* Date Range */}
          <div className="transactions-grid-2" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="transactions-label">Date From</label>
              <input
                type="date"
                className="transactions-input"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="transactions-label">Date To</label>
              <input
                type="date"
                className="transactions-input"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Type and Status */}
          <div className="transactions-grid-2" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="transactions-label">Transaction Type</label>
              <select
                className="transactions-select"
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="send">Send</option>
                <option value="receive">Receive</option>
                <option value="swap">Swap</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="transactions-label">Status</label>
              <select
                className="transactions-select"
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Amount Range */}
          <div className="transactions-grid-2" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="transactions-label">Minimum Amount (BTC)</label>
              <input
                type="number"
                className="transactions-input"
                placeholder="0.0"
                step="0.00000001"
                value={filters.minAmount}
                onChange={(e) => updateFilter('minAmount', e.target.value)}
              />
            </div>
            <div>
              <label className="transactions-label">Maximum Amount (BTC)</label>
              <input
                type="number"
                className="transactions-input"
                placeholder="0.0"
                step="0.00000001"
                value={filters.maxAmount}
                onChange={(e) => updateFilter('maxAmount', e.target.value)}
              />
            </div>
          </div>

          {/* Address and Transaction ID */}
          <div className="transactions-grid-2" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="transactions-label">Address</label>
              <input
                type="text"
                className="transactions-input"
                placeholder="Enter wallet address"
                value={filters.address}
                onChange={(e) => updateFilter('address', e.target.value)}
              />
            </div>
            <div>
              <label className="transactions-label">Transaction ID</label>
              <input
                type="text"
                className="transactions-input"
                placeholder="Enter transaction ID"
                value={filters.txId}
                onChange={(e) => updateFilter('txId', e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="transactions-btn">Apply Filters</button>
            <button
              className="transactions-btn-secondary"
              onClick={() => setFilters({ dateFrom: '', dateTo: '', type: 'all', status: 'all', minAmount: '', maxAmount: '', address: '', txId: '' })}
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Search Transactions</div>
        </div>
        <div className="transactions-card-body">
          <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
            <input
              type="text"
              className="transactions-input"
              placeholder="Search by transaction ID, address, or amount..."
              style={{ paddingRight: '50px', fontSize: 'var(--text-base)' }}
            />
            <button
              className="transactions-btn"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Search
            </button>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            You can search by transaction ID, wallet address, or amount. Use filters above for more precise results.
          </div>
        </div>
      </div>

      {/* Saved Filters */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Saved Filter Presets</div>
          <button className="transactions-btn-secondary">Save Current Filters</button>
        </div>
        <div className="transactions-card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              Last 7 Days
            </button>
            <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              Last 30 Days
            </button>
            <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              Large Transactions (>1 BTC)
            </button>
            <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}>
              Pending Only
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


