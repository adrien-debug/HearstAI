# 🔧 Fix : Login Cassé en Production

## 🎯 Problème

Le login ne fonctionne plus après le déploiement sur Vercel.

## 🔍 Causes Probables

### 1. NEXTAUTH_URL incorrect (90% des cas) ⚠️

**Symptôme :** La connexion échoue ou redirige vers `/auth/signin` en boucle.

**Cause :** `NEXTAUTH_URL` n'est pas configuré correctement sur Vercel.

**Solution :**

1. **Via Dashboard Vercel (Recommandé)**
   - Va sur : https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables
   - Trouve `NEXTAUTH_URL`
   - Pour **Production** : Doit être EXACTEMENT `https://hearstai.vercel.app`
   - Pour **Preview** : Doit être EXACTEMENT `https://hearstai.vercel.app`
   - **IMPORTANT :** Pas de slash final, pas de `/auth/signin`
   - Sauvegarde

2. **Via CLI Vercel**
   ```bash
   # Supprimer l'ancienne valeur
   vercel env rm NEXTAUTH_URL production --yes
   
   # Ajouter la nouvelle valeur
   vercel env add NEXTAUTH_URL production
   # Quand demandé, entrez: https://hearstai.vercel.app
   
   # Redéployer
   vercel --prod
   ```

### 2. NEXTAUTH_SECRET manquant

**Symptôme :** Erreur "NEXTAUTH_SECRET is not defined"

**Solution :**

```bash
# Générer un secret
openssl rand -base64 32

# Ajouter sur Vercel
vercel env add NEXTAUTH_SECRET production
# Colle le secret généré
```

### 3. Cookies sécurisés non activés

**Symptôme :** Le cookie de session n'est pas défini en production.

**Solution :** Vérifier que `NEXTAUTH_URL` commence par `https://` (automatique dans `lib/auth.ts`)

### 4. Base de données inaccessible

**Symptôme :** Erreur "Database connection failed"

**Solution :** Vérifier que `DATABASE_URL` est correctement configuré sur Vercel.

---

## 🚀 Solution Rapide

### Option 1 : Script Automatique

```bash
node scripts/fix-login-production.js
```

Le script va :
1. ✅ Vérifier les variables d'environnement
2. ✅ Identifier les problèmes
3. ✅ Proposer les corrections

### Option 2 : Correction Manuelle

1. **Vérifier les variables**
   ```bash
   vercel env ls | grep NEXTAUTH
   ```

2. **Corriger NEXTAUTH_URL**
   - Dashboard Vercel → Settings → Environment Variables
   - `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement)

3. **Redéployer**
   ```bash
   vercel --prod
   ```

---

## ✅ Vérification Post-Correction

### 1. Vérifier les variables

```bash
vercel env ls
```

Doit afficher :
```
NEXTAUTH_URL
  Production: https://hearstai.vercel.app ✅
  Preview: https://hearstai.vercel.app ✅

NEXTAUTH_SECRET
  Production: [défini] ✅
  Preview: [défini] ✅
```

### 2. Tester le login

1. Va sur : `https://hearstai.vercel.app/auth/signin`
2. Connecte-toi avec : `admin@hearst.ai` / `admin`
3. Ouvre la console (F12)
4. Vérifie les logs :
   - `[SignIn] Connexion réussie...` ✅
   - `[SignIn] Session après connexion: {...}` ✅
   - Pas d'erreur ❌

### 3. Vérifier les cookies

Dans la console du navigateur (F12 → Application → Cookies) :
- Doit voir : `__Secure-next-auth.session-token` ✅
- Domain : `.vercel.app` ou `hearstai.vercel.app` ✅
- Secure : `true` ✅
- HttpOnly : `true` ✅

### 4. Vérifier les logs Vercel

```bash
vercel logs
```

Cherche les erreurs :
- ❌ "NEXTAUTH_URL mismatch"
- ❌ "NEXTAUTH_SECRET is not defined"
- ❌ "Database connection failed"

---

## 🔍 Diagnostic Détaillé

### Vérifier la configuration actuelle

```bash
# Voir toutes les variables
vercel env ls

# Voir les logs
vercel logs

# Voir les déploiements
vercel ls
```

### Tester localement avec les variables de production

```bash
# Copier les variables de production
vercel env pull .env.production

# Tester localement
NODE_ENV=production npm run dev
```

---

## 📋 Checklist de Correction

- [ ] `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement, sans slash final)
- [ ] `NEXTAUTH_SECRET` est défini et valide
- [ ] `DATABASE_URL` est correctement configuré
- [ ] Redéploiement effectué après modification
- [ ] Cookie de session présent après connexion
- [ ] Middleware détecte le token
- [ ] Redirection fonctionne après connexion

---

## 🆘 Si ça ne fonctionne toujours pas

### 1. Vérifier les logs détaillés

```bash
vercel logs --follow
```

### 2. Vérifier la console du navigateur

Ouvre F12 → Console et cherche les erreurs :
- Erreurs CORS
- Erreurs de cookies
- Erreurs de session

### 3. Vérifier la base de données

```bash
# Localement
npm run db:health

# Vérifier que l'utilisateur existe
npm run db:studio
```

### 4. Tester avec curl

```bash
# Tester l'API NextAuth
curl https://hearstai.vercel.app/api/auth/session

# Devrait retourner {} si pas connecté
```

---

## 📝 Notes Importantes

1. **NEXTAUTH_URL doit être EXACTEMENT** `https://hearstai.vercel.app`
   - ❌ Pas de slash final
   - ❌ Pas de `/auth/signin`
   - ❌ Pas de `http://localhost:3000`

2. **Les cookies sécurisés** sont automatiquement activés si `NEXTAUTH_URL` commence par `https://`

3. **Après modification des variables**, il faut **redéployer** :
   ```bash
   vercel --prod
   ```

4. **Le déploiement prend 30-60 secondes**, attendez avant de tester.

---

## 🎯 Résumé

**Le problème vient presque toujours de `NEXTAUTH_URL` mal configuré !**

1. ✅ Vérifie que `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement)
2. ✅ Redéploie : `vercel --prod`
3. ✅ Attends 30-60 secondes
4. ✅ Teste le login

---

**Date de création :** $(date +%Y-%m-%d)


