# Configuration Vercel - Variables d'environnement pour Railway

## 🔧 Variable principale à configurer

### `NEXT_PUBLIC_API_URL`

**Valeur à définir :**
```
https://hearstaibackend-production.up.railway.app
```

**Important :** 
- Ne pas inclure `/api` à la fin
- Le code ajoute automatiquement `/api` si nécessaire
- Cette variable est utilisée par `lib/api.ts` pour tous les appels API

## 📋 Instructions pour Vercel

### Méthode 1 : Via le Dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **HearstAI**
3. Allez dans **Settings** → **Environment Variables**
4. Cliquez sur **Add New**
5. Configurez :
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://hearstaibackend-production.up.railway.app`
   - **Environment:** Sélectionnez toutes les environnements (Production, Preview, Development)
6. Cliquez sur **Save**

### Méthode 2 : Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Entrez la valeur: https://hearstaibackend-production.up.railway.app

vercel env add NEXT_PUBLIC_API_URL preview
# Entrez la valeur: https://hearstaibackend-production.up.railway.app

vercel env add NEXT_PUBLIC_API_URL development
# Entrez la valeur: https://hearstaibackend-production.up.railway.app
```

## 🔄 Variable optionnelle (fallback)

### `BACKEND_URL` (optionnel)

Certaines routes calculator utilisent aussi `BACKEND_URL` comme fallback. Vous pouvez l'ajouter aussi :

**Valeur :**
```
https://hearstaibackend-production.up.railway.app
```

**Note :** Cette variable est optionnelle car `NEXT_PUBLIC_API_URL` est prioritaire.

## ✅ Vérification

Après avoir configuré les variables :

1. **Redéployez** votre application Vercel
2. Vérifiez que les appels API fonctionnent
3. Testez un endpoint : `https://votre-app.vercel.app/api/health`

## 📝 Variables complètes recommandées

Pour une configuration complète, voici toutes les variables d'environnement recommandées :

```env
# Backend Railway
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app

# NextAuth
NEXTAUTH_URL=https://votre-app.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth

# Database (si utilisée)
DATABASE_URL=votre-database-url

# APIs optionnelles
HEARST_API_TOKEN=votre-token
DEBANK_ACCESS_KEY=votre-key
FIREBLOCKS_API_KEY=votre-key
FIREBLOCKS_SECRET_KEY=votre-secret
```

## 🎯 Résumé

**Variable essentielle :**
- ✅ `NEXT_PUBLIC_API_URL` = `https://hearstaibackend-production.up.railway.app`

**Variable optionnelle :**
- ⚠️ `BACKEND_URL` = `https://hearstaibackend-production.up.railway.app` (fallback pour calculator)

Une fois configurée, votre frontend Vercel utilisera automatiquement le backend Railway pour tous les appels API.

