export default function Teams() {
  const teams = [
    {
      name: 'Engineering',
      lead: 'Sarah Anderson',
      members: 78,
      activeProjects: 12,
      completionRate: 94.2,
      avatar: 'SA',
      tags: ['Backend', 'Frontend', 'DevOps']
    },
    {
      name: 'Product',
      lead: 'Emily Davis',
      members: 24,
      activeProjects: 8,
      completionRate: 91.5,
      avatar: 'ED',
      tags: ['Design', 'UX', 'Research']
    },
    {
      name: 'Sales',
      lead: 'Michael Chen',
      members: 32,
      activeProjects: 15,
      completionRate: 88.7,
      avatar: 'MC',
      tags: ['B2B', 'Enterprise', 'SMB']
    },
    {
      name: 'Marketing',
      lead: 'Jessica Wilson',
      members: 18,
      activeProjects: 6,
      completionRate: 92.1,
      avatar: 'JW',
      tags: ['Content', 'Growth', 'Brand']
    },
    {
      name: 'Support',
      lead: 'David Brown',
      members: 15,
      activeProjects: 4,
      completionRate: 96.8,
      avatar: 'DB',
      tags: ['Customer', 'Technical', 'Onboarding']
    },
    {
      name: 'Operations',
      lead: 'Lisa Martinez',
      members: 12,
      activeProjects: 5,
      completionRate: 89.3,
      avatar: 'LM',
      tags: ['Infrastructure', 'Security', 'Compliance']
    }
  ];

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Total Teams</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{teams.length}</div>
          <div className="kpi-trend trend-positive">
            Across all departments
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Total Members</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v20M2 12h20"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{teams.reduce((sum, t) => sum + t.members, 0)}</div>
          <div className="kpi-trend trend-positive">
            Active employees
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Active Projects</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{teams.reduce((sum, t) => sum + t.activeProjects, 0)}</div>
          <div className="kpi-trend trend-positive">
            In progress
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Avg Completion Rate</div>
            <div className="kpi-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value green">
            {(teams.reduce((sum, t) => sum + t.completionRate, 0) / teams.length).toFixed(1)}%
          </div>
          <div className="kpi-trend trend-positive">
            Excellent performance
          </div>
        </div>
      </div>

      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <div className="team-header">
              <div className="team-avatar-group">
                <div className="team-avatar">{team.avatar}</div>
                <div>
                  <div className="team-name">{team.name}</div>
                  <div className="team-lead">Lead: {team.lead}</div>
                </div>
              </div>
            </div>

            <div className="team-stats">
              <div className="team-stat">
                <span className="team-stat-value">{team.members}</span>
                <span className="team-stat-label">Members</span>
              </div>
              <div className="team-stat">
                <span className="team-stat-value">{team.activeProjects}</span>
                <span className="team-stat-label">Projects</span>
              </div>
              <div className="team-stat">
                <span className="team-stat-value">{team.completionRate.toFixed(1)}%</span>
                <span className="team-stat-label">Rate</span>
              </div>
            </div>

            <div className="team-tags">
              {team.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

