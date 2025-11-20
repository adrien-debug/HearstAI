'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false })
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false })

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
  }, [])

  const chartData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projects',
        data: [0, data?.total_projects || 0, 0, 0, 0, 0],
        borderColor: '#9EFF00',
        backgroundColor: 'rgba(158, 255, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Jobs',
        data: [0, 0, 0, 0, 0, data?.total_jobs || 0],
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
        backgroundColor: '#9EFF00',
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
        borderColor: '#9EFF00',
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
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.total_projects || 0}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                Active projects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.total_versions || 0}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                All versions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.total_jobs || 0}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                All jobs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jobs Running</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.jobs_running || 0}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                Currently running
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.jobs_success_rate ? `${Math.round(data.jobs_success_rate * 100)}%` : '0%'}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                Job success rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9EFF00' }}>
                {data?.total_storage_mb ? `${(data.total_storage_mb / 1024).toFixed(2)} GB` : '0 GB'}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                Total storage
              </p>
            </CardContent>
          </Card>
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
              <Line data={chartData1} options={chartOptions} />
            </div>
          </div>

          <div className="wallet-chart-section">
            <div className="chart-header">
              <h2 className="chart-title">Statistics Bar Chart</h2>
            </div>
            <div className="chart-container">
              <Bar data={chartData2} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



