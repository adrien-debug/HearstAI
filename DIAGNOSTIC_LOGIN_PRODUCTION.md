# 🔍 Diagnostic Complet - Login Cassé en Production

## ✅ Diagnostic Local : Tout est OK

Le diagnostic local montre que tous les fichiers et configurations sont corrects. Le problème est donc **en production sur Vercel**.

---

## 🎯 Causes Probables (par ordre de probabilité)

### 1. Base de données inaccessible ⚠️ (70% de probabilité)

**Symptôme :** Erreur silencieuse, pas de réponse, ou erreur "Database connection failed"

**Vérification :**
```bash
# Vérifier que DATABASE_URL est correct sur Vercel
vercel env ls | grep DATABASE_URL

# Vérifier que c'est Prisma Accelerate (pas Supabase direct)
# Doit commencer par: prisma+postgres://
```

**Solution :**
- Vérifier que `DATABASE_URL` sur Vercel est l'URL **Prisma Accelerate**
- Vérifier que l'API key Prisma Accelerate est valide
- Tester la connexion : `npm run db:health` (localement avec les mêmes credentials)

### 2. Utilisateur n'existe pas dans la base de données ⚠️ (20% de probabilité)

**Symptôme :** Erreur "User not found" ou connexion échoue silencieusement

**Vérification :**
```bash
# Localement, vérifier que l'utilisateur existe
npm run db:studio
# Cherche l'utilisateur avec email: admin@hearst.ai
```

**Solution :**
- Si l'utilisateur n'existe pas, le créer :
  ```bash
  npm run create-user
  # Ou manuellement via Prisma Studio
  ```

### 3. Erreur dans les logs Vercel ⚠️ (10% de probabilité)

**Symptôme :** Erreur visible dans les logs mais pas dans la console du navigateur

**Vérification :**
```bash
# Obtenir l'URL du dernier déploiement
vercel ls

# Voir les logs (remplace <deployment-url> par l'URL)
vercel logs <deployment-url>
```

**Solution :** Corriger l'erreur spécifique trouvée dans les logs

---

## 🔍 Tests à Effectuer

### Test 1 : Console du Navigateur

1. **Ouvre** : https://hearstai.vercel.app/auth/signin
2. **Ouvre la console** : F12 → Console
3. **Essaie de te connecter** avec : `admin@hearst.ai` / `admin`
4. **Regarde les logs** :
   - `[SignIn] Tentative de connexion...` ✅
   - `[SignIn] Résultat: ...` ✅
   - **OU** des erreurs ❌

**Partage les erreurs si tu en vois !**

### Test 2 : API NextAuth Directement

```bash
# Tester l'endpoint de session
curl https://hearstai.vercel.app/api/auth/session

# Devrait retourner: {}
# Si erreur, il y a un problème avec l'API
```

### Test 3 : Logs Vercel

```bash
# Obtenir la liste des déploiements
vercel ls

# Voir les logs du dernier déploiement
# (Copie l'URL du dernier déploiement et utilise-la)
vercel logs <deployment-url>
```

**Cherche :**
- `[NextAuth] Tentative de connexion`
- `[NextAuth] Erreur lors de l'autorisation`
- `Database connection failed`
- `PrismaClientInitializationError`

### Test 4 : Variables d'Environnement Vercel

```bash
vercel env ls
```

**Vérifie :**
- ✅ `DATABASE_URL` : Doit être Prisma Accelerate (`prisma+postgres://...`)
- ✅ `NEXTAUTH_URL` : Doit être `https://hearstai.vercel.app`
- ✅ `NEXTAUTH_SECRET` : Doit être défini

### Test 5 : Base de Données

```bash
# Localement, teste la connexion
npm run db:health

# Vérifie que l'utilisateur existe
npm run db:studio
# Cherche: admin@hearst.ai
```

---

## 🛠️ Solutions par Problème

### Problème : "Database connection failed"

**Cause :** `DATABASE_URL` incorrect ou base inaccessible

**Solution :**
1. Vérifie `DATABASE_URL` sur Vercel Dashboard
2. Doit être l'URL **Prisma Accelerate** (pas Supabase direct)
3. Format : `prisma+postgres://accelerate.prisma-data.net/?api_key=...`
4. Redéploie : `vercel --prod`

### Problème : "User not found"

**Cause :** L'utilisateur `admin@hearst.ai` n'existe pas dans la base

**Solution :**
1. Crée l'utilisateur :
   ```bash
   npm run create-user
   ```
2. Ou via Prisma Studio :
   ```bash
   npm run db:studio
   # Ajoute manuellement l'utilisateur
   ```

### Problème : Erreur CORS ou Cookies

**Cause :** `NEXTAUTH_URL` incorrect ou problème de domaine

**Solution :**
1. Vérifie que `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement)
2. Pas de slash final
3. Redéploie : `vercel --prod`

### Problème : Erreur dans les logs Vercel

**Cause :** Erreur spécifique dans le code ou la configuration

**Solution :** Partage l'erreur exacte et je t'aiderai à la corriger

---

## 📋 Checklist de Diagnostic

- [ ] Console du navigateur vérifiée (F12)
- [ ] Logs Vercel consultés
- [ ] Variables d'environnement Vercel vérifiées
- [ ] Base de données accessible (test local)
- [ ] Utilisateur existe dans la base
- [ ] API NextAuth testée (curl)

---

## 🆘 Partage les Informations

Pour que je puisse t'aider efficacement, partage :

1. **Erreurs de la console du navigateur** (F12 → Console)
2. **Logs Vercel** (les dernières lignes)
3. **Résultat de** : `vercel env ls | grep -E "DATABASE_URL|NEXTAUTH"`
4. **Résultat de** : `curl https://hearstai.vercel.app/api/auth/session`
5. **Message d'erreur exact** (si visible)

---

## 🎯 Action Immédiate

**Fais ces 3 choses maintenant :**

1. **Ouvre la console** (F12) sur https://hearstai.vercel.app/auth/signin
2. **Essaie de te connecter**
3. **Partage ce que tu vois** dans la console (erreurs ou logs)

Cela m'aidera à identifier le problème exact ! 🔍

