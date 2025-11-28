# 🏠 Guide de Démarrage Local - HearstAI

## 🎯 Configuration pour tout hôter en local

---

## 📋 Étape 1 : Configuration des variables d'environnement

### Créer/modifier `.env.local`

Ajoutez ou modifiez ces lignes dans `.env.local` :

```env
# Backend Local (Express)
BACKEND_URL=http://localhost:4000

# Next.js API URL (vide = utilise les routes Next.js locales)
NEXT_PUBLIC_API_URL=

# OU si vous voulez forcer le backend local
# NEXT_PUBLIC_API_URL=http://localhost:4000

# NextAuth
NEXTAUTH_URL=http://localhost:6001
NEXTAUTH_SECRET=Y9FcSzOygamSCuacy+p+tyh6Y9R9vq9fnKj0eZihgRM=
```

**Important :** Si `NEXT_PUBLIC_API_URL` est vide ou non défini, les routes Next.js utiliseront le backend local (`http://localhost:4000`).

---

## 🚀 Étape 2 : Démarrer les services

### Option A : Script automatique

```bash
./start-local-all.sh
```

### Option B : Démarrage manuel (2 terminaux)

**Terminal 1 - Backend Express :**
```bash
cd backend
npm install  # Si ce n'est pas déjà fait
npm start
# Le backend démarre sur http://localhost:4000
```

**Terminal 2 - Frontend Next.js :**
```bash
npm run dev
# Le frontend démarre sur http://localhost:6001 (ou 3000)
```

---

## ✅ Étape 3 : Vérification

### 1. Vérifier le backend

```bash
curl http://localhost:4000/api/health
```

**Résultat attendu :**
```json
{"status":"ok","timestamp":"...","environment":"local"}
```

### 2. Vérifier l'API Business Dev

```bash
# Lister les contacts
curl http://localhost:4000/api/business-dev/contacts

# Créer un contact
curl -X POST http://localhost:4000/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Local",
    "company": "Test Corp",
    "email": "test@local.com",
    "status": "active",
    "estimatedValue": "€100K"
  }'
```

### 3. Vérifier le frontend

1. Ouvrir `http://localhost:6001` (ou 3000)
2. Aller sur `/business-dev` → onglet Contacts
3. Tester la création d'un contact

---

## 🔧 Modifications effectuées

### Fichiers modifiés pour le local

1. **`app/api/business-dev/contacts/route.ts`**
   - Utilise `http://localhost:4000` par défaut si `NEXT_PUBLIC_API_URL` n'est pas défini
   - Peut toujours pointer vers Railway si `NEXT_PUBLIC_API_URL` est configuré

2. **`app/api/business-dev/contacts/[id]/route.ts`**
   - Même configuration

3. **`lib/api-datas.ts`**
   - Utilise `http://localhost:4000` par défaut

---

## 📊 Architecture Locale

```
┌─────────────────────────────────────┐
│  Frontend Next.js (port 6001)      │
│  └─ Routes API (/api/*)            │
│     └─ Proxy vers backend local     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Backend Express (port 4000)        │
│  └─ Routes API (/api/*)             │
│  └─ SQLite Database                 │
└─────────────────────────────────────┘
```

---

## 🎯 Avantages du mode local

- ✅ Développement plus rapide
- ✅ Pas de dépendance à Railway
- ✅ Base de données SQLite locale (pas de connexion externe)
- ✅ Débogage plus facile
- ✅ Pas de latence réseau
- ✅ Données persistantes localement

---

## 🔄 Basculer entre Local et Railway

### Mode Local (développement)
```env
# .env.local
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=
# OU
# NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Mode Railway (production)
```env
# .env.local
BACKEND_URL=https://hearstaibackend-production.up.railway.app
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app
```

---

## 📝 Base de données SQLite

La base de données sera créée automatiquement dans :
- **Chemin :** `storage/claude-cicd.db`
- **Création :** Au premier démarrage du backend
- **Tables :** Créées automatiquement depuis `backend/database/schema.sql`

---

## 🐛 Résolution de problèmes

### Backend ne démarre pas

```bash
# Vérifier que le port 4000 est libre
lsof -i :4000

# Si occupé, tuer le processus
kill -9 $(lsof -t -i:4000)

# Réinstaller les dépendances
cd backend
rm -rf node_modules
npm install
```

### Frontend ne peut pas joindre le backend

1. Vérifier que le backend tourne :
   ```bash
   curl http://localhost:4000/api/health
   ```

2. Vérifier `.env.local` :
   ```bash
   cat .env.local | grep BACKEND_URL
   ```

3. Redémarrer Next.js après modification de `.env.local`

### Erreur "Cannot connect to backend"

1. Vérifier que le backend est démarré
2. Vérifier que le port 4000 est accessible
3. Vérifier les logs du backend pour voir les erreurs

---

## ✅ Checklist de démarrage local

- [ ] `.env.local` configuré avec `BACKEND_URL=http://localhost:4000`
- [ ] `NEXT_PUBLIC_API_URL` vide ou pointant vers localhost
- [ ] Backend Express démarré sur port 4000
- [ ] Next.js démarré sur port 6001
- [ ] Health check backend fonctionne
- [ ] API Business Dev accessible
- [ ] Frontend peut créer des contacts
- [ ] Base de données SQLite créée

---

## 🎉 Une fois tout démarré

Vous pouvez :
- ✅ Créer des contacts depuis le frontend
- ✅ Les contacts sont stockés dans SQLite local
- ✅ Toutes les fonctionnalités CRUD fonctionnent
- ✅ Pas de dépendance à Railway
- ✅ Développement rapide et local

---

## 📝 Commandes utiles

```bash
# Démarrer le backend
cd backend && npm start

# Démarrer le frontend
npm run dev

# Vérifier les processus
lsof -i :4000  # Backend
lsof -i :6001  # Frontend

# Voir les logs backend
tail -f /tmp/hearst-backend.log

# Arrêter les serveurs
# Ctrl+C dans chaque terminal
```

