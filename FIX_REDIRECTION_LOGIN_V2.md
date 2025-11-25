# 🔧 Fix Redirection Login - Version 2

## 🎯 Problème

Après connexion, l'utilisateur est redirigé vers `/auth/signin` au lieu de la page demandée ou de la page d'accueil.

## 🔍 Cause Identifiée

Le problème venait de plusieurs points :

1. **Utilisation de `window.location.href`** : Cela déclenche un rechargement complet de la page, ce qui fait que le middleware vérifie le token AVANT que le cookie ne soit correctement défini.

2. **Timing du cookie** : Le cookie de session n'est pas immédiatement disponible après `signIn()`, créant une race condition.

3. **Middleware trop strict** : Le middleware redirigeait vers `/` sans tenir compte du `callbackUrl`.

## ✅ Corrections Appliquées

### 1. Page de Signin (`app/auth/signin/page.tsx`)

**Avant :**
- Utilisait `window.location.href` (rechargement complet)
- Attendait 500ms puis vérifiait la session
- Fallback avec `window.location.href` après 1 seconde

**Après :**
- Utilise `router.push()` pour une navigation côté client (pas de rechargement)
- Force un refresh de la session avec `cache: 'no-store'`
- Fallback intelligent : vérifie si on est toujours sur `/auth/signin` avant de forcer la redirection

```typescript
// Utiliser router.push pour une navigation côté client
router.push(callbackUrl)

// Fallback avec window.location si router.push ne fonctionne pas
setTimeout(() => {
  if (window.location.pathname === '/auth/signin') {
    console.log('[SignIn] Fallback: redirection forcée')
    window.location.href = callbackUrl
  }
}, 1000)
```

### 2. Middleware (`middleware.ts`)

**Avant :**
- Redirigeait toujours vers `/` si token présent sur `/auth/signin`

**Après :**
- Respecte le `callbackUrl` si présent
- Vérifie la sécurité de l'URL (doit être relative, pas externe)

```typescript
// If token exists and trying to access login page, redirect to home or callbackUrl
if (token && pathname === '/auth/signin') {
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/'
  // Vérifier que callbackUrl est une URL relative valide (sécurité)
  if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
    return NextResponse.redirect(new URL(callbackUrl, request.url))
  }
  return NextResponse.redirect(new URL('/', request.url))
}
```

### 3. Configuration NextAuth (`lib/auth.ts`)

**Ajouté :**
- Callback `redirect` pour mieux gérer les redirections
- Validation des URLs de redirection
- Protection contre les redirections vers des domaines externes

```typescript
async redirect({ url, baseUrl }) {
  // Permettre les redirections vers des URLs relatives
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  // Permettre les redirections vers le même domaine
  if (new URL(url).origin === baseUrl) {
    return url
  }
  // Par défaut, rediriger vers la page d'accueil
  return baseUrl
}
```

## 🚀 Déploiement

```bash
# Commit les changements
git add app/auth/signin/page.tsx middleware.ts lib/auth.ts
git commit -m "fix: improve login redirect logic - use router.push instead of window.location"

# Push vers GitHub
git push origin main

# Vercel déploiera automatiquement
```

## ✅ Tests à Effectuer

1. **Connexion depuis la page d'accueil**
   - Va sur `/`
   - Devrait rediriger vers `/auth/signin?callbackUrl=/`
   - Connecte-toi
   - Devrait rediriger vers `/`

2. **Connexion depuis une page protégée**
   - Va sur `/projects` (sans être connecté)
   - Devrait rediriger vers `/auth/signin?callbackUrl=/projects`
   - Connecte-toi
   - Devrait rediriger vers `/projects`

3. **Connexion directe depuis `/auth/signin`**
   - Va directement sur `/auth/signin`
   - Connecte-toi
   - Devrait rediriger vers `/`

## 🔍 Vérification

### Console du navigateur

Ouvre F12 → Console et connecte-toi. Tu devrais voir :
```
[SignIn] Tentative de connexion avec: { email: "admin@hearst.ai" }
[SignIn] Résultat: { ok: true, error: null, status: 200, url: null }
[SignIn] Connexion réussie, redirection...
```

### Vérifier la redirection

- Après connexion, tu ne devrais **PAS** rester sur `/auth/signin`
- Tu devrais être redirigé vers la page demandée ou `/`

## 📋 Checklist

- [x] Utilisation de `router.push()` au lieu de `window.location.href`
- [x] Middleware respecte le `callbackUrl`
- [x] Callback `redirect` ajouté dans NextAuth
- [x] Fallback intelligent si `router.push` ne fonctionne pas
- [x] Validation de sécurité des URLs de redirection

## 🎯 Résultat Attendu

**Avant :** Connexion → Reste sur `/auth/signin` → Boucle infinie

**Après :** Connexion → Redirection immédiate vers la page demandée ou `/` ✅

---

**Date :** $(date +%Y-%m-%d)  
**Commit :** À venir après push

