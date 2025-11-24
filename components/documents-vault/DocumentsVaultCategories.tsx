'use client'

import { useState } from 'react'

export default function DocumentsVaultCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'contracts',
      name: 'Contracts',
      count: 156,
      size: '8.4 GB',
      color: '#C5FFA7',
      description: 'Mining contracts and agreements',
    },
    {
      id: 'reports',
      name: 'Reports',
      count: 234,
      size: '12.3 GB',
      color: '#4a9eff',
      description: 'Monthly and quarterly reports',
    },
    {
      id: 'financial',
      name: 'Financial',
      count: 189,
      size: '9.8 GB',
      color: '#FFA500',
      description: 'Financial statements and audits',
    },
    {
      id: 'technical',
      name: 'Technical',
      count: 312,
      size: '6.2 GB',
      color: '#FF4D4D',
      description: 'Technical specifications and manuals',
    },
    {
      id: 'legal',
      name: 'Legal',
      count: 87,
      size: '3.5 GB',
      color: '#9d4edd',
      description: 'Legal documents and certificates',
    },
    {
      id: 'invoices',
      name: 'Invoices',
      count: 269,
      size: '2.6 GB',
      color: '#06d6a0',
      description: 'Invoices and receipts',
    },
  ]

  return (
    <div>
      {/* Categories Grid */}
      <div className="documents-grid-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="documents-card"
            style={{ cursor: 'pointer', border: selectedCategory === category.id ? '1px solid rgba(197, 255, 167, 0.3)' : undefined }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: category.color }}>
                {category.count}
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: `${category.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>
                📁
              </div>
            </div>
            <div className="documents-card-title" style={{ marginBottom: 'var(--space-1)' }}>{category.name}</div>
            <div className="documents-file-meta" style={{ marginBottom: 'var(--space-2)' }}>{category.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{category.size}</span>
              <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Details */}
      {selectedCategory && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">
              {categories.find(c => c.id === selectedCategory)?.name} - Documents
            </div>
            <button className="documents-btn-secondary" onClick={() => setSelectedCategory(null)}>Close</button>
          </div>
          <div className="documents-table-container">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Modified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>Sample_Document.pdf</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>2.4 MB</td>
                  <td style={{ color: 'var(--text-secondary)' }}>2025-01-15 14:30</td>
                  <td style={{ color: 'var(--text-secondary)' }}>2025-01-15 14:30</td>
                  <td><span className="documents-badge documents-badge-success">Active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Management */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Manage Categories</div>
          <button className="documents-btn">Add Category</button>
        </div>
        <div className="documents-card-body">
          <div className="documents-grid-2">
            <div>
              <label className="documents-label">Category Name</label>
              <input type="text" className="documents-input" placeholder="Enter category name" />
            </div>
            <div>
              <label className="documents-label">Color</label>
              <input type="color" className="documents-input" style={{ height: '42px', cursor: 'pointer' }} defaultValue="#C5FFA7" />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <label className="documents-label">Description</label>
            <textarea
              className="documents-input"
              placeholder="Enter category description"
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }}
            />
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="documents-btn">Create Category</button>
            <button className="documents-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}


