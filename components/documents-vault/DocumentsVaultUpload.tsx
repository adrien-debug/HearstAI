'use client'

import { useState } from 'react'

export default function DocumentsVaultUpload() {
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

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
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type,
        status: 'uploaded',
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
      setUploading(false)
    }, 1500)
  }

  const removeFile = (id: number) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id))
  }

  return (
    <div>
      {/* Upload Area */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Upload Documents</div>
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
              Drag & Drop files here
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
            <button className="documents-btn">Select Files</button>
          </div>

          {/* Upload Options */}
          <div className="documents-grid-3" style={{ marginTop: 'var(--space-6)' }}>
            <div>
              <label className="documents-label">Category</label>
              <select className="documents-select">
                <option>Select Category</option>
                <option>Contracts</option>
                <option>Reports</option>
                <option>Financial</option>
                <option>Technical</option>
                <option>Legal</option>
              </select>
            </div>
            <div>
              <label className="documents-label">Access Level</label>
              <select className="documents-select">
                <option>Private</option>
                <option>Team</option>
                <option>Public</option>
              </select>
            </div>
            <div>
              <label className="documents-label">Auto-Index</label>
              <select className="documents-select">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress / Uploaded Files */}
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

      {uploadedFiles.length > 0 && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Uploaded Files ({uploadedFiles.length})</div>
            <button className="documents-btn-secondary" onClick={() => setUploadedFiles([])}>Clear All</button>
          </div>
          <div className="documents-card-body">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="documents-file-item">
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div className="documents-file-icon">📄</div>
                  <div className="documents-file-info">
                    <div className="documents-file-name">{file.name}</div>
                    <div className="documents-file-meta">{file.size} • {file.type || 'Unknown type'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <span className="documents-badge documents-badge-success">Uploaded</span>
                  <button
                    className="documents-btn-secondary"
                    style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                    onClick={() => removeFile(file.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Size Limits */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Upload Guidelines</div>
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
            <span style={{ color: 'var(--text-secondary)' }}>Total storage available: </span>
            <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>57.2 GB</span>
          </div>
        </div>
      </div>
    </div>
  )
}


