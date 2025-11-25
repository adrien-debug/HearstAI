'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { customersAPI } from '@/lib/api'

export default function AddCustomerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    erc20Address: '',
    tag: 'Client',
    chains: ['eth'],
    protocols: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await customersAPI.create(formData)
      router.push('/customers')
    } catch (err: any) {
      setError(err.message || err.error || 'Erreur lors de la création du customer')
    } finally {
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
            letterSpacing: '-0.02em',
            lineHeight: '1.3',
            marginBottom: 'var(--space-2)'
          }}>
            Add New Customer
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-base)'
          }}>
            Create a new customer with an ERC-20 wallet address
          </p>
        </div>

        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Customer name"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                ERC-20 Address *
              </label>
              <input
                type="text"
                required
                value={formData.erc20Address}
                onChange={(e) => setFormData({ ...formData, erc20Address: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-mono)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="0x..."
              />
              <p style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Must start with 0x and contain 40 hexadecimal characters
              </p>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Tag
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Client, VIP, etc."
              />
            </div>

            {error && (
              <div style={{
                padding: 'var(--space-3)',
                background: 'rgba(255, 77, 77, 0.1)',
                border: '1px solid rgba(255, 77, 77, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#FF4D4D',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: loading ? 'var(--primary-grey)' : '#C5FFA7',
                  color: '#000000',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                  letterSpacing: '-0.01em',
                  boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#B0FF8F'
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = '#C5FFA7'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }
                }}
              >
                {loading ? 'Creating...' : 'Create Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


