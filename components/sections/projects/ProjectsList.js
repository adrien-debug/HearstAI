import { useState } from 'react';
import { useProjects } from '../../../hooks/useAPI';
import { formatDateShort } from '../../../lib/dateUtils';

export default function ProjectsList() {
  const { data: projectsData, loading, error } = useProjects();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle different API response structures
  const projects = Array.isArray(projectsData)
    ? projectsData
    : (projectsData?.projects && Array.isArray(projectsData.projects))
      ? projectsData.projects
      : [];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = !searchTerm || 
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="projections-section">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projections-section">
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projections-section">
      <div className="section-header-home">
        <div>
          <h2 className="page-title-home">Projects</h2>
          <p className="page-subtitle">Manage and compare mining scenarios</p>
        </div>
        <button className="btn btn-primary">+ New Project</button>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--primary-grey)',
              border: '1px solid var(--grey-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              minWidth: '250px'
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['all', 'active', 'completed', 'pending'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: filter === f ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                  border: `1px solid ${filter === f ? '#C5FFA7' : 'var(--grey-100)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: filter === f ? '#C5FFA7' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <p>No projects found. Create your first project to get started.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {project.name || 'Unnamed Project'}
                  </h3>
                  <span className="badge badge-success">Active</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                  {project.description || 'No description available'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--grey-100)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Created {project.created_at ? formatDateShort(project.created_at) : 'N/A'}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', position: 'relative', zIndex: 1 }}>
                    <button className="btn btn-sm btn-ghost" style={{ position: 'relative', zIndex: 1 }}>View</button>
                    <button className="btn btn-sm btn-ghost" style={{ position: 'relative', zIndex: 1 }}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

