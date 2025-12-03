'use client'

import { useEffect, useState, useRef } from 'react'
import { debankAPI } from '@/lib/api'
import Icon from '@/components/Icon'
import './Collateral.css'

interface DebankStatus {
  status: 'operational' | 'error' | 'not_configured' | 'checking'
  configured: boolean
  message: string
  testResult?: any
  error?: string
  instructions?: string[]
}

export default function DebankStatusIndicator() {
  const [status, setStatus] = useState<DebankStatus>({
    status: 'checking',
    configured: false,
    message: 'Checking DeBank API status...',
  })
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate calls from React StrictMode
    if (hasLoadedRef.current) {
      // Set up interval only, don't call checkStatus again
      const interval = setInterval(async () => {
        try {
          const health = await debankAPI.health()
          setStatus(health)
        } catch (error: any) {
          setStatus({
            status: 'error',
            configured: false,
            message: `Failed to check DeBank API status: ${error.message || 'Unknown error'}`,
            error: error.message || String(error),
          })
        }
      }, 300000)
      return () => clearInterval(interval)
    }
    hasLoadedRef.current = true

    const checkStatus = async () => {
      try {
        console.log('[DebankStatusIndicator] Checking health...')
        const health = await debankAPI.health()
        console.log('[DebankStatusIndicator] Health check response:', health)
        setStatus(health)
      } catch (error: any) {
        console.error('[DebankStatusIndicator] Error checking status:', error)
        console.error('[DebankStatusIndicator] Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        setStatus({
          status: 'error',
          configured: false,
          message: `Failed to check DeBank API status: ${error.message || 'Unknown error'}`,
          error: error.message || String(error),
        })
      }
    }

    checkStatus()
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 300000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status.status) {
      case 'operational':
        return '#C5FFA7'
      case 'error':
        return '#ff4d4d'
      case 'not_configured':
        return '#FFA500'
      case 'checking':
        return 'var(--text-secondary)'
      default:
        return 'var(--text-secondary)'
    }
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'operational':
        return 'check'
      case 'error':
        return 'alert'
      case 'not_configured':
        return 'alert'
      case 'checking':
        return 'refresh'
      default:
        return 'info'
    }
  }

  return (
    <div
      style={{
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${getStatusColor()}40`,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: getStatusColor(),
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontWeight: 'var(--font-semibold)', color: getStatusColor() }}>
            DeBank API: {status.status === 'operational' ? 'Operational' : 
                        status.status === 'error' ? 'Error' : 
                        status.status === 'not_configured' ? 'Not Configured' : 'Checking...'}
          </span>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {status.message}
          {status.testResult && status.status === 'operational' && (
            <span style={{ marginLeft: 'var(--space-2)' }}>
              • {status.testResult.protocolsFound || 0} protocols found in test
          </span>
          )}
          {status.error && status.status === 'error' && (
            <div style={{ marginTop: '4px', color: '#ff4d4d', fontFamily: 'monospace', fontSize: '10px' }}>
              Error: {status.error}
            </div>
          )}
        </div>
        {status.instructions && status.instructions.length > 0 && (
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 'var(--font-semibold)', marginBottom: '4px' }}>Setup Instructions:</div>
            <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'disc' }}>
              {status.instructions.map((instruction, idx) => (
                <li key={idx} style={{ marginBottom: '2px' }}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}





