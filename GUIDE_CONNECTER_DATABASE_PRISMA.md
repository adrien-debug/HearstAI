# 🔗 Guide pour connecter la base de données dans Prisma Data Platform

## ❌ Problème
La base de données n'est pas connectée à Prisma Data Platform.

## 🚀 Solution étape par étape

### 1️⃣ Accéder à Prisma Data Platform

1. Va sur : https://console.prisma.io
2. Connecte-toi avec ton compte
3. Sélectionne ton projet : **prisma-postgres-cya...**

### 2️⃣ Aller dans la section Databases

1. Dans la **sidebar de gauche**, clique sur **"Databases"**
   - ⚠️ **PAS** sur "Integrations" (c'est une autre section)
   - ⚠️ **PAS** sur "Dashboard"
2. Tu devrais voir une page avec les bases de données

### 3️⃣ Créer ou connecter une base de données

#### Option A : Créer une nouvelle base Prisma Postgres (Recommandé)

1. Clique sur **"Add Database"** ou **"Create Database"**
2. Choisis **"Prisma Postgres"**
3. Suis les instructions :
   - Choisis un nom pour ta base
   - Sélectionne une région
   - Configure les options (gratuit pour commencer)
4. Clique sur **"Create"**
5. Attends que la base soit créée (quelques secondes)

#### Option B : Connecter une base existante

Si tu as déjà une base PostgreSQL ailleurs (Supabase, Neon, etc.) :

1. Clique sur **"Add Database"**
2. Choisis **"Connect Database"**
3. Sélectionne **"PostgreSQL"**
4. Colle l'URL de connexion :
   ```
   postgres://4f4834b60ba3cad8b48875b5ab14844c932b6bdd6bf823fca36f0a16426a2280:sk_8-hdpdsL7GK06Jc_0NjjF@db.prisma.io:5432/postgres?sslmode=require
   ```
5. Clique sur **"Connect"**

### 4️⃣ Activer Prisma Accelerate

1. Une fois la base créée/connectée, tu devrais voir :
   - Le nom de la base de données
   - Son statut (Connected, Active, etc.)
   - Des options pour "Accelerate"

2. Clique sur **"Enable Accelerate"** ou **"Activate Accelerate"**
   - C'est nécessaire pour utiliser l'URL `prisma+postgres://accelerate...`
   - C'est gratuit pour commencer

3. Attends que l'activation soit terminée

### 5️⃣ Récupérer l'URL de connexion

1. Une fois Accelerate activé, va dans :
   - **"Connection Strings"** ou
   - **"Settings"** → **"Connection Strings"**

2. Tu devrais voir deux types d'URLs :
   - **Direct Connection** : `postgres://...` (pour pg_dump, pg_restore)
   - **Accelerate Connection** : `prisma+postgres://accelerate...` (pour l'application)

3. **Copie l'URL Accelerate Connection** (commence par `prisma+postgres://accelerate...`)

### 6️⃣ Mettre à jour DATABASE_URL

1. Partage l'URL Prisma Accelerate avec moi
2. Je vais mettre à jour :
   - `.env.local` (pour le développement local)
   - Instructions pour Vercel (pour la production)

## ✅ Vérification

Une fois la base connectée, tu devrais voir :
- ✅ La base de données dans la liste "Databases"
- ✅ Le statut "Connected" ou "Active"
- ✅ Prisma Accelerate activé
- ✅ Les URLs de connexion disponibles

## 🔍 Si tu ne vois pas "Databases"

1. Vérifie que tu es dans le bon projet
2. Vérifie que tu as les permissions (Owner ou Admin)
3. Essaie de rafraîchir la page (F5)
4. Vérifie que tu n'es pas sur une page d'erreur

## 📝 Notes importantes

- **Prisma Accelerate** est nécessaire pour utiliser `prisma+postgres://accelerate...`
- Sans Accelerate, tu dois utiliser l'URL PostgreSQL directe
- L'URL Accelerate est différente de l'URL PostgreSQL directe
- Une fois connectée, tu peux utiliser `npx prisma db push` pour créer les tables

## 🆘 Aide supplémentaire

Si tu as des problèmes :
1. Vérifie les logs dans Prisma Data Platform
2. Contacte le support Prisma
3. Partage une capture d'écran de la page "Databases"

