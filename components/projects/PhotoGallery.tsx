'use client'

import { useState, useEffect } from 'react'
import './Projects.css'

interface PhotoGalleryProps {
  photos: string[]
  projectName: string
}

export default function PhotoGallery({ photos, projectName }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Load icons
    const loadIcons = () => {
      if (typeof window !== 'undefined' && (window as any).Icons) {
        document.querySelectorAll('[data-icon]').forEach(el => {
          const iconName = el.getAttribute('data-icon')
          if (iconName) {
            const iconSvg = (window as any).Icons[iconName]
            if (iconSvg) {
              el.innerHTML = iconSvg
            }
          }
        })
      }
    }
    
    loadIcons()
    const timeout = setTimeout(loadIcons, 500)
    return () => clearTimeout(timeout)
  }, [])

  const handleImageError = (index: number, photo: string) => {
    console.error(`Erreur de chargement de l'image ${index + 1}:`, photo)
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validPhotos = photos.filter((photo, index) => {
    // Filtrer les photos vides ou invalides
    if (!photo || photo.trim() === '') {
      return false
    }
    // Reject blob URLs (they can't be loaded after page reload)
    if (photo.startsWith('blob:')) {
      console.warn(`Photo ${index + 1} is a blob URL and will be skipped:`, photo)
      return false
    }
    // Vérifier que ce n'est pas une photo qui a déjà échoué
    return !imageErrors.has(index)
  })

  if (validPhotos.length === 0) {
    return (
      <div className="photo-gallery-empty">
        <div className="photo-gallery-empty-icon premium-stat-icon" data-icon="image"></div>
        <p>No photos available for this project</p>
      </div>
    )
  }

  return (
    <>
      <div className="photo-gallery">
        <div className="photo-gallery-header">
          <h3 className="photo-gallery-title">Photo Gallery</h3>
          <span className="photo-gallery-count">{validPhotos.length} photos</span>
        </div>
        <div className="photo-gallery-grid">
          {validPhotos.map((photo, index) => (
            <div
              key={index}
              className="photo-gallery-item"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo}
                alt={`${projectName} - Photo ${index + 1}`}
                className="photo-gallery-image"
                onError={(e) => {
                  handleImageError(index, photo)
                  // Afficher un placeholder en cas d'erreur
                  const target = e.currentTarget
                  target.style.display = 'none'
                }}
                loading="lazy"
                crossOrigin="anonymous"
              />
              <div className="photo-gallery-overlay">
                <div className="photo-gallery-zoom-icon premium-stat-icon" data-icon="search"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {selectedPhoto && (
        <div
          className="photo-gallery-modal"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="photo-gallery-modal-close"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(null)
            }}
          >
            ×
          </button>
          <div
            className="photo-gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt={`${projectName} - Full View`}
              className="photo-gallery-modal-image"
            />
            <div className="photo-gallery-modal-nav">
              <button
                className="photo-gallery-modal-nav-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  const currentIndex = validPhotos.indexOf(selectedPhoto)
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : validPhotos.length - 1
                  setSelectedPhoto(validPhotos[prevIndex])
                }}
              >
                ← Previous
              </button>
              <span className="photo-gallery-modal-counter">
                {validPhotos.indexOf(selectedPhoto) + 1} / {validPhotos.length}
              </span>
              <button
                className="photo-gallery-modal-nav-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  const currentIndex = validPhotos.indexOf(selectedPhoto)
                  const nextIndex = currentIndex < validPhotos.length - 1 ? currentIndex + 1 : 0
                  setSelectedPhoto(validPhotos[nextIndex])
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

