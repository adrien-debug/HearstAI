# Configuration des Variables d'Environnement Vercel

## Variables Requises

Pour que l'authentification fonctionne sur Vercel, tu dois configurer ces variables :

### 1. DATABASE_URL

**Important** : SQLite ne fonctionne pas bien sur Vercel car le système de fichiers est en lecture seule.

**Options** :
- **PostgreSQL** (recommandé) : Utilise une base de données PostgreSQL hébergée (Vercel Postgres, Supabase, Neon, etc.)
- **SQLite avec stockage externe** : Nécessite un stockage persistant (non recommandé)

**Format PostgreSQL** :
```
postgresql://user:password@host:5432/database?schema=public
```

**Format SQLite** (pour développement local uniquement) :
```
file:./prisma/storage/hearstai.db
```

### 2. NEXTAUTH_SECRET

Une clé secrète pour signer les tokens JWT. Génère-en une avec :
```bash
openssl rand -base64 32
```

Ou utilise celle déjà générée dans `.env.local`.

### 3. NEXTAUTH_URL

L'URL de ton application Vercel :
```
https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app
```

Ou ton domaine personnalisé si tu en as un.

## Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. Va sur https://vercel.com/dashboard
2. Sélectionne ton projet `hearstai`
3. Va dans **Settings** → **Environment Variables**
4. Ajoute chaque variable pour les 3 environnements (Production, Preview, Development)

## Méthode 2 : Via le Script Automatique

```bash
./scripts/setup-vercel-env.sh
```

Le script va :
- Lire les variables depuis `.env.local`
- Les ajouter automatiquement sur Vercel pour tous les environnements

## Méthode 3 : Via Vercel CLI

```bash
# DATABASE_URL
vercel env add DATABASE_URL production
# Colle la valeur quand demandé

# NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production
# Colle la valeur quand demandé

# NEXTAUTH_URL
vercel env add NEXTAUTH_URL production
# Colle: https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app
```

## Vérification

Après avoir configuré les variables :

1. **Redéploie** l'application :
   ```bash
   vercel --prod
   ```

2. **Initialise l'utilisateur** :
   Visite : `https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app/api/init-user`

3. **Teste la connexion** :
   - Email : `admin@hearst.ai`
   - Mot de passe : n'importe quel mot de passe

## Configuration Recommandée pour Production

### Option 1 : Vercel Postgres (Gratuit)

1. Va sur https://vercel.com/dashboard
2. Sélectionne ton projet
3. Va dans **Storage** → **Create Database** → **Postgres**
4. Vercel créera automatiquement `POSTGRES_URL` et `POSTGRES_PRISMA_URL`
5. Utilise `POSTGRES_PRISMA_URL` comme `DATABASE_URL` dans ton schéma Prisma

### Option 2 : Supabase (Gratuit)

1. Crée un compte sur https://supabase.com
2. Crée un nouveau projet
3. Copie la connection string depuis **Settings** → **Database**
4. Utilise-la comme `DATABASE_URL` sur Vercel

### Option 3 : Neon (Gratuit)

1. Crée un compte sur https://neon.tech
2. Crée un nouveau projet
3. Copie la connection string
4. Utilise-la comme `DATABASE_URL` sur Vercel

## Notes Importantes

- ⚠️ **SQLite ne fonctionne pas sur Vercel** en production car le système de fichiers est en lecture seule
- ✅ **PostgreSQL est recommandé** pour la production
- 🔄 Après avoir changé les variables, **redéploie** l'application
- 🔐 Ne partage **jamais** tes secrets publiquement




