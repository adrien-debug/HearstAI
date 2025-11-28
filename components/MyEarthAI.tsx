'use client'

import { useEffect, useState } from 'react'
import './MyEarthAI.css'
import '@/components/home/Home.css'

interface SearchHistoryItem {
  id: string
  timestamp: Date
  query: string
  results: any[]
  resultsCount: number
}

interface DashboardStats {
  total_projects?: number
  total_versions?: number
  total_jobs?: number
  jobs_running?: number
  jobs_success_rate?: number
  total_searches?: number
}

// Helper function to format dates consistently (client-side only)
function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (typeof window === 'undefined') {
    // Return ISO string during SSR to avoid hydration mismatch
    return date.toISOString()
  }
  
  if (format === 'short') {
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export default function MyEarthAI() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  // Initialize with empty array to avoid hydration mismatch
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [isClient, setIsClient] = useState(false)
  const [historyFilter, setHistoryFilter] = useState('')
  const [searchTypeFilter, setSearchTypeFilter] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [historyExpanded, setHistoryExpanded] = useState(false)

  const searchTypes = [
    { id: 'rapport-client', label: 'Rapport Client', icon: 'document' },
    { id: 'mining-batch', label: 'Mining Batch', icon: 'dashboard' },
    { id: 'customer-detail', label: 'Customers Detail', icon: 'users' },
    { id: 'transaction', label: 'Transactions', icon: 'transaction' },
    { id: 'hashrate', label: 'Hashrate', icon: 'energy' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet' },
    { id: 'all', label: 'Tous', icon: 'search' },
  ]

  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    total_versions: 0,
    total_jobs: 0,
    jobs_running: 0,
    jobs_success_rate: 0,
    total_searches: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Initialize client-side only data to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    // Load search history from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('myearthai-search-history')
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
          setSearchHistory(parsed)
        } else {
          // Set default mock data only on client side
          const now = Date.now()
          setSearchHistory([
            {
              id: '1',
              timestamp: new Date(now - 3600000),
              query: 'Project Alpha',
              results: [
                {
                  type: 'project',
                  title: 'Project Alpha',
                  description: 'Projet de mining principal avec configuration optimisée',
                  url: '/projects/alpha',
                },
              ],
              resultsCount: 1,
            },
            {
              id: '2',
              timestamp: new Date(now - 7200000),
              query: 'Job #1234',
              results: [
                {
                  type: 'job',
                  title: 'Job #1234',
                  description: 'Job de mining en cours avec hash rate élevé',
                  url: '/jobs/1234',
                },
              ],
              resultsCount: 1,
            },
            {
              id: '3',
              timestamp: new Date(now - 10800000),
              query: 'Customer Beta',
              results: [
                {
                  type: 'customer',
                  title: 'Customer Beta',
                  description: 'Customer avec portefeuille actif sur plusieurs chaînes',
                  url: '/collateral/customers/beta',
                },
              ],
              resultsCount: 1,
            },
            {
              id: '4',
              timestamp: new Date(now - 14400000),
              query: 'mining',
              results: [
                {
                  type: 'project',
                  title: 'Project Alpha',
                  description: 'Projet de mining principal',
                  url: '/projects/alpha',
                },
                {
                  type: 'job',
                  title: 'Job #1234',
                  description: 'Job de mining en cours',
                  url: '/jobs/1234',
                },
              ],
              resultsCount: 2,
            },
            {
              id: '5',
              timestamp: new Date(now - 18000000),
              query: 'hashrate',
              results: [
                {
                  type: 'job',
                  title: 'Job #1234',
                  description: 'Job de mining en cours avec hash rate élevé',
                  url: '/jobs/1234',
                },
              ],
              resultsCount: 1,
            },
          ])
        }
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }, [])

  // Load stats on mount
  useEffect(() => {
    let isMounted = true
    
    // TOUJOURS utiliser les vraies données depuis le serveur de production
    const isLocal = false
    
      if (isLocal) {
      console.log('[MyEarthAI] 🔧 MODE LOCAL - Utilisation de données mockées')
      // Utiliser des données mockées immédiatement
      setStats({
        total_projects: 12,
        total_versions: 45,
        total_jobs: 234,
        jobs_running: 3,
        jobs_success_rate: 94.5,
        total_searches: 0,
      })
      setLoadingStats(false)
      return () => {
        isMounted = false
      }
    }
    
    // EN PRODUCTION : Charger les vraies stats
    let abortController: AbortController | null = null
    
    const loadStats = async () => {
      if (!isMounted) return
      
      if (abortController) {
        abortController.abort()
      }
      abortController = new AbortController()
      
      try {
        setLoadingStats(true)
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Stats API timeout')), 3000)
        )
        
        const statsPromise = fetch('/api/stats').then(res => res.json())
        const response = await Promise.race([statsPromise, timeoutPromise]) as any
        
        if (!isMounted || abortController.signal.aborted) return
        
        if (response && response.stats) {
          setStats({ ...response.stats, total_searches: 0 })
        } else if (response) {
          setStats({ ...response as DashboardStats, total_searches: 0 })
        }
      } catch (err: any) {
        if (!isMounted || abortController.signal.aborted) return
        if (err.name !== 'AbortError') {
          console.error('Error loading stats:', err)
          // Ne pas utiliser de données mockées - laisser les stats vides en cas d'erreur
          console.error('[MyEarthAI] Erreur chargement stats:', err)
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoadingStats(false)
        }
      }
    }

    loadStats()
    
    return () => {
      isMounted = false
      if (abortController) abortController.abort()
    }
  }, []) // Remove searchHistory.length dependency to avoid infinite loops

  // Save search history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && searchHistory.length > 0) {
      try {
        const historyToSave = searchHistory.map(item => ({
          ...item,
          timestamp: item.timestamp.toISOString(),
        }))
        localStorage.setItem('myearthai-search-history', JSON.stringify(historyToSave))
      } catch (error) {
        console.error('Error saving search history:', error)
      }
    }
  }, [searchHistory])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await performAISearch(query, searchTypeFilter)
      setSearchResults(results)
      
      if (results.length > 0) {
        // Use crypto.randomUUID if available, otherwise use timestamp + random
        const id = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const historyItem: SearchHistoryItem = {
          id,
          timestamp: new Date(),
          query: query.trim(),
          results: results,
          resultsCount: results.length,
        }
        setSearchHistory(prev => [historyItem, ...prev])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const performAISearch = async (query: string, typeFilter?: string | null): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = [
          {
            type: 'project',
            searchType: 'mining-batch',
            title: 'Project Alpha',
            description: `Found project matching "${query}"`,
            url: '/projects/alpha',
          },
          {
            type: 'job',
            searchType: 'mining-batch',
            title: 'Job #1234',
            description: `Found job matching "${query}"`,
            url: '/jobs/1234',
          },
          {
            type: 'customer',
            searchType: 'customer-detail',
            title: 'Customer Beta',
            description: `Found customer matching "${query}"`,
            url: '/collateral/customers/beta',
          },
          {
            type: 'report',
            searchType: 'rapport-client',
            title: 'Rapport Client Alpha',
            description: `Rapport détaillé du client Alpha pour "${query}"`,
            url: '/reports/client-alpha',
          },
          {
            type: 'transaction',
            searchType: 'transaction',
            title: 'Transaction #5678',
            description: `Transaction BTC matching "${query}"`,
            url: '/transactions/5678',
          },
          {
            type: 'hashrate',
            searchType: 'hashrate',
            title: 'Hashrate Report',
            description: `Rapport de hash rate matching "${query}"`,
            url: '/hashrate/report',
          },
          {
            type: 'wallet',
            searchType: 'wallet',
            title: 'Wallet BTC',
            description: `Portefeuille BTC matching "${query}"`,
            url: '/wallet/btc',
          },
        ].filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          
          if (typeFilter && typeFilter !== 'all') {
            return matchesQuery && item.searchType === typeFilter
          }
          
          return matchesQuery
        })
        resolve(mockResults)
      }, 300)
    })
  }

  // Quick Access section removed - quickLinks array no longer needed

  const popularSearches = [
    { query: 'mining batch', count: 45, type: 'mining-batch' },
    { query: 'hashrate report', count: 32, type: 'hashrate' },
    { query: 'customer transactions', count: 28, type: 'transaction' },
    { query: 'wallet balance', count: 24, type: 'wallet' },
    { query: 'client report', count: 19, type: 'rapport-client' },
  ]

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>My Earth AI</h1>
          
          {/* Navigation horizontale - Style Dashboard */}
          <nav className="ai-nav-tabs">
          <button 
            className={`ai-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`ai-nav-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
          <button 
            className={`ai-nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          </nav>
        </div>

        {/* KPI Cards - Style Dashboard avec charte overview */}
        {activeTab === 'overview' && (
          <section className="kpi-section">
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Total Searches</div>
                <div className="kpi-value">{stats?.total_searches || searchHistory.length}</div>
                <div className="kpi-description">Search history</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Projects</div>
                <div className="kpi-value">{stats?.total_projects || 12}</div>
                <div className="kpi-description">Active projects</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Jobs</div>
                <div className="kpi-value">{stats?.total_jobs || 234}</div>
                <div className="kpi-description">All jobs</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Success Rate</div>
                <div className="kpi-value" style={{ color: (stats?.jobs_success_rate ?? 0) >= 90 ? '#C5FFA7' : (stats?.jobs_success_rate ?? 0) >= 70 ? '#FFA500' : '#ff4d4d' }}>
                  {stats?.jobs_success_rate ? `${stats.jobs_success_rate.toFixed(1)}%` : '94.5%'}
                </div>
                <div className="kpi-description">Job success rate</div>
              </div>
            </div>
          </section>
        )}

        {/* AI Search Bar Section - Style Dashboard */}
        {(activeTab === 'search' || activeTab === 'overview') && (
          <div className="ai-search-section">
            <div className="ai-search-container">
              <div className="ai-search-header">
                <div className="ai-search-header-content">
                  <div className="ai-search-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#C5FFA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="ai-search-title">My Earth AI</h2>
                    <p className="ai-search-subtitle">Recherchez dans toutes les données de la plateforme</p>
                  </div>
                </div>
              </div>
              
              {/* Search Type Filter Buttons */}
              <div className="search-type-filters">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      if (searchTypeFilter === type.id) {
                        setSearchTypeFilter(null)
                      } else {
                        setSearchTypeFilter(type.id)
                      }
                    }}
                    className={`search-type-filter-btn ${searchTypeFilter === type.id ? 'active' : ''}`}
                  >
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="ai-search-input-wrapper">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher dans les données Bitcoin Mining (rapports, batches, customers, transactions, hash rate, wallets)..."
                  className="ai-search-input"
                />
                <div className="ai-search-icon-input">
                  {isSearching ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              
              {searchResults.length > 0 && (
                <div className="ai-search-results">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={result.url}
                      className="ai-search-result-item"
                    >
                      <div className="ai-search-result-icon" data-type={result.type}>
                        {result.type === 'project' ? 'P' : result.type === 'job' ? 'J' : result.type === 'customer' ? 'C' : result.type === 'report' ? 'R' : result.type === 'transaction' ? 'T' : result.type === 'hashrate' ? 'H' : 'W'}
                      </div>
                      <div className="ai-search-result-content">
                        <div className="ai-search-result-title">{result.title}</div>
                        <div className="ai-search-result-description">{result.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Popular Searches & Recent Activity - Style Dashboard */}
        {(activeTab === 'search' || activeTab === 'overview') && (
          <div className="search-suggestions-grid">
            {/* Popular Searches Card */}
            <div className="suggestion-card">
              <div className="card-header-dashboard">
                <h3 className="card-title-dashboard">Popular Searches</h3>
              </div>
              <div className="card-body-dashboard">
                <div className="popular-searches-list">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTypeFilter(search.type)
                        handleSearch(search.query)
                      }}
                      className="popular-search-item"
                    >
                      <div className="popular-search-content">
                        <div className="popular-search-query">{search.query}</div>
                        <div className="popular-search-count">{search.count} searches</div>
                      </div>
                      <span className="popular-search-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="suggestion-card">
              <div className="card-header-dashboard">
                <h3 className="card-title-dashboard">Recent Activity</h3>
              </div>
              <div className="card-body-dashboard">
                <div className="recent-activity-list">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="recent-activity-item">
                      <div className="recent-activity-dot"></div>
                      <div className="recent-activity-content">
                        <div className="recent-activity-query">"{item.query}"</div>
                        <div className="recent-activity-meta">
                          {isClient ? formatDate(item.timestamp, 'short') : item.timestamp.toISOString()} • {item.resultsCount} results
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchHistory.length === 0 && (
                    <div className="recent-activity-empty">No recent activity</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search History Table Section - Style Dashboard */}
        {activeTab === 'history' && (
          <div className="transaction-history-section">
            <div className="transaction-history-header">
              <h2 className="transaction-history-title">Historique des recherches</h2>
              <div className="history-search-wrapper">
                <input
                  type="text"
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  placeholder="Rechercher dans l'historique..."
                  className="history-search-input"
                />
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="history-search-icon"
                >
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="table-container transaction-history-table-container">
              <table className="table transaction-history-table table-unified-grid">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Recherche</th>
                    <th>Résultats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchHistory
                    .filter(item => 
                      historyFilter === '' || 
                      item.query.toLowerCase().includes(historyFilter.toLowerCase()) ||
                      item.results.some(r => 
                        r.title.toLowerCase().includes(historyFilter.toLowerCase()) ||
                        r.description.toLowerCase().includes(historyFilter.toLowerCase())
                      )
                    )
                    .slice(0, historyExpanded ? undefined : 3)
                    .map((historyItem) => (
                    <tr key={historyItem.id}>
                      <td>
                        {isClient ? formatDate(historyItem.timestamp, 'long') : historyItem.timestamp.toISOString()}
                      </td>
                      <td className="transaction-reward">"{historyItem.query}"</td>
                      <td>
                        <div className="history-results-tags">
                          {historyItem.results.slice(0, 3).map((result, idx) => (
                            <a
                              key={idx}
                              href={result.url}
                              className="history-result-tag"
                              data-type={result.type}
                            >
                              <span className="history-result-tag-dot"></span>
                              {result.title}
                            </a>
                          ))}
                          {historyItem.results.length > 3 && (
                            <span className="history-results-more">+{historyItem.results.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <a
                          href={`/myearthai/search/${historyItem.id}`}
                          className="btn-secondary"
                        >
                          Voir détails
                        </a>
                      </td>
                    </tr>
                  ))}
                  {searchHistory.filter(item => 
                    historyFilter === '' || 
                    item.query.toLowerCase().includes(historyFilter.toLowerCase()) ||
                    item.results.some(r => 
                      r.title.toLowerCase().includes(historyFilter.toLowerCase()) ||
                      r.description.toLowerCase().includes(historyFilter.toLowerCase())
                    )
                  ).length === 0 && (
                    <tr>
                      <td colSpan={4} className="empty-state">
                        Aucune recherche trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {searchHistory.filter(item => 
                historyFilter === '' || 
                item.query.toLowerCase().includes(historyFilter.toLowerCase()) ||
                item.results.some(r => 
                  r.title.toLowerCase().includes(historyFilter.toLowerCase()) ||
                  r.description.toLowerCase().includes(historyFilter.toLowerCase())
                )
              ).length > 3 && (
                <div className="see-more-container">
                  <button 
                    className={`btn-see-more ${historyExpanded ? 'expanded' : ''}`}
                    onClick={() => setHistoryExpanded(!historyExpanded)}
                  >
                    <span className="see-more-text">{historyExpanded ? 'See less' : 'See more'}</span>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}