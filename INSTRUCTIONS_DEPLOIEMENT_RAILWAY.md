# 🚀 Instructions de Déploiement Railway - Business Dev Contacts

## ✅ Fichiers commités et poussés

Les fichiers suivants ont été commités et poussés sur la branche `Fix/texting` :

### Backend
- ✅ `backend/routes/business-dev.js` - Routes Express créées
- ✅ `backend/database/schema.sql` - Table `business_dev_contacts` ajoutée
- ✅ `backend/server.js` - Route `/api/business-dev` ajoutée

### Frontend (Proxy)
- ✅ `app/api/business-dev/contacts/route.ts` - Modifié pour appeler Railway
- ✅ `app/api/business-dev/contacts/[id]/route.ts` - Modifié pour appeler Railway
- ✅ `lib/api/business-dev-contacts.ts` - Service API frontend

---

## 📋 Étapes pour déployer sur Railway

### Option 1 : Si Railway est connecté à GitHub

1. **Vérifier la branche Railway**
   - Aller sur [Railway Dashboard](https://railway.app)
   - Sélectionner votre projet `hearstai-backend-production`
   - Vérifier dans **Settings** → **Source** quelle branche est connectée
   - Si c'est `main` ou `master`, vous devrez merger `Fix/texting` vers cette branche

2. **Merger vers la branche principale** (si nécessaire)
   ```bash
   git checkout main  # ou master
   git merge Fix/texting
   git push origin main  # ou master
   ```

3. **Railway déploiera automatiquement** après le push

### Option 2 : Déploiement manuel via Railway CLI

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Se connecter
railway login

# 3. Lier le projet
railway link

# 4. Déployer depuis le dossier backend
cd backend
railway up
```

### Option 3 : Déploiement via Railway Dashboard

1. Aller sur [Railway Dashboard](https://railway.app)
2. Sélectionner votre projet `hearstai-backend-production`
3. Cliquer sur **"Deployments"**
4. Cliquer sur **"Redeploy"** ou **"Deploy from GitHub"**

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

La table `business_dev_contacts` sera créée automatiquement au démarrage grâce à `schema.sql`.

### 3. Tester l'endpoint Business Dev

```bash
# Lister les contacts
curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts

# Créer un contact
curl -X POST https://hearstaibackend-production.up.railway.app/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Railway",
    "company": "Test Corp",
    "email": "test@railway.com",
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

## ⚙️ Configuration Railway

### Root Directory

Assurez-vous que Railway est configuré pour pointer vers le dossier `backend/` :

1. Aller dans **Settings** → **Service**
2. Vérifier que **Root Directory** est défini sur `backend`
3. Si ce n'est pas le cas, le définir

### Start Command

Vérifier que la commande de démarrage est :
```bash
npm start
```
ou
```bash
node server.js
```

### Variables d'environnement

Railway gère automatiquement :
- **PORT** : Automatiquement défini par Railway
- **NODE_ENV** : Peut être défini sur `production` (optionnel)

---

## 🎯 Après le déploiement

Une fois déployé, l'API sera accessible à :
- **Production** : `https://hearstaibackend-production.up.railway.app/api/business-dev/contacts`
- **Via Next.js** : Les routes Next.js feront automatiquement le proxy vers Railway

### Tester depuis le frontend

1. Ouvrir `http://localhost:6001/business-dev`
2. Cliquer sur l'onglet **"Contacts"**
3. Cliquer sur **"Nouveau contact"**
4. Créer un contact
5. ✅ Le contact doit apparaître dans la liste

---

## ✅ Checklist finale

- [ ] Fichiers commités sur la bonne branche
- [ ] Branche mergée vers main/master (si Railway est sur main/master)
- [ ] Railway déploie automatiquement
- [ ] Health check fonctionne
- [ ] Endpoint `/api/business-dev/contacts` accessible
- [ ] Test de création d'un contact réussi
- [ ] Logs Railway sans erreurs
- [ ] Frontend fonctionne avec Railway

---

## 🐛 Si Railway ne déploie pas automatiquement

1. Vérifier que Railway est bien connecté à GitHub
2. Vérifier que la bonne branche est sélectionnée
3. Forcer un redéploiement depuis le dashboard Railway
4. Vérifier les logs pour voir les erreurs

---

## 📝 Note importante

Si Railway est connecté à la branche `main` ou `master`, vous devrez merger `Fix/texting` vers cette branche pour que Railway déploie les changements.

