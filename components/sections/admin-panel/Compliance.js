import { useState } from 'react';
import { formatDateShort } from '../../../lib/dateUtils';

export default function Compliance() {
  const [filter, setFilter] = useState('all');

  const checks = [
    { id: 'CHK001', name: 'GDPR Compliance', status: 'passed', lastCheck: '2024-12-15', score: 98, category: 'Data Protection' },
    { id: 'CHK002', name: 'SOC 2 Type II', status: 'passed', lastCheck: '2024-12-10', score: 95, category: 'Security' },
    { id: 'CHK003', name: 'ISO 27001', status: 'warning', lastCheck: '2024-12-08', score: 87, category: 'Security' },
    { id: 'CHK004', name: 'PCI DSS', status: 'passed', lastCheck: '2024-12-05', score: 92, category: 'Payment' },
    { id: 'CHK005', name: 'HIPAA Compliance', status: 'failed', lastCheck: '2024-12-01', score: 72, category: 'Healthcare' }
  ];

  const passed = checks.filter(c => c.status === 'passed').length;
  const avgScore = (checks.reduce((sum, c) => sum + c.score, 0) / checks.length).toFixed(1);

  const getStatusBadge = (status) => {
    const badges = {
      passed: { class: 'badge-success', text: 'PASSED' },
      warning: { class: 'badge-warning', text: 'WARNING' },
      failed: { class: 'badge-danger', text: 'FAILED' }
    };
    return badges[status] || badges.warning;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#C5FFA7';
    if (score >= 75) return '#ffa500';
    return '#ff4444';
  };

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Compliance Scan</h2>
          <p className="section-subtitle">Audit de conformité</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Running compliance scan...')}>Run Scan</button>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-label">Overall Score</div>
          <div className="stat-value" style={{ color: getScoreColor(avgScore) }}>{avgScore}%</div>
          <div className="stat-change">Average compliance</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Passed Checks</div>
          <div className="stat-value green">{passed} / {checks.length}</div>
          <div className="stat-change">Compliant standards</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Warnings</div>
          <div className="stat-value" style={{ color: '#ffa500' }}>
            {checks.filter(c => c.status === 'warning').length}
          </div>
          <div className="stat-change">Requires attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed Checks</div>
          <div className="stat-value" style={{ color: '#ff4444' }}>
            {checks.filter(c => c.status === 'failed').length}
          </div>
          <div className="stat-change">Critical issues</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <h3 className="card-title">Compliance Checks</h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['all', 'passed', 'warning', 'failed'].map(f => (
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
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Check Name</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Score</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Last Check</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {checks.filter(c => filter === 'all' || c.status === filter).map((check) => {
                const badge = getStatusBadge(check.status);
                return (
                  <tr key={check.id} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 600 }}>{check.name}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className="badge badge-info">{check.category}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ 
                          width: '60px', 
                          height: '8px', 
                          background: 'rgba(255,255,255,0.1)', 
                          borderRadius: '4px', 
                          overflow: 'hidden' 
                        }}>
                          <div 
                            style={{ 
                              width: `${check.score}%`, 
                              height: '100%', 
                              background: getScoreColor(check.score), 
                              borderRadius: '4px' 
                            }}
                          ></div>
                        </div>
                        <span style={{ color: getScoreColor(check.score), fontWeight: 600, minWidth: '40px' }}>
                          {check.score}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                      {formatDateShort(check.lastCheck)}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-sm btn-ghost">View Details</button>
                        <button className="btn btn-sm btn-ghost">Remediate</button>
                      </div>
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

