import { useState } from 'react';
import { useJobs } from '../../hooks/useAPI';
import { Icons } from '../../lib/icons';
import { formatDateTime } from '../../lib/dateUtils';

export default function Jobs() {
  const { data, loading, error, refetch } = useJobs();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = data?.jobs || [];

  const getJobStatusClass = (status) => {
    const statusMap = {
      success: 'success',
      running: 'info',
      pending: 'warning',
      failed: 'danger',
      cancelled: 'neutral'
    };
    return statusMap[status] || 'neutral';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return formatDateTime(dateString);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    const matchesSearch = !searchTerm || 
      job.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.project?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: jobs.length,
    running: jobs.filter(j => j.status === 'running').length,
    success: jobs.filter(j => j.status === 'success').length,
    failed: jobs.filter(j => j.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="jobs-view">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-view">
        <div className="card">
          <div className="card-body">
            <h3 className="text-danger">Error loading jobs</h3>
            <p className="text-secondary">{error}</p>
            <button className="btn btn-primary mt-md" onClick={refetch}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-view">
      <div className="jobs-content">
        <div className="section-header-home">
          <div>
            <h2 className="page-title-home">Jobs</h2>
            <p className="page-subtitle">Manage and monitor Claude CI/CD jobs</p>
          </div>
          <button className="btn btn-primary">+ Create Job</button>
        </div>

        <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-label">Total Jobs</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-change">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Running</div>
            <div className="stat-value" style={{ color: '#4a90e2' }}>{stats.running}</div>
            <div className="stat-change">In progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Success</div>
            <div className="stat-value green">{stats.success}</div>
            <div className="stat-change">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value" style={{ color: '#e74c3c' }}>{stats.failed}</div>
            <div className="stat-change">Errors</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-header">
            <h3 className="card-title">All Jobs</h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search jobs..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                <option value="running">Running</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="all">All Types</option>
                <option value="code-review">Code Review</option>
                <option value="refactor">Refactor</option>
                <option value="debug">Debug</option>
                <option value="test">Test</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={refetch}>
                <span className="icon-inline" dangerouslySetInnerHTML={{ __html: Icons.refresh }} />
                Refresh
              </button>
            </div>
          </div>
          <div className="table-container">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Project</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Created</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Duration</th>
                  <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>No jobs found</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Create a job to start working with Claude!'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <code style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                          {job.id?.substring(0, 8) || 'N/A'}
                        </code>
                      </td>
                      <td style={{ padding: 'var(--space-3)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {job.project?.name || 'Unknown'}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className="badge badge-neutral">{job.type || 'N/A'}</span>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className={`badge badge-${getJobStatusClass(job.status)} badge-dot`}>
                          {job.status || 'unknown'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {formatDate(job.created_at)}
                      </td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        {job.duration ? `${job.duration}s` : '-'}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button className="btn btn-sm btn-ghost">View</button>
                          {job.status === 'running' && (
                            <button className="btn btn-sm btn-ghost" style={{ color: '#e74c3c' }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
