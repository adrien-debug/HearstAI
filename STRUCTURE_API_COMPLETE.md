# 📐 STRUCTURE API COMPLÈTE - HEARSTAI

## 🎯 Vue d'ensemble

Ce document définit la structure complète de l'architecture API du projet HearstAI, organisée par domaines fonctionnels et suivant les meilleures pratiques.

---

## 📁 ARCHITECTURE GLOBALE

```
HearstAI/
│
├── app/api/                    # Routes API Next.js (App Router)
│   ├── _middleware/            # Middlewares partagés
│   ├── _types/                 # Types TypeScript partagés
│   ├── _utils/                 # Utilitaires API
│   │
│   ├── auth/                   # Authentification
│   ├── health/                 # Health checks
│   │
│   ├── core/                   # Domaines métier principaux
│   │   ├── projects/           # Gestion des projets
│   │   ├── jobs/               # Gestion des jobs
│   │   ├── versions/           # Gestion des versions
│   │   └── customers/          # Gestion des clients
│   │
│   ├── mining/                 # Domaines minage
│   │   ├── cockpit/           # Dashboard cockpit
│   │   ├── calculator/        # Calculs de profitabilité
│   │   ├── hashrate/          # Gestion hashrate
│   │   ├── electricity/       # Gestion électricité
│   │   └── profitability/    # Indices de profitabilité
│   │
│   ├── blockchain/            # Domaines blockchain
│   │   ├── collateral/        # Gestion collatéral
│   │   ├── wallets/           # Gestion portefeuilles
│   │   ├── transactions/     # Gestion transactions
│   │   └── fireblocks/        # Intégration Fireblocks
│   │
│   ├── external/              # Intégrations externes
│   │   ├── hashprice/         # Prix hash
│   │   ├── googledrive/       # Intégration Google Drive
│   │   └── debank/            # Intégration Debank
│   │
│   ├── portfolio/             # Gestion portfolio
│   ├── setup/                 # Configuration système
│   ├── data-analysis/         # Analyse de données
│   └── logs/                  # Logs système
│
└── lib/
    └── api.ts                 # Client API unifié
```

---

## 🔐 1. AUTHENTIFICATION & SÉCURITÉ

### Routes
```
/api/auth/[...nextauth]        # NextAuth.js handler
/api/init-user                 # Initialisation utilisateur
```

### Structure proposée
```
app/api/
├── auth/
│   ├── [...nextauth]/
│   │   └── route.ts          # NextAuth configuration
│   ├── session/
│   │   └── route.ts          # GET - Récupérer session actuelle
│   ├── logout/
│   │   └── route.ts          # POST - Déconnexion
│   └── refresh/
│       └── route.ts          # POST - Rafraîchir token
│
└── init-user/
    └── route.ts              # POST - Initialiser nouvel utilisateur
```

### Middleware de sécurité
```
app/api/_middleware/
├── auth.ts                   # Vérification authentification
├── rateLimit.ts              # Rate limiting
├── validation.ts             # Validation des données
└── errorHandler.ts           # Gestion centralisée des erreurs
```

---

## 🏥 2. HEALTH & STATUS

### Routes actuelles
```
/api/health                    # Health check
/api/status                    # Status système
/api/stats                     # Statistiques globales
```

### Structure proposée
```
app/api/
├── health/
│   └── route.ts              # GET - Health check simple
│
├── status/
│   ├── route.ts              # GET - Status détaillé système
│   ├── database/
│   │   └── route.ts          # GET - Status base de données
│   └── services/
│       └── route.ts          # GET - Status services externes
│
└── stats/
    └── route.ts              # GET - Statistiques globales
```

---

## 🎯 3. CORE - DOMAINES MÉTIER PRINCIPAUX

### 3.1 PROJECTS (Projets)

#### Routes actuelles
```
GET    /api/projects           # Liste des projets
POST   /api/projects           # Créer un projet
GET    /api/projects/[id]      # Détails d'un projet
PUT    /api/projects/[id]      # Modifier un projet
DELETE /api/projects/[id]      # Archiver un projet
POST   /api/projects/[id]/rollback  # Rollback à une version
```

#### Structure proposée
```
app/api/core/projects/
├── route.ts                  # GET, POST - Liste/Création
├── [id]/
│   ├── route.ts             # GET, PUT, DELETE - CRUD projet
│   ├── rollback/
│   │   └── route.ts         # POST - Rollback version
│   ├── versions/
│   │   └── route.ts         # GET - Versions du projet
│   └── jobs/
│       └── route.ts         # GET - Jobs du projet
└── search/
    └── route.ts             # GET - Recherche projets
```

