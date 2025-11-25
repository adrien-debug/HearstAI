'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@hearst.ai')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLocal, setIsLocal] = useState(false)

  // Détecter si on est en mode local et rediriger automatiquement
  useEffect(() => {
    const isLocalEnv = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '6001' ||
      window.location.port === '3000'
    )
    setIsLocal(isLocalEnv)
    console.log('[SignIn] Mode local détecté:', isLocalEnv)
    
    // EN MODE LOCAL : Rediriger automatiquement vers la page d'accueil
    // Pas besoin de login en local
    if (isLocalEnv) {
      console.log('[SignIn] 🔧 MODE LOCAL - Redirection automatique vers /')
      setTimeout(() => {
        router.push('/')
      }, 500)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[SignIn] Tentative de connexion avec:', { email, isLocal })
      
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
        console.log('[SignIn] Connexion réussie')
        
        // EN MODE LOCAL : Pas de redirection, juste un message de succès
        if (isLocal) {
          console.log('[SignIn] 🔧 MODE LOCAL - Pas de redirection automatique')
          setError('') // Clear error
          // Afficher un message de succès et laisser l'utilisateur naviguer manuellement
          alert('✅ Connexion réussie ! Vous pouvez maintenant naviguer vers la page d\'accueil.')
          // Optionnel : redirection simple sans boucle
          setTimeout(() => {
            router.push('/')
          }, 1000)
          return
        }
        
        // EN PRODUCTION : Redirection normale
        console.log('[SignIn] Connexion réussie, redirection...')
        
        // Récupérer le callbackUrl depuis l'URL ou utiliser '/' par défaut
        const urlParams = new URLSearchParams(window.location.search)
        let callbackUrl = urlParams.get('callbackUrl')
        
        // Si callbackUrl est null ou vide, utiliser '/'
        if (!callbackUrl || callbackUrl.trim() === '') {
          callbackUrl = '/'
        } else {
          try {
            if (callbackUrl.startsWith('%')) {
              callbackUrl = decodeURIComponent(callbackUrl)
            } else {
              callbackUrl = decodeURIComponent(callbackUrl)
            }
          } catch (e) {
            console.warn('[SignIn] Erreur décodage callbackUrl, utilisation de /:', e)
            callbackUrl = '/'
          }
        }
        
        // FORCER '/' si callbackUrl pointe vers /auth/signin (éviter les boucles)
        if (callbackUrl === '/auth/signin' || callbackUrl.startsWith('/auth/signin?') || callbackUrl.includes('/auth/signin')) {
          console.warn('[SignIn] ⚠️ CallbackUrl pointe vers /auth/signin, forcer vers /')
          callbackUrl = '/'
        }
        
        // S'assurer que callbackUrl est une URL relative valide
        if (!callbackUrl.startsWith('/')) {
          console.warn('[SignIn] ⚠️ CallbackUrl invalide (ne commence pas par /), forcer vers /')
          callbackUrl = '/'
        }
        
        console.log('[SignIn] Redirection vers:', callbackUrl)
        
        // Redirection simple en production
        router.push(callbackUrl)
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

