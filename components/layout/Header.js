import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons } from '../../lib/icons';

export default function Header({ currentView }) {
  const router = useRouter();
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true only on client side
    setMounted(true);
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Transaction history',
      cockpit: 'Cockpit',
      projects: 'Projections',
      electricity: 'Électricité',
      collateral: 'Collateral',
      'admin-panel': 'Admin Panel',
    };
    return titles[currentView] || 'Dashboard';
  };
  
  return (
    <header className="header" id="header">
      <div className="header-left">
        <h2 className="page-title" id="page-title">{getPageTitle()}</h2>
      </div>
      <div className="header-right">
        <button className="btn btn-primary" id="btn-new-action" style={{ display: 'none' }}>
          <span>+ New</span>
        </button>
        
        <div className="header-cockpit-clock-container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div 
            id="headerCockpitClock"
            className="header-cockpit-clock"
            style={{ 
              fontSize: 'var(--text-base)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--primary-green)', 
              fontVariantNumeric: 'tabular-nums', 
              fontFamily: 'var(--font-mono, monospace)',
              minWidth: '80px',
              textAlign: 'right'
            }}
            suppressHydrationWarning
          >
            {mounted ? formatTime(time) : '--:--:--'}
          </div>
          <div 
            className="header-cockpit-live-badge"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)', 
              padding: 'var(--space-2) var(--space-4)', 
              background: 'rgba(163, 255, 139, 0.1)', 
              border: '1px solid rgba(163, 255, 139, 0.3)', 
              borderRadius: 'var(--radius-full)', 
              fontSize: 'var(--text-xs)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--primary-green)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}
          >
            <span 
              className="header-cockpit-live-dot"
              style={{ 
                width: '8px', 
                height: '8px', 
                background: 'var(--primary-green)', 
                borderRadius: '50%', 
                animation: 'pulse 2s infinite' 
              }}
            ></span>
            <span>LIVE</span>
          </div>
        </div>
        
        <button 
          className="user-badge" 
          id="admin-btn"
          onClick={() => router.push('/admin-panel')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <span className="user-avatar" dangerouslySetInnerHTML={{ __html: Icons.user || '' }}></span>
          <span className="user-name">Admin</span>
        </button>
      </div>
    </header>
  );
}

