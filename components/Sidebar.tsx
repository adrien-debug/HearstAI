'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'

interface NavItem {
  href: string
  label: string
  icon: string
  view: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

// Section Mining avec menu déroulant
const miningSection: NavSection = {
  label: 'Mining',
  items: [
    { href: '/cockpit', label: 'Cockpit', icon: 'dashboard', view: 'cockpit' },
    { href: '/projection', label: 'Projection', icon: 'document', view: 'projection' },
  ]
}

// Section Cost Center avec menu déroulant
const costCenterSection: NavSection = {
  label: 'Cost Center',
  items: [
    { href: '/transactions', label: 'Transactions', icon: 'transactions', view: 'transactions' },
    { href: '/electricity', label: 'Électricité', icon: 'energy', view: 'electricity' },
  ]
}

// Section Hearst Tools avec menu déroulant
const hearstToolsSection: NavSection = {
  label: 'Hearst Tools',
  items: [
    { href: '/profitability-index', label: 'Profitability Index', icon: 'profitability-index', view: 'profitability-index' },
    { href: '/collateral', label: 'Collateral', icon: 'collateral', view: 'collateral' },
    { href: '/wallet-scraper', label: 'Wallet Scraper', icon: 'wallet-scraper', view: 'wallet-scraper' },
  ]
}

// Section Strategie avec menu déroulant
const strategieSection: NavSection = {
  label: 'Strategie',
  items: [
    { href: '/calculator', label: 'Calculator', icon: 'calculator', view: 'calculator' },
    { href: '/business-dev', label: 'Business Dev', icon: 'business-dev', view: 'business-dev' },
    { href: '/partnership', label: 'Partnership', icon: 'partnership', view: 'partnership' },
  ]
}

// Section Datas avec menu déroulant
const datasSection: NavSection = {
  label: 'Datas',
  items: [
    { href: '/datas/miner', label: 'Miner', icon: 'document', view: 'datas-miner' },
    { href: '/datas/hoster', label: 'Hoster', icon: 'document', view: 'datas-hoster' },
  ]
}

// Section Management avec menu déroulant
const managementSection: NavSection = {
  label: 'Management',
  items: [
    { href: '/trello', label: 'Trello', icon: 'dashboard', view: 'trello' },
    { href: '/projects', label: 'Projects', icon: 'document', view: 'projects' },
    { href: '/portfolio', label: 'Portfolio', icon: 'image', view: 'portfolio' },
    { href: '/documents-vault', label: 'Documents Vault', icon: 'document', view: 'documents-vault' },
  ]
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isMiningOpen, setIsMiningOpen] = useState(false) // Par défaut fermé
  const [isCostCenterOpen, setIsCostCenterOpen] = useState(false) // Par défaut fermé
  const [isHearstToolsOpen, setIsHearstToolsOpen] = useState(false) // Par défaut fermé
  const [isStrategieOpen, setIsStrategieOpen] = useState(false) // Par défaut fermé
  const [isDatasOpen, setIsDatasOpen] = useState(false) // Par défaut fermé
  const [isManagementOpen, setIsManagementOpen] = useState(false) // Par défaut fermé

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) ?? false
  }

  // Vérifier si un item de la section Mining est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveMiningItem = miningSection.items.some(item => checkActive(item.href))
    if (hasActiveMiningItem) {
      setIsMiningOpen(true)
    }
  }, [pathname])

  // Vérifier si un item de la section Cost Center est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveCostCenterItem = costCenterSection.items.some(item => checkActive(item.href))
    if (hasActiveCostCenterItem) {
      setIsCostCenterOpen(true)
    }
  }, [pathname])

  // Vérifier si un item de la section Hearst Tools est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveHearstToolsItem = hearstToolsSection.items.some(item => checkActive(item.href))
    if (hasActiveHearstToolsItem) {
      setIsHearstToolsOpen(true)
    }
  }, [pathname])

  // Vérifier si un item de la section Strategie est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveStrategieItem = strategieSection.items.some(item => checkActive(item.href))
    if (hasActiveStrategieItem) {
      setIsStrategieOpen(true)
    }
  }, [pathname])

  // Vérifier si un item de la section Datas est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveDatasItem = datasSection.items.some(item => checkActive(item.href))
    if (hasActiveDatasItem) {
      setIsDatasOpen(true)
    }
  }, [pathname])

  // Vérifier si un item de la section Management est actif pour ouvrir automatiquement
  useEffect(() => {
    const checkActive = (href: string): boolean => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname?.startsWith(href) ?? false
    }
    const hasActiveManagementItem = managementSection.items.some(item => checkActive(item.href))
    if (hasActiveManagementItem) {
      setIsManagementOpen(true)
    }
  }, [pathname])

  const toggleMining = () => {
    setIsMiningOpen(!isMiningOpen)
  }

  const toggleCostCenter = () => {
    setIsCostCenterOpen(!isCostCenterOpen)
  }

  const toggleHearstTools = () => {
    setIsHearstToolsOpen(!isHearstToolsOpen)
  }

  const toggleStrategie = () => {
    setIsStrategieOpen(!isStrategieOpen)
  }

  const toggleDatas = () => {
    setIsDatasOpen(!isDatasOpen)
  }

  const toggleManagement = () => {
    setIsManagementOpen(!isManagementOpen)
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
        {/* Overview */}
        <Link
          href="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          data-view="dashboard"
        >
          <span className="nav-icon">
            <Icon name="dashboard" />
          </span>
          <span className="nav-label">Overview</span>
        </Link>

        {/* MyEarthAI - Bouton visible */}
        <Link
          href="/myearthai"
          className={`nav-item ${isActive('/myearthai') ? 'active' : ''}`}
          data-view="myearthai"
        >
          <span className="nav-icon">
            <Icon name="brain" />
          </span>
          <span className="nav-label">MyEarthAI</span>
        </Link>

        {/* Séparateur Hearst.AI */}
        <div className="nav-section-separator">
          <span className="nav-section-label">Hearst.AI</span>
        </div>

        {/* Section Mining avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isMiningOpen ? 'open' : ''}`}
            onClick={toggleMining}
            aria-expanded={isMiningOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isMiningOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{miningSection.label}</span>
          </button>
          <div className={`nav-section-content ${isMiningOpen ? 'open' : ''}`}>
            {miningSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Cost Center avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isCostCenterOpen ? 'open' : ''}`}
            onClick={toggleCostCenter}
            aria-expanded={isCostCenterOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isCostCenterOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{costCenterSection.label}</span>
          </button>
          <div className={`nav-section-content ${isCostCenterOpen ? 'open' : ''}`}>
            {costCenterSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Hearst Tools avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isHearstToolsOpen ? 'open' : ''}`}
            onClick={toggleHearstTools}
            aria-expanded={isHearstToolsOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isHearstToolsOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{hearstToolsSection.label}</span>
          </button>
          <div className={`nav-section-content ${isHearstToolsOpen ? 'open' : ''}`}>
            {hearstToolsSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Strategie avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isStrategieOpen ? 'open' : ''}`}
            onClick={toggleStrategie}
            aria-expanded={isStrategieOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isStrategieOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{strategieSection.label}</span>
          </button>
          <div className={`nav-section-content ${isStrategieOpen ? 'open' : ''}`}>
            {strategieSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Datas avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isDatasOpen ? 'open' : ''}`}
            onClick={toggleDatas}
            aria-expanded={isDatasOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isDatasOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{datasSection.label}</span>
          </button>
          <div className={`nav-section-content ${isDatasOpen ? 'open' : ''}`}>
            {datasSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section Management avec menu déroulant */}
        <div className="nav-section">
          <button
            className={`nav-section-header ${isManagementOpen ? 'open' : ''}`}
            onClick={toggleManagement}
            aria-expanded={isManagementOpen}
          >
            <span className="nav-section-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`nav-section-lightning ${isManagementOpen ? 'open' : ''}`}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </span>
            <span className="nav-section-label">{managementSection.label}</span>
          </button>
          <div className={`nav-section-content ${isManagementOpen ? 'open' : ''}`}>
            {managementSection.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item nav-sub-item ${isActive(item.href) ? 'active' : ''}`}
                data-view={item.view}
              >
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Séparateur avec logo Bitcoin sous Management */}
        <div className="nav-section-separator nav-section-separator-bitcoin">
          <span className="nav-section-separator-bitcoin-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M10.5 8.5C10.5 7.67 11.17 7 12 7C12.83 7 13.5 7.67 13.5 8.5C13.5 9.33 12.83 10 12 10M10.5 15.5C10.5 14.67 11.17 14 12 14C12.83 14 13.5 14.67 13.5 15.5C13.5 16.33 12.83 17 12 17M9 10H15M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
        </div>
      </nav>

      <div className="sidebar-version">
        <Link
          href="/admin"
          className="nav-item"
          data-view="admin-panel"
        >
          <span className="nav-label">Admin</span>
        </Link>
        <div className="sidebar-version-text">
          HearstAI Version 1.0
        </div>
      </div>
    </aside>
  )
}
