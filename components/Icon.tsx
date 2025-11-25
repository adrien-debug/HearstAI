'use client'

import { useEffect, useState } from 'react'

interface IconProps {
  name: string
  className?: string
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
}

/**
 * Composant Icon sécurisé pour Next.js
 * Charge les icônes depuis window.Icons après l'hydratation
 * Évite les problèmes d'hydratation en ne rendant l'icône qu'après le montage
 */
export default function Icon({ name, className = '', style, width, height }: IconProps) {
  const [mounted, setMounted] = useState(false)
  const [iconSvg, setIconSvg] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const loadIcon = () => {
      if ((window as any).Icons && (window as any).Icons[name]) {
        setIconSvg((window as any).Icons[name])
        return true
      }
      return false
    }

    // Essayer de charger immédiatement
    if (loadIcon()) return

    // Si les icônes ne sont pas encore chargées, attendre un peu
    const timeout = setTimeout(() => {
      loadIcon()
    }, 100)

    // Écouter l'événement de chargement des icônes
    const handleIconsLoaded = () => {
      loadIcon()
    }
    window.addEventListener('iconsLoaded', handleIconsLoaded)

    // Vérifier périodiquement si les icônes sont chargées (fallback)
    const checkIcons = setInterval(() => {
      if (loadIcon()) {
        clearInterval(checkIcons)
      }
    }, 200)

    // Nettoyer après 5 secondes maximum pour éviter les boucles infinies
    const maxTimeout = setTimeout(() => {
      clearInterval(checkIcons)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      clearTimeout(maxTimeout)
      clearInterval(checkIcons)
      window.removeEventListener('iconsLoaded', handleIconsLoaded)
    }
  }, [mounted, name])

  // Pendant l'hydratation, rendre un placeholder vide pour éviter les mismatches
  if (!mounted || !iconSvg) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: width || '20px',
          height: height || '20px',
          ...style,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
      aria-hidden="true"
    />
  )
}

