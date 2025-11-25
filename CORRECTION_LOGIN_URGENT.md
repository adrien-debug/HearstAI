# 🚨 CORRECTION URGENTE : Login Cassé

## ⚠️ Problème Identifié

Le login ne fonctionne plus après le déploiement. **La cause est presque certainement `NEXTAUTH_URL` mal configuré.**

---

## ✅ SOLUTION RAPIDE (2 minutes)

### Option 1 : Via Dashboard Vercel (Recommandé) ⭐

1. **Ouvre le Dashboard Vercel :**
   - https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables

2. **Trouve `NEXTAUTH_URL`**

3. **Pour Production :**
   - Clique sur "Edit"
   - **Doit être EXACTEMENT :** `https://hearstai.vercel.app`
   - ❌ **NE DOIT PAS ÊTRE :**
     - `http://localhost:3000`
     - `http://localhost:6001`
     - `https://hearstai.vercel.app/`
     - `https://hearstai.vercel.app/auth/signin`
   - Sauvegarde

4. **Pour Preview :**
   - Même chose : `https://hearstai.vercel.app`
   - Sauvegarde

5. **Redéploie :**
   ```bash
   vercel --prod
   ```

6. **Attends 30-60 secondes** puis teste le login

### Option 2 : Via CLI Vercel

```bash
# 1. Supprimer l'ancienne valeur
vercel env rm NEXTAUTH_URL production --yes

# 2. Ajouter la nouvelle valeur
vercel env add NEXTAUTH_URL production
# Quand demandé, entrez: https://hearstai.vercel.app

# 3. Faire de même pour Preview
vercel env rm NEXTAUTH_URL preview --yes
vercel env add NEXTAUTH_URL preview
# Quand demandé, entrez: https://hearstai.vercel.app

# 4. Redéployer
vercel --prod
```

---

## 🔍 Vérification

### 1. Vérifier que c'est corrigé

```bash
vercel env ls | grep NEXTAUTH_URL
```

### 2. Tester le login

1. Va sur : `https://hearstai.vercel.app/auth/signin`
2. Connecte-toi avec : `admin@hearst.ai` / `admin`
3. Ouvre la console (F12)
4. Vérifie qu'il n'y a pas d'erreur

### 3. Vérifier les cookies

Dans F12 → Application → Cookies :
- Doit voir : `__Secure-next-auth.session-token` ✅
- Secure : `true` ✅

---

## 📋 Checklist

- [ ] `NEXTAUTH_URL` = `https://hearstai.vercel.app` (exactement, sans slash final)
- [ ] Redéploiement effectué : `vercel --prod`
- [ ] Attendu 30-60 secondes
- [ ] Testé le login
- [ ] Cookie de session présent après connexion

---

## 🆘 Si ça ne fonctionne toujours pas

### Vérifier les logs

```bash
vercel logs
```

Cherche les erreurs :
- ❌ "NEXTAUTH_URL mismatch"
- ❌ "NEXTAUTH_SECRET is not defined"
- ❌ "Database connection failed"

### Vérifier NEXTAUTH_SECRET

```bash
vercel env ls | grep NEXTAUTH_SECRET
```

Si manquant, génère-en un :
```bash
openssl rand -base64 32
```

Puis ajoute-le sur Vercel.

---

## 🎯 Résumé

**Le problème :** `NEXTAUTH_URL` est probablement `http://localhost:3000` au lieu de `https://hearstai.vercel.app`

**La solution :** Mettre à jour `NEXTAUTH_URL` sur Vercel Dashboard et redéployer

**Temps estimé :** 2 minutes

---

**✅ Une fois corrigé, le login devrait fonctionner immédiatement !**

