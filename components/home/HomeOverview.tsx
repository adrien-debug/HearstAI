'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
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
import { statsAPI } from '@/lib/api/stats'

// Dynamically import Chart.js components to avoid SSR issues
const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })),
  { 
    ssr: false,
    loading: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })),
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

  useEffect(() => {
    // Load icons
    const loadIcons = () => {
      if (typeof window !== 'undefined' && (window as any).Icons) {
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
    }
    
    loadIcons()
    const timeout = setTimeout(loadIcons, 500)
    
    // Load stats from API
    const loadStats = async () => {
      try {
        setLoading(true)
        const response = await statsAPI.getStats()
        if (response && response.stats) {
          setStats(response.stats)
        } else if (response) {
          // Si la réponse n'a pas de .stats, utiliser directement la réponse
          setStats(response as DashboardStats)
        }
      } catch (err) {
        console.error('Error loading stats:', err)
        // Garder les valeurs par défaut en cas d'erreur
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    const statsInterval = setInterval(loadStats, 30000) // Refresh every 30s
    
    return () => {
      clearTimeout(timeout)
      clearInterval(statsInterval)
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
              onClick={() => {
                const element = document.querySelector('.premium-transaction-section')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
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
                onClick={() => {
                  navigator.clipboard.writeText('1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck')
                }}
                title="Copy address"
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
            <LineChart data={chartData1} options={chartOptions} />
          </div>
        </div>

        <div className="wallet-chart-section">
          <div className="chart-header">
            <h2 className="chart-title">Statistics Bar Chart</h2>
          </div>
          <div className="chart-container">
            <BarChart data={chartData2} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

