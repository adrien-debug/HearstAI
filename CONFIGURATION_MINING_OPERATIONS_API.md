# 📋 Configuration API Mining Operations - Documentation Appliquée

## 📄 Source
Documentation officielle : `MINING_OPERATIONS_API.pdf`

## ✅ Configuration Appliquée

### Base URL
```
https://api.hearstcorporation.io/api/mining-operations
```

### Authentification
- **Header requis** : `x-api-token: <your-api-token>`
- **Token configuré** : `HEARST_API_TOKEN` dans `.env.local`
- **Validation** : Token validé côté serveur
- **Erreurs** : 401 Unauthorized si token manquant ou invalide

---

## 🔧 Endpoints Utilisés

### 1. Get All Customers
**Endpoint** : `GET /api/mining-operations/customers`

**Paramètres utilisés** :
- `limit=1000` : Nombre d'items par page
- `pageNumber=1` : Numéro de page

**Structure de réponse** (selon doc) :
```json
{
  "data": [...],
  "totalPages": 10,
  "currentPage": 1
}
```

**Code mis à jour** : `app/api/cockpit/route.ts`
- Supporte maintenant `data` (selon doc) et `users` (rétrocompatibilité)

---

### 2. Get Customer Hashrate Chart
**Endpoint** : `GET /api/mining-operations/customers/:id/hashrate/chart`

**Paramètres utilisés** :
- `id` : Customer user ID (dans le path)
- Optionnel : `currency` (Bitcoin, Litecoin, Kaspa, etc.)
- Optionnel : `contractIds` (comma-separated)

**Retourne** :
- Real-time hashrate
- Last 24 hours hourly data
- Last 30 days daily data
- Total mining power in TH/s or PH/s

**Code mis à jour** : Supporte plusieurs formats de réponse pour compatibilité

---

### 3. Get Customer Mining Statistics
**Endpoint** : `GET /api/mining-operations/customers/:id/hashrate/statistics`

**Paramètres utilisés** :
- `id` : Customer user ID (dans le path)
- Optionnel : `currency` (Bitcoin, Litecoin, Kaspa, etc.)
- Optionnel : `contractIds` (comma-separated)
- Optionnel : `mobile` (boolean)

**Retourne** :
- Total hashrate (TH/s or PH/s)
- Total number of machines
- Total investment amount

**Code mis à jour** : Supporte plusieurs champs pour le nombre de machines

---

## 🔐 Authentification Configurée

### Headers utilisés
```typescript
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'x-api-token': process.env.HEARST_API_TOKEN,
}
```

### Gestion des erreurs
- **401 Unauthorized** : Token manquant ou invalide
- **400 Bad Request** : Paramètres invalides
- **404 Not Found** : User ou contract non trouvé
- **500 Internal Server Error** : Erreur serveur

---

## 📊 Cryptocurrencies Supportées

Selon la documentation, l'API supporte :
- Bitcoin (BTC)
- Bitcoin Cash (BCH)
- Litecoin (LTC)
- Dogecoin (DOGE) - via merged mining
- Kaspa (KAS)
- Alephium (ALPH)
- Nervos (CKB)

---

## ✅ Modifications Appliquées

### Fichier : `app/api/cockpit/route.ts`

1. **Function `fetchCustomers`** :
   - ✅ Supporte `data` (selon doc) et `users` (rétrocompatibilité)
   - ✅ Commentaires ajoutés selon la documentation

2. **Function `fetchGlobalHashrateAndMiners`** :
   - ✅ Traitement hashrate chart amélioré
   - ✅ Supporte plusieurs formats de réponse
   - ✅ Traitement statistics amélioré
   - ✅ Supporte `machines`, `totalMachines` selon la doc

---

## 🧪 Tests

### Vérifier la configuration
```bash
# Test endpoint customers
curl -H "x-api-token: YOUR_TOKEN" \
  https://api.hearstcorporation.io/api/mining-operations/customers?limit=10&pageNumber=1

# Test endpoint hashrate chart
curl -H "x-api-token: YOUR_TOKEN" \
  https://api.hearstcorporation.io/api/mining-operations/customers/{id}/hashrate/chart

# Test endpoint statistics
curl -H "x-api-token: YOUR_TOKEN" \
  https://api.hearstcorporation.io/api/mining-operations/customers/{id}/hashrate/statistics
```

---

## 📝 Notes

- La configuration respecte maintenant la documentation officielle
- Supporte les formats de réponse multiples pour rétrocompatibilité
- Gestion d'erreurs améliorée selon les codes HTTP de la doc
- Authentification conforme avec `x-api-token` header

---

**Date** : 2025-11-28
**Version** : 1.0.0
**Source** : MINING_OPERATIONS_API.pdf