---

### 3.2 JOBS (Tâches)

#### Routes actuelles
```
GET    /api/jobs               # Liste des jobs
POST   /api/jobs               # Créer un job
GET    /api/jobs/[id]          # Détails d'un job
DELETE /api/jobs/[id]          # Annuler un job
POST   /api/jobs/[id]/execute  # Exécuter un job
```

#### Structure proposée
```
app/api/core/jobs/
├── route.ts                  # GET, POST - Liste/Création
├── [id]/
│   ├── route.ts             # GET, DELETE - Détails/Annulation
│   ├── execute/
│   │   └── route.ts         # POST - Exécuter job
│   ├── logs/
│   │   └── route.ts         # GET - Logs du job
│   └── status/
│       └── route.ts         # GET - Status du job
└── queue/
    └── route.ts             # GET - Jobs en file d'attente
```

---

### 3.3 VERSIONS (Versions)

#### Routes actuelles
```
GET    /api/versions           # Liste des versions
POST   /api/versions           # Créer une version
GET    /api/versions/[id]      # Détails d'une version
DELETE /api/versions/[id]     # Supprimer une version
POST   /api/versions/[id]/stable  # Marquer comme stable
```

#### Structure proposée
```
app/api/core/versions/
├── route.ts                  # GET, POST - Liste/Création
└── [id]/
    ├── route.ts             # GET, DELETE - Détails/Suppression
    ├── stable/
    │   └── route.ts         # POST - Marquer stable
    ├── files/
    │   └── route.ts         # GET - Fichiers de la version
    └── download/
        └── route.ts         # GET - Télécharger version
```

---

### 3.4 CUSTOMERS (Clients)

#### Routes actuelles
```
GET    /api/customers          # Liste des clients
POST   /api/customers          # Créer un client
GET    /api/customers/[id]     # Détails d'un client
PUT    /api/customers/[id]     # Modifier un client
DELETE /api/customers/[id]     # Supprimer un client
GET    /api/customers/[id]/fireblocks  # Données Fireblocks client
```

#### Structure proposée
```
app/api/core/customers/
├── route.ts                  # GET, POST - Liste/Création
└── [id]/
    ├── route.ts             # GET, PUT, DELETE - CRUD client
    ├── fireblocks/
    │   └── route.ts         # GET - Données Fireblocks
    ├── contracts/
    │   └── route.ts         # GET - Contrats du client
    └── analytics/
        └── route.ts         # GET - Analytics client
```

---

## ⛏️ 4. MINING - DOMAINES MINAGE

### 4.1 COCKPIT (Dashboard)

#### Routes actuelles
```
GET    /api/cockpit            # Données cockpit principales
GET    /api/cockpit/earnings-chart    # Graphique revenus
GET    /api/cockpit/hashrate-chart    # Graphique hashrate
```

#### Structure proposée
```
app/api/mining/cockpit/
├── route.ts                  # GET - Données principales
├── earnings-chart/
│   └── route.ts             # GET - Graphique revenus
├── hashrate-chart/
│   └── route.ts             # GET - Graphique hashrate
├── miners/
│   └── route.ts             # GET - Liste miners
└── summary/
    └── route.ts             # GET - Résumé global
```

---

### 4.2 CALCULATOR (Calculs)

#### Routes actuelles
```
GET    /api/calculator         # Route principale
POST   /api/calculator/calculate      # Calcul profitabilité
GET    /api/calculator/metrics        # Métriques Bitcoin
GET    /api/calculator/projection     # Projections mensuelles
```

#### Structure proposée
```
app/api/mining/calculator/
├── route.ts                  # GET - Info calculator
├── calculate/
│   └── route.ts             # POST - Calcul profitabilité
├── metrics/
│   └── route.ts             # GET - Métriques Bitcoin
├── projection/
│   └── route.ts             # GET - Projections mensuelles
└── compare/
    └── route.ts             # POST - Comparer scénarios
```

---

### 4.3 ELECTRICITY (Électricité)

#### Routes actuelles
```
GET    /api/electricity        # Données électricité
```

#### Structure proposée
```
app/api/mining/electricity/
├── route.ts                  # GET - Données électricité
├── consumption/
│   └── route.ts             # GET - Consommation détaillée
├── costs/
│   └── route.ts             # GET - Coûts électricité
└── forecast/
    └── route.ts             # GET - Prévisions consommation
```

---

### 4.4 PROFITABILITY (Profitabilité)

