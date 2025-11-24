# 🔌 GUIDE DE CONFIGURATION DEBANK API

## 📋 Étape 1: Obtenir votre clé API

1. Allez sur **https://pro.debank.com/**
2. Créez un compte ou connectez-vous
3. Accédez à la section **API Keys**
4. Générez une nouvelle clé API
5. Copiez la clé (elle ne sera affichée qu'une seule fois !)

## 📋 Étape 2: Configurer la clé

### Option A: Créer .env.local (recommandé)

```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
cp .env.example .env.local
```

Puis éditez `.env.local` et ajoutez :
```env
DEBANK_ACCESS_KEY=votre_cle_api_ici
```

### Option B: Variable d'environnement temporaire

```bash
export DEBANK_ACCESS_KEY=votre_cle_api_ici
node scripts/test-debank.js
```

## 📋 Étape 3: Tester la connexion

```bash
node scripts/test-debank.js
```

## ✅ Résultat attendu

Si tout fonctionne, vous devriez voir :
```
✅ Clé API trouvée: xxxxxxxx...xxxx
✅ Connexion à l'API DeBank réussie !
   Protocoles trouvés: X
```

## 🔍 Test via l'API Next.js

Une fois la clé configurée, testez via votre route API :

```bash
# Démarrer le serveur Next.js
npm run dev

# Dans un autre terminal
curl "http://localhost:6001/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&chains=eth"
```

## ⚠️ Notes importantes

1. **Sécurité** : Ne commitez JAMAIS `.env.local` dans Git
2. **Rate Limits** : DeBank a des limites de requêtes par minute
3. **Fallback** : Si la clé n'est pas configurée, l'API utilise des données mockées
4. **Chains supportées** : `eth`, `arb`, `base`, `bsc`, etc.

## 🐛 Dépannage

### Erreur 401/403
➡️ Clé API invalide ou expirée. Régénérez une nouvelle clé.

### Erreur 429
➡️ Rate limit atteint. Attendez quelques minutes.

### Timeout
➡️ Problème de connexion. Vérifiez votre internet.

### Aucun protocole trouvé
➡️ Normal si le wallet n'a pas de positions DeFi actives.

## 📚 Documentation

- **DeBank Pro API** : https://pro-openapi.debank.com/
- **Documentation complète** : `DEBANK_INTEGRATION.md`

---

**✅ Une fois configuré, votre API DeBank sera fonctionnelle !**


