import { useState } from 'react';
import { formatDateTime } from '../../../lib/dateUtils';

export default function Incidents() {
  const [filter, setFilter] = useState('all');

  const incidents = [
    { id: 'INC001', type: 'Warning', severity: 'Medium', description: 'High temperature detected on miner #1234', location: 'Facility A', timestamp: '2024-12-15T14:30:00Z', status: 'Resolved' },
    { id: 'INC002', type: 'Error', severity: 'High', description: 'Connection lost to hosting provider', location: 'Facility B', timestamp: '2024-12-15T12:15:00Z', status: 'Active' },
    { id: 'INC003', type: 'Warning', severity: 'Low', description: 'Hashrate drop detected', location: 'Facility A', timestamp: '2024-12-15T10:00:00Z', status: 'Resolved' },
    { id: 'INC004', type: 'Error', severity: 'Critical', description: 'Power outage detected', location: 'Facility C', timestamp: '2024-12-14T18:45:00Z', status: 'Resolved' },
    { id: 'INC005', type: 'Info', severity: 'Low', description: 'Scheduled maintenance completed', location: 'Facility A', timestamp: '2024-12-14T16:00:00Z', status: 'Resolved' }
  ];

  const filteredIncidents = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);

  const getSeverityBadge = (severity) => {
    const badges = {
      Critical: { class: 'badge-danger', text: 'CRITICAL' },
      High: { class: 'badge-warning', text: 'HIGH' },
      Medium: { class: 'badge-warning', text: 'MEDIUM' },
      Low: { class: 'badge-info', text: 'LOW' }
    };
    return badges[severity] || badges.Low;
  };

  const formatTimestamp = (timestamp) => {
    return formatDateTime(timestamp);
  };

  return (
    <div className="section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Incidents</div>
          <div className="stat-value">{incidents.length}</div>
          <div className="stat-change">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value" style={{ color: '#e74c3c' }}>{incidents.filter(i => i.status === 'Active').length}</div>
          <div className="stat-change">Requires attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolved</div>
          <div className="stat-value green">{incidents.filter(i => i.status === 'Resolved').length}</div>
          <div className="stat-change">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical</div>
          <div className="stat-value" style={{ color: '#e74c3c' }}>{incidents.filter(i => i.severity === 'Critical').length}</div>
          <div className="stat-change">High priority</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Incidents & Alerts</h3>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--primary-grey)',
              border: '1px solid var(--grey-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Location</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => {
                const badge = getSeverityBadge(incident.severity);
                return (
                  <tr key={incident.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{incident.id}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className="badge badge-info">{incident.type}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{incident.description}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>{incident.location}</td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{formatTimestamp(incident.timestamp)}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className={`badge ${incident.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

