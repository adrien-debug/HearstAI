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
          // Ne pas utiliser type="module" car icons.js définit window.Icons directement
          script.src = '/js/icons.js'
          script.onload = () => {
            // Attendre un peu pour que window.Icons soit défini
            setTimeout(() => {
              if (window.Icons) {
                injectIcons()
                // Déclencher l'événement pour les composants Icon
                window.dispatchEvent(new Event('iconsLoaded'))
                // Observer pour les éléments ajoutés dynamiquement (mais avec debounce)
                let timeoutId = null
                const observer = new MutationObserver(() => {
                  if (timeoutId) clearTimeout(timeoutId)
                  timeoutId = setTimeout(() => {
                    injectIcons()
                  }, 100)
                })
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                })
              }
            }, 50)
          }
          script.onerror = () => {
            console.warn('[IconsLoader] Erreur lors du chargement de icons.js')
          }
          document.head.appendChild(script)
        } else if (window.Icons) {
          injectIcons()
          window.dispatchEvent(new Event('iconsLoaded'))
        }
      } catch (error) {
        console.warn('Icons not loaded:', error)
      }
    }

    loadIcons()
  }, [])

  return null
}



