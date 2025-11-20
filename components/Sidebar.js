'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: 'home', view: 'dashboard' },
    { href: '/projects', label: 'Projects', icon: 'document', view: 'projects' },
    { href: '/jobs', label: 'Jobs', icon: 'dashboard', view: 'jobs' },
    { href: '/versions', label: 'Versions', icon: 'document', view: 'versions' },
    { href: '/prompts', label: 'Prompts', icon: 'document', view: 'prompts' },
    { href: '/logs', label: 'Logs', icon: 'document', view: 'logs' },
    { href: '/cockpit', label: 'Cockpit', icon: 'dashboard', view: 'cockpit' },
    { href: '/electricity', label: 'Électricité', icon: 'energy', view: 'electricity' },
    { href: '/collateral', label: 'Collateral', icon: 'document', view: 'collateral' },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <Image 
            src="/logo.svg" 
            alt="HearstAI" 
            className="logo-img"
            width={180}
            height={40}
            priority
          />
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
            data-view={item.view}
          >
            <span className="nav-icon" data-icon={item.icon}>
              {/* Icons will be injected by JS */}
            </span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-version">
        <Link
          href="/admin"
          className="nav-item"
          data-view="admin-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            transition: 'all var(--duration-fast) var(--ease-in-out)',
          }}
        >
          <span className="nav-icon" data-icon="admin"></span>
          <span className="nav-label">Admin</span>
        </Link>
        <div style={{
          marginTop: 'var(--space-2)',
          paddingTop: 'var(--space-2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          HearstAI Version 1.0
        </div>
      </div>
    </aside>
  )
}

