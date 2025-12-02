'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'
import './Projects.css'

interface Project {
  id: string
  name: string
  description?: string
  type: string
  repoType: string
  status: string
  repoUrl?: string
  repoBranch?: string
  localPath?: string
  imageUrl?: string | null
}

interface EditProjectModalProps {
  project: Project
  onClose: () => void
  onSuccess: () => void
}

export default function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    type: project.type,
    repo_type: project.repoType,
    repo_url: project.repoUrl || '',
    repo_branch: project.repoBranch || 'main',
    local_path: project.localPath || '',
    status: project.status,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(project.imageUrl || null)
  const [imageUrl, setImageUrl] = useState<string>(project.imageUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image doit être inférieure à 5MB')
        return
      }
      
      setImageFile(file)
      setError(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setImagePreview(url || null)
    setImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Préparer les données de mise à jour
      const updateData: any = {
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
      }

      // Gérer l'image (fichier uploadé ou URL)
      if (imageFile) {
        // Si une nouvelle image est uploadée, utiliser FormData
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('description', formData.description || '')
        formDataToSend.append('status', formData.status)
        formDataToSend.append('image', imageFile)

        // For file uploads, we need to use fetch directly with the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        
        const headers: HeadersInit = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const response = await fetch(`${backendUrl}/api/projects/${project.id}`, {
          method: 'PUT',
          headers,
          body: formDataToSend,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Échec de la mise à jour du projet')
        }
      } else {
        // Mise à jour via API standard avec metadata pour l'image URL
        if (imageUrl !== (project.imageUrl || '')) {
          const metadata = {
            imageUrl: imageUrl || null,
          }
          updateData.metadata = JSON.stringify(metadata)
        }

        // Use projectsAPI helper
        await projectsAPI.update(project.id, updateData)
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la mise à jour du projet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="projects-modal-overlay" onClick={onClose}>
      <div className="projects-modal" onClick={(e) => e.stopPropagation()}>
        <div className="projects-modal-header">
          <h2 className="projects-modal-title">Edit Project</h2>
          <button className="projects-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="projects-modal-form">
          {error && (
            <div className="projects-modal-error">
              {error}
            </div>
          )}

          {/* Project Image */}
          <div className="projects-form-group">
            <label className="projects-form-label">Project Image</label>
            <div className="projects-image-upload">
              {imagePreview ? (
                <div className="projects-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button"
                    className="projects-image-remove"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setImageUrl('')
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="projects-image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div className="projects-image-upload-placeholder">
                    <span>+</span>
                    <span>Upload Image</span>
                  </div>
                </label>
              )}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Ou entrez une URL d'image"
              style={{
                width: '100%',
                marginTop: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'rgba(10, 10, 10, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
              }}
            />
          </div>

          {/* Project Name */}
          <div className="projects-form-group">
            <label className="projects-form-label">Project Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="projects-form-input"
              placeholder="Mon Super Projet"
            />
          </div>

          {/* Description */}
          <div className="projects-form-group">
            <label className="projects-form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="projects-form-input"
              placeholder="Décrivez votre projet..."
              rows={3}
            />
          </div>

          {/* Project Type */}
          <div className="projects-form-group">
            <label className="projects-form-label">Project Type *</label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className="projects-form-input"
            >
              <option value="DASHBOARD">Dashboard</option>
              <option value="HTML_STATIC">HTML Statique</option>
              <option value="SPA">Application SPA</option>
              <option value="NODEJS_APP">Application Node.js</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          {/* Status */}
          <div className="projects-form-group">
            <label className="projects-form-label">Status *</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
              className="projects-form-input"
            >
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>

          {/* Repository Type */}
          <div className="projects-form-group">
            <label className="projects-form-label">Repository Type</label>
            <select
              name="repo_type"
              value={formData.repo_type}
              onChange={handleInputChange}
              className="projects-form-input"
            >
              <option value="NONE">Aucun repository</option>
              <option value="GITHUB">GitHub</option>
              <option value="LOCAL">Local</option>
            </select>
          </div>

          {formData.repo_type === 'GITHUB' && (
            <div className="projects-form-group">
              <label className="projects-form-label">GitHub URL</label>
              <input
                type="url"
                name="repo_url"
                value={formData.repo_url}
                onChange={handleInputChange}
                className="projects-form-input"
                placeholder="https://github.com/username/repo"
              />
            </div>
          )}

          {formData.repo_type === 'LOCAL' && (
            <div className="projects-form-group">
              <label className="projects-form-label">Local Path</label>
              <input
                type="text"
                name="local_path"
                value={formData.local_path}
                onChange={handleInputChange}
                className="projects-form-input"
                placeholder="/chemin/vers/projet"
              />
            </div>
          )}

          {formData.repo_type !== 'NONE' && (
            <div className="projects-form-group">
              <label className="projects-form-label">Branch</label>
              <input
                type="text"
                name="repo_branch"
                value={formData.repo_branch}
                onChange={handleInputChange}
                className="projects-form-input"
                placeholder="main"
              />
            </div>
          )}

          <div className="projects-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="projects-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="projects-btn-primary"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

