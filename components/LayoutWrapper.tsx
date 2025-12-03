'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isAuthenticated, syncCookieFromStorage } from '@/lib/auth-client'
import Sidebar from './Sidebar'
import Header from './Header'
import IconsLoader from './IconsLoader'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname?.startsWith('/auth')
  const [isChecking, setIsChecking] = useState(!isAuthPage)

  // Client-side authentication check to prevent flash of login page
  useEffect(() => {
    if (isAuthPage) {
      setIsChecking(false)
      return
    }

    // Sync cookie from localStorage to ensure it's available for middleware
    syncCookieFromStorage()

    // Check if user is authenticated on client side
    // This prevents the flash of login page during navigation
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsChecking(false)
      } else {
        // If not authenticated and not on auth page, redirect to login
        // But only if we're sure (after a brief check)
        const timer = setTimeout(() => {
          if (!isAuthenticated()) {
            const callbackUrl = encodeURIComponent(pathname || '/')
            router.push(`/auth/signin?callbackUrl=${callbackUrl}`)
          }
        }, 100)
        return () => clearTimeout(timer)
      }
    }

    checkAuth()
  }, [pathname, isAuthPage, router])

  if (isAuthPage) {
    return <>{children}</>
  }

  // Show loading state briefly while checking authentication
  // This prevents the flash of login page
  if (isChecking) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: '#0F0F0F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <div style={{ color: '#B0B0B0', fontSize: '14px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <IconsLoader />
      <div className="cockpit-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="content-area">{children}</main>
        </div>
      </div>
    </>
  )
}

