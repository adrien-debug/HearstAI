# 🎯 PLAN D'ACTION - CORRECTIONS AUDIT
## Plan de Correction Priorisé - HearstAI

**Date de création:** 2025-01-20  
**Basé sur:** Rapport d'Audit Code Complet  
**Statut:** 🔴 URGENT - Corrections critiques requises avant production

---

## 📋 RÉSUMÉ EXÉCUTIF

Ce document présente un plan d'action priorisé pour corriger les problèmes identifiés lors de l'audit code complet. Les corrections sont organisées par priorité et incluent des estimations de temps et des ressources nécessaires.

### Problèmes identifiés

- **Critiques:** 4 problèmes (sécurité)
- **Haute priorité:** 6 problèmes (qualité, performance)
- **Moyenne priorité:** 8 problèmes (maintenabilité, optimisation)

### Temps estimé total

- **Critiques:** 2-3 jours
- **Haute priorité:** 1-2 semaines
- **Moyenne priorité:** 2-3 semaines

---

## 🔴 PHASE 1: CORRECTIONS CRITIQUES (URGENT)

**Durée estimée:** 2-3 jours  
**Statut:** ⚠️ **DOIT ÊTRE FAIT AVANT TOUT DÉPLOIEMENT EN PRODUCTION**

### 1.1 Implémenter l'authentification sécurisée avec bcrypt

**Fichier:** `lib/auth.ts`  
**Lignes:** 45-46  
**Gravité:** 🔴 CRITIQUE

#### Actions

1. **Ajouter le champ passwordHash au modèle User**

```prisma
// prisma/schema.prisma
model User {
  // ... champs existants
  passwordHash String? // Ajouter ce champ
}
```

2. **Créer une migration Prisma**

```bash
npx prisma migrate dev --name add_password_hash
```

3. **Modifier la fonction authorize dans lib/auth.ts**

```typescript
// lib/auth.ts
import bcrypt from 'bcryptjs'

async authorize(credentials) {
  try {
    if (!credentials?.email || !credentials?.password) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    })

    if (!user) {
      return null
    }

    // Si pas de passwordHash, refuser la connexion
    if (!user.passwordHash) {
      console.warn('[NextAuth] Utilisateur sans passwordHash')
      return null
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    )

    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error('[NextAuth] Erreur:', error)
    return null
  }
}
```

4. **Créer un script pour hasher les mots de passe existants**

```typescript
// scripts/hash-existing-passwords.ts
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

async function hashExistingPasswords() {
  const users = await prisma.user.findMany({
    where: { passwordHash: null },
  })

  for (const user of users) {
    // Générer un mot de passe temporaire ou demander à l'utilisateur
    // Pour l'instant, on génère un hash vide (l'utilisateur devra réinitialiser)
    const tempPassword = 'TEMP_RESET_REQUIRED'
    const hash = await bcrypt.hash(tempPassword, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash },
    })
    
    console.log(`✅ Password hash créé pour ${user.email}`)
  }
}

hashExistingPasswords()
```

5. **Créer une route API pour la réinitialisation de mot de passe**

```typescript
// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()
    
    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Valider la force du mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const hash = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
```

**Temps estimé:** 4-6 heures  
**Ressources:** 1 développeur

---

### 1.2 Réactiver l'authentification sur toutes les routes API

**Fichiers:** 
- `app/api/collateral/route.ts`
- `app/api/projects/[id]/route.ts`
- Toutes les autres routes API

**Gravité:** 🔴 CRITIQUE

#### Actions

1. **Créer un helper pour vérifier l'authentification**

```typescript
// lib/auth-helper.ts
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      session: null,
    }
  }
  
  return {
    error: null,
    session,
  }
}
```

2. **Modifier chaque route API**

```typescript
// app/api/collateral/route.ts
import { requireAuth } from '@/lib/auth-helper'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { error, session } = await requireAuth()
    if (error) return error
    
    // Reste du code...
  } catch (error) {
    // ...
  }
}
```

3. **Lister toutes les routes API à modifier**

```bash
# Trouver toutes les routes API
find app/api -name "route.ts" -type f
```

