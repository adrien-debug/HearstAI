'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import '@/components/trello/Trello.css'

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
    const newCard: Card = {
      id: `card-${Date.now()}`,
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

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Trello Board</h1>
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
          📅 {new Date(card.dueDate).toLocaleDateString('fr-FR')}
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

