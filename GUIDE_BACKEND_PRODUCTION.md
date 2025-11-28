# 🔌 Guide : Connexion Backend Production & Modifications API Cockpit

## 📍 Où se trouve votre API Cockpit ?

### Routes API Cockpit disponibles :

1. **API Cockpit Principale** : `/app/api/cockpit/route.ts`
   - Route : `GET /api/cockpit`
   - Retourne : Données globales du cockpit (hashrate, miners, BTC production, etc.)

2. **API Cockpit Earnings Chart** : `/app/api/cockpit/earnings-chart/route.ts`
   - Route : `GET /api/cockpit/earnings-chart?timeframe=week|month|year`
   - Retourne : Données pour les graphiques de revenus

3. **API Cockpit Hashrate Chart** : `/app/api/cockpit/hashrate-chart/route.ts` (si existe)
   - Route : `GET /api/cockpit/hashrate-chart`
   - Retourne : Données pour les graphiques de hashrate

---

## 🔑 Variables d'Environnement Requises

### Pour la Production (Vercel)

Vous devez configurer ces variables dans **Vercel Dashboard** → **Settings** → **Environment Variables** :

```bash
# Backend Hearst API
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=votre_token_api_ici

# Base de données externe (pour les prix crypto)
EXTERNAL_DB_HOST=votre_host_db
EXTERNAL_DB_NAME=votre_nom_db
EXTERNAL_DB_USER=votre_user_db
EXTERNAL_DB_PASSWORD=votre_password_db
EXTERNAL_DB_PORT=5432

# NextAuth
NEXTAUTH_URL=https://votre-app.vercel.app
NEXTAUTH_SECRET=votre_secret_ici

# Database Prisma
DATABASE_URL=votre_url_prisma
```

### Pour le Développement Local

Créez/modifiez `.env.local` :

```bash
# Backend Hearst API
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=votre_token_api_ici

# Base de données externe (optionnel en local)
EXTERNAL_DB_HOST=votre_host_db
EXTERNAL_DB_NAME=votre_nom_db
EXTERNAL_DB_USER=votre_user_db
EXTERNAL_DB_PASSWORD=votre_password_db
EXTERNAL_DB_PORT=5432

# NextAuth
NEXTAUTH_URL=http://localhost:6001
NEXTAUTH_SECRET=votre_secret_ici

# Database Prisma
DATABASE_URL=votre_url_prisma
```

---

## 🛠️ Comment Faire des Modifications en Toute Sécurité

### 1. **Tester en Local d'Abord**

```bash
# 1. Créer une branche pour vos modifications
git checkout -b feature/modification-cockpit

# 2. Modifier le code dans /app/api/cockpit/route.ts

# 3. Tester en local
npm run dev

# 4. Tester l'API
curl http://localhost:6001/api/cockpit
```

### 2. **Utiliser un Environnement de Staging**

Si vous avez un environnement de staging sur Vercel :

```bash
# 1. Créer une branche preview
git push origin feature/modification-cockpit

# 2. Vercel créera automatiquement un preview deployment
# 3. Tester sur l'URL preview
# 4. Si tout fonctionne, merger dans main
```

### 3. **Protection avec Feature Flags**

Ajoutez des feature flags pour activer/désactiver les nouvelles fonctionnalités :

```typescript
// Dans app/api/cockpit/route.ts
const USE_NEW_FEATURE = process.env.ENABLE_NEW_COCKPIT_FEATURE === 'true'

if (USE_NEW_FEATURE) {
  // Nouvelle logique
} else {
  // Ancienne logique
}
```

### 4. **Logs et Monitoring**

Ajoutez des logs pour surveiller les erreurs :

```typescript
console.log('[Cockpit API] Request received:', {
  timestamp: new Date().toISOString(),
  userAgent: request.headers.get('user-agent'),
})

try {
  // Votre code
} catch (error) {
  console.error('[Cockpit API] Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  })
  // Retourner des données vides au lieu d'une erreur 500
  return NextResponse.json({ data: { /* données vides */ } })
}
```

---

## 📝 Structure de l'API Cockpit

### Fichier Principal : `/app/api/cockpit/route.ts`

**Fonctions principales :**

1. **`getExternalDbConnection()`** : Connexion à la base de données externe pour les prix crypto
2. **`fetchCustomers()`** : Récupère les customers depuis l'API Hearst
3. **`fetchGlobalHashrateAndMiners()`** : Récupère le hashrate global et le nombre de miners
4. **`fetchTheoreticalHashrate()`** : Calcule le hashrate théorique depuis la base de données
5. **`fetchBTCProduction24h()`** : Calcule la production BTC des 24 dernières heures
6. **`fetchBitcoinPriceYesterday()`** : Récupère le prix Bitcoin d'hier
7. **`fetchMiningAccounts()`** : Récupère les comptes de minage

**Endpoint GET `/api/cockpit` :**

```typescript
// Retourne :
{
  data: {
    globalHashrate: number,        // PH/s (depuis API externe)
    theoreticalHashrate: number,   // PH/s (depuis DB)
    btcProduction24h: number,      // BTC
    btcProduction24hUSD: number,   // USD
    totalMiners: number,           // Nombre de miners
    miningAccounts: Array<{        // Comptes de minage
      id: string,
      name: string,
      hashrate: number,
      btc24h: number,
      usd24h: number,
      status: string
    }>
  },
  message: string
}
```

