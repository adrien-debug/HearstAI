# 🎯 PROMPT SYSTÈME — INTÉGRATION HEARST MINING DASHBOARD DANS ELECTRICITY INVOICES

## 📋 CONTEXTE

Tu es Claude, expert en intégration de dashboards et architecture frontend. Tu dois intégrer le **dashboard HEARST Mining** (fichier `hearst-mining-dashboard.html`) dans la page **"Electricity Invoices"** du cockpit CI/CD, en transformant les menus principaux du dashboard en **sous-menus** dans le header.

---

## 🎯 OBJECTIF PRINCIPAL

**Intégrer complètement le dashboard HEARST Mining dans la vue `electricity-invoices.js` du cockpit**, avec :

1. **Transformation des menus** : Les 5 menus principaux (Home, Mining, Electricity, Contracts, Analytics) deviennent des **sous-menus dans le header** (comme les tabs du Cockpit)
2. **Conservation du design HEARST** : Tous les styles, tokens, et composants HEARST doivent être préservés
3. **Navigation fluide** : Navigation entre sous-sections sans rechargement, avec état actif visible
4. **Intégration harmonieuse** : Le dashboard s'intègre parfaitement dans l'architecture existante du cockpit

---

## 📐 ARCHITECTURE CIBLE

### Structure de navigation

```
Sidebar Cockpit
├── Home
├── Cockpit
├── Projections
├── Electricity Invoices ← Menu principal (actif)
│   └── Header avec sous-menus :
│       ├── Home (sous-menu)
│       ├── Mining (sous-menu)
│       ├── Electricity (sous-menu) ← Actif par défaut
│       ├── Contracts (sous-menu)
│       └── Analytics (sous-menu)
└── Jobs
```

### Comportement attendu

- **Clic sur "Electricity Invoices" dans la sidebar** → Affiche la vue avec sous-menu "Electricity" actif par défaut
- **Clic sur un sous-menu** → Change le contenu affiché, met à jour l'état actif, conserve le scroll
- **Styles HEARST** : Tous les composants utilisent les tokens CSS HEARST (couleurs, espacements, typographie)

---

## 🔧 SPÉCIFICATIONS TECHNIQUES

### 1. Fichier à modifier

**`/Users/adrienbeyondcrypto/Desktop/DEV/HearstAI/frontend/js/views/electricity-invoices.js`**

### 2. Structure de la vue

```javascript
// Structure attendue :
export function renderElectricityInvoicesView(data) {
    return `
        <div class="electricity-invoices-view">
            <!-- Le contenu sera injecté dynamiquement selon le sous-menu actif -->
        </div>
    `;
}

// Fonction d'initialisation
export function initElectricityInvoices() {
    // 1. Setup header navigation (sous-menus)
    // 2. Charger la vue par défaut (Electricity)
    // 3. Setup event listeners pour navigation
    // 4. Initialiser Chart.js si nécessaire
}
```

### 3. Sous-menus à créer

| Sous-menu | ID | Vue correspondante | Source |
|-----------|-----|-------------------|---------|
| Home | `hearst-home` | Dashboard avec stats | `view-home` du dashboard HEARST |
| Mining | `hearst-mining` | Mining Operations | `view-mining` du dashboard HEARST |
| Electricity | `hearst-electricity` | Provider Summary | `view-electricity` du dashboard HEARST |
| Contracts | `hearst-contracts` | Contracts Management | `view-contracts` du dashboard HEARST |
| Analytics | `hearst-analytics` | Analytics Dashboard | `view-analytics` du dashboard HEARST |

### 4. Header Navigation (sous-menus)

**Pattern à suivre** : Identique à `setupCockpitHeaderNav()` dans `app.js`

```javascript
setupElectricityInvoicesHeaderNav() {
    // Créer la navigation dans le header avec les 5 sous-menus
    // Utiliser les styles `.cockpit-header-nav` existants
    // Activer "Electricity" par défaut
}
```

### 5. Templates de contenu

**Extraire le HTML de chaque vue** depuis `hearst-mining-dashboard.html` :

- **Home** : Lignes 872-940 (stats-grid + recent activity)
- **Mining** : Lignes 943-952 (mining operations)
- **Electricity** : Lignes 956-976 (provider summary + chart)
- **Contracts** : Lignes 979-989 (contracts management)
- **Analytics** : Lignes 992-1001 (analytics dashboard)

