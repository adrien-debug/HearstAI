import { useState } from 'react';
import { useProjects } from '../../hooks/useAPI';
import { Icons } from '../../lib/icons';
import { formatDateShort } from '../../lib/dateUtils';

export default function Versions() {
  const { data: projectsData } = useProjects();
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const versions = [
    { id: 'v1.2.3', project: 'Project Alpha', status: 'stable', created: '2024-12-15', author: 'Claude', changes: 12, description: 'Production release with bug fixes' },
    { id: 'v1.2.2', project: 'Project Alpha', status: 'stable', created: '2024-12-10', author: 'Claude', changes: 8, description: 'Performance improvements' },
    { id: 'v1.2.1', project: 'Project Beta', status: 'draft', created: '2024-12-08', author: 'Claude', changes: 5, description: 'Feature additions' },
    { id: 'v1.1.0', project: 'Project Gamma', status: 'stable', created: '2024-12-01', author: 'Claude', changes: 25, description: 'Major feature release' },
    { id: 'v1.0.9', project: 'Project Beta', status: 'draft', created: '2024-11-28', author: 'Claude', changes: 3, description: 'Minor updates' }
  ];

  // Handle different API response structures
  const projects = Array.isArray(projectsData) 
    ? projectsData 
    : (projectsData?.projects && Array.isArray(projectsData.projects))
      ? projectsData.projects
      : [];

  const filteredVersions = versions.filter(version => {
    const matchesProject = !projectFilter || version.project === projectFilter;
    const matchesStatus = statusFilter === 'all' || version.status === statusFilter;
    return matchesProject && matchesStatus;
  });

  const stats = {
    total: versions.length,
    stable: versions.filter(v => v.status === 'stable').length,
    draft: versions.filter(v => v.status === 'draft').length
  };

  const getStatusBadge = (status) => {
    return status === 'stable' 
      ? { class: 'badge-success', text: 'STABLE' }
      : { class: 'badge-warning', text: 'DRAFT' };
  };

  return (
    <div className="versions-view">
      <div className="versions-content">
        <div className="section-header-home">
          <div>
            <h2 className="page-title-home">Versions</h2>
            <p className="page-subtitle">Track and manage code versions</p>
          </div>
          <button className="btn btn-primary">+ Create Version</button>
        </div>

        <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
          <div className="stat-card">
            <div className="stat-label">Total Versions</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-change">All projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Stable</div>
            <div className="stat-value green">{stats.stable}</div>
            <div className="stat-change">Production ready</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Draft</div>
            <div className="stat-value" style={{ color: '#ffa500' }}>{stats.draft}</div>
            <div className="stat-change">In development</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Projects</div>
            <div className="stat-value">{projects.length}</div>
            <div className="stat-change">With versions</div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-header">
            <h3 className="card-title">All Versions</h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <select
                className="filter-select"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)'
                }}
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>
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
                <option value="stable">Stable Only</option>
                <option value="draft">Draft Only</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
            {filteredVersions.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                <p>No versions found</p>
              </div>
            ) : (
              filteredVersions.map((version) => {
                const badge = getStatusBadge(version.status);
                return (
                  <div
                    key={version.id}
                    className="card"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C5FFA7';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--grey-100)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                        <div>
                          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                            {version.id}
                          </h3>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            {version.project}
                          </div>
                        </div>
                        <span className={`badge ${badge.class}`}>{badge.text}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
                        {version.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--grey-100)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {formatDateShort(version.created)} · {version.changes} changes
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button className="btn btn-sm btn-ghost">View</button>
                          <button className="btn btn-sm btn-ghost">Compare</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
