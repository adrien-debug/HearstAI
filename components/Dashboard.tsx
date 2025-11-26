'use client'

import { useEffect } from 'react'
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

// Dynamically import Chart.js components to avoid SSR issues
const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })),
  { 
    ssr: false,
    loading: () => <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })),
  { 
    ssr: false,
    loading: () => <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
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

interface DashboardProps {
  data?: {
    total_projects?: number
    total_versions?: number
    total_jobs?: number
    jobs_running?: number
    jobs_success_rate?: number
    last_7_days_jobs?: number
    total_storage_mb?: number
  }
}

export default function Dashboard({ data }: DashboardProps) {
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
    // Retry after a short delay in case icons aren't loaded yet
    const timeout = setTimeout(loadIcons, 500)
    return () => clearTimeout(timeout)
  }, [])

  const chartData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Projects',
        data: [2, 4, 6, 8, 9, 10, 11, 11, 12, 12, 12, data?.total_projects || 12],
        borderColor: '#a5ff9c',
        backgroundColor: 'rgba(165, 255, 156, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Jobs',
        data: [15, 32, 48, 67, 89, 112, 145, 178, 201, 215, 228, data?.total_jobs || 234],
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
          data?.total_projects || 0,
          data?.total_versions || 0,
          data?.total_jobs || 0,
          data?.jobs_running || 0,
        ],
        backgroundColor: '#a5ff9c',
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
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#a5ff9c',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Premium Stats Boxes Section */}
        <div className="premium-stats-section">
          <div className="premium-stats-grid">
            <div className="premium-stat-box">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="projects"></div>
                <div className="premium-stat-label">Total Projects</div>
              </div>
              <div className="premium-stat-value">{data?.total_projects || 0}</div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">Active projects</span>
              </div>
            </div>

            <div className="premium-stat-box">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="versions"></div>
                <div className="premium-stat-label">Total Versions</div>
              </div>
              <div className="premium-stat-value">{data?.total_versions || 0}</div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">All versions</span>
              </div>
            </div>

            <div className="premium-stat-box">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="jobs"></div>
                <div className="premium-stat-label">Total Jobs</div>
              </div>
              <div className="premium-stat-value">{data?.total_jobs || 0}</div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">All jobs</span>
              </div>
            </div>

            <div className="premium-stat-box premium-stat-box-highlight">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="running"></div>
                <div className="premium-stat-label">Jobs Running</div>
              </div>
              <div className="premium-stat-value premium-stat-value-green">{data?.jobs_running || 0}</div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">Currently running</span>
              </div>
            </div>

            <div className="premium-stat-box">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="success"></div>
                <div className="premium-stat-label">Success Rate</div>
              </div>
              <div className="premium-stat-value" style={{ 
                color: data?.jobs_success_rate && data.jobs_success_rate >= 0.9 ? '#a5ff9c' : 
                       data?.jobs_success_rate && data.jobs_success_rate >= 0.7 ? '#FFA500' : '#ff4d4d' 
              }}>
                {data?.jobs_success_rate ? `${(data.jobs_success_rate * 100).toFixed(1)}%` : '0%'}
              </div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">Job success rate</span>
              </div>
            </div>

            <div className="premium-stat-box">
              <div className="premium-stat-box-header">
                <div className="premium-stat-icon" data-icon="storage"></div>
                <div className="premium-stat-label">Storage Used</div>
              </div>
              <div className="premium-stat-value">{data?.total_storage_mb ? `${(data.total_storage_mb / 1024).toFixed(2)} GB` : '0 GB'}</div>
              <div className="premium-stat-footer">
                <span className="premium-stat-description">Total storage</span>
              </div>
            </div>
          </div>
        </div>


        {/* Transaction History Section */}
        <div className="premium-transaction-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">Transaction history</h3>
          </div>
          <div className="premium-transaction-placeholder" style={{ padding: 0, textAlign: 'left' }}>
            <div className="table-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <table className="table" style={{ background: 'transparent' }}>
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
                    <td style={{ color: 'var(--hearst-green)', fontWeight: 600 }}>0.084521 BTC</td>
                    <td>2041.42 TH/s</td>
                  </tr>
                  <tr>
                    <td>2025-01-17</td>
                    <td>AKT04</td>
                    <td style={{ color: 'var(--hearst-green)', fontWeight: 600 }}>0.083247 BTC</td>
                    <td>2041.42 TH/s</td>
                  </tr>
                  <tr>
                    <td>2025-01-16</td>
                    <td>AKT05</td>
                    <td style={{ color: 'var(--hearst-green)', fontWeight: 600 }}>0.082156 BTC</td>
                    <td>1987.23 TH/s</td>
                  </tr>
                  <tr>
                    <td>2025-01-15</td>
                    <td>AKT06</td>
                    <td style={{ color: 'var(--hearst-green)', fontWeight: 600 }}>0.081234 BTC</td>
                    <td>2156.78 TH/s</td>
                  </tr>
                  <tr>
                    <td>2025-01-14</td>
                    <td>AKT04</td>
                    <td style={{ color: 'var(--hearst-green)', fontWeight: 600 }}>0.080521 BTC</td>
                    <td>2041.42 TH/s</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)', padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '16px', fontWeight: 600 }}>
                <strong>Total: <span style={{ color: 'var(--hearst-green)', marginLeft: 'var(--space-2)' }}>0.491902 BTC</span></strong>
              </div>
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
            <div className="chart-container" style={{ position: 'relative', width: '100%', height: '240px' }}>
              <LineChart data={chartData1} options={chartOptions} />
            </div>
          </div>

          <div className="wallet-chart-section">
            <div className="chart-header">
              <h2 className="chart-title">Statistics Bar Chart</h2>
            </div>
            <div className="chart-container" style={{ position: 'relative', width: '100%', height: '240px' }}>
              <BarChart data={chartData2} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



