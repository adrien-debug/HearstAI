# 🚀 Déploiement Backend Railway - Business Dev Contacts

## ✅ Fichiers créés/modifiés

### Backend Railway

1. **`backend/routes/business-dev.js`** - Routes Express pour les contacts Business Development
2. **`backend/database/schema.sql`** - Table `business_dev_contacts` ajoutée
3. **`backend/server.js`** - Route `/api/business-dev` ajoutée

### Frontend Next.js

1. **`app/api/business-dev/contacts/route.ts`** - Modifié pour appeler Railway au lieu de Prisma
2. **`app/api/business-dev/contacts/[id]/route.ts`** - Modifié pour appeler Railway au lieu de Prisma

---

## 📋 Étapes de déploiement

### 1. Vérifier les fichiers backend

Les fichiers suivants doivent être présents :
- ✅ `backend/routes/business-dev.js`
- ✅ `backend/database/schema.sql` (avec la table business_dev_contacts)
- ✅ `backend/server.js` (avec la route `/api/business-dev`)

### 2. Déployer sur Railway

```bash
# Si vous avez un repo séparé pour le backend
cd "/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI-Backend"
git add backend/routes/business-dev.js backend/database/schema.sql backend/server.js
git commit -m "feat: add business dev contacts API"
git push origin main

# Railway déploiera automatiquement
```

### 3. Vérifier que la table existe

Une fois déployé, la table `business_dev_contacts` sera créée automatiquement au démarrage du serveur (grâce à `schema.sql`).

### 4. Tester l'API

```bash
# Tester depuis Railway
curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts

# Créer un contact
curl -X POST https://hearstaibackend-production.up.railway.app/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "company": "TechCorp Solutions",
    "email": "jean.dupont@techcorp.com",
    "phone": "+33 6 12 34 56 78",
    "status": "active",
    "estimatedValue": "€120K"
  }'
```

---

## 🔧 Configuration

### Variable d'environnement

Assurez-vous que `NEXT_PUBLIC_API_URL` est configurée dans votre `.env.local` :

```bash
NEXT_PUBLIC_API_URL=https://hearstaibackend-production.up.railway.app
```

---

## ✅ Vérification

Une fois déployé, testez :

1. **API Railway directement :**
   ```bash
   curl https://hearstaibackend-production.up.railway.app/api/business-dev/contacts
   ```

2. **Via Next.js (proxy) :**
   ```bash
   curl http://localhost:6001/api/business-dev/contacts
   ```

3. **Depuis le frontend :**
   - Aller sur `/business-dev`
   - Cliquer sur "Contacts"
   - Créer un nouveau contact

---

## 🎯 Architecture

```
Frontend (Next.js)
    ↓
app/api/business-dev/contacts (proxy)
    ↓
Backend Railway (Express + SQLite)
    ↓
Database (SQLite sur Railway)
```

Les routes Next.js font maintenant un proxy vers le backend Railway au lieu d'utiliser Prisma directement.

