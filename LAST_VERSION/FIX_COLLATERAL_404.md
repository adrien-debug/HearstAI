# 🔧 CORRECTION ERREUR 404 COLLATERAL

## ❌ Problème

L'application frontend essaie d'appeler :
```
https://hearstai-backend-production.up.railway.app/api/collateral
```

Mais cette route n'existe pas sur Railway, d'où l'erreur 404.

## ✅ Solution

### Option 1 : Utiliser les routes Next.js locales (RECOMMANDÉ pour développement)

Modifiez le fichier `.env.local` :

```env
# Commenter ou supprimer la ligne Railway
# NEXT_PUBLIC_API_URL=https://hearstai-backend-production.up.railway.app/api

# Utiliser les routes Next.js locales
NEXT_PUBLIC_API_URL=/api
```

**Puis redémarrez le serveur Next.js :**
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### Option 2 : Utiliser le backend local Express

Si vous voulez utiliser le backend Express local (port 5001) :

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

**Note :** Le backend local a déjà une route `/api/collateral` qui retourne `{ data: [] }`.

## 📍 Routes disponibles

### Routes Next.js (recommandé)
- ✅ `/api/collateral` - Route Next.js avec intégration DeBank
- ✅ `/api/collateral?wallets=0x...` - Avec paramètres

### Backend Express local
- ✅ `http://localhost:5001/api/collateral` - Route simple (retourne `{ data: [] }`)

## 🔍 Vérification

Après modification, testez :

```bash
# Route Next.js
curl http://localhost:6001/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

# Backend Express
curl http://localhost:5001/api/collateral
```

## 📝 Note importante

La route Next.js `/api/collateral` nécessite :
- Authentification (session NextAuth)
- Paramètre `wallets` dans la query string
- Clé API DeBank (optionnelle, utilise mock data si erreur)

---

**Solution rapide :** Modifiez `.env.local` et redémarrez Next.js !



