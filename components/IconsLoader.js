'use client'

import { useEffect } from 'react'

/**
 * IconsLoader - Charge le script icons.js et injecte les icônes dans les éléments data-icon
 */
export default function IconsLoader() {
  useEffect(() => {
    const injectIcons = () => {
      if (typeof window === 'undefined' || !window.Icons) return
      
      document.querySelectorAll('[data-icon]').forEach(el => {
        const iconName = el.getAttribute('data-icon')
        if (window.Icons[iconName]) {
          el.innerHTML = window.Icons[iconName]
        }
      })
    }

    const loadIcons = async () => {
      try {
        if (typeof window !== 'undefined' && !window.Icons) {
          const script = document.createElement('script')
          script.type = 'module'
          script.src = '/js/icons.js'
          script.onload = () => {
            if (window.Icons) {
              injectIcons()
              // Observer pour les éléments ajoutés dynamiquement
              const observer = new MutationObserver(() => {
                injectIcons()
              })
              observer.observe(document.body, {
                childList: true,
                subtree: true
              })
            }
          }
          document.head.appendChild(script)
        } else if (window.Icons) {
          injectIcons()
        }
      } catch (error) {
        console.warn('Icons not loaded:', error)
      }
    }

    loadIcons()
  }, [])

  return null
}



