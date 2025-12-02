'use client'

import { useEffect, useState } from 'react'
import { cockpitAPI } from '@/lib/api'
import dynamic from 'next/dynamic'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import './Cockpit.css'

// Dynamically import Chart.js components to avoid SSR issues
const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })),
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
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function CockpitProduction() {
  // Initialize with 0 values - no mock data (same as dashboard)
  const [data, setData] = useState<any>({
    btcProduction24h: 0,
    btcProduction24hUSD: 0,
    btcProductionMonthly: 0,
    btcProductionMonthlyUSD: 0,
  })

  // Chart data state
  const [earningsChartData, setEarningsChartData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await cockpitAPI.getData()
        if (response && response.data) {
          console.log('[CockpitProduction] Received data:', {
            btcProduction24h: response.data.btcProduction24h,
            btcProductionMonthly: response.data.btcProductionMonthly,
            btcProductionMonthlyUSD: response.data.btcProductionMonthlyUSD
          })
          setData(response.data)
        } else {
          // If no data, set to 0 values
          console.log('[CockpitProduction] No data in response')
          setData({
            btcProduction24h: 0,
            btcProduction24hUSD: 0,
            btcProductionMonthly: 0,
            btcProductionMonthlyUSD: 0,
          })
        }
      } catch (err) {
        // If API fails, set to 0 values - no mock data
        console.error('Failed to load production data:', err)
        setData({
          btcProduction24h: 0,
          btcProduction24hUSD: 0,
          btcProductionMonthly: 0,
          btcProductionMonthlyUSD: 0,
        })
      }
    }
    
    // Try to load real data silently in the background (same as dashboard)
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Load earnings chart data (one year)
  useEffect(() => {
    const loadEarningsChartData = async () => {
      try {
        const chartData = await cockpitAPI.getEarningsChart('year')
        if (chartData) {
          // Process and set chart data
          setEarningsChartData({
            labels: chartData.dates || [],
            datasets: [
              {
                label: 'BTC Earnings',
                data: chartData.btcEarnings || [],
                borderColor: '#FF9500', // Orange
                backgroundColor: 'rgba(255, 149, 0, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'rect' as const,
                pointBackgroundColor: '#FF9500',
                pointBorderColor: '#FF9500',
              },
            ],
          })
        }
      } catch (err) {
        console.error('Failed to load earnings chart data:', err)
        setEarningsChartData(null)
      }
    }

    loadEarningsChartData()
    // Refresh every 30 seconds
    const interval = setInterval(loadEarningsChartData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Chart options - same as dashboard earnings chart
  const earningsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
          usePointStyle: true,
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
          pointStyle: 'rect' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: true,
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#FF9500',
        borderColor: 'rgba(255, 149, 0, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y || 0
            return `${value.toFixed(6)} BTC`
          },
        },
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
          callback: function(value: any) {
            return value.toFixed(4) + ' BTC'
          },
        },
      },
    },
  }

  return (
    <div>
      {/* KPI Cards - Dashboard Style (UNIFIED STRUCTURE) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Daily Production</div>
          <div className="kpi-value">{(data?.btcProduction24h ?? 0).toFixed(6)} BTC</div>
          <div className="kpi-description">Last 24 hours</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Monthly Production</div>
          <div className="kpi-value">{(data?.btcProductionMonthly ?? 0).toFixed(6)} BTC</div>
          <div className="kpi-description">Current month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Efficiency</div>
          <div className="kpi-value">0%</div>
          <div className="kpi-description">Average efficiency</div>
        </div>
      </div>

      {/* Production History - Dashboard Style */}
      <div className="cockpit-chart-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Production History</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-chart-container">
            {earningsChartData ? (
              <LineChart data={earningsChartData} options={earningsChartOptions} />
            ) : (
              <div className="cockpit-chart-placeholder">Loading chart data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
