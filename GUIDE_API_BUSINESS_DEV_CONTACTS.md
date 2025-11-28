# 📋 Guide d'Implémentation - API Business Development Contacts

## 🎯 Objectif

Créer une API complète pour gérer les contacts Business Development avec stockage en base de données PostgreSQL via Prisma.

---

## 📁 Fichiers à créer/modifier

### Fichiers à modifier :
1. ✅ `prisma/schema.prisma` - Ajouter le modèle `BusinessDevContact`

### Fichiers à créer :
1. ✅ `app/api/business-dev/contacts/route.ts` - Route principale (GET, POST)
2. ✅ `app/api/business-dev/contacts/[id]/route.ts` - Route pour un contact spécifique (GET, PUT, DELETE)
3. ✅ `lib/api/business-dev-contacts.ts` - Service API pour le frontend (optionnel mais recommandé)

### Fichiers à mettre à jour :
1. ✅ `app/business-dev/page.tsx` - Utiliser l'API au lieu de localStorage
2. ✅ `components/business-dev/BusinessDevContacts.tsx` - Charger depuis l'API

---

## 📦 Étape 1 : Ajouter le modèle Prisma

### 1.1 Modifier `prisma/schema.prisma`

Ajoutez le modèle `BusinessDevContact` après le modèle `Customer` :

```prisma
model BusinessDevContact {
  id            String   @id @default(cuid())
  name          String
  company       String
  email         String
  phone         String?
  status        String   @default("pending") // active, pending, inactive
  estimatedValue String? // Format: "€120K", "€200K", etc.
  lastContact   DateTime @default(now())
  notes         String?  // Notes additionnelles sur le contact
  userId        String?  // Optionnel: lier au User qui a créé le contact
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([email])
  @@index([company])
  @@index([createdAt])
  @@map("business_dev_contacts")
}
```

### 1.2 Appliquer la migration

```bash
# Générer la migration
npx prisma migrate dev --name add_business_dev_contacts

# OU si vous préférez push direct (développement uniquement)
npx prisma db push
```

### 1.3 Générer le client Prisma

```bash
npx prisma generate
```

---

## 🔌 Étape 2 : Créer l'API Route

### 2.1 Créer le fichier `app/api/business-dev/contacts/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API Route pour gérer les contacts Business Development
 * 
 * GET /api/business-dev/contacts - Liste tous les contacts
 * POST /api/business-dev/contacts - Crée un nouveau contact
 */

export const dynamic = 'force-dynamic'

// GET - Liste tous les contacts avec filtres optionnels
export async function GET(request: NextRequest) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ 
    //     error: 'Authentification requise' 
    //   }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // active, pending, inactive
    const search = searchParams.get('search') // Recherche par nom, email, company
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construire les filtres
    const where: any = {}
    
    if (status && ['active', 'pending', 'inactive'].includes(status)) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Récupérer les contacts
    const [contacts, total] = await Promise.all([
      prisma.businessDevContact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.businessDevContact.count({ where }),
    ])

    return NextResponse.json({
      contacts,
      count: contacts.length,
      total,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur GET:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des contacts',
        details: error.message,
        contacts: []
      },
      { status: 500 }
    )
  }
}

// POST - Crée un nouveau contact
export async function POST(request: NextRequest) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ 
    //     error: 'Authentification requise' 
    //   }, { status: 401 })
    // }

    // Vérifier que Prisma est disponible
    if (!prisma) {
      console.error('[API Business Dev Contacts] Prisma client est undefined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'Prisma client non disponible' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, company, email, phone, status, estimatedValue, notes } = body

    // Validation des champs requis
    if (!name || !company || !email) {
      return NextResponse.json(
        { error: 'Le nom, l\'entreprise et l\'email sont requis' },
        { status: 400 }
      )
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du statut
    if (status && !['active', 'pending', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide (doit être: active, pending ou inactive)' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà (optionnel - selon vos besoins)
    const existing = await prisma.businessDevContact.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Un contact avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Créer le contact
    const contact = await prisma.businessDevContact.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        status: status || 'pending',
        estimatedValue: estimatedValue?.trim() || null,
        notes: notes?.trim() || null,
        lastContact: new Date(),
        // userId: session.user.id, // Si vous voulez lier au user
      }
    })

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur POST:', error)
    console.error('[API Business Dev Contacts] Stack:', error.stack)
    
    // Messages d'erreur détaillés
    let errorMessage = 'Erreur lors de la création du contact'
    let errorDetails = error.message
    
    if (error.code === 'P2002') {
      errorMessage = 'Un contact avec cet email existe déjà'
      errorDetails = 'Email déjà enregistré'
    } else if (error.code === 'P2003') {
      errorMessage = 'Erreur de référence'
      errorDetails = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: error.code === 'P2002' ? 409 : 500 }
    )
  }
}
```

---

## 🔌 Étape 3 : Créer l'API Route pour un contact spécifique

### 3.1 Créer le fichier `app/api/business-dev/contacts/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API Route pour gérer un contact Business Development spécifique
 * 
 * GET /api/business-dev/contacts/[id] - Récupère un contact
 * PUT /api/business-dev/contacts/[id] - Met à jour un contact
 * DELETE /api/business-dev/contacts/[id] - Supprime un contact
 */

