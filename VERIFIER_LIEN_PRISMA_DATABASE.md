# 🔍 Comment vérifier que la base de données est liée à Prisma

## 🎯 Objectif

S'assurer que ta base de données Supabase est bien connectée à Prisma Data Platform et accessible via Prisma Accelerate.

## ✅ Méthode 1 : Test de connexion local

### 1. Vérifier DATABASE_URL

```bash
# Vérifier que DATABASE_URL est configuré
cat .env.local | grep DATABASE_URL
```

**Doit contenir :**
- `prisma+postgres://accelerate.prisma-data.net/?api_key=...` ✅
- OU `postgres://...@db.prisma.io:5432/...` ✅

### 2. Tester la connexion

```bash
# Tester la connexion Prisma
npx prisma db pull
```

**Si ça fonctionne :**
- ✅ La base est accessible
- ✅ Prisma peut se connecter

### 3. Vérifier les tables

```bash
# Lister les tables
npx prisma studio
```

**Ou via script :**
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$queryRaw\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`.then(tables => { console.log('Tables:', tables.map(t => t.table_name)); prisma.\$disconnect(); });"
```

## ✅ Méthode 2 : Vérifier dans Prisma Data Platform

### 1. Accéder au dashboard

1. Va sur : https://console.prisma.io
2. Connecte-toi avec ton compte
3. Sélectionne ton projet : **prisma-postgres-cya...**

### 2. Vérifier dans "Databases"

1. Clique sur **"Databases"** dans la sidebar
2. Tu devrais voir :
   - ✅ Une base de données listée
   - ✅ Statut : **"Connected"** ou **"Active"**
   - ✅ Prisma Accelerate : **Activé** (si tu utilises Accelerate)

### 3. Vérifier les détails de la base

1. Clique sur la base de données
2. Vérifie :
   - ✅ **Connection Strings** disponibles
   - ✅ **Prisma Accelerate URL** (si Accelerate est activé)
   - ✅ **Direct Connection URL** (pour pg_dump, etc.)

### 4. Vérifier Prisma Accelerate

1. Dans les détails de la base, cherche **"Accelerate"**
2. Vérifie que c'est **activé**
3. Copie l'URL Accelerate (commence par `prisma+postgres://accelerate...`)

## ✅ Méthode 3 : Vérifier dans Supabase

### 1. Accéder au dashboard Supabase

1. Va sur : https://supabase.com/dashboard/project/klnunoditbuierosippy
2. Connecte-toi avec ton compte

### 2. Vérifier la base de données

1. Va dans **"Database"** dans la sidebar
2. Vérifie :
   - ✅ Les tables existent
   - ✅ Les données sont présentes
   - ✅ La base est active

### 3. Vérifier les connexions

1. Va dans **"Settings"** → **"Database"**
2. Vérifie :
   - ✅ **Connection string** disponible
   - ✅ **Connection pooling** configuré (si utilisé)

## 🔗 Lier Supabase à Prisma Data Platform

### Si la base n'est pas encore liée :

1. **Dans Prisma Data Platform :**
   - Va dans **"Databases"**
   - Clique sur **"Add Database"**
   - Choisis **"Connect Database"**
   - Sélectionne **"PostgreSQL"**

2. **Récupérer l'URL Supabase :**
   - Va dans Supabase : **Settings** → **Database**
   - Copie l'URL de connexion (format : `postgres://...`)

3. **Connecter dans Prisma :**
   - Colle l'URL Supabase
   - Clique sur **"Connect"**
   - Attends la connexion

4. **Activer Prisma Accelerate :**
   - Une fois connecté, active **Prisma Accelerate**
   - Copie l'URL Accelerate
   - Mets à jour `DATABASE_URL` dans `.env.local` et Vercel

## ✅ Vérification finale

### Test complet

```bash
# 1. Vérifier la connexion
npx prisma db pull

# 2. Vérifier les tables
npx prisma studio

# 3. Tester une requête
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.count().then(count => { console.log('Users:', count); prisma.\$disconnect(); });"
```

### Résultat attendu

- ✅ Connexion réussie
- ✅ Tables visibles dans Prisma Studio
- ✅ Requêtes fonctionnelles
- ✅ Pas d'erreurs

## 🆘 Problèmes courants

### ❌ "Environment variable not found: DATABASE_URL"

**Solution :**
- Vérifie que `.env.local` existe
- Vérifie que `DATABASE_URL` est défini
- Recharge les variables : `export $(cat .env.local | grep -v '^#' | xargs)`

### ❌ "Error: P1001: Can't reach database server"

**Solution :**
- Vérifie que l'URL est correcte
- Vérifie que la base est accessible
- Vérifie les credentials

### ❌ "Error: P1012: URL must start with protocol"

**Solution :**
- Pour Prisma Accelerate : `prisma+postgres://accelerate...`
- Pour PostgreSQL direct : `postgres://...`
- Vérifie le format de l'URL

## 📝 Checklist de vérification

- [ ] DATABASE_URL configuré dans `.env.local`
- [ ] Base de données visible dans Prisma Data Platform
- [ ] Statut "Connected" ou "Active"
- [ ] Prisma Accelerate activé (si utilisé)
- [ ] Connexion testée avec `npx prisma db pull`
- [ ] Tables visibles dans Prisma Studio
- [ ] Requêtes fonctionnelles

## ✅ Conclusion

Si toutes les vérifications passent :
- ✅ La base est bien liée à Prisma
- ✅ Prisma peut accéder aux données
- ✅ Tout fonctionne correctement

