'use client'

import React from 'react'
import Image from 'next/image'
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
}

interface PortfolioImageDisplayProps {
  image: PortfolioImage
  className?: string
  onClick?: () => void
  priority?: boolean
}

export default function PortfolioImageDisplay({
  image,
  className = '',
  onClick,
  priority = false,
}: PortfolioImageDisplayProps) {
  // Utiliser thumbnailUrl si disponible, sinon url
  const imageUrl = image.thumbnailUrl || image.url

  // Vérifier si l'URL est relative (commence par /) ou absolue
  const isRelativeUrl = imageUrl.startsWith('/')

  // Si l'URL est relative, elle sera servie depuis public/
  // Si elle est absolue, l'utiliser directement
  const src = isRelativeUrl ? imageUrl : imageUrl

  // Fallback si l'image ne se charge pas
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Erreur de chargement de l\'image:', image.url)
    // Optionnel : afficher une image placeholder
    const target = e.currentTarget
    target.style.display = 'none'
  }

  // Si width et height sont disponibles, utiliser Next.js Image pour optimisation
  if (image.width && image.height && isRelativeUrl) {
    try {
      return (
        <div className={`portfolio-image-wrapper ${className}`} onClick={onClick}>
          <Image
            src={src}
            alt={image.alt || image.title || 'Portfolio image'}
            width={image.width}
            height={image.height}
            className="portfolio-image"
            onError={handleError}
            priority={priority}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
          {image.title && (
            <div className="portfolio-image-overlay">
              <p className="portfolio-image-title">{image.title}</p>
            </div>
          )}
        </div>
      )
    } catch (error) {
      console.error('Erreur avec Next.js Image, fallback sur img:', error)
    }
  }

  // Fallback : utiliser img standard
  return (
    <div className={`portfolio-image-wrapper ${className}`} onClick={onClick}>
      <img
        src={src}
        alt={image.alt || image.title || 'Portfolio image'}
        className="portfolio-image"
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
      {image.title && (
        <div className="portfolio-image-overlay">
          <p className="portfolio-image-title">{image.title}</p>
        </div>
      )}
    </div>
  )
}