#### Routes actuelles
```
GET    /api/profitability/summary     # Résumé profitabilité
```

#### Structure proposée
```
app/api/mining/profitability/
├── summary/
│   └── route.ts             # GET - Résumé profitabilité
├── index/
│   └── route.ts             # GET - Indice profitabilité
└── trends/
    └── route.ts             # GET - Tendances profitabilité
```

---

### 4.5 HASHRATE (Hashrate)

#### Structure proposée (nouveau)
```
app/api/mining/hashrate/
├── current/
│   └── route.ts             # GET - Hashrate actuel
├── history/
│   └── route.ts             # GET - Historique hashrate
├── statistics/
│   └── route.ts             # GET - Statistiques hashrate
└── forecast/
    └── route.ts             # GET - Prévisions hashrate
```

---

## 🔗 5. BLOCKCHAIN - DOMAINES BLOCKCHAIN

### 5.1 COLLATERAL (Collatéral)

#### Routes actuelles
```
GET    /api/collateral         # Données collatéral
```

#### Structure proposée
```
app/api/blockchain/collateral/
├── route.ts                  # GET - Données collatéral
├── summary/
│   └── route.ts             # GET - Résumé collatéral
├── by-wallet/
│   └── route.ts             # GET - Collatéral par wallet
└── by-protocol/
    └── route.ts             # GET - Collatéral par protocole
```

---

### 5.2 WALLETS (Portefeuilles)

#### Routes actuelles
```
GET    /api/wallets            # Liste des portefeuilles
```

#### Structure proposée
```
app/api/blockchain/wallets/
├── route.ts                  # GET, POST - Liste/Création
├── [id]/
│   ├── route.ts             # GET, PUT, DELETE - CRUD wallet
│   ├── balance/
│   │   └── route.ts         # GET - Solde wallet
│   └── transactions/
│       └── route.ts         # GET - Transactions wallet
└── sync/
    └── route.ts             # POST - Synchroniser wallets
```

---

### 5.3 TRANSACTIONS (Transactions)

#### Routes actuelles
```
GET    /api/transactions       # Liste des transactions
```

#### Structure proposée
```
app/api/blockchain/transactions/
├── route.ts                  # GET - Liste transactions
├── [id]/
│   └── route.ts             # GET - Détails transaction
├── pending/
│   └── route.ts             # GET - Transactions en attente
└── create/
    └── route.ts             # POST - Créer transaction
```

---

### 5.4 FIREBLOCKS (Intégration Fireblocks)

#### Routes actuelles
```
GET    /api/fireblocks/vaults         # Liste vaults
GET    /api/fireblocks/transactions   # Transactions Fireblocks
```

#### Structure proposée
```
app/api/blockchain/fireblocks/
├── vaults/
│   ├── route.ts             # GET - Liste vaults
│   └── [id]/
│       └── route.ts         # GET - Détails vault
├── transactions/
│   ├── route.ts             # GET, POST - Liste/Création
│   └── [id]/
│       └── route.ts         # GET - Détails transaction
└── webhooks/
    └── route.ts             # POST - Webhooks Fireblocks
```

---

## 🌐 6. EXTERNAL - INTÉGRATIONS EXTERNES

### 6.1 HASHPRICE (Prix Hash)

#### Routes actuelles
```
GET    /api/hashprice/current  # Prix hash actuel
```

#### Structure proposée
```
app/api/external/hashprice/
├── current/
│   └── route.ts             # GET - Prix hash actuel
├── history/
│   └── route.ts             # GET - Historique prix hash
└── forecast/
    └── route.ts             # GET - Prévisions prix hash
```

---

### 6.2 GOOGLE DRIVE

#### Routes actuelles
```
GET    /api/googledrive/auth/url      # URL authentification
GET    /api/googledrive/auth/callback # Callback auth
GET    /api/googledrive/files         # Liste fichiers
GET    /api/googledrive/files/[fileId] # Détails fichier
GET    /api/googledrive/files/[fileId]/download  # Télécharger
GET    /api/googledrive/folders       # Liste dossiers
```

#### Structure proposée
```
app/api/external/googledrive/
├── auth/
│   ├── url/
│   │   └── route.ts         # GET - URL authentification
│   └── callback/
│       └── route.ts         # GET - Callback auth
├── files/
│   ├── route.ts             # GET - Liste fichiers
│   └── [fileId]/
│       ├── route.ts         # GET - Détails fichier
│       └── download/
│           └── route.ts     # GET - Télécharger fichier
└── folders/
    └── route.ts             # GET - Liste dossiers
```