---

## 🔒 Sécurité : Modifications Sans Tout Casser

### ✅ Bonnes Pratiques

1. **Toujours retourner une structure de données valide**
   ```typescript
   // ✅ BON : Retourner des données vides au lieu d'une erreur
   return NextResponse.json({
     data: {
       globalHashrate: 0,
       // ... autres champs avec valeurs par défaut
     }
   })
   
   // ❌ MAUVAIS : Retourner une erreur 500
   return NextResponse.json({ error: 'Failed' }, { status: 500 })
   ```

2. **Gestion d'erreur robuste**
   ```typescript
   try {
     const data = await fetchData()
     return NextResponse.json({ data })
   } catch (error) {
     console.error('[API] Error:', error)
     // Retourner des données vides au lieu de planter
     return NextResponse.json({ data: { /* valeurs par défaut */ } })
   }
   ```

3. **Validation des variables d'environnement**
   ```typescript
   const apiToken = process.env.HEARST_API_TOKEN
   if (!apiToken) {
     console.warn('[API] HEARST_API_TOKEN not configured')
     return NextResponse.json({ data: { /* valeurs par défaut */ } })
   }
   ```

4. **Timeouts sur les requêtes externes**
   ```typescript
   const controller = new AbortController()
   const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout
   
   try {
     const response = await fetch(url, {
       signal: controller.signal,
       headers: { 'x-api-token': apiToken }
     })
   } finally {
     clearTimeout(timeout)
   }
   ```

---

## 🧪 Tests Avant Déploiement

### 1. Test Local

```bash
# Démarrer le serveur
npm run dev

# Tester l'API cockpit
curl http://localhost:6001/api/cockpit

# Tester avec authentification (si nécessaire)
curl -H "Cookie: next-auth.session-token=..." http://localhost:6001/api/cockpit
```

### 2. Test des Variables d'Environnement

```bash
# Vérifier que les variables sont bien chargées
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.HEARST_API_URL)"
```

### 3. Test de la Connexion Backend

```typescript
// Créer un script de test : scripts/test-cockpit-api.js
const testCockpitAPI = async () => {
  const response = await fetch('http://localhost:6001/api/cockpit')
  const data = await response.json()
  console.log('Cockpit API Response:', data)
}

testCockpitAPI()
```

---

## 📊 Monitoring en Production

### Vérifier les Logs Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Voir les logs
vercel logs

# Voir les logs en temps réel
vercel logs --follow
```

### Vérifier les Erreurs

1. **Dashboard Vercel** → **Deployments** → Cliquer sur un déploiement → **Functions** → Voir les logs
2. **Console du navigateur** : Vérifier les erreurs côté client
3. **Network tab** : Vérifier les requêtes API et leurs réponses

---

## 🚀 Déploiement Progressif

### 1. Déployer sur Preview d'Abord

```bash
# Créer une branche
git checkout -b feature/cockpit-update

# Faire vos modifications
# ...

# Push (Vercel créera un preview)
git push origin feature/cockpit-update
```

### 2. Tester le Preview

- Vérifier l'URL preview fournie par Vercel
- Tester toutes les fonctionnalités
- Vérifier les logs

### 3. Merger dans Main (Production)

```bash
# Si tout fonctionne
git checkout main
git merge feature/cockpit-update
git push origin main
```

---

## 📋 Checklist Avant de Modifier

- [ ] ✅ Créer une branche Git
- [ ] ✅ Tester en local avec `npm run dev`
- [ ] ✅ Vérifier que les variables d'environnement sont configurées
- [ ] ✅ Tester l'API avec `curl` ou Postman
- [ ] ✅ Vérifier que les erreurs sont gérées gracieusement
- [ ] ✅ Ajouter des logs pour le debugging
- [ ] ✅ Tester sur un preview deployment
- [ ] ✅ Vérifier les logs Vercel après déploiement
- [ ] ✅ Tester manuellement sur la production

---

## 🆘 En Cas de Problème

### L'API retourne une erreur 500

1. Vérifier les logs Vercel : `vercel logs`
2. Vérifier que toutes les variables d'environnement sont configurées
3. Vérifier que le backend Hearst API est accessible
4. Vérifier que la base de données est accessible

### L'API retourne des données vides

C'est normal si :
- Les variables d'environnement ne sont pas configurées
- Le backend Hearst API n'est pas accessible
- Il n'y a pas de données dans la base de données

L'API est conçue pour retourner des données vides au lieu de planter.

### Rollback Rapide

```bash
# Revenir à la version précédente
git revert HEAD
git push origin main
```

Ou depuis Vercel Dashboard :
1. Aller dans **Deployments**
2. Trouver le dernier déploiement qui fonctionnait
3. Cliquer sur **⋯** → **Promote to Production**

---

## 📚 Ressources

- **API Cockpit** : `/app/api/cockpit/route.ts`
- **API Earnings Chart** : `/app/api/cockpit/earnings-chart/route.ts`
- **Client API** : `/lib/api.ts` (fonction `cockpitAPI.getData()`)
- **Composant Cockpit** : `/components/cockpit/CockpitDashboard.tsx`

---

**✅ Vous êtes maintenant prêt à modifier l'API Cockpit en toute sécurité !**


