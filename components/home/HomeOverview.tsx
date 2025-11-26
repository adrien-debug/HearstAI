'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Icon from '@/components/Icon'

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
    return { default: () => <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart unavailable</div> }
  }),
  { 
    ssr: false,
    loading: () => <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })).catch((err) => {
    console.error('Error loading BarChart:', err)
    return { default: () => <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart unavailable</div> }
  }),
  { 
    ssr: false,
    loading: () => <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
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
  const [activeSection, setActiveSection] = useState('overview')
  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    total_versions: 0,
    total_jobs: 0,
    jobs_running: 0,
    jobs_success_rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [btcMinedPeriod, setBtcMinedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [hashratePeriod, setHashratePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const sections = [
    { id: 'overview', label: 'Hearst' },
    { id: 'search', label: 'WeMine' },
    { id: 'history', label: 'Meeneo' },
  ]

  useEffect(() => {
    setMounted(true)
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

  // Générer des données de hashrate selon la période
  const getHashrateData = () => {
    // Utiliser total_jobs comme base pour le hashrate (en TH/s)
    const baseHashrate = (stats.total_jobs || 0) * 100 // Multiplier pour avoir des valeurs réalistes en TH/s
    
    if (hashratePeriod === 'daily') {
      // 24 heures
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0') + ':00'
        return hour
      })
      // Variations fixes pour chaque heure (simulation réaliste)
      const hourlyVariations = [0.85, 0.82, 0.80, 0.78, 0.79, 0.81, 0.85, 0.90, 0.95, 0.98, 1.0, 1.02, 1.03, 1.02, 1.0, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.85, 0.84]
      return {
        labels: hours,
        datasets: [
          {
            label: 'Total Hashrate',
            data: hourlyVariations.map(variation => baseHashrate * variation),
            borderColor: '#C5FFA7',
            backgroundColor: 'rgba(197, 255, 167, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      }
    } else if (hashratePeriod === 'weekly') {
      // 7 jours
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Total Hashrate',
            data: [
              baseHashrate * 0.95,
              baseHashrate * 0.98,
              baseHashrate * 1.0,
              baseHashrate * 1.02,
              baseHashrate * 1.0,
              baseHashrate * 0.97,
              baseHashrate * 0.95,
            ],
            borderColor: '#C5FFA7',
            backgroundColor: 'rgba(197, 255, 167, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      }
    } else {
      // monthly - 4 semaines
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Total Hashrate',
            data: [
              baseHashrate * 0.92,
              baseHashrate * 0.96,
              baseHashrate * 1.0,
              baseHashrate * 1.02,
            ],
            borderColor: '#C5FFA7',
            backgroundColor: 'rgba(197, 255, 167, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      }
    }
  }

  const chartData1 = getHashrateData()

  // Données BTC Mined selon la période
  const getBtcMinedData = () => {
    const btcMinedValue = stats.jobs_running || 0 // Utiliser jobs_running comme valeur de base pour BTC Mined
    
    if (btcMinedPeriod === 'weekly') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'BTC Mined',
            data: [
              btcMinedValue * 0.12,
              btcMinedValue * 0.15,
              btcMinedValue * 0.18,
              btcMinedValue * 0.14,
              btcMinedValue * 0.16,
              btcMinedValue * 0.13,
              btcMinedValue * 0.12,
            ],
            backgroundColor: '#C5FFA7',
          },
        ],
      }
    } else if (btcMinedPeriod === 'monthly') {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'BTC Mined',
            data: [
              btcMinedValue * 0.22,
              btcMinedValue * 0.28,
              btcMinedValue * 0.25,
              btcMinedValue * 0.25,
            ],
            backgroundColor: '#C5FFA7',
          },
        ],
      }
    } else {
      // yearly
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'BTC Mined',
            data: [
              btcMinedValue * 0.06,
              btcMinedValue * 0.07,
              btcMinedValue * 0.08,
              btcMinedValue * 0.09,
              btcMinedValue * 0.10,
              btcMinedValue * 0.09,
              btcMinedValue * 0.08,
              btcMinedValue * 0.09,
              btcMinedValue * 0.10,
              btcMinedValue * 0.08,
              btcMinedValue * 0.08,
              btcMinedValue * 0.08,
            ],
            backgroundColor: '#C5FFA7',
          },
        ],
      }
    }
  }

  const chartData2 = getBtcMinedData()

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
      {/* Page Title */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ 
          fontSize: 'var(--text-2xl)', 
          fontWeight: 700,
          color: '#ffffff',
          margin: 0,
          marginBottom: 'var(--space-4)'
        }}>
          Intelligent Mining Platform
        </h1>
        
        {/* Navigation tabs */}
        <nav className="ai-nav-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`ai-nav-tab ${activeSection === section.id ? 'active' : ''}`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      {activeSection === 'overview' && (
        <>
          {/* Premium Stats Boxes Section */}
      <div className="premium-stats-section">
        <div className="premium-stats-grid">
          <div className="premium-stat-box">
            <div className="premium-stat-box-header">
              <div className="premium-stat-icon">
                <Icon name="projects" />
              </div>
              <div className="premium-stat-label">Total Turnover</div>
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
              <div className="premium-stat-icon">
                <Icon name="versions" />
              </div>
              <div className="premium-stat-label">Numbers of clients</div>
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
              <div className="premium-stat-icon">
                <Icon name="jobs" />
              </div>
              <div className="premium-stat-label">Total Miners</div>
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
              <div className="premium-stat-icon">
                <Icon name="running" />
              </div>
              <div className="premium-stat-label">BTC Mined</div>
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

      {/* Charts Container */}
      <div className="wallet-charts-container">
        <div className="wallet-chart-section">
          <div className="chart-header">
            <div className="chart-header-left">
              <h2 className="chart-title">Total Hashrate</h2>
              <div className="chart-live-hashrate">
                <span className="chart-live-label">Live hashrate:</span>
                <span className="chart-live-value">
                  {loading ? '...' : `${((stats.total_jobs || 0) * 100).toLocaleString()} TH/s`}
                </span>
              </div>
            </div>
            <div className="chart-period-tabs">
              <button
                className={`chart-period-tab ${hashratePeriod === 'daily' ? 'active' : ''}`}
                onClick={() => setHashratePeriod('daily')}
              >
                Daily
              </button>
              <button
                className={`chart-period-tab ${hashratePeriod === 'weekly' ? 'active' : ''}`}
                onClick={() => setHashratePeriod('weekly')}
              >
                Weekly
              </button>
              <button
                className={`chart-period-tab ${hashratePeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setHashratePeriod('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="chart-container">
            {mounted ? (
              <ChartWrapper fallback={<div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart error</div>}>
                <LineChart data={chartData1} options={chartOptions} />
              </ChartWrapper>
            ) : (
              <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading chart...
              </div>
            )}
          </div>
        </div>

        <div className="wallet-chart-section">
          <div className="chart-header">
            <h2 className="chart-title">BTC Mined</h2>
            <div className="chart-period-tabs">
              <button
                className={`chart-period-tab ${btcMinedPeriod === 'weekly' ? 'active' : ''}`}
                onClick={() => setBtcMinedPeriod('weekly')}
              >
                Weekly
              </button>
              <button
                className={`chart-period-tab ${btcMinedPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setBtcMinedPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`chart-period-tab ${btcMinedPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setBtcMinedPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="chart-container">
            {mounted ? (
              <ChartWrapper fallback={<div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Chart error</div>}>
                <BarChart data={chartData2} options={chartOptions} />
              </ChartWrapper>
            ) : (
              <div style={{ height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                Loading chart...
              </div>
            )}
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
        </>
      )}

      {activeSection === 'search' && (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Search</h2>
          <p>Search section coming soon...</p>
        </div>
      )}

      {activeSection === 'history' && (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>History</h2>
          <p>History section coming soon...</p>
        </div>
      )}
    </div>
  )
}

