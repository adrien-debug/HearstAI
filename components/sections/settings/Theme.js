import { useState, useEffect } from 'react';

export default function Theme() {
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#C5FFA7');

  useEffect(() => {
    const savedTheme = localStorage.getItem('hearstai-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('hearstai-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const accentColors = [
    { name: 'Green', value: '#C5FFA7' },
    { name: 'Blue', value: '#4a90e2' },
    { name: 'Purple', value: '#9b59b6' },
    { name: 'Orange', value: '#f5a623' },
    { name: 'Red', value: '#e74c3c' }
  ];

  return (
    <div className="section">
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Theme Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Color Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
              {['dark', 'light', 'auto'].map((t) => (
                <div
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  style={{
                    padding: 'var(--space-4)',
                    background: theme === t ? 'rgba(197, 255, 167, 0.1)' : 'var(--primary-grey)',
                    border: `2px solid ${theme === t ? '#C5FFA7' : 'var(--grey-100)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    fontWeight: theme === t ? 600 : 400,
                    color: theme === t ? '#C5FFA7' : 'var(--text-primary)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Accent Color
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {accentColors.map((color) => (
                <div
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  style={{
                    width: '60px',
                    height: '60px',
                    background: color.value,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    border: accentColor === color.value ? '3px solid var(--text-primary)' : '2px solid var(--grey-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {accentColor === color.value && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#000' }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Selected: {accentColors.find(c => c.value === accentColor)?.name}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-primary">Apply Theme</button>
            <button className="btn btn-secondary">Reset to Default</button>
          </div>
        </div>
      </div>
    </div>
  );
}

