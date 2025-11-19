import { useState } from 'react';

export default function General() {
  const [settings, setSettings] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    autoRefresh: true,
    refreshInterval: 30
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="section">
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>General Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Auto Refresh</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Automatically refresh data</div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </label>
          </div>

          {settings.autoRefresh && (
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                step="10"
                value={settings.refreshInterval}
                onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'var(--primary-grey)',
                  border: '1px solid var(--grey-100)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary">Save Changes</button>
            <button className="btn btn-secondary">Reset to Default</button>
          </div>
        </div>
      </div>
    </div>
  );
}

