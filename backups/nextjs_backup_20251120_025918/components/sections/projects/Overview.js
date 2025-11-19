import { useProjects } from '../../../hooks/useAPI';

export default function Overview() {
  const { data: projectsData, loading } = useProjects();
  const projects = projectsData || [];

  const projectionCards = [
    { name: 'Alpha', date: '2024-01-15', number: 1, hashrate: '2.5 PH/s', btc: '125 BTC', status: 'active' },
    { name: 'Beta', date: '2024-01-20', number: 2, hashrate: '3.2 PH/s', btc: '158 BTC', status: 'active' },
    { name: 'Gamma', date: '2024-01-25', number: 3, hashrate: '1.8 PH/s', btc: '92 BTC', status: 'completed' },
    { name: 'Delta', date: '2024-02-01', number: 4, hashrate: '4.1 PH/s', btc: '203 BTC', status: 'active' },
    { name: 'Epsilon', date: '2024-02-10', number: 5, hashrate: '2.9 PH/s', btc: '145 BTC', status: 'pending' }
  ];

  const getStatusStyle = (status) => {
    const styles = {
      active: { bg: 'rgba(197, 255, 167, 0.15)', color: '#C5FFA7', text: 'Active' },
      completed: { bg: 'rgba(197, 255, 167, 0.1)', color: '#C5FFA7', text: 'Completed' },
      pending: { bg: 'rgba(255, 255, 255, 0.1)', color: '#aaa', text: 'Pending' }
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading projections...</p>
      </div>
    );
  }

  return (
    <div id="overview-section" style={{ padding: '20px', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '32px' }}>
        Lasts Projections
      </h2>
      
      {/* Projection Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        {projectionCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(26, 26, 26, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C5FFA7';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Projection {card.name}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>{card.date}</div>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(197, 255, 167, 0.2)',
                border: '1px solid #C5FFA7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C5FFA7',
                fontWeight: 600
              }}>
                {card.number}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Hashrate</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#C5FFA7' }}>{card.hashrate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>BTC</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{card.btc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Projections Table */}
      <div style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>All Projections</h3>
          <select
            style={{
              padding: '12px 16px',
              background: 'rgba(26, 26, 26, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">Select a projection from history...</option>
            {projectionCards.map((card, index) => (
              <option key={index} value={`proj-${card.date}`}>
                Projection {card.name} - {card.date} ({card.hashrate}, {card.btc})
              </option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Projection</th>
                <th>Date</th>
                <th>Hashrate</th>
                <th>BTC</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectionCards.map((card, index) => {
                const statusStyle = getStatusStyle(card.status);
                return (
                  <tr
                    key={index}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(197, 255, 167, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Projection {card.name}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{card.date}</td>
                    <td style={{ color: '#C5FFA7', fontWeight: 600 }}>{card.hashrate}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{card.btc}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: statusStyle.bg,
                        border: `1px solid ${statusStyle.color}`,
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: statusStyle.color,
                        textTransform: 'uppercase'
                      }}>
                        {statusStyle.text}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(197, 255, 167, 0.1)',
                            border: '1px solid #C5FFA7',
                            borderRadius: '6px',
                            color: '#C5FFA7',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            zIndex: 1
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(197, 255, 167, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(197, 255, 167, 0.1)'}
                        >
                          View
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            zIndex: 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C5FFA7';
                            e.currentTarget.style.color = '#C5FFA7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          Edit
                        </button>
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

