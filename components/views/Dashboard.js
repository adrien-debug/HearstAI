import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';

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
);

export default function Dashboard() {
  const [walletData, setWalletData] = useState({
    btc: '0.031819',
    usd: '$3,628.13'
  });
  
  const [transactions, setTransactions] = useState([
    { date: '2025-01-18', btc: '0.006234', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: 'a1b2c3d4e5f6...' },
    { date: '2025-01-17', btc: '0.005891', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: 'f6e5d4c3b2a1...' },
    { date: '2025-01-16', btc: '0.005432', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: '9z8y7x6w5v4u...' },
    { date: '2025-01-15', btc: '0.004876', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: '3t4u5v6w7x8y...' },
    { date: '2025-01-14', btc: '0.004521', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: '7m8n9o0p1q2r...' },
    { date: '2025-01-13', btc: '0.004198', address: '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck', txId: '5k6l7m8n9o0p...' },
  ]);
  
  const [historyTransactions, setHistoryTransactions] = useState([
    { date: '2025-01-18', account: 'AKT04', reward: '0.084521', hashrate: '2041.42 TH/s' },
    { date: '2025-01-17', account: 'AKT04', reward: '0.083247', hashrate: '2041.42 TH/s' },
    { date: '2025-01-16', account: 'AKT04', reward: '0.082156', hashrate: '2041.42 TH/s' },
    { date: '2025-01-15', account: 'AKT04', reward: '0.081892', hashrate: '2041.42 TH/s' },
    { date: '2025-01-14', account: 'AKT04', reward: '0.080654', hashrate: '2041.42 TH/s' },
    { date: '2025-01-13', account: 'AKT04', reward: '0.079432', hashrate: '2041.42 TH/s' },
  ]);
  
  const [showMoreWallet, setShowMoreWallet] = useState(false);
  const [showMoreHistory, setShowMoreHistory] = useState(false);
  const [dateRange, setDateRange] = useState('January 1, 2025 - January 31, 2025');
  const [contract, setContract] = useState('Contracts AL01');
  
  // Chart data
  const performanceChartData = {
    labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 18'],
    datasets: [
      {
        label: 'BTC Wallet',
        data: [0.025, 0.027, 0.029, 0.030, 0.032],
        borderColor: '#C5FFA7',
        backgroundColor: 'rgba(197, 255, 167, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Transactions',
        data: [0.020, 0.022, 0.024, 0.026, 0.028],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
  
  const barChartData = {
    labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 18'],
    datasets: [
      {
        label: 'BTC Wallet',
        data: [0.025, 0.027, 0.029, 0.030, 0.032],
        backgroundColor: '#C5FFA7',
      },
      {
        label: 'Transactions',
        data: [0.020, 0.022, 0.024, 0.026, 0.028],
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };
  
  const handleExportExcel = () => {
    // Export transaction history to CSV (Excel-compatible)
    const headers = ['Date', 'Account', 'Total Reward (BTC)', 'Hashrate'];
    const rows = historyTransactions.map(tx => [
      tx.date,
      tx.account,
      tx.reward,
      tx.hashrate
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create BOM for UTF-8 (Excel compatibility)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transaction_history_${dateRange.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const visibleWalletTransactions = showMoreWallet ? transactions : transactions.slice(0, 3);
  const visibleHistoryTransactions = showMoreHistory ? historyTransactions : historyTransactions.slice(0, 3);
  
  const totalReward = historyTransactions.reduce((sum, tx) => sum + parseFloat(tx.reward), 0).toFixed(6);
  
  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Wallet Section */}
        <div className="wallet-section">
          {/* BTC Wallet Card */}
          <div className="wallet-card">
            <div className="wallet-card-header">
              <h3 className="wallet-card-title">BTC Wallet</h3>
            </div>
            <div className="wallet-card-body">
              <div className="wallet-balance">
                <div className="wallet-balance-btc">{walletData.btc} BTC</div>
                <div className="wallet-balance-usd">{walletData.usd} USD</div>
              </div>
            </div>
          </div>

          {/* Performance Charts Container */}
          <div className="wallet-charts-container">
            {/* Performance Overview Chart */}
            <div className="wallet-chart-section">
              <div className="chart-header">
                <h2 className="chart-title">Performance Overview</h2>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span>BTC Wallet</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot gray"></span>
                    <span>Transactions</span>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <Line data={performanceChartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="wallet-chart-section">
              <div className="chart-header">
                <h2 className="chart-title">Performance Bar Chart</h2>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot green"></span>
                    <span>BTC Wallet</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot gray"></span>
                    <span>Transactions</span>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Wallet Incoming Transactions */}
          <div className="transactions-section">
            <div className="section-header-home">
              <h3 className="section-title-home">Wallet incoming transactions</h3>
            </div>
            <div className="table-container">
              <table className="table table-unified-grid">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>BTC Transaction</th>
                    <th>Wallet adresse</th>
                    <th>Trx Id</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleWalletTransactions.map((tx, index) => (
                    <tr key={index}>
                      <td>{tx.date}</td>
                      <td className="transaction-amount">{tx.btc} BTC</td>
                      <td>{tx.address}</td>
                      <td>{tx.txId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length > 3 && (
                <div className="see-more-container">
                  <button 
                    className="btn-see-more"
                    onClick={() => setShowMoreWallet(!showMoreWallet)}
                  >
                    <span className="see-more-text">{showMoreWallet ? 'Show less' : 'See more'}</span>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="transaction-history-section">
          <div className="transaction-history-header">
            <h2 className="transaction-history-title">Transaction history</h2>
            <div className="transaction-history-controls">
              <select 
                className="date-range-select" 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="January 1, 2025 - January 31, 2025">January 1, 2025 - January 31, 2025</option>
                <option value="December 1, 2024 - December 31, 2024">December 1, 2024 - December 31, 2024</option>
                <option value="November 1, 2024 - November 30, 2024">November 1, 2024 - November 30, 2024</option>
              </select>
              <select 
                className="contract-select" 
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              >
                <option value="Contracts AL01">Contracts AL01</option>
                <option value="Contracts AL02">Contracts AL02</option>
                <option value="Contracts AL03">Contracts AL03</option>
              </select>
              <button 
                className="btn btn-primary btn-export-excel" 
                onClick={handleExportExcel}
              >
                Export to excel
              </button>
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="table-container transaction-history-table-container">
            <table className="table transaction-history-table table-unified-grid">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Total Reward</th>
                  <th>Hashrate</th>
                </tr>
              </thead>
              <tbody>
                {visibleHistoryTransactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.date}</td>
                    <td>{tx.account}</td>
                    <td className="transaction-reward">{tx.reward} BTC</td>
                    <td>{tx.hashrate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {historyTransactions.length > 3 && (
              <div className="see-more-container">
                <button 
                  className="btn-see-more"
                  onClick={() => setShowMoreHistory(!showMoreHistory)}
                >
                  <span className="see-more-text">{showMoreHistory ? 'Show less' : 'See more'}</span>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Total Row */}
          <div className="transaction-history-total">
            <strong>Total: <span className="total-amount">{totalReward} BTC</span></strong>
          </div>
        </div>
      </div>
    </div>
  );
}
