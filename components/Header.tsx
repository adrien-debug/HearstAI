'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import ProfileDropdown from './ProfileDropdown'
import { statsAPI } from '@/lib/api'
import Icon from './Icon'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/jobs': 'Jobs',
  '/cockpit': 'Cockpit',
  '/myearthai': 'MyEarthAI',
  '/electricity': 'Électricité',
  '/collateral': 'Collateral',
  '/admin': 'Admin',
}

interface DashboardStats {
  total_projects?: number
  total_versions?: number
  total_jobs?: number
  jobs_running?: number
  jobs_success_rate?: number
}

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
}

export default function Header() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const isDashboard = pathname === '/'

  useEffect(() => {
    setPageTitle(pageTitles[pathname || ''] || 'Dashboard')
  }, [pathname])

  // Load stats for dashboard page
  useEffect(() => {
    if (pathname === '/') {
      // MODE DEBUG LOCAL : Utiliser des données mockées pour éviter les blocages
      const isLocal = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '6001'
      )
      
      // Initialize with mock stats immediately
      setStats({
        total_projects: 12,
        total_versions: 45,
        total_jobs: 234,
        jobs_running: 3,
        jobs_success_rate: 98.5,
      })

      // EN MODE LOCAL : Pas d'appel API, utiliser les données mockées
      if (isLocal) {
        console.log('[Header] 🔧 MODE LOCAL - Utilisation de données mockées')
        return // Pas d'interval en mode local
      }

      // EN PRODUCTION : Charger les vraies stats
      const loadStats = async () => {
        try {
          const response = await statsAPI.getStats()
          if (response && response.stats) {
            setStats(response.stats)
          }
        } catch (err) {
          // Silently use mock data if API is not available
        }
      }
      
      loadStats()
      const interval = setInterval(loadStats, 30000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [pathname])

  // Set mounted flag and initialize time only on client
  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load crypto prices (BTC and ETH)
  useEffect(() => {
    const loadCryptoPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
        )
        const data = await response.json()
        
        if (data.bitcoin && data.ethereum) {
          setCryptoPrices([
            {
              symbol: 'BTC',
              name: 'Bitcoin',
              price: data.bitcoin.usd,
              change24h: data.bitcoin.usd_24h_change || 0,
            },
            {
              symbol: 'ETH',
              name: 'Ethereum',
              price: data.ethereum.usd,
              change24h: data.ethereum.usd_24h_change || 0,
            },
          ])
        }
      } catch (err) {
        console.error('[Header] Erreur chargement prix crypto:', err)
        // Fallback avec données mockées
        setCryptoPrices([
          { symbol: 'BTC', name: 'Bitcoin', price: 85000, change24h: 2.5 },
          { symbol: 'ETH', name: 'Ethereum', price: 3200, change24h: 1.8 },
        ])
      }
    }

    loadCryptoPrices()
    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(loadCryptoPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--'
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0,
      }).format(price)
    }
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  return (
    <header className="header" id="header" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <div className="header-left">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h2 className="page-title" id="page-title" style={{ margin: 0, color: '#ffffff', position: 'relative', zIndex: 101 }}>
            {pageTitle}
          </h2>
          {isDashboard && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                background: 'rgba(165, 255, 156, 0.1)',
                border: '1px solid rgba(165, 255, 156, 0.3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--hearst-green)',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--hearst-green)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 6px rgba(165, 255, 156, 0.5)',
                }}></div>
                <span>Live</span>
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em',
                color: 'var(--hearst-green)',
                width: '80px',
                height: '20px',
              }}>
                {mounted && currentTime ? formatTime(currentTime) : '--:--:--'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Crypto Prices Section */}
      {cryptoPrices.length > 0 && (
        <div className="header-crypto" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          margin: '0',
          padding: '0',
          flex: 1,
          justifyContent: 'flex-end',
          maxWidth: 'none',
          marginRight: 'var(--space-8)',
        }}>
          {cryptoPrices.map((crypto, index) => (
            <React.Fragment key={crypto.symbol}>
              {index > 0 && (
                <div style={{
                  width: '1px',
                  height: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}></div>
              )}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                  minWidth: '40px',
                }}>
                  {crypto.symbol}
                </div>
                <div style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: '100px',
                  textAlign: 'right',
                }}>
                  ${formatPrice(crypto.price)}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: crypto.change24h >= 0 ? 'var(--hearst-green)' : '#ff4d4d',
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: '60px',
                  textAlign: 'right',
                }}>
                  {formatChange(crypto.change24h)}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="header-right">
        <ProfileDropdown />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 6px rgba(165, 255, 156, 0.5);
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 12px rgba(165, 255, 156, 0.8);
          }
        }
      `}</style>
    </header>
  )
}


