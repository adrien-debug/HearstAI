# ⚠️ Variables d'Environnement Manquantes

## ✅ Variables Déjà Configurées

D'après votre configuration Vercel, vous avez déjà :
- ✅ `HEARST_API_URL` - URL de l'API Hearst
- ✅ `HEARST_API_TOKEN` - Token d'authentification
- ✅ `NEXTAUTH_URL` - URL NextAuth
- ✅ `DATABASE_URL` - Base de données Prisma
- ✅ `NEXTAUTH_SECRET` - Secret NextAuth
- ✅ `DEBANK_ACCESS_KEY` - Clé API DeBank
- ✅ `NODE_ENV` - Environnement Node.js

## ❌ Variables Manquantes (Optionnelles mais Recommandées)

### Base de Données Externe pour Prix Crypto

Ces variables sont utilisées pour récupérer les prix Bitcoin historiques dans l'API Cockpit. **Sans elles, l'API fonctionnera mais retournera des valeurs à 0 pour les prix USD.**

```bash
EXTERNAL_DB_HOST=votre_host_postgres
EXTERNAL_DB_NAME=votre_nom_database
EXTERNAL_DB_USER=votre_utilisateur
EXTERNAL_DB_PASSWORD=votre_mot_de_passe
EXTERNAL_DB_PORT=5432
```

**Où les ajouter :**
1. Vercel Dashboard → Settings → Environment Variables
2. Cliquer sur "Add New"
3. Ajouter chaque variable pour **Production, Preview, et Development**

**Impact si manquantes :**
- ✅ L'API Cockpit fonctionnera toujours
- ⚠️ Les prix Bitcoin seront à 0 USD
- ⚠️ Les valeurs USD des revenus seront à 0
- ✅ Les données de hashrate et miners fonctionneront normalement

## 🔍 Comment Vérifier si Elles Sont Nécessaires

### Test 1 : Vérifier les logs Vercel

```bash
vercel logs
```

Cherchez ces messages :
- `[Cockpit API] External database credentials are not configured`
- `[Earnings Chart API] External database not configured`

Si vous voyez ces messages, les variables manquent.

### Test 2 : Tester l'API Cockpit

```bash
curl https://votre-app.vercel.app/api/cockpit
```

Vérifiez dans la réponse :
- `btcProduction24hUSD: 0` → Variables manquantes
- `btcProduction24hUSD: [valeur]` → Variables configurées

## 📝 Variables Optionnelles Supplémentaires

### Pour le Backend Express (si utilisé)

Si vous utilisez le backend Express séparé :
```bash
BACKEND_URL=http://localhost:4000  # En local uniquement
```

### Pour Google Drive (si utilisé)

```bash
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
```

### Pour Fireblocks (si utilisé)

```bash
FIREBLOCKS_API_KEY=votre_api_key
FIREBLOCKS_SECRET_KEY=votre_secret_key
```

## ✅ Checklist Finale

- [x] `HEARST_API_URL` - ✅ Configuré
- [x] `HEARST_API_TOKEN` - ✅ Configuré
- [x] `DATABASE_URL` - ✅ Configuré
- [x] `NEXTAUTH_URL` - ✅ Configuré
- [x] `NEXTAUTH_SECRET` - ✅ Configuré
- [ ] `EXTERNAL_DB_HOST` - ⚠️ **MANQUANT** (optionnel)
- [ ] `EXTERNAL_DB_NAME` - ⚠️ **MANQUANT** (optionnel)
- [ ] `EXTERNAL_DB_USER` - ⚠️ **MANQUANT** (optionnel)
- [ ] `EXTERNAL_DB_PASSWORD` - ⚠️ **MANQUANT** (optionnel)
- [ ] `EXTERNAL_DB_PORT` - ⚠️ **MANQUANT** (optionnel)

## 🎯 Conclusion

**Votre configuration actuelle est suffisante pour faire fonctionner l'API Cockpit !**

Les variables `EXTERNAL_DB_*` sont **optionnelles** et ne sont nécessaires que si vous voulez :
- Afficher les prix Bitcoin historiques
- Calculer les valeurs USD des revenus
- Avoir des données complètes dans les graphiques

**Sans ces variables :**
- ✅ L'API fonctionne
- ✅ Les données de hashrate fonctionnent
- ✅ Les données de miners fonctionnent
- ⚠️ Les prix USD seront à 0

**Avec ces variables :**
- ✅ Tout fonctionne
- ✅ Prix Bitcoin historiques disponibles
- ✅ Valeurs USD calculées correctement


