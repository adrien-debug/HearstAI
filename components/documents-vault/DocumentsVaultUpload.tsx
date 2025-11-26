'use client'

import { useState } from 'react'

export default function DocumentsVaultUpload() {
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const categories = [
    'Contracts',
    'Invoices',
    'Reports',
    'Financial',
    'Technical',
    'Legal',
  ]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      const newFiles = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        sizeFormatted: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type || 'application/octet-stream',
        category: '',
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
      setUploading(false)
    }, 1500)
  }

  const removeFile = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id))
  }

  const updateFileCategory = (id: number, category: string) => {
    setUploadedFiles(uploadedFiles.map(f =>
      f.id === id ? { ...f, category } : f
    ))
  }


  const sortedFiles = [...uploadedFiles].sort((a, b) => {
    let comparison = 0
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === 'date') {
      comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
    } else if (sortBy === 'size') {
      comparison = a.size - b.size
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div>
      {/* Upload Area */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Upload documents</div>
        </div>
        <div className="documents-card-body">
          <div
            className={`documents-upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)', color: '#C5FFA7' }}>📤</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              Drag and drop your files here
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              or click to browse
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            <button className="documents-btn">Select files</button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Uploading...</div>
          </div>
          <div className="documents-card-body">
            <div style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>Processing files...</div>
          </div>
        </div>
      )}

      {/* Uploaded Files with Sort and Category */}
      {uploadedFiles.length > 0 && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Uploaded documents ({uploadedFiles.length})</div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <select
                className="documents-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                style={{ width: 'auto', padding: 'var(--space-2) var(--space-3)' }}
              >
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="size">Sort by size</option>
              </select>
              <button
                className="documents-btn-secondary"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{ padding: 'var(--space-2) var(--space-3)' }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
              <button className="documents-btn-secondary" onClick={() => setUploadedFiles([])}>
                Clear all
              </button>
            </div>
          </div>
          <div className="documents-card-body">
            <div className="documents-table-container">
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Document name</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFiles.map((file) => (
                    <tr key={file.id}>
                      <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                        {file.name}
                      </td>
                      <td>
                        <select
                          className="documents-select"
                          value={file.category}
                          onChange={(e) => updateFileCategory(file.id, e.target.value)}
                          style={{ width: '100%', fontSize: 'var(--text-sm)', padding: 'var(--space-1) var(--space-2)' }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{file.sizeFormatted}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                        {file.type.split('/')[1]?.toUpperCase() || 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <span className="documents-badge documents-badge-success">Uploaded</span>
                          <button
                            className="documents-btn-secondary"
                            style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                            onClick={() => removeFile(file.id)}
                          >
                            Delete
                          </button>
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

      {/* File Size Limits */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Upload rules</div>
        </div>
        <div className="documents-card-body">
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Maximum file size: </span>
            <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>50 MB</span>
          </div>
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Supported formats: </span>
            <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>PDF, DOCX, XLSX, PNG, JPG</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Available storage space: </span>
            <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>57.2 GB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