**Routes à modifier:**
- [ ] `app/api/collateral/route.ts`
- [ ] `app/api/projects/[id]/route.ts`
- [ ] `app/api/projects/route.ts`
- [ ] `app/api/customers/route.ts`
- [ ] `app/api/customers/[id]/route.ts`
- [ ] `app/api/portfolio/**/*.ts`
- [ ] Toutes les autres routes sensibles

**Temps estimé:** 6-8 heures  
**Ressources:** 1 développeur

---

### 1.3 Supprimer les secrets en dur

**Fichier:** `lib/auth.ts` (ligne 63)  
**Gravité:** 🔴 CRITIQUE

#### Actions

1. **Modifier lib/auth.ts**

```typescript
// lib/auth.ts
secret: (() => {
  const secret = process.env.NEXTAUTH_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NEXTAUTH_SECRET must be set in production. ' +
        'Generate one with: openssl rand -base64 32'
      )
    }
    
    // En développement uniquement
    console.warn(
      '[NextAuth] ⚠️ NEXTAUTH_SECRET non défini, ' +
      'utilisation d\'un secret temporaire pour le développement'
    )
    return 'temporary-dev-secret-change-in-production'
  }
  
  return secret
})(),
```

2. **Vérifier toutes les autres occurrences**

```bash
grep -r "fallback.*secret\|hardcoded.*secret\|secret.*hardcoded" --include="*.ts" --include="*.tsx" --include="*.js"
```

**Temps estimé:** 1-2 heures  
**Ressources:** 1 développeur

---

### 1.4 Corriger le middleware pour la production

**Fichier:** `middleware.ts`  
**Gravité:** 🟡 MOYENNE (mais critique si déployé)

#### Actions

1. **Modifier middleware.ts**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Exclusion des assets statiques
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json|js|css|woff|woff2|ttf|eot|map)$/i)
  ) {
    return NextResponse.next()
  }

  // Utiliser une variable d'environnement explicite
  const DISABLE_MIDDLEWARE = process.env.DISABLE_MIDDLEWARE === 'true'
  
  // En production, toujours activer le middleware
  if (process.env.NODE_ENV === 'production' && DISABLE_MIDDLEWARE) {
    console.error('[Middleware] ❌ ERREUR: Middleware ne peut pas être désactivé en production')
    // Ne pas désactiver en production
  }
  
  // En développement uniquement, permettre la désactivation
  if (DISABLE_MIDDLEWARE && process.env.NODE_ENV === 'development') {
    console.warn('[Middleware] ⚠️ Middleware désactivé pour le développement')
    return NextResponse.next()
  }

  // Vérifier NEXTAUTH_SECRET
  if (!process.env.NEXTAUTH_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    console.warn('[Middleware] ⚠️ NEXTAUTH_SECRET non défini')
    return NextResponse.next()
  }

  // Reste du code...
}
```

2. **Documenter la variable d'environnement**

```bash
# Ajouter dans .env.example
# Désactiver le middleware en développement (NE JAMAIS UTILISER EN PRODUCTION)
DISABLE_MIDDLEWARE=false
```

**Temps estimé:** 2-3 heures  
**Ressources:** 1 développeur

---

## 🟡 PHASE 2: CORRECTIONS HAUTE PRIORITÉ

**Durée estimée:** 1-2 semaines  
**Statut:** ⚠️ **RECOMMANDÉ AVANT PRODUCTION**

### 2.1 Ajouter la validation des entrées utilisateur

**Fichiers:** Toutes les routes API  
**Gravité:** 🟡 MOYENNE

#### Actions

1. **Installer Zod**

```bash
npm install zod
```

2. **Créer des schémas de validation**

```typescript
// lib/validations.ts
import { z } from 'zod'

export const ethereumAddressSchema = z.string().regex(
  /^0x[a-fA-F0-9]{40}$/,
  'Invalid Ethereum address'
)

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  erc20Address: ethereumAddressSchema,
  tag: z.string().optional(),
  chains: z.array(z.string()).optional(),
  protocols: z.array(z.string()).optional(),
})
```

3. **Utiliser dans les routes API**

```typescript
// app/api/customers/route.ts
import { createCustomerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Valider les données
    const validationResult = createCustomerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    // Reste du code...
  } catch (error) {
    // ...
  }
}
```

**Temps estimé:** 1-2 jours  
**Ressources:** 1 développeur

---

### 2.2 Implémenter le rate limiting

**Fichiers:** Toutes les routes API  
**Gravité:** 🟡 MOYENNE

#### Actions

1. **Installer upstash/ratelimit**

```bash
npm install @upstash/ratelimit @upstash/redis
```

2. **Créer un helper rate limiting**

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requêtes par 10 secondes
  analytics: true,
})
```

