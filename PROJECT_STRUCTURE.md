# 📁 Arborescence complète du projet HearstAI

## Structure principale

```
DEV /HearstAI/
│
├── 📄 Configuration & Documentation
│   ├── package.json
│   ├── jsconfig.json
│   ├── tailwind.config.js
│   ├── middleware.ts
│   ├── .env.local.bak
│   └── *.md (documentation)
│
├── 📁 app/                          # Next.js App Router
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Page d'accueil
│   │
│   ├── 📁 admin/                    # Administration
│   │   └── page.tsx
│   │
│   ├── 📁 api/                      # Routes API
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── calculator/
│   │   ├── cockpit/route.ts
│   │   ├── collateral/route.ts
│   │   ├── customers/
│   │   ├── electricity/route.ts
│   │   ├── fireblocks/
│   │   ├── googledrive/
│   │   ├── hashprice/
│   │   ├── jobs/
│   │   ├── projects/
│   │   ├── profitability/
│   │   ├── setup/
│   │   ├── transactions/route.ts
│   │   ├── versions/
│   │   └── wallets/route.ts
│   │
│   ├── 📁 auth/signin/              # Authentification
│   ├── 📁 cockpit/                 # Cockpit
│   ├── 📁 collateral/              # Collateral
│   ├── 📁 customers/               # Clients
│   ├── 📁 documents-vault/        # Documents
│   ├── 📁 electricity/             # Électricité
│   ├── 📁 jobs/                    # Jobs
│   ├── 📁 logs/                    # Logs
│   ├── 📁 myearthai/               # MyEarthAI
│   ├── 📁 profitability-index/    # Profitability Index
│   ├── 📁 projection/              # Projection
│   ├── 📁 projects/                # Projets
│   ├── 📁 prompts/                 # Prompts
│   ├── 📁 settings/                # Paramètres
│   ├── 📁 setup/                   # Setup
│   ├── 📁 transactions/            # Transactions
│   ├── 📁 versions/                # Versions
│   ├── 📁 wallet/                  # Wallet
│   └── 📁 wallet-scraper/          # Wallet Scraper
│
├── 📁 components/                   # Composants React
│   ├── Sidebar.js                   # ⭐ Menu sidebar (modifié)
│   ├── SidebarIcon.tsx              # ⭐ Icônes sidebar (modifié)
│   ├── Dashboard.tsx
│   ├── Header.tsx
│   ├── ProfileDropdown.tsx
│   │
│   ├── 📁 admin/
│   ├── 📁 calculator/
│   ├── 📁 cockpit/
│   ├── 📁 collateral/
│   ├── 📁 documents-vault/
│   ├── 📁 electricity/
│   ├── 📁 home/
│   ├── 📁 profitability-index/
│   ├── 📁 projects/
│   ├── 📁 sections/
│   ├── 📁 setup/
│   ├── 📁 transactions/
│   ├── 📁 ui/
│   ├── 📁 views/
│   └── 📁 wallet-scraper/
│
├── 📁 styles/                       # Styles CSS
│   ├── globals.css                  # ⭐ Styles globaux (modifié)
│   ├── main.css                     # ⭐ Styles principaux (modifié)
│   ├── design-tokens.css
│   └── dashboard.css
│
├── 📁 frontend/                     # Frontend legacy
│   ├── 📁 css/
│   │   ├── main.css
│   │   ├── cockpit.css
│   │   ├── components.css
│   │   └── ...
│   └── 📁 js/
│
├── 📁 lib/                          # Bibliothèques utilitaires
│   ├── api-manager.ts
│   ├── auth-helper.ts
│   ├── 📁 fireblocks/
│   └── 📁 googledrive/
│
├── 📁 backend/                      # Backend Node.js
│   ├── server.js
│   ├── package.json
│   ├── 📁 routes/
│   ├── 📁 services/
│   └── 📁 models/
│
├── 📁 prisma/                       # Base de données
│   ├── schema.prisma
│   └── 📁 storage/
│
├── 📁 public/                       # Fichiers publics
│   ├── favicon.ico
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 uploads/
│
├── 📁 scripts/                      # Scripts utilitaires
│   ├── deploy-local.sh
│   ├── test-complete.js
│   └── test-api-connections.js
│
├── 📁 types/                        # Types TypeScript
│   ├── global.d.ts
│   └── next-auth.d.ts
│
└── 📁 backups/                      # Sauvegardes

```

## 📝 Fichiers modifiés dans cette session

### ⭐ Fichiers principaux modifiés :

1. **`components/Sidebar.js`**
   - Chemin complet : `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/components/Sidebar.js`
   - Structure du menu sidebar
   - Logique d'ouverture/fermeture
   - Gestion des états actifs

2. **`components/SidebarIcon.tsx`**
   - Chemin complet : `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/components/SidebarIcon.tsx`
   - Composant des icônes
   - Héritage de couleur

3. **`styles/globals.css`**
   - Chemin complet : `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/styles/globals.css`
   - Styles CSS du menu
   - Variables CSS
   - Règles pour les états actifs

4. **`styles/main.css`**
   - Chemin complet : `/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI/styles/main.css`
   - Ajustements mineurs

## 🎯 Points clés de l'architecture

- **Framework** : Next.js 14+ (App Router)
- **Styling** : CSS modules + globals.css
- **Backend** : Node.js séparé dans `/backend`
- **Database** : Prisma + SQLite
- **Structure** : Monorepo avec frontend et backend séparés


