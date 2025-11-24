'use client'

import { useState } from 'react'

export default function DocumentsVaultSettings() {
  const [settings, setSettings] = useState({
    autoIndex: true,
    virusScan: true,
    compression: false,
    encryption: true,
    retentionDays: 365,
    maxFileSize: 50,
    allowedTypes: ['pdf', 'docx', 'xlsx', 'png', 'jpg'],
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Storage Settings */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Storage Settings</div>
        </div>
        <div className="documents-card-body">
          <div className="documents-grid-2">
            <div>
              <label className="documents-label">Maximum Storage</label>
              <input
                type="number"
                className="documents-input"
                placeholder="100"
                value="100"
                disabled
              />
              <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)', display: 'block' }}>
                GB (contact admin to increase)
              </small>
            </div>
            <div>
              <label className="documents-label">Retention Period</label>
              <select
                className="documents-select"
                value={settings.retentionDays}
                onChange={(e) => updateSetting('retentionDays', parseInt(e.target.value))}
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
                <option value="730">2 years</option>
                <option value="-1">Never delete</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Settings */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Upload Settings</div>
        </div>
        <div className="documents-card-body">
          <div className="documents-grid-2">
            <div>
              <label className="documents-label">Maximum File Size (MB)</label>
              <input
                type="number"
                className="documents-input"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="documents-label">Allowed File Types</label>
              <select className="documents-select" multiple style={{ height: '120px' }}>
                <option value="pdf" selected>PDF</option>
                <option value="docx" selected>Word (DOCX)</option>
                <option value="xlsx" selected>Excel (XLSX)</option>
                <option value="png" selected>PNG</option>
                <option value="jpg" selected>JPG</option>
                <option value="txt">TXT</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Security Settings</div>
        </div>
        <div className="documents-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.encryption}
                onChange={(e) => updateSetting('encryption', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Enable Encryption</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Encrypt all documents at rest
                </div>
              </div>
            </label>
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.virusScan}
                onChange={(e) => updateSetting('virusScan', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Virus Scanning</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Scan all uploaded files for viruses
                </div>
              </div>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoIndex}
                onChange={(e) => updateSetting('autoIndex', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Auto-Indexing</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Automatically index document content for search
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Performance Settings</div>
        </div>
        <div className="documents-card-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.compression}
                onChange={(e) => updateSetting('compression', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <div>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-semibold)' }}>Auto-Compression</span>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
                  Automatically compress large files to save storage
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Access Control</div>
        </div>
        <div className="documents-card-body">
          <div className="documents-grid-2">
            <div>
              <label className="documents-label">Default Access Level</label>
              <select className="documents-select">
                <option>Private</option>
                <option>Team</option>
                <option>Public</option>
              </select>
            </div>
            <div>
              <label className="documents-label">Share Expiration</label>
              <select className="documents-select">
                <option>Never</option>
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        <button className="documents-btn">Save All Settings</button>
      </div>
    </div>
  )
}


