# 🧪 GUIDE DE TESTS - SYNCHRONISATION V3

## 🚀 DÉMARRAGE

### 1. Démarrer le backend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/backend"
npm install  # Si nécessaire
npm start
# Ou en mode dev
npm run dev
```

**Vérifier :** Backend accessible sur http://localhost:5001

### 2. Démarrer le frontend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
npm install  # Si nécessaire
npm run dev
```

**Vérifier :** Frontend accessible sur http://localhost:6001

---

## 📡 TESTS API CALCULATOR

### Test 1 : Métriques Bitcoin
```bash
curl http://localhost:6001/api/calculator/metrics
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "btcPrice": 85000,
    "networkHashrate": 600000000,
    "hashprice": 45.2,
    "hashpriceTH": 45.2,
    "hashpricePH": 45200,
    "timestamp": "2025-11-23T..."
  }
}
```

### Test 2 : Calcul Profitabilité
```bash
curl -X POST http://localhost:6001/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "hashrate": 110,
    "power": 3250,
    "electricity": 0.08,
    "equipmentCost": 4500
  }'
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "metrics": {...},
    "profitability": {
      "daily": {...},
      "monthly": {...},
      "yearly": {...}
    },
    "roi": {
      "breakEvenDays": 120,
      "breakEvenMonths": "4.0",
      "roi1Year": "250.5",
      "roi2Years": "500.0"
    }
  }
}
```

### Test 3 : Projection 12 mois
```bash
curl "http://localhost:6001/api/calculator/projection?months=12&hashrate=110&power=3250&electricity=0.08&equipmentCost=4500"
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "metrics": {...},
    "monthlyProfitability": {...},
    "projection": [
      {
        "month": 1,
        "revenue": 13500,
        "cost": 6240,
        "profit": 7260,
        "cumulativeProfit": 2760,
        "roi": 61.33
      },
      ...
    ],
    "breakEvenMonth": 1
  }
}
```

---

## 📡 TESTS API SETUP

### Test 1 : Liste des mineurs
```bash
curl http://localhost:6001/api/setup/miners
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": [
    {
      "id": "miner-001",
      "model": "Antminer S19 Pro",
      "hashrate": 110,
      "power": 3250,
      "status": "active",
      ...
    }
  ]
}
```

### Test 2 : Liste des hébergeurs
```bash
curl http://localhost:6001/api/setup/hosters
```

### Test 3 : Prix crypto
```bash
curl http://localhost:6001/api/setup/prices
```

### Test 4 : Résumé configuration
```bash
curl http://localhost:6001/api/setup/summary
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalMiners": 1,
      "activeMiners": 1,
      "totalHashrate": "0.11",
      "totalPower": "3.25"
    },
    "costs": {...},
    "revenue": {...},
    "deployment": {...},
    "configuration": {...}
  }
}
```

---

## 📡 TESTS API TRANSACTIONS

### Test 1 : Liste toutes les transactions
```bash
curl http://localhost:6001/api/transactions
```

### Test 2 : Filtrer par status
```bash
curl "http://localhost:6001/api/transactions?status=pending"
```

### Test 3 : Filtrer par période
```bash
curl "http://localhost:6001/api/transactions?period=daily"
```

### Test 4 : Créer une transaction
```bash
curl -X POST http://localhost:6001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "from": {
      "walletId": "wallet-001",
      "name": "Main Mining Wallet",
      "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
    },
    "to": {
      "walletId": "wallet-101",
      "name": "Cold Storage Vault",
      "address": "3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy"
    },
    "amount": 0.5,
    "currency": "BTC",
    "status": "pending"
  }'
```

---

## 📡 TESTS API WALLETS

### Test 1 : Liste tous les wallets
```bash
curl http://localhost:6001/api/wallets
```

### Test 2 : Wallets source uniquement
```bash
curl "http://localhost:6001/api/wallets?type=source"
```

### Test 3 : Wallets destination uniquement
```bash
curl "http://localhost:6001/api/wallets?type=destination"
```

---

## 📡 TESTS API CUSTOMERS

### Test 1 : Liste customers
```bash
curl http://localhost:6001/api/customers
```

### Test 2 : Créer customer
```bash
curl -X POST http://localhost:6001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client Test",
    "erc20Address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "tag": "Client Premium",
    "chains": ["eth", "bsc"],
    "protocols": ["Uniswap", "PancakeSwap"]
  }'
```

---

## 📡 TESTS BACKEND DIRECT

### Test 1 : Health Check
```bash
curl http://localhost:5001/api/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "timestamp": "2025-11-23T...",
  "environment": "local"
}
```

### Test 2 : Hashprice Lite
```bash
curl http://localhost:5001/api/hashprice-lite
```

**Résultat attendu :**
```json
{
  "btcPrice": 85000,
  "networkHashrate": 600000000,
  "hashprice": 45.2,
  "hashpriceTH": 45.2,
  "hashpricePH": 45200,
  "timestamp": "2025-11-23T..."
}
```

### Test 3 : Calculator Metrics (Backend)
```bash
curl http://localhost:5001/api/calculator/metrics
```

---

## ✅ CHECKLIST DE VALIDATION

### Calculator API
- [ ] Métriques Bitcoin fonctionnent
- [ ] Calcul profitabilité fonctionne
- [ ] Projection fonctionne
- [ ] Gestion d'erreurs correcte

### Setup API
- [ ] Miners CRUD fonctionne
- [ ] Hosters CRUD fonctionne
- [ ] Prices CRUD fonctionne
- [ ] Summary génère correctement

### Transactions API
- [ ] GET liste fonctionne
- [ ] POST création fonctionne
- [ ] PUT mise à jour fonctionne
- [ ] DELETE suppression fonctionne
- [ ] Filtres fonctionnent

### Wallets API
- [ ] GET liste fonctionne
- [ ] POST création fonctionne
- [ ] PUT mise à jour fonctionne
- [ ] DELETE suppression fonctionne
- [ ] Filtre par type fonctionne

### Customers API
- [ ] GET liste fonctionne
- [ ] POST création fonctionne
- [ ] Validation adresse ERC20 fonctionne
- [ ] Gestion erreurs correcte

### Backend
- [ ] Health check répond
- [ ] Hashprice Lite fonctionne
- [ ] Calculator routes fonctionnent
- [ ] Port 5001 accessible

---

## 🐛 DÉPANNAGE

### Erreur : Backend non accessible
**Solution :** Vérifier que le backend tourne sur le port 5001
```bash
lsof -i :5001
```

### Erreur : Routes API 404
**Solution :** Vérifier que le frontend Next.js est démarré
```bash
lsof -i :6001
```

### Erreur : CORS
**Solution :** Vérifier que CORS est activé dans `backend/server.js`

### Erreur : Données mockées
**Note :** C'est normal, plusieurs endpoints utilisent des données mockées pour le développement.

---

## 📊 RÉSULTATS ATTENDUS

Tous les tests doivent retourner :
- ✅ Status code 200 ou 201
- ✅ Structure JSON valide
- ✅ Champs requis présents
- ✅ Pas d'erreurs dans les logs

---

**Bon test ! 🚀**

