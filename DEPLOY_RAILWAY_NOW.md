# 🚀 Déploiement Railway - Instructions Immédiates

## 📋 Situation

Les fichiers ont été commités et poussés sur la branche `Fix/texting`. Pour déployer sur Railway, vous avez plusieurs options :

---

## ✅ Option 1 : Déploiement automatique via GitHub (Recommandé)

Si Railway est connecté à votre dépôt GitHub :

### Étape 1 : Vérifier la branche Railway

1. Aller sur [Railway Dashboard](https://railway.app)
2. Sélectionner le projet `hearstai-backend-production`
3. Aller dans **Settings** → **Source**
4. Vérifier quelle branche est connectée (`main`, `master`, ou `Fix/texting`)

### Étape 2 : Merger vers la branche de déploiement

Si Railway est sur `main` ou `master` :

```bash
git checkout main  # ou master
git merge Fix/texting
git push origin main  # ou master
```

Si Railway est sur `Fix/texting` :
- ✅ Le déploiement devrait se faire automatiquement
- Sinon, forcer un redéploiement depuis le dashboard

### Étape 3 : Forcer un redéploiement (si nécessaire)

Dans Railway Dashboard :
1. Aller dans **Deployments**
2. Cliquer sur **"Redeploy"** sur le dernier déploiement
3. OU créer un nouveau déploiement

---

## ✅ Option 2 : Déploiement via Railway CLI

### Installation et connexion

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Lier le projet (depuis le dossier backend)
cd backend
railway link

# Déployer
railway up
```

---

## ✅ Option 3 : Déploiement manuel via Dashboard

1. Aller sur [Railway Dashboard](https://railway.app)
2. Sélectionner `hearstai-backend-production`
3. Aller dans **Settings** → **Source**
4. Si connecté à GitHub :
   - Cliquer sur **"Redeploy"**
   - OU attendre le déploiement automatique
5. Si pas connecté à GitHub :
   - Cliquer sur **"Deploy from GitHub"**
   - Sélectionner le repo et la branche
   - Configurer le **Root Directory** sur `backend`

---

## ⚙️ Configuration Railway requise

### Root Directory

Assurez-vous que Railway pointe vers le dossier `backend/` :

1. **Settings** → **Service**
2. **Root Directory** : `backend`
3. Si ce n'est pas le cas, le définir

### Start Command

Vérifier que la commande de démarrage est :
```bash
npm start
```

---

## 🔍 Vérification après déploiement

### 1. Vérifier que le serveur est démarré

```bash
curl https://hearstaibackend-production.up.railway.app/api/health
```

### 2. Tester l'endpoint Business Dev

```bash
# Lister les contacts
curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts

# Créer un contact
curl -X POST https://hearstaibackend-production.up.railway.app/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Railway Deploy",
    "company": "Test Corp",
    "email": "test@railway-deploy.com",
    "phone": "+33 6 11 22 33 44",
    "status": "active",
    "estimatedValue": "€100K"
  }'
```

### 3. Vérifier les logs

Dans Railway Dashboard → **Deployments** → Dernier déploiement → **Logs**

Vous devriez voir :
- ✅ "Database initialized successfully"
- ✅ "Database tables created/verified"
- ✅ Pas d'erreurs

---

## 🎯 Action immédiate recommandée

**La méthode la plus rapide :**

1. Aller sur [Railway Dashboard](https://railway.app)
2. Sélectionner `hearstai-backend-production`
3. Cliquer sur **"Deployments"**
4. Cliquer sur **"Redeploy"** ou **"New Deployment"**
5. Sélectionner la branche `Fix/texting` (ou merger vers `main` si Railway est sur `main`)
6. Attendre le déploiement (2-3 minutes)
7. Tester l'API

---

## 📝 Fichiers déployés

Les fichiers suivants seront déployés :
- ✅ `backend/routes/business-dev.js`
- ✅ `backend/database/schema.sql` (avec table business_dev_contacts)
- ✅ `backend/server.js` (avec route /api/business-dev)

---

## ⚠️ Important

Si Railway est configuré pour déployer depuis `main` ou `master`, vous devrez d'abord merger `Fix/texting` vers cette branche avant que Railway ne déploie automatiquement.

