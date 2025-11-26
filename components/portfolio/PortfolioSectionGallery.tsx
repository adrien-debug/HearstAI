'use client'

import React, { useState } from 'react'
import PortfolioImageDisplay from './PortfolioImageDisplay'
import './PortfolioImageDisplay.css'

interface PortfolioImage {
  id: string
  url: string
  thumbnailUrl?: string | null
  title?: string | null
  description?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  isVisible: boolean
  order: number
}

interface PortfolioSection {
  id: string
  title: string
  description?: string | null
  type: string
  layout: string
  columns: number
  images: PortfolioImage[]
}

interface PortfolioSectionGalleryProps {
  section: PortfolioSection
  onImageClick?: (image: PortfolioImage) => void
}

export default function PortfolioSectionGallery({
  section,
  onImageClick,
}: PortfolioSectionGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)

  const handleImageClick = (image: PortfolioImage) => {
    setSelectedImage(image)
    if (onImageClick) {
      onImageClick(image)
    }
  }

  const visibleImages = section.images.filter((img) => img.isVisible)

  if (visibleImages.length === 0) {
    return (
      <div className="portfolio-section-empty">
        <p>Aucune image dans cette section</p>
      </div>
    )
  }

  // Déterminer le nombre de colonnes selon le layout
  const gridColumns = section.layout === 'grid' ? section.columns : 3

  return (
    <div className="portfolio-section-gallery">
      <div className="portfolio-section-header">
        <h2 className="portfolio-section-title">{section.title}</h2>
        {section.description && (
          <p className="portfolio-section-description">{section.description}</p>
        )}
      </div>

      <div
        className={`portfolio-gallery-grid portfolio-gallery-${section.layout}`}
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        }}
      >
        {visibleImages.map((image) => (
          <div
            key={image.id}
            className="portfolio-gallery-item"
            onClick={() => handleImageClick(image)}
          >
            <PortfolioImageDisplay
              image={image}
              className="portfolio-gallery-image"
              onClick={() => handleImageClick(image)}
            />
            {image.title && (
              <div className="portfolio-gallery-item-info">
                <p className="portfolio-gallery-item-title">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div
          className="portfolio-image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <div className="portfolio-image-modal-content">
            <button
              className="portfolio-image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || selectedImage.title || 'Image'}
              className="portfolio-image-modal-img"
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className="portfolio-image-modal-info">
                {selectedImage.title && (
                  <h3>{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p>{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

