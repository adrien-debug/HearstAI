'use client'

import { useEffect, useRef } from 'react'

/**
 * IconsLoader - Charge le script icons.js et injecte les icônes dans les éléments data-icon
 * Version optimisée pour éviter les problèmes d'overlay et les re-renders excessifs
 */
export default function IconsLoader() {
  const observerRef = useRef(null)
  const injectedRef = useRef(new Set())

  useEffect(() => {
    const injectIcons = (target) => {
      if (typeof window === 'undefined' || !window.Icons) return

      const scope = target || document.body
      const icons = scope.querySelectorAll('[data-icon]')
      
      icons.forEach(el => {
        const iconName = el.getAttribute('data-icon')
        if (!iconName || !window.Icons[iconName]) return
        
        // Éviter de ré-injecter la même icône dans le même élément
        const elementId = `${iconName}-${el.getBoundingClientRect().top}-${el.getBoundingClientRect().left}`
        if (injectedRef.current.has(elementId)) return
        
        // Vérifier si l'icône est déjà injectée
        if (el.children.length > 0 && el.querySelector('svg')) return
        
        try {
          el.innerHTML = window.Icons[iconName]
          injectedRef.current.add(elementId)
        } catch (error) {
          console.warn('[IconsLoader] Erreur injection icône:', error)
        }
      })
    }

    const loadIcons = async () => {
      try {
        if (typeof window === 'undefined') return

        if (!window.Icons) {
          const script = document.createElement('script')
          script.src = '/js/icons.js'
          script.async = true
          
          script.onload = () => {
            // Attendre que window.Icons soit défini
            setTimeout(() => {
              if (window.Icons) {
                injectIcons()
                window.dispatchEvent(new Event('iconsLoaded'))
                
                // Observer uniquement les ajouts dans la sidebar pour éviter les perturbations
                const sidebar = document.querySelector('#sidebar')
                if (sidebar && !observerRef.current) {
                  observerRef.current = new MutationObserver((mutations) => {
                    let needsUpdate = false
                    mutations.forEach((mutation) => {
                      if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                          if (node.nodeType === 1) { // Element node
                            const hasIcon = node.querySelector && node.querySelector('[data-icon]')
                            const isIcon = node.getAttribute && node.getAttribute('data-icon')
                            if (hasIcon || isIcon) {
                              needsUpdate = true
                            }
                          }
                        })
                      }
                    })
                    
                    if (needsUpdate) {
                      // Debounce pour éviter trop de re-renders
                      setTimeout(() => {
                        injectIcons(sidebar)
                      }, 50)
                    }
                  })
                  
                  observerRef.current.observe(sidebar, {
                    childList: true,
                    subtree: true
                  })
                }
              }
            }, 50)
          }
          
          script.onerror = () => {
            console.warn('[IconsLoader] Erreur lors du chargement de icons.js')
          }
          
          document.head.appendChild(script)
        } else {
          // Icons déjà chargées
          injectIcons()
          window.dispatchEvent(new Event('iconsLoaded'))
        }
      } catch (error) {
        console.warn('[IconsLoader] Erreur:', error)
      }
    }

    loadIcons()

    return () => {
      // Nettoyer l'observer à la désactivation
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      injectedRef.current.clear()
    }
  }, [])

  return null
}