3. **Utiliser dans les routes API**

```typescript
// app/api/collateral/route.ts
import { ratelimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success, limit, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      )
    }
    
    // Reste du code...
  } catch (error) {
    // ...
  }
}
```

**Temps estimé:** 1-2 jours  
**Ressources:** 1 développeur

---

### 2.3 Ajouter le cache pour les requêtes API

**Fichiers:** `lib/debank.ts`, `app/api/collateral/route.ts`  
**Gravité:** 🟡 MOYENNE

#### Actions

1. **Installer Redis ou utiliser un cache en mémoire**

```bash
npm install ioredis
# ou pour un cache simple en mémoire
npm install node-cache
```

2. **Créer un service de cache**

```typescript
// lib/cache.ts
import NodeCache from 'node-cache'

const cache = new NodeCache({
  stdTTL: 60, // TTL par défaut: 60 secondes
  checkperiod: 120, // Vérifier les entrées expirées toutes les 2 minutes
})

export function getCacheKey(prefix: string, ...args: any[]): string {
  return `${prefix}:${args.join(':')}`
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached) {
    return cached
  }
  
  const data = await fetcher()
  cache.set(key, data, ttl)
  return data
}

export function invalidateCache(pattern: string): void {
  const keys = cache.keys().filter(key => key.includes(pattern))
  cache.del(keys)
}
```

3. **Utiliser dans lib/debank.ts**

```typescript
// lib/debank.ts
import { getCached, getCacheKey } from '@/lib/cache'

export async function buildCollateralClientFromDeBank(...) {
  const cacheKey = getCacheKey('debank:client', wallet, chains.join(','))
  
  return getCached(
    cacheKey,
    async () => {
      // Code existant de récupération DeBank
      const protoList = await fetchUserComplexProtocols(normalizedWallet, chains)
      // ...
      return client
    },
    60 // Cache pendant 60 secondes
  )
}
```

**Temps estimé:** 1-2 jours  
**Ressources:** 1 développeur

---

### 2.4 Standardiser la gestion d'erreurs

**Fichiers:** Tous les fichiers  
**Gravité:** 🟡 MOYENNE

#### Actions

1. **Créer des classes d'erreur personnalisées**

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}
```

2. **Créer un handler d'erreurs global**

```typescript
// lib/error-handler.ts
import { NextResponse } from 'next/server'
import { AppError } from './errors'

export function handleError(error: unknown): NextResponse {
  console.error('[Error Handler]', error)
  
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { details: error.details }),
      },
      { status: error.statusCode }
    )
  }
  
  // Erreur inconnue
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (error as Error).message,
    },
    { status: 500 }
  )
}
```

3. **Utiliser dans les routes API**

```typescript
// app/api/collateral/route.ts
import { handleError, NotFoundError, ValidationError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    // Code...
  } catch (error) {
    return handleError(error)
  }
}
```

**Temps estimé:** 2-3 jours  
**Ressources:** 1 développeur

---

### 2.5 Ajouter les tests unitaires de base

**Fichiers:** Tous les fichiers critiques  
**Gravité:** 🟡 MOYENNE

#### Actions

1. **Installer Jest et les dépendances**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest
```

2. **Configurer Jest**

```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
```

3. **Créer des tests pour l'authentification**

```typescript
// __tests__/lib/auth.test.ts
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

describe('Authentication', () => {
  it('should reject invalid credentials', async () => {
    const provider = authOptions.providers[0]
    const result = await provider.authorize({
      email: 'test@example.com',
      password: 'wrongpassword',
    })
    
    expect(result).toBeNull()
  })
  
  it('should accept valid credentials', async () => {
    // Créer un utilisateur de test
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash,
        name: 'Test User',
      },
    })
    
    const provider = authOptions.providers[0]
    const result = await provider.authorize({
      email: 'test@example.com',
      password: 'password123',
    })
    
    expect(result).not.toBeNull()
    expect(result?.email).toBe('test@example.com')
    
    // Nettoyer
    await prisma.user.delete({ where: { id: user.id } })
  })
})
```

