import { useRouter } from 'next/router';
import Link from 'next/link';
import { Icons } from '../../lib/icons';

export default function Sidebar({ currentView }) {
  const router = useRouter();
  
  const navItems = [
    { view: 'dashboard', label: 'Home', icon: 'home', path: '/' },
    { view: 'cockpit', label: 'Cockpit', icon: 'dashboard', path: '/cockpit' },
    { view: 'projects', label: 'Projections', icon: 'projects', path: '/projects' },
    { view: 'electricity', label: 'Électricité', icon: 'energy', path: '/electricity' },
    { view: 'collateral', label: 'Collateral', icon: 'document', path: '/collateral' },
    { view: 'jobs', label: 'Jobs', icon: 'jobs', path: '/jobs' },
    { view: 'versions', label: 'Versions', icon: 'versions', path: '/versions' },
    { view: 'prompts', label: 'Prompts', icon: 'prompts', path: '/prompts' },
    { view: 'logs', label: 'Logs', icon: 'logs', path: '/logs' },
    { view: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
    { view: 'admin-panel', label: 'Admin Panel', icon: 'admin', path: '/admin-panel' },
  ];
  
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <img src="/logo.svg" alt="HearstAI" className="logo-img" />
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = router.pathname === item.path || 
                          (item.path === '/' && router.pathname === '/') ||
                          (item.path !== '/' && router.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.view}
              href={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" dangerouslySetInnerHTML={{ __html: Icons[item.icon] || Icons.document || '' }}></span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-version">
        <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          HearstAI Version 1.0
        </div>
      </div>
    </aside>
  );
}

