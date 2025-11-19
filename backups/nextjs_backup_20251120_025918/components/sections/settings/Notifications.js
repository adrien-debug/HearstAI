import { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      jobs: true,
      errors: true,
      updates: false
    },
    browser: {
      enabled: true,
      jobs: true,
      errors: true,
      updates: false
    },
    slack: {
      enabled: false,
      webhook: ''
    }
  });

  const handleToggle = (category, key) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleWebhookChange = (value) => {
    setNotifications(prev => ({
      ...prev,
      slack: {
        ...prev.slack,
        webhook: value
      }
    }));
  };

  return (
    <div className="section">
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Email Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Enable Email Notifications</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Receive notifications via email</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.email.enabled}
                  onChange={() => handleToggle('email', 'enabled')}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            {notifications.email.enabled && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Job Status Updates</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications.email.jobs}
                      onChange={() => handleToggle('email', 'jobs')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Error Alerts</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications.email.errors}
                      onChange={() => handleToggle('email', 'errors')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Product Updates</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications.email.updates}
                      onChange={() => handleToggle('email', 'updates')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Browser Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Enable Browser Notifications</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Receive browser push notifications</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.browser.enabled}
                  onChange={() => handleToggle('browser', 'enabled')}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            {notifications.browser.enabled && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Job Status Updates</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications.browser.jobs}
                      onChange={() => handleToggle('browser', 'jobs')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Error Alerts</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifications.browser.errors}
                      onChange={() => handleToggle('browser', 'errors')}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Slack Integration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>Enable Slack Notifications</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Send notifications to Slack</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifications.slack.enabled}
                  onChange={() => handleToggle('slack', 'enabled')}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>
            </div>

            {notifications.slack.enabled && (
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://hooks.slack.com/services/..."
                  value={notifications.slack.webhook}
                  onChange={(e) => handleWebhookChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    background: 'var(--primary-grey)',
                    border: '1px solid var(--grey-100)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-primary">Save Settings</button>
              <button className="btn btn-secondary">Test Notification</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

