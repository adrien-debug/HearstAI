'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import '@/components/trello/Trello.css'

// Helper function to format dates consistently (client-side only)
function formatDate(date: Date | string): string {
  if (typeof window === 'undefined') {
    // Return ISO string during SSR to avoid hydration mismatch
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0]
  }
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR')
}

interface Card {
  id: string
  title: string
  description?: string
  dueDate?: string
  labels?: string[]
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

export default function TrelloPage() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'À Faire',
      cards: [
        { id: '1', title: 'Réunion équipe', description: 'Préparer l\'agenda', dueDate: '2025-01-25' },
        { id: '2', title: 'Rapport mensuel', description: 'Analyser les métriques', dueDate: '2025-01-28' },
      ],
    },
    {
      id: 'in-progress',
      title: 'En Cours',
      cards: [
        { id: '3', title: 'Développement feature', description: 'Implémenter drag & drop', labels: ['dev', 'urgent'] },
        { id: '4', title: 'Code review', description: 'Revoir PR #123', labels: ['review'] },
      ],
    },
    {
      id: 'done',
      title: 'Terminé',
      cards: [
        { id: '5', title: 'Setup environnement', description: 'Configuration complète', labels: ['setup'] },
      ],
    },
  ])

  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [editingColumn, setEditingColumn] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Trouver la carte et sa colonne actuelle
    let sourceColumn: Column | null = null
    let sourceCard: Card | null = null
    let sourceIndex = -1

    for (const column of columns) {
      const index = column.cards.findIndex(card => card.id === activeId)
      if (index !== -1) {
        sourceColumn = column
        sourceCard = column.cards[index]
        sourceIndex = index
        break
      }
    }

    if (!sourceColumn || !sourceCard) return

    // Si on dépose sur une colonne
    if (columns.some(col => col.id === overId)) {
      const targetColumn = columns.find(col => col.id === overId)
      if (targetColumn && targetColumn.id !== sourceColumn.id) {
        setColumns(prev => prev.map(col => {
          if (col.id === sourceColumn!.id) {
            return { ...col, cards: col.cards.filter(c => c.id !== activeId) }
          }
          if (col.id === targetColumn.id) {
            return { ...col, cards: [...col.cards, sourceCard!] }
          }
          return col
        }))
      }
      return
    }

    // Si on dépose sur une autre carte
    let targetColumn: Column | null = null
    let targetIndex = -1

    for (const column of columns) {
      const index = column.cards.findIndex(card => card.id === overId)
      if (index !== -1) {
        targetColumn = column
        targetIndex = index
        break
      }
    }

    if (!targetColumn) return

    // Déplacer la carte
    if (sourceColumn.id === targetColumn.id) {
      // Même colonne : réorganiser
      const newCards = [...sourceColumn.cards]
      newCards.splice(sourceIndex, 1)
      newCards.splice(targetIndex, 0, sourceCard)

      setColumns(prev => prev.map(col =>
        col.id === sourceColumn!.id ? { ...col, cards: newCards } : col
      ))
    } else {
      // Colonne différente : déplacer vers la nouvelle colonne
      setColumns(prev => prev.map(col => {
        if (col.id === sourceColumn!.id) {
          return { ...col, cards: col.cards.filter(c => c.id !== activeId) }
        }
        if (col.id === targetColumn!.id) {
          const newCards = [...col.cards]
          newCards.splice(targetIndex, 0, sourceCard!)
          return { ...col, cards: newCards }
        }
        return col
      }))
    }
  }

  const handleAddCard = (columnId: string) => {
    // Use crypto.randomUUID if available, otherwise use timestamp + random
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? `card-${crypto.randomUUID()}` 
      : `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newCard: Card = {
      id,
      title: 'Nouvelle carte',
      description: '',
    }
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    ))
    setEditingCard(newCard.id)
  }

  const handleUpdateCard = (cardId: string, updates: Partial<Card>) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      cards: col.cards.map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      ),
    })))
  }

  const handleDeleteCard = (cardId: string) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      cards: col.cards.filter(card => card.id !== cardId),
    })))
  }

  const handleUpdateColumnTitle = (columnId: string, title: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, title } : col
    ))
    setEditingColumn(null)
  }

  const activeCard = activeId
    ? columns
        .flatMap(col => col.cards)
        .find(card => card.id === activeId)
    : null

  // Calcul des statistiques
  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0)
  const todoCount = columns.find(col => col.id === 'todo')?.cards.length || 0
  const inProgressCount = columns.find(col => col.id === 'in-progress')?.cards.length || 0
  const doneCount = columns.find(col => col.id === 'done')?.cards.length || 0
  const completionRate = totalCards > 0 ? Math.round((doneCount / totalCards) * 100) : 0
  const overdueCards = columns
    .filter(col => col.id !== 'done')
    .flatMap(col => col.cards)
    .filter(card => card.dueDate && new Date(card.dueDate) < new Date())
    .length

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header Premium */}
        <div className="trello-header-premium">
          <div className="trello-header-main">
            <div className="trello-header-title-section">
              <h1 className="trello-header-title">
                <svg className="trello-header-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V21M3 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trello Board
              </h1>
              <p className="trello-header-subtitle">Gestion de projet & collaboration premium</p>
            </div>
            <div className="trello-header-actions">
              <button className="trello-header-btn trello-header-btn-secondary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Nouvelle colonne
              </button>
              <button className="trello-header-btn trello-header-btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2.66667V13.3333M2.66667 8H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Exporter
              </button>
            </div>
          </div>

          {/* Statistiques Premium */}
          <div className="trello-stats-grid">
            <div className="trello-stat-card">
              <div className="trello-stat-icon trello-stat-icon-total">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2.5V17.5M2.5 10H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trello-stat-content">
                <div className="trello-stat-value">{totalCards}</div>
                <div className="trello-stat-label">Total Cartes</div>
              </div>
            </div>

            <div className="trello-stat-card">
              <div className="trello-stat-icon trello-stat-icon-todo">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2.5L12.5 7.5L18.3333 8.75L14.1667 12.9167L15 18.75L10 16.25L5 18.75L5.83333 12.9167L1.66667 8.75L7.5 7.5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trello-stat-content">
                <div className="trello-stat-value">{todoCount}</div>
                <div className="trello-stat-label">À Faire</div>
              </div>
            </div>

            <div className="trello-stat-card">
              <div className="trello-stat-icon trello-stat-icon-progress">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 5V10L13.3333 11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trello-stat-content">
                <div className="trello-stat-value">{inProgressCount}</div>
                <div className="trello-stat-label">En Cours</div>
              </div>
            </div>

            <div className="trello-stat-card">
              <div className="trello-stat-icon trello-stat-icon-done">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trello-stat-content">
                <div className="trello-stat-value">{doneCount}</div>
                <div className="trello-stat-label">Terminé</div>
              </div>
            </div>

            <div className="trello-stat-card trello-stat-card-highlight">
              <div className="trello-stat-icon trello-stat-icon-completion">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="trello-stat-content">
                <div className="trello-stat-value">{completionRate}%</div>
                <div className="trello-stat-label">Complétion</div>
              </div>
              <div className="trello-stat-progress">
                <div className="trello-stat-progress-bar" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>

            {overdueCards > 0 && (
              <div className="trello-stat-card trello-stat-card-warning">
                <div className="trello-stat-icon trello-stat-icon-warning">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5V10M10 15H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="trello-stat-content">
                  <div className="trello-stat-value">{overdueCards}</div>
                  <div className="trello-stat-label">En Retard</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="trello-board">
            {columns.map((column) => (
              <TrelloColumn
                key={column.id}
                column={column}
                onAddCard={handleAddCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onUpdateTitle={handleUpdateColumnTitle}
                editingCard={editingCard}
                setEditingCard={setEditingCard}
                editingColumn={editingColumn}
                setEditingColumn={setEditingColumn}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? <TrelloCardPreview card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

function TrelloColumn({
  column,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onUpdateTitle,
  editingCard,
  setEditingCard,
  editingColumn,
  setEditingColumn,
}: {
  column: Column
  onAddCard: (columnId: string) => void
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void
  onDeleteCard: (cardId: string) => void
  onUpdateTitle: (columnId: string, title: string) => void
  editingCard: string | null
  setEditingCard: (id: string | null) => void
  editingColumn: string | null
  setEditingColumn: (id: string | null) => void
}) {
  const cardIds = column.cards.map(card => card.id)

  return (
    <div className="trello-column">
      <div className="trello-column-header">
        {editingColumn === column.id ? (
          <input
            type="text"
            className="trello-column-title-input"
            value={column.title}
            onChange={(e) => onUpdateTitle(column.id, e.target.value)}
            onBlur={() => setEditingColumn(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingColumn(null)
              }
            }}
            autoFocus
          />
        ) : (
          <h2
            className="trello-column-title"
            onClick={() => setEditingColumn(column.id)}
          >
            {column.title}
            <span className="trello-column-count">{column.cards.length}</span>
          </h2>
        )}
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="trello-column-cards">
          {column.cards.map((card) => (
            <TrelloCard
              key={card.id}
              card={card}
              isEditing={editingCard === card.id}
              onEdit={() => setEditingCard(card.id)}
              onSave={(updates) => {
                onUpdateCard(card.id, updates)
                setEditingCard(null)
              }}
              onCancel={() => setEditingCard(null)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </div>
      </SortableContext>

      <button
        className="trello-add-card-btn"
        onClick={() => onAddCard(column.id)}
      >
        + Ajouter une carte
      </button>
    </div>
  )
}

function TrelloCard({
  card,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  card: Card
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<Card>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (isEditing) {
    return (
      <TrelloCardEditor
        card={card}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="trello-card"
      onClick={onEdit}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="trello-card-labels">
          {card.labels.map((label, index) => (
            <span key={index} className="trello-card-label">{label}</span>
          ))}
        </div>
      )}
      <div className="trello-card-title">{card.title}</div>
      {card.description && (
        <div className="trello-card-description">{card.description}</div>
      )}
      {card.dueDate && (
        <div className="trello-card-due-date">
          <svg className="trello-card-due-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 2.33333H10.5V1.16667C10.5 0.891667 10.275 0.666667 10 0.666667C9.725 0.666667 9.5 0.891667 9.5 1.16667V2.33333H4.5V1.16667C4.5 0.891667 4.275 0.666667 4 0.666667C3.725 0.666667 3.5 0.891667 3.5 1.16667V2.33333H2.33333C1.41667 2.33333 0.666667 3.08333 0.666667 4V11.6667C0.666667 12.5833 1.41667 13.3333 2.33333 13.3333H11.6667C12.5833 13.3333 13.3333 12.5833 13.3333 11.6667V4C13.3333 3.08333 12.5833 2.33333 11.6667 2.33333ZM11.6667 11.6667H2.33333V6.33333H11.6667V11.6667Z" fill="currentColor"/>
          </svg>
          {isClient ? formatDate(card.dueDate) : new Date(card.dueDate).toISOString().split('T')[0]}
        </div>
      )}
    </div>
  )
}

function TrelloCardEditor({
  card,
  onSave,
  onCancel,
  onDelete,
}: {
  card: Card
  onSave: (updates: Partial<Card>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [dueDate, setDueDate] = useState(card.dueDate || '')
  const [labels, setLabels] = useState(card.labels?.join(', ') || '')

  const handleSave = () => {
    onSave({
      title,
      description,
      dueDate: dueDate || undefined,
      labels: labels ? labels.split(',').map(l => l.trim()).filter(Boolean) : undefined,
    })
  }

  return (
    <div className="trello-card-editor">
      <input
        type="text"
        className="trello-card-editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la carte"
        autoFocus
      />
      <textarea
        className="trello-card-editor-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description..."
        rows={3}
      />
      <input
        type="date"
        className="trello-card-editor-date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Date d'échéance"
      />
      <input
        type="text"
        className="trello-card-editor-labels"
        value={labels}
        onChange={(e) => setLabels(e.target.value)}
        placeholder="Labels (séparés par des virgules)"
      />
      <div className="trello-card-editor-actions">
        <button className="trello-btn trello-btn-primary" onClick={handleSave}>
          Enregistrer
        </button>
        <button className="trello-btn trello-btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button className="trello-btn trello-btn-danger" onClick={onDelete}>
          Supprimer
        </button>
      </div>
    </div>
  )
}

function TrelloCardPreview({ card }: { card: Card }) {
  return (
    <div className="trello-card trello-card-preview">
      {card.labels && card.labels.length > 0 && (
        <div className="trello-card-labels">
          {card.labels.map((label, index) => (
            <span key={index} className="trello-card-label">{label}</span>
          ))}
        </div>
      )}
      <div className="trello-card-title">{card.title}</div>
      {card.description && (
        <div className="trello-card-description">{card.description}</div>
      )}
    </div>
  )
}

