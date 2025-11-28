# 🏠 Configuration Locale Complète - HearstAI

## 🎯 Objectif

Configurer toute l'application pour fonctionner en local (backend + frontend).

---

## 📋 Configuration requise

### 1. Variables d'environnement

Créez ou modifiez `.env.local` à la racine du projet :

```env
# Backend Local
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Next.js
NEXTAUTH_URL=http://localhost:6001
NEXTAUTH_SECRET=votre_secret_nextauth

# Database (si vous utilisez Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/hearstai

# APIs Externes (optionnel)
DEBANK_ACCESS_KEY=votre_cle_debank
ANTHROPIC_API_KEY=votre_cle_anthropic
```

---

## 🚀 Démarrage en local

### Étape 1 : Démarrer le backend Express

```bash
# Terminal 1 - Backend
cd backend
npm install  # Si ce n'est pas déjà fait
npm start
# OU pour le développement avec auto-reload
npm run dev
```

Le backend devrait démarrer sur `http://localhost:4000`

### Étape 2 : Démarrer Next.js

```bash
# Terminal 2 - Frontend
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:6001` (ou 3000 selon votre config)

---

## ✅ Vérification

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
   - Utilise `BACKEND_URL` (localhost:4000) par défaut
   - Peut toujours pointer vers Railway si `NEXT_PUBLIC_API_URL` est défini

2. **`app/api/business-dev/contacts/[id]/route.ts`**
   - Même configuration

3. **`lib/api-datas.ts`**
   - Utilise `BACKEND_URL` (localhost:4000) par défaut

---

## 📝 Structure locale

```
Terminal 1: Backend Express (port 4000)
  └─ SQLite Database
  └─ Routes API (/api/*)

Terminal 2: Next.js Frontend (port 6001)
  └─ Routes API Next.js (/api/*) → Proxy vers backend local
  └─ Pages React
```

---

## 🎯 Avantages du mode local

- ✅ Développement plus rapide
- ✅ Pas de dépendance à Railway
- ✅ Base de données SQLite locale
- ✅ Débogage plus facile
- ✅ Pas de latence réseau

---

## 🔄 Basculer entre Local et Railway

### Mode Local (développement)
```env
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Mode Railway (production)
```env
BACKEND_URL=https://hearstaibackend-production.up.railway.app
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app
```

---

## ✅ Checklist

- [ ] Backend Express démarré sur port 4000
- [ ] Next.js démarré sur port 6001
- [ ] Health check backend fonctionne
- [ ] API Business Dev accessible
- [ ] Frontend peut créer des contacts
- [ ] Base de données SQLite créée automatiquement

---

## 🐛 Résolution de problèmes

### Backend ne démarre pas

```bash
# Vérifier que le port 4000 est libre
lsof -i :4000

# Vérifier les dépendances
cd backend
npm install
```

### Frontend ne peut pas joindre le backend

1. Vérifier que le backend tourne : `curl http://localhost:4000/api/health`
2. Vérifier `.env.local` : `BACKEND_URL=http://localhost:4000`
3. Redémarrer Next.js après modification de `.env.local`

### Base de données SQLite

La base de données sera créée automatiquement dans `storage/claude-cicd.db` au premier démarrage du backend.

