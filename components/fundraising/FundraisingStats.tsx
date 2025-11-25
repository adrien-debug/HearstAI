'use client'

import { Investor } from '@/types/fundraising'

interface FundraisingStatsProps {
  investors: Investor[]
}

export default function FundraisingStats({ investors }: FundraisingStatsProps) {
  const stats = {
    total: investors.length,
    leads: investors.filter(i => i.status === 'lead').length,
    contacted: investors.filter(i => i.status === 'contacted').length,
    meetings: investors.filter(i => i.status === 'meeting').length,
    proposals: investors.filter(i => i.status === 'proposal').length,
    negotiation: investors.filter(i => i.status === 'negotiation').length,
    closed: investors.filter(i => i.status === 'closed').length,
    totalInterest: investors.reduce((sum, inv) => sum + (inv.investmentInterest || 0), 0),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="fundraising-stats-grid">
      <div className="fundraising-stat-card">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Total Contacts</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
        </div>
        <div className="fundraising-stat-value">{stats.total}</div>
      </div>

      <div className="fundraising-stat-card">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Leads</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="fundraising-stat-value">{stats.leads}</div>
      </div>

      <div className="fundraising-stat-card">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Contactés</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <path d="M2 4l8 5 8-5M2 4h16v12H2V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className="fundraising-stat-value">{stats.contacted}</div>
      </div>

      <div className="fundraising-stat-card">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Meetings</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <rect x="4" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className="fundraising-stat-value">{stats.meetings}</div>
      </div>

      <div className="fundraising-stat-card">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Propositions</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <path d="M4 4h12v12H4V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M6 8h8M6 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="fundraising-stat-value">{stats.proposals}</div>
      </div>

      <div className="fundraising-stat-card highlight">
        <div className="fundraising-stat-header">
          <span className="fundraising-stat-label">Intérêt Total</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
            <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className="fundraising-stat-value highlight">{formatCurrency(stats.totalInterest)}</div>
      </div>
    </div>
  )
}

