'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DataAnalysisPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Rediriger vers la page de résultats
      router.push(`/data-analysis/${encodeURIComponent(identifier.trim())}`)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'analyse')
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 700, 
            color: '#ffffff',
            position: 'relative',
            zIndex: 10,
            marginBottom: 'var(--space-2)'
          }}>
            Analyse de Données DeBank
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-base)',
            marginBottom: 'var(--space-6)'
          }}>
            Analysez un identifiant (adresse ERC20, nom de client, etc.) et récupérez les données DeBank en temps réel
          </p>
        </div>

        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}>
          <form onSubmit={handleAnalyze}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Identifiant à analyser
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Ex: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb ou EanqSBKHd"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 'var(--space-4) var(--space-5)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all var(--duration-fast) var(--ease-in-out)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C5FFA7'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 255, 167, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <p style={{ 
                marginTop: 'var(--space-2)', 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-muted)',
                lineHeight: '1.5'
              }}>
                Entrez une adresse ERC20 (0x...), un nom de client, ou un identifiant personnalisé
              </p>
            </div>

            {error && (
              <div style={{
                padding: 'var(--space-4)',
                background: 'rgba(255, 77, 77, 0.1)',
                border: '1px solid rgba(255, 77, 77, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#ff4d4d',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              style={{
                width: '100%',
                padding: 'var(--space-4) var(--space-6)',
                background: loading || !identifier.trim() ? 'var(--primary-grey)' : '#C5FFA7',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                cursor: loading || !identifier.trim() ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
              onMouseEnter={(e) => {
                if (!loading && identifier.trim()) {
                  e.currentTarget.style.background = '#B0FF8F'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && identifier.trim()) {
                  e.currentTarget.style.background = '#C5FFA7'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                }
              }}
            >
              {loading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Analyser
                </>
              )}
            </button>
          </form>
        </div>

        <div style={{ marginTop: 'var(--space-8)' }}>
          <h2 style={{ 
            fontSize: 'var(--text-xl)', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)'
          }}>
            Types d'identifiants supportés
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{
              padding: 'var(--space-4)',
              background: 'rgba(197, 255, 167, 0.05)',
              border: '1px solid rgba(197, 255, 167, 0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)', color: '#C5FFA7' }}>
                Adresse ERC20
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Format: 0x suivi de 40 caractères hexadécimaux
              </p>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
              </code>
            </div>

            <div style={{
              padding: 'var(--space-4)',
              background: 'rgba(197, 255, 167, 0.05)',
              border: '1px solid rgba(197, 255, 167, 0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)', color: '#C5FFA7' }}>
                Nom de client
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Recherche dans la base de données par nom
              </p>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                EanqSBKHd
              </code>
            </div>

            <div style={{
              padding: 'var(--space-4)',
              background: 'rgba(197, 255, 167, 0.05)',
              border: '1px solid rgba(197, 255, 167, 0.2)',
              borderRadius: 'var(--radius-md)',
            }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)', color: '#C5FFA7' }}>
                Identifiant personnalisé
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Tout autre identifiant pour recherche
              </p>
              <code style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Custom ID
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


