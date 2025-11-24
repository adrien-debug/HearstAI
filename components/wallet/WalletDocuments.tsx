'use client'

import { useState } from 'react'

export default function WalletDocuments() {
  const [activeSubSection, setActiveSubSection] = useState('all')

  const subSections = [
    { id: 'all', label: 'All Documents' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'reports', label: 'Reports' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'statements', label: 'Statements' },
    { id: 'uploads', label: 'Upload' },
  ]

  const documents = [
    {
      id: '1',
      name: 'Mining Contract - DP01',
      type: 'Contract',
      category: 'contracts',
      size: '2.4 MB',
      date: '2024-03-19',
      uploadDate: '2024-03-20',
      tags: ['mining', 'dp01'],
    },
    {
      id: '2',
      name: 'Profitability Report - Q4 2024',
      type: 'Report',
      category: 'reports',
      size: '1.8 MB',
      date: '2024-12-31',
      uploadDate: '2025-01-05',
      tags: ['report', 'q4'],
    },
    {
      id: '3',
      name: 'Invoice INV-0153',
      type: 'Invoice',
      category: 'invoices',
      size: '456 KB',
      date: '2024-08-15',
      uploadDate: '2024-08-16',
      tags: ['invoice', 'august'],
    },
    {
      id: '4',
      name: 'Bank Statement - January 2025',
      type: 'Statement',
      category: 'statements',
      size: '3.2 MB',
      date: '2025-01-31',
      uploadDate: '2025-02-01',
      tags: ['statement', 'january'],
    },
  ]

  const filteredDocuments = activeSubSection === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeSubSection)

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
          <div className="kpi-label">Total Documents</div>
          <div className="kpi-value">247</div>
          <div className="kpi-description">All documents</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Storage Used</div>
          <div className="kpi-value">1.24 GB</div>
          <div className="kpi-description">of 10 GB</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Recent Uploads</div>
          <div className="kpi-value">12</div>
          <div className="kpi-description">Last 30 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Storage Available</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)', color: '#C5FFA7' }}>8.76 GB</div>
          <div className="kpi-description">Remaining space</div>
        </div>
      </div>

      {/* Upload Section */}
      {activeSubSection === 'uploads' && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">Upload Document</div>
            </div>
            <div className="wallet-card-body">
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="wallet-label">Document Name</label>
                <input type="text" className="wallet-input" placeholder="Enter document name" />
              </div>
              <div className="wallet-grid-3">
                <div>
                  <label className="wallet-label">Category</label>
                  <select className="wallet-select">
                    <option>Contract</option>
                    <option>Report</option>
                    <option>Invoice</option>
                    <option>Statement</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="wallet-label">Date</label>
                  <input type="date" className="wallet-input" />
                </div>
                <div>
                  <label className="wallet-label">Tags</label>
                  <input type="text" className="wallet-input" placeholder="tag1, tag2, tag3" />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-6)', border: '2px dashed rgba(197, 255, 167, 0.3)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Drop files here or click to browse</div>
                <input type="file" style={{ display: 'none' }} id="file-upload" />
                <button 
                  className="wallet-btn"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </button>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button className="wallet-btn">Upload Document</button>
                <button className="wallet-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {(activeSubSection !== 'uploads') && (
        <div>
          <div className="wallet-card">
            <div className="wallet-card-header">
              <div className="wallet-card-title">
                {activeSubSection === 'all' && 'All Documents'}
                {activeSubSection === 'contracts' && 'Contracts'}
                {activeSubSection === 'reports' && 'Reports'}
                {activeSubSection === 'invoices' && 'Invoices'}
                {activeSubSection === 'statements' && 'Statements'}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <input 
                  type="text" 
                  className="wallet-input" 
                  placeholder="Search documents..." 
                  style={{ width: '200px' }}
                />
                <button className="wallet-btn">Export</button>
              </div>
            </div>
            <div className="wallet-table-container">
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Upload Date</th>
                    <th>Size</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{doc.name}</td>
                      <td><span className={`wallet-badge ${doc.type === 'Contract' ? 'wallet-badge-success' : doc.type === 'Report' ? 'wallet-badge-warning' : 'wallet-badge-default'}`}>{doc.type}</span></td>
                      <td>{doc.date}</td>
                      <td>{doc.uploadDate}</td>
                      <td>{doc.size}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                          {doc.tags.map((tag, idx) => (
                            <span key={idx} className="wallet-badge" style={{ fontSize: '10px', padding: '2px 6px' }}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                          <button className="wallet-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


