# 🚀 Déploiement Railway - Business Dev Contacts

## ✅ Fichiers prêts pour le déploiement

### Backend Railway

1. ✅ **`backend/routes/business-dev.js`** - Routes Express créées
2. ✅ **`backend/database/schema.sql`** - Table `business_dev_contacts` ajoutée
3. ✅ **`backend/server.js`** - Route `/api/business-dev` ajoutée

---

## 📋 Étapes de déploiement

### Option 1 : Déploiement via Git (Recommandé)

Si votre backend Railway est connecté à un dépôt Git :

```bash
# 1. Vérifier que vous êtes dans le bon répertoire
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"

# 2. Vérifier les fichiers modifiés
git status

# 3. Ajouter les fichiers modifiés
git add backend/routes/business-dev.js
git add backend/database/schema.sql
git add backend/server.js

# 4. Commit
git commit -m "feat: add business dev contacts API endpoints"

# 5. Push vers Railway
git push origin main
# OU si Railway est sur une autre branche
git push origin master
```

**Railway déploiera automatiquement** après le push.

### Option 2 : Déploiement via Railway CLI

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Se connecter
railway login

# 3. Lier le projet
railway link

# 4. Déployer
railway up
```

### Option 3 : Déploiement via Railway Dashboard

1. Aller sur [Railway Dashboard](https://railway.app)
2. Sélectionner votre projet `hearstai-backend-production`
3. Aller dans l'onglet **"Settings"** → **"Source"**
4. Si connecté à Git, cliquer sur **"Redeploy"**
5. Sinon, uploader les fichiers via **"Deploy from GitHub"**

---

## 🔍 Vérification après déploiement

### 1. Vérifier que le serveur est démarré

```bash
curl https://hearstaibackend-production.up.railway.app/api/health
```

**Résultat attendu :**
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### 2. Vérifier que la table existe

La table `business_dev_contacts` sera créée automatiquement au démarrage du serveur grâce à `schema.sql`.

### 3. Tester l'endpoint Business Dev

```bash
# Lister les contacts
curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts

# Créer un contact
curl -X POST https://hearstaibackend-production.up.railway.app/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Corp",
    "email": "test@testcorp.com",
    "phone": "+33 6 11 22 33 44",
    "status": "active",
    "estimatedValue": "€100K"
  }'
```

### 4. Vérifier les logs Railway

Dans le dashboard Railway :
1. Aller dans votre projet
2. Cliquer sur **"Deployments"**
3. Sélectionner le dernier déploiement
4. Vérifier les logs pour voir :
   - ✅ "Database initialized successfully"
   - ✅ "Database tables created/verified"
   - ✅ Pas d'erreurs

---

## ⚙️ Configuration requise

### Variables d'environnement Railway

Assurez-vous que ces variables sont configurées dans Railway :

- **PORT** : Automatiquement géré par Railway
- **NODE_ENV** : `production` (optionnel)

### Structure du projet Railway

Railway doit pointer vers le dossier `backend/` avec :
- **Root Directory** : `backend`
- **Start Command** : `npm start` (ou `node server.js`)

---

## 🐛 Résolution de problèmes

### Problème : Table n'existe pas

**Solution :** La table sera créée automatiquement au premier démarrage grâce à `schema.sql`. Si elle n'existe pas :

1. Vérifier les logs Railway pour voir si `schema.sql` est exécuté
2. Vérifier que le fichier `backend/database/schema.sql` contient bien la table `business_dev_contacts`

### Problème : Route 404

**Solution :** Vérifier que `backend/server.js` contient :
```javascript
const businessDevRouter = require('./routes/business-dev');
app.use('/api/business-dev', businessDevRouter);
```

### Problème : Erreur de module

**Solution :** Vérifier que `package.json` contient toutes les dépendances :
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "better-sqlite3": "^9.2.2"
  }
}
```

---

## ✅ Checklist de déploiement

- [ ] Fichiers modifiés commités
- [ ] Push vers le dépôt Git
- [ ] Railway déploie automatiquement
- [ ] Health check fonctionne
- [ ] Endpoint `/api/business-dev/contacts` accessible
- [ ] Test de création d'un contact réussi
- [ ] Logs Railway sans erreurs

---

## 🎯 Après le déploiement

Une fois déployé, l'API sera accessible à :
- **Production** : `https://hearstaibackend-production.up.railway.app/api/business-dev/contacts`
- **Via Next.js** : Les routes Next.js feront automatiquement le proxy vers Railway

Le frontend utilisera automatiquement le backend Railway si `NEXT_PUBLIC_API_URL` est configuré.

