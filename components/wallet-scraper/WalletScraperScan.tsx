'use client'

import { useState } from 'react'

export default function WalletScraperScan() {
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('btc')
  const [scanDepth, setScanDepth] = useState('standard')
  const [includeNfts, setIncludeNfts] = useState('yes')

  const handleScan = () => {
    console.log('Starting scan:', { address, network, scanDepth, includeNfts })
    // Scan logic would go here
  }

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Scan Status</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: '#C5FFA7' }}>Ready</div>
          <div className="kpi-description">System ready for scan</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Queue Position</div>
          <div className="kpi-value">2</div>
          <div className="kpi-description">Scans in queue</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Scan Time</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>12.5s</div>
          <div className="kpi-description">Average duration</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">API Rate Limit</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: '#C5FFA7' }}>45/60</div>
          <div className="kpi-description">Requests per minute</div>
        </div>
      </div>

      {/* Scan Form */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Scan Wallet Address</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="wallet-scraper-label">Wallet Address</label>
            <input
              type="text"
              className="wallet-scraper-input"
              placeholder="Enter BTC, ETH, or multi-chain address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
              Supports Bitcoin (BTC), Ethereum (ETH), and multi-chain addresses
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
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="multi">Multi-chain</option>
                <option value="auto">Auto-detect</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Scan Depth</label>
              <select
                className="wallet-scraper-select"
                value={scanDepth}
                onChange={(e) => setScanDepth(e.target.value)}
              >
                <option value="standard">Standard (100 txs)</option>
                <option value="deep">Deep (500 txs)</option>
                <option value="full">Full (All txs)</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Include NFTs</label>
              <select
                className="wallet-scraper-select"
                value={includeNfts}
                onChange={(e) => setIncludeNfts(e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="wallet-scraper-btn" onClick={handleScan}>Start Scan</button>
            <button className="wallet-scraper-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Scan Options */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Advanced Options</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-2">
            <div>
              <label className="wallet-scraper-label">Transaction Filter</label>
              <select className="wallet-scraper-select">
                <option>All Transactions</option>
                <option>Received Only</option>
                <option>Sent Only</option>
                <option>Mining Payouts</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Date Range</label>
              <select className="wallet-scraper-select">
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Include Internal Transactions</label>
              <select className="wallet-scraper-select">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Export Format</label>
              <select className="wallet-scraper-select">
                <option>JSON</option>
                <option>CSV</option>
                <option>Excel</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


