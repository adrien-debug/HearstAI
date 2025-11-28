'use client'

import { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import '@/components/home/Home.css'
import './HosterDataPage.css'

interface Hoster {
  id: string
  name: string
  country: string // Pays
  location: string // Localisation précise
  electricityPrice: number // $/kWh
  additionalFees: number // USD/mois
  deposit: number // Nombre de mois de dépôt
  photo?: string // URL de la photo (base64 ou URL)
  notes?: string
}

export default function HosterDataPage() {
  const [hosters, setHosters] = useState<Hoster[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [activeCountry, setActiveCountry] = useState<string>('all')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Partial<Hoster>>({
    name: '',
    country: '',
    location: '',
    electricityPrice: 0,
    additionalFees: 0,
    deposit: 0,
    notes: '',
  })

  // Liste complète des pays disponibles (ordre alphabétique)
  const countries = [
    'Afghanistan',
    'Afrique du Sud',
    'Albanie',
    'Algérie',
    'Allemagne',
    'Andorre',
    'Angola',
    'Antigua-et-Barbuda',
    'Arabie Saoudite',
    'Argentine',
    'Arménie',
    'Australie',
    'Autriche',
    'Azerbaïdjan',
    'Bahamas',
    'Bahreïn',
    'Bangladesh',
    'Barbade',
    'Belgique',
    'Belize',
    'Bénin',
    'Bhoutan',
    'Biélorussie',
    'Birmanie',
    'Bolivie',
    'Bosnie-Herzégovine',
    'Botswana',
    'Brésil',
    'Brunei',
    'Bulgarie',
    'Burkina Faso',
    'Burundi',
    'Cambodge',
    'Cameroun',
    'Canada',
    'Cap-Vert',
    'Chili',
    'Chine',
    'Chypre',
    'Colombie',
    'Comores',
    'Congo',
    'Corée du Nord',
    'Corée du Sud',
    'Costa Rica',
    'Côte d\'Ivoire',
    'Croatie',
    'Cuba',
    'Danemark',
    'Djibouti',
    'Dominique',
    'Égypte',
    'Émirats arabes unis',
    'Équateur',
    'Érythrée',
    'Espagne',
    'Estonie',
    'Eswatini',
    'États-Unis',
    'Éthiopie',
    'Fidji',
    'Finlande',
    'France',
    'Gabon',
    'Gambie',
    'Géorgie',
    'Ghana',
    'Grèce',
    'Grenade',
    'Guatemala',
    'Guinée',
    'Guinée-Bissau',
    'Guinée équatoriale',
    'Guyana',
    'Haïti',
    'Honduras',
    'Hongrie',
    'Inde',
    'Indonésie',
    'Irak',
    'Iran',
    'Irlande',
    'Islande',
    'Israël',
    'Italie',
    'Jamaïque',
    'Japon',
    'Jordanie',
    'Kazakhstan',
    'Kenya',
    'Kirghizistan',
    'Kiribati',
    'Koweït',
    'Laos',
    'Lesotho',
    'Lettonie',
    'Liban',
    'Liberia',
    'Libye',
    'Liechtenstein',
    'Lituanie',
    'Luxembourg',
    'Macédoine du Nord',
    'Madagascar',
    'Malaisie',
    'Malawi',
    'Maldives',
    'Mali',
    'Malte',
    'Maroc',
    'Marshall',
    'Maurice',
    'Mauritanie',
    'Mexique',
    'Micronésie',
    'Moldavie',
    'Monaco',
    'Mongolie',
    'Monténégro',
    'Mozambique',
    'Namibie',
    'Nauru',
    'Népal',
    'Nicaragua',
    'Niger',
    'Nigéria',
    'Norvège',
    'Nouvelle-Zélande',
    'Oman',
    'Ouganda',
    'Ouzbékistan',
    'Pakistan',
    'Palaos',
    'Palestine',
    'Panama',
    'Papouasie-Nouvelle-Guinée',
    'Paraguay',
    'Pays-Bas',
    'Pérou',
    'Philippines',
    'Pologne',
    'Portugal',
    'Qatar',
    'Roumanie',
    'Royaume-Uni',
    'Russie',
    'Rwanda',
    'Saint-Christophe-et-Niévès',
    'Saint-Marin',
    'Saint-Vincent-et-les-Grenadines',
    'Sainte-Lucie',
    'Salomon',
    'Salvador',
    'Samoa',
    'São Tomé-et-Príncipe',
    'Sénégal',
    'Serbie',
    'Seychelles',
    'Sierra Leone',
    'Singapour',
    'Slovaquie',
    'Slovénie',
    'Somalie',
    'Soudan',
    'Soudan du Sud',
    'Sri Lanka',
    'Suède',
    'Suisse',
    'Suriname',
    'Syrie',
    'Tadjikistan',
    'Tanzanie',
    'Tchad',
    'Tchéquie',
    'Thaïlande',
    'Timor oriental',
    'Togo',
    'Tonga',
    'Trinité-et-Tobago',
    'Tunisie',
    'Turkménistan',
    'Turquie',
    'Tuvalu',
    'Ukraine',
    'Uruguay',
    'Vanuatu',
    'Vatican',
    'Venezuela',
    'Viêt Nam',
    'Yémen',
    'Zambie',
    'Zimbabwe',
  ]

  // Charger les données depuis l'API Railway
  useEffect(() => {
    const loadHosters = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/hosters`
          : '/api/datas/hosters'
        
        const response = await fetch(baseUrl)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Convertir les données Railway au format frontend
            const formattedHosters = result.data.map((h: any) => ({
              id: h.id.toString(),
              name: h.name,
              country: h.country,
              location: h.location,
              electricityPrice: parseFloat(h.electricity_price || h.electricityPrice || 0),
              additionalFees: parseFloat(h.additional_fees || h.additionalFees || 0),
              deposit: parseFloat(h.deposit || 0),
              photo: h.photo || null,
              notes: h.notes || '',
            }))
            setHosters(formattedHosters)
            // Sauvegarder aussi dans localStorage comme backup (sans photos)
            try {
              const hostersWithoutPhotos = formattedHosters.map((h: Hoster) => ({ ...h, photo: null }))
              localStorage.setItem('hosters-data', JSON.stringify(hostersWithoutPhotos))
            } catch (error: any) {
              if (error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, skipping backup save.')
              }
            }
          }
        } else {
          console.error('Failed to load hosters from API')
          // Fallback sur localStorage si l'API échoue
          const savedHosters = localStorage.getItem('hosters-data')
          if (savedHosters) {
            try {
              setHosters(JSON.parse(savedHosters))
            } catch (error) {
              console.error('Error loading hosters from localStorage:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error loading hosters:', error)
        // Fallback sur localStorage
        const savedHosters = localStorage.getItem('hosters-data')
        if (savedHosters) {
          try {
            setHosters(JSON.parse(savedHosters))
          } catch (e) {
            console.error('Error loading hosters from localStorage:', e)
          }
        }
      }
    }
    
    loadHosters()
  }, [])

  // Sauvegarder dans localStorage (sans photos pour éviter QuotaExceededError)
  const saveHosters = (newHosters: Hoster[]) => {
    setHosters(newHosters)
    try {
      // Sauvegarder seulement les données sans photos pour éviter de dépasser la limite
      const hostersWithoutPhotos = newHosters.map((h: Hoster) => ({
        ...h,
        photo: null // Ne pas sauvegarder les photos en base64 dans localStorage
      }))
      localStorage.setItem('hosters-data', JSON.stringify(hostersWithoutPhotos))
    } catch (error: any) {
      // Si localStorage est plein, on ignore l'erreur (l'API est la source principale)
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, skipping backup save. API is the primary source.')
      } else {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  // Construire la liste des tabs avec tous les pays (pas seulement ceux avec hosters)
  const countryTabs = [
    { id: 'all', label: 'Tous' },
    ...countries.map(country => ({ id: country, label: country }))
  ]

  const handleAdd = () => {
    setIsAdding(true)
    setImagePreview(null)
    setImageFile(null)
    setFormData({
      name: '',
      country: '',
      location: '',
      electricityPrice: 0,
      additionalFees: 0,
      deposit: 0,
      notes: '',
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image doit être inférieure à 5MB')
        return
      }
      
      setImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData({ ...formData, photo: undefined })
  }

  const handleEdit = (hoster: Hoster) => {
    setIsEditing(hoster.id)
    setFormData(hoster)
    setImagePreview(hoster.photo || null)
    setImageFile(null)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce hoster ?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/hosters`
          : '/api/datas/hosters'
        
        const response = await fetch(`${baseUrl}/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Recharger les données depuis l'API
          const loadResponse = await fetch(baseUrl)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success && loadResult.data) {
              const formattedHosters = loadResult.data.map((h: any) => ({
                id: h.id.toString(),
                name: h.name,
                country: h.country,
                location: h.location,
                electricityPrice: parseFloat(h.electricity_price || h.electricityPrice || 0),
                additionalFees: parseFloat(h.additional_fees || h.additionalFees || 0),
                deposit: parseFloat(h.deposit || 0),
                photo: h.photo || null,
                notes: h.notes || '',
              }))
              setHosters(formattedHosters)
              // Sauvegarder dans localStorage sans photos
              try {
                const hostersWithoutPhotos = formattedHosters.map((h: Hoster) => ({ ...h, photo: null }))
                localStorage.setItem('hosters-data', JSON.stringify(hostersWithoutPhotos))
              } catch (error: any) {
                if (error.name === 'QuotaExceededError') {
                  console.warn('localStorage quota exceeded, skipping backup save.')
                }
              }
            }
          }
        } else {
          throw new Error('Failed to delete hoster')
        }
      } catch (error) {
        console.error('Error deleting hoster:', error)
        // Fallback: supprimer localement
        const newHosters = hosters.filter(h => h.id !== id)
        saveHosters(newHosters)
      }
    }
  }

  const handleSave = async () => {
    // Validation améliorée - permettre 0 comme valeur valide
    const nameValid = formData.name && formData.name.trim() !== ''
    const countryValid = formData.country && formData.country.trim() !== ''
    const locationValid = formData.location && formData.location.trim() !== ''
    const electricityPriceValid = formData.electricityPrice !== undefined && formData.electricityPrice !== null && !isNaN(formData.electricityPrice)
    const additionalFeesValid = formData.additionalFees !== undefined && formData.additionalFees !== null && !isNaN(formData.additionalFees)
    const depositValid = formData.deposit !== undefined && formData.deposit !== null && !isNaN(formData.deposit)
    
    if (!nameValid || !countryValid || !locationValid || !electricityPriceValid || !additionalFeesValid || !depositValid) {
      console.log('Validation failed:', {
        name: nameValid,
        country: countryValid,
        location: locationValid,
        electricityPrice: electricityPriceValid,
        additionalFees: additionalFeesValid,
        deposit: depositValid,
        formData
      })
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const photoData = imagePreview || formData.photo
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const baseUrl = apiUrl && apiUrl.startsWith('http') 
      ? `${apiUrl}/api/datas/hosters`
      : '/api/datas/hosters'

    try {
      if (isEditing) {
        // Modifier via API
        const response = await fetch(`${baseUrl}/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            country: formData.country,
            location: formData.location,
            electricityPrice: formData.electricityPrice,
            additionalFees: formData.additionalFees,
            deposit: formData.deposit,
            photo: photoData,
            notes: formData.notes,
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Recharger les données depuis l'API
            const loadResponse = await fetch(baseUrl)
            if (loadResponse.ok) {
              const loadResult = await loadResponse.json()
              if (loadResult.success && loadResult.data) {
                const formattedHosters = loadResult.data.map((h: any) => ({
                  id: h.id.toString(),
                  name: h.name,
                  country: h.country,
                  location: h.location,
                  electricityPrice: parseFloat(h.electricity_price || h.electricityPrice || 0),
                  additionalFees: parseFloat(h.additional_fees || h.additionalFees || 0),
                  deposit: parseFloat(h.deposit || 0),
                  photo: h.photo || null,
                  notes: h.notes || '',
                }))
                setHosters(formattedHosters)
                localStorage.setItem('hosters-data', JSON.stringify(formattedHosters))
              }
            }
            setIsEditing(null)
          }
        } else {
          throw new Error('Failed to update hoster')
        }
      } else if (isAdding) {
        // Ajouter via API
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            country: formData.country,
            location: formData.location,
            electricityPrice: formData.electricityPrice,
            additionalFees: formData.additionalFees,
            deposit: formData.deposit,
            photo: photoData,
            notes: formData.notes,
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Recharger les données depuis l'API
            const loadResponse = await fetch(baseUrl)
            if (loadResponse.ok) {
              const loadResult = await loadResponse.json()
              if (loadResult.success && loadResult.data) {
                const formattedHosters = loadResult.data.map((h: any) => ({
                  id: h.id.toString(),
                  name: h.name,
                  country: h.country,
                  location: h.location,
                  electricityPrice: parseFloat(h.electricity_price || h.electricityPrice || 0),
                  additionalFees: parseFloat(h.additional_fees || h.additionalFees || 0),
                  deposit: parseFloat(h.deposit || 0),
                  photo: h.photo || null,
                  notes: h.notes || '',
                }))
                setHosters(formattedHosters)
                localStorage.setItem('hosters-data', JSON.stringify(formattedHosters))
              }
            }
            setIsAdding(false)
          }
        } else {
          throw new Error('Failed to create hoster')
        }
      }

      // Réinitialiser le formulaire
      setImagePreview(null)
      setImageFile(null)
      setFormData({
        name: '',
        country: '',
        location: '',
        electricityPrice: 0,
        additionalFees: 0,
        deposit: 0,
        notes: '',
      })
    } catch (error) {
      console.error('Error saving hoster:', error)
      alert('Erreur lors de la sauvegarde. Vérifiez la console pour plus de détails.')
    }
  }

  const handleCancel = () => {
    setIsEditing(null)
    setIsAdding(false)
    setImagePreview(null)
    setImageFile(null)
    setFormData({
      name: '',
      country: '',
      location: '',
      electricityPrice: 0,
      additionalFees: 0,
      deposit: 0,
      notes: '',
    })
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  }

  // Filtrer les hosters selon le pays sélectionné
  const filteredHosters = activeCountry === 'all' 
    ? hosters 
    : hosters.filter(h => h.country === activeCountry)
  
  // Compter les hosters par pays pour afficher dans les tabs
  const getHostersCount = (countryId: string) => {
    if (countryId === 'all') return hosters.length
    return hosters.filter(h => h.country === countryId).length
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Page Title */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            marginBottom: 'var(--space-4)'
          }}>
            Données Hosters
          </h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Gérez toutes les données des hosters de mining
          </p>
          
          {/* Navigation tabs - Countries */}
          <nav className="hoster-nav-tabs" style={{ marginTop: 'var(--space-4)' }}>
            {countryTabs.map((tab) => {
              const count = getHostersCount(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCountry(tab.id)}
                  className={`hoster-nav-tab ${activeCountry === tab.id ? 'active' : ''} ${count === 0 ? 'hoster-nav-tab-empty' : ''}`}
                >
                  {tab.label}
                  {count > 0 && <span className="hoster-nav-tab-count">({count})</span>}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bouton Ajouter */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <button
            onClick={handleAdd}
            className="hoster-data-add-btn"
            disabled={isAdding || isEditing !== null}
          >
            <Icon name="server" />
            <span>Ajouter un Hoster</span>
          </button>
        </div>

        {/* Formulaire d'ajout/modification */}
        {(isAdding || isEditing) && (
          <div className="hoster-data-form-card">
            <div className="hoster-data-form-header">
              <h3>{isEditing ? 'Modifier le Hoster' : 'Nouveau Hoster'}</h3>
              <div className="hoster-data-form-actions">
                <button onClick={handleSave} className="hoster-data-save-btn">
                  Enregistrer
                </button>
                <button onClick={handleCancel} className="hoster-data-cancel-btn">
                  Annuler
                </button>
              </div>
            </div>
            
            {/* Section Photo - Pleine largeur en haut */}
            <div className="hoster-data-photo-section">
              <label className="hoster-data-photo-label">Photo du Hoster</label>
              <div className="hoster-data-photo-upload">
                {imagePreview ? (
                  <div className="hoster-data-photo-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button"
                      className="hoster-data-photo-remove"
                      onClick={handleRemoveImage}
                      title="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="hoster-data-photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="hoster-data-photo-upload-placeholder">
                      <div className="hoster-data-photo-icon">📷</div>
                      <div className="hoster-data-photo-text">
                        <span className="hoster-data-photo-text-main">Cliquez pour ajouter une photo</span>
                        <span className="hoster-data-photo-text-sub">JPG, PNG, WEBP (max 5MB)</span>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Section Informations principales */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Informations principales</h4>
              <div className="hoster-data-form-grid">
                <div className="hoster-data-form-group">
                  <label>Nom du Hoster *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Bitmain Hosting"
                  />
                </div>

                <div className="hoster-data-form-group">
                  <label>Pays *</label>
                  <select
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="">Sélectionner un pays</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="hoster-data-form-group hoster-data-form-group-full">
                  <label>Localisation *</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Texas, USA"
                  />
                </div>
              </div>
            </div>

            {/* Section Coûts */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Coûts et conditions</h4>
              <div className="hoster-data-form-grid">
                <div className="hoster-data-form-group">
                  <label>Prix Électricité ($/kWh) *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.electricityPrice !== undefined && formData.electricityPrice !== null ? formData.electricityPrice : ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
                      setFormData({ ...formData, electricityPrice: value !== undefined && !isNaN(value) ? value : undefined })
                    }}
                    placeholder="Ex: 0.05"
                  />
                </div>

                <div className="hoster-data-form-group">
                  <label>Frais Supplémentaires (USD/mois) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.additionalFees !== undefined && formData.additionalFees !== null ? formData.additionalFees : ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
                      setFormData({ ...formData, additionalFees: value !== undefined && !isNaN(value) ? value : undefined })
                    }}
                    placeholder="Ex: 50"
                  />
                </div>

                <div className="hoster-data-form-group">
                  <label>Dépôt (nombre de mois) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.deposit !== undefined && formData.deposit !== null ? formData.deposit : ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value)
                      setFormData({ ...formData, deposit: value !== undefined && !isNaN(value) ? value : undefined })
                    }}
                    placeholder="Ex: 3"
                  />
                </div>
              </div>
            </div>

            {/* Section Notes */}
            <div className="hoster-data-form-section">
              <h4 className="hoster-data-form-section-title">Notes supplémentaires</h4>
              <div className="hoster-data-form-group hoster-data-form-group-full">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ajoutez des notes ou informations complémentaires..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Liste des Hosters */}
        <div className="hoster-data-list-section">
          <div className="premium-section-header">
            <h3 className="premium-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="premium-stat-icon">
                  <Icon name="server" />
                </div>
                <span>Hosters Enregistrés ({filteredHosters.length}{activeCountry !== 'all' ? ` / ${hosters.length}` : ''})</span>
              </div>
            </h3>
          </div>

          {filteredHosters.length === 0 ? (
            <div className="hoster-data-empty">
              <div className="calculator-empty-icon">
                <Icon name="server" />
              </div>
              <div className="calculator-empty-text">
                Aucun hoster enregistré. Cliquez sur "Ajouter un Hoster" pour commencer.
              </div>
            </div>
          ) : (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Photo</th>
                    <th>Nom</th>
                    <th>Pays</th>
                    <th>Localisation</th>
                    <th>Prix Électricité</th>
                    <th>Frais Supplémentaires</th>
                    <th>Dépôt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHosters.map((hoster) => (
                    <tr key={hoster.id}>
                      <td>
                        {hoster.photo ? (
                          <div className="hoster-table-photo">
                            <img src={hoster.photo} alt={hoster.name} />
                          </div>
                        ) : (
                          <div className="hoster-table-photo-placeholder">
                            <Icon name="server" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 'var(--font-semibold)', textAlign: 'center' }}>{hoster.name}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span className="hoster-country-badge">
                            {hoster.country}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{hoster.location}</td>
                      <td className="premium-transaction-amount" style={{ textAlign: 'center' }}>${formatNumber(hoster.electricityPrice, 3)}/kWh</td>
                      <td className="premium-transaction-amount" style={{ textAlign: 'center' }}>${formatNumber(hoster.additionalFees, 2)}/mois</td>
                      <td style={{ textAlign: 'center' }}>{hoster.deposit} mois</td>
                      <td>
                        <div className="hoster-data-actions">
                          <button
                            onClick={() => handleEdit(hoster)}
                            className="hoster-data-action-btn hoster-data-edit-btn"
                            disabled={isAdding || isEditing !== null}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(hoster.id)}
                            className="hoster-data-action-btn hoster-data-delete-btn"
                            disabled={isAdding || isEditing !== null}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

