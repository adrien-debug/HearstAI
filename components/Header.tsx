'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProfileDropdown from './ProfileDropdown'
import { statsAPI } from '@/lib/api'

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

export default function Header() {
  const pathname = usePathname()
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const isDashboard = pathname === '/'

  useEffect(() => {
    setPageTitle(pageTitles[pathname || ''] || 'Dashboard')
  }, [pathname])

  // Load icons for dashboard page
  useEffect(() => {
    if (isDashboard && typeof window !== 'undefined' && (window as any).Icons) {
      const loadIcons = () => {
        document.querySelectorAll('[data-icon]').forEach(el => {
          const iconName = el.getAttribute('data-icon')
          if (iconName) {
            const iconSvg = (window as any).Icons[iconName]
            if (iconSvg) {
              el.innerHTML = iconSvg
            }
          }
        })
      }
      loadIcons()
      // Retry after a short delay in case icons aren't loaded yet
      const timeout = setTimeout(loadIcons, 500)
      return () => clearTimeout(timeout)
    }
  }, [isDashboard])

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

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--'
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <header className="header" id="header" style={isDashboard ? { position: 'relative' } : {}}>
      <div className="header-left">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h2 className="page-title" id="page-title" style={{ margin: 0 }}>
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
              {mounted && currentTime && (
              <div style={{
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em',
                color: 'var(--hearst-green)',
              }}>
                {formatTime(currentTime)}
              </div>
              )}
              {!mounted && (
                <div style={{
                  fontFamily: 'monospace',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.02em',
                  color: 'var(--hearst-green)',
                  width: '80px',
                  height: '20px',
                }}>
                  --
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isDashboard && stats && (
        <div className="header-stats" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          margin: '0 auto',
          padding: '0 var(--space-4)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
            }}>
              Projects
            </div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stats.total_projects || 0}
            </div>
          </div>
          <div style={{
            width: '1px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}></div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
            }}>
              Jobs
            </div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stats.total_jobs || 0}
            </div>
          </div>
          <div style={{
            width: '1px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}></div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-1)',
          }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
            }}>
              Running
            </div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--hearst-green)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stats.jobs_running || 0}
            </div>
          </div>
          {stats.jobs_success_rate !== undefined && (
            <>
              <div style={{
                width: '1px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
              }}></div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600,
                }}>
                  Success Rate
                </div>
                <div style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  color: stats.jobs_success_rate >= 90 ? 'var(--hearst-green)' : stats.jobs_success_rate >= 70 ? '#FFA500' : 'var(--text-error)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {stats.jobs_success_rate.toFixed(1)}%
                </div>
              </div>
            </>
          )}
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

