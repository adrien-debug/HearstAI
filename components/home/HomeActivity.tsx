'use client'

export default function HomeActivity() {
  const activities = [
    { id: 1, type: 'job', action: 'Job completed', name: 'Job #1234', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'project', action: 'Project updated', name: 'Project Alpha', time: '15 minutes ago', status: 'info' },
    { id: 3, type: 'job', action: 'Job started', name: 'Job #1235', time: '1 hour ago', status: 'info' },
    { id: 4, type: 'version', action: 'Version created', name: 'v2.1.0', time: '2 hours ago', status: 'info' },
    { id: 5, type: 'job', action: 'Job failed', name: 'Job #1233', time: '3 hours ago', status: 'error' },
    { id: 6, type: 'project', action: 'Project created', name: 'Project Beta', time: '5 hours ago', status: 'success' },
  ]

  return (
    <div>
      {/* Activity Feed */}
      <div className="home-card">
        <div className="home-card-header">
          <div className="home-card-title">Recent Activity</div>
          <button className="home-btn-secondary">View All</button>
        </div>
        <div className="home-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-3)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(197, 255, 167, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(197, 255, 167, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      activity.status === 'success'
                        ? '#C5FFA7'
                        : activity.status === 'error'
                        ? '#FF4D4D'
                        : 'rgba(255, 255, 255, 0.4)',
                    flexShrink: 0,
                  }}
                ></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                      {activity.action}
                    </span>
                    <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>{activity.name}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{activity.time}</div>
                </div>
                <span
                  className={`home-badge ${
                    activity.status === 'success'
                      ? 'home-badge-success'
                      : activity.status === 'error'
                      ? 'home-badge-error'
                      : 'home-badge-info'
                  }`}
                >
                  {activity.status === 'success' ? 'Success' : activity.status === 'error' ? 'Error' : 'Info'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


