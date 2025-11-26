'use client'

import { useState, useEffect } from 'react'
import { getDocumentsToSend, removeDocumentFromSend, clearDocumentsToSend, type DocumentToSend } from '@/lib/documents-selection'

export default function DocumentsVaultShare() {
  const [availableDocuments, setAvailableDocuments] = useState<DocumentToSend[]>([])
  const [shareMethod, setShareMethod] = useState<'email' | 'whatsapp' | 'link'>('email')
  const [emailRecipients, setEmailRecipients] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    // Charger les documents sélectionnés depuis localStorage
    const loadDocuments = () => {
      setAvailableDocuments(getDocumentsToSend())
    }
    loadDocuments()
    
    // Écouter les changements
    window.addEventListener('documents-selection-changed', loadDocuments)
    return () => window.removeEventListener('documents-selection-changed', loadDocuments)
  }, [])

  const toggleDocumentSelection = (id: string) => {
    removeDocumentFromSend(id)
  }

  const selectAll = () => {
    // Tous sont déjà sélectionnés (venant de localStorage)
  }

  const deselectAll = () => {
    clearDocumentsToSend()
  }

  const generateShareLink = () => {
    const link = `https://hearst.ai/documents/share/${Date.now()}`
    setShareLink(link)
    return link
  }

  const sendByEmail = () => {
    if (!emailRecipients || availableDocuments.length === 0) {
      alert('Veuillez sélectionner des documents et entrer au moins un destinataire')
      return
    }
    // Simulate email send
    alert(`Envoi de ${availableDocuments.length} document(s) par email à ${emailRecipients}`)
  }

  const sendByWhatsApp = () => {
    if (!whatsappNumber || availableDocuments.length === 0) {
      alert('Veuillez sélectionner des documents et entrer un numéro WhatsApp')
      return
    }
    const message = whatsappMessage || `Voici ${availableDocuments.length} document(s) partagé(s)`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const copyShareLink = () => {
    if (!shareLink) {
      generateShareLink()
    }
    navigator.clipboard.writeText(shareLink || generateShareLink())
    alert('Lien copié dans le presse-papiers!')
  }


  const selectedDocs = availableDocuments

  return (
    <div>
      {/* Documents sélectionnés depuis toutes les catégories */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">
            Documents à envoyer ({availableDocuments.length})
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {availableDocuments.length > 0 && (
              <button className="documents-btn-secondary" onClick={deselectAll}>
                Tout retirer
              </button>
            )}
          </div>
        </div>
        <div className="documents-card-body">
          {availableDocuments.length > 0 ? (
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th>Nom du document</th>
                    <th>Catégorie</th>
                    <th>Client</th>
                    <th>Taille</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availableDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                        {doc.name}
                      </td>
                      <td><span className="documents-badge documents-badge-info">{doc.category}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.client || '-'}</td>
                      <td className="premium-transaction-amount">{doc.size}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.uploaded}</td>
                      <td>
                        <button
                          className="documents-btn-secondary"
                          onClick={() => toggleDocumentSelection(doc.id)}
                          style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}
                        >
                          Retirer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <p>Aucun document sélectionné</p>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                Naviguez dans les catégories et cochez les documents que vous souhaitez envoyer
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share Method Selection */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Méthode de partage</div>
        </div>
        <div className="documents-card-body">
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button
              className={shareMethod === 'email' ? 'documents-btn' : 'documents-btn-secondary'}
              onClick={() => setShareMethod('email')}
            >
              📧 Email
            </button>
            <button
              className={shareMethod === 'whatsapp' ? 'documents-btn' : 'documents-btn-secondary'}
              onClick={() => setShareMethod('whatsapp')}
            >
              💬 WhatsApp
            </button>
            <button
              className={shareMethod === 'link' ? 'documents-btn' : 'documents-btn-secondary'}
              onClick={() => setShareMethod('link')}
            >
              🔗 Lien de partage
            </button>
          </div>

          {/* Email Form */}
          {shareMethod === 'email' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Destinataires (séparés par des virgules)</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="email1@example.com, email2@example.com"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Sujet</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="Sujet de l'email"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Message</label>
                <textarea
                  className="documents-input"
                  placeholder="Message optionnel"
                  rows={4}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) à envoyer
                </div>
              </div>
              <button className="documents-btn" onClick={sendByEmail} disabled={availableDocuments.length === 0}>
                Envoyer par email
              </button>
            </div>
          )}

          {/* WhatsApp Form */}
          {shareMethod === 'whatsapp' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Numéro WhatsApp (avec indicatif pays)</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="+33 6 12 34 56 78"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Message (optionnel)</label>
                <textarea
                  className="documents-input"
                  placeholder="Message à envoyer avec les documents"
                  rows={3}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) à partager
                </div>
              </div>
              <button className="documents-btn" onClick={sendByWhatsApp} disabled={availableDocuments.length === 0}>
                Ouvrir WhatsApp
              </button>
            </div>
          )}

          {/* Share Link */}
          {shareMethod === 'link' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Lien de partage</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    className="documents-input"
                    value={shareLink || 'Cliquez sur "Générer le lien" pour créer un lien de partage'}
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <button className="documents-btn-secondary" onClick={generateShareLink}>
                    Générer le lien
                  </button>
                  {shareLink && (
                    <button className="documents-btn" onClick={copyShareLink}>
                      Copier
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) partagé(s)
                </div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-4)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  💡 Le lien de partage permet d'accéder aux documents sélectionnés. Partagez-le avec qui vous voulez.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

