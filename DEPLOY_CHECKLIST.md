# ✅ Checklist de Déploiement Vercel

## 🔍 Avant de déployer

### 1. Vérifications locales
- [x] Tous les tests passent : `npm run test:auth`
- [x] Base de données accessible : `npm run db:health`
- [x] Synchronisation OK : `npm run db:sync`
- [x] Aucun fichier sensible dans Git
- [x] `.gitignore` à jour

### 2. Vérification pré-déploiement
```bash
node scripts/pre-deploy-check.js
```

**Résultat attendu :** ✅ Tous les checks passent

---

## 🚀 Déploiement

### Étape 1 : Commit et Push

```bash
# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: add Prisma/Supabase sync tools, auth tests, and deployment config"

# Push vers GitHub
git push origin main
```

### Étape 2 : Configuration Vercel

#### Option A : Script automatique (Recommandé)

```bash
./scripts/setup-vercel-env.sh
```

#### Option B : Configuration manuelle

1. Va sur [vercel.com](https://vercel.com)
2. Sélectionne ton projet
3. **Settings** → **Environment Variables**
4. Ajoute les variables suivantes :

**DATABASE_URL**
```
prisma+postgres://accelerate.prisma-data.net/?api_key=TON_API_KEY
```
*(Utilise l'URL Prisma Accelerate de ton .env.local)*

**NEXTAUTH_URL**
```
https://ton-projet.vercel.app
```
*(Remplace par le nom réel de ton projet)*

**NEXTAUTH_SECRET**
```
ton-secret-nextauth
```
*(Utilise celui de ton .env.local ou génère-en un nouveau)*

**Important :** Configure ces variables pour **Production**, **Preview**, et **Development**

### Étape 3 : Vérifier le déploiement

1. Vercel déploie automatiquement après le push
2. Vérifie les logs : `vercel logs`
3. Vérifie les variables : `vercel env ls`

---

## ✅ Vérification post-déploiement

### 1. Application accessible
- [ ] L'application se charge sans erreur
- [ ] Pas d'erreurs dans la console du navigateur

### 2. Authentification
- [ ] Page `/auth/signin` accessible
- [ ] Connexion avec `admin@hearst.ai` fonctionne
- [ ] Redirection après connexion fonctionne

### 3. Base de données
- [ ] Connexion à Supabase fonctionne
- [ ] Utilisateur `admin@hearst.ai` existe
- [ ] Pas d'erreurs de connexion dans les logs

### 4. Logs Vercel
```bash
vercel logs
```

Vérifie qu'il n'y a pas d'erreurs :
- ❌ "DATABASE_URL not found"
- ❌ "NEXTAUTH_URL mismatch"
- ❌ "Connection failed"

---

## 🔧 Dépannage

### Build échoue

**Erreur : "DATABASE_URL not found"**
```bash
# Vérifie les variables
vercel env ls

# Ajoute la variable
vercel env add DATABASE_URL production
```

**Erreur : "Prisma generate failed"**
- Vérifie que `prisma generate` est dans `package.json` → `scripts.build`
- Vérifie que `vercel.json` a la bonne commande

### Application ne se charge pas

**Erreur : "NEXTAUTH_URL mismatch"**
- Vérifie que `NEXTAUTH_URL` correspond exactement à l'URL Vercel
- Pas de slash final
- Format : `https://projet.vercel.app`

**Erreur : "Database connection failed"**
- Vérifie que `DATABASE_URL` utilise Prisma Accelerate
- Vérifie que l'API key est valide
- Teste la connexion localement : `npm run db:health`

### Authentification ne fonctionne pas

**Erreur : "User not found"**
- Vérifie que l'utilisateur existe dans Supabase
- Vérifie la connexion à la base : `npm run db:health`

---

## 📋 Variables d'environnement requises

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `DATABASE_URL` | URL Prisma Accelerate | `.env.local` (copie l'URL complète) |
| `NEXTAUTH_URL` | URL de ton projet Vercel | Format : `https://projet.vercel.app` |
| `NEXTAUTH_SECRET` | Secret pour NextAuth | `.env.local` ou génère avec `openssl rand -base64 32` |

---

## 🎯 Résumé rapide

1. ✅ Vérifie : `node scripts/pre-deploy-check.js`
2. 📝 Commit : `git add . && git commit -m "..." && git push`
3. ⚙️ Configure Vercel : `./scripts/setup-vercel-env.sh` ou manuellement
4. 🚀 Déploie : Automatique via GitHub
5. ✅ Vérifie : Teste l'application et l'authentification

---

**Date de création :** 25 novembre 2025

