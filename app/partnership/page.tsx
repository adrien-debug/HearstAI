'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PartnershipRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/strategy/partnerships')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      color: 'var(--text-secondary)'
    }}>
      Redirecting to Partnerships...
    </div>
  )
}