---

### 6.3 DEBANK (Intégration Debank)

#### Structure proposée (nouveau)
```
app/api/external/debank/
├── portfolio/
│   └── route.ts             # GET - Portfolio Debank
├── protocols/
│   └── route.ts             # GET - Protocoles supportés
└── sync/
    └── route.ts             # POST - Synchroniser données
```

---

## 📊 7. PORTFOLIO (Gestion Portfolio)

#### Routes actuelles
```
GET    /api/portfolio/upload            # Upload image
GET    /api/portfolio/images            # Liste images
GET    /api/portfolio/images/[id]      # Détails image
GET    /api/portfolio/sections         # Liste sections
GET    /api/portfolio/sections/[id]    # Détails section
GET    /api/portfolio/test-image       # Test upload
```

#### Structure proposée
```
app/api/portfolio/
├── upload/
│   └── route.ts             # POST - Upload fichier
├── images/
│   ├── route.ts             # GET, POST - Liste/Création
│   └── [id]/
│       ├── route.ts         # GET, PUT, DELETE - CRUD image
│       └── download/
│           └── route.ts     # GET - Télécharger image
├── sections/
│   ├── route.ts             # GET, POST - Liste/Création
│   └── [id]/
│       └── route.ts         # GET, PUT, DELETE - CRUD section
└── test-image/
    └── route.ts             # POST - Test upload
```

---

## ⚙️ 8. SETUP (Configuration)

#### Routes actuelles
```
GET    /api/setup/miners      # Liste mineurs
GET    /api/setup/hosters     # Liste hébergeurs
GET    /api/setup/prices      # Prix crypto
GET    /api/setup/summary     # Résumé configuration
```

#### Structure proposée
```
app/api/setup/
├── miners/
│   ├── route.ts             # GET, POST - Liste/Création
│   └── [id]/
│       └── route.ts         # GET, PUT, DELETE - CRUD mineur
├── hosters/
│   ├── route.ts             # GET, POST - Liste/Création
│   └── [id]/
│       └── route.ts         # GET, PUT, DELETE - CRUD hébergeur
├── prices/
│   ├── route.ts             # GET - Prix crypto
│   └── update/
│       └── route.ts         # POST - Mettre à jour prix
└── summary/
    └── route.ts             # GET - Résumé configuration
```

---

## 📈 9. DATA ANALYSIS (Analyse de données)

#### Routes actuelles
```
GET    /api/data-analysis/[identifier]  # Analyse par identifiant
```

#### Structure proposée
```
app/api/data-analysis/
├── [identifier]/
│   └── route.ts             # GET - Analyse par identifiant
├── batch/
│   └── route.ts             # POST - Analyse par lot
└── export/
    └── route.ts             # GET - Exporter analyses
```

---

## 📝 10. LOGS (Logs système)

#### Routes actuelles
```
GET    /api/logs              # Liste des logs
```

#### Structure proposée
```
app/api/logs/
├── route.ts                  # GET - Liste logs (avec filtres)
├── [id]/
│   └── route.ts             # GET - Détails log
├── export/
│   └── route.ts             # GET - Exporter logs
└── clear/
    └── route.ts             # POST - Nettoyer logs
```

---

## 🛠️ 11. UTILITAIRES & HELPERS

### Structure proposée
```
app/api/_utils/
├── response.ts              # Helpers réponses standardisées
├── validation.ts             # Schémas de validation
├── errors.ts                # Classes d'erreurs personnalisées
└── pagination.ts             # Helpers pagination
```

### Types partagés
```
app/api/_types/
├── common.ts                 # Types communs
├── requests.ts              # Types requêtes
└── responses.ts             # Types réponses
```

---

## 📦 12. CLIENT API UNIFIÉ (lib/api.ts)

### Structure proposée
```
lib/
└── api/
    ├── index.ts              # Export principal
    ├── client.ts             # Client fetchAPI de base
    ├── auth.ts               # API authentification
    ├── core/
    │   ├── projects.ts      # API projets
    │   ├── jobs.ts          # API jobs
    │   ├── versions.ts      # API versions
    │   └── customers.ts     # API clients
    ├── mining/
    │   ├── cockpit.ts       # API cockpit
    │   ├── calculator.ts    # API calculator
    │   ├── electricity.ts   # API électricité
    │   └── profitability.ts # API profitabilité
    ├── blockchain/
    │   ├── collateral.ts    # API collatéral
    │   ├── wallets.ts       # API wallets
    │   ├── transactions.ts  # API transactions
    │   └── fireblocks.ts    # API Fireblocks
    └── external/
        ├── hashprice.ts     # API hashprice
        ├── googledrive.ts   # API Google Drive
        └── debank.ts        # API Debank
```

