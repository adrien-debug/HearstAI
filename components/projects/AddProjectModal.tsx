'use client'

import { useState } from 'react'
import { projectsAPI } from '@/lib/api'
import './Projects.css'

interface AddProjectModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddProjectModal({ onClose, onSuccess }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DASHBOARD',
    repo_type: 'GITHUB',
    repo_url: '',
    repo_branch: 'main',
    local_path: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      setImageFile(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('type', formData.type)
      formDataToSend.append('repo_type', formData.repo_type)
      formDataToSend.append('repo_branch', formData.repo_branch)
      
      if (formData.repo_type === 'GITHUB' && formData.repo_url) {
        formDataToSend.append('repo_url', formData.repo_url)
      }
      
      if (formData.repo_type === 'LOCAL' && formData.local_path) {
        formDataToSend.append('local_path', formData.local_path)
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="projects-modal-overlay" onClick={onClose}>
      <div className="projects-modal" onClick={(e) => e.stopPropagation()}>
        <div className="projects-modal-header">
          <h2 className="projects-modal-title">Add New Project</h2>
          <button className="projects-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="projects-modal-form">
          {error && (
            <div className="projects-modal-error">
              {error}
            </div>
          )}

          {/* Project Image Upload */}
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
          </div>

          {/* Project Name */}
          <div className="projects-form-group">
            <label className="projects-form-label" htmlFor="name">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="projects-form-input"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="My Project"
            />
          </div>

          {/* Description */}
          <div className="projects-form-group">
            <label className="projects-form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="projects-form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description..."
              rows={3}
            />
          </div>

          {/* Project Type */}
          <div className="projects-form-group">
            <label className="projects-form-label" htmlFor="type">
              Project Type *
            </label>
            <select
              id="type"
              name="type"
              className="projects-form-select"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="DASHBOARD">Dashboard</option>
              <option value="HTML_STATIC">HTML Static</option>
              <option value="SPA">SPA</option>
              <option value="NODEJS_APP">Node.js App</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Repository Type */}
          <div className="projects-form-group">
            <label className="projects-form-label" htmlFor="repo_type">
              Repository Type *
            </label>
            <select
              id="repo_type"
              name="repo_type"
              className="projects-form-select"
              value={formData.repo_type}
              onChange={handleInputChange}
              required
            >
              <option value="GITHUB">GitHub</option>
              <option value="LOCAL">Local</option>
            </select>
          </div>

          {/* GitHub Repository URL */}
          {formData.repo_type === 'GITHUB' && (
            <div className="projects-form-group">
              <label className="projects-form-label" htmlFor="repo_url">
                Repository URL
              </label>
              <input
                type="url"
                id="repo_url"
                name="repo_url"
                className="projects-form-input"
                value={formData.repo_url}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
              />
            </div>
          )}

          {/* Local Path */}
          {formData.repo_type === 'LOCAL' && (
            <div className="projects-form-group">
              <label className="projects-form-label" htmlFor="local_path">
                Local Path
              </label>
              <input
                type="text"
                id="local_path"
                name="local_path"
                className="projects-form-input"
                value={formData.local_path}
                onChange={handleInputChange}
                placeholder="/path/to/project"
              />
            </div>
          )}

          {/* Repository Branch */}
          <div className="projects-form-group">
            <label className="projects-form-label" htmlFor="repo_branch">
              Branch
            </label>
            <input
              type="text"
              id="repo_branch"
              name="repo_branch"
              className="projects-form-input"
              value={formData.repo_branch}
              onChange={handleInputChange}
              placeholder="main"
            />
          </div>

          {/* Form Actions */}
          <div className="projects-modal-actions">
            <button
              type="button"
              className="projects-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="projects-btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


