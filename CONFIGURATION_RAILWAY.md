# 🚂 Configuration Railway - Tout sur Railway

## ✅ Modifications effectuées

Tous les fichiers ont été configurés pour pointer vers Railway par défaut.

### Fichiers modifiés

1. **`app/api/business-dev/contacts/route.ts`**
   - URL par défaut : `https://hearstaibackend-production.up.railway.app`
   - Utilise `NEXT_PUBLIC_API_URL` ou `BACKEND_URL` si défini, sinon Railway

2. **`app/api/business-dev/contacts/[id]/route.ts`**
   - Même configuration

3. **`lib/api-datas.ts`**
   - URL par défaut : `https://hearstaibackend-production.up.railway.app`
   - Pour les endpoints Data (Miners & Hosters)

---

## 🔗 URL Railway

**URL de base :** `https://hearstaibackend-production.up.railway.app`

**Endpoints disponibles :**
- `/api/business-dev/contacts` - Contacts Business Development
- `/api/datas/miners` - Miners
- `/api/datas/hosters` - Hosters
- `/api/projects` - Projects
- `/api/jobs` - Jobs
- `/api/versions` - Versions
- `/api/stats` - Statistiques
- `/api/health` - Health check

---

## ⚙️ Configuration des variables d'environnement

### Option 1 : Utiliser Railway par défaut (recommandé)

Laissez les variables d'environnement vides ou non définies. Le code utilisera automatiquement Railway.

```env
# .env.local (optionnel - laisser vide pour Railway)
# NEXT_PUBLIC_API_URL=
# BACKEND_URL=
```

### Option 2 : Forcer Railway explicitement

```env
# .env.local
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app
BACKEND_URL=https://hearstaibackend-production.up.railway.app
```

### Option 3 : Utiliser le local (pour développement)

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000
```

---

## 🧪 Vérification

### Test des endpoints Railway

```bash
# Health check
curl https://hearstaibackend-production.up.railway.app/api/health

# Business Dev Contacts
curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts

# Miners
curl https://hearstaibackend-production.up.railway.app/api/datas/miners

# Hosters
curl https://hearstaibackend-production.up.railway.app/api/datas/hosters
```

---

## 📝 Ordre de priorité des URLs

Le code utilise cet ordre de priorité pour déterminer l'URL du backend :

1. **`NEXT_PUBLIC_API_URL`** (si défini)
2. **`BACKEND_URL`** (si défini)
3. **Railway par défaut** : `https://hearstaibackend-production.up.railway.app`

---

## ✅ Avantages

- ✅ Tout fonctionne avec Railway par défaut
- ✅ Pas besoin de configuration pour la production
- ✅ Facile de basculer vers le local pour le développement
- ✅ Configuration centralisée

---

## 🔄 Basculer entre Railway et Local

### Pour utiliser Railway (production)
```env
# .env.local - Laisser vide ou définir explicitement
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app
```

### Pour utiliser le local (développement)
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000
```

**Important :** Après modification de `.env.local`, redémarrer Next.js :
```bash
npm run dev
```

---

## 🎯 Résumé

✅ **Tous les fichiers pointent maintenant vers Railway par défaut**
✅ **Aucune configuration requise pour la production**
✅ **Facile de basculer vers le local si nécessaire**

