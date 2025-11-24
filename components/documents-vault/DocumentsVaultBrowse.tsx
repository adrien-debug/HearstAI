'use client'

import { useState } from 'react'

export default function DocumentsVaultBrowse() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'reports', label: 'Reports' },
    { id: 'financial', label: 'Financial' },
    { id: 'technical', label: 'Technical' },
    { id: 'legal', label: 'Legal' },
  ]

  const documents = [
    {
      id: '1',
      name: 'Mining_Contract_2024.pdf',
      category: 'Contracts',
      size: '2.4 MB',
      uploaded: '2025-01-15 14:30',
      modified: '2025-01-15 14:30',
      status: 'active',
      tags: ['Contract', 'Mining'],
    },
    {
      id: '2',
      name: 'Electricity_Report_Q4.xlsx',
      category: 'Reports',
      size: '1.8 MB',
      uploaded: '2025-01-14 09:15',
      modified: '2025-01-14 09:15',
      status: 'active',
      tags: ['Report', 'Q4'],
    },
    {
      id: '3',
      name: 'Hardware_Specifications.docx',
      category: 'Technical',
      size: '3.2 MB',
      uploaded: '2025-01-13 16:45',
      modified: '2025-01-13 16:45',
      status: 'active',
      tags: ['Hardware', 'Technical'],
    },
    {
      id: '4',
      name: 'Financial_Audit_2024.pdf',
      category: 'Financial',
      size: '5.6 MB',
      uploaded: '2025-01-12 11:20',
      modified: '2025-01-12 11:20',
      status: 'active',
      tags: ['Financial', 'Audit'],
    },
    {
      id: '5',
      name: 'Compliance_Certificate.pdf',
      category: 'Legal',
      size: '892 KB',
      uploaded: '2025-01-10 10:00',
      modified: '2025-01-10 10:00',
      status: 'active',
      tags: ['Legal', 'Compliance'],
    },
  ]

  return (
    <div>
      {/* Filters and View Options */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Browse Documents</div>
        </div>
        <div className="documents-card-body">
          <div className="documents-grid-3">
            <div>
              <label className="documents-label">Category</label>
              <select
                className="documents-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="documents-label">Sort By</label>
              <select className="documents-select">
                <option>Date (Newest)</option>
                <option>Date (Oldest)</option>
                <option>Name (A-Z)</option>
                <option>Name (Z-A)</option>
                <option>Size (Largest)</option>
                <option>Size (Smallest)</option>
              </select>
            </div>
            <div>
              <label className="documents-label">View Mode</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? 'documents-btn' : 'documents-btn-secondary'}
                  style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'documents-btn' : 'documents-btn-secondary'}
                  style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      {viewMode === 'table' && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Documents ({documents.length})</div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="documents-btn-secondary">Select All</button>
              <button className="documents-btn-secondary">Delete Selected</button>
            </div>
          </div>
          <div className="documents-table-container">
            <table className="documents-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                  </th>
                  <th>Document Name</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Modified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <input type="checkbox" style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{doc.name}</td>
                    <td><span className="documents-badge documents-badge-info">{doc.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{doc.size}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{doc.uploaded}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{doc.modified}</td>
                    <td><span className="documents-badge documents-badge-success">{doc.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                        <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                        <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Documents Grid View */}
      {viewMode === 'grid' && (
        <div className="documents-grid-4">
          {documents.map((doc) => (
            <div key={doc.id} className="documents-card" style={{ cursor: 'pointer' }}>
              <div className="documents-file-icon">📄</div>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <div className="documents-file-name" style={{ marginBottom: 'var(--space-2)' }}>{doc.name}</div>
                <div className="documents-file-meta" style={{ marginBottom: 'var(--space-2)' }}>
                  <div>{doc.size}</div>
                  <div>{doc.category}</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', flex: 1 }}>View</button>
                  <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', flex: 1 }}>Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


