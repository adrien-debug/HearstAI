'use client'

export default function TransactionsOverview() {
  const recentTransactions = [
    {
      id: 'tx_001',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qrs...9h0i',
      amount: '0.125 BTC',
      value: '$5,245.67',
      fee: '0.0001 BTC',
      status: 'completed',
      date: '2025-01-15 14:30:25',
    },
    {
      id: 'tx_002',
      type: 'Receive',
      from: 'bc1qrs...9h0i',
      to: 'bc1qxy...7f8g',
      amount: '0.250 BTC',
      value: '$10,491.34',
      fee: '0.0001 BTC',
      status: 'completed',
      date: '2025-01-15 12:15:10',
    },
    {
      id: 'tx_003',
      type: 'Send',
      from: 'bc1qxy...7f8g',
      to: 'bc1qab...2c3d',
      amount: '0.050 BTC',
      value: '$2,098.27',
      fee: '0.0001 BTC',
      status: 'pending',
      date: '2025-01-15 11:45:00',
    },
  ]

  return (
    <div>
      {/* Main KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">1,247</div>
          <div className="kpi-description">All time transactions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-3xl)', color: '#FFA500' }}>12</div>
          <div className="kpi-description">Awaiting confirmation</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Volume (30d)</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>245.89 BTC</div>
          <div className="kpi-description">Last 30 days</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Fees (30d)</div>
          <div className="kpi-value" style={{ fontSize: 'var(--text-2xl)' }}>0.1247 BTC</div>
          <div className="kpi-description">Last 30 days</div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="transactions-grid-2">
        <div className="transactions-card">
          <div className="transactions-card-header">
            <div className="transactions-card-title">Transaction Types</div>
          </div>
          <div className="transactions-card-body">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Send</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>624 (50%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '50%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Receive</span>
                <span style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)' }}>611 (49%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '49%', background: '#C5FFA7', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Other</span>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>12 (1%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '1%', background: 'var(--text-secondary)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="transactions-card">
          <div className="transactions-card-header">
            <div className="transactions-card-title">Transaction Volume (30d)</div>
          </div>
          <div className="transactions-card-body">
            <div className="transactions-chart-placeholder">
              Chart: Transaction volume over last 30 days<br />
              (Chart.js Line Chart would go here)
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-card">
        <div className="transactions-card-header">
          <div className="transactions-card-title">Recent Transactions</div>
          <button className="transactions-btn-secondary">View All</button>
        </div>
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Value</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.id}</td>
                  <td>
                    <span className={`transactions-badge ${tx.type === 'Send' ? 'transactions-badge-error' : 'transactions-badge-success'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.from}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.to}</td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-semibold)' }}>{tx.amount}</td>
                  <td style={{ color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>{tx.value}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{tx.fee}</td>
                  <td>
                    {tx.status === 'completed' && (
                      <span className="transactions-badge transactions-badge-success">Completed</span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="transactions-badge transactions-badge-warning">Pending</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{tx.date}</td>
                  <td>
                    <button className="transactions-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


