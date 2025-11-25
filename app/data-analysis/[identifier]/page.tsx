'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DataAnalysisResultPage() {
  const params = useParams()
  const router = useRouter()
  const identifier = params.identifier as string
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (identifier) {
      loadAnalysis()
    }
  }, [identifier])

  const loadAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/data-analysis/${encodeURIComponent(identifier)}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'analyse')
      }
      
      setData(result)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }}>
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            </div>
            <p>Analyse en cours...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content">
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <button
              onClick={() => router.push('/data-analysis')}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                marginBottom: 'var(--space-4)',
              }}
            >
              ← Retour
            </button>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              Erreur
            </h1>
          </div>
          <div style={{
            padding: 'var(--space-6)',
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#ff4d4d',
          }}>
            {error}
          </div>
        </div>
      </div>
    )
  }

  const debankData = data?.data?.data

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <button
            onClick={() => router.push('/data-analysis')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              marginBottom: 'var(--space-4)',
            }}
          >
            ← Retour
          </button>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            Résultats de l'analyse
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
            Identifiant: <code style={{ fontFamily: 'var(--font-mono)', color: '#C5FFA7' }}>{identifier}</code>
          </p>
        </div>

        {data?.data?.error ? (
          <div style={{
            padding: 'var(--space-6)',
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#ff4d4d',
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Erreur lors de la récupération des données
            </h3>
            <p>{data.data.error}</p>
          </div>
        ) : debankData ? (
          <>
            {/* Résumé */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
            }}>
              <div style={{
                padding: 'var(--space-6)',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                  Valeur Totale
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>
                  ${debankData.totalValue?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'}
                </div>
              </div>

              <div style={{
                padding: 'var(--space-6)',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                  Dette Totale
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: debankData.totalDebt > 0 ? '#FFA500' : '#C5FFA7', fontFamily: 'var(--font-mono)' }}>
                  ${debankData.totalDebt?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'}
                </div>
              </div>

              <div style={{
                padding: 'var(--space-6)',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                  Health Factor
                </div>
                <div style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: 700, 
                  color: debankData.healthFactor >= 2 ? '#C5FFA7' : debankData.healthFactor >= 1.5 ? '#FFA500' : '#FF4D4D',
                  fontFamily: 'var(--font-mono)' 
                }}>
                  {debankData.healthFactor?.toFixed(2) || 'N/A'}
                </div>
              </div>

              <div style={{
                padding: 'var(--space-6)',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                  Positions
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7', fontFamily: 'var(--font-mono)' }}>
                  {debankData.positions?.length || 0}
                </div>
              </div>
            </div>

            {/* Positions */}
            {debankData.positions && debankData.positions.length > 0 && (
              <div style={{
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginBottom: 'var(--space-6)',
              }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                  Positions DeBank
                </h2>
                <div className="table-container">
                  <table className="table table-unified-grid">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Protocole</th>
                        <th>Chain</th>
                        <th>Collatéral</th>
                        <th>Dette</th>
                        <th>Health Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debankData.positions.map((position: any, index: number) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 600 }}>{position.asset}</td>
                          <td>{position.protocol}</td>
                          <td>{position.chain}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: '#C5FFA7' }}>
                            ${((position.collateralAmount || 0) * (position.collateralPriceUsd || 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: '#FFA500' }}>
                            ${(position.debtAmount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span style={{
                              padding: 'var(--space-1) var(--space-3)',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(197, 255, 167, 0.1)',
                              color: '#C5FFA7',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 500,
                            }}>
                              {position.healthFactor?.toFixed(2) || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Informations client */}
            <div style={{
              background: 'rgba(26, 26, 26, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Informations
              </h2>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Nom:</span>
                  <span style={{ fontWeight: 600 }}>{debankData.name || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tag:</span>
                  <span>{debankData.tag || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Adresse:</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: '#C5FFA7' }}>
                    {data?.data?.address || identifier}
                  </code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dernière mise à jour:</span>
                  <span>{new Date(debankData.lastUpdate).toLocaleString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            padding: 'var(--space-6)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}>
            <p>Aucune donnée DeBank disponible pour cet identifiant.</p>
            {data?.database && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  Résultats de recherche dans la base de données:
                </p>
                <p>Customers trouvés: {data.database.customers?.length || 0}</p>
                <p>Projets trouvés: {data.database.projects?.length || 0}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

