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
  { href: '/', label: 'Overview', icon: 'home', view: 'dashboard' },
  { href: '/myearthai', label: 'MyEarthAI', icon: 'dashboard', view: 'myearthai' },
  { href: '/cockpit', label: 'Cockpit', icon: 'dashboard', view: 'cockpit' },
  { href: '/projection', label: 'Projection', icon: 'document', view: 'projection' },
  { href: '/transactions', label: 'Transactions', icon: 'transactions', view: 'transactions' },
  { href: '/electricity', label: 'Électricité', icon: 'energy', view: 'electricity' },
  { href: '/profitability-index', label: 'Profitability Index', icon: 'profitability-index', view: 'profitability-index' },
  { href: '/collateral', label: 'Collateral', icon: 'collateral', view: 'collateral' },
  { href: '/wallet-scraper', label: 'Wallet Scraper', icon: 'wallet-scraper', view: 'wallet-scraper' },
  { href: '/calculator', label: 'Calculator', icon: 'calculator', view: 'calculator' },
  { href: '/business-dev', label: 'Business Dev', icon: 'business-dev', view: 'business-dev' },
  { href: '/fundraising', label: 'Fundraising', icon: 'fundraising', view: 'fundraising' },
  { href: '/partnership', label: 'Partnership', icon: 'partnership', view: 'partnership' },
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
        {navItems.map((item, index) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              data-view={item.view}
            >
              <span className="nav-icon" data-icon={item.icon}></span>
              <span className="nav-label">{item.label}</span>
            </Link>
            {index === 1 && (
              <div className="nav-section-separator">
                <span className="nav-section-label">Mining</span>
              </div>
            )}
            {index === 4 && (
              <div className="nav-section-separator">
                <span className="nav-section-label">Cost Center</span>
              </div>
            )}
            {index === 6 && (
              <div className="nav-section-separator">
                <span className="nav-section-label">Hearst Tools</span>
              </div>
            )}
            {index === 9 && (
              <div className="nav-section-separator">
                <span className="nav-section-label">Strategie</span>
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-version">
        <Link
          href="/documents-vault"
          className={`nav-item ${isActive('/documents-vault') ? 'active' : ''}`}
          data-view="documents-vault"
        >
          <span className="nav-icon" data-icon="document"></span>
          <span className="nav-label">Documents Vault</span>
        </Link>
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
