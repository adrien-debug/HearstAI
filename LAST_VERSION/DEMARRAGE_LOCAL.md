# 🚀 DÉMARRAGE EN LOCAL - GUIDE RAPIDE

## Backend Express

### Méthode 1 : Commande directe
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/backend"
BACKEND_PORT=5001 npm start
```

### Méthode 2 : Mode développement (avec auto-reload)
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/backend"
BACKEND_PORT=5001 npm run dev
```

### Vérifier que le backend fonctionne
```bash
curl http://localhost:5001/api/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T...",
  "environment": "local"
}
```

## Frontend Next.js

### Démarrer le frontend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
npm run dev
```

Le frontend sera accessible sur : **http://localhost:6001**

## Démarrer les deux en même temps

### Terminal 1 - Backend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/backend"
BACKEND_PORT=5001 npm start
```

### Terminal 2 - Frontend
```bash
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
npm run dev
```

## Ports utilisés

- **Backend :** http://localhost:5001
- **Frontend :** http://localhost:6001

## Endpoints disponibles

### Backend
- `http://localhost:5001/api/health` - Health check
- `http://localhost:5001/api/hashprice-lite` - Hashprice Bitcoin
- `http://localhost:5001/api/calculator/metrics` - Métriques calculator
- `http://localhost:5001/api/calculator/calculate` - Calcul profitabilité
- `http://localhost:5001/api/calculator/projection` - Projection

### Frontend (Next.js API Routes)
- `http://localhost:6001/api/health` - Health check
- `http://localhost:6001/api/calculator/*` - Calculator API
- `http://localhost:6001/api/setup/*` - Setup API
- `http://localhost:6001/api/transactions` - Transactions API
- `http://localhost:6001/api/wallets` - Wallets API
- `http://localhost:6001/api/customers` - Customers API

## Dépannage

### Le backend ne démarre pas
1. Vérifier que le port 5001 n'est pas utilisé :
   ```bash
   lsof -i :5001
   ```
2. Installer les dépendances :
   ```bash
   cd backend && npm install
   ```
3. Vérifier les logs d'erreur

### Le frontend ne démarre pas
1. Vérifier que le port 6001 n'est pas utilisé
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Générer Prisma :
   ```bash
   npx prisma generate
   ```

## Scripts utiles

### Arrêter le backend
```bash
# Trouver le processus
lsof -i :5001

# Arrêter (remplacer PID par le numéro trouvé)
kill PID
```

### Voir les logs
Les logs s'affichent directement dans le terminal où vous avez lancé les serveurs.

---

**✅ Backend démarré sur http://localhost:5001**