export const dynamic = 'force-dynamic'

// GET - Récupère un contact par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const contact = await prisma.businessDevContact.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ contact })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur GET [id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contact', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Met à jour un contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    // }

    const { id } = params
    const body = await request.json()
    const { name, company, email, phone, status, estimatedValue, notes, lastContact } = body

    // Vérifier que le contact existe
    const existing = await prisma.businessDevContact.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    // Validation email si fourni
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        )
      }

      // Vérifier si l'email est déjà utilisé par un autre contact
      const emailExists = await prisma.businessDevContact.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre contact' },
          { status: 409 }
        )
      }
    }

    // Validation du statut si fourni
    if (status && !['active', 'pending', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Construire les données à mettre à jour
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (company !== undefined) updateData.company = company.trim()
    if (email !== undefined) updateData.email = email.toLowerCase().trim()
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (status !== undefined) updateData.status = status
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue?.trim() || null
    if (notes !== undefined) updateData.notes = notes?.trim() || null
    if (lastContact !== undefined) updateData.lastContact = new Date(lastContact)

    // Mettre à jour le contact
    const contact = await prisma.businessDevContact.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ contact })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur PUT:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contact', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Supprime un contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Optionnel: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    // }

    const { id } = params

    // Vérifier que le contact existe
    const existing = await prisma.businessDevContact.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le contact
    await prisma.businessDevContact.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Contact supprimé avec succès',
      id 
    })
  } catch (error: any) {
    console.error('[API Business Dev Contacts] Erreur DELETE:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact', details: error.message },
      { status: 500 }
    )
  }
}
```

---

## 🔄 Étape 4 : Mettre à jour le frontend

### 4.1 Créer un service API (`lib/api/business-dev-contacts.ts`)

```typescript
const API_BASE = '/api/business-dev/contacts'

export interface BusinessDevContact {
  id: string
  name: string
  company: string
  email: string
  phone?: string | null
  status: 'active' | 'pending' | 'inactive'
  estimatedValue?: string | null
  lastContact: string
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateContactData {
  name: string
  company: string
  email: string
  phone?: string
  status?: 'active' | 'pending' | 'inactive'
  estimatedValue?: string
  notes?: string
}

export interface UpdateContactData extends Partial<CreateContactData> {
  lastContact?: string
}

export const businessDevContactsAPI = {
  // Récupérer tous les contacts
  async getAll(params?: {
    status?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<{ contacts: BusinessDevContact[]; count: number; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.search) searchParams.append('search', params.search)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const response = await fetch(`${API_BASE}?${searchParams.toString()}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la récupération des contacts')
    }
    return response.json()
  },

  // Récupérer un contact par ID
  async getById(id: string): Promise<BusinessDevContact> {
    const response = await fetch(`${API_BASE}/${id}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la récupération du contact')
    }
    const data = await response.json()
    return data.contact
  },

  // Créer un nouveau contact
  async create(data: CreateContactData): Promise<BusinessDevContact> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la création du contact')
    }
    const result = await response.json()
    return result.contact
  },

  // Mettre à jour un contact
  async update(id: string, data: UpdateContactData): Promise<BusinessDevContact> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la mise à jour du contact')
    }
    const result = await response.json()
    return result.contact
  },

  // Supprimer un contact
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur lors de la suppression du contact')
    }
  },
}
```

### 4.2 Mettre à jour le modal dans `app/business-dev/page.tsx`

Remplacez la fonction `handleSubmit` du modal `AddContactModal` :

```typescript
import { businessDevContactsAPI } from '@/lib/api/business-dev-contacts'

