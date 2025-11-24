# 🏠 Configuration Locale - HearstAI

Ce guide explique comment configurer et démarrer **TOUT** en local (Frontend, Backend, API).

## 📋 Prérequis

- Node.js >= 18.x
- npm ou yarn
- SQLite (inclus avec Node.js)

## 🚀 Démarrage rapide

### Option 1 : Script automatique (recommandé)

```bash
# Démarrer tout en une commande
./start-local-all.sh

# Ou avec npm
npm run dev:local
```

Ce script démarre automatiquement :
- ✅ Backend Express sur `http://localhost:4000`
- ✅ Frontend Next.js sur `http://localhost:6001`
- ✅ Toutes les routes API

### Option 2 : Démarrage manuel

#### 1. Installer les dépendances

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

#### 2. Générer Prisma

```bash
npm run db:generate
```

#### 3. Démarrer le backend

```bash
# Terminal 1
cd backend
PORT=4000 node server.js
```

#### 4. Démarrer le frontend

```bash
# Terminal 2
PORT=6001 npm run dev
```

## 🔧 Configuration

### Ports par défaut

- **Frontend Next.js** : `http://localhost:6001`
- **Backend Express** : `http://localhost:4000`
- **API Routes** : `http://localhost:6001/api/*`

### Variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Frontend
PORT=6001
NEXT_PUBLIC_API_URL=http://localhost:4000

# Backend
BACKEND_PORT=4000

# Base de données
DATABASE_URL="file:./prisma/storage/hearstai.db"

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:6001
```

## 📡 Routes API disponibles

### Backend Express (port 4000)
- `http://localhost:4000/api/health`
- `http://localhost:4000/api/projects`
- `http://localhost:4000/api/jobs`
- `http://localhost:4000/api/stats`

### Frontend Next.js API Routes (port 6001)
- `http://localhost:6001/api/health`
- `http://localhost:6001/api/status`
- `http://localhost:6001/api/collateral`
- `http://localhost:6001/api/customers`
- `http://localhost:6001/api/fireblocks/vaults`
- `http://localhost:6001/api/electricity`

## 🗂️ Structure des serveurs

```
HearstAI/
├── Frontend (Next.js)
│   ├── Port: 6001
│   ├── Routes: /app/**
│   └── API Routes: /app/api/**
│
└── Backend (Express)
    ├── Port: 4000
    ├── Routes: /api/**
    └── Base de données: SQLite
```

## 🔍 Vérification

### Tester le backend

```bash
curl http://localhost:4000/api/health
```

### Tester le frontend

```bash
curl http://localhost:6001/api/health
```

### Ouvrir dans le navigateur

- Frontend : http://localhost:6001
- Backend API : http://localhost:4000/api

## 📝 Logs

Les logs sont disponibles dans :
- Backend : `/tmp/hearst-backend.log`
- Frontend : `/tmp/hearst-frontend.log`

Pour suivre les logs en temps réel :

```bash
# Backend
tail -f /tmp/hearst-backend.log

# Frontend
tail -f /tmp/hearst-frontend.log
```

## 🛑 Arrêter les serveurs

Appuyez sur `Ctrl+C` dans le terminal où le script tourne, ou :

```bash
# Trouver les processus
lsof -ti:4000 | xargs kill
lsof -ti:6001 | xargs kill
```

## ⚠️ Dépannage

### Port déjà utilisé

Si un port est déjà utilisé, modifiez les variables d'environnement ou arrêtez le processus :

```bash
# Trouver le processus sur le port 4000
lsof -ti:4000

# Arrêter le processus
kill $(lsof -ti:4000)
```

### Erreur Prisma

```bash
# Régénérer Prisma
npm run db:generate

# Ou réinitialiser la base de données
npm run db:push
```

### Erreur de dépendances

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

## ✅ Vérification complète

Une fois tout démarré, vous devriez voir :

```
✅ Backend Express démarré sur http://localhost:4000
✅ Frontend Next.js démarré sur http://localhost:6001
✅ Backend health check: OK
✅ Frontend health check: OK
```

Tout est maintenant **100% local** ! 🎉

