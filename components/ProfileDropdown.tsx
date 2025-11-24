'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ProfileDropdown() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* User Badge - Always visible */}
      <div
        className="user-badge"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
        }}
      >
        <span className="user-avatar" data-icon="user"></span>
        <span className="user-name">{session?.user?.name || 'User'}</span>
      </div>

      {/* Dropdown Menu - Visible seulement si isOpen */}
      {isOpen && (
        <div
          className={cn(
            'min-w-[200px] rounded-md border bg-card p-1 shadow-md',
            'absolute top-full right-0 mt-2 z-50'
          )}
          style={{
            minWidth: '200px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid hsl(var(--border))',
            background: 'hsl(var(--card))',
            padding: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            zIndex: 1000,
          }}
        >
        <div
          className={cn(
            'flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
            'hover:bg-accent hover:text-accent-foreground',
            'transition-colors'
          )}
          onClick={() => {
            setIsOpen(false)
            router.push('/profile')
          }}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
            e.currentTarget.style.color = 'hsl(var(--accent-foreground))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'inherit'
          }}
        >
          <span>My Profile</span>
        </div>

        <div
          className="my-1 h-px bg-border"
          style={{
            margin: '4px 0',
            height: '1px',
            backgroundColor: 'hsl(var(--border))',
          }}
        />

        <div
          className={cn(
            'flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none',
            'hover:bg-accent hover:text-accent-foreground',
            'transition-colors'
          )}
          onClick={() => {
            setIsOpen(false)
            handleLogout()
          }}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            color: 'rgb(255, 77, 77)',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--accent))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <span style={{ color: 'rgb(255, 77, 77)' }}>Logout</span>
        </div>
      </div>
      )}
    </div>
  )
}
