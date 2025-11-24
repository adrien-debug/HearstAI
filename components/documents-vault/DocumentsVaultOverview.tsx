'use client'

export default function DocumentsVaultOverview() {
  const recentDocuments = [
    {
      id: '1',
      name: 'Mining_Contract_2024.pdf',
      category: 'Contracts',
      size: '2.4 MB',
      uploaded: '2025-01-15 14:30',
      status: 'active',
    },
    {
      id: '2',
      name: 'Electricity_Report_Q4.xlsx',
      category: 'Reports',
      size: '1.8 MB',
      uploaded: '2025-01-14 09:15',
      status: 'active',
    },
    {
      id: '3',
      name: 'Hardware_Specifications.docx',
      category: 'Technical',
      size: '3.2 MB',
      uploaded: '2025-01-13 16:45',
      status: 'active',
    },
    {
      id: '4',
      name: 'Financial_Audit_2024.pdf',
      category: 'Financial',
      size: '5.6 MB',
      uploaded: '2025-01-12 11:20',
      status: 'active',
    },
    {
      id: '5',
      name: 'Compliance_Certificate.pdf',
      category: 'Legal',
      size: '892 KB',
      uploaded: '2025-01-10 10:00',
      status: 'active',
    },
  ]

  return (
    <div>
      {/* Main KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Documents</div>
          <div className="kpi-value">1,247</div>
          <div className="kpi-description">All stored documents</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Storage Used</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>42.8 GB</div>
          <div className="kpi-description">of 100 GB available</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Categories</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>12</div>
          <div className="kpi-description">Document categories</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Last 30 Days</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>+89</div>
          <div className="kpi-description">New documents</div>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="documents-grid-2">
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Storage Overview</div>
          </div>
          <div className="documents-card-body">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Used Storage</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>42.8 GB / 100 GB</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '42.8%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Available</span>
              <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>57.2 GB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Usage</span>
              <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>42.8%</span>
            </div>
          </div>
        </div>
        <div className="documents-card">
          <div className="documents-card-header">
            <div className="documents-card-title">Document Types</div>
          </div>
          <div className="documents-card-body">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>PDF</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>524 (42%)</span>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Excel</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>312 (25%)</span>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Word</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>267 (21%)</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Other</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>144 (12%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Recent Documents</div>
          <button className="documents-btn-secondary">View All</button>
        </div>
        <div className="documents-table-container">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{doc.name}</td>
                  <td><span className="documents-badge documents-badge-info">{doc.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{doc.size}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{doc.uploaded}</td>
                  <td><span className="documents-badge documents-badge-success">{doc.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                      <button className="documents-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


