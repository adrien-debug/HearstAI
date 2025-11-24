'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DASHBOARD',
    repo_type: 'NONE',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!imageFile) {
      setError('Veuillez ajouter une photo pour le projet')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('type', formData.type)
      formDataToSend.append('repo_type', formData.repo_type)
      formDataToSend.append('repo_branch', formData.repo_branch || 'main')
      
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
        throw new Error(errorData.error || 'Échec de la création du projet')
      }

      router.push('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la création du projet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: '1.3',
            marginBottom: 'var(--space-2)'
          }}>
            New Project
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-base)'
          }}>
            Create a new project with all necessary details
          </p>
        </div>

        <div style={{
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: 'var(--space-3)',
                background: 'rgba(255, 77, 77, 0.1)',
                border: '1px solid rgba(255, 77, 77, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#FF4D4D',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Project Photo *
              </label>
              <div style={{
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--duration-normal) var(--ease-in-out)',
              }}>
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)' }} />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      style={{
                        position: 'absolute',
                        top: 'var(--space-2)',
                        right: 'var(--space-2)',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        width: '32px',
                        height: '32px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      style={{ display: 'none' }}
                    />
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📷</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                        Cliquez pour ajouter une photo
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Format: JPG, PNG, WEBP (max 5MB)
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                }}
                placeholder="Mon Super Projet"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                  minHeight: '80px',
                  resize: 'vertical',
                }}
                placeholder="Décrivez votre projet..."
                rows={3}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Project Type *
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  paddingRight: '40px',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <option value="DASHBOARD">Dashboard</option>
                <option value="HTML_STATIC">HTML Statique</option>
                <option value="SPA">Application SPA</option>
                <option value="NODEJS_APP">Application Node.js</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{
                display: 'block',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Repository (Optional)
              </label>
              <select
                name="repo_type"
                value={formData.repo_type}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  paddingRight: '40px',
                  background: 'rgba(10, 10, 10, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <option value="NONE">Aucun repository</option>
                <option value="GITHUB">GitHub</option>
                <option value="LOCAL">Local</option>
              </select>
            </div>

            {formData.repo_type === 'GITHUB' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  GitHub URL (Optional)
                </label>
                <input
                  type="url"
                  name="repo_url"
                  value={formData.repo_url}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-primary)',
                    backdropFilter: 'blur(10px)',
                  }}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            )}

            {formData.repo_type === 'LOCAL' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Local Path (Optional)
                </label>
                <input
                  type="text"
                  name="local_path"
                  value={formData.local_path}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(10px)',
                  }}
                  placeholder="/chemin/vers/projet"
                />
              </div>
            )}

            {formData.repo_type !== 'NONE' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Branch (Optional)
                </label>
                <input
                  type="text"
                  name="repo_branch"
                  value={formData.repo_branch}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(10, 10, 10, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(10px)',
                  }}
                  placeholder="main"
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !imageFile}
                style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: loading || !imageFile ? 'var(--primary-grey)' : '#C5FFA7',
                  color: '#000000',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: loading || !imageFile ? 'not-allowed' : 'pointer',
                  transition: 'all var(--duration-normal) var(--ease-in-out)',
                  letterSpacing: '-0.01em',
                  boxShadow: '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && imageFile) {
                    e.currentTarget.style.background = '#B0FF8F'
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && imageFile) {
                    e.currentTarget.style.background = '#C5FFA7'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }
                }}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


