# 🚀 Configuration Production - HearstAI

## ✅ Corrections Appliquées

### 1. Configuration API pour Production
- ✅ **Routes Next.js** : L'application utilise maintenant `/api` (routes Next.js) au lieu de `http://localhost:4000`
- ✅ **Détection automatique** : Le code détecte automatiquement l'environnement de production
- ✅ **Configuration flexible** : Utilise `.env.local` si disponible, sinon routes Next.js par défaut

### 2. Messages "MODE LOCAL" Supprimés
- ✅ Les messages de debug ne s'affichent plus en production
- ✅ Affichage uniquement en mode développement (`NODE_ENV === 'development'`)

### 3. API Customers Fonctionnelle
- ✅ L'API `/api/customers` fonctionne correctement
- ✅ Utilise les routes Next.js au lieu du backend Express

---

## 📋 Configuration Requise

### Variables d'Environnement

#### Pour Production (Vercel/Production)
```bash
# .env.local ou variables Vercel
NEXT_PUBLIC_API_URL=""  # Vide ou non défini = utilise /api (routes Next.js)
```

#### Pour Développement Local avec Backend Express
```bash
# .env.local
NEXT_PUBLIC_API_URL="http://localhost:4000"  # Utilise le backend Express
```

#### Pour Développement Local avec Routes Next.js (Recommandé)
```bash
# .env.local
NEXT_PUBLIC_API_URL="/api"  # Utilise les routes Next.js
```

---

## 🔧 Fichiers Modifiés

### 1. `lib/api.ts`
- Détection automatique de l'environnement de production
- Utilise les routes Next.js par défaut en production
- Fallback intelligent selon la configuration

### 2. `start-local-all.sh`
- Respecte la configuration `.env.local`
- Utilise les routes Next.js par défaut si non configuré
- Plus de forçage vers `localhost:4000`

### 3. `components/Header.tsx`
- Messages "MODE LOCAL" uniquement en développement
- Pas de logs en production

### 4. `components/home/HomeOverview.tsx`
- Messages "MODE LOCAL" uniquement en développement
- Pas de logs en production

---

## 🚀 Déploiement Production

### Vercel
1. **Variables d'environnement** :
   - `NEXT_PUBLIC_API_URL` : Laisser **vide** ou ne pas définir
   - L'application utilisera automatiquement `/api` (routes Next.js)

2. **Build** :
   ```bash
   npm run build
   ```

3. **Vérification** :
   - Les routes API Next.js sont disponibles sur `/api/*`
   - Plus d'erreurs 404 pour `/api/customers`
   - Plus de messages "MODE LOCAL" dans la console

### Local (Production Mode)
```bash
# 1. Configurer .env.local
echo 'NEXT_PUBLIC_API_URL="/api"' > .env.local

# 2. Build
npm run build

# 3. Démarrer en mode production
npm start
```

---

## ✅ Vérifications

### 1. API Customers
```bash
curl http://localhost:6001/api/customers
# Devrait retourner : {"customers": [...], "count": X, "source": "debank"}
```

### 2. Pas de Messages "MODE LOCAL"
- Ouvrir la console du navigateur
- Vérifier qu'il n'y a plus de messages `[Header] 🔧 MODE LOCAL`
- Vérifier qu'il n'y a plus de messages `[HomeOverview] 🔧 MODE LOCAL`

### 3. Routes API Fonctionnelles
- ✅ `/api/customers` - Liste des customers
- ✅ `/api/cockpit` - Données cockpit
- ✅ `/api/collateral` - Données collatérales
- ✅ `/api/health` - Health check

---

## 📝 Notes Importantes

1. **Routes Next.js** : En production, toutes les API routes sont gérées par Next.js dans `/app/api/`
2. **Backend Express** : Optionnel, uniquement pour développement local si nécessaire
3. **Détection Automatique** : Le code détecte automatiquement l'environnement (production vs développement)
4. **Configuration Flexible** : Peut être surchargée via `.env.local` ou variables Vercel

---

## 🆘 Dépannage

### Erreur 404 sur `/api/customers`
- Vérifier que `NEXT_PUBLIC_API_URL` est vide ou `/api`
- Vérifier que le serveur Next.js est démarré
- Vérifier que la route `/app/api/customers/route.ts` existe

### Messages "MODE LOCAL" en production
- Vérifier que `NODE_ENV=production` est défini
- Vérifier que le build est en mode production (`npm run build`)

### API pointe vers localhost:4000
- Vérifier `.env.local` : `NEXT_PUBLIC_API_URL` ne doit pas être `http://localhost:4000`
- Redémarrer le serveur Next.js après modification de `.env.local`

---

**✅ Configuration Production Complète !**

L'application est maintenant configurée pour utiliser les routes Next.js en production, avec détection automatique de l'environnement et suppression des messages de debug.


