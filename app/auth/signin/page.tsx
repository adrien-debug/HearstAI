'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@hearst.ai')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[SignIn] Tentative de connexion avec:', { email })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      })

      console.log('[SignIn] Résultat:', result)

      if (result?.error) {
        console.error('[SignIn] Erreur:', result.error)
        setError(`Erreur: ${result.error}`)
      } else if (result?.ok) {
        console.log('[SignIn] Connexion réussie, redirection...')
        
        // Récupérer le callbackUrl depuis l'URL ou utiliser '/' par défaut
        const urlParams = new URLSearchParams(window.location.search)
        let callbackUrl = urlParams.get('callbackUrl') || '/'
        
        // Décoder l'URL si elle est encodée (%2F -> /)
        try {
          callbackUrl = decodeURIComponent(callbackUrl)
        } catch (e) {
          callbackUrl = '/'
        }
        
        // FORCER '/' si callbackUrl pointe vers /auth/signin (éviter les boucles)
        if (callbackUrl === '/auth/signin' || callbackUrl.startsWith('/auth/signin?') || callbackUrl.includes('/auth/signin')) {
          console.warn('[SignIn] ⚠️ CallbackUrl pointe vers /auth/signin, forcer vers /')
          callbackUrl = '/'
        }
        
        // S'assurer que callbackUrl est une URL relative valide
        if (!callbackUrl.startsWith('/')) {
          callbackUrl = '/'
        }
        
        console.log('[SignIn] Redirection vers:', callbackUrl)
        
        // Vérifier les cookies avant
        console.log('[SignIn] Cookies avant attente:', document.cookie)
        
        // Attendre que le cookie soit défini (important pour le middleware)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Vérifier les cookies après
        console.log('[SignIn] Cookies après attente:', document.cookie)
        
        // Vérifier que la session est bien créée (plusieurs tentatives)
        let session = null
        for (let i = 0; i < 5; i++) {
          try {
            const sessionCheck = await fetch('/api/auth/session', { 
              cache: 'no-store',
              credentials: 'include',
              headers: {
                'Cache-Control': 'no-cache',
              }
            })
            session = await sessionCheck.json()
            console.log('[SignIn] Session check', i + 1, ':', session)
            if (session?.user) {
              console.log('[SignIn] ✅ Session confirmée (tentative', i + 1, ')')
              break
            }
          } catch (e) {
            console.warn('[SignIn] Erreur vérification session:', e)
          }
          if (i < 4) {
            await new Promise(resolve => setTimeout(resolve, 400))
          }
        }
        
        // Vérifier les cookies une dernière fois
        console.log('[SignIn] Cookies finaux:', document.cookie)
        
        if (session?.user) {
          console.log('[SignIn] ✅ Session confirmée, redirection immédiate vers:', callbackUrl)
          // Utiliser window.location.replace pour éviter l'historique
          window.location.replace(callbackUrl)
        } else {
          console.warn('[SignIn] ⚠️ Session non confirmée après 5 tentatives')
          console.warn('[SignIn] Session reçue:', session)
          console.warn('[SignIn] Redirection quand même vers:', callbackUrl)
          // Rediriger quand même après un délai
          setTimeout(() => {
            console.log('[SignIn] 🔄 Redirection forcée vers:', callbackUrl)
            window.location.replace(callbackUrl)
          }, 1000)
        }
      } else {
        console.warn('[SignIn] Résultat inattendu:', result)
        setError('Une erreur est survenue lors de la connexion')
      }
    } catch (err) {
      console.error('[SignIn] Exception:', err)
      setError(`Erreur: ${err instanceof Error ? err.message : 'Une erreur est survenue'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#FFFFFF',
            marginTop: '20px',
            letterSpacing: '-0.5px',
          }}>
            HearstAI
          </div>
          <div style={{
            fontSize: '13px',
            color: '#B0B0B0',
            marginTop: '8px',
          }}>
            Secure Access Portal
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#1A1A1A',
            border: '1px solid #3A3A3A',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          {error && (
            <div style={{
              background: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid #ff4d4d',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              color: '#ff4d4d',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#B0B0B0',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#232323',
                border: '1px solid #3A3A3A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#a5ff9c'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#3A3A3A'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#B0B0B0',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#232323',
                border: '1px solid #3A3A3A',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#a5ff9c'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#3A3A3A'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading
                ? '#666'
                : 'linear-gradient(90deg, #a5ff9c 0%, #a5ff9c 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(165, 255, 156, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(165, 255, 156, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(165, 255, 156, 0.3)'
              }
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ fontSize: '11px', color: '#808080' }}>
              Authorized Access Only
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

