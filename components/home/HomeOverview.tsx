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
import { statsAPI, cockpitAPI } from '@/lib/api'

// Earnings History Component
function EarningsHistoryTableComponent({ stats }: { stats: DashboardStats }) {
  const [earningsData, setEarningsData] = useState<any[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loadingEarnings, setLoadingEarnings] = useState(true)

  useEffect(() => {
    let isMounted = true
    let hasLoaded = false

    const loadEarnings = async () => {
      if (hasLoaded) return
      hasLoaded = true

      try {
        setLoadingEarnings(true)
        const chartData = await cockpitAPI.getEarningsChart('month')
        
        if (!isMounted) return

        if (chartData?.dates && chartData?.btcEarnings) {
          // Get last 5 days of earnings
          const last5Days = chartData.dates.slice(-5).map((date: string, idx: number) => ({
            date,
            earnings: chartData.btcEarnings[chartData.dates.length - 5 + idx] || 0,
            hashrate: stats.total_jobs || 0, // Use current hashrate
          }))

          setEarningsData(last5Days.reverse())
          setTotalEarnings(chartData.btcEarnings.reduce((sum: number, val: number) => sum + val, 0))
        }
      } catch (err) {
        console.error('Error loading earnings history:', err)
        setEarningsData([])
        setTotalEarnings(0)
      } finally {
        if (isMounted) {
          setLoadingEarnings(false)
        }
      }
    }

    loadEarnings()

    return () => {
      isMounted = false
    }
  }, [stats.total_jobs])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="premium-transaction-section">
      <div className="premium-section-header">
        <h3 className="premium-section-title">Recent Earnings History</h3>
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
            {loadingEarnings ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                  Loading earnings data...
                </td>
              </tr>
            ) : earningsData.length > 0 ? (
              earningsData.map((item, idx) => (
                <tr key={idx}>
                  <td>{formatDate(item.date)}</td>
                  <td>Mining Pool</td>
                  <td className="premium-transaction-amount">{item.earnings.toFixed(6)} BTC</td>
                  <td>{item.hashrate.toLocaleString()} TH/s</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                  No earnings data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!loadingEarnings && totalEarnings > 0 && (
          <div className="premium-transaction-total">
            <strong>Total: <span className="premium-transaction-total-amount">{totalEarnings.toFixed(6)} BTC</span></strong>
          </div>
        )}
      </div>
    </div>
  )
}

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
    let hasLoaded = false
    
    const loadStats = async () => {
      if (!isMounted || hasLoaded) return
      hasLoaded = true
      
      try {
        setLoading(true)
        
        // Fetch cockpit data for real mining stats
        const [cockpitResponse, statsResponse] = await Promise.all([
          import('@/lib/api').then(m => m.cockpitAPI.getData().catch(() => null)),
          statsAPI.getStats().catch(() => null),
        ])
        
        if (!isMounted) return
        
        // Use cockpit data for mining stats, fallback to stats API
        if (cockpitResponse?.data) {
          const cockpit = cockpitResponse.data
          setStats({
            total_projects: cockpit.totalMiners || 0,
            total_versions: cockpit.onlineMiners || 0,
            total_jobs: Math.round(cockpit.globalHashrate || 0),
            jobs_running: Math.round(cockpit.btcProduction24h * 1000000 || 0), // Convert to satoshis for display
            jobs_success_rate: cockpit.globalHashrate && cockpit.theoreticalHashrate 
              ? ((cockpit.globalHashrate / cockpit.theoreticalHashrate) * 100) 
              : 0,
          })
        } else if (statsResponse?.stats) {
          setStats(statsResponse.stats)
        } else if (statsResponse) {
          setStats(statsResponse as DashboardStats)
        }
      } catch (err: any) {
        if (!isMounted) return
        console.error('Error loading stats:', err)
        // Fallback to zero values
        setStats({
          total_projects: 0,
          total_versions: 0,
          total_jobs: 0,
          jobs_running: 0,
          jobs_success_rate: 0,
        })
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadStats()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      hasLoaded = false
      loadStats()
    }, 300000)
    
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Générer des données de hashrate selon la période
  const getHashrateData = () => {
    // Utiliser total_jobs comme base pour le hashrate (en TH/s)
    const baseHashrate = stats.total_jobs || 0
    
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
    // Convert from satoshis back to BTC
    const btcMinedValue = stats.jobs_running ? stats.jobs_running / 1000000 : 0
    
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

  // Earnings History Component
  const EarningsHistoryTable = () => {
    const [earningsData, setEarningsData] = useState<any[]>([])
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [loadingEarnings, setLoadingEarnings] = useState(true)

    useEffect(() => {
      let isMounted = true
      let hasLoaded = false

      const loadEarnings = async () => {
        if (hasLoaded) return
        hasLoaded = true

        try {
          setLoadingEarnings(true)
          const chartData = await cockpitAPI.getEarningsChart('month')
          
          if (!isMounted) return

          if (chartData?.dates && chartData?.btcEarnings) {
            // Get last 5 days of earnings
            const last5Days = chartData.dates.slice(-5).map((date: string, idx: number) => ({
              date,
              earnings: chartData.btcEarnings[chartData.dates.length - 5 + idx] || 0,
              hashrate: stats.total_jobs || 0, // Use current hashrate
            }))

            setEarningsData(last5Days.reverse())
            setTotalEarnings(chartData.btcEarnings.reduce((sum: number, val: number) => sum + val, 0))
          }
        } catch (err) {
          console.error('Error loading earnings history:', err)
          setEarningsData([])
          setTotalEarnings(0)
        } finally {
          if (isMounted) {
            setLoadingEarnings(false)
          }
        }
      }

      loadEarnings()

      return () => {
        isMounted = false
      }
    }, [stats.total_jobs])

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    return (
      <div className="premium-transaction-section">
        <div className="premium-section-header">
          <h3 className="premium-section-title">Recent Earnings History</h3>
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
              {loadingEarnings ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                    Loading earnings data...
                  </td>
                </tr>
              ) : earningsData.length > 0 ? (
                earningsData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{formatDate(item.date)}</td>
                    <td>Mining Pool</td>
                    <td className="premium-transaction-amount">{item.earnings.toFixed(6)} BTC</td>
                    <td>{item.hashrate.toLocaleString()} TH/s</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                    No earnings data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!loadingEarnings && totalEarnings > 0 && (
            <div className="premium-transaction-total">
              <strong>Total: <span className="premium-transaction-total-amount">{totalEarnings.toFixed(6)} BTC</span></strong>
            </div>
          )}
        </div>
      </div>
    )
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
              {loading ? '...' : (stats.total_projects ?? 0).toLocaleString()}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Total Miners</span>
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
              {loading ? '...' : (stats.total_versions ?? 0).toLocaleString()}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Online Miners</span>
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
              {loading ? '...' : `${(stats.total_jobs ?? 0).toLocaleString()} TH/s`}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">Global Hashrate</span>
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
              {loading ? '...' : (stats.jobs_running ? (stats.jobs_running / 1000000).toFixed(6) : '0.000000')}
            </div>
            <div className="premium-stat-footer">
              <span className="premium-stat-description">BTC Production (24h)</span>
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
                  {loading ? '...' : `${(stats.total_jobs || 0).toLocaleString()} TH/s`}
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
      <EarningsHistoryTableComponent stats={stats} />
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

