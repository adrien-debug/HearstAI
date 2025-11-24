'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import SidebarIcon from './SidebarIcon'

export default function Sidebar() {
  const pathname = usePathname()
  
  // États pour gérer l'ouverture des sections déroulantes
  const [openSections, setOpenSections] = useState({
    projects: false,
    analyses: false,
    configuration: false,
    admin: false,
    quickActions: false,
  })

  // Section "Tableau de bord" - non déroulant
  const dashboardItems = [
    { href: '/', label: 'Home', icon: 'home', view: 'dashboard' },
    { href: '/cockpit', label: 'Cockpit', icon: 'dashboard', view: 'cockpit' },
    { href: '/myearthai', label: 'MyEarthAI', icon: 'dashboard', view: 'myearthai' },
  ]

  // Section "Projets & Transactions" - menu déroulant
  const projectsItems = [
    { href: '/projects', label: 'Projects', icon: 'document', view: 'projects' },
    { href: '/projection', label: 'Projection', icon: 'document', view: 'projection' },
    { href: '/transactions', label: 'Transactions', icon: 'document', view: 'transactions' },
  ]

  // Section "Analyses & Outils" - menu déroulant
  const analysesItems = [
    { href: '/wallet-scraper', label: 'Wallet Scraper', icon: 'document', view: 'wallet-scraper' },
    { href: '/profitability-index', label: 'Profitability Index', icon: 'document', view: 'profitability-index' },
  ]

  // Section "Configuration" - menu déroulant
  const configurationItems = [
    { href: '/electricity', label: 'Électricité', icon: 'energy', view: 'electricity' },
    { href: '/collateral', label: 'Collateral', icon: 'document', view: 'collateral' },
    { href: '/customers', label: 'Customers', icon: 'document', view: 'customers' },
  ]

  // Section "Administration" - menu déroulant (organisé par ordre logique)
  const adminItems = [
    { href: '/admin', label: 'Admin Panel', icon: 'admin', view: 'admin-panel' },
    { href: '/setup', label: 'Setup', icon: 'settings', view: 'setup' },
    { href: '/documents-vault', label: 'Documents Vault', icon: 'document', view: 'documents-vault' },
  ]

  // Section "Quick Actions" - actions rapides
  const quickActionsItems = [
    { href: '/customers/add', label: 'Add Customer', icon: 'document', view: 'add-customer' },
    { href: '/projects/new', label: 'New Project', icon: 'document', view: 'new-project' },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  const isSectionActive = (items, sectionKey) => {
    // Actif si un item est actif OU si la section est ouverte
    const hasActiveItem = items.some(item => isActive(item.href))
    const isOpen = openSections[sectionKey]
    return hasActiveItem || isOpen
  }

  // Vérifier si une section contient un élément actif et l'ouvrir automatiquement
  useEffect(() => {
    const newOpenSections = {
      projects: false,
      analyses: false,
      configuration: false,
      admin: false,
      quickActions: false,
    }
    
    if (projectsItems.some(item => isActive(item.href))) {
      newOpenSections.projects = true
    }
    if (analysesItems.some(item => isActive(item.href))) {
      newOpenSections.analyses = true
    }
    if (configurationItems.some(item => isActive(item.href))) {
      newOpenSections.configuration = true
    }
    if (adminItems.some(item => isActive(item.href))) {
      newOpenSections.admin = true
    }
    if (quickActionsItems.some(item => isActive(item.href))) {
      newOpenSections.quickActions = true
    }
    
    setOpenSections(newOpenSections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleSection = (section) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = prev[section]
      
      // Si le menu est déjà ouvert, on le ferme simplement
      if (isCurrentlyOpen) {
        return {
          ...prev,
          [section]: false
        }
      }
      
      // Sinon, on ferme tous les autres menus et on ouvre celui-ci
      return {
        projects: false,
        analyses: false,
        configuration: false,
        admin: false,
        quickActions: false,
        [section]: true
      }
    })
  }

  // Variables pour l'état actif de chaque section (pour meilleure réactivité)
  const projectsActive = isSectionActive(projectsItems, 'projects')
  const analysesActive = isSectionActive(analysesItems, 'analyses')
  const configurationActive = isSectionActive(configurationItems, 'configuration')
  const quickActionsActive = isSectionActive(quickActionsItems, 'quickActions')
  const adminActive = isSectionActive(adminItems, 'admin')

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <svg 
            className="logo-icon" 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M8 6 L16 14 L24 6 M8 16 L16 24 L24 16" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="16" 
              cy="10" 
              r="2" 
              fill="currentColor"
            />
            <circle 
              cx="16" 
              cy="20" 
              r="2" 
              fill="currentColor"
            />
          </svg>
          <h1 className="logo-text">HearstAI</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {/* Section Tableau de bord - non déroulant */}
        {dashboardItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
            data-view={item.view}
          >
            <span className="nav-icon">
              <SidebarIcon name={item.icon} />
            </span>
            <span className="nav-label" style={{ color: '#ffffff' }}>{item.label}</span>
          </Link>
        ))}

        {/* Section Projets & Transactions - menu déroulant */}
        <div className="menu-section">
          <button
            onClick={() => toggleSection('projects')}
            className={`menu-section-toggle ${projectsActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="nav-icon">
                <SidebarIcon name="document" />
              </span>
              <span className="nav-label">Projects</span>
            </div>
            <svg
              className="chev"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2 L8 6 L4 10" />
            </svg>
          </button>
          
          <div className={`menu-submenu ${openSections.projects ? 'show' : ''}`}>
            {projectsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`menu-submenu-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Analyses & Outils - menu déroulant */}
        <div className="menu-section">
          <button
            onClick={() => toggleSection('analyses')}
            className={`menu-section-toggle ${analysesActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="nav-icon">
                <SidebarIcon name="document" />
              </span>
              <span className="nav-label">Analytics</span>
            </div>
            <svg
              className="chev"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2 L8 6 L4 10" />
            </svg>
          </button>
          
          <div className={`menu-submenu ${openSections.analyses ? 'show' : ''}`}>
            {analysesItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`menu-submenu-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Configuration - menu déroulant */}
        <div className="menu-section">
          <button
            onClick={() => toggleSection('configuration')}
            className={`menu-section-toggle ${configurationActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="nav-icon">
                <SidebarIcon name="settings" />
              </span>
              <span className="nav-label">Settings</span>
            </div>
            <svg
              className="chev"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2 L8 6 L4 10" />
            </svg>
          </button>
          
          <div className={`menu-submenu ${openSections.configuration ? 'show' : ''}`}>
            {configurationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`menu-submenu-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Quick Actions - actions rapides */}
        <div className="menu-section">
          <button
            onClick={() => toggleSection('quickActions')}
            className={`menu-section-toggle ${quickActionsActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="nav-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2 L8 14 M2 8 L14 8" />
                </svg>
              </span>
              <span className="nav-label">Quick Actions</span>
            </div>
            <svg
              className="chev"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2 L8 6 L4 10" />
            </svg>
          </button>
          
          <div className={`menu-submenu ${openSections.quickActions ? 'show' : ''}`}>
            {quickActionsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`menu-submenu-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="sidebar-version">
        {/* Section Administration - menu déroulant */}
        <div className="admin-menu-container">
          <button
            onClick={() => toggleSection('admin')}
            className={`menu-section-toggle ${adminActive ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span className="nav-icon">
                <SidebarIcon name="admin" />
              </span>
              <span className="nav-label">Admin</span>
            </div>
            <svg
              className="chev"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2 L8 6 L4 10" />
            </svg>
          </button>
          
          <div className={`menu-submenu ${openSections.admin ? 'show' : ''}`}>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`menu-submenu-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
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

