'use client'

import { useState } from 'react'

export default function DocumentsVaultSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    category: 'all',
    dateFrom: '',
    dateTo: '',
    fileType: 'all',
    minSize: '',
    maxSize: '',
  })

  const searchResults = [
    {
      id: '1',
      name: 'Mining_Contract_2024.pdf',
      category: 'Contracts',
      size: '2.4 MB',
      uploaded: '2025-01-15 14:30',
      matchScore: 95,
      snippet: '...mining contract agreement for 2024 fiscal year...',
    },
    {
      id: '2',
      name: 'Electricity_Report_Q4.xlsx',
      category: 'Reports',
      size: '1.8 MB',
      uploaded: '2025-01-14 09:15',
      matchScore: 87,
      snippet: '...Q4 electricity consumption and cost analysis...',
    },
  ]

  return (
    <div>
      {/* Search Bar */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Search Documents</div>
        </div>
        <div className="documents-card-body">
          <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
            <input
              type="text"
              className="documents-input"
              placeholder="Search by name, content, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '50px', fontSize: 'var(--text-base)' }}
            />
            <button
              className="documents-btn"
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="documents-grid-3">
            <div>
              <label className="documents-label">Category</label>
              <select
                className="documents-select"
                value={searchFilters.category}
                onChange={(e) => setSearchFilters({ ...searchFilters, category: e.target.value })}
              >
                <option value="all">All Categories</option>
                <option value="contracts">Contracts</option>
                <option value="reports">Reports</option>
                <option value="financial">Financial</option>
                <option value="technical">Technical</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="documents-label">File Type</label>
              <select
                className="documents-select"
                value={searchFilters.fileType}
                onChange={(e) => setSearchFilters({ ...searchFilters, fileType: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel</option>
                <option value="docx">Word</option>
                <option value="png">Image</option>
              </select>
            </div>
            <div>
              <label className="documents-label">Date Range</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type="date"
                  className="documents-input"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters({ ...searchFilters, dateFrom: e.target.value })}
                />
                <input
                  type="date"
                  className="documents-input"
                  value={searchFilters.dateTo}
                  onChange={(e) => setSearchFilters({ ...searchFilters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <button className="documents-btn">Apply Filters</button>
            <button className="documents-btn-secondary" onClick={() => setSearchFilters({ category: 'all', dateFrom: '', dateTo: '', fileType: 'all', minSize: '', maxSize: '' })}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">
              Search Results ({searchResults.length})
            </div>
            <button className="documents-btn-secondary">Export Results</button>
          </div>
          <div className="documents-card-body">
            {searchResults.map((result) => (
              <div key={result.id} className="documents-file-item" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                  <div className="documents-file-icon" style={{ marginRight: 'var(--space-3)' }}>📄</div>
                  <div className="documents-file-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                      <div className="documents-file-name">{result.name}</div>
                      <span className="documents-badge documents-badge-info">{result.category}</span>
                      <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                        {result.matchScore}% match
                      </span>
                    </div>
                    <div className="documents-file-meta" style={{ marginBottom: 'var(--space-2)' }}>
                      {result.size} • {result.uploaded}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                      {result.snippet}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                  <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Recent Searches</div>
          <button className="documents-btn-secondary">Clear History</button>
        </div>
        <div className="documents-card-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {['mining contract', 'Q4 report', 'financial audit', 'hardware specs'].map((term, index) => (
              <button
                key={index}
                className="documents-btn-secondary"
                style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)' }}
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


