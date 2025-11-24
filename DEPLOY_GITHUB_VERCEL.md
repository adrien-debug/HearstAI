# 🚀 Guide de Déploiement GitHub + Vercel

Ce guide explique comment déployer HearstAI sur GitHub et Vercel avec déploiement automatique.

## 📋 Prérequis

1. Compte GitHub
2. Compte Vercel
3. Node.js 18+ installé
4. Git installé

## 🔧 Configuration Initiale

### 1. Configuration GitHub

#### Créer un nouveau repository sur GitHub

1. Va sur [GitHub](https://github.com/new)
2. Crée un nouveau repository (ex: `hearstai`)
3. **Ne pas** initialiser avec README, .gitignore ou licence

#### Connecter le projet local à GitHub

```bash
# Si pas déjà fait
git init

# Ajouter le remote
git remote add origin https://github.com/TON_USERNAME/hearstai.git

# Première commit
git add .
git commit -m "Initial commit"

# Push vers GitHub
git push -u origin main
```

### 2. Configuration Vercel

#### Installer Vercel CLI

```bash
npm install -g vercel
```

#### Se connecter à Vercel

```bash
vercel login
```

#### Premier déploiement

```bash
vercel
```

Suis les instructions :
- Link to existing project? **No**
- What's your project's name? **hearstai** (ou autre)
- In which directory is your code located? **./**

#### Récupérer les IDs Vercel

Après le premier déploiement, récupère :
- **VERCEL_ORG_ID** : Dans `.vercel/project.json` → `orgId`
- **VERCEL_PROJECT_ID** : Dans `.vercel/project.json` → `projectId`
- **VERCEL_TOKEN** : Sur [Vercel Dashboard](https://vercel.com/account/tokens) → Créer un token

### 3. Configuration des Secrets GitHub Actions

1. Va sur ton repo GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Ajoute les secrets suivants :

| Secret | Description | Où le trouver |
|--------|-------------|---------------|
| `VERCEL_TOKEN` | Token Vercel | [Vercel Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | ID de l'organisation Vercel | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | ID du projet Vercel | `.vercel/project.json` → `projectId` |
| `DATABASE_URL` | URL de la base de données | Ton `.env.local` |
| `NEXTAUTH_SECRET` | Secret NextAuth | Généré avec `openssl rand -base64 32` |
| `DEBANK_ACCESS_KEY` | Clé API DeBank | [DeBank API](https://docs.debank.com/) |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (optionnel) | [Anthropic](https://console.anthropic.com/) |
| `FIREBLOCKS_API_KEY` | Clé API Fireblocks (optionnel) | [Fireblocks](https://console.fireblocks.io/) |
| `FIREBLOCKS_SECRET_KEY` | Secret Fireblocks (optionnel) | [Fireblocks](https://console.fireblocks.io/) |
| `LUXOR_API_KEY` | Clé API Luxor (optionnel) | [Luxor](https://luxor.tech/) |

### 4. Configuration des Variables d'Environnement Vercel

1. Va sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionne ton projet
3. Va dans **Settings** → **Environment Variables**
4. Ajoute les variables suivantes :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DATABASE_URL` | URL de ta base de données | Production, Preview, Development |
| `NEXTAUTH_URL` | URL de ton site Vercel | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Secret NextAuth | Production, Preview, Development |
| `DEBANK_ACCESS_KEY` | Clé API DeBank | Production, Preview, Development |
| `ANTHROPIC_API_KEY` | Clé API Anthropic (optionnel) | Production, Preview, Development |
| `FIREBLOCKS_API_KEY` | Clé API Fireblocks (optionnel) | Production, Preview, Development |
| `FIREBLOCKS_SECRET_KEY` | Secret Fireblocks (optionnel) | Production, Preview, Development |
| `LUXOR_API_KEY` | Clé API Luxor (optionnel) | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | Laisse vide pour production | Production, Preview, Development |

## 🚀 Déploiement

### Déploiement Automatique (Recommandé)

Le workflow GitHub Actions se déclenche automatiquement à chaque push sur `main` :

1. Push tes changements :
```bash
git add .
git commit -m "Update project"
git push origin main
```

2. GitHub Actions va automatiquement :
   - Installer les dépendances
   - Générer Prisma Client
   - Builder le projet
   - Déployer sur Vercel

### Déploiement Manuel

Utilise le script `deploy.sh` :

```bash
./deploy.sh
```

Le script va :
- Vérifier Git
- Commiter les changements (si demandé)
- Push vers GitHub (si demandé)
- Déployer sur Vercel (si demandé)

### Déploiement Direct Vercel

```bash
vercel --prod
```

## 📝 Structure des Fichiers de Déploiement

### `.github/workflows/deploy.yml`

Workflow GitHub Actions qui :
- Se déclenche sur push vers `main`
- Installe les dépendances
- Génère Prisma Client
- Build le projet
- Déploie sur Vercel

### `vercel.json`

Configuration Vercel avec :
- Commandes de build
- Variables d'environnement
- Régions de déploiement

### `deploy.sh`

Script interactif pour :
- Préparer Git
- Push vers GitHub
- Déployer sur Vercel

## 🔍 Vérification

### Vérifier le déploiement GitHub Actions

1. Va sur ton repo GitHub
2. Clique sur l'onglet **Actions**
3. Vérifie que le workflow se termine avec succès

### Vérifier le déploiement Vercel

1. Va sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionne ton projet
3. Vérifie les déploiements dans l'onglet **Deployments**

## 🐛 Dépannage

### Erreur : "Project not found"

- Vérifie que `VERCEL_PROJECT_ID` est correct dans les secrets GitHub
- Vérifie que le projet existe sur Vercel

### Erreur : "Invalid token"

- Régénère le token Vercel
- Mets à jour le secret `VERCEL_TOKEN` sur GitHub

### Erreur : "Database connection failed"

- Vérifie que `DATABASE_URL` est correct
- Vérifie que la base de données est accessible depuis Vercel
- Pour SQLite, utilise une base de données cloud (ex: Supabase, PlanetScale)

### Erreur : "Build failed"

- Vérifie les logs dans GitHub Actions
- Vérifie que toutes les variables d'environnement sont configurées
- Vérifie que Prisma peut se connecter à la base de données

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## ✅ Checklist de Déploiement

- [ ] Repository GitHub créé
- [ ] Projet connecté à GitHub
- [ ] Vercel CLI installé
- [ ] Premier déploiement Vercel effectué
- [ ] IDs Vercel récupérés (ORG_ID, PROJECT_ID)
- [ ] Token Vercel créé
- [ ] Secrets GitHub Actions configurés
- [ ] Variables d'environnement Vercel configurées
- [ ] Workflow GitHub Actions testé
- [ ] Déploiement automatique fonctionnel

---

**Note** : Pour les bases de données SQLite en production, considère utiliser une base de données cloud comme Supabase, PlanetScale, ou Neon.

