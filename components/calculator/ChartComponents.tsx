'use client'

import { useMemo } from 'react'
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

// Register Chart.js components once
if (typeof window !== 'undefined') {
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
}

// Lazy load charts
const LineChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Line })),
  { ssr: false }
)

const BarChart = dynamic(
  () => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })),
  { ssr: false }
)

interface ChartComponentsProps {
  calculationResult: any
}

export default function ChartComponents({ calculationResult }: ChartComponentsProps) {
  // Memoize all chart data with proper calculations
  const chartData = useMemo(() => {
    if (!calculationResult?.monthly_projections || !Array.isArray(calculationResult.monthly_projections)) {
      return null
    }

    const projections = calculationResult.monthly_projections

    // Extract and validate data
    const revenueData: number[] = []
    const costsData: number[] = []
    const cumulativeNetData: number[] = []
    const btcMinedData: number[] = []
    const labels: string[] = []

    projections.forEach((p: any, index: number) => {
      // Revenue
      const revenue = typeof p.revenue === 'number' && !isNaN(p.revenue) ? p.revenue : 0
      revenueData.push(revenue)

      // Costs - handle both naming conventions
      const electricity = typeof p.electricity_cost === 'number' && !isNaN(p.electricity_cost) 
        ? p.electricity_cost 
        : (typeof p.electricityCost === 'number' && !isNaN(p.electricityCost) ? p.electricityCost : 0)
      const opex = typeof p.opex_total === 'number' && !isNaN(p.opex_total) 
        ? p.opex_total 
        : (typeof p.opexTotal === 'number' && !isNaN(p.opexTotal) ? p.opexTotal : 0)
      const poolFee = typeof p.pool_fee_cost === 'number' && !isNaN(p.pool_fee_cost) 
        ? p.pool_fee_cost 
        : (typeof p.poolFeeCost === 'number' && !isNaN(p.poolFeeCost) ? p.poolFeeCost : 0)
      costsData.push(electricity + opex + poolFee)

      // Cumulative net
      const cumulative = typeof p.cumulative_net_revenue === 'number' && !isNaN(p.cumulative_net_revenue) 
        ? p.cumulative_net_revenue 
        : 0
      cumulativeNetData.push(cumulative)

      // BTC mined
      const btc = typeof p.btc_mined === 'number' && !isNaN(p.btc_mined) ? p.btc_mined : 0
      btcMinedData.push(btc)

      // Labels - show every 3rd month or important milestones
      const monthNum = p.month || index + 1
      if (index % 3 === 0 || index === 0 || index === projections.length - 1) {
        labels.push(`M${monthNum}`)
      } else {
        labels.push('')
      }
    })

    // Calculate Y-axis ranges for better scaling
    const allRevenueValues = revenueData.filter(v => v > 0)
    const allCostValues = costsData.filter(v => v > 0)
    const allValues = [...allRevenueValues, ...allCostValues]
    
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0
    const minValue = allValues.length > 0 ? Math.min(...allValues) : 0
    
    // Set Y-axis max with 10% padding
    const yAxisMax = maxValue > 0 ? maxValue * 1.1 : 1000
    const yAxisMin = minValue < 0 ? minValue * 1.1 : 0

    // Cumulative net range
    const cumulativeMax = cumulativeNetData.length > 0 ? Math.max(...cumulativeNetData) : 0
    const cumulativeMin = cumulativeNetData.length > 0 ? Math.min(...cumulativeNetData) : 0
    const cumulativeYMax = cumulativeMax > 0 ? cumulativeMax * 1.1 : 1000
    const cumulativeYMin = cumulativeMin < 0 ? cumulativeMin * 1.1 : 0

    // BTC mined range for Y-axis scaling
    const btcMax = btcMinedData.length > 0 ? Math.max(...btcMinedData) : 0
    const btcMin = btcMinedData.length > 0 ? Math.min(...btcMinedData) : 0
    const btcYMax = btcMax > 0 ? btcMax * 1.1 : 0.01
    const btcYMin = 0 // Always start at zero for BTC mined

    return {
      labels,
      fullLabels: projections.map((p: any, i: number) => `Month ${p.month || i + 1}`),
      revenueData,
      costsData,
      cumulativeNetData,
      btcMinedData,
      yAxisMax,
      yAxisMin,
      cumulativeYMax,
      cumulativeYMin,
      btcYMax,
      btcYMin,
    }
  }, [calculationResult])

  // Base chart options - memoized
  const baseChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, // Disable animations for better performance
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          padding: 12,
          font: {
            size: 11,
            weight: '500' as const,
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: '#C5FFA7',
        bodyColor: '#ffffff',
        borderColor: 'rgba(197, 255, 167, 0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return context[0].label || ''
          },
          label: function(context: any) {
            const label = context.dataset.label || ''
            const value = context.parsed.y
            if (label.includes('BTC')) {
              return `${label}: ${value.toFixed(6)} BTC`
            }
            return `${label}: $${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
          },
        },
      },
    },
  }), [])

  // Revenue vs Costs chart - DISABLED (removed per user request)

  // Cumulative chart options
  const cumulativeOptions = useMemo(() => ({
    ...baseChartOptions,
    scales: {
      x: {
        display: true,
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          display: true,
          drawBorder: false,
        },
      },
      y: {
        display: true,
        beginAtZero: false,
        max: chartData?.cumulativeYMax,
        min: chartData?.cumulativeYMin,
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          callback: function(value: any) {
            if (typeof value === 'number') {
              const absValue = Math.abs(value)
              if (absValue >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`
              } else if (absValue >= 1000) {
                return `$${(value / 1000).toFixed(0)}K`
              }
              return `$${value.toFixed(0)}`
            }
            return value
          },
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          display: true,
          drawBorder: false,
        },
      },
    },
  }), [baseChartOptions, chartData?.cumulativeYMax, chartData?.cumulativeYMin])

  // BTC chart options
  const btcOptions = useMemo(() => ({
    ...baseChartOptions,
    scales: {
      x: {
        display: true,
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          display: true,
          drawBorder: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        min: 0,
        max: chartData?.btcYMax,
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 10,
          },
          stepSize: chartData?.btcYMax ? chartData.btcYMax / 8 : undefined,
          callback: function(value: any) {
            if (typeof value === 'number') {
              // Handle zero
              if (value === 0) {
                return '0 BTC'
              }
              // Handle very small values that might round to zero when formatted
              if (Math.abs(value) < 0.0000001) {
                return '0 BTC'
              }
              // Format based on magnitude
              if (value >= 1) {
                return `${value.toFixed(2)} BTC`
              } else if (value >= 0.01) {
                return `${value.toFixed(4)} BTC`
              } else if (value >= 0.0001) {
                return `${value.toFixed(6)} BTC`
              } else if (value >= 0.000001) {
                return `${value.toFixed(8)} BTC`
              } else if (value > 0) {
                // Use scientific notation for extremely small values
                return `${value.toExponential(2)} BTC`
              }
              // Handle negative values (shouldn't happen for BTC mined, but just in case)
              if (value <= -1) {
                return `${value.toFixed(2)} BTC`
              } else if (value <= -0.01) {
                return `${value.toFixed(4)} BTC`
              } else if (value <= -0.0001) {
                return `${value.toFixed(6)} BTC`
              } else if (value < 0) {
                return `${value.toExponential(2)} BTC`
              }
            }
            return value
          },
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.03)',
          display: true,
          drawBorder: false,
        },
      },
    },
  }), [baseChartOptions, chartData?.btcYMax])

  if (!chartData) {
    return (
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ 
          padding: 'var(--space-6)', 
          textAlign: 'center', 
          color: 'var(--text-secondary)',
          background: 'rgba(26, 26, 26, 0.5)',
          borderRadius: 'var(--radius-md)',
        }}>
          No chart data available. Please run a calculation first.
        </div>
      </div>
    )
  }

  // Validate data
  if (chartData.revenueData.length === 0 || chartData.costsData.length === 0) {
    return (
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ 
          padding: 'var(--space-6)', 
          textAlign: 'center', 
          color: 'var(--text-secondary)',
          background: 'rgba(26, 26, 26, 0.5)',
          borderRadius: 'var(--radius-md)',
        }}>
          Chart data is incomplete. Please check your calculation inputs.
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <h3 style={{ 
        fontSize: 'var(--text-lg)', 
        fontWeight: 700, 
        color: '#ffffff', 
        marginBottom: 'var(--space-4)',
        letterSpacing: '0.5px',
      }}>
        Monthly Projections
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', 
        gap: 'var(--space-4)',
      }}>
        {/* Revenue vs Costs Chart - DISABLED */}
        {/* Cumulative Net Revenue Chart - DISABLED */}
        <div style={{ 
          padding: 'var(--space-4)', 
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          display: 'none',
        }}>
          <h4 style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 600, 
            color: '#ffffff', 
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <span style={{ 
              width: '4px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #C5FFA7 0%, #8FD85F 100%)',
              borderRadius: '2px',
            }}></span>
            Cumulative Net Revenue
          </h4>
          <div style={{ height: '320px', position: 'relative' }}>
            <LineChart
              data={{
                labels: chartData.fullLabels,
                datasets: [
                  {
                    label: 'Cumulative Net Revenue',
                    data: chartData.cumulativeNetData,
                    borderColor: '#C5FFA7',
                    backgroundColor: 'rgba(197, 255, 167, 0.12)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#C5FFA7',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2,
                    borderWidth: 2.5,
                    segment: {
                      borderDash: (ctx: any) => ctx.p1.parsed.y < 0 ? [5, 5] : [],
                    },
                  },
                ],
              }}
              options={cumulativeOptions}
            />
          </div>
        </div>

        {/* BTC Mined Chart */}
        <div style={{ 
          padding: 'var(--space-4)', 
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          gridColumn: '1 / -1',
        }}>
          <h4 style={{ 
            fontSize: 'var(--text-md)', 
            fontWeight: 600, 
            color: '#ffffff', 
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
            <span style={{ 
              width: '4px', 
              height: '16px', 
              background: 'linear-gradient(180deg, #C5FFA7 0%, #8FD85F 100%)',
              borderRadius: '2px',
            }}></span>
            BTC Mined per Month
          </h4>
          <div style={{ height: '320px', position: 'relative' }}>
            <BarChart
              data={{
                labels: chartData.fullLabels,
                datasets: [
                  {
                    label: 'BTC Mined',
                    data: chartData.btcMinedData,
                    backgroundColor: 'rgba(197, 255, 167, 0.4)',
                    borderColor: '#C5FFA7',
                    borderWidth: 1.5,
                    borderRadius: 4,
                    borderSkipped: false,
                  },
                ],
              }}
              options={btcOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
