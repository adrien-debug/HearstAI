'use client'

import { useState } from 'react'
import './Projects.css'

interface PhotoGalleryProps {
  photos: string[]
  projectName: string
}

export default function PhotoGallery({ photos, projectName }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validPhotos = photos.filter((_, index) => !imageErrors.has(index))

  if (validPhotos.length === 0) {
    return (
      <div className="photo-gallery-empty">
        <div className="photo-gallery-empty-icon">📷</div>
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
                onError={() => handleImageError(index)}
              />
              <div className="photo-gallery-overlay">
                <div className="photo-gallery-zoom-icon">🔍</div>
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

