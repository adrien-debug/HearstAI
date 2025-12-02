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

export default function CockpitDashboard() {
  // Initialize with 0 values - no mock data
  const [data, setData] = useState<any>({
    globalHashrate: 0,
    theoreticalHashrate: 0,
    btcProduction24h: 0,
    totalMiners: 0,
    onlineMiners: 0,
    miningAccounts: [],
  })

  // Chart data states
  const [hashrateChartData, setHashrateChartData] = useState<any>(null)
  const [earningsChartData, setEarningsChartData] = useState<any>(null)
  const [earningsTimeframe, setEarningsTimeframe] = useState<'week' | 'month' | 'year'>('week')
  const [hashrateStats, setHashrateStats] = useState({
    current: 0,
    avg7Day: 0,
    peak: 0,
    theoretical: 0,
  })
  const [earningsStats, setEarningsStats] = useState({
    latest: 0,
    total7Day: 0,
    usdValue: 0,
    peakDay: 0,
  })

  // Sorting state for mining accounts table
  const [sortConfig, setSortConfig] = useState<{
    column: 'account' | 'hashrate' | 'btc24h' | 'usd24h' | 'status' | null
    direction: 'asc' | 'desc'
  }>({
    column: null,
    direction: 'asc',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await cockpitAPI.getData()
        if (response && response.data) {
          setData(response.data)
        } else {
          // If no data, set to 0 values
          setData({
            globalHashrate: 0,
            theoreticalHashrate: 0,
            btcProduction24h: 0,
            totalMiners: 0,
            onlineMiners: 0,
            miningAccounts: [],
          })
        }
      } catch (err) {
        // If API fails, set to 0 values - no mock data
        console.error('Failed to load cockpit data:', err)
        setData({
          globalHashrate: 0,
          theoreticalHashrate: 0,
          btcProduction24h: 0,
          totalMiners: 0,
          onlineMiners: 0,
          miningAccounts: [],
        })
      }
    }
    
    // Try to load real data silently in the background
    loadData()
    const interval = setInterval(loadData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Load hashrate chart data
  useEffect(() => {
    const loadHashrateChartData = async () => {
      try {
        const chartData = await cockpitAPI.getHashrateChart()
        if (chartData) {
          
          // Set chart data
          setHashrateChartData({
            labels: chartData.dates || [],
            datasets: [
              {
                label: 'Real-Time',
                data: chartData.realTime || [],
                borderColor: '#9EFF00', // Green
                backgroundColor: 'rgba(158, 255, 0, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'rect' as const,
                pointBackgroundColor: '#9EFF00',
                pointBorderColor: '#9EFF00',
              },
              {
                label: 'Theoretical',
                data: chartData.theoretical || [],
                borderColor: '#4A9EFF', // Blue
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'rect' as const,
                pointBackgroundColor: '#4A9EFF',
                pointBorderColor: '#4A9EFF',
                borderDash: [5, 5],
              },
            ],
          })

          // Set statistics from API response
          if (chartData.stats) {
            setHashrateStats({
              current: chartData.stats.current || 0,
              avg7Day: chartData.stats.avg7Day || 0,
              peak: chartData.stats.peak || 0,
              theoretical: chartData.stats.theoretical || 0,
            })
          }
        }
      } catch (err) {
        console.error('Failed to load hashrate chart data:', err)
        setHashrateChartData(null)
      }
    }

    loadHashrateChartData()
    // Refresh every 30 seconds
    const interval = setInterval(loadHashrateChartData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load earnings chart data
  useEffect(() => {
    const loadEarningsChartData = async () => {
      try {
        const chartData = await cockpitAPI.getEarningsChart(earningsTimeframe)
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
              {
                label: 'Target',
                data: chartData.target || [],
                borderColor: '#4A9EFF', // Blue
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'rect' as const,
                pointBackgroundColor: '#4A9EFF',
                pointBorderColor: '#4A9EFF',
                borderDash: [5, 5],
              },
            ],
          })

          // Set statistics from API response if available
          if (chartData.stats) {
            setEarningsStats({
              latest: chartData.stats.latest || 0,
              total7Day: chartData.stats.total7Day || 0,
              usdValue: chartData.stats.usdValue || 0,
              peakDay: chartData.stats.peakDay || 0,
            })
          }
        } else {
          // Generate placeholder data for 7 complete days (excluding today)
          const dates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (7 - i)) // Start from yesterday (i=1 to i=7)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          })
          
          const btcEarningsData = Array.from({ length: 7 }, () => data?.btcProduction24h || 0)
          const targetData = Array.from({ length: 7 }, () => (data?.btcProduction24h || 0) * 1.1)
          
          setEarningsChartData({
            labels: dates,
            datasets: [
              {
                label: 'BTC Earnings',
                data: btcEarningsData,
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
              {
                label: 'Target',
                data: targetData,
                borderColor: '#4A9EFF', // Blue
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointStyle: 'rect' as const,
                pointBackgroundColor: '#4A9EFF',
                pointBorderColor: '#4A9EFF',
                borderDash: [5, 5],
              },
            ],
          })

          // Calculate stats
          const latest = btcEarningsData[btcEarningsData.length - 1] || 0
          const total7Day = btcEarningsData.reduce((a, b) => a + b, 0)
          const usdValue = 0 // TODO: Calculate from BTC price
          const peakDay = Math.max(...btcEarningsData)

          setEarningsStats({ latest, total7Day, usdValue, peakDay })
        }
      } catch (err) {
        console.error('Failed to load earnings chart data:', err)
      }
    }

    loadEarningsChartData()
    // Refresh every 30 seconds
    const interval = setInterval(loadEarningsChartData, 30000)
    return () => clearInterval(interval)
  }, [earningsTimeframe, data?.btcProduction24h])

  const onlinePercentage = data && data.totalMiners > 0 ? Math.round((data.onlineMiners / data.totalMiners) * 100) : 0

  // Handle sorting for mining accounts table
  const handleSort = (column: 'account' | 'hashrate' | 'btc24h' | 'usd24h' | 'status') => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        // Toggle direction if clicking the same column
        return {
          column,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }
      } else {
        // Set new column with default direction
        // Numeric columns (btc24h, usd24h, hashrate) default to desc, text columns (account, status) default to asc
        return {
          column,
          direction: (column === 'btc24h' || column === 'usd24h' || column === 'hashrate') ? 'desc' : 'asc',
        }
      }
    })
  }

  // Sort mining accounts based on sortConfig
  const sortedMiningAccounts = data?.miningAccounts ? [...data.miningAccounts].sort((a: any, b: any) => {
    if (!sortConfig.column) return 0

    if (sortConfig.column === 'account') {
      const aName = (a.name || '').toLowerCase()
      const bName = (b.name || '').toLowerCase()
      
      if (sortConfig.direction === 'asc') {
        return aName.localeCompare(bName)
      } else {
        return bName.localeCompare(aName)
      }
    } else if (sortConfig.column === 'hashrate') {
      const aHashrate = a.hashrate || 0
      const bHashrate = b.hashrate || 0
      
      if (sortConfig.direction === 'desc') {
        // Highest to lowest
        return bHashrate - aHashrate
      } else {
        // Lowest to highest
        return aHashrate - bHashrate
      }
    } else if (sortConfig.column === 'btc24h') {
      const aBtc = a.btc24h || 0
      const bBtc = b.btc24h || 0
      
      if (sortConfig.direction === 'desc') {
        // Highest to lowest
        return bBtc - aBtc
      } else {
        // Lowest to highest
        return aBtc - bBtc
      }
    } else if (sortConfig.column === 'usd24h') {
      const aUsd = a.usd24h || 0
      const bUsd = b.usd24h || 0
      
      if (sortConfig.direction === 'desc') {
        // Highest to lowest
        return bUsd - aUsd
      } else {
        // Lowest to highest
        return aUsd - bUsd
      }
    } else if (sortConfig.column === 'status') {
      const aStatus = (a.status || '').toLowerCase()
      const bStatus = (b.status || '').toLowerCase()
      const aIsActive = aStatus === 'active'
      const bIsActive = bStatus === 'active'
      
      if (sortConfig.direction === 'asc') {
        // Active first
        return aIsActive === bIsActive ? 0 : aIsActive ? -1 : 1
      } else {
        // Inactive first
        return aIsActive === bIsActive ? 0 : aIsActive ? 1 : -1
      }
    }
    
    return 0
  }) : []

  const hashrateChartOptions = {
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
        bodyColor: '#9EFF00',
        borderColor: 'rgba(158, 255, 0, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        filter: function(tooltipItem: any) {
          // Only show Real-Time dataset in tooltip
          return tooltipItem.datasetIndex === 0
        },
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y || 0
            return `${value.toFixed(2)} PH/s`
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
            return value.toFixed(1) + ' PH/s'
          },
        },
      },
    },
  }

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
        filter: function(tooltipItem: any) {
          // Only show BTC Earnings dataset in tooltip
          return tooltipItem.datasetIndex === 0
        },
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
          <div className="kpi-label">Global Hashrate</div>
          <div className="kpi-value">{data?.globalHashrate || 0} PH/s</div>
          <div className="kpi-description">Theoretical: {data?.theoreticalHashrate || 0} PH/s</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">BTC Production (24h)</div>
          <div className="kpi-value">{data?.btcProduction24h ? data.btcProduction24h.toFixed(6) : '0.000000'} BTC</div>
          <div className="kpi-description">≈ ${data?.btcProduction24hUSD ? data.btcProduction24hUSD.toFixed(2) : '0.00'} USD</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Miners</div>
          <div className="kpi-value">{data?.totalMiners || 0}</div>
          <div className="kpi-description">Fleet capacity</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Online Miners</div>
          <div className="kpi-value">{data?.onlineMiners || 0}</div>
          <div className="kpi-description">{onlinePercentage}% of fleet</div>
        </div>
      </div>

      {/* Charts Grid - Dashboard Style */}
      <div className="cockpit-charts-container">
        {/* Live Hashrate Chart */}
        <div className="cockpit-chart-card">
          <div className="cockpit-card-header">
            <h3 className="cockpit-card-title">Live Hashrate</h3>
          </div>
          <div className="cockpit-card-body">
            <div className="cockpit-chart-container">
              {hashrateChartData ? (
                <LineChart data={hashrateChartData} options={hashrateChartOptions} />
              ) : (
                <div className="cockpit-chart-placeholder">Loading chart data...</div>
              )}
            </div>
            {/* Hashrate Statistics */}
            <div className="chart-stats-container">
              <div className="chart-stat-item">
                <span className="chart-stat-label">CURRENT:</span>
                <span className="chart-stat-value chart-stat-value-green">
                  {hashrateStats.current.toFixed(2)} PH/s
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">7-DAY AVG:</span>
                <span className="chart-stat-value">
                  {hashrateStats.avg7Day.toFixed(2)} PH/s
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">PEAK:</span>
                <span className="chart-stat-value">
                  {hashrateStats.peak.toFixed(2)} PH/s
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">THEORETICAL:</span>
                <span className="chart-stat-value chart-stat-value-blue">
                  {hashrateStats.theoretical.toFixed(2)} PH/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Earnings Chart */}
        <div className="cockpit-chart-card">
          <div className="cockpit-card-header">
            <div className="chart-header-row">
              <h3 className="cockpit-card-title">Live Earnings</h3>
              <div className="chart-timeframe-selector">
                <button
                  className={`chart-timeframe-btn ${earningsTimeframe === 'week' ? 'active' : ''}`}
                  onClick={() => setEarningsTimeframe('week')}
                >
                  Week
                </button>
                <button
                  className={`chart-timeframe-btn ${earningsTimeframe === 'month' ? 'active' : ''}`}
                  onClick={() => setEarningsTimeframe('month')}
                >
                  Month
                </button>
                <button
                  className={`chart-timeframe-btn ${earningsTimeframe === 'year' ? 'active' : ''}`}
                  onClick={() => setEarningsTimeframe('year')}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
          <div className="cockpit-card-body">
            <div className="cockpit-chart-container">
              {earningsChartData ? (
                <LineChart data={earningsChartData} options={earningsChartOptions} />
              ) : (
                <div className="cockpit-chart-placeholder">Loading chart data...</div>
              )}
            </div>
            {/* Earnings Statistics */}
            <div className="chart-stats-container">
              <div className="chart-stat-item">
                <span className="chart-stat-label">LATEST:</span>
                <span className="chart-stat-value chart-stat-value-orange">
                  {earningsStats.latest.toFixed(6)} BTC
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">PEAK DAY:</span>
                <span className="chart-stat-value chart-stat-value-green">
                  {earningsStats.peakDay.toFixed(6)} BTC
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">
                  {earningsTimeframe === 'week' ? '7-DAY TOTAL:' : 
                   earningsTimeframe === 'month' ? '7-WEEK TOTAL:' : 
                   '7-MONTH TOTAL:'}
                </span>
                <span className="chart-stat-value">
                  {earningsStats.total7Day.toFixed(6)} BTC
                </span>
              </div>
              <div className="chart-stat-item">
                <span className="chart-stat-label">
                  {earningsTimeframe === 'week' ? '7-DAY USD VALUE:' : 
                   earningsTimeframe === 'month' ? '7-WEEK USD VALUE:' : 
                   '7-MONTH USD VALUE:'}
                </span>
                <span className="chart-stat-value">
                  ${earningsStats.usdValue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Accounts Summary Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Mining Accounts Summary</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('account')}
                  >
                    Account
                    {sortConfig.column === 'account' ? (
                      <span style={{ marginLeft: '8px', color: '#9EFF00' }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85em' }}>
                        ↕
                      </span>
                    )}
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('hashrate')}
                  >
                    Hashrate
                    {sortConfig.column === 'hashrate' ? (
                      <span style={{ marginLeft: '8px', color: '#9EFF00' }}>
                        {sortConfig.direction === 'desc' ? '↓' : '↑'}
                      </span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85em' }}>
                        ↕
                      </span>
                    )}
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('btc24h')}
                  >
                    BTC (24h)
                    {sortConfig.column === 'btc24h' ? (
                      <span style={{ marginLeft: '8px', color: '#9EFF00' }}>
                        {sortConfig.direction === 'desc' ? '↓' : '↑'}
                      </span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85em' }}>
                        ↕
                      </span>
                    )}
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('usd24h')}
                  >
                    USD (24h)
                    {sortConfig.column === 'usd24h' ? (
                      <span style={{ marginLeft: '8px', color: '#9EFF00' }}>
                        {sortConfig.direction === 'desc' ? '↓' : '↑'}
                      </span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85em' }}>
                        ↕
                      </span>
                    )}
                  </th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortConfig.column === 'status' ? (
                      <span style={{ marginLeft: '8px', color: '#9EFF00' }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    ) : (
                      <span style={{ marginLeft: '8px', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.85em' }}>
                        ↕
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMiningAccounts && sortedMiningAccounts.length > 0 ? (
                  sortedMiningAccounts.map((account: any) => (
                    <tr key={account.id}>
                      <td><strong>{account.name}</strong></td>
                      <td className="cockpit-value-green">{account.hashrate.toFixed(2)} TH/s</td>
                      <td className="cockpit-value-green">{account.btc24h.toFixed(6)} BTC</td>
                      <td className="cockpit-value-green">${(account.usd24h || 0).toFixed(2)}</td>
                      <td>
                        <span style={{ color: account.status?.toLowerCase() === 'active' ? '#C5FFA7' : '#ff4d4d' }}>
                          {account.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No mining accounts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
