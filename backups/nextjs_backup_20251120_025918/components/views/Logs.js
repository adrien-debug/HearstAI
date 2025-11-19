import { useState } from 'react';
import { useLogs } from '../../hooks/useAPI';
import { Icons } from '../../lib/icons';
import { formatDateTimeWithSeconds } from '../../lib/dateUtils';

export default function Logs() {
  const { data, loading, error, refetch } = useLogs();
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback data si l'API ne retourne rien
  const defaultLogs = [
    { id: 'L001', level: 'success', message: 'Job #abc123 completed successfully', timestamp: '2024-12-15T14:30:00Z', source: 'JobExecutor', details: 'Project Alpha - Code review completed' },
    { id: 'L002', level: 'info', message: 'New project created: Project Beta', timestamp: '2024-12-15T14:25:00Z', source: 'ProjectService', details: 'Created by user@example.com' },
    { id: 'L003', level: 'warning', message: 'High memory usage detected', timestamp: '2024-12-15T14:20:00Z', source: 'SystemMonitor', details: 'Memory usage: 85%' },
    { id: 'L004', level: 'error', message: 'Failed to connect to API endpoint', timestamp: '2024-12-15T14:15:00Z', source: 'APIService', details: 'Connection timeout after 30s' },
    { id: 'L005', level: 'info', message: 'Version v1.2.3 deployed to production', timestamp: '2024-12-15T14:10:00Z', source: 'DeploymentService', details: 'Project Alpha - Stable release' },
    { id: 'L006', level: 'success', message: 'Database backup completed', timestamp: '2024-12-15T14:00:00Z', source: 'BackupService', details: 'Backup size: 2.4 GB' },
    { id: 'L007', level: 'info', message: 'User login: admin@example.com', timestamp: '2024-12-15T13:55:00Z', source: 'AuthService', details: 'IP: 192.168.1.100' },
    { id: 'L008', level: 'warning', message: 'Slow query detected', timestamp: '2024-12-15T13:50:00Z', source: 'Database', details: 'Query took 2.3s' }
  ];

  const logs = data?.logs || data || defaultLogs;

  const filteredLogs = logs.filter(log => {
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSearch = !searchTerm || 
      log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    success: logs.filter(l => l.level === 'success').length
  };

  const getLevelBadge = (level) => {
    const badges = {
      success: { class: 'badge-success', text: 'SUCCESS' },
      info: { class: 'badge-info', text: 'INFO' },
      warning: { class: 'badge-warning', text: 'WARNING' },
      error: { class: 'badge-danger', text: 'ERROR' }
    };
    return badges[level] || badges.info;
  };

  const formatTimestamp = (timestamp) => {
    return formatDateTimeWithSeconds(timestamp);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="logs-view">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-view">
        <div className="card">
          <div className="card-body">
            <h3 className="text-danger">Error loading logs</h3>
            <p className="text-secondary">{error}</p>
            <button className="btn btn-primary mt-md" onClick={refetch}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-view">
      <div className="logs-content">
        <div className="section-header-home">
          <div>
            <h2 className="page-title-home">Logs</h2>
            <p className="page-subtitle">System activity and event logs</p>
          </div>
          <button className="btn btn-secondary" onClick={handleRefresh} disabled={loading}>
            <span className="icon-inline" dangerouslySetInnerHTML={{ __html: Icons.refresh }} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-label">Total Logs</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-change">Last 24 hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Errors</div>
            <div className="stat-value" style={{ color: '#e74c3c' }}>{stats.errors}</div>
            <div className="stat-change">Requires attention</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Warnings</div>
            <div className="stat-value" style={{ color: '#ffa500' }}>{stats.warnings}</div>
            <div className="stat-change">Monitor closely</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Success</div>
            <div className="stat-value green">{stats.success}</div>
            <div className="stat-change">Completed operations</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-header">
            <h3 className="card-title">Activity Logs</h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  minWidth: '200px'
                }}
              />
              <select
                className="filter-select"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="all">All Levels</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          
          <div className="table-container">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Level</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Source</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Message</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                      <p>No logs found</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const badge = getLevelBadge(log.level);
                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td style={{ padding: 'var(--space-3)' }}>
                          <span className={`badge ${badge.class}`}>{badge.text}</span>
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>
                          {log.source}
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>
                          {log.message}
                        </td>
                        <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                          {log.details}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
