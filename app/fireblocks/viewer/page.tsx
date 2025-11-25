'use client'

import { useState, useEffect } from 'react'
import { fireblocksAPI } from '@/lib/api'

export default function FireblocksViewerPage() {
  const [vaultId, setVaultId] = useState('8220b577-89f6-4968-a786-f1f158ccd0f6')
  const [txId, setTxId] = useState('8220b577-89f6-4968-a786-f1f158ccd0f6')
  const [vaultData, setVaultData] = useState<any>(null)
  const [txData, setTxData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'vault' | 'transaction'>('vault')

  const loadVault = async () => {
    if (!vaultId) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await fireblocksAPI.getVaults(vaultId)
      setVaultData(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du vault')
      setVaultData(null)
    } finally {
      setLoading(false)
    }
  }

  const loadTransaction = async () => {
    if (!txId) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await fireblocksAPI.getTransaction(txId)
      setTxData(response.data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la transaction')
      setTxData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'vault') {
      loadVault()
    } else {
      loadTransaction()
    }
  }, [viewMode])

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
            letterSpacing: '-0.02em',
            lineHeight: '1.3',
            marginBottom: 'var(--space-4)'
          }}>
            Fireblocks Viewer
          </h1>

          {/* Mode Selector */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: 'var(--space-4)'
          }}>
            <button
              onClick={() => setViewMode('vault')}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: viewMode === 'vault' ? '#C5FFA7' : 'transparent',
                color: viewMode === 'vault' ? '#000000' : 'var(--text-primary)',
                border: `1px solid ${viewMode === 'vault' ? '#C5FFA7' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
              }}
            >
              Vault Account
            </button>
            <button
              onClick={() => setViewMode('transaction')}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: viewMode === 'transaction' ? '#C5FFA7' : 'transparent',
                color: viewMode === 'transaction' ? '#000000' : 'var(--text-primary)',
                border: `1px solid ${viewMode === 'transaction' ? '#C5FFA7' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
              }}
            >
              Transaction
            </button>
          </div>

          {/* Input Section */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            marginBottom: 'var(--space-4)'
          }}>
            <input
              type="text"
              value={viewMode === 'vault' ? vaultId : txId}
              onChange={(e) => {
                if (viewMode === 'vault') {
                  setVaultId(e.target.value)
                } else {
                  setTxId(e.target.value)
                }
              }}
              placeholder={viewMode === 'vault' ? 'Vault Account ID' : 'Transaction ID'}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <button
              onClick={viewMode === 'vault' ? loadVault : loadTransaction}
              disabled={loading}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: '#C5FFA7',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            padding: 'var(--space-4)',
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FF4D4D',
            marginBottom: 'var(--space-4)',
          }}>
            <strong>Erreur:</strong> {error}
            {(error.includes('503') || error.includes('non configurée')) && (
              <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Configuration requise:</strong>
                <ol style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)' }}>
                  <li>Ajoutez <code>FIREBLOCKS_API_KEY</code> dans <code>.env.local</code></li>
                  <li>Ajoutez <code>FIREBLOCKS_PRIVATE_KEY</code> dans <code>.env.local</code></li>
                  <li>Redémarrez le serveur Next.js</li>
                </ol>
                <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                  Consultez <code>GUIDE_FIREBLOCKS_API_USER_SETUP.md</code> pour plus d'informations.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Data Display */}
        {loading && (
          <div style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            Chargement...
          </div>
        )}

        {!loading && viewMode === 'vault' && vaultData && (
          <div style={{
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              marginBottom: 'var(--space-4)',
              color: '#C5FFA7'
            }}>
              Vault Account Details
            </h2>
            <div style={{
              display: 'grid',
              gap: 'var(--space-4)',
            }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>ID:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                  {vaultData.id}
                </div>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Name:</strong>
                <div style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-1)' }}>
                  {vaultData.name || 'N/A'}
                </div>
              </div>
              {vaultData.assets && vaultData.assets.length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)', display: 'block' }}>
                    Assets:
                  </strong>
                  <div style={{
                    display: 'grid',
                    gap: 'var(--space-3)',
                  }}>
                    {vaultData.assets.map((asset: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: 'var(--space-3)',
                          background: 'rgba(10, 10, 10, 0.6)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                          <strong style={{ color: '#C5FFA7' }}>{asset.id}</strong>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Total:</span> {asset.total || '0'}
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Available:</span> {asset.available || '0'}
                          </div>
                          {asset.pending && (
                            <div>
                              <span style={{ color: 'var(--text-secondary)' }}>Pending:</span> {asset.pending}
                            </div>
                          )}
                          {asset.frozen && (
                            <div>
                              <span style={{ color: 'var(--text-secondary)' }}>Frozen:</span> {asset.frozen}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              background: 'rgba(10, 10, 10, 0.6)',
              borderRadius: 'var(--radius-md)',
            }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 'var(--space-2)' }}>
                Raw JSON:
              </strong>
              <pre style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                overflow: 'auto',
                maxHeight: '400px',
              }}>
                {JSON.stringify(vaultData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!loading && viewMode === 'transaction' && txData && (
          <div style={{
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              marginBottom: 'var(--space-4)',
              color: '#C5FFA7'
            }}>
              Transaction Details
            </h2>
            <div style={{
              display: 'grid',
              gap: 'var(--space-4)',
            }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>ID:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                  {txData.id}
                </div>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Status:</strong>
                <div style={{
                  fontSize: 'var(--text-base)',
                  marginTop: 'var(--space-1)',
                  color: txData.status === 'COMPLETED' ? '#C5FFA7' : txData.status === 'FAILED' ? '#FF4D4D' : '#FFA500'
                }}>
                  {txData.status}
                </div>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Asset:</strong>
                <div style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-1)' }}>
                  {txData.assetId}
                </div>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Amount:</strong>
                <div style={{ fontSize: 'var(--text-base)', marginTop: 'var(--space-1)', fontFamily: 'var(--font-mono)' }}>
                  {txData.amount} {txData.assetId}
                </div>
              </div>
              {txData.source && (
                <div>
                  <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Source:</strong>
                  <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)', fontFamily: 'var(--font-mono)' }}>
                    {txData.source.type}: {txData.source.id || txData.source.name || 'N/A'}
                  </div>
                </div>
              )}
              {txData.destination && (
                <div>
                  <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Destination:</strong>
                  <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)', fontFamily: 'var(--font-mono)' }}>
                    {txData.destination.type}: {txData.destination.id || txData.destination.name || 'N/A'}
                  </div>
                </div>
              )}
              {txData.txHash && (
                <div>
                  <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Transaction Hash:</strong>
                  <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)', fontFamily: 'var(--font-mono)' }}>
                    {txData.txHash}
                  </div>
                </div>
              )}
            </div>
            <div style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              background: 'rgba(10, 10, 10, 0.6)',
              borderRadius: 'var(--radius-md)',
            }}>
              <strong style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: 'var(--space-2)' }}>
                Raw JSON:
              </strong>
              <pre style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                overflow: 'auto',
                maxHeight: '400px',
              }}>
                {JSON.stringify(txData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!loading && !vaultData && !txData && !error && (
          <div style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            Entrez un ID et cliquez sur "Load" pour voir les données
          </div>
        )}
      </div>
    </div>
  )
}

