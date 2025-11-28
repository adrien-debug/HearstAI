# Configuration Railway - Endpoints Data (Miners & Hosters)

## 📋 Situation actuelle

**Non, les données ne sont PAS stockées sur Railway actuellement.**

### Stockage actuel
- ✅ Endpoints créés dans Next.js : `app/api/datas/miners/*` et `app/api/datas/hosters/*`
- ❌ Stockage en mémoire (perdu au redémarrage) : `lib/datas-storage.ts`
- ❌ Pas d'endpoints sur Railway backend

## 🚀 Solution : Migrer vers Railway

### 1. Fichiers créés dans le backend Railway

✅ **Routes créées :**
- `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI-Backend/routes/datas.js`
  - GET/POST `/api/datas/miners`
  - GET/PUT/DELETE `/api/datas/miners/:id`
  - GET/POST `/api/datas/hosters`
  - GET/PUT/DELETE `/api/datas/hosters/:id`

✅ **Schéma base de données :**
- `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI-Backend/database/schema-datas.sql`
  - Table `miners`
  - Table `hosters`

✅ **Server.js mis à jour :**
- Route `/api/datas` ajoutée

### 2. Étapes pour déployer sur Railway

#### A. Créer les tables dans PostgreSQL

```sql
-- Exécuter schema-datas.sql sur Railway PostgreSQL
```

#### B. Déployer le backend Railway

```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI-Backend"
git add routes/datas.js database/schema-datas.sql server.js
git commit -m "feat: add datas endpoints (miners/hosters) to Railway backend"
git push origin main
```

#### C. Mettre à jour le frontend

Modifier `lib/api.ts` ou créer un nouveau client API pour pointer vers Railway :

```typescript
// Utiliser NEXT_PUBLIC_API_URL pour les endpoints datas
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
```

### 3. Migration des données

Si vous avez déjà des données dans Next.js (localStorage), créer un script de migration :

```typescript
// Script de migration (à exécuter une fois)
const migrateToRailway = async () => {
  const localMiners = JSON.parse(localStorage.getItem('miners-data') || '[]')
  const localHosters = JSON.parse(localStorage.getItem('hosters-data') || '[]')
  
  for (const miner of localMiners) {
    await fetch(`${API_BASE}/api/datas/miners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(miner)
    })
  }
  
  for (const hoster of localHosters) {
    await fetch(`${API_BASE}/api/datas/hosters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hoster)
    })
  }
}
```

## 📊 Comparaison

| Aspect | Actuel (Next.js) | Railway (Proposé) |
|--------|------------------|-------------------|
| **Stockage** | Mémoire RAM | PostgreSQL |
| **Persistance** | ❌ Perdu au redémarrage | ✅ Permanent |
| **Scalabilité** | ❌ Limité | ✅ Illimitée |
| **Backup** | ❌ Aucun | ✅ Automatique |
| **Performance** | ⚠️ Variable | ✅ Optimisée |

## ✅ Avantages de Railway

1. **Persistance réelle** : Données sauvegardées en PostgreSQL
2. **Scalabilité** : Gère des milliers d'entrées
3. **Backup automatique** : Railway gère les backups
4. **Performance** : Index et optimisations SQL
5. **Sécurité** : Base de données sécurisée

## 🔄 Prochaines étapes

1. ✅ Routes créées dans Railway backend
2. ⏳ Créer les tables PostgreSQL sur Railway
3. ⏳ Déployer le backend Railway
4. ⏳ Modifier le frontend pour utiliser Railway
5. ⏳ Migrer les données existantes (si nécessaire)

## 📝 Notes

- Les endpoints Next.js continueront de fonctionner en fallback
- La migration peut se faire progressivement
- Les deux systèmes peuvent coexister pendant la transition

