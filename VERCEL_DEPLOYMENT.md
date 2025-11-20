# 🚀 Déploiement Vercel - Configuration Production

## 📋 Variables d'environnement à configurer sur Vercel

Pour que l'application utilise le backend Railway en production, configurez les variables d'environnement suivantes dans le dashboard Vercel :

### Variables d'environnement Production

1. **Aller sur Vercel Dashboard** → Votre projet → Settings → Environment Variables

2. **Ajouter les variables suivantes :**

```env
# Backend API URL (Railway)
NEXT_PUBLIC_API_URL=https://hearstai-backend-production.up.railway.app/api

# NextAuth.js
NEXTAUTH_URL=https://votre-domaine-vercel.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth-generate-with-openssl-rand-base64-32

# Database (pour les routes API Next.js qui utilisent Prisma)
DATABASE_URL=votre-database-url

# Node Environment
NODE_ENV=production
```

### Configuration via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_API_URL production
# Entrer: https://hearstai-backend-production.up.railway.app/api

vercel env add NEXTAUTH_URL production
# Entrer: https://votre-domaine.vercel.app

vercel env add NEXTAUTH_SECRET production
# Entrer: votre-secret-key

vercel env add DATABASE_URL production
# Entrer: votre-database-url
```

## 🔄 Déploiement

### Déploiement automatique
Vercel déploie automatiquement à chaque push sur la branche `main`.

### Déploiement manuel
```bash
vercel --prod
```

## ✅ Vérification

Après le déploiement, vérifiez que :
1. L'application se charge correctement
2. Les appels API pointent vers Railway (vérifier dans les DevTools Network)
3. L'authentification fonctionne
4. Les données se chargent depuis le backend Railway

## 🔍 Debug

Pour vérifier les variables d'environnement en production :
```bash
vercel env ls
```

Pour voir les logs :
```bash
vercel logs
```

## 📝 Notes

- `NEXT_PUBLIC_API_URL` est accessible côté client (préfixe `NEXT_PUBLIC_`)
- Les autres variables sont uniquement côté serveur
- Le backend Railway a CORS configuré pour accepter toutes les origines (`app.use(cors())`)
- Si vous avez besoin de restreindre CORS, modifiez `HearstAI-Backend/server.js`

## 🚀 Script de configuration automatique

Un script est disponible pour faciliter la configuration :

```bash
./scripts/setup-vercel-env.sh
```

Ce script vous guidera pour configurer toutes les variables d'environnement nécessaires.