### 6. Styles HEARST à préserver

**Tous les tokens CSS HEARST doivent être utilisés** :

```css
/* Couleurs */
--primary-green: #8afd81;
--primary-dark: #000000;
--primary-grey: #1a1a1a;
--grey-100: #2a2a2a;
--grey-200: #3a3a3a;
--text-primary: #ffffff;
--text-secondary: #cccccc;
--text-muted: #999999;

/* Typographie */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 2rem;

/* Espacements */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Bordures */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--border-thin: 1px;

/* Ombres */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--glow-green: 0 0 20px rgba(138, 253, 129, 0.3);

/* Transitions */
--duration-fast: 150ms;
--duration-normal: 250ms;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 7. Composants à réutiliser

**Tous les composants HEARST** :

- `.card` - Cards avec style HEARST
- `.stat-card` - Cartes de statistiques
- `.stats-grid` - Grille de statistiques
- `.table-container` - Conteneur de tableaux
- `.btn`, `.btn-primary`, `.btn-secondary` - Boutons HEARST
- `.input`, `.filter-group` - Inputs et filtres
- `.tabs`, `.tab` - Onglets
- `.chart-container` - Conteneur de graphiques

---

## 🎨 RÈGLES DE STYLE

### 1. Cohérence visuelle

- **Utiliser UNIQUEMENT les tokens CSS HEARST** (jamais de valeurs en dur)
- **Respecter la charte graphique HEARST** à 100%
- **Maintenir la cohérence** avec le reste du cockpit

### 2. Navigation header

- **Style identique** aux tabs du Cockpit (`.cockpit-header-nav`)
- **Icônes** : Utiliser `Icons` depuis `icons.js`
- **État actif** : Highlight vert HEARST (`--primary-green`)
- **Hover** : Transition fluide avec glow green

### 3. Responsive

- **Mobile** : Sous-menus scrollables horizontalement
- **Desktop** : Tous les sous-menus visibles

---

## 🔄 LOGIQUE DE NAVIGATION

### Flow de navigation

```
1. User clique "Electricity Invoices" dans sidebar
   ↓
2. loadView('electricity-invoices') appelé
   ↓
3. renderElectricityInvoicesView() rendu
   ↓
4. setupElectricityInvoicesHeaderNav() créé
   ↓
5. showElectricityInvoicesSection('hearst-electricity') appelé (défaut)
   ↓
6. Contenu "Electricity" affiché
```

### Changement de sous-section

```
1. User clique sous-menu "Home"
   ↓
2. Event listener détecte le clic
   ↓
3. showElectricityInvoicesSection('hearst-home') appelé
   ↓
4. Contenu "Home" injecté dans .electricity-invoices-view
   ↓
5. État actif mis à jour (tab + contenu)
   ↓
6. Scroll préservé
```

---

## 📝 FONCTIONS À IMPLÉMENTER

### 1. `renderElectricityInvoicesView(data)`

**Rôle** : Rendre le conteneur principal (vide au départ, sera rempli par les sous-sections)

**Retour** : HTML du conteneur

### 2. `initElectricityInvoices()`

**Rôle** : Initialiser la vue complète

**Actions** :
- Setup header navigation
- Charger la sous-section par défaut (Electricity)
- Setup event listeners
- Initialiser Chart.js si nécessaire

### 3. `setupElectricityInvoicesHeaderNav()`

**Rôle** : Créer la navigation dans le header (sous-menus)

**Pattern** : Identique à `setupCockpitHeaderNav()` dans `app.js`

**Icônes à utiliser** :
- Home : `Icons.home`
- Mining : `Icons.miners` ou `Icons.production`
- Electricity : `Icons.energy`
- Contracts : `Icons.document`
- Analytics : `Icons.charts`

### 4. `showElectricityInvoicesSection(sectionId)`

**Rôle** : Afficher une sous-section spécifique

**Paramètres** :
- `sectionId` : `'hearst-home'` | `'hearst-mining'` | `'hearst-electricity'` | `'hearst-contracts'` | `'hearst-analytics'`

**Actions** :
- Injecter le HTML de la sous-section
- Mettre à jour l'état actif du tab
- Initialiser les composants (Chart.js, tabs, etc.)
- Préserver le scroll

### 5. Templates de sous-sections

**Fonctions à créer** :

```javascript
function getHomeSectionHTML() { /* Stats grid + Recent activity */ }
function getMiningSectionHTML() { /* Mining operations */ }
function getElectricitySectionHTML() { /* Provider summary + chart */ }
function getContractsSectionHTML() { /* Contracts management */ }
function getAnalyticsSectionHTML() { /* Analytics dashboard */ }
```

---

## 🔌 INTÉGRATION DANS APP.JS

### Modifications nécessaires dans `app.js`

1. **Import de la fonction d'initialisation** :
```javascript
import { initElectricityInvoices } from './views/electricity-invoices.js';
```

2. **Dans `renderView()`** :
```javascript
case 'electricity-invoices':
    this.contentArea.innerHTML = renderElectricityInvoicesView(data);
    // Injecter les styles
    this.injectStyles(electricityInvoicesStyles);
    // Initialiser la vue
    initElectricityInvoices();
    break;
