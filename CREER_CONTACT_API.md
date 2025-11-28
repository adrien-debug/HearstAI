# ✅ Guide : Créer un contact via l'API Business Development

## 🎯 Objectif

Créer un contact via l'API et vérifier que tout fonctionne.

---

## ⚠️ Problème actuel

L'erreur indique que le modèle Prisma `BusinessDevContact` n'est pas encore disponible dans le client Prisma. Cela signifie que :

1. ❌ La migration n'a pas été appliquée (table n'existe pas dans la DB)
2. ❌ Le client Prisma n'a pas été régénéré
3. ❌ Le serveur n'a pas été redémarré

---

## ✅ Solution en 4 étapes

### Étape 1 : Appliquer la migration Prisma

**Cette étape est CRITIQUE** - Elle crée la table dans la base de données.

```bash
npx prisma db push
```

**Résultat attendu :**
```
✔ Your database is now in sync with your Prisma schema.
```

### Étape 2 : Générer le client Prisma

```bash
npx prisma generate
```

**Résultat attendu :**
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### Étape 3 : Redémarrer le serveur Next.js

**IMPORTANT** : Le serveur doit être redémarré pour charger le nouveau client Prisma.

1. Dans le terminal où tourne `npm run dev`, appuyez sur **Ctrl+C** pour arrêter
2. Relancez : `npm run dev`

### Étape 4 : Tester la création d'un contact

```bash
curl -X POST http://localhost:6001/api/business-dev/contacts \
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

**Résultat attendu (succès) :**
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
    "lastContact": "2025-01-20T...",
    "createdAt": "2025-01-20T...",
    "updatedAt": "2025-01-20T..."
  }
}
```

---

## 🧪 Script de test complet

J'ai créé un script de test : `test-create-contact.sh`

```bash
./test-create-contact.sh
```

Ce script :
1. ✅ Vérifie que le serveur est accessible
2. ✅ Liste les contacts existants
3. ✅ Crée un nouveau contact
4. ✅ Vérifie que le contact apparaît dans la liste

---

## 🔍 Vérifications supplémentaires

### Vérifier que la table existe

```bash
# Via Prisma Studio (interface graphique)
npx prisma studio

# La table "business_dev_contacts" doit apparaître dans la liste à gauche
```

### Vérifier les logs du serveur

Dans le terminal où tourne `npm run dev`, vous devriez voir :
- ✅ Pas d'erreurs Prisma
- ✅ Les requêtes API sont loggées normalement

### Tester depuis le frontend

1. Ouvrez `http://localhost:6001/business-dev`
2. Cliquez sur l'onglet **"Contacts"**
3. Cliquez sur **"Nouveau contact"**
4. Remplissez le formulaire et créez un contact
5. ✅ Le contact doit apparaître immédiatement dans la liste

---

## 🐛 Si l'erreur persiste

### Erreur : "Cannot read properties of undefined"

**Cause :** Le client Prisma n'a pas été régénéré ou le serveur n'a pas été redémarré.

**Solution :**
```bash
npx prisma generate
# Puis redémarrer le serveur
```

### Erreur : "Table does not exist"

**Cause :** La migration n'a pas été appliquée.

**Solution :**
```bash
npx prisma db push
```

### Erreur : "Environment variable not found: DATABASE_URL"

**Cause :** La variable d'environnement n'est pas configurée.

**Solution :**
1. Vérifiez que `.env.local` ou `.env` contient `DATABASE_URL`
2. Redémarrez le serveur

---

## 📝 Checklist finale

- [ ] Migration Prisma appliquée (`npx prisma db push`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Serveur Next.js redémarré
- [ ] Test API réussi (curl)
- [ ] Contact visible dans Prisma Studio
- [ ] Test frontend réussi

---

## 🎉 Une fois que ça fonctionne

Vous pouvez :
- ✅ Créer des contacts via l'API
- ✅ Créer des contacts via le frontend
- ✅ Lister, filtrer et rechercher les contacts
- ✅ Modifier et supprimer des contacts

