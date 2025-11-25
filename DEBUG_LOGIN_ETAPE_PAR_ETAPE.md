# 🔍 Debug Login - Étape par Étape

## ✅ Ce qui fonctionne

- ✅ Application accessible
- ✅ Page de login accessible
- ✅ API NextAuth fonctionne
- ✅ Base de données accessible
- ✅ Utilisateur `admin@hearst.ai` existe
- ✅ Variables d'environnement présentes

## 🎯 Diagnostic Étape par Étape

### Étape 1 : Ouvrir la Console du Navigateur

1. **Ouvre** : https://hearstai.vercel.app/auth/signin
2. **Ouvre la console** : Appuie sur `F12` (ou Cmd+Option+I sur Mac)
3. **Va dans l'onglet "Console"**

### Étape 2 : Essayer de se Connecter

1. **Remplis le formulaire** :
   - Email : `admin@hearst.ai`
   - Mot de passe : `admin` (ou n'importe quoi)

2. **Clique sur "Se connecter"**

3. **Regarde la console** - Tu devrais voir :
   ```
   [SignIn] Tentative de connexion avec: { email: "admin@hearst.ai" }
   [SignIn] Résultat: { ... }
   ```

### Étape 3 : Identifier le Problème

**Regarde ce qui apparaît dans la console :**

#### Cas 1 : Erreur "CredentialsSignin"
```
[SignIn] Résultat: { error: "CredentialsSignin", ok: false }
```

**Cause :** L'utilisateur n'est pas trouvé ou erreur de connexion DB

**Solution :**
- Vérifie que l'utilisateur existe (déjà fait ✅)
- Vérifie les logs Vercel pour voir l'erreur exacte

#### Cas 2 : Erreur "Configuration"
```
[SignIn] Résultat: { error: "Configuration", ok: false }
```

**Cause :** Problème de configuration NextAuth

**Solution :**
- Vérifie `NEXTAUTH_URL` sur Vercel (doit être `https://hearstai.vercel.app`)
- Vérifie `NEXTAUTH_SECRET` sur Vercel

#### Cas 3 : Erreur CORS ou Network
```
Failed to fetch
Network error
CORS error
```

**Cause :** Problème de réseau ou CORS

**Solution :**
- Vérifie que l'API NextAuth est accessible
- Vérifie les logs Vercel

#### Cas 4 : Connexion réussie mais reste sur /auth/signin
```
[SignIn] Résultat: { ok: true, error: null }
[SignIn] Connexion réussie, redirection...
```

**Mais tu restes sur `/auth/signin`**

**Cause :** Problème de redirection ou de cookie

**Solution :**
- Vérifie les cookies dans F12 → Application → Cookies
- Doit voir : `__Secure-next-auth.session-token`
- Si absent, problème de cookie

#### Cas 5 : Aucune erreur visible
```
[SignIn] Tentative de connexion...
```

**Mais rien ne se passe**

**Cause :** Le code ne s'exécute pas ou erreur silencieuse

**Solution :**
- Vérifie qu'il n'y a pas d'erreurs JavaScript dans la console
- Vérifie l'onglet "Network" dans F12

---

## 🔍 Vérifications Supplémentaires

### Vérifier les Cookies

1. **F12** → **Application** → **Cookies** → `https://hearstai.vercel.app`
2. **Cherche** : `__Secure-next-auth.session-token` ou `next-auth.session-token`
3. **Si absent** : Le cookie n'est pas défini → problème de configuration

### Vérifier l'Onglet Network

1. **F12** → **Network**
2. **Essaie de te connecter**
3. **Cherche** la requête vers `/api/auth/callback/credentials`
4. **Clique dessus** et regarde :
   - **Status** : Doit être `200` ou `307`
   - **Response** : Regarde le contenu
   - **Headers** : Vérifie les cookies dans "Set-Cookie"

### Vérifier les Logs Vercel

```bash
# Obtenir l'URL du dernier déploiement
vercel ls

# Voir les logs (remplace <url> par l'URL du déploiement)
vercel logs <url>
```

**Cherche :**
- `[NextAuth] Tentative de connexion`
- `[NextAuth] Utilisateur trouvé`
- `[NextAuth] Erreur`
- `Database connection`
- `PrismaClientInitializationError`

---

## 🛠️ Solutions par Problème

### Problème : Cookie non défini

**Symptôme :** Pas de cookie `__Secure-next-auth.session-token` après connexion

**Solutions :**
1. Vérifie `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement)
2. Vérifie que `NEXTAUTH_URL` commence par `https://`
3. Redéploie après modification

### Problème : Erreur "User not found"

**Symptôme :** `[NextAuth] Utilisateur non trouvé` dans les logs

**Solutions :**
1. Vérifie que l'utilisateur existe : `npm run test-db-production`
2. Si absent, crée-le : `npm run create-user`
3. Vérifie que `DATABASE_URL` sur Vercel pointe vers la bonne base

### Problème : Erreur de connexion DB

**Symptôme :** `PrismaClientInitializationError` ou `Database connection failed`

**Solutions :**
1. Vérifie `DATABASE_URL` sur Vercel
2. Doit être l'URL Prisma Accelerate (pas Supabase direct)
3. Format : `prisma+postgres://accelerate.prisma-data.net/?api_key=...`

### Problème : Boucle de redirection

**Symptôme :** Connexion réussie mais reste sur `/auth/signin`

**Solutions :**
1. Vérifie les cookies (doivent être présents)
2. Vérifie `NEXTAUTH_URL` (doit être correct)
3. Vérifie le middleware (doit détecter le token)

---

## 📋 Checklist de Debug

- [ ] Console du navigateur ouverte (F12)
- [ ] Tentative de connexion effectuée
- [ ] Erreurs dans la console notées
- [ ] Cookies vérifiés (F12 → Application → Cookies)
- [ ] Onglet Network vérifié
- [ ] Logs Vercel consultés
- [ ] Variables d'environnement Vercel vérifiées

---

## 🆘 Partage les Informations

Pour que je puisse t'aider, partage :

1. **Ce que tu vois dans la console** (F12 → Console)
   - Copie-colle les messages d'erreur
   - Copie-colle les logs `[SignIn]` et `[NextAuth]`

2. **Ce que tu vois dans Network** (F12 → Network)
   - Status de la requête `/api/auth/callback/credentials`
   - Response de cette requête

3. **Les cookies présents** (F12 → Application → Cookies)
   - Liste des cookies pour `hearstai.vercel.app`

4. **Les logs Vercel** (si tu peux les obtenir)
   ```bash
   vercel logs <deployment-url>
   ```

---

## 🎯 Action Immédiate

**Fais ça maintenant :**

1. Ouvre https://hearstai.vercel.app/auth/signin
2. Ouvre F12 → Console
3. Essaie de te connecter
4. **Partage exactement ce que tu vois dans la console**

Cela m'aidera à identifier le problème exact ! 🔍