// Dans AddContactModal
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    await businessDevContactsAPI.create({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone || undefined,
      status: formData.status,
      estimatedValue: formData.value || undefined,
    })
    
    // Déclencher un événement pour mettre à jour la liste
    window.dispatchEvent(new CustomEvent('businessDevContactAdded'))
    
    onSuccess()
  } catch (err: any) {
    setError(err.message || 'Erreur lors de la création du contact')
  } finally {
    setLoading(false)
  }
}
```

### 4.3 Mettre à jour `components/business-dev/BusinessDevContacts.tsx`

Remplacez le chargement depuis localStorage par un appel API :

```typescript
import { businessDevContactsAPI, BusinessDevContact } from '@/lib/api/business-dev-contacts'

export default function BusinessDevContacts() {
  const [contacts, setContacts] = useState<BusinessDevContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // ... autres états

  // Charger les contacts depuis l'API
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true)
        const data = await businessDevContactsAPI.getAll({
          status: activeFilter === 'all' ? undefined : activeFilter,
          search: searchTerm || undefined,
        })
        setContacts(data.contacts)
        setError(null)
      } catch (err: any) {
        console.error('Erreur lors du chargement des contacts:', err)
        setError(err.message)
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [activeFilter, searchTerm])

  // Écouter les événements de création
  useEffect(() => {
    const handleContactAdded = () => {
      // Recharger les contacts
      const loadContacts = async () => {
        try {
          const data = await businessDevContactsAPI.getAll({
            status: activeFilter === 'all' ? undefined : activeFilter,
            search: searchTerm || undefined,
          })
          setContacts(data.contacts)
        } catch (err) {
          console.error('Erreur lors du rechargement:', err)
        }
      }
      loadContacts()
    }

    window.addEventListener('businessDevContactAdded', handleContactAdded)
    return () => {
      window.removeEventListener('businessDevContactAdded', handleContactAdded)
    }
  }, [activeFilter, searchTerm])

  // ... reste du composant
}
```

---

## ✅ Étape 5 : Tester l'API

### 5.1 Test avec curl

```bash
# Créer un contact
curl -X POST http://localhost:3000/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "company": "TechCorp Solutions",
    "email": "jean.dupont@techcorp.com",
    "phone": "+33 6 12 34 56 78",
    "status": "active",
    "estimatedValue": "€120K"
  }'

# Lister tous les contacts
curl http://localhost:3000/api/business-dev/contacts

# Filtrer par statut
curl http://localhost:3000/api/business-dev/contacts?status=active

# Rechercher
curl http://localhost:3000/api/business-dev/contacts?search=TechCorp

# Récupérer un contact spécifique
curl http://localhost:3000/api/business-dev/contacts/[ID]

# Mettre à jour un contact
curl -X PUT http://localhost:3000/api/business-dev/contacts/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "estimatedValue": "€150K"
  }'

# Supprimer un contact
curl -X DELETE http://localhost:3000/api/business-dev/contacts/[ID]
```

---

## 🔒 Étape 6 : Activer l'authentification (optionnel)

Si vous voulez sécuriser l'API, décommentez les lignes d'authentification dans les routes :

```typescript
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ 
    error: 'Authentification requise' 
  }, { status: 401 })
}
```

---

## 📝 Résumé des endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/business-dev/contacts` | Liste tous les contacts (avec filtres) |
| POST | `/api/business-dev/contacts` | Crée un nouveau contact |
| GET | `/api/business-dev/contacts/[id]` | Récupère un contact spécifique |
| PUT | `/api/business-dev/contacts/[id]` | Met à jour un contact |
| DELETE | `/api/business-dev/contacts/[id]` | Supprime un contact |

---

## 🎯 Prochaines étapes possibles

1. **Ajouter des relations** : Lier les contacts aux deals/opportunités
2. **Historique des interactions** : Créer un modèle pour suivre les échanges
3. **Notifications** : Alertes pour les contacts à relancer
4. **Export** : Export CSV/Excel des contacts
5. **Import** : Import en masse depuis un fichier

---

## ⚠️ Notes importantes

- Les emails sont stockés en minuscules pour éviter les doublons
- Le format `estimatedValue` est libre (ex: "€120K", "$200K", "150K EUR")
- Les dates `lastContact` peuvent être mises à jour manuellement ou automatiquement
- Les index sur `status`, `email`, `company` et `createdAt` améliorent les performances

