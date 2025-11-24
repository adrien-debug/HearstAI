'use client'

import { useState } from 'react'

export default function WalletScraperBatch() {
  const [addresses, setAddresses] = useState('')
  const [network, setNetwork] = useState('auto')
  const [scanMode, setScanMode] = useState('standard')
  const [batchStatus, setBatchStatus] = useState('ready')

  const handleBatchScan = () => {
    const addressList = addresses.split('\n').filter(addr => addr.trim())
    console.log('Starting batch scan:', { addressList, network, scanMode })
    setBatchStatus('processing')
    // Batch scan logic would go here
  }

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Batch Status</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)', color: '#C5FFA7' }}>
            {batchStatus === 'ready' ? 'Ready' : batchStatus === 'processing' ? 'Processing' : 'Completed'}
          </div>
          <div className="kpi-description">Current batch status</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Addresses in Queue</div>
          <div className="kpi-value">{addresses.split('\n').filter(addr => addr.trim()).length || 0}</div>
          <div className="kpi-description">Pending addresses</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Estimated Time</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>
            {Math.ceil((addresses.split('\n').filter(addr => addr.trim()).length || 0) * 12.5 / 60)} min
          </div>
          <div className="kpi-description">Approximate duration</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Rate Limit</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)', color: '#C5FFA7' }}>45/60</div>
          <div className="kpi-description">API requests/min</div>
        </div>
      </div>

      {/* Batch Scan Form */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Batch Scan Configuration</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="wallet-scraper-label">Addresses (one per line)</label>
            <textarea
              className="wallet-scraper-textarea"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              placeholder="bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst&#10;bc1qtsgpnjqq54t6n7upzk0rw8nyylfqw7l2f3vlly&#10;0x581cd214EE109Caa719559e41341CE8C1d9cC638"
            />
            <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
              Enter one wallet address per line. Supports up to 100 addresses per batch.
            </small>
          </div>
          
          <div className="wallet-scraper-grid-3">
            <div>
              <label className="wallet-scraper-label">Network</label>
              <select
                className="wallet-scraper-select"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value="auto">Auto-detect</option>
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Scan Mode</label>
              <select
                className="wallet-scraper-select"
                value={scanMode}
                onChange={(e) => setScanMode(e.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="deep">Deep</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Include NFTs</label>
              <select className="wallet-scraper-select">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="wallet-scraper-btn" onClick={handleBatchScan} disabled={batchStatus === 'processing'}>
              {batchStatus === 'processing' ? 'Processing...' : 'Start Batch Scan'}
            </button>
            <button className="wallet-scraper-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Progress (if processing) */}
      {batchStatus === 'processing' && (
        <div className="wallet-scraper-card">
          <div className="wallet-scraper-card-header">
            <div className="wallet-scraper-card-title">Batch Progress</div>
          </div>
          <div className="wallet-scraper-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>45%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '45%', background: '#C5FFA7', borderRadius: 'var(--radius-full)', transition: 'width var(--duration-normal)' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>5 of 12 addresses scanned</span>
              <span>Estimated 3 min remaining</span>
            </div>
          </div>
        </div>
      )}

      {/* Batch Results Preview */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Batch Results</div>
          <button className="wallet-scraper-btn">Export All</button>
        </div>
        <div className="wallet-scraper-table-container">
          <table className="wallet-scraper-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Network</th>
                <th>Status</th>
                <th>Transactions</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="wallet-scraper-address">bc1q9q0hxgwsdearj6ch0ks97acra2hm9jwv8cllst</td>
                <td>BTC</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span></td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>1,247</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>8.563 BTC</td>
                <td>
                  <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
              <tr>
                <td className="wallet-scraper-address">0x581cd214EE109Caa719559e41341CE8C1d9cC638</td>
                <td>ETH</td>
                <td><span className="wallet-scraper-badge wallet-scraper-badge-success">Completed</span></td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>892</td>
                <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>245.789 ETH</td>
                <td>
                  <button className="wallet-scraper-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


