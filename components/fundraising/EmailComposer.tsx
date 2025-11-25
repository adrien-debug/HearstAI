'use client'

import { Investor, EmailInteraction, Document } from '@/types/fundraising'
import { useState } from 'react'

interface EmailComposerProps {
  investor: Investor
  onEmailSent: (interaction: EmailInteraction) => void
}

export default function EmailComposer({ investor, onEmailSent }: EmailComposerProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [emailTemplate, setEmailTemplate] = useState<string>('')

  const templates = [
    {
      name: 'Premier Contact',
      subject: 'Introduction - HearstAI',
      body: `Bonjour ${investor.firstName},

J'espère que cette email vous trouvera en bonne santé.

Je me permets de vous contacter au sujet de HearstAI, une plateforme innovante d'intelligence minière. Nous sommes actuellement en phase de levée de fonds et recherchons des investisseurs stratégiques pour nous accompagner dans notre croissance.

Seriez-vous disponible pour un échange dans les prochaines semaines ?

Cordialement,
[Votre nom]`
    },
    {
      name: 'Envoi Pitch Deck',
      subject: 'Pitch Deck HearstAI - Opportunité d\'investissement',
      body: `Bonjour ${investor.firstName},

Comme discuté, je vous envoie notre Pitch Deck complet qui présente en détail notre vision, notre modèle économique et nos projections de croissance.

Je reste à votre disposition pour toute question ou pour organiser un call de suivi.

Cordialement,
[Votre nom]`
    },
    {
      name: 'Suivi Meeting',
      subject: 'Suite à notre échange - HearstAI',
      body: `Bonjour ${investor.firstName},

Je vous remercie pour le temps que vous nous avez accordé lors de notre réunion. J'espère que notre présentation vous aura donné une vision claire de notre projet.

Comme convenu, je vous joins les documents supplémentaires que nous avons évoqués.

N'hésitez pas si vous avez des questions supplémentaires.

Cordialement,
[Votre nom]`
    },
  ]

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSubject(template.subject)
    setBody(template.body)
    setEmailTemplate(template.name)
  }

  const handleToggleDocument = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Veuillez remplir le sujet et le corps de l\'email')
      return
    }

    setIsSending(true)

    // Simuler l'envoi d'email (dans un vrai projet, cela ferait appel à une API)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const interaction: EmailInteraction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      subject,
      body,
      sentAt: new Date().toISOString(),
      attachments: selectedDocuments,
      status: 'sent',
    }

    onEmailSent(interaction)

    // Réinitialiser le formulaire
    setSubject('')
    setBody('')
    setSelectedDocuments([])
    setEmailTemplate('')
    setIsSending(false)

    alert('Email envoyé avec succès !')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const documents = investor.documents || []
  const recentInteractions = investor.interactions
    ?.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 3) || []

  return (
    <div className="fundraising-email-container">
      <div className="fundraising-email-header">
        <div>
          <h2>Envoyer un Email - {investor.firstName} {investor.lastName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Composez et envoyez un email à {investor.email}
          </p>
        </div>
      </div>

      <div className="fundraising-email-grid">
        {/* Composer */}
        <div className="fundraising-email-composer-card">
          <div className="fundraising-card-header">
            <h3>Nouvel Email</h3>
          </div>

          {/* Templates */}
          <div className="fundraising-email-templates">
            <label className="fundraising-form-label" style={{ marginBottom: 'var(--space-2)' }}>
              Modèles d'email
            </label>
            <div className="fundraising-templates-list">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  className={`fundraising-template-button ${emailTemplate === template.name ? 'active' : ''}`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Email Form */}
          <div className="fundraising-email-form">
            <div className="fundraising-form-group">
              <label className="fundraising-form-label">
                À
              </label>
              <input
                type="email"
                value={investor.email}
                disabled
                className="fundraising-form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="fundraising-form-group">
              <label className="fundraising-form-label">
                Sujet <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="fundraising-form-input"
                placeholder="Sujet de l'email"
              />
            </div>

            <div className="fundraising-form-group">
              <label className="fundraising-form-label">
                Message <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="fundraising-form-input"
                placeholder="Corps de l'email..."
                rows={12}
              />
            </div>

            {/* Attachments */}
            {documents.length > 0 && (
              <div className="fundraising-form-group">
                <label className="fundraising-form-label">
                  Pièces jointes
                </label>
                <div className="fundraising-documents-selector">
                  {documents.map((doc) => (
                    <label
                      key={doc.id}
                      className={`fundraising-document-selector-item ${selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleToggleDocument(doc.id)}
                        style={{ display: 'none' }}
                      />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="currentColor"/>
                      </svg>
                      <span>{doc.name}</span>
                      {selectedDocuments.includes(doc.id) && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M11.667 3.5l-6.334 6.333L2.333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="fundraising-email-actions">
              <button
                onClick={handleSend}
                disabled={isSending || !subject.trim() || !body.trim()}
                className="fundraising-btn-primary"
              >
                {isSending ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)', animation: 'spin 1s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="12 6"/>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 'var(--space-2)' }}>
                      <path d="M2 8l4-4m0 0l4 4m-4-4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2h-4M14 2v4M14 2l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Envoyer l'Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Interactions */}
        {recentInteractions.length > 0 && (
          <div className="fundraising-email-sidebar">
            <div className="fundraising-card-header">
              <h3>Emails Précédents</h3>
            </div>
            <div className="fundraising-recent-emails">
              {recentInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="fundraising-recent-email-item"
                  onClick={() => {
                    setSubject(interaction.subject)
                    setBody(interaction.body)
                  }}
                >
                  <div className="fundraising-recent-email-header">
                    <span className="fundraising-recent-email-subject">{interaction.subject}</span>
                    <span className="fundraising-date-label">{formatDate(interaction.sentAt)}</span>
                  </div>
                  <p className="fundraising-recent-email-preview">
                    {interaction.body.substring(0, 100)}...
                  </p>
                  {interaction.attachments && interaction.attachments.length > 0 && (
                    <div className="fundraising-recent-email-attachments">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" fill="currentColor"/>
                      </svg>
                      {interaction.attachments.length} pièce{interaction.attachments.length > 1 ? 's' : ''} jointe{interaction.attachments.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

