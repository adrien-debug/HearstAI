# 🔧 Fix : Redirection vers Login après Connexion

## Problème

Après une connexion réussie, l'utilisateur est redirigé vers `/auth/signin` au lieu de la page d'accueil.

## Cause

Le middleware ne détecte pas le token de session après la connexion car :
1. Le cookie de session n'est pas correctement défini
2. `NEXTAUTH_URL` n'est probablement pas correctement configuré
3. Le nom du cookie change en production (`__Secure-next-auth.session-token`)

## ✅ Corrections Appliquées

### 1. Configuration des cookies améliorée
- `useSecureCookies` activé automatiquement si `NEXTAUTH_URL` commence par `https://`
- Cookie sécurisé en production

### 2. Middleware amélioré
- Détection du bon nom de cookie selon l'environnement
- Logs ajoutés pour le débogage

### 3. Vérification de session avant redirection
- Vérifie que la session est disponible avant de rediriger
- Délai pour laisser le cookie se définir

## ⚠️ ACTION REQUISE : Vérifier NEXTAUTH_URL

**C'est le problème le plus probable !**

### Sur Vercel Dashboard :

1. Va sur : https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables

2. Trouve `NEXTAUTH_URL` pour **Production**

3. **Doit être EXACTEMENT :**
   ```
   https://hearstai.vercel.app
   ```

4. **NE DOIT PAS ÊTRE :**
   - ❌ `http://localhost:3000`
   - ❌ `http://localhost:6001`
   - ❌ `https://hearstai.vercel.app/auth/signin`
   - ❌ `https://hearstai.vercel.app/`

5. **Modifie si nécessaire** et **redéploie** :
   ```bash
   vercel --prod
   ```

## 🔍 Vérification

### 1. Vérifier NEXTAUTH_URL
```bash
vercel env ls | grep NEXTAUTH_URL
```

### 2. Tester la connexion
1. Ouvre https://hearstai.vercel.app/auth/signin
2. Connecte-toi
3. Ouvre la console (F12)
4. Regarde les logs :
   - `[SignIn] Connexion réussie...`
   - `[SignIn] Session après connexion: {...}`
   - `[Middleware] Token check: {...}`

### 3. Vérifier les cookies
Dans la console du navigateur (F12 → Application → Cookies) :
- Doit voir : `next-auth.session-token` ou `__Secure-next-auth.session-token`
- Domain : `.vercel.app` ou `hearstai.vercel.app`
- Secure : true (en production)

## 📋 Checklist

- [ ] `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement)
- [ ] Cookie de session présent après connexion
- [ ] Middleware détecte le token
- [ ] Redirection fonctionne

## 🚀 Après correction

1. **Attends le déploiement** (30-60 secondes)
2. **Rafraîchis la page** (Ctrl+F5)
3. **Connecte-toi**
4. **Tu devrais être redirigé** vers `/` au lieu de `/auth/signin`

---

**Le problème vient presque toujours de `NEXTAUTH_URL` mal configuré !**




