import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Documents() {
  const [filter, setFilter] = useState('all');

  const documents = [
    { id: 'DOC001', name: 'Q4 Financial Report 2024', type: 'PDF', category: 'Finance', size: '2.4 MB', date: '2024-12-15', author: 'Michael Johnson' },
    { id: 'DOC002', name: 'Engineering Roadmap 2025', type: 'PDF', category: 'Engineering', size: '1.8 MB', date: '2024-12-10', author: 'Sarah Anderson' },
    { id: 'DOC003', name: 'Compliance Audit Results', type: 'PDF', category: 'Legal', size: '3.2 MB', date: '2024-12-08', author: 'Patricia Brown' },
    { id: 'DOC004', name: 'Marketing Strategy Q1', type: 'DOCX', category: 'Marketing', size: '856 KB', date: '2024-12-05', author: 'Emily Davis' },
    { id: 'DOC005', name: 'Infrastructure Blueprint', type: 'PDF', category: 'Operations', size: '5.1 MB', date: '2024-12-01', author: 'David Lee' }
  ];

  const categories = ['all', 'Finance', 'Engineering', 'Legal', 'Marketing', 'Operations'];

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === filter);

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Documents</h2>
          <p className="section-subtitle">Gestion documentaire</p>
        </div>
        <button className="btn btn-primary">+ Upload Document</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Documents</div>
          <div className="stat-value">{documents.length}</div>
          <div className="stat-change">All categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Size</div>
          <div className="stat-value">13.4 MB</div>
          <div className="stat-change">Storage used</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{categories.length - 1}</div>
          <div className="stat-change">Active folders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Recent Uploads</div>
          <div className="stat-value green">3</div>
          <div className="stat-change">Last 7 days</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">All Documents</h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: filter === cat ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                  border: `1px solid ${filter === cat ? '#C5FFA7' : 'var(--grey-100)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: filter === cat ? '#C5FFA7' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Size</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Author</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{doc.name}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className="badge badge-info">{doc.category}</span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{doc.type}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>{doc.size}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{doc.author}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {formatDateShort(doc.date)}
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-sm btn-ghost">View</button>
                      <button className="btn btn-sm btn-ghost">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

