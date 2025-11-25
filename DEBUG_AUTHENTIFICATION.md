# 🔍 Débogage de l'Authentification

## Problème : "Il ne se passe rien" lors de la connexion

### ✅ Corrections apportées

1. **Logs de débogage ajoutés**
   - Logs dans `app/auth/signin/page.tsx`
   - Logs dans `lib/auth.ts`
   - Debug activé dans NextAuth

2. **Déploiement effectué**
   - Commit : `bb3f5a8`
   - Déploiement automatique en cours

---

## 🔍 Vérifications à faire

### 1. Vérifier la console du navigateur

Ouvre la console (F12) et essaie de te connecter. Tu devrais voir :
- `[SignIn] Tentative de connexion avec: { email: "admin@hearst.ai" }`
- `[SignIn] Résultat: { ... }`
- Ou des erreurs si quelque chose ne va pas

### 2. Vérifier NEXTAUTH_URL

**Le problème le plus probable :** `NEXTAUTH_URL` n'est pas correctement configuré.

**Vérification :**
1. Va sur Vercel Dashboard
2. Settings → Environment Variables
3. Trouve `NEXTAUTH_URL`
4. **Pour Production :** Doit être `https://hearstai.vercel.app`
5. **Pour Preview :** Doit être `https://hearstai.vercel.app`

**Si ce n'est pas le cas :**
1. Clique sur "Edit"
2. Change la valeur en `https://hearstai.vercel.app`
3. Sauvegarde
4. Redéploie : `vercel --prod`

### 3. Vérifier les logs Vercel

```bash
vercel logs
```

Cherche les erreurs :
- `[NextAuth] Tentative de connexion`
- `[NextAuth] Utilisateur trouvé`
- Ou des erreurs de connexion à la base de données

### 4. Vérifier la base de données

L'utilisateur doit exister dans Supabase :
- Email : `admin@hearst.ai`
- Vérifie avec : `npm run db:health` (localement)

---

## 🛠️ Solutions possibles

### Solution 1 : NEXTAUTH_URL incorrect

**Symptôme :** Le bouton ne fait rien, pas d'erreur visible

**Solution :**
1. Mettre à jour `NEXTAUTH_URL` sur Vercel
2. Redéployer

### Solution 2 : Erreur de connexion à la base

**Symptôme :** Erreur dans les logs Vercel

**Solution :**
1. Vérifier `DATABASE_URL` sur Vercel
2. Vérifier que Prisma Accelerate fonctionne
3. Tester la connexion : `npm run db:health`

### Solution 3 : CORS ou problème de domaine

**Symptôme :** Erreur CORS dans la console

**Solution :**
1. Vérifier que `NEXTAUTH_URL` correspond exactement à l'URL Vercel
2. Pas de slash final
3. Format : `https://hearstai.vercel.app`

---

## 📋 Checklist de débogage

- [ ] Console du navigateur ouverte (F12)
- [ ] Logs visibles lors de la tentative de connexion
- [ ] `NEXTAUTH_URL` vérifié sur Vercel
- [ ] Logs Vercel consultés
- [ ] Base de données accessible
- [ ] Utilisateur `admin@hearst.ai` existe

---

## 🧪 Test manuel

1. **Ouvre la console** (F12 → Console)
2. **Essaie de te connecter**
3. **Regarde les logs** :
   - `[SignIn] Tentative de connexion...`
   - `[SignIn] Résultat: ...`
4. **Partage les logs** si tu vois des erreurs

---

## 📞 Prochaines étapes

1. **Attends le déploiement** (30-60 secondes)
2. **Rafraîchis la page** (Ctrl+F5)
3. **Ouvre la console** (F12)
4. **Essaie de te connecter**
5. **Regarde les logs** dans la console
6. **Partage ce que tu vois** pour qu'on puisse diagnostiquer

---

**Les logs de débogage sont maintenant actifs ! 🔍**

