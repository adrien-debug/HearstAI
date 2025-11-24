'use client'

import { useState } from 'react'

export default function WalletScraperHistory() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterNetwork, setFilterNetwork] = useState('all')

  const scans = [
    {
      id: '1',
      date: '2025-01-15 14:20:00',
      address: 'bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst',
      network: 'BTC',
      status: 'completed',
      transactions: 1247,
      duration: '12.5s',
    },
    {
      id: '2',
      date: '2025-01-15 10:15:30',
      address: '0x581cd214EE109Caa719559e41341CE8C1d9cC638',
      network: 'ETH',
      status: 'completed',
      transactions: 892,
      duration: '18.3s',
    },
    {
      id: '3',
      date: '2025-01-14 16:45:12',
      address: 'bc1qtsgpnjqq54t6n7upzk0rw8nyylfqw7l2f3vlly',
      network: 'BTC',
      status: 'completed',
      transactions: 456,
      duration: '8.9s',
    },
    {
      id: '4',
      date: '2025-01-14 12:30:45',
      address: '0x7bd5278B47Fc0Ba51cD021f883b92CE4249C0F95',
      network: 'ETH',
      status: 'failed',
      transactions: 0,
      duration: '-',
    },
  ]

  const filteredScans = scans.filter(scan => {
    if (filterStatus !== 'all' && scan.status !== filterStatus) return false
    if (filterNetwork !== 'all' && scan.network !== filterNetwork) return false
    return true
  })

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Scans</div>
          <div className="kpi-value">348</div>
          <div className="kpi-description">All time</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Successful</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>342</div>
          <div className="kpi-description">98.3% success rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Failed</div>
          <div className="kpi-value" style={{ color: '#FF4D4D' }}>6</div>
          <div className="kpi-description">1.7% failure rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Duration</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>14.2s</div>
          <div className="kpi-description">Average scan time</div>
        </div>
      </div>

      {/* Filters */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Filters</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-4">
            <div>
              <label className="wallet-scraper-label">Status</label>
              <select
                className="wallet-scraper-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Network</label>
              <select
                className="wallet-scraper-select"
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
              >
                <option value="all">All Networks</option>
                <option value="BTC">Bitcoin</option>
                <option value="ETH">Ethereum</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Date From</label>
              <input type="date" className="wallet-scraper-input" />
            </div>
            <div>
              <label className="wallet-scraper-label">Date To</label>
              <input type="date" className="wallet-scraper-input" />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="wallet-scraper-btn">Apply Filters</button>
            <button className="wallet-scraper-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Reset</button>
          </div>
        </div>
      </div>

      {/* Scan History Table */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Scan History</div>
          <button className="wallet-scraper-btn">Export CSV</button>
        </div>
        <div className="wallet-scraper-table-container">
          <table className="wallet-scraper-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Address</th>
                <th>Network</th>
                <th>Status</th>
                <th>Transactions</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => (
                <tr key={scan.id}>
                  <td>{scan.date}</td>
                  <td className="wallet-scraper-address">{scan.address.slice(0, 20)}...</td>
                  <td>{scan.network}</td>
                  <td>
                    {scan.status === 'completed' && (
                      <span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span>
                    )}
                    {scan.status === 'failed' && (
                      <span className="wallet-scraper-badge wallet-scraper-badge-error">Failed</span>
                    )}
                    {scan.status === 'pending' && (
                      <span className="wallet-scraper-badge wallet-scraper-badge-warning">Pending</span>
                    )}
                  </td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>{scan.transactions}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{scan.duration}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      {scan.status === 'completed' && (
                        <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Export</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


