import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Reports() {
  const [schedule, setSchedule] = useState('all');

  const reports = [
    { id: 'RPT001', name: 'Daily Production Report', type: 'Production', schedule: 'Daily', lastRun: '2024-12-15', status: 'Active', recipients: 5 },
    { id: 'RPT002', name: 'Weekly Energy Report', type: 'Energy', schedule: 'Weekly', lastRun: '2024-12-14', status: 'Active', recipients: 3 },
    { id: 'RPT003', name: 'Monthly Financial Report', type: 'Financial', schedule: 'Monthly', lastRun: '2024-12-01', status: 'Active', recipients: 8 },
    { id: 'RPT004', name: 'Incident Summary', type: 'Incidents', schedule: 'Daily', lastRun: '2024-12-15', status: 'Active', recipients: 2 },
    { id: 'RPT005', name: 'Quarterly Review', type: 'Summary', schedule: 'Quarterly', lastRun: '2024-10-01', status: 'Inactive', recipients: 10 }
  ];

  const filteredReports = schedule === 'all' ? reports : reports.filter(r => r.schedule === schedule);

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Reports</div>
          <div className="stat-value">{reports.length}</div>
          <div className="stat-change">All reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{reports.filter(r => r.status === 'Active').length}</div>
          <div className="stat-change">Scheduled</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Daily</div>
          <div className="stat-value">{reports.filter(r => r.schedule === 'Daily').length}</div>
          <div className="stat-change">Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Recipients</div>
          <div className="stat-value">{reports.reduce((sum, r) => sum + r.recipients, 0)}</div>
          <div className="stat-change">All reports</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">System Reports</h3>
          <select
            className="filter-select"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--primary-grey)',
              border: '1px solid var(--grey-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)'
            }}
          >
            <option value="all">All Schedules</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Schedule</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Run</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Recipients</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{report.id}</td>
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
                    <span className={`badge ${report.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {report.status}
                    </span>
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


