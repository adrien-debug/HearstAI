# ✅ Guide de Vérification - API Business Development Contacts

## 🎯 Objectif

Vérifier que l'implémentation de l'API Business Development Contacts fonctionne correctement avec le frontend.

---

## 📋 Étape 1 : Appliquer la migration Prisma

### 1.1 Vérifier le schéma Prisma

Vérifiez que le modèle `BusinessDevContact` est présent dans `prisma/schema.prisma` :

```prisma
model BusinessDevContact {
  id            String   @id @default(cuid())
  name          String
  company       String
  email         String
  phone         String?
  status        String   @default("pending")
  estimatedValue String?
  lastContact   DateTime @default(now())
  notes         String?
  userId        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([email])
  @@index([company])
  @@index([createdAt])
  @@map("business_dev_contacts")
}
```

### 1.2 Appliquer la migration

```bash
# Option 1 : Migration complète (recommandé pour production)
npx prisma migrate dev --name add_business_dev_contacts

# Option 2 : Push direct (développement uniquement - plus rapide)
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

### 1.3 Vérifier que la table existe

```bash
# Si vous utilisez PostgreSQL directement
psql $DATABASE_URL -c "\d business_dev_contacts"

# OU via Prisma Studio (interface graphique)
npx prisma studio
```

---

## 🚀 Étape 2 : Démarrer le serveur de développement

```bash
# Démarrer Next.js en mode développement
npm run dev

# Le serveur devrait démarrer sur http://localhost:3000
```

---

## 🧪 Étape 3 : Tester l'API directement

### 3.1 Test avec curl

Ouvrez un nouveau terminal et testez les endpoints :

#### Test 1 : Lister les contacts (devrait retourner un tableau vide au début)

```bash
curl http://localhost:3000/api/business-dev/contacts
```

**Résultat attendu :**
```json
{
  "contacts": [],
  "count": 0,
  "total": 0,
  "limit": 100,
  "offset": 0
}
```

#### Test 2 : Créer un nouveau contact

```bash
curl -X POST http://localhost:3000/api/business-dev/contacts \
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

**Résultat attendu :**
```json
{
  "contact": {
    "id": "clx...",
    "name": "Jean Dupont",
    "company": "TechCorp Solutions",
    "email": "jean.dupont@techcorp.com",
    "phone": "+33 6 12 34 56 78",
    "status": "active",
    "estimatedValue": "€120K",
    "lastContact": "2025-01-20T10:00:00.000Z",
    "notes": null,
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
}
```

#### Test 3 : Lister les contacts (devrait maintenant retourner le contact créé)

```bash
curl http://localhost:3000/api/business-dev/contacts
```

**Résultat attendu :**
```json
{
  "contacts": [
    {
      "id": "clx...",
      "name": "Jean Dupont",
      ...
    }
  ],
  "count": 1,
  "total": 1
}
```

#### Test 4 : Filtrer par statut

```bash
curl "http://localhost:3000/api/business-dev/contacts?status=active"
```

#### Test 5 : Rechercher un contact

```bash
curl "http://localhost:3000/api/business-dev/contacts?search=TechCorp"
```

#### Test 6 : Récupérer un contact spécifique

```bash
# Remplacez [ID] par l'ID du contact créé
curl http://localhost:3000/api/business-dev/contacts/[ID]
```

#### Test 7 : Mettre à jour un contact

```bash
curl -X PUT http://localhost:3000/api/business-dev/contacts/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "estimatedValue": "€150K"
  }'
```

#### Test 8 : Supprimer un contact

```bash
curl -X DELETE http://localhost:3000/api/business-dev/contacts/[ID]
```

---

## 🌐 Étape 4 : Tester le frontend