---

## 🔄 13. STANDARDS & CONVENTIONS

### Format des réponses

#### Succès
```typescript
{
  data: T,                    // Données principales
  message?: string,            // Message optionnel
  meta?: {                    // Métadonnées optionnelles
    pagination?: {...},
    timestamp?: string
  }
}
```

#### Erreur
```typescript
{
  error: string,              // Message d'erreur
  code?: string,              // Code d'erreur
  details?: any               // Détails optionnels
}
```

### Codes HTTP standards
- `200` - Succès
- `201` - Créé
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `500` - Erreur serveur

### Méthodes HTTP
- `GET` - Lecture
- `POST` - Création/Action
- `PUT` - Mise à jour complète
- `PATCH` - Mise à jour partielle
- `DELETE` - Suppression

### Pagination
```typescript
{
  page: number,               // Page actuelle (1-indexed)
  limit: number,              // Nombre d'éléments par page
  total: number,              // Total d'éléments
  totalPages: number          // Nombre total de pages
}
```

### Filtres & Recherche
```typescript
{
  search?: string,            // Recherche textuelle
  filters?: {                 // Filtres spécifiques
    status?: string[],
    dateFrom?: string,
    dateTo?: string
  },
  sort?: {                    // Tri
    field: string,
    order: 'asc' | 'desc'
  }
}
```

---

## 🔒 14. SÉCURITÉ

### Authentification
- Toutes les routes (sauf `/api/health`, `/api/auth/*`) nécessitent authentification
- Utilisation de `getServerSession(authOptions)` pour vérifier la session
- Tokens JWT pour les appels API externes

### Autorisation
- Vérification de propriété des ressources
- Rôles utilisateurs (admin, user, etc.)
- Permissions granulaires par domaine

### Validation
- Validation des données d'entrée avec Zod ou Yup
- Sanitization des inputs
- Rate limiting par route

### CORS
- Configuration CORS stricte
- Whitelist des origines autorisées

---

## 📊 15. PERFORMANCE

### Caching
- Cache Next.js pour les routes statiques
- Revalidation ISR pour les données fréquentes
- Cache Redis pour les données partagées

### Optimisation
- Pagination systématique pour les listes
- Lazy loading des données lourdes
- Compression des réponses

### Monitoring
- Logging structuré
- Métriques de performance
- Alertes sur erreurs critiques

---

## 🧪 16. TESTS

### Structure proposée
```
__tests__/
├── api/
│   ├── auth.test.ts
│   ├── projects.test.ts
│   └── ...
└── integration/
    └── api.test.ts
```

### Types de tests
- Unit tests pour chaque route
- Integration tests pour les flux complets
- E2E tests pour les scénarios critiques

---

## 📚 17. DOCUMENTATION

### Documentation API
- OpenAPI/Swagger pour toutes les routes
- Exemples de requêtes/réponses
- Schémas de données

### Documentation code
- JSDoc pour toutes les fonctions
- Types TypeScript complets
- README par domaine

---

## 🚀 18. MIGRATION PROGRESSIVE

### Phase 1 : Réorganisation structure
1. Créer les dossiers par domaine
2. Déplacer les routes existantes
3. Mettre à jour les imports

### Phase 2 : Standardisation
1. Implémenter les middlewares
2. Standardiser les réponses
3. Ajouter la validation

### Phase 3 : Amélioration
1. Optimiser les performances
2. Ajouter les tests
3. Documenter l'API

---

## ✅ CHECKLIST MIGRATION

- [ ] Créer structure de dossiers par domaine
- [ ] Déplacer routes existantes
- [ ] Créer middlewares partagés
- [ ] Standardiser format réponses
- [ ] Ajouter validation des données
- [ ] Mettre à jour client API (`lib/api.ts`)
- [ ] Ajouter tests unitaires
- [ ] Documenter avec OpenAPI
- [ ] Optimiser performances
- [ ] Mettre à jour documentation

---

## 📝 NOTES IMPORTANTES

1. **Pas de breaking changes** : Migration progressive sans casser l'existant
2. **Backward compatibility** : Maintenir les routes actuelles pendant la transition
3. **Tests** : Tester chaque migration avant de continuer
4. **Documentation** : Mettre à jour la doc à chaque étape

---

**Date de création** : 2024
**Version** : 1.0.0
**Auteur** : Structure API HearstAI


