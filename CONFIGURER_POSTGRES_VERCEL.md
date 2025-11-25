# 🔧 Configurer PostgreSQL sur Vercel

## ⚠️ Problème Actuel

`DATABASE_URL` est actuellement configuré avec SQLite (`file:./prisma/storage/hearstai.db`), ce qui **ne fonctionne pas** sur Vercel car le système de fichiers est en lecture seule.

## ✅ Solution : Vercel Postgres (Gratuit)

### Étape 1 : Créer la Base de Données

1. Va sur le Dashboard Vercel :
   ```
   https://vercel.com/adrien-nejkovics-projects/hearstai
   ```

2. Clique sur **"Storage"** dans le menu de gauche

3. Clique sur **"Create Database"**

4. Sélectionne **"Postgres"**

5. Vercel va créer la base de données (quelques secondes)

### Étape 2 : Récupérer la Connection String

Après la création, Vercel génère automatiquement 3 variables :

- `POSTGRES_URL` - Pour les connexions directes
- `POSTGRES_PRISMA_URL` - **Utilise celui-ci pour Prisma** ✅
- `POSTGRES_URL_NON_POOLING` - Pour les migrations

### Étape 3 : Configurer DATABASE_URL

1. Va dans **Settings** → **Environment Variables**

2. Trouve `DATABASE_URL` dans la liste

3. Clique sur **"Edit"** pour chaque environnement (Production, Preview, Development)

4. Remplace la valeur actuelle :
   ```
   file:./prisma/storage/hearstai.db
   ```
   
   Par la valeur de `POSTGRES_PRISMA_URL` (copie depuis Storage)

5. Sauvegarde pour chaque environnement

### Étape 4 : Mettre à Jour le Schéma Prisma (Optionnel)

Si tu veux utiliser PostgreSQL en local aussi, modifie `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"  // Au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

Puis exécute :
```bash
prisma generate
prisma db push
```

### Étape 5 : Redéployer

```bash
vercel --prod
```

### Étape 6 : Initialiser l'Utilisateur

Une fois redéployé, visite :
```
https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app/api/init-user
```

Cela créera l'utilisateur `admin@hearst.ai` dans la base PostgreSQL.

### Étape 7 : Se Connecter

- Email : `admin@hearst.ai`
- Mot de passe : n'importe quel mot de passe

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. Va sur Vercel Dashboard → Storage → Ta base Postgres
2. Clique sur "Connect" → "Prisma"
3. Tu verras la connection string à utiliser

## 📝 Notes

- ✅ Vercel Postgres est **gratuit** jusqu'à 256 MB
- ✅ Les données sont **persistantes** (contrairement à SQLite sur Vercel)
- ✅ Compatible avec **Prisma** sans modification de code
- ⚠️ Les migrations Prisma fonctionnent avec `POSTGRES_URL_NON_POOLING`

## 🆘 Alternatives

Si tu préfères utiliser un autre service :

### Supabase (Gratuit)
1. Crée un compte sur https://supabase.com
2. Crée un nouveau projet
3. Va dans Settings → Database
4. Copie la connection string (format: `postgresql://...`)
5. Utilise-la comme `DATABASE_URL` sur Vercel

### Neon (Gratuit)
1. Crée un compte sur https://neon.tech
2. Crée un nouveau projet
3. Copie la connection string
4. Utilise-la comme `DATABASE_URL` sur Vercel


