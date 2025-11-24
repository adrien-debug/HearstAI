# 🚀 GUIDE DE DÉPLOIEMENT LOCAL COMPLET

## ⚡ Démarrage Rapide

### Option 1: Script Automatique (Recommandé)
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
./scripts/deploy-local.sh
```

Ce script :
- ✅ Vérifie les dépendances
- ✅ Crée `.env.local` si nécessaire
- ✅ Installe les dépendances
- ✅ Démarre Backend (port 5001)
- ✅ Démarre Frontend (port 6001)
- ✅ Lance les tests automatiquement

### Option 2: Démarrage Manuel

#### Terminal 1 - Backend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/backend"
BACKEND_PORT=5001 npm start
```

#### Terminal 2 - Frontend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
PORT=6001 npm run dev
```

---

## 🧪 Tests Complets (3 Runs)

Une fois les serveurs démarrés, exécutez les tests :

```bash
node scripts/test-complete.js
```

Ce script teste :
- ✅ Backend (3 fois)
- ✅ Frontend (3 fois)
- ✅ APIs externes (3 fois)
- ✅ Intégration Frontend-Backend-API (3 fois)

**Total: 3 runs complets de tous les tests**

---

## 📊 Résultats Attendus

### Backend
- ✅ `/api/health` - 200 OK
- ✅ `/api/hashprice-lite` - 200 OK
- ✅ `/api/calculator/metrics` - 200 OK

### Frontend
- ✅ `/api/health` - 200 ou 307 (redirection auth)
- ✅ `/api/status` - 200 ou 307
- ✅ `/api/calculator` - 200 ou 307
- ✅ `/api/setup/summary` - 200 ou 307

### APIs Externes
- ✅ CoinGecko - Prix Bitcoin
- ⚠️ DeBank - Si configuré

### Intégration
- ✅ Frontend → Backend
- ✅ Frontend → API externe
- ✅ Health checks croisés

---

## 🔧 Configuration

### Ports
- **Backend:** 5001
- **Frontend:** 6001

### Variables d'environnement
Le script crée automatiquement `.env.local` si nécessaire avec :
```env
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:5001
NEXTAUTH_URL=http://localhost:6001
NODE_ENV=development
```

---

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Vérifier le port
lsof -i :5001

# Voir les logs
tail -f /tmp/hearst-backend.log

# Réinstaller dépendances
cd backend && npm install
```

### Frontend ne démarre pas
```bash
# Vérifier le port
lsof -i :6001

# Voir les logs
tail -f /tmp/hearst-frontend.log

# Réinstaller dépendances
npm install

# Régénérer Prisma
npx prisma generate
```

### Tests échouent
1. Vérifier que les serveurs sont démarrés
2. Vérifier les ports (5001 et 6001)
3. Vérifier `.env.local`
4. Consulter les logs

---

## 📝 Logs

### Voir les logs en temps réel
```bash
# Backend
tail -f /tmp/hearst-backend.log

# Frontend
tail -f /tmp/hearst-frontend.log

# Les deux
tail -f /tmp/hearst-*.log
```

---

## ✅ Validation

### Vérifier manuellement

#### Backend
```bash
curl http://localhost:5001/api/health
```

#### Frontend
```bash
curl http://localhost:6001/api/health
```

#### Test complet
```bash
node scripts/test-complete.js
```

---

## 🎯 Checklist de Déploiement

- [ ] Dépendances installées (backend + frontend)
- [ ] `.env.local` configuré
- [ ] Backend démarré sur port 5001
- [ ] Frontend démarré sur port 6001
- [ ] Tests passés (3 runs)
- [ ] Intégration validée
- [ ] APIs externes fonctionnelles

---

## 🚀 Commandes Rapides

```bash
# Déployer tout
./scripts/deploy-local.sh

# Tester tout (3 fois)
node scripts/test-complete.js

# Arrêter tout
pkill -f "node.*server.js"
pkill -f "next dev"
```

---

**✅ Une fois déployé, votre application est accessible sur http://localhost:6001**


