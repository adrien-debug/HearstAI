'use client'

import { useEffect } from 'react'

export default function IconsLoader() {
  useEffect(() => {
    // Load icons script dynamically
    const loadIcons = async () => {
      try {
        // Load icons from public/js/icons.js via script tag
        if (typeof window !== 'undefined' && !window.Icons) {
          const script = document.createElement('script')
          script.type = 'module'
          script.src = '/js/icons.js?v=' + Date.now() // Cache busting
          script.onload = () => {
            if (window.Icons) {
              injectIcons()
            }
          }
          document.head.appendChild(script)
        } else if (window.Icons) {
          // Icons already loaded, inject them
          injectIcons()
        }
      } catch (error) {
        console.warn('Icons not loaded:', error)
      }
    }

    const injectIcons = () => {
      if (typeof window !== 'undefined' && window.Icons) {
        document.querySelectorAll('[data-icon]').forEach(el => {
          const iconName = el.getAttribute('data-icon')
          if (iconName && window.Icons[iconName]) {
            el.innerHTML = window.Icons[iconName]
          }
        })
      }
    }

    loadIcons()
    
    // Also inject icons after delays to catch dynamically loaded components
    const timeout1 = setTimeout(injectIcons, 100)
    const timeout2 = setTimeout(injectIcons, 500)
    const timeout3 = setTimeout(injectIcons, 1000)
    
    // Use MutationObserver to watch for new elements with data-icon
    const observer = new MutationObserver(() => {
      injectIcons()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      observer.disconnect()
    }
  }, [])

  return null
}

