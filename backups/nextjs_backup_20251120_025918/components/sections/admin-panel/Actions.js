export default function Actions() {
  const actions = [
    { name: 'Validation budget Q2', detail: 'CFO · Échéance: 18 Nov 2025', status: 'urgent' },
    { name: 'Révision stratégie marketing', detail: 'CMO · Échéance: 22 Nov 2025', status: 'pending' },
    { name: 'Recrutement Senior Dev', detail: 'RH · Échéance: 15 Nov 2025', status: 'done' }
  ];

  const getStatusClass = (status) => {
    const classes = {
      urgent: 'status-urgent',
      pending: 'status-pending',
      done: 'status-done'
    };
    return classes[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const texts = {
      urgent: 'URGENT',
      pending: 'EN COURS',
      done: 'TERMINÉ'
    };
    return texts[status] || 'EN COURS';
  };

  const departments = [
    { name: 'Engineering', budget: '$850K', expenses: '$720K', progress: 84.7, status: 'success' },
    { name: 'Marketing', budget: '$450K', expenses: '$410K', progress: 91.1, status: 'warning' },
    { name: 'Sales', budget: '$320K', expenses: '$285K', progress: 89.1, status: 'success' },
    { name: 'Operations', budget: '$280K', expenses: '$195K', progress: 69.6, status: 'success' },
    { name: 'Support', budget: '$180K', expenses: '$172K', progress: 95.6, status: 'danger' }
  ];

  const getBadgeClass = (status) => {
    const classes = {
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger'
    };
    return classes[status] || 'badge-info';
  };

  const getStatusLabel = (status) => {
    const labels = {
      success: 'On Track',
      warning: 'Attention',
      danger: 'Risk'
    };
    return labels[status] || 'Unknown';
  };

  return (
    <div>
      <div className="section">
        <div className="section-header">
          <div className="section-title">Actions Prioritaires</div>
          <button className="btn btn-primary">Voir tout</button>
        </div>

        {actions.map((action, index) => (
          <div key={index} className="action-item">
            <div className="action-content">
              <div className="action-name">{action.name}</div>
              <div className="action-detail">{action.detail}</div>
            </div>
            <span className={`action-status ${getStatusClass(action.status)}`}>
              {getStatusText(action.status)}
            </span>
          </div>
        ))}
      </div>

      <div className="section" style={{ marginTop: 'var(--space-6)' }}>
        <div className="section-header">
          <div className="section-title">Performance par Département</div>
          <button className="btn btn-secondary">Exporter</button>
        </div>

        <table className="stats-table">
          <thead>
            <tr>
              <th>Département</th>
              <th>Budget</th>
              <th>Dépenses</th>
              <th>Progression</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={index}>
                <td>{dept.name}</td>
                <td>{dept.budget}</td>
                <td>{dept.expenses}</td>
                <td>{dept.progress.toFixed(1)}%</td>
                <td>
                  <span className={`badge ${getBadgeClass(dept.status)}`}>
                    {getStatusLabel(dept.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

