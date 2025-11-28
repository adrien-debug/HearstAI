# Statut des Endpoints Backend Railway

## ✅ Endpoints fonctionnels (200 OK)

| Endpoint | URL | Statut |
|----------|-----|--------|
| Health | `/api/health` | ✅ 200 |
| Projects | `/api/projects` | ✅ 200 |
| Jobs | `/api/jobs` | ✅ 200 |
| Prompts | `/api/prompts` | ✅ 200 |
| Logs | `/api/logs` | ✅ 200 |
| Stats | `/api/stats` | ✅ 200 |
| Electricity | `/api/electricity` | ✅ 200 |
| Collateral | `/api/collateral` | ✅ 200 |
| Cockpit | `/api/cockpit` | ✅ 200 |

## ⚠️ Endpoints avec problèmes

| Endpoint | URL | Statut | Problème |
|----------|-----|--------|----------|
| Versions | `/api/versions` | ⚠️ 400 | Bad Request - Vérifier les paramètres requis |
| Calculator | `/api/calculator` | ❌ 404 | **Route non montée sur Railway** |

## 🔧 Configuration Frontend

### Variables d'environnement
```env
NEXT_PUBLIC_API_URL="https://hearstaibackend-production.up.railway.app"
```

### Mapping des endpoints

**Backend Railway:**
- Projects, Jobs, Versions, Prompts, Logs, Stats
- Health check
- Electricity, Collateral, Cockpit (mock data)

**Next.js API Routes:**
- Customers (avec Prisma + DeBank)
- Fireblocks (vaults, transactions)
- Calculator (fallback si Railway n'a pas)

## 📝 Actions requises

### 1. Calculator endpoint sur Railway
**Problème:** Le routeur calculator n'est pas monté sur Railway

**Solution:**
- Vérifier que le backend Railway a le routeur calculator dans `server.js`
- Le routeur existe dans `/routes/calculator.js`
- Il doit être monté avec: `app.use('/api/calculator', calculatorRouter)`

### 2. Versions endpoint
**Problème:** Retourne 400 Bad Request

**Action:** Vérifier les logs Railway pour comprendre pourquoi

## ✅ Frontend Configuration

Le frontend est correctement configuré pour utiliser Railway :
- `lib/api.ts` utilise `NEXT_PUBLIC_API_URL`
- Les routes calculator Next.js utilisent aussi `NEXT_PUBLIC_API_URL`
- Fallback automatique vers Next.js si Railway n'est pas disponible

## 🎯 Résumé

**Total endpoints:** 11
- ✅ **9 fonctionnels** (82%)
- ⚠️ **1 avec problème** (9%)
- ❌ **1 manquant** (9%)

**Recommandation:** 
1. Ajouter le routeur calculator au backend Railway
2. Vérifier les logs pour l'endpoint versions
3. Tester tous les endpoints depuis le frontend

