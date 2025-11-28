# Configuration des Endpoints - Frontend & Backend

## 📡 Architecture des Endpoints

### Backend Railway (Standalone)
**URL:** https://hearstaibackend-production.up.railway.app/api

#### Endpoints disponibles sur Railway:
- ✅ `/api/health` - Health check
- ✅ `/api/projects` - Gestion des projets
- ✅ `/api/jobs` - Gestion des jobs
- ✅ `/api/versions` - Gestion des versions
- ✅ `/api/prompts` - Gestion des prompts
- ✅ `/api/logs` - Logs
- ✅ `/api/stats` - Statistiques
- ✅ `/api/electricity` - Données électricité (mock)
- ✅ `/api/collateral` - Données collateral (mock)
- ✅ `/api/cockpit` - Données cockpit (mock)
- ❌ `/api/calculator` - **MANQUANT** (404) - Doit être ajouté au backend Railway

### Next.js API Routes (Frontend)
**URL:** `/api` (relatif au domaine du frontend)

#### Endpoints gérés par Next.js:
- ✅ `/api/customers` - Gestion des customers (avec DeBank)
- ✅ `/api/customers/[id]` - Customer spécifique
- ✅ `/api/customers/[id]/fireblocks` - Association Fireblocks
- ✅ `/api/fireblocks/vaults` - Vaults Fireblocks
- ✅ `/api/fireblocks/transactions` - Transactions Fireblocks
- ✅ `/api/calculator` - Calculatrice (fallback si Railway n'a pas)
- ✅ `/api/calculator/metrics` - Métriques Bitcoin
- ✅ `/api/calculator/calculate` - Calcul de profitabilité
- ✅ `/api/calculator/projection` - Projections
- ✅ `/api/collateral` - Collateral (avec DeBank)
- ✅ `/api/cockpit` - Cockpit data

## 🔧 Configuration Frontend

### Fichier: `lib/api.ts`

Le frontend utilise `NEXT_PUBLIC_API_URL` pour déterminer où envoyer les requêtes :

```typescript
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  
  // Si URL complète (http/https), l'utiliser
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`
  }
  
  // Sinon, utiliser les routes Next.js locales
  return '/api'
}
```

### Variables d'environnement

**`.env.local`:**
```env
NEXT_PUBLIC_API_URL="https://hearstaibackend-production.up.railway.app"
```

## 📋 Mapping des Endpoints

| Endpoint Frontend | Destination | Statut |
|------------------|-------------|--------|
| `projectsAPI.*` | Railway `/api/projects` | ✅ |
| `jobsAPI.*` | Railway `/api/jobs` | ✅ |
| `versionsAPI.*` | Railway `/api/versions` | ✅ |
| `statsAPI.*` | Railway `/api/stats` | ✅ |
| `healthAPI.*` | Railway `/api/health` | ✅ |
| `getElectricity()` | Railway `/api/electricity` | ✅ |
| `collateralAPI.*` | Next.js `/api/collateral` | ✅ (DeBank) |
| `cockpitAPI.*` | Railway `/api/cockpit` | ✅ |
| `customersAPI.*` | Next.js `/api/customers` | ✅ (Prisma + DeBank) |
| `fireblocksAPI.*` | Next.js `/api/fireblocks` | ✅ |
| `calculator` | Railway `/api/calculator` | ❌ **404** |

## ⚠️ Problèmes identifiés

### 1. Calculator endpoint manquant sur Railway
**Problème:** Le backend Railway retourne 404 pour `/api/calculator`

**Solution:** 
- Le routeur calculator existe dans le code backend
- Il doit être monté dans `server.js` du backend Railway
- Vérifier que le déploiement Railway inclut le routeur calculator

### 2. Endpoints avec erreurs
- `/api/jobs` - Retourne 500 (erreur serveur)
- `/api/versions` - Retourne 400 (bad request)

**Action:** Vérifier les logs Railway pour ces endpoints

## ✅ Endpoints fonctionnels

Tous les autres endpoints fonctionnent correctement :
- Health check: ✅
- Projects: ✅
- Prompts: ✅
- Logs: ✅
- Stats: ✅
- Electricity: ✅
- Collateral: ✅
- Cockpit: ✅

## 🔄 Fallback Strategy

Le frontend utilise une stratégie de fallback :
1. Si `NEXT_PUBLIC_API_URL` est défini → Utilise Railway
2. Sinon → Utilise les routes Next.js locales (`/api`)

Cela permet :
- En développement local : Utiliser Railway ou Next.js
- En production : Utiliser Railway pour les endpoints backend
- Next.js gère les endpoints nécessitant Prisma/DeBank/Fireblocks

## 📝 Notes importantes

1. **Customers & Fireblocks** : Gérés par Next.js car ils nécessitent :
   - Prisma (base de données)
   - DeBank API (données en temps réel)
   - Fireblocks API (clés privées)

2. **Calculator** : Devrait être sur Railway mais actuellement manquant

3. **Mock endpoints** : Electricity, Collateral, Cockpit retournent des données mock sur Railway

## 🚀 Actions recommandées

1. ✅ Vérifier que le routeur calculator est monté dans le backend Railway
2. ✅ Vérifier les logs Railway pour les erreurs 500/400
3. ✅ Tester tous les endpoints depuis le frontend
4. ✅ Documenter les endpoints qui nécessitent Next.js vs Railway

