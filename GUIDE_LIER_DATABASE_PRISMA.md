# 🔗 Guide pour lier la base de données dans Prisma Data Platform

## 📋 Problème
Tu es sur la page "Integrations" mais tu dois aller dans "Databases" pour lier une base de données.

## 🚀 Étapes pour lier la base de données

### 1️⃣ Accéder à la page Databases

1. Va sur : https://console.prisma.io
2. Sélectionne ton projet : **prisma-postgres-cya...**
3. Dans la sidebar de gauche, clique sur **"Databases"** (pas "Integrations")
4. Tu devrais voir une page avec un bouton **"Add Database"** ou **"Connect Database"**

### 2️⃣ Créer ou connecter une base de données

#### Option A : Créer une nouvelle base Prisma Postgres (Recommandé)

1. Clique sur **"Add Database"**
2. Choisis **"Create Database"** → **"Prisma Postgres"**
3. Suis les instructions pour créer la base
4. Une fois créée, active **Prisma Accelerate**
5. Copie l'URL Prisma Accelerate (commence par `prisma+postgres://accelerate...`)

#### Option B : Connecter une base existante

Si tu as déjà une base PostgreSQL (Supabase, Neon, etc.) :

1. Clique sur **"Add Database"**
2. Choisis **"Connect Database"** → **"PostgreSQL"**
3. Colle l'URL de connexion PostgreSQL :
   ```
   postgres://4f4834b60ba3cad8b48875b5ab14844c932b6bdd6bf823fca36f0a16426a2280:sk_8-hdpdsL7GK06Jc_0NjjF@db.prisma.io:5432/postgres?sslmode=require
   ```
4. Clique sur **"Connect"**
5. Une fois connectée, active **Prisma Accelerate**
6. Copie l'URL Prisma Accelerate

### 3️⃣ Configurer Prisma Accelerate

1. Une fois la base liée, va dans l'onglet **"Accelerate"** ou **"Settings"**
2. Active **Prisma Accelerate** si ce n'est pas déjà fait
3. Copie l'URL Prisma Accelerate complète

### 4️⃣ Mettre à jour DATABASE_URL

1. Copie l'URL Prisma Accelerate (format : `prisma+postgres://accelerate.prisma-data.net/?api_key=...`)
2. Mets à jour `DATABASE_URL` dans :
   - `.env.local` (local)
   - Vercel Dashboard (production)

## ✅ Vérification

Une fois la base liée, tu devrais voir :
- La base de données dans la liste "Databases"
- L'état "Connected" ou "Active"
- L'option Prisma Accelerate activée

## 🔍 Si tu ne vois pas "Databases" dans la sidebar

1. Vérifie que tu es bien dans le bon projet
2. Vérifie que tu as les permissions nécessaires
3. Essaie de rafraîchir la page
4. Contacte le support Prisma si le problème persiste

## 📝 Notes importantes

- **Prisma Accelerate** est nécessaire pour utiliser l'URL `prisma+postgres://accelerate...`
- Sans Prisma Accelerate, tu dois utiliser l'URL PostgreSQL directe
- L'URL Prisma Accelerate est différente de l'URL PostgreSQL directe




