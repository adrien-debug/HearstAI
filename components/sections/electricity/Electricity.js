import { useState, useMemo, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ElectricitySection() {
  const chartContainerRef = useRef(null);
  const [startDate, setStartDate] = useState('2025-10-01');
  const [endDate, setEndDate] = useState('2025-10-31');
  const [activeTab, setActiveTab] = useState('Olivier');

  const providers = ['Olivier', 'Enegix', 'Cryptominers', 'Bitkern'];

  const contracts = [
    { contract: 'AKT02A', company: 'Hearst', workers: 55, power: 3068, cost: 0.063, uptime: 18.65, total: 1474.70 },
    { contract: 'AKT06A', company: 'Hearst', workers: 111, power: 3350, cost: 0.063, uptime: 4.15, total: 722.95 }
  ];

  const totalWorkers = contracts.reduce((sum, c) => sum + c.workers, 0);
  const totalCost = contracts.reduce((sum, c) => sum + c.total, 0);

  // Get CSS variables for chart styling
  const chartColors = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        primaryGreen: '#C5FFA7',
        primaryGrey: '#1a1a1a',
        textPrimary: '#ffffff',
        textSecondary: '#cccccc',
        grey100: '#2a2a2a',
        radiusMd: '8'
      };
    }
    
    const rootStyles = getComputedStyle(document.documentElement);
    return {
      primaryGreen: rootStyles.getPropertyValue('--primary-green').trim() || '#C5FFA7',
      primaryGrey: rootStyles.getPropertyValue('--primary-grey').trim() || '#1a1a1a',
      textPrimary: rootStyles.getPropertyValue('--text-primary').trim() || '#ffffff',
      textSecondary: rootStyles.getPropertyValue('--text-secondary').trim() || '#cccccc',
      grey100: rootStyles.getPropertyValue('--grey-100').trim() || '#2a2a2a',
      radiusMd: rootStyles.getPropertyValue('--radius-md').trim() || '8'
    };
  }, []);

  // Chart data
  const chartData = useMemo(() => ({
    labels: ['AKT02A', 'AKT06A', 'LR02', 'LR06'],
    datasets: [{
      label: 'Total Cost ($)',
      data: [1474.70, 722.95, 0, 0],
      backgroundColor: chartColors.primaryGreen,
      borderColor: chartColors.primaryGreen,
      borderWidth: 0,
      borderRadius: parseInt(chartColors.radiusMd) || 8,
      hoverBackgroundColor: '#75fc6c',
    }]
  }), [chartColors]);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: chartColors.primaryGrey,
        titleColor: chartColors.textPrimary,
        bodyColor: chartColors.textSecondary,
        borderColor: chartColors.grey100,
        borderWidth: 1,
        padding: 12,
        cornerRadius: parseInt(chartColors.radiusMd) || 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: chartColors.textSecondary,
          callback: value => '$' + value.toLocaleString()
        },
        grid: {
          color: chartColors.grey100,
          drawBorder: false
        },
        border: { display: false }
      },
      x: {
        ticks: { color: chartColors.textSecondary },
        grid: { display: false },
        border: { display: false }
      }
    }
  }), [chartColors]);

  // Debug: Check container dimensions after render
  useEffect(() => {
    if (chartContainerRef.current) {
      const checkDimensions = () => {
        const rect = chartContainerRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(chartContainerRef.current);
        console.log('[Chart Debug] Container dimensions:', {
          width: rect.width,
          height: rect.height,
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          transform: computedStyle.transform,
          isolation: computedStyle.isolation
        });
        
        // Check if canvas exists inside
        const canvas = chartContainerRef.current.querySelector('canvas');
        if (canvas) {
          const canvasRect = canvas.getBoundingClientRect();
          console.log('[Chart Debug] Canvas dimensions:', {
            width: canvasRect.width,
            height: canvasRect.height,
            display: window.getComputedStyle(canvas).display,
            visibility: window.getComputedStyle(canvas).visibility
          });
        } else {
          console.warn('[Chart Debug] No canvas found in container');
        }
      };
      
      // Check immediately and after a short delay
      checkDimensions();
      const timeoutId = setTimeout(checkDimensions, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Provider Summary</h2>
      </div>
      
      <div className="card">
        {/* Filters */}
        <div className="filters" style={{ 
          display: 'flex', 
          gap: 'var(--space-3)', 
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap'
        }}>
          <div className="filter-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Start Date
            </label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="filter-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              End Date
            </label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--primary-grey)',
                border: '1px solid var(--grey-100)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <button className="btn-primary" style={{ alignSelf: 'flex-end' }}>Generate Summary</button>
          <button className="btn-secondary" style={{ alignSelf: 'flex-end' }}>Last Full Month</button>
        </div>
        
        {/* Tabs */}
        <div className="tabs" style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--grey-100)'
        }}>
          {providers.map(provider => (
            <button
              key={provider}
              className={`tab ${activeTab === provider ? 'active' : ''}`}
              onClick={() => setActiveTab(provider)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: activeTab === provider ? 'rgba(197, 255, 167, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === provider ? '2px solid #C5FFA7' : '2px solid transparent',
                color: activeTab === provider ? '#C5FFA7' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)'
              }}
            >
              {provider}
            </button>
          ))}
        </div>
        
        {/* Table */}
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141414', borderBottom: '1px solid var(--grey-100)' }}>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Contract</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Hosting Company</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Workers</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Power (W)</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Cost ($/kWh)</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Uptime (%)</th>
                <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary-green)', textTransform: 'uppercase' }}>Total Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--grey-100)' }}>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.contract}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.company}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.workers}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.power.toLocaleString()}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>${contract.cost.toFixed(5)}</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>{contract.uptime.toFixed(2)}%</td>
                  <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>${contract.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(197, 255, 167, 0.1)' }}>
                <td style={{ padding: 'var(--space-3)', fontWeight: 600, color: 'var(--text-primary)' }}><strong>Total</strong></td>
                <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>-</td>
                <td style={{ padding: 'var(--space-3)', fontWeight: 600, color: 'var(--text-primary)' }}><strong>{totalWorkers}</strong></td>
                <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>-</td>
                <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>-</td>
                <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>-</td>
                <td style={{ padding: 'var(--space-3)', fontWeight: 600, color: 'var(--text-primary)' }}><strong>${totalCost.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Chart */}
      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Total Electricity Cost by Contract</h3>
        <div 
          ref={chartContainerRef}
          style={{ 
            position: 'relative', 
            height: '400px', 
            width: '100%',
            minHeight: '400px',
            minWidth: '100%'
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