```

3. **Dans `updatePageTitle()`** :
```javascript
electricity-invoices: 'Electricity Invoices'
```

4. **Dans `updateHeaderButton()`** :
```javascript
electricity-invoices: null // Pas de bouton d'action
```

5. **Dans `updateHeaderButton()` - Gestion spéciale** :
```javascript
else if (view === 'electricity-invoices') {
    // Cacher le bouton d'action
    if (this.btnNewAction) this.btnNewAction.style.display = 'none';
    // Afficher la navigation dans le header
    this.setupElectricityInvoicesHeaderNav();
}
```

---

## ✅ CHECKLIST DE VALIDATION

Avant de considérer l'intégration terminée, vérifier :

- [ ] Les 5 sous-menus sont visibles dans le header
- [ ] Le sous-menu "Electricity" est actif par défaut
- [ ] La navigation entre sous-sections fonctionne
- [ ] Tous les styles HEARST sont appliqués (tokens CSS)
- [ ] Le graphique Chart.js s'affiche correctement
- [ ] Les tabs (Olivier, Enegix, etc.) fonctionnent
- [ ] Les boutons et inputs sont stylés HEARST
- [ ] Le scroll est préservé lors des changements
- [ ] Les icônes s'affichent correctement
- [ ] La vue est responsive
- [ ] Aucune erreur dans la console
- [ ] Le design est cohérent avec le reste du cockpit

---

## 🚨 RÈGLES STRICTES

### ❌ NE JAMAIS

1. **Modifier les tokens CSS HEARST** (utiliser ceux existants)
2. **Créer de nouveaux styles** sans utiliser les tokens
3. **Dupliquer du code** (réutiliser les fonctions existantes)
4. **Casser la navigation existante** du cockpit
5. **Oublier d'initialiser Chart.js** pour les graphiques

### ✅ TOUJOURS

1. **Utiliser les tokens CSS HEARST** pour tous les styles
2. **Suivre le pattern** des autres vues (Cockpit, Projections)
3. **Préserver le scroll** lors des changements de vue
4. **Gérer les erreurs** gracieusement
5. **Tester chaque sous-section** individuellement

---

## 📦 RÉSULTAT ATTENDU

**Une vue "Electricity Invoices" complète** avec :

1. ✅ **5 sous-menus** dans le header (Home, Mining, Electricity, Contracts, Analytics)
2. ✅ **Contenu complet** de chaque sous-section extrait du dashboard HEARST
3. ✅ **Styles HEARST** 100% appliqués
4. ✅ **Navigation fluide** entre sous-sections
5. ✅ **Graphiques Chart.js** fonctionnels
6. ✅ **Intégration harmonieuse** dans le cockpit

---

## 🎯 COMMANDES À EXÉCUTER

Une fois l'intégration terminée :

1. **Tester la navigation** : Cliquer sur chaque sous-menu
2. **Vérifier les styles** : S'assurer que tout utilise les tokens HEARST
3. **Tester les interactions** : Tabs, boutons, filtres, graphiques
4. **Vérifier la console** : Aucune erreur JavaScript
5. **Tester le responsive** : Vérifier sur différentes tailles d'écran

---

**Tu es prêt à intégrer le dashboard HEARST Mining dans Electricity Invoices avec tous les menus transformés en sous-menus. Bonne intégration ! 🚀**

