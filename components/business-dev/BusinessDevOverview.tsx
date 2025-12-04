'use client'

import { useState, useEffect } from 'react'
import { LeadsIcon, MoneyIcon, ChartIcon, HandshakeIcon, RevenueIcon, ClockIcon, UserIcon, TargetIcon, CalendarIcon, DocumentIcon } from './BusinessDevIcons'
import { metricsAPI } from '@/lib/api/business-dev'

interface KpiData {
  label: string
  value: string | number
  change: number
  icon: React.ReactNode
}

export default function BusinessDevOverview() {
  const [kpis, setKpis] = useState<KpiData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // Format number with currency
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`
    }
    return `€${value.toFixed(0)}`
  }

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return `Il y a ${diffMins}min`
      } else if (diffHours < 24) {
        return `Il y a ${diffHours}h`
      } else {
        return `Il y a ${diffDays}j`
      }
    } catch {
      return 'Récemment'
    }
  }

  // Load metrics and activities
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load metrics
        const metrics = await metricsAPI.getMetrics()
        
        // Load recent activities
        const activitiesData = await metricsAPI.getRecentActivities(10)
        
        // Format KPIs
        setKpis([
          {
            label: 'Leads totaux',
            value: metrics.totalContacts.value,
            change: metrics.totalContacts.change,
            icon: <LeadsIcon size={20} color="#C5FFA7" />
          },
          {
            label: 'Pipeline valeur',
            value: formatCurrency(metrics.pipelineValue.value),
            change: metrics.pipelineValue.change,
            icon: <MoneyIcon size={20} color="var(--primary-green)" />
          },
          {
            label: 'Taux de conversion',
            value: `${metrics.conversionRate.value.toFixed(1)}%`,
            change: metrics.conversionRate.change,
            icon: <ChartIcon size={20} color="var(--primary-green)" />
          },
          {
            label: 'Deals actifs',
            value: metrics.activeDeals.value,
            change: metrics.activeDeals.change,
            icon: <HandshakeIcon size={20} color="var(--primary-green)" />
          },
          {
            label: 'Revenus ce mois',
            value: formatCurrency(metrics.revenueThisMonth.value),
            change: metrics.revenueThisMonth.change,
            icon: <RevenueIcon size={20} color="var(--primary-green)" />
          },
          {
            label: 'Temps moyen cycle',
            value: `${metrics.avgCycleTime.value}j`,
            change: 0,
            icon: <ClockIcon size={20} color="var(--primary-green)" />
          }
        ])

        // Format activities
        const formattedActivities = activitiesData.activities.map((activity: any) => {
          let action = activity.title
          let type = activity.type
          let name = activity.contactName || activity.dealTitle || 'Unknown'
          let value = ''

          // Map activity types to display
          if (activity.type === 'call') {
            action = 'Appel effectué'
            type = 'call'
          } else if (activity.type === 'email') {
            action = 'Email envoyé'
            type = 'email'
          } else if (activity.type === 'meeting') {
            action = 'Meeting planifié'
            type = 'meeting'
          } else if (activity.type === 'proposal') {
            action = 'Proposition envoyée'
            type = 'proposal'
          } else if (activity.type === 'note') {
            action = 'Note ajoutée'
            type = 'note'
          }

          return {
            id: activity.id,
            type,
            action,
            name,
            time: formatTimeAgo(activity.activityDate || activity.createdAt),
            value
          }
        })

        setRecentActivity(formattedActivities)
      } catch (err: any) {
        console.error('Error loading overview data:', err)
        setError(err.message || 'Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{
        padding: 'var(--space-12)',
        textAlign: 'center',
        background: 'rgba(14, 14, 14, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{
          fontSize: 'var(--text-base)',
          color: 'var(--text-primary)',
        }}>
          Chargement des métriques...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: 'var(--space-4)',
        background: 'rgba(255, 77, 77, 0.1)',
        border: '1px solid rgba(255, 77, 77, 0.3)',
        borderRadius: 'var(--radius-md)',
        color: '#ff4d4d',
        fontSize: 'var(--text-sm)',
      }}>
        {error}
      </div>
    )
  }

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
          {recentActivity.length === 0 ? (
            <div style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-sm)'
            }}>
              Aucune activité récente
            </div>
          ) : (
            recentActivity.map((activity) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

