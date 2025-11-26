# 📊 Guide d'Analyse d'Identifiants - HearstAI

## 🎯 Système d'Analyse d'Identifiants

Un système complet a été créé pour analyser et intégrer différents types d'identifiants dans HearstAI.

### ✅ Ce qui a été créé

1. **Script d'analyse** (`scripts/analyze-identifier.js`)
   - Identifie automatiquement le type d'identifiant
   - Récupère les données depuis DeBank, Fireblocks, ou la base de données
   - Crée ou met à jour automatiquement les customers

2. **API Endpoint** (`/api/data-analysis/[identifier]`)
   - Endpoint REST pour analyser n'importe quel identifiant
   - Retourne les données structurées en JSON
   - Supporte tous les types d'identifiants

### 📋 Types d'identifiants supportés

1. **Adresses ERC20** (format: `0x...`)
   - Détection automatique
   - Récupération des données DeBank
   - Calcul du health factor et des positions

2. **UUID Fireblocks** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   - Détection automatique
   - Récupération des données Vault ou Wallet

3. **Identifiants personnalisés** (comme `EanqSBKHd`)
   - Recherche dans la base de données
   - Association avec des customers existants
   - Récupération des données associées

## 🚀 Utilisation

### Via le script

```bash
# Analyser un identifiant
node scripts/analyze-identifier.js EanqSBKHd

# Analyser une adresse ERC20
node scripts/analyze-identifier.js 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Analyser un UUID Fireblocks
node scripts/analyze-identifier.js 8220b577-89f6-4968-a786-f1f158ccd0f6
```

### Via l'API

```bash
# GET /api/data-analysis/EanqSBKHd
curl http://localhost:6001/api/data-analysis/EanqSBKHd

# GET /api/data-analysis/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
curl http://localhost:6001/api/data-analysis/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## 📊 Résultat de l'analyse pour "EanqSBKHd"

**Type identifié:** `custom_id`

**Statut:** Identifiant non trouvé dans la base de données

**Actions possibles:**

1. **Créer un nouveau customer avec cet identifiant**
   - Si c'est un nom ou un identifiant client
   - Associer une adresse ERC20 si disponible

2. **Rechercher dans d'autres sources**
   - Vérifier si c'est un identifiant Fireblocks
   - Vérifier si c'est un identifiant de projet

3. **Utiliser comme référence**
   - Stocker comme tag ou référence interne
   - Créer un mapping personnalisé

## 🔧 Prochaines étapes

Pour intégrer "EanqSBKHd" dans le système:

### Option 1: Créer un customer

Si vous avez une adresse ERC20 associée:

```bash
node scripts/add-customer-direct.js "EanqSBKHd" "0x..." "Client" "eth"
```

### Option 2: Utiliser l'API

```bash
# Créer via l'API
curl -X POST http://localhost:6001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "EanqSBKHd",
    "erc20Address": "0x...",
    "tag": "Client"
  }'
```

### Option 3: Recherche avancée

Si "EanqSBKHd" est un identifiant dans un autre système:
- Vérifier les fichiers Excel d'import
- Vérifier les identifiants Fireblocks
- Vérifier les projets existants

## 📝 Notes

- Le système détecte automatiquement le type d'identifiant
- Les données sont récupérées en temps réel depuis DeBank
- Les customers sont automatiquement créés ou mis à jour
- Le health factor est calculé automatiquement

## 🐛 Dépannage

Si vous rencontrez des erreurs:

1. **Erreur de connexion DB**: Vérifiez `DATABASE_URL` dans `.env.local`
2. **Erreur DeBank**: Vérifiez `DEBANK_ACCESS_KEY` dans `.env.local`
3. **Erreur Fireblocks**: Vérifiez `FIREBLOCKS_API_KEY` et `FIREBLOCKS_PRIVATE_KEY`

## 📚 Documentation API

L'endpoint `/api/data-analysis/[identifier]` retourne:

```json
{
  "identifier": "EanqSBKHd",
  "type": "custom_id",
  "timestamp": "2025-11-25T01:40:15.191Z",
  "data": {
    "type": "erc20_address",
    "address": "0x...",
    "data": {
      "name": "...",
      "totalValue": 12345.67,
      "totalDebt": 1000.00,
      "healthFactor": 12.35,
      "positions": [...]
    },
    "source": "debank"
  },
  "database": {
    "customers": [...],
    "projects": [...]
  }
}
```




