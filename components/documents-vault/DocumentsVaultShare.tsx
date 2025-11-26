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
    // Load selected documents from localStorage
    const loadDocuments = () => {
      setAvailableDocuments(getDocumentsToSend())
    }
    loadDocuments()
    
    // Listen for changes
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
      alert('Please select documents and enter at least one recipient')
      return
    }
    // Simulate email send
    alert(`Sending ${availableDocuments.length} document(s) by email to ${emailRecipients}`)
  }

  const sendByWhatsApp = () => {
    if (!whatsappNumber || availableDocuments.length === 0) {
      alert('Please select documents and enter a WhatsApp number')
      return
    }
    const message = whatsappMessage || `Here are ${availableDocuments.length} shared document(s)`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const copyShareLink = () => {
    if (!shareLink) {
      generateShareLink()
    }
    navigator.clipboard.writeText(shareLink || generateShareLink())
    alert('Link copied to clipboard!')
  }


  const selectedDocs = availableDocuments

  return (
    <div>
      {/* Documents selected from all categories */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">
            Documents to send ({availableDocuments.length})
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {availableDocuments.length > 0 && (
              <button className="documents-btn-secondary" onClick={deselectAll}>
                Remove all
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
                    <th>Document name</th>
                    <th>Category</th>
                    <th>Client</th>
                    <th>Size</th>
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
                          Remove
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
              <p>No documents selected</p>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                Browse categories and check the documents you want to send
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share Method Selection */}
      <div className="documents-card">
        <div className="documents-card-header">
          <div className="documents-card-title">Share method</div>
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
              🔗 Share link
            </button>
          </div>

          {/* Email Form */}
          {shareMethod === 'email' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Recipients (comma-separated)</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="email1@example.com, email2@example.com"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Subject</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="Email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Message</label>
                <textarea
                  className="documents-input"
                  placeholder="Optional message"
                  rows={4}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) to send
                </div>
              </div>
              <button className="documents-btn" onClick={sendByEmail} disabled={availableDocuments.length === 0}>
                Send by email
              </button>
            </div>
          )}

          {/* WhatsApp Form */}
          {shareMethod === 'whatsapp' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">WhatsApp number (with country code)</label>
                <input
                  type="text"
                  className="documents-input"
                  placeholder="+33 6 12 34 56 78"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Message (optional)</label>
                <textarea
                  className="documents-input"
                  placeholder="Message to send with documents"
                  rows={3}
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-primary)' }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) to share
                </div>
              </div>
              <button className="documents-btn" onClick={sendByWhatsApp} disabled={availableDocuments.length === 0}>
                Open WhatsApp
              </button>
            </div>
          )}

          {/* Share Link */}
          {shareMethod === 'link' && (
            <div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="documents-label">Share link</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    className="documents-input"
                    value={shareLink || 'Click "Generate link" to create a share link'}
                    readOnly
                    style={{ flex: 1 }}
                  />
                  <button className="documents-btn-secondary" onClick={generateShareLink}>
                    Generate link
                  </button>
                  {shareLink && (
                    <button className="documents-btn" onClick={copyShareLink}>
                      Copy
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {availableDocuments.length} document(s) shared
                </div>
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'rgba(197, 255, 167, 0.05)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-4)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  💡 The share link allows access to selected documents. Share it with anyone you want.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

