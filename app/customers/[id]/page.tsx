'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { customersAPI, fireblocksAPI } from '@/lib/api'
import Link from 'next/link'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [fireblocksInfo, setFireblocksInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fireblocksLoading, setFireblocksLoading] = useState(false)
  const [selectedVaultId, setSelectedVaultId] = useState<string>('')
  const [selectedWalletId, setSelectedWalletId] = useState<string>('')

  useEffect(() => {
    loadCustomer()
    loadFireblocksInfo()
  }, [customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const response = await customersAPI.getById(customerId)
      setCustomer(response.customer)
    } catch (error) {
      console.error('Error loading customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFireblocksInfo = async () => {
    try {
      setFireblocksLoading(true)
      const response = await fetch(`/api/customers/${customerId}/fireblocks`)
      const data = await response.json()
      setFireblocksInfo(data)
      
      if (data.fireblocks?.vault?.id) {
        setSelectedVaultId(data.fireblocks.vault.id)
      }
      if (data.fireblocks?.wallet?.id) {
        setSelectedWalletId(data.fireblocks.wallet.id)
      }
    } catch (error) {
      console.error('Error loading Fireblocks info:', error)
    } finally {
      setFireblocksLoading(false)
    }
  }

  const handleAssociateFireblocks = async () => {
    try {
      setFireblocksLoading(true)
      const response = await fetch(`/api/customers/${customerId}/fireblocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaultId: selectedVaultId || undefined,
          walletId: selectedWalletId || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'association')
      }

      await loadFireblocksInfo()
      alert('Association Fireblocks mise à jour avec succès')
    } catch (error: any) {
      alert(`Erreur: ${error.message}`)
    } finally {
      setFireblocksLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(138, 253, 129, 0.2)',
            borderTopColor: '#8afd81',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-4)',
          }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="dashboard-view">
        <div className="dashboard-content" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Customer non trouvé</p>
          <Link href="/customers" style={{ color: '#8afd81', textDecoration: 'underline' }}>
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {customer.name}
            </h1>
            <Link
              href="/customers"
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                textDecoration: 'none',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8afd81'
                e.currentTarget.style.color = '#8afd81'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              ← Retour
            </Link>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Informations Customer
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                ERC-20 Address
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: '#8afd81' }}>
                {customer.erc20Address}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                Tag
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {customer.tag || 'Client'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                Total Value
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#C5FFA7' }}>
                ${customer.totalValue?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                Health Factor
              </div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: customer.healthFactor >= 2 ? '#C5FFA7' : customer.healthFactor >= 1.5 ? '#FFA500' : '#FF4D4D' }}>
                {customer.healthFactor?.toFixed(2) || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Fireblocks Integration */}
        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            🔥 Intégration Fireblocks
          </h2>

          {fireblocksLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div className="spinner" style={{
                width: '30px',
                height: '30px',
                border: '3px solid rgba(138, 253, 129, 0.2)',
                borderTopColor: '#8afd81',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
              }}></div>
            </div>
          ) : fireblocksInfo?.configured === false ? (
            <div style={{
              padding: 'var(--space-4)',
              background: 'rgba(255, 165, 0, 0.1)',
              border: '1px solid rgba(255, 165, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#FFA500',
            }}>
              ⚠️ Fireblocks API non configurée. Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY dans .env.local
            </div>
          ) : (
            <>
              {/* Vault Association */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                  Vault Fireblocks
                </label>
                <select
                  value={selectedVaultId}
                  onChange={(e) => setSelectedVaultId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <option value="">Aucun vault sélectionné</option>
                  {fireblocksInfo?.available?.vaults?.map((vault: any) => (
                    <option key={vault.id} value={vault.id}>
                      {vault.name} ({vault.id})
                    </option>
                  ))}
                </select>
                {fireblocksInfo?.fireblocks?.vault && (
                  <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Vault actuel: {fireblocksInfo.fireblocks.vault.name} ({fireblocksInfo.fireblocks.vault.id})
                  </div>
                )}
              </div>

              {/* Wallet Association */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                  Wallet Externe Fireblocks
                </label>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <option value="">Aucun wallet sélectionné</option>
                  {fireblocksInfo?.available?.wallets?.map((wallet: any) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} ({wallet.id})
                    </option>
                  ))}
                </select>
                {fireblocksInfo?.fireblocks?.wallet && (
                  <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Wallet actuel: {fireblocksInfo.fireblocks.wallet.name} ({fireblocksInfo.fireblocks.wallet.id})
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleAssociateFireblocks}
                disabled={fireblocksLoading}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: '#C5FFA7',
                  color: '#000000',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: fireblocksLoading ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                  opacity: fireblocksLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!fireblocksLoading) {
                    e.currentTarget.style.background = '#B0FF8F'
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!fireblocksLoading) {
                    e.currentTarget.style.background = '#C5FFA7'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }
                }}
              >
                {fireblocksLoading ? 'Enregistrement...' : 'Associer Fireblocks'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}