**Temps estimé:** 3-5 jours  
**Ressources:** 1 développeur

---

### 2.6 Créer .env.example et documenter les variables

**Fichiers:** `.env.example`  
**Gravité:** 🟢 FAIBLE

#### Actions

1. **Créer .env.example**

```bash
# .env.example

# NextAuth
NEXTAUTH_URL=http://localhost:6001
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hearstai

# DeBank API
DEBANK_ACCESS_KEY=your-debank-access-key

# Fireblocks API
FIREBLOCKS_API_KEY=your-fireblocks-api-key
FIREBLOCKS_PRIVATE_KEY=your-fireblocks-private-key
FIREBLOCKS_BASE_URL=https://api.fireblocks.io
FIREBLOCKS_TIMEOUT=30000

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Luxor API (optionnel)
LUXOR_API_KEY=your-luxor-api-key

# Next.js API URL
NEXT_PUBLIC_API_URL=/api

# Backend URL
BACKEND_URL=http://localhost:4000

# Node Environment
NODE_ENV=development

# Middleware (développement uniquement)
DISABLE_MIDDLEWARE=false

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

2. **Documenter dans README.md**

```markdown
## Configuration

Copiez `.env.example` vers `.env.local` et remplissez les variables d'environnement.

### Variables requises

- `NEXTAUTH_SECRET`: Générer avec `openssl rand -base64 32`
- `DATABASE_URL`: URL de connexion PostgreSQL
- `DEBANK_ACCESS_KEY`: Clé API DeBank

### Variables optionnelles

- `DISABLE_MIDDLEWARE`: Désactiver le middleware en développement (jamais en production)
```

**Temps estimé:** 1-2 heures  
**Ressources:** 1 développeur

---

## 🟢 PHASE 3: CORRECTIONS MOYENNE PRIORITÉ

**Durée estimée:** 2-3 semaines  
**Statut:** 📋 **AMÉLIORATIONS CONTINUES**

### 3.1 Implémenter le retry logic

### 3.2 Ajouter le logging structuré

### 3.3 Optimiser les performances

### 3.4 Améliorer la documentation

### 3.5 Réduire la duplication de code

### 3.6 Ajouter la pagination

### 3.7 Implémenter le lazy loading

### 3.8 Centraliser la configuration

---

## 📊 SUIVI DES CORRECTIONS

### Checklist Phase 1 (Critique)

- [ ] 1.1 Implémenter bcrypt
  - [ ] Ajouter passwordHash au modèle
  - [ ] Créer migration
  - [ ] Modifier authorize()
  - [ ] Script hash passwords existants
  - [ ] Route reset password
- [ ] 1.2 Réactiver authentification routes API
  - [ ] Créer helper requireAuth()
  - [ ] Modifier toutes les routes
- [ ] 1.3 Supprimer secrets en dur
  - [ ] Modifier lib/auth.ts
  - [ ] Vérifier autres occurrences
- [ ] 1.4 Corriger middleware production
  - [ ] Modifier middleware.ts
  - [ ] Documenter variable

### Checklist Phase 2 (Haute priorité)

- [ ] 2.1 Validation entrées
- [ ] 2.2 Rate limiting
- [ ] 2.3 Cache API
- [ ] 2.4 Gestion erreurs
- [ ] 2.5 Tests unitaires
- [ ] 2.6 .env.example

---

## 🎯 CRITÈRES DE SUCCÈS

### Phase 1 (Critique)

✅ Tous les problèmes critiques résolus  
✅ Tests d'authentification passent  
✅ Aucun secret en dur dans le code  
✅ Middleware fonctionne en production

### Phase 2 (Haute priorité)

✅ Validation sur toutes les routes API  
✅ Rate limiting actif  
✅ Cache implémenté  
✅ Tests unitaires > 60% coverage  
✅ Documentation complète

---

## 📝 NOTES

- **Priorité absolue:** Phase 1 doit être complétée avant tout déploiement
- **Tests:** Chaque correction doit être testée individuellement
- **Documentation:** Mettre à jour la documentation à chaque étape
- **Code review:** Faire une review de code pour chaque phase

---

**Fin du plan d'action**

*Document créé le 2025-01-20*  
*Dernière mise à jour: 2025-01-20*



