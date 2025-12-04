'use client'

import { useState } from 'react'
import { cockpitAPI } from '@/lib/api'
import './Cockpit.css'

interface Report {
  name: string
  type: string
  generated: string
  id: string
}

export default function CockpitReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerateReport = async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      setGenerating(type)
      
      // Fetch data for the report
      const data = await cockpitAPI.getData()
      
      // Create report object
      const now = new Date()
      const reportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${now.toLocaleDateString()}`
      
      const newReport: Report = {
        name: reportName,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        generated: now.toISOString(),
        id: `report-${type}-${now.getTime()}`,
      }

      // Add to reports list
      setReports(prev => [newReport, ...prev].slice(0, 10)) // Keep last 10 reports

      // In a real implementation, this would:
      // 1. Generate PDF/Excel report
      // 2. Save to storage
      // 3. Send via email if configured
      // 4. Store report metadata in database
      
      console.log(`Generated ${type} report:`, {
        report: newReport,
        data: data,
      })

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`)
    } catch (err) {
      console.error(`Failed to generate ${type} report:`, err)
      alert(`Failed to generate ${type} report. Please try again.`)
    } finally {
      setGenerating(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      {/* Report Cards - Dashboard Style */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="cockpit-card">
          <div className="cockpit-card-header">
            <h3 className="cockpit-card-title">Daily Report</h3>
          </div>
          <div className="cockpit-card-body">
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Generate daily production and performance reports
            </p>
            <button 
              className="cockpit-btn" 
              style={{ width: '100%' }}
              onClick={() => handleGenerateReport('daily')}
              disabled={generating === 'daily'}
            >
              {generating === 'daily' ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        <div className="cockpit-card">
          <div className="cockpit-card-header">
            <h3 className="cockpit-card-title">Weekly Report</h3>
          </div>
          <div className="cockpit-card-body">
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Weekly summary and analytics
            </p>
            <button 
              className="cockpit-btn" 
              style={{ width: '100%' }}
              onClick={() => handleGenerateReport('weekly')}
              disabled={generating === 'weekly'}
            >
              {generating === 'weekly' ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        <div className="cockpit-card">
          <div className="cockpit-card-header">
            <h3 className="cockpit-card-title">Monthly Report</h3>
          </div>
          <div className="cockpit-card-body">
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Comprehensive monthly analysis
            </p>
            <button 
              className="cockpit-btn" 
              style={{ width: '100%' }}
              onClick={() => handleGenerateReport('monthly')}
              disabled={generating === 'monthly'}
            >
              {generating === 'monthly' ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports Table - Dashboard Style */}
      <div className="cockpit-card">
        <div className="cockpit-card-header">
          <h3 className="cockpit-card-title">Recent Reports</h3>
        </div>
        <div className="cockpit-card-body">
          <div className="cockpit-table-container">
            <table className="cockpit-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Type</th>
                  <th>Generated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id}>
                      <td style={{ fontWeight: 'var(--font-semibold)' }}>{report.name}</td>
                      <td>
                        <span className="cockpit-badge cockpit-badge-success">{report.type}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(report.generated)}</td>
                      <td>
                        <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)', marginRight: 'var(--space-2)' }}>Download</button>
                        <button className="cockpit-btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>View</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--space-8)' }}>
                      No reports generated yet. Generate a report to get started.
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
