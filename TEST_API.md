# 🧪 GUIDE DE TEST DES APIs

## Tests Rapides

### 1. Test du statut des APIs
```bash
curl http://localhost:6001/api/status | jq
```

### 2. Test Fireblocks - Liste des vaults
```bash
curl http://localhost:6001/api/fireblocks/vaults \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

### 3. Test Fireblocks - Créer une transaction
```bash
curl -X POST http://localhost:6001/api/fireblocks/transactions \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "assetId": "BTC",
    "source": {
      "type": "VAULT_ACCOUNT",
      "id": "0"
    },
    "destination": {
      "type": "EXTERNAL_WALLET",
      "oneTimeAddress": {
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      }
    },
    "amount": "0.001"
  }'
```

### 4. Test DeBank - Collatéral
```bash
curl "http://localhost:6001/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&chains=eth"
```

### 5. Test Hashprice
```bash
curl http://localhost:6001/api/hashprice/current
```

---

## Tests avec le Script Automatique

### Test complet de toutes les APIs
```bash
node scripts/test-all-apis.js
```

### Test dédié Fireblocks (recommandé)
```bash
node scripts/test-fireblocks.js
```

Ce script teste:
- ✅ Configuration des clés API Fireblocks
- ✅ Connexion directe à l'API Fireblocks
- ✅ Routes API locales (`/api/fireblocks/*`)
- ✅ Format et validité de la clé privée

---

## Tests dans le Navigateur

### Console du navigateur
```javascript
// Vérifier le statut
fetch('/api/status')
  .then(r => r.json())
  .then(console.log);

// Lister les vaults Fireblocks
fetch('/api/fireblocks/vaults')
  .then(r => r.json())
  .then(console.log);
```

---

## Tests avec Postman/Insomnia

### Collection Postman
1. Importez les routes depuis `examples/fireblocks-usage.ts`
2. Configurez l'authentification NextAuth
3. Testez chaque endpoint

---

## Vérification des Erreurs

### Si Fireblocks retourne 503
```json
{
  "error": "Fireblocks API non configurée",
  "message": "Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY dans .env.local"
}
```
➡️ Ajoutez les clés dans `.env.local`

### Si DeBank retourne des données mockées
➡️ Normal si `DEBANK_ACCESS_KEY` n'est pas configuré
➡️ Les données mockées sont utilisées en fallback

### Si erreur 401 Unauthorized
➡️ Vous devez être authentifié avec NextAuth
➡️ Connectez-vous d'abord sur l'application

---

## Tests d'Intégration

### Test complet Fireblocks
```bash
# 1. Vérifier la configuration
curl http://localhost:6001/api/status | jq '.status.fireblocks'

# 2. Lister les vaults
curl http://localhost:6001/api/fireblocks/vaults

# 3. Créer une transaction (si configuré)
# Voir exemple ci-dessus
```

---

## Monitoring

### Logs en temps réel
```bash
# Terminal 1: Serveur Next.js
npm run dev

# Terminal 2: Surveiller les logs
tail -f .next/server.log
```

### Vérifier les erreurs
Toutes les erreurs API sont loggées dans la console avec le préfixe:
- `[Fireblocks API]` pour Fireblocks
- `[API Collateral]` pour DeBank
- `[API Status]` pour le statut

---

## Performance

### Temps de réponse attendus
- CoinGecko: < 500ms
- Blockchain.info: < 500ms
- DeBank: < 2s
- Fireblocks: < 3s
- Status: < 1s

---

**✅ Utilisez ces tests pour valider que tout fonctionne correctement !**

