# Guide de déploiement HearstAI

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte GitHub
- Compte Vercel
- Clés API configurées (DeBank, etc.)

### Étapes

#### 1. Préparer le projet localement

```bash
# Exécuter le script de configuration
chmod +x setup.sh
./setup.sh

# Vérifier que tout fonctionne
./start-local-all.sh
```

#### 2. Créer le dépôt GitHub

```bash
# Initialiser Git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit: HearstAI Collateral Management Platform"

# Créer le dépôt sur GitHub (via l'interface web ou GitHub CLI)
# Puis ajouter le remote
git remote add origin https://github.com/TON_USERNAME/hearstai.git

# Pousser le code
git branch -M main
git push -u origin main
```

#### 3. Configurer Vercel

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Importer le projet** depuis GitHub
4. **Configurer les variables d'environnement** dans Vercel :

   - `DATABASE_URL` : URL de ta base de données (PostgreSQL recommandé pour production)
   - `NEXTAUTH_URL` : URL de ton site Vercel (ex: `https://hearstai.vercel.app`)
   - `NEXTAUTH_SECRET` : Générer avec `openssl rand -base64 32`
   - `DEBANK_ACCESS_KEY` : Ta clé API DeBank
   - `ANTHROPIC_API_KEY` : (optionnel)
   - `FIREBLOCKS_API_KEY` : (optionnel)
   - `FIREBLOCKS_SECRET_KEY` : (optionnel)
   - `LUXOR_API_KEY` : (optionnel)
   - `NEXT_PUBLIC_API_URL` : Laisser vide (utilise les routes Next.js)

5. **Configurer la base de données** :
   - Pour la production, utilise une base PostgreSQL (Vercel Postgres, Supabase, etc.)
   - Mettre à jour `DATABASE_URL` avec l'URL de connexion PostgreSQL
   - Mettre à jour `prisma/schema.prisma` si nécessaire (changer `provider = "sqlite"` en `provider = "postgresql"`)

6. **Déployer** : Vercel déploiera automatiquement à chaque push sur `main`

#### 4. Configuration de la base de données PostgreSQL

Si tu utilises Vercel Postgres :

```bash
# Installer Vercel CLI
npm i -g vercel

# Lier le projet
vercel link

# Créer la base de données
vercel postgres create hearstai-db

# Récupérer l'URL de connexion
vercel env pull .env.production
```

Puis mettre à jour `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Et créer une migration :

```bash
npx prisma migrate dev --name init
```

#### 5. Scripts utiles

```bash
# Setup complet
./setup.sh

# Démarrer en local
./start-local-all.sh

# Générer Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# Voir la base de données
npx prisma studio
```

## 📝 Notes importantes

- **SQLite en local** : Le projet utilise SQLite en développement local
- **PostgreSQL en production** : Recommandé pour Vercel
- **Variables d'environnement** : Ne jamais commiter `.env.local`
- **Base de données** : La base SQLite locale n'est pas déployée, il faut migrer vers PostgreSQL

## 🔧 Dépannage

### Erreur Prisma P2021
```bash
# Régénérer Prisma
npx prisma generate
npx prisma db push
```

### Port déjà utilisé
```bash
# Le script setup.sh libère automatiquement les ports
./setup.sh
```

### Erreur API
- Vérifier que toutes les clés API sont dans `.env.local`
- Vérifier que `NEXT_PUBLIC_API_URL` est vide (utilise les routes Next.js)