### 4.1 Accéder à la page Business Development

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3000/business-dev`
3. Cliquez sur l'onglet **"Contacts"**

### 4.2 Vérifications visuelles

✅ **Vérifier que :**
- La page se charge sans erreur
- La liste des contacts s'affiche (vide au début)
- Les filtres (Tous, Actifs, En attente, Inactifs) sont présents
- La barre de recherche est visible

### 4.3 Tester la création d'un contact

1. Cliquez sur le bouton **"Nouveau contact"** en haut à droite
2. Remplissez le formulaire :
   - Nom complet : `Marie Martin`
   - Entreprise : `Green Energy Co`
   - Email : `marie.martin@greenenergy.com`
   - Téléphone : `+33 6 23 45 67 89`
   - Statut : `Actif`
   - Valeur estimée : `€200K`
3. Cliquez sur **"Créer le contact"**

**Résultat attendu :**
- Le modal se ferme
- Le contact apparaît immédiatement dans la liste
- Aucune erreur dans la console du navigateur

### 4.4 Tester les filtres

1. Cliquez sur le filtre **"Actifs"**
   - Seuls les contacts avec le statut "active" doivent s'afficher

2. Cliquez sur le filtre **"En attente"**
   - Seuls les contacts avec le statut "pending" doivent s'afficher

3. Cliquez sur le filtre **"Tous"**
   - Tous les contacts doivent s'afficher

### 4.5 Tester la recherche

1. Dans la barre de recherche, tapez `Green`
   - Seuls les contacts contenant "Green" dans le nom, l'entreprise ou l'email doivent s'afficher

2. Effacez la recherche
   - Tous les contacts doivent réapparaître

---

## 🔍 Étape 5 : Vérifier les logs et erreurs

### 5.1 Console du navigateur

Ouvrez les DevTools (F12) et vérifiez :

1. **Onglet Console** :
   - Aucune erreur JavaScript
   - Les requêtes API sont visibles dans la console réseau

2. **Onglet Network** :
   - Les requêtes vers `/api/business-dev/contacts` sont présentes
   - Les statuts HTTP sont 200 ou 201 (pas d'erreurs 400, 500, etc.)

### 5.2 Logs du serveur

Dans le terminal où tourne `npm run dev`, vérifiez :

- Aucune erreur Prisma
- Les requêtes API sont loggées
- Pas d'erreurs de connexion à la base de données

---

## 🐛 Étape 6 : Résolution des problèmes courants

### Problème 1 : Erreur "Prisma client is undefined"

**Solution :**
```bash
npx prisma generate
# Redémarrer le serveur
```

### Problème 2 : Erreur "Table does not exist"

**Solution :**
```bash
npx prisma db push
# OU
npx prisma migrate dev
```

### Problème 3 : Erreur 500 lors de la création

**Vérifications :**
1. Vérifier que la base de données est accessible
2. Vérifier les logs du serveur pour plus de détails
3. Vérifier que tous les champs requis sont fournis

### Problème 4 : Les contacts ne s'affichent pas dans le frontend

**Vérifications :**
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs dans l'onglet Console
3. Vérifier les requêtes dans l'onglet Network
4. Vérifier que l'API retourne bien des données :
   ```bash
   curl http://localhost:3000/api/business-dev/contacts
   ```

### Problème 5 : Erreur CORS

**Solution :** Normalement pas de problème avec Next.js (même origine), mais si vous testez depuis un autre domaine, vérifiez la configuration CORS.

---

## ✅ Checklist de vérification complète

- [ ] Migration Prisma appliquée avec succès
- [ ] Client Prisma généré
- [ ] Serveur Next.js démarré sans erreur
- [ ] API GET `/api/business-dev/contacts` fonctionne
- [ ] API POST `/api/business-dev/contacts` fonctionne
- [ ] API GET `/api/business-dev/contacts/[id]` fonctionne
- [ ] API PUT `/api/business-dev/contacts/[id]` fonctionne
- [ ] API DELETE `/api/business-dev/contacts/[id]` fonctionne
- [ ] Page `/business-dev` s'affiche correctement
- [ ] Onglet "Contacts" fonctionne
- [ ] Bouton "Nouveau contact" ouvre le modal
- [ ] Formulaire de création fonctionne
- [ ] Les contacts s'affichent après création
- [ ] Les filtres fonctionnent (Tous, Actifs, En attente, Inactifs)
- [ ] La recherche fonctionne
- [ ] Aucune erreur dans la console du navigateur
- [ ] Aucune erreur dans les logs du serveur

---

## 🎯 Test rapide en une commande

Pour tester rapidement toute l'API :

```bash
# Créer un contact
ID=$(curl -s -X POST http://localhost:3000/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","company":"Test Corp","email":"test@test.com","status":"active"}' \
  | jq -r '.contact.id')

echo "Contact créé avec l'ID: $ID"

# Lister les contacts
curl -s http://localhost:3000/api/business-dev/contacts | jq

# Récupérer le contact
curl -s http://localhost:3000/api/business-dev/contacts/$ID | jq

# Mettre à jour le contact
curl -s -X PUT http://localhost:3000/api/business-dev/contacts/$ID \
  -H "Content-Type: application/json" \
  -d '{"status":"pending"}' | jq

# Supprimer le contact
curl -s -X DELETE http://localhost:3000/api/business-dev/contacts/$ID | jq
```

---

## 📝 Notes importantes

- Les emails sont stockés en minuscules pour éviter les doublons
- Le format `estimatedValue` est libre (ex: "€120K", "$200K", "150K EUR")
- Les dates `lastContact` sont automatiquement mises à jour lors de la création
- Les index sur `status`, `email`, `company` et `createdAt` améliorent les performances

---

## 🎉 Si tout fonctionne

Félicitations ! L'implémentation est complète et fonctionnelle. Vous pouvez maintenant :

1. Utiliser l'API pour créer, lire, mettre à jour et supprimer des contacts
2. Utiliser le frontend pour gérer les contacts de manière intuitive
3. Filtrer et rechercher les contacts efficacement
4. Stocker les données de manière persistante dans PostgreSQL

