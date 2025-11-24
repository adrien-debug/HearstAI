'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: string
  view: string
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home', view: 'dashboard' },
  { href: '/cockpit', label: 'Cockpit', icon: 'dashboard', view: 'cockpit' },
  { href: '/myearthai', label: 'MyEarthAI', icon: 'dashboard', view: 'myearthai' },
  { href: '/projects', label: 'Projects', icon: 'document', view: 'projects' },
  { href: '/projection', label: 'Projection', icon: 'document', view: 'projection' },
  { href: '/transactions', label: 'Transactions', icon: 'document', view: 'transactions' },
  { href: '/wallet-scraper', label: 'Wallet Scraper', icon: 'document', view: 'wallet-scraper' },
  { href: '/profitability-index', label: 'Profitability Index', icon: 'document', view: 'profitability-index' },
  { href: '/documents-vault', label: 'Documents Vault', icon: 'document', view: 'documents-vault' },
  { href: '/electricity', label: 'Électricité', icon: 'energy', view: 'electricity' },
  { href: '/collateral', label: 'Collateral', icon: 'document', view: 'collateral' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) ?? false
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
            <span className="nav-icon" data-icon={item.icon}></span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-version">
        <Link
          href="/admin"
          className="nav-item"
          data-view="admin-panel"
        >
          <span className="nav-icon" data-icon="admin"></span>
          <span className="nav-label">Admin</span>
        </Link>
        <div className="sidebar-version-text">
          HearstAI Version 1.0
        </div>
      </div>
    </aside>
  )
}
