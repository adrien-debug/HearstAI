'use client'

import { useState, useEffect } from 'react'
import { customersAPI } from '@/lib/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await customersAPI.getAll()
      setCustomers(response.customers || [])
    } catch (error) {
      console.error('Error loading customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.erc20Address?.toLowerCase().includes(search) ||
      customer.tag?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--space-6)'
          }}>
            <h1 style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: '1.3'
            }}>Customers</h1>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowAddModal(true)
              }}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: '#C5FFA7',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B0FF8F'
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C5FFA7'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ pointerEvents: 'none' }}
              >
                <path d="M8 2 L8 14 M2 8 L14 8" />
              </svg>
              Add Customer
            </button>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
            />
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading customers...
          </div>
        ) : (
          <div style={{
            background: 'rgba(26, 26, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            position: 'relative',
          }}>
            <div className="table-container">
              <table className="table table-unified-grid" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(180deg, #454646 0%, #3a3a3a 100%)',
                    borderBottom: '2px solid rgba(197, 255, 167, 0.3)',
                  }}>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Name</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Tag</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>ERC-20 Address</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Chains</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Total Value</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Health Factor</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Status</th>
                    <th style={{
                      padding: 'var(--space-3) var(--space-4)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'var(--text-primary)',
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-secondary)' }}>
                        {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Click "Add Customer" to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td style={{ fontWeight: 600 }}>{customer.name || 'N/A'}</td>
                        <td>
                          <span style={{
                            padding: 'var(--space-1) var(--space-3)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(138, 253, 129, 0.1)',
                            color: '#8afd81',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {customer.tag || 'Client'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                          {customer.erc20Address ? `${customer.erc20Address.substring(0, 8)}...${customer.erc20Address.substring(customer.erc20Address.length - 6)}` : 'N/A'}
                        </td>
                        <td>
                          {customer.chains ? (
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              {JSON.parse(customer.chains || '[]').join(', ')}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td style={{ 
                          fontFamily: 'var(--font-mono)', 
                          color: '#C5FFA7', 
                          fontWeight: 600,
                          fontSize: 'var(--text-base)',
                          textShadow: '0 0 10px rgba(197, 255, 167, 0.2)',
                        }}>
                          ${customer.totalValue ? customer.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
                        </td>
                        <td>
                          <span style={{
                            color: customer.healthFactor >= 2 ? '#C5FFA7' : customer.healthFactor >= 1.5 ? '#FFA500' : '#FF4D4D',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                          }}>
                            {customer.healthFactor ? customer.healthFactor.toFixed(2) : 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            padding: 'var(--space-1) var(--space-3)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: customer.status === 'active' ? 'rgba(197, 255, 167, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                            color: customer.status === 'active' ? '#C5FFA7' : '#FF4D4D',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {customer.status || 'unknown'}
                          </span>
                        </td>
                        <td>
                          <button
                            style={{
                              padding: 'var(--space-2) var(--space-4)',
                              background: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--text-xs)',
                              cursor: 'pointer',
                              transition: 'all var(--duration-fast) var(--ease-in-out)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#C5FFA7'
                              e.currentTarget.style.color = '#C5FFA7'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                              e.currentTarget.style.color = 'var(--text-primary)'
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            loadCustomers()
          }}
        />
      )}
    </div>
  )
}

// Modal pour ajouter un customer
function AddCustomerModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
      onSuccess()
    } catch (err: any) {
      setError(err.message || err.error || 'Erreur lors de la création du customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            Add New Customer
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Create a new customer with an ERC-20 wallet address
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
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
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
              }}
              placeholder="Customer name"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
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
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
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
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--text-primary)',
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
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-primary)',
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
              color: '#ff4d4d',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: 'var(--space-3) var(--space-6)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-in-out)',
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
  )
}

