import { useState } from 'react';

export default function API() {
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

  const handleGenerateKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    setShowKey(true);
  };

  return (
    <div className="section">
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>API Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                API Base URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
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

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                API Key
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)',
                    background: 'var(--primary-grey)',
                    border: '1px solid var(--grey-100)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateKey}
                >
                  Generate New
                </button>
              </div>
              <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Keep your API key secure. Never share it publicly.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button className="btn btn-primary">Save Configuration</button>
              <button className="btn btn-secondary">Test Connection</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>API Usage</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Requests Today</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1,247</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Rate Limit</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>10,000 / day</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status</span>
              <span style={{ color: '#C5FFA7', fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

