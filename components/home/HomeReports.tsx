'use client'

export default function HomeReports() {
  const reports = [
    { id: 1, name: 'Monthly Revenue Report', date: '2025-01-01', type: 'Revenue', status: 'completed' },
    { id: 2, name: 'Job Performance Analysis', date: '2025-01-15', type: 'Performance', status: 'completed' },
    { id: 3, name: 'System Health Report', date: '2025-01-18', type: 'System', status: 'generating' },
    { id: 4, name: 'Weekly Summary Report', date: '2025-01-17', type: 'Summary', status: 'completed' },
  ]

  return (
    <div>
      {/* Reports List */}
      <div className="home-card">
        <div className="home-card-header">
          <div className="home-card-title">Available Reports</div>
          <button className="home-btn">Generate New Report</button>
        </div>
        <div className="home-table-container">
          <table className="home-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{report.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{report.type}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{report.date}</td>
                  <td>
                    {report.status === 'completed' ? (
                      <span className="home-badge home-badge-success">Completed</span>
                    ) : (
                      <span className="home-badge home-badge-warning">Generating</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="home-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>
                        View
                      </button>
                      <button className="home-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>
                        Download
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
  )
}


