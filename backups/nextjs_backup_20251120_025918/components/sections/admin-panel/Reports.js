import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Reports() {
  const [schedule, setSchedule] = useState('weekly');

  const reports = [
    { id: 'RPT001', name: 'Weekly Financial Summary', type: 'Financial', schedule: 'Weekly', lastRun: '2024-12-15', status: 'active', recipients: 5 },
    { id: 'RPT002', name: 'Monthly Operations Report', type: 'Operations', schedule: 'Monthly', lastRun: '2024-12-01', status: 'active', recipients: 8 },
    { id: 'RPT003', name: 'Quarterly Executive Dashboard', type: 'Executive', schedule: 'Quarterly', lastRun: '2024-10-01', status: 'active', recipients: 12 },
    { id: 'RPT004', name: 'Daily System Health', type: 'Technical', schedule: 'Daily', lastRun: '2024-12-15', status: 'active', recipients: 3 },
    { id: 'RPT005', name: 'Annual Compliance Report', type: 'Legal', schedule: 'Yearly', lastRun: '2024-01-01', status: 'paused', recipients: 15 }
  ];

  const activeReports = reports.filter(r => r.status === 'active').length;

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Reports</h2>
          <p className="section-subtitle">Rapports automatisés</p>
        </div>
        <button className="btn btn-primary">+ Create Report</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{reports.length}</div>
          <div className="stat-change">All schedules</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Reports</div>
          <div className="stat-value green">{activeReports}</div>
          <div className="stat-change">Currently running</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Recipients</div>
          <div className="stat-value">{reports.reduce((sum, r) => sum + r.recipients, 0)}</div>
          <div className="stat-change">Email subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reports This Month</div>
          <div className="stat-value green">47</div>
          <div className="stat-change">Generated</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Automated Reports</h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['all', 'daily', 'weekly', 'monthly', 'quarterly'].map(s => (
              <button
                key={s}
                className={`filter-btn ${schedule === s ? 'active' : ''}`}
                onClick={() => setSchedule(s)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: schedule === s ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                  border: `1px solid ${schedule === s ? '#C5FFA7' : 'var(--grey-100)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: schedule === s ? '#C5FFA7' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Report Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Schedule</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Run</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Recipients</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{report.name}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className="badge badge-info">{report.type}</span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{report.schedule}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {formatDateShort(report.lastRun)}
                  </td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{report.recipients}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span className={`badge ${report.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-sm btn-ghost">Edit</button>
                      <button className="btn btn-sm btn-ghost">Run Now</button>
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

