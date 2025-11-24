'use client'

import { useState } from 'react'

export default function ProfitabilityIndexReports() {
  const [reportType, setReportType] = useState('summary')
  const [reportPeriod, setReportPeriod] = useState('30d')
  const [reportFormat, setReportFormat] = useState('pdf')

  const reports = [
    {
      id: '1',
      date: '2025-01-15 14:30:00',
      type: 'Profitability Summary',
      period: 'Last 30 days',
      format: 'PDF',
      status: 'completed',
    },
    {
      id: '2',
      date: '2025-01-10 09:15:00',
      type: 'Detailed Analysis',
      period: 'Last 90 days',
      format: 'Excel',
      status: 'completed',
    },
    {
      id: '3',
      date: '2025-01-05 16:45:00',
      type: 'Comparison Report',
      period: 'Q4 2024',
      format: 'PDF',
      status: 'completed',
    },
  ]

  return (
    <div>
      {/* Generate Report */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Generate Report</div>
        </div>
        <div className="profitability-card-body">
          <div className="profitability-grid-3">
            <div>
              <label className="profitability-label">Report Type</label>
              <select
                className="profitability-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Profitability Summary</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="comparison">Comparison Report</option>
                <option value="trends">Trend Analysis</option>
                <option value="custom">Custom Report</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Period</label>
              <select
                className="profitability-select"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="6m">Last 6 months</option>
                <option value="12m">Last 12 months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="profitability-label">Format</label>
              <select
                className="profitability-select"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          {reportPeriod === 'custom' && (
            <div className="profitability-grid-2" style={{ marginTop: 'var(--space-4)' }}>
              <div>
                <label className="profitability-label">Date From</label>
                <input type="date" className="profitability-input" />
              </div>
              <div>
                <label className="profitability-label">Date To</label>
                <input type="date" className="profitability-input" />
              </div>
            </div>
          )}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button className="profitability-btn">Generate Report</button>
            <button className="profitability-btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="profitability-card">
        <div className="profitability-card-header">
          <div className="profitability-card-title">Report History</div>
          <button className="profitability-btn-secondary">Clear History</button>
        </div>
        <div className="profitability-table-container">
          <table className="profitability-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Report Type</th>
                <th>Period</th>
                <th>Format</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.date}</td>
                  <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{report.type}</td>
                  <td>{report.period}</td>
                  <td>{report.format}</td>
                  <td>
                    {report.status === 'completed' && (
                      <span className="profitability-badge profitability-badge-success">Completed</span>
                    )}
                    {report.status === 'processing' && (
                      <span className="profitability-badge profitability-badge-warning">Processing</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="profitability-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Download</button>
                      <button className="profitability-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>Share</button>
                    </div>
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


