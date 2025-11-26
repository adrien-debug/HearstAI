# 🚀 Guide de Déploiement Vercel - HearstAI

## ✅ Pré-requis

Avant de déployer, assure-toi que :
- ✅ Tous les tests passent : `npm run test:auth`
- ✅ La base de données est accessible
- ✅ Les variables d'environnement sont configurées localement

## 📋 Variables d'environnement à configurer sur Vercel

### 1. Accéder au Dashboard Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Sélectionne ton projet **HearstAI**
3. Va dans **Settings** → **Environment Variables**

### 2. Variables requises

Ajoute les variables suivantes pour **Production**, **Preview**, et **Development** :

#### 🔑 DATABASE_URL
```
prisma+postgres://accelerate.prisma-data.net/?api_key=TON_API_KEY
```
**Important :** Utilise l'URL Prisma Accelerate (pas l'URL Supabase directe)

#### 🔐 NEXTAUTH_URL
```
https://ton-projet.vercel.app
```
**Note :** Remplace `ton-projet` par le nom réel de ton projet Vercel

#### 🔒 NEXTAUTH_SECRET
Génère un secret avec :
```bash
openssl rand -base64 32
```
Ou utilise celui déjà configuré localement.

#### 🌐 NODE_ENV (optionnel)
```
production
```

### 3. Configuration via Vercel CLI (Alternative)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet (si pas déjà fait)
vercel link

# Ajouter les variables
vercel env add DATABASE_URL production
# Colle l'URL Prisma Accelerate

vercel env add NEXTAUTH_URL production
# Colle l'URL de ton projet Vercel

vercel env add NEXTAUTH_SECRET production
# Colle le secret généré
```

## 🔄 Déploiement

### Option 1 : Déploiement automatique (Recommandé)

Vercel déploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "feat: deploy to Vercel"
git push origin main
```

### Option 2 : Déploiement manuel

```bash
vercel --prod
```

## ✅ Vérification post-déploiement

### 1. Vérifier que l'application se charge
- Ouvre l'URL de déploiement Vercel
- Vérifie qu'il n'y a pas d'erreurs dans la console

### 2. Tester l'authentification
- Va sur `/auth/signin`
- Connecte-toi avec `admin@hearst.ai`
- Vérifie que la redirection fonctionne

### 3. Vérifier les logs
```bash
vercel logs
```

### 4. Vérifier les variables d'environnement
```bash
vercel env ls
```

## 🔍 Dépannage

### Problème : Build échoue

**Erreur : "DATABASE_URL not found"**
- Vérifie que `DATABASE_URL` est configuré dans Vercel
- Vérifie que c'est pour l'environnement correct (Production/Preview)

**Erreur : "Prisma generate failed"**
- Vérifie que `prisma generate` est dans le script `build` de `package.json`
- Vérifie que `vercel.json` a la bonne commande de build

### Problème : Application ne se charge pas

**Erreur : "NEXTAUTH_URL mismatch"**
- Vérifie que `NEXTAUTH_URL` correspond exactement à l'URL Vercel
- Pas de slash final

**Erreur : "Database connection failed"**
- Vérifie que `DATABASE_URL` utilise Prisma Accelerate
- Vérifie que l'API key est valide

### Problème : Authentification ne fonctionne pas

**Erreur : "User not found"**
- Vérifie que l'utilisateur `admin@hearst.ai` existe dans Supabase
- Vérifie la connexion à la base de données

## 📊 Checklist de déploiement

- [ ] Variables d'environnement configurées sur Vercel
- [ ] `DATABASE_URL` utilise Prisma Accelerate
- [ ] `NEXTAUTH_URL` correspond à l'URL Vercel
- [ ] `NEXTAUTH_SECRET` est configuré
- [ ] Code poussé sur GitHub
- [ ] Déploiement Vercel réussi
- [ ] Application accessible
- [ ] Authentification fonctionnelle
- [ ] Base de données accessible

## 🎯 Configuration recommandée Vercel

### Build Command
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### Install Command
```json
{
  "installCommand": "npm install"
}
```

### Framework Preset
```
Next.js
```

## 📝 Notes importantes

1. **Ne jamais commiter** les fichiers `.env*` (sauf `.env.example`)
2. **Toujours utiliser** Prisma Accelerate en production (pas l'URL Supabase directe)
3. **Vérifier** que `NEXTAUTH_URL` correspond exactement à l'URL de déploiement
4. **Tester** l'authentification après chaque déploiement

## 🆘 Support

En cas de problème :
1. Vérifie les logs Vercel : `vercel logs`
2. Vérifie les variables d'environnement : `vercel env ls`
3. Vérifie la connexion à la base : `npm run db:health` (localement)
4. Consulte la documentation Vercel : https://vercel.com/docs

---

**Dernière mise à jour :** 25 novembre 2025




