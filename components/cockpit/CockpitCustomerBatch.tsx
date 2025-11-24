'use client'

export default function CockpitCustomerBatch() {
  const batches = [
    {
      id: 'BATCH-001',
      customer: 'Customer A',
      machines: 50,
      status: 'active',
      startDate: '2025-01-10',
      progress: 85,
    },
    {
      id: 'BATCH-002',
      customer: 'Customer B',
      machines: 30,
      status: 'active',
      startDate: '2025-01-12',
      progress: 60,
    },
    {
      id: 'BATCH-003',
      customer: 'Customer C',
      machines: 75,
      status: 'pending',
      startDate: '2025-01-16',
      progress: 0,
    },
  ]

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Batches</div>
          <div className="kpi-value">12</div>
          <div className="kpi-description">All batches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Batches</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: '#C5FFA7' }}>8</div>
          <div className="kpi-description">Currently running</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Machines</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>450</div>
          <div className="kpi-description">In all batches</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Completion Rate</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)' }}>72%</div>
          <div className="kpi-description">Average progress</div>
        </div>
      </div>

      {/* Customer Batches Table */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <div className="cockpit-card-title">Customer Batches</div>
          <button className="cockpit-btn">Create Batch</button>
        </div>
        <div className="cockpit-table-container">
          <table className="cockpit-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Customer</th>
                <th>Machines</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{batch.id}</td>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{batch.customer}</td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{batch.machines}</td>
                  <td>
                    {batch.status === 'active' && (
                      <span className="cockpit-badge cockpit-badge-success">Active</span>
                    )}
                    {batch.status === 'pending' && (
                      <span className="cockpit-badge cockpit-badge-warning">Pending</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{batch.startDate}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${batch.progress}%`, background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
                      </div>
                      <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', minWidth: '40px' }}>{batch.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
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


