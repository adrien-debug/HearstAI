# 🏗️ HearstAI - Version Stable V2

**Date de création** : Décembre 2024  
**Statut** : ✅ Stable et déployé sur Vercel  
**Commit de référence** : `17882c8` (Optimisation sidebar - correction overlay et icônes)

---

## 📋 Table des matières

1. [Architecture Générale](#architecture-générale)
2. [Stack Technique](#stack-technique)
3. [Structure des Fichiers](#structure-des-fichiers)
4. [Composants Principaux](#composants-principaux)
5. [Optimisations Sidebar (V2)](#optimisations-sidebar-v2)
6. [Configuration](#configuration)
7. [Base de Données](#base-de-données)
8. [API Routes](#api-routes)
9. [Déploiement](#déploiement)
10. [Scripts Utilitaires](#scripts-utilitaires)

---

## 🏛️ Architecture Générale

### Vue d'ensemble

HearstAI est une plateforme d'intelligence minière construite avec **Next.js 14+ (App Router)** et **TypeScript**. L'architecture suit une approche monorepo avec séparation claire entre frontend (Next.js) et backend (API routes + services externes).

### Principes architecturaux

- **App Router Next.js** : Utilisation complète du nouveau système de routing de Next.js 14+
- **Server Components & Client Components** : Séparation claire entre composants serveur et client
- **API Routes** : Routes API intégrées dans `/app/api` pour les opérations serveur
- **Prisma ORM** : Gestion de la base de données avec migrations et schémas type-safe
- **NextAuth.js** : Authentification et gestion de session
- **Composition modulaire** : Composants réutilisables organisés par domaine

---

## 🔧 Stack Technique

### Core

- **Framework** : Next.js 14.2.0
- **Runtime** : Node.js >= 18.x
- **Language** : TypeScript 5.5.0
- **React** : 18.3.0

### Base de données

- **ORM** : Prisma 5.19.0
- **Base de données** : PostgreSQL (production), SQLite (développement)
- **Adapter Auth** : @auth/prisma-adapter 2.4.0

### Authentification

- **NextAuth.js** : 4.24.0
- **Bcryptjs** : 2.4.3 (hachage de mots de passe)

### UI & Styling

- **Tailwind CSS** : 3.4.0
- **Chart.js** : 4.5.1
- **React Chart.js 2** : 5.3.1
- **CSS Modules** : Styles globaux + modules spécifiques

### Intégrations externes

- **Google APIs** : googleapis 166.0.0, google-auth-library 10.5.0
- **Radix UI** : @radix-ui/react-dropdown-menu 2.1.16

### Développement

- **ESLint** : 8.57.0
- **PostCSS** : 8.4.0
- **Autoprefixer** : 10.4.0

---

## 📁 Structure des Fichiers

### Arborescence principale

```
HearstAI/
│
├── 📄 Configuration
│   ├── package.json              # Dépendances et scripts
│   ├── next.config.js            # Configuration Next.js
│   ├── tsconfig.json             # Configuration TypeScript
│   ├── tailwind.config.js        # Configuration Tailwind
│   ├── vercel.json               # Configuration Vercel (déploiement automatique activé)
│   ├── middleware.ts             # Middleware Next.js (auth, etc.)
│   └── postcss.config.js         # Configuration PostCSS
│
├── 📁 app/                        # Next.js App Router
│   ├── layout.tsx                # Layout principal (IconsLoader, Providers)
│   ├── page.tsx                  # Page d'accueil (Home/Overview)
│   │
│   ├── 📁 api/                   # Routes API
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── calculator/
│   │   ├── cockpit/
│   │   ├── collateral/
│   │   ├── customers/
│   │   ├── electricity/
│   │   ├── fireblocks/
│   │   ├── googledrive/
│   │   ├── profitability/
│   │   ├── transactions/
│   │   └── ...
│   │
│   ├── 📁 [pages]/               # Pages de l'application
│   │   ├── admin/
│   │   ├── cockpit/
│   │   ├── collateral/
│   │   ├── electricity/
│   │   ├── myearthai/
│   │   ├── profitability-index/
│   │   ├── transactions/
│   │   └── ...
│   │
│   └── 📁 auth/signin/           # Authentification
│
├── 📁 components/                 # Composants React
│   ├── Sidebar.tsx               # Sidebar navigation (optimisé V2)
│   ├── Header.tsx                # Header principal
│   ├── Icon.tsx                  # Composant icône générique
│   ├── IconsLoader.js            # Chargeur d'icônes (optimisé V2)
│   ├── LayoutWrapper.tsx         # Wrapper de layout
│   ├── Providers.tsx             # Providers (Session, etc.)
│   │
│   ├── 📁 admin/                 # Composants admin
│   ├── 📁 calculator/            # Composants calculatrice
│   ├── 📁 cockpit/               # Composants cockpit
│   ├── 📁 collateral/            # Composants collateral
│   ├── 📁 electricity/           # Composants électricité
│   ├── 📁 home/                  # Composants home/dashboard
│   ├── 📁 profitability-index/   # Composants profitability
│   ├── 📁 projects/              # Composants projets
│   ├── 📁 transactions/          # Composants transactions
│   └── 📁 ui/                    # Composants UI génériques
│
├── 📁 lib/                        # Utilitaires et helpers
│   ├── api.ts                    # Client API principal
│   ├── api-manager.ts            # Gestionnaire API
│   ├── auth.ts                   # Helpers authentification
│   ├── auth-helper.ts            # Utilitaires auth
│   ├── db.ts                     # Instance Prisma client
│   ├── debank.ts                 # Client Debank API
│   ├── utils.ts                  # Utilitaires généraux
│   │
│   ├── 📁 fireblocks/            # Clients Fireblocks
│   └── 📁 googledrive/           # Clients Google Drive
│
├── 📁 styles/                     # Styles CSS globaux
│   ├── globals.css               # Import de tous les styles
│   ├── sidebar-new.css           # Styles sidebar optimisés (V2)
│   ├── main.css                  # Styles principaux
│   ├── components.css            # Styles composants
│   ├── dashboard.css             # Styles dashboard
│   ├── electricity.css           # Styles électricité
│   ├── cockpit.css               # Styles cockpit
│   └── design-tokens.css         # Tokens de design
│
├── 📁 public/                     # Assets statiques
│   ├── js/
│   │   └── icons.js              # Système d'icônes SVG
│   ├── logo.svg                  # Logo HearstAI
│   └── ...
│
├── 📁 prisma/                     # Prisma ORM
│   ├── schema.prisma             # Schéma de base de données
│   └── migrations/               # Migrations de base de données
│
├── 📁 types/                      # Types TypeScript
│   ├── global.d.ts               # Types globaux
│   └── next-auth.d.ts            # Types NextAuth
│
├── 📁 scripts/                    # Scripts utilitaires
│   ├── sync-prisma-supabase.js
│   ├── check-db-health.js
│   └── ...
│
└── 📁 backend/                    # Backend Node.js (legacy/complémentaire)
    ├── server.js
    └── ...
```

---

## 🧩 Composants Principaux

### 1. Sidebar (`components/Sidebar.tsx`)

**Description** : Navigation principale de l'application avec menu latéral fixe.

**Structure** :
- Header avec logo HearstAI
- Navigation avec items de menu organisés par sections
- Sections : Mining, Cost Center, Hearst Tools, Strategie
- Footer avec Documents Vault, Admin et version

**Fonctionnalités** :
- Détection de la route active avec `usePathname()`
- Navigation avec Next.js `Link`
- Icônes SVG chargées dynamiquement via `IconsLoader`

**Items de menu** :
1. Overview (`/`)
2. MyEarthAI (`/myearthai`)
3. Cockpit (`/cockpit`)
4. Projection (`/projection`)
5. Transactions (`/transactions`)
6. Électricité (`/electricity`)
7. Profitability Index (`/profitability-index`)
8. Collateral (`/collateral`)
9. Wallet Scraper (`/wallet-scraper`)
10. Calculator (`/calculator`)
11. Business Dev (`/business-dev`)
12. Fundraising (`/fundraising`)
13. Partnership (`/partnership`)

### 2. IconsLoader (`components/IconsLoader.js`)

**Description** : Chargeur d'icônes SVG optimisé pour éviter les problèmes d'overlay et les re-renders excessifs.

**Optimisations V2** :
- Observer ciblé uniquement sur la sidebar (pas sur tout le body)
- Protection contre les ré-injections d'icônes déjà présentes
- Debounce pour limiter les re-renders
- Nettoyage approprié de l'observer au démontage
- Injection conditionnelle basée sur la présence de `window.Icons`

**Fonctionnement** :
1. Charge le script `/js/icons.js` de manière asynchrone
2. Injecte les icônes dans les éléments avec attribut `data-icon`
3. Observe uniquement les changements dans `#sidebar`
4. Déclenche l'événement `iconsLoaded` pour les autres composants

### 3. Layout Principal (`app/layout.tsx`)

**Description** : Layout racine de l'application Next.js.

**Composants inclus** :
- `<IconsLoader />` : Chargeur d'icônes
- `<Providers>` : Providers (Session, etc.)
- `<LayoutWrapper>` : Wrapper avec Sidebar et Header

**Configuration** :
- Thème dark par défaut (`data-theme="dark"`)
- Meta viewport configuré
- Script Chart.js chargé de manière asynchrone

### 4. LayoutWrapper (`components/LayoutWrapper.tsx`)

**Description** : Wrapper qui inclut la Sidebar et le Header pour toutes les pages.

**Structure** :
```tsx
<LayoutWrapper>
  {children} // Contenu de la page
</LayoutWrapper>
```

### 5. Providers (`components/Providers.tsx`)

**Description** : Providers React pour la session (NextAuth) et autres contextes globaux.

---

## ✨ Optimisations Sidebar (V2)

### Problèmes résolus dans V2

1. **Overlay et z-index**
   - Sidebar `z-index: 1100` (au-dessus des modaux à 1000)
   - Isolation CSS avec `isolation: isolate`
   - Protection des icônes avec `z-index` et `pointer-events: none`

2. **Re-renders excessifs**
   - Observer MutationObserver ciblé uniquement sur la sidebar
   - Debounce sur les mises à jour d'icônes
   - Protection contre les ré-injections

3. **Structure optimisée**
   - Remplacement des wrappers `<div>` par `<React.Fragment>`
   - Structure plus propre et conforme aux bonnes pratiques React

### Styles sidebar (`styles/sidebar-new.css`)

**Caractéristiques principales** :
- Position fixe avec `position: fixed`
- Largeur fixe : `260px`
- Hauteur : `100vh`
- Background : `rgba(0, 0, 0, 0.98)`
- Z-index : `1100`
- Isolation : `isolate` pour éviter les conflits d'overlay
- Scrollbar cachée (tous navigateurs)

**Navigation items** :
- Espacement : `gap: 4px`
- Padding : `10px 12px`
- Border radius : `8px`
- Hover : `rgba(138, 253, 129, 0.12)`
- Active : `rgba(138, 253, 129, 0.2)`

**Icônes** :
- Taille : `20px × 20px`
- Protection : `pointer-events: none`
- Isolation : `isolation: isolate`
- Z-index : `1`

**Séparateurs de section** :
- Gradient Hearst Green (`rgba(138, 253, 129, 0.35)`)
- Label en uppercase avec letter-spacing

---

## ⚙️ Configuration

### Next.js (`next.config.js`)

```javascript
{
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  }
}
```

### TypeScript (`tsconfig.json`)

- Target : ES2020
- Module : esnext
- Module resolution : bundler
- Strict mode : activé
- Paths : `@/*` → `./*`
- Exclusions : `backend/**/*`, `backups/**/*`, `agent.ts`

### Vercel (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "git": {
    "deploymentEnabled": {
      "main": true  // ✅ Déploiement automatique activé
    }
  }
}
```

**Configuration** :
- Build command : `prisma generate && next build`
- Framework : Next.js détecté automatiquement
- Région : `iad1` (US East)
- Déploiement automatique : Activé pour la branche `main`

### Tailwind CSS (`tailwind.config.js`)

- Content : `./pages/**/*`, `./components/**/*`, `./app/**/*`
- Thème : Étendu (personnalisation possible)

---

## 💾 Base de Données

### Schéma Prisma (`prisma/schema.prisma`)

**Modèles principaux** :

1. **User** : Utilisateurs de l'application
   - Relations : Account[], Session[], Project[]

2. **Account** : Comptes OAuth/credentials
   - Relations : User

3. **Session** : Sessions utilisateur
   - Relations : User

4. **Project** : Projets de minage
   - Relations : User

5. **Customer** : Clients
6. **Transaction** : Transactions
7. **Job** : Jobs/tâches
8. **Version** : Versions de projets
9. Et autres modèles métier...

**Provider** : PostgreSQL (production) / SQLite (développement)

**Migrations** : Gérées via Prisma Migrate

### Scripts de base de données

- `npm run db:generate` : Générer le client Prisma
- `npm run db:push` : Push le schéma vers la DB
- `npm run db:migrate` : Créer une migration
- `npm run db:studio` : Ouvrir Prisma Studio
- `npm run db:sync` : Synchroniser avec Supabase

---

## 🌐 API Routes

### Routes principales (`app/api/`)

#### Authentification
- `GET/POST /api/auth/[...nextauth]` : NextAuth.js handlers

#### Calculatrice
- `/api/calculator/calculate` : Calculs de rentabilité
- `/api/calculator/metrics` : Métriques
- `/api/calculator/projection` : Projections

#### Cockpit
- `GET /api/cockpit` : Données du cockpit

#### Collateral
- `GET /api/collateral` : Données collateral

#### Customers
- `GET /api/customers` : Liste des clients
- `GET /api/customers/[id]` : Détails d'un client
- `/api/customers/[id]/fireblocks` : Intégration Fireblocks

#### Électricité
- `GET /api/electricity` : Données électricité

#### Fireblocks
- `/api/fireblocks/transactions` : Transactions Fireblocks
- `/api/fireblocks/vaults` : Vaults Fireblocks

#### Google Drive
- `/api/googledrive/auth/callback` : Callback OAuth
- `/api/googledrive/files` : Liste des fichiers
- `/api/googledrive/files/[fileId]/download` : Téléchargement

#### Profitability
- `/api/profitability/summary` : Résumé de rentabilité

#### Transactions
- `GET /api/transactions` : Liste des transactions

#### Autres routes
- `/api/jobs` : Jobs/tâches
- `/api/projects` : Projets
- `/api/versions` : Versions
- `/api/wallets` : Wallets
- `/api/health` : Health check

---

## 🚀 Déploiement

### Vercel (Production)

**Configuration** :
- Projet : `hearstai`
- Organisation : `adrien-nejkovics-projects`
- Région : `iad1` (US East)

**Variables d'environnement requises** :
- `DATABASE_URL` : URL de connexion PostgreSQL
- `NEXTAUTH_URL` : URL de production
- `NEXTAUTH_SECRET` : Secret NextAuth
- `NEXT_PUBLIC_API_URL` : URL de l'API (optionnel)
- `DEBANK_ACCESS_KEY` : Clé API Debank
- `FIREBLOCKS_API_KEY` : Clé API Fireblocks (optionnel)
- `FIREBLOCKS_SECRET_KEY` : Secret Fireblocks (optionnel)
- `GOOGLE_CLIENT_ID` : Client ID Google OAuth (optionnel)
- `GOOGLE_CLIENT_SECRET` : Secret Google OAuth (optionnel)

**Déploiement automatique** :
- ✅ Activé pour la branche `main`
- Chaque push déclenche un nouveau déploiement

**Commandes de déploiement** :
```bash
# Déploiement manuel
vercel --prod

# Voir les logs
vercel logs

# Lister les déploiements
vercel ls
```

### Build local

```bash
# Installation
npm install

# Génération Prisma + Build
npm run build

# Démarrage production
npm start
```

---

## 🛠️ Scripts Utilitaires

### Scripts npm principaux

```bash
# Développement
npm run dev              # Serveur dev sur port 6001
npm run dev:local        # Démarrage local complet

# Build
npm run build            # Build production (prisma generate + next build)
npm start                # Serveur production

# Base de données
npm run db:generate      # Générer client Prisma
npm run db:push          # Push schéma vers DB
npm run db:migrate       # Créer migration
npm run db:studio        # Ouvrir Prisma Studio
npm run db:sync          # Synchroniser avec Supabase

# Tests
npm run test:auth        # Tester authentification
npm run test:login       # Tester login
npm run lint             # Linter ESLint

# Déploiement
npm run deploy:prod      # Script déploiement production
```

### Scripts shell

- `start-local-all.sh` : Démarrage local complet
- `start-local.sh` : Démarrage local frontend
- `deploy.sh` : Script de déploiement
- `backup.sh` : Script de backup

---

## 📦 Dépendances Clés

### Production

- **next** : `^14.2.0` - Framework React
- **react** : `^18.3.0` - Bibliothèque React
- **react-dom** : `^18.3.0` - DOM React
- **typescript** : `^5.5.0` - TypeScript
- **@prisma/client** : `^5.19.0` - Client Prisma
- **next-auth** : `^4.24.0` - Authentification
- **@auth/prisma-adapter** : `^2.4.0` - Adapter Prisma pour NextAuth
- **bcryptjs** : `^2.4.3` - Hachage de mots de passe
- **chart.js** : `^4.5.1` - Graphiques
- **react-chartjs-2** : `^5.3.1` - Wrapper React pour Chart.js
- **tailwindcss** : `^3.4.0` - Framework CSS
- **googleapis** : `^166.0.0` - APIs Google
- **@radix-ui/react-dropdown-menu** : `^2.1.16` - Composants UI

### Développement

- **prisma** : `^5.19.0` - CLI Prisma
- **eslint** : `^8.57.0` - Linter
- **eslint-config-next** : `^14.2.0` - Config ESLint Next.js
- **xlsx** : `^0.18.5` - Manipulation Excel (dev)

---

## 🎨 Design System

### Couleurs principales

- **Hearst Green** : `rgba(138, 253, 129, ...)` - Couleur principale
- **Background** : `rgba(0, 0, 0, 0.98)` - Fond principal (dark)
- **Border** : `rgba(255, 255, 255, 0.06)` - Bordures subtiles

### Typographie

- **Font Family** : Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif
- **Font Size** : 14px (base)
- **Line Height** : 1.5

### Espacements

- Sidebar width : `260px`
- Padding standard : `24px 16px`
- Gap navigation : `4px`
- Gap items : `12px`

### Composants UI

- **KpiBox** : Boîtes KPI réutilisables
- **CardWrapper** : Wrappers de cartes
- **SectionTitle** : Titres de section
- **Button** : Boutons avec variants

---

## 🔒 Sécurité

### Authentification

- NextAuth.js avec stratégie credentials
- Sessions sécurisées avec cookies httpOnly
- Hashage de mots de passe avec bcryptjs

### Variables d'environnement

- Toutes les clés API stockées dans les variables d'environnement
- `.env.local` pour le développement local
- Variables configurées sur Vercel pour la production

### Middleware

- Protection des routes avec `middleware.ts`
- Redirection automatique vers `/auth/signin` si non authentifié

---

## 📝 Notes Importantes

### Optimisations V2

1. **Sidebar** :
   - Z-index élevé pour rester au-dessus des overlays
   - Observer optimisé pour éviter les re-renders
   - Structure simplifiée avec React.Fragment

2. **IconsLoader** :
   - Observer ciblé uniquement sur la sidebar
   - Protection contre les ré-injections
   - Debounce pour limiter les performances

3. **Déploiement** :
   - Déploiement automatique activé sur Vercel
   - Build optimisé avec Prisma generate

### Points d'attention

- **Base de données** : Utiliser `db:sync` avant les migrations importantes
- **Variables d'environnement** : Vérifier que toutes sont configurées sur Vercel
- **Build** : Toujours exécuter `prisma generate` avant le build
- **Sidebar** : Ne pas modifier le z-index sans vérifier les impacts sur les modaux

---

## 📚 Ressources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Documentation](https://vercel.com/docs)

### Fichiers de référence

- `PROJECT_STRUCTURE.md` : Structure détaillée du projet
- `VERCEL_DEPLOYMENT.md` : Guide de déploiement Vercel
- `README.md` : Readme principal
- `CHANGELOG.md` : Historique des changements

---

## ✅ Checklist de stabilité V2

- [x] Sidebar optimisée avec z-index correct
- [x] IconsLoader optimisé pour éviter les re-renders
- [x] Déploiement automatique Vercel activé
- [x] Build production fonctionnel
- [x] Authentification stable
- [x] Base de données configurée (Prisma + PostgreSQL)
- [x] Styles consolidés et cohérents
- [x] Types TypeScript complets
- [x] Routes API fonctionnelles
- [x] Documentation à jour

---

**Version Stable V2** - Décembre 2024  
**Maintenu par** : HearstAI Team  
**Repository** : https://github.com/adrien-debug/HearstAI

