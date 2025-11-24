'use client'

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

const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })),
  { 
    ssr: false,
    loading: () => <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>
  }
)

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

export default function HomeAnalytics() {
  const analyticsData = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }),
    datasets: [
      {
        label: 'Revenue (USD)',
        data: Array.from({ length: 30 }, () => Math.random() * 5000 + 3000),
        borderColor: '#C5FFA7',
        backgroundColor: 'rgba(197, 255, 167, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 15,
        },
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
          maxRotation: 45,
          minRotation: 0,
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
      {/* Analytics Chart */}
      <div className="home-card">
        <div className="home-card-header">
          <div className="home-card-title">Revenue Analytics</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="home-btn-secondary">Last 7 Days</button>
            <button className="home-btn-secondary">Last 30 Days</button>
            <button className="home-btn">Export</button>
          </div>
        </div>
        <div className="home-card-body">
          <div style={{ position: 'relative', height: '350px', width: '100%' }}>
            <LineChart data={analyticsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Analytics Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Revenue (30d)</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>$125,432.89</div>
          <div className="kpi-description">+12.5% vs last period</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Average Daily Revenue</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>$4,181.10</div>
          <div className="kpi-description">Last 30 days average</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Peak Revenue Day</div>
          <div className="kpi-value">$8,432.50</div>
          <div className="kpi-description">2025-01-15</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Revenue Growth</div>
          <div className="kpi-value" style={{ color: '#C5FFA7' }}>+12.5%</div>
          <div className="kpi-description">Month over month</div>
        </div>
      </div>
    </div>
  )
}


