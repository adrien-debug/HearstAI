# 🔧 Résolution de l'erreur 500 - Business Development Contacts

## ❌ Problème

Erreur 500 lors de la création d'un contact :
```
POST http://localhost:6001/api/business-dev/contacts 500 (Internal Server Error)
```

## 🔍 Causes possibles

1. **Le modèle Prisma n'existe pas dans la base de données** (le plus probable)
2. **Le client Prisma n'a pas été régénéré**
3. **Variable d'environnement DATABASE_URL manquante**

---

## ✅ Solution étape par étape

### Étape 1 : Vérifier la variable DATABASE_URL

Vérifiez que le fichier `.env.local` ou `.env` contient `DATABASE_URL` :

```bash
# Vérifier si la variable existe
cat .env.local | grep DATABASE_URL

# OU
cat .env | grep DATABASE_URL
```

Si elle n'existe pas, ajoutez-la :

```bash
# Dans .env.local ou .env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

### Étape 2 : Appliquer la migration Prisma

```bash
# Option 1 : Push direct (recommandé pour développement)
npx prisma db push

# Option 2 : Migration complète (recommandé pour production)
npx prisma migrate dev --name add_business_dev_contacts
```

### Étape 3 : Générer le client Prisma

```bash
npx prisma generate
```

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

---

## 🧪 Vérification

### Test 1 : Vérifier que la table existe

```bash
# Via Prisma Studio (interface graphique)
npx prisma studio

# OU via psql
psql $DATABASE_URL -c "\d business_dev_contacts"
```

### Test 2 : Tester l'API directement

```bash
curl -X POST http://localhost:3000/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Corp",
    "email": "test@test.com",
    "status": "active"
  }'
```

**Résultat attendu :**
```json
{
  "contact": {
    "id": "clx...",
    "name": "Test User",
    ...
  }
}
```

---

## 🐛 Si l'erreur persiste

### Vérifier les logs du serveur

Dans le terminal où tourne `npm run dev`, cherchez les erreurs Prisma :

```
[API Business Dev Contacts] Erreur POST: ...
```

### Erreurs courantes

#### Erreur : "Table does not exist"
**Solution :** La migration n'a pas été appliquée
```bash
npx prisma db push
npx prisma generate
```

#### Erreur : "Prisma client is undefined"
**Solution :** Le client Prisma n'a pas été généré
```bash
npx prisma generate
# Redémarrer le serveur
```

#### Erreur : "Environment variable not found: DATABASE_URL"
**Solution :** Ajouter DATABASE_URL dans `.env.local`
```bash
echo 'DATABASE_URL="postgresql://..."' >> .env.local
```

#### Erreur : "Cannot read properties of undefined"
**Solution :** Vérifier que Prisma est correctement importé
```typescript
import { prisma } from '@/lib/db'
```

---

## 📝 Checklist de résolution

- [ ] Variable `DATABASE_URL` présente dans `.env.local`
- [ ] Migration Prisma appliquée (`npx prisma db push`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Serveur redémarré
- [ ] Table `business_dev_contacts` existe dans la base de données
- [ ] Test API réussi (curl ou frontend)

---

## 🎯 Solution rapide (copier-coller)

```bash
# 1. Vérifier/créer DATABASE_URL dans .env.local
# 2. Appliquer la migration
npx prisma db push

# 3. Générer le client
npx prisma generate

# 4. Redémarrer le serveur
# (Arrêter avec Ctrl+C puis relancer)
npm run dev
```

---

## 💡 Note importante

Si vous utilisez un port différent (6001 au lieu de 3000), vérifiez votre configuration Next.js ou votre proxy. L'API devrait être accessible sur le même port que votre application Next.js.

