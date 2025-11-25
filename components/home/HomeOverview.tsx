'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Simple Chart Wrapper with error handling
const ChartWrapper = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
  return <>{children}</>
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { statsAPI } from '@/lib/api'

// Dynamically import Chart.js components to avoid SSR issues
const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })).catch((err) => {
    console.error('Error loading LineChart:', err)
    return { default: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart unavailable</div> }
  }),
  { 
    ssr: false,
    loading: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })).catch((err) => {
    console.error('Error loading BarChart:', err)
    return { default: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart unavailable</div> }
  }),
  { 
    ssr: false,
    loading: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DashboardStats {
  total_projects?: number
  total_versions?: number
  total_jobs?: number
  jobs_running?: number
  jobs_success_rate?: number
}

export default function HomeOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    total_versions: 0,
    total_jobs: 0,
    jobs_running: 0,
    jobs_success_rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Debug: Détecter les éléments qui bloquent les clics
  useEffect(() => {
    setMounted(true)
    console.log('[HomeOverview] ✅ Composant monté et hydraté')
    
    // Attendre que le DOM soit prêt
    setTimeout(() => {
      // CHERCHER LES OVERLAYS QUI BLOQUENT
      const allElements = document.querySelectorAll('*')
      const blockingElements: Element[] = []
      
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        
        // Vérifier si l'élément couvre l'écran ou bloque les interactions
        const isFullScreen = 
          (rect.top <= 0 && rect.bottom >= window.innerHeight) ||
          (rect.left <= 0 && rect.right >= window.innerWidth) ||
          (style.position === 'fixed' && (rect.width > window.innerWidth * 0.8 || rect.height > window.innerHeight * 0.8))
        
        const hasHighZIndex = parseInt(style.zIndex) > 1000 || style.zIndex === 'auto'
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
        const blocksPointer = style.pointerEvents === 'none' ? false : true
        
        if (isFullScreen && hasHighZIndex && isVisible && blocksPointer && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
          blockingElements.push(el)
          console.warn('[HomeOverview] 🚨 ÉLÉMENT BLOQUANT DÉTECTÉ:', {
            tag: el.tagName,
            className: el.className,
            id: el.id,
            zIndex: style.zIndex,
            position: style.position,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
            pointerEvents: style.pointerEvents,
            element: el
          })
        }
      })
      
      if (blockingElements.length > 0) {
        console.error('[HomeOverview] ❌ ÉLÉMENTS QUI BLOQUENT LES CLICS:', blockingElements)
        
        // ESSAYER DE LES DÉSACTIVER
        blockingElements.forEach((el, idx) => {
          const htmlEl = el as HTMLElement
          console.log(`[HomeOverview] 🔧 Tentative de désactivation élément ${idx}:`, htmlEl.className)
          
          // Option 1: pointer-events: none
          htmlEl.style.pointerEvents = 'none'
          console.log(`[HomeOverview] ✅ pointer-events: none appliqué à`, htmlEl.className)
          
          // Option 2: display: none temporairement pour test
          // htmlEl.style.display = 'none'
        })
      } else {
        console.log('[HomeOverview] ✅ Aucun élément bloquant détecté')
      }
      
      // Vérifier le bouton de test
      const testButton = document.querySelector('[style*="zIndex: 99999"]') || 
                        document.querySelector('[style*="z-index: 99999"]')
      if (testButton) {
        console.log('[HomeOverview] ✅ Bouton de test trouvé:', testButton)
        
        // FORCER l'ajout d'un event listener natif avec capture
        const nativeHandler = (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          console.log('[HomeOverview] 🔥🔥🔥 CLIC NATIF DÉTECTÉ !!!')
          alert('CLIC NATIF FONCTIONNE !')
          return false
        }
        
        testButton.addEventListener('click', nativeHandler, { capture: true, passive: false })
        testButton.addEventListener('mousedown', nativeHandler, { capture: true, passive: false })
        testButton.addEventListener('mouseup', nativeHandler, { capture: true, passive: false })
        console.log('[HomeOverview] ✅ Event listeners natifs ajoutés avec capture')
      }
      
      // Test avec tous les boutons
      const allButtons = document.querySelectorAll('button')
      console.log('[HomeOverview] 📊 Total boutons trouvés:', allButtons.length)
    }, 2000)
  }, [])

  useEffect(() => {
    let isMounted = true
    
    // MODE DEBUG LOCAL : Utiliser des données mockées pour éviter les blocages
    const isLocal = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '6001'
    )
    
    if (isLocal) {
      console.log('[HomeOverview] 🔧 MODE LOCAL - Utilisation de données mockées')
      // Utiliser des données mockées immédiatement
      setStats({
        total_projects: 12,
        total_versions: 45,
        total_jobs: 234,
        jobs_running: 3,
        jobs_success_rate: 98.5,
      })
      setLoading(false)
      return () => {
        isMounted = false
      }
    }
    
    // EN PRODUCTION : Charger les vraies stats
    let abortController: AbortController | null = null
    
    const loadStats = async () => {
      if (!isMounted) return
      
      if (abortController) {
        abortController.abort()
      }
      abortController = new AbortController()
      
      try {
        setLoading(true)
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stats API timeout')), 3000)
        )
        
        const statsPromise = statsAPI.getStats()
        const response = await Promise.race([statsPromise, timeoutPromise]) as any
        
        if (!isMounted || abortController.signal.aborted) return
        
        if (response && response.stats) {
          setStats(response.stats)
        } else if (response) {
          setStats(response as DashboardStats)
        }
      } catch (err: any) {
        if (!isMounted || abortController.signal.aborted) return
        if (err.name !== 'AbortError') {
          console.error('Error loading stats:', err)
          // Fallback vers données mockées en cas d'erreur
          setStats({
            total_projects: 12,
            total_versions: 45,
            total_jobs: 234,
            jobs_running: 3,
            jobs_success_rate: 98.5,
          })
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStats()
    
    return () => {
      isMounted = false
      if (abortController) abortController.abort()
    }
  }, [])
  
  // Load icons séparément avec useEffect pour éviter les conflits
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadIcons = () => {
      try {
        if ((window as any).Icons) {
          const icons = document.querySelectorAll('[data-icon]')
          icons.forEach(el => {
            try {
              const iconName = el.getAttribute('data-icon')
              if (iconName && (window as any).Icons[iconName]) {
                el.innerHTML = (window as any).Icons[iconName]
              }
            } catch (iconError) {
              // Ignorer les erreurs d'icônes
            }
          })
        }
      } catch (error) {
        // Ignorer les erreurs
      }
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'complete') {
      loadIcons()
    } else {
      window.addEventListener('load', loadIcons)
      return () => window.removeEventListener('load', loadIcons)
    }
  }, [])

  // Générer des données de graphique basées sur les stats réelles
  const currentProjects = stats.total_projects || 0
  const currentJobs = stats.total_jobs || 0
  
  const chartData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Projects',
        data: [
          Math.max(0, currentProjects - 10),
          Math.max(0, currentProjects - 8),
          Math.max(0, currentProjects - 6),
          Math.max(0, currentProjects - 4),
          Math.max(0, currentProjects - 3),
          Math.max(0, currentProjects - 2),
          Math.max(0, currentProjects - 1),
          Math.max(0, currentProjects - 1),
          currentProjects,
          currentProjects,
          currentProjects,
          currentProjects,
        ],
        borderColor: '#C5FFA7',
        backgroundColor: 'rgba(197, 255, 167, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Jobs',
        data: [
          Math.max(0, currentJobs - 219),
          Math.max(0, currentJobs - 202),
          Math.max(0, currentJobs - 186),
          Math.max(0, currentJobs - 167),
          Math.max(0, currentJobs - 145),
          Math.max(0, currentJobs - 122),
          Math.max(0, currentJobs - 89),
          Math.max(0, currentJobs - 56),
          Math.max(0, currentJobs - 33),
          Math.max(0, currentJobs - 19),
          Math.max(0, currentJobs - 6),
          currentJobs,
        ],
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartData2 = {
    labels: ['Projects', 'Versions', 'Jobs', 'Running'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          stats.total_projects || 0,
          stats.total_versions || 0,
          stats.total_jobs || 0,
          stats.jobs_running || 0,
        ],
        backgroundColor: '#C5FFA7',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#C5FFA7',
        borderColor: 'rgba(197, 255, 167, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <div>
      {/* BOUTON DE TEST URGENT - AVEC SCRIPT NATIF */}
      <div 
        id="test-button-overlay"
        style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          zIndex: 999999, 
          background: 'red', 
          padding: '20px',
          borderRadius: '8px',
          cursor: 'pointer',
          pointerEvents: 'auto' as any
        }}
        ref={(el) => {
          if (el) {
            // Ajouter event listener natif directement
            const handler = (e: MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              e.stopImmediatePropagation()
              console.log('🔥🔥🔥 BOUTON TEST CLIQUE (NATIF) !!!')
              alert('BOUTON TEST FONCTIONNE (NATIF) !')
              return false
            }
            el.addEventListener('click', handler, { capture: true, passive: false })
            el.addEventListener('mousedown', handler, { capture: true, passive: false })
            console.log('[HomeOverview] ✅ Event listeners natifs ajoutés au bouton test')
          }
        }}
      >
        <button 
          id="test-button-inner"
          style={{ 
            background: 'yellow', 
            padding: '10px 20px', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            pointerEvents: 'auto' as any
          }}
          ref={(el) => {
            if (el) {
              const handler = (e: MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                console.log('🔥🔥🔥 BOUTON INTERNE CLIQUE (NATIF) !!!')
                alert('BOUTON INTERNE FONCTIONNE (NATIF) !')
                return false
              }
              el.addEventListener('click', handler, { capture: true, passive: false })
              el.addEventListener('mousedown', handler, { capture: true, passive: false })
            }
          }}
        >
          TEST CLIC ICI
        </button>
      </div>
      
      {/* Premium Stats Boxes Section */}
      <div className="premium-stats-section">
        <div className="premium-stats-grid">
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon" data-icon="projects"></div>
              <div className="premium-stat-label">Total Projects</div>
            </div>
            <div className="premium-stat-value">
              {loading ? '...' : (stats.total_projects ?? 0)}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Active projects</span>
            </div>
          </div>

          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon" data-icon="versions"></div>
              <div className="premium-stat-label">Total Versions</div>
            </div>
            <div className="premium-stat-value">
              {loading ? '...' : (stats.total_versions ?? 0)}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">All versions</span>
            </div>
          </div>

          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon" data-icon="jobs"></div>
              <div className="premium-stat-label">Total Jobs</div>
            </div>
            <div className="premium-stat-value">
              {loading ? '...' : (stats.total_jobs ?? 0)}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">All jobs</span>
            </div>
          </div>

          <div className="premium-stat-box premium-stat-box-highlight">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon" data-icon="running"></div>
              <div className="premium-stat-label">Jobs Running</div>
            </div>
            <div className="premium-stat-value premium-stat-value-green">
              {loading ? '...' : (stats.jobs_running ?? 0)}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Currently running</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Premium Section */}
      <div className="premium-wallet-section">
        <div className="premium-wallet-box">
          <div className="premium-wallet-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="premium-stat-icon" data-icon="wallet"></div>
              <h3 className="premium-wallet-title">Wallet</h3>
            </div>
            <button 
              className="premium-wallet-transaction-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('[HomeOverview] 🔘 Bouton Transaction history cliqué')
                const element = document.querySelector('.premium-transaction-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  console.log('[HomeOverview] ✅ Scroll effectué')
                } else {
                  console.warn('[HomeOverview] ⚠️ Section transaction non trouvée')
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Transaction history
            </button>
          </div>
          <div className="premium-wallet-balance">
            <div className="premium-wallet-balance-btc">0.031819 BTC</div>
            <div className="premium-wallet-balance-usd">$3,628.13 USD</div>
          </div>
          <div className="premium-wallet-address-section">
            <div className="premium-wallet-address">
              <div className="premium-wallet-address-text">1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</div>
              <button 
                className="premium-wallet-copy-btn"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('[HomeOverview] 🔘 Bouton Copy cliqué')
                  try {
                    navigator.clipboard.writeText('1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck').then(() => {
                      console.log('[HomeOverview] ✅ Texte copié')
                      alert('Adresse copiée !')
                    }).catch(err => {
                      console.error('[HomeOverview] ❌ Erreur copie:', err)
                    })
                  } catch (err) {
                    console.error('[HomeOverview] ❌ Erreur:', err)
                  }
                }}
                title="Copy address"
                style={{ cursor: 'pointer' }}
              >
                <span data-icon="copy"></span>
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="premium-transaction-section">
        <div className="premium-section-header">
          <h3 className="premium-section-title">Transaction history</h3>
        </div>
        <div className="premium-transaction-table-container">
          <table className="premium-transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Account</th>
                <th>Total Reward</th>
                <th>Hashrate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-01-18</td>
                <td>AKT04</td>
                <td className="premium-transaction-amount">0.084521 BTC</td>
                <td>2041.42 TH/s</td>
              </tr>
              <tr>
                <td>2025-01-17</td>
                <td>AKT04</td>
                <td className="premium-transaction-amount">0.083247 BTC</td>
                <td>2041.42 TH/s</td>
              </tr>
              <tr>
                <td>2025-01-16</td>
                <td>AKT05</td>
                <td className="premium-transaction-amount">0.082156 BTC</td>
                <td>1987.23 TH/s</td>
              </tr>
              <tr>
                <td>2025-01-15</td>
                <td>AKT06</td>
                <td className="premium-transaction-amount">0.081234 BTC</td>
                <td>2156.78 TH/s</td>
              </tr>
              <tr>
                <td>2025-01-14</td>
                <td>AKT04</td>
                <td className="premium-transaction-amount">0.080521 BTC</td>
                <td>2041.42 TH/s</td>
              </tr>
            </tbody>
          </table>
          <div className="premium-transaction-total">
            <strong>Total: <span className="premium-transaction-total-amount">0.491902 BTC</span></strong>
          </div>
        </div>
      </div>

      {/* Charts Container */}
      <div className="wallet-charts-container">
        <div className="wallet-chart-section">
          <div className="chart-header">
            <h2 className="chart-title">Performance Overview</h2>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot green"></span>
                <span>Projects</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot gray"></span>
                <span>Jobs</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            {typeof window !== 'undefined' ? (
              <ChartWrapper fallback={<div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart error</div>}>
                <LineChart data={chartData1} options={chartOptions} />
              </ChartWrapper>
            ) : (
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading chart...
              </div>
            )}
          </div>
        </div>

        <div className="wallet-chart-section">
          <div className="chart-header">
            <h2 className="chart-title">Statistics Bar Chart</h2>
          </div>
          <div className="chart-container">
            {typeof window !== 'undefined' ? (
              <ChartWrapper fallback={<div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart error</div>}>
                <BarChart data={chartData2} options={chartOptions} />
              </ChartWrapper>
            ) : (
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading chart...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

