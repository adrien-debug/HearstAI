# 🚀 GUIDE DE DÉMARRAGE RAPIDE - APIs

## ⚡ Démarrage en 3 étapes

### 1️⃣ Copier le fichier de configuration
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
cp .env.example .env.local
```

### 2️⃣ Configurer les clés API (optionnel)
Éditez `.env.local` et ajoutez vos clés :
```env
DEBANK_ACCESS_KEY=votre_cle
ANTHROPIC_API_KEY=votre_cle
FIREBLOCKS_API_KEY=votre_cle
FIREBLOCKS_PRIVATE_KEY=votre_cle
```

### 3️⃣ Tester les connexions
```bash
node scripts/test-api-connections.js
```

---

## ✅ APIs Disponibles

### APIs Gratuites (fonctionnent sans configuration)
- ✅ **CoinGecko** - Prix Bitcoin
- ✅ **Blockchain.info** - Hashrate Bitcoin

### APIs Premium (nécessitent des clés)
- ⚠️ **DeBank** - Collatéral DeFi (`DEBANK_ACCESS_KEY`)
- ⚠️ **Anthropic Claude** - Jobs AI (`ANTHROPIC_API_KEY`)
- ⚠️ **Fireblocks** - Transactions Crypto (`FIREBLOCKS_API_KEY`, `FIREBLOCKS_PRIVATE_KEY`)
- ⚠️ **Luxor** - Hashprice Premium (`LUXOR_API_KEY`)

---

## 🔗 Routes API Disponibles

### Routes Fireblocks (nouvelles)
- `GET /api/fireblocks/transactions?id=xxx` - Récupère une transaction
- `POST /api/fireblocks/transactions` - Crée une transaction
- `GET /api/fireblocks/vaults?id=xxx` - Liste les comptes vault

### Route de statut (nouvelle)
- `GET /api/status` - Statut de toutes les APIs

### Routes existantes
- `GET /api/collateral` - Collatéral DeBank
- `GET /api/hashprice/current` - Hashprice Bitcoin
- `GET /api/calculator/*` - Calculator
- Et toutes les autres routes Next.js...

---

## 🧪 Tester rapidement

### Test 1: Statut des APIs
```bash
curl http://localhost:6001/api/status
```

### Test 2: CoinGecko (gratuit)
```bash
curl http://localhost:6001/api/hashprice/current
```

### Test 3: DeBank (si configuré)
```bash
curl "http://localhost:6001/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

## 📚 Documentation Complète

- `VERIFICATION_API.md` - Rapport de vérification détaillé
- `INTEGRATION_API_COMPLETE.md` - Guide d'intégration complet
- `RESUME_INTEGRATION.md` - Résumé de l'intégration

---

## ⚠️ Notes Importantes

1. **Sécurité**: Ne commitez JAMAIS `.env.local` dans Git
2. **Fallbacks**: Les APIs non configurées utilisent des données mockées
3. **Authentification**: Les routes Fireblocks nécessitent NextAuth

---

**✅ Tout est prêt ! Il ne reste plus qu'à configurer les clés API si nécessaire.**


