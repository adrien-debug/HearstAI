# HearstAI - Claude CI/CD Cockpit

Application Next.js pour la gestion et le monitoring de projets de mining Bitcoin avec intégration Claude AI.

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.x
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement Next.js
npm run dev

# Dans un autre terminal, démarrer le backend
npm run backend
```

L'application sera accessible sur `http://localhost:3000` et l'API backend sur `http://localhost:4000`.

## 📁 Structure du projet

```
HearstAI/
├── pages/                 # Pages Next.js (routing)
│   ├── index.js          # Dashboard principal
│   ├── cockpit.js        # Vue Cockpit
│   ├── projects.js       # Projections
│   ├── electricity.js    # Électricité
│   ├── collateral.js     # Collateral
│   ├── jobs.js           # Jobs
│   ├── versions.js       # Versions
│   ├── prompts.js        # Prompts
│   ├── logs.js           # Logs
│   ├── settings.js       # Settings
│   └── admin-panel.js    # Admin Panel
│
├── components/
│   ├── views/            # Composants de vues principales
│   ├── sections/         # Sous-sections pour chaque page
│   │   ├── projects/     # 9 sections
│   │   ├── electricity/  # 5 sections
│   │   ├── collateral/   # 4 sections
│   │   ├── admin-panel/  # 9 sections
│   │   └── settings/     # 4 sections
│   ├── layout/           # Layout (Sidebar, Header)
│   └── hooks/            # Hooks React personnalisés
│
├── hooks/                # Hooks API (useAPI, useProjects, useJobs, useStats)
├── lib/                  # Utilitaires
│   ├── api.js           # Client API
│   ├── icons.js         # Système d'icônes SVG
│   └── dateUtils.js     # Utilitaires de formatage de dates
│
├── frontend/             # Code frontend legacy (conservé pour compatibilité)
└── backend/              # API Express.js
```

## ✨ Fonctionnalités

### Pages principales
- **Dashboard** : Vue d'ensemble avec wallet BTC et historique des transactions
- **Cockpit** : Monitoring en temps réel avec KPIs (hashrate, production BTC, statut des miners)
- **Projections** : 9 sous-sections pour calculs de rentabilité, projections financières, Monte Carlo, etc.
- **Électricité** : 5 sous-sections pour gestion des contrats, analytics, mining
- **Collateral** : 4 sous-sections pour gestion des collatéraux et clients
- **Jobs** : Gestion des jobs Claude CI/CD avec filtres et recherche
- **Versions** : Gestion des versions de code avec statuts (stable/draft)
- **Prompts** : Bibliothèque de templates de prompts réutilisables
- **Logs** : Journalisation des activités système avec filtres par niveau
- **Settings** : 4 sous-sections (General, Theme, API, Notifications)
- **Admin Panel** : 9 sous-sections pour administration complète

### Fonctionnalités techniques
- ✅ Migration complète vers Next.js 14
- ✅ SSR (Server-Side Rendering) avec React
- ✅ Navigation client-side avec Next.js Router
- ✅ Hooks personnalisés pour les appels API
- ✅ Gestion d'erreurs et états de chargement
- ✅ Formatage de dates cohérent (prévention erreurs d'hydratation)
- ✅ Design system cohérent avec variables CSS
- ✅ Responsive design
- ✅ Système d'icônes SVG centralisé

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React 18, Chart.js
- **Backend** : Express.js, SQLite (better-sqlite3)
- **Styling** : CSS avec variables CSS (design tokens)
- **Icons** : SVG inline
- **Charts** : Chart.js, react-chartjs-2

## 📝 Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Build de production
npm run start    # Démarrer le serveur de production
npm run lint     # Linter le code
npm run backend  # Démarrer le backend Express
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Configuration Next.js

Le fichier `next.config.js` configure :
- Rewrites API vers le backend
- Webpack externals pour better-sqlite3
- Variables d'environnement

## 🐛 Résolution de problèmes

### Erreurs d'hydratation
Les erreurs d'hydratation liées aux dates et à l'horloge ont été corrigées en utilisant :
- `lib/dateUtils.js` pour un formatage cohérent des dates
- État `mounted` pour l'horloge dans le Header
- Locale fixe `'en-US'` pour tous les formatages

### Erreurs API
- Vérifier que le backend est démarré (`npm run backend`)
- Vérifier l'URL de l'API dans `.env.local`
- Consulter les logs du navigateur pour plus de détails

## 📚 Documentation

### Hooks personnalisés

- `useAPI(endpoint, options)` : Hook générique pour les appels API
- `useProjects(filters)` : Récupérer les projets
- `useJobs(filters)` : Récupérer les jobs
- `useStats()` : Récupérer les statistiques

### Utilitaires de dates

- `formatDate(dateString, options)` : Format de base (MM/DD/YYYY)
- `formatDateShort(dateString)` : Format court (MMM DD, YYYY)
- `formatDateTime(dateString)` : Avec heure (MMM DD, HH:MM)
- `formatDateTimeWithSeconds(dateString)` : Avec secondes
- `formatDateCompact(dateString)` : Format compact (MMM DD)

## 🎨 Design System

Le projet utilise un design system basé sur des variables CSS définies dans `frontend/css/design-tokens.css` :
- Couleurs primaires (vert #C5FFA7)
- Espacements (--space-1 à --space-8)
- Typographie (--font-family-primary, --font-family-mono)
- Rayons de bordure (--radius-sm, --radius-md, --radius-lg)

## 📄 Licence

Private - HearstAI

## 👥 Équipe

Développé avec ❤️ pour HearstAI
