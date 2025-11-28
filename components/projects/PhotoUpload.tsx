'use client'

import { useState, useRef } from 'react'
import { projectsAPI } from '@/lib/api'
import './Projects.css'

interface PhotoUploadProps {
  projectId: string
  existingPhotos: string[]
  onPhotosUpdated: (photos: string[]) => void
}

export default function PhotoUpload({ projectId, existingPhotos, onPhotosUpdated }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const newPhotos: string[] = []

    try {
      // Convert files to base64 and add to metadata
      const filePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} n'est pas une image`))
            return
          }

          const reader = new FileReader()
          reader.onload = (e) => {
            const base64 = e.target?.result as string
            resolve(base64)
          }
          reader.onerror = () => reject(new Error(`Erreur lors de la lecture de ${file.name}`))
          reader.readAsDataURL(file)
        })
      })

      const base64Images = await Promise.all(filePromises)

      // Get current project to update metadata
      const projectResponse = await projectsAPI.getById(projectId)
      const project = projectResponse.project || projectResponse

      // Parse existing metadata
      let metadata: any = {}
      if (project.metadata) {
        try {
          metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
        } catch (e) {
          console.error('Error parsing metadata:', e)
        }
      }

      // Add new photos to metadata
      if (!metadata.photos) {
        metadata.photos = []
      }
      if (!metadata.additionalImages) {
        metadata.additionalImages = []
      }

      // Add base64 images to metadata
      const allNewPhotos = [...metadata.photos, ...metadata.additionalImages, ...base64Images]
      metadata.photos = allNewPhotos
      metadata.additionalImages = allNewPhotos

      // Update project with new metadata
      await projectsAPI.update(projectId, {
        metadata: JSON.stringify(metadata),
        imageUrl: base64Images[0] // Set first image as main image
      })

      // Update local state
      const updatedPhotos = [...existingPhotos, ...base64Images]
      onPhotosUpdated(updatedPhotos)
    } catch (error) {
      console.error('Error uploading photos:', error)
      alert(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="photo-upload-container">
      <div
        className={`photo-upload-dropzone ${dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div className="photo-upload-loading">
            <div className="photo-upload-spinner"></div>
            <p>Upload en cours...</p>
          </div>
        ) : (
          <div className="photo-upload-content">
            <div className="photo-upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="photo-upload-title">Ajouter des photos</h3>
            <p className="photo-upload-subtitle">
              Glissez-déposez vos images ici ou cliquez pour sélectionner
            </p>
            <p className="photo-upload-hint">
              Formats acceptés: JPG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>
      {existingPhotos.length > 0 && (
        <div className="photo-upload-info">
          <p>{existingPhotos.length} photo{existingPhotos.length > 1 ? 's' : ''} déjà ajoutée{existingPhotos.length > 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}


