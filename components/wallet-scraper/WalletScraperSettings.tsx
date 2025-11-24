'use client'

import { useState } from 'react'

export default function WalletScraperSettings() {
  const [settings, setSettings] = useState({
    autoScan: false,
    defaultNetwork: 'auto',
    defaultScanDepth: 'standard',
    includeNfts: true,
    rateLimit: 60,
    timeout: 30,
    retryAttempts: 3,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* API Configuration */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">API Configuration</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-2">
            <div>
              <label className="wallet-scraper-label">Blockchain.com API Key</label>
              <input
                type="text"
                className="wallet-scraper-input"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">Etherscan API Key</label>
              <input
                type="text"
                className="wallet-scraper-input"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">BSCScan API Key</label>
              <input
                type="text"
                className="wallet-scraper-input"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">PolygonScan API Key</label>
              <input
                type="text"
                className="wallet-scraper-input"
                placeholder="Enter API key"
              />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="wallet-scraper-btn">Save API Keys</button>
          </div>
        </div>
      </div>

      {/* Scan Settings */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Scan Settings</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-3">
            <div>
              <label className="wallet-scraper-label">Default Network</label>
              <select
                className="wallet-scraper-select"
                value={settings.defaultNetwork}
                onChange={(e) => updateSetting('defaultNetwork', e.target.value)}
              >
                <option value="auto">Auto-detect</option>
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Default Scan Depth</label>
              <select
                className="wallet-scraper-select"
                value={settings.defaultScanDepth}
                onChange={(e) => updateSetting('defaultScanDepth', e.target.value)}
              >
                <option value="standard">Standard (100 txs)</option>
                <option value="deep">Deep (500 txs)</option>
                <option value="full">Full (All txs)</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Include NFTs by Default</label>
              <select
                className="wallet-scraper-select"
                value={settings.includeNfts ? 'yes' : 'no'}
                onChange={(e) => updateSetting('includeNfts', e.target.value === 'yes')}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Performance Settings</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div className="wallet-scraper-grid-3">
            <div>
              <label className="wallet-scraper-label">Rate Limit (requests/min)</label>
              <input
                type="number"
                className="wallet-scraper-input"
                value={settings.rateLimit}
                onChange={(e) => updateSetting('rateLimit', parseInt(e.target.value) || 60)}
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">Request Timeout (seconds)</label>
              <input
                type="number"
                className="wallet-scraper-input"
                value={settings.timeout}
                onChange={(e) => updateSetting('timeout', parseInt(e.target.value) || 30)}
                min="5"
                max="300"
              />
            </div>
            <div>
              <label className="wallet-scraper-label">Retry Attempts</label>
              <input
                type="number"
                className="wallet-scraper-input"
                value={settings.retryAttempts}
                onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value) || 3)}
                min="0"
                max="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Scan Settings */}
      <div className="wallet-scraper-card">
        <div className="wallet-scraper-card-header">
          <div className="wallet-scraper-card-title">Auto-Scan Settings</div>
        </div>
        <div className="wallet-scraper-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoScan}
                onChange={(e) => updateSetting('autoScan', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: 'var(--text-primary)' }}>Enable auto-scan for monitored wallets</span>
            </label>
          </div>
          <div className="wallet-scraper-grid-2">
            <div>
              <label className="wallet-scraper-label">Auto-Scan Interval</label>
              <select className="wallet-scraper-select">
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
                <option>Every hour</option>
                <option>Every 6 hours</option>
                <option>Daily</option>
              </select>
            </div>
            <div>
              <label className="wallet-scraper-label">Notification Method</label>
              <select className="wallet-scraper-select">
                <option>Email</option>
                <option>Webhook</option>
                <option>Both</option>
                <option>None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        <button className="wallet-scraper-btn">Save All Settings</button>
      </div>
    </div>
  )
}


