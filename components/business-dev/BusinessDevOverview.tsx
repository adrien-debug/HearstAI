'use client'

import { useState, useEffect } from 'react'
import { LeadsIcon, MoneyIcon, ChartIcon, HandshakeIcon, RevenueIcon, ClockIcon, UserIcon, TargetIcon, CalendarIcon, DocumentIcon } from './BusinessDevIcons'

interface KpiData {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
}

export default function BusinessDevOverview() {
  const [kpis, setKpis] = useState<KpiData[]>([
    {
      label: 'Leads totaux',
      value: '247',
      change: 12.5,
      icon: <LeadsIcon size={20} color="#C5FFA7" />
    },
    {
      label: 'Pipeline valeur',
      value: '€2.4M',
      change: 8.3,
      icon: <MoneyIcon size={20} color="var(--primary-green)" />
    },
    {
      label: 'Taux de conversion',
      value: '23.4%',
      change: 2.1,
      icon: <ChartIcon size={20} color="var(--primary-green)" />
    },
    {
      label: 'Deals actifs',
      value: '18',
      change: -3.2,
      icon: <HandshakeIcon size={20} color="var(--primary-green)" />
    },
    {
      label: 'Revenus ce mois',
      value: '€485K',
      change: 15.7,
      icon: <RevenueIcon size={20} color="var(--primary-green)" />
    },
    {
      label: 'Temps moyen cycle',
      value: '42j',
      change: -8.5,
      icon: <ClockIcon size={20} color="var(--primary-green)" />
    }
  ])

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'contact',
      action: 'Nouveau contact ajouté',
      name: 'TechCorp Solutions',
      time: 'Il y a 2 heures',
      value: '€120K'
    },
    {
      id: 2,
      type: 'deal',
      action: 'Deal gagné',
      name: 'Mining Partners Inc',
      time: 'Il y a 5 heures',
      value: '€350K'
    },
    {
      id: 3,
      type: 'meeting',
      action: 'Meeting planifié',
      name: 'Green Energy Co',
      time: 'Il y a 1 jour',
      value: '€200K'
    },
    {
      id: 4,
      type: 'proposal',
      action: 'Proposition envoyée',
      name: 'Crypto Ventures',
      time: 'Il y a 2 jours',
      value: '€180K'
    }
  ])

  return (
    <div>
      {/* KPIs Grid */}
      <div className="business-dev-kpis">
        {kpis.map((kpi, index) => (
          <div key={index} className="business-dev-kpi-card">
            <div className="business-dev-kpi-label">
              <span>{kpi.icon}</span>
              <span>{kpi.label}</span>
            </div>
            <div className="business-dev-kpi-value">{kpi.value}</div>
            <div className={`business-dev-kpi-change ${kpi.change >= 0 ? 'positive' : 'negative'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {kpi.change >= 0 ? (
                  <path d="M18 15l-6-6-6 6" />
                ) : (
                  <path d="M6 9l6 6 6-6" />
                )}
              </svg>
              <span>{Math.abs(kpi.change)}%</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'rgba(14, 14, 14, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.04)',
        borderLeft: '3px solid var(--primary-green)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: `
          0 4px 24px rgba(0, 0, 0, 0.4),
          0 1px 4px rgba(0, 0, 0, 0.2),
          inset 0 0.5px 0 rgba(255, 255, 255, 0.06)
        `
      }}>
        <h2 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: 'var(--space-5)'
        }}>
          Activité récente
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4)',
                background: 'rgba(26, 26, 26, 0.4)',
                border: '0.5px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(42, 42, 42, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(138, 253, 129, 0.2)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.4)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(197, 255, 167, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activity.type === 'contact' && <UserIcon size={20} color="#C5FFA7" />}
                  {activity.type === 'deal' && <TargetIcon size={20} color="#C5FFA7" />}
                  {activity.type === 'meeting' && <CalendarIcon size={20} color="#C5FFA7" />}
                  {activity.type === 'proposal' && <DocumentIcon size={20} color="#C5FFA7" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {activity.action}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <span>{activity.name}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                color: '#C5FFA7',
                fontFamily: 'var(--font-mono)'
              }}>
                {activity.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

