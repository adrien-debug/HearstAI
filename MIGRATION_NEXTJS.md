# Migration vers Next.js - Guide

## ✅ Structure créée

### Fichiers de configuration
- `next.config.js` - Configuration Next.js avec rewrites pour l'API
- `package.json` - Mise à jour avec dépendances Next.js et React
- `.gitignore` - Mis à jour pour Next.js

### Structure de dossiers
```
pages/
  _app.js          # Point d'entrée Next.js
  _document.js     # Document HTML personnalisé
  index.js         # Page d'accueil (Dashboard)
  
components/
  Layout.js        # Layout principal
  layout/
    Sidebar.js     # Sidebar navigation
    Header.js      # Header avec horloge
  views/
    Dashboard.js   # Composant Dashboard

lib/
  icons.js         # Bibliothèque d'icônes (copié depuis frontend/js/icons.js)

public/
  css/             # Fichiers CSS (copiés depuis frontend/css/)
  js/              # Fichiers JS (copiés depuis frontend/js/)
  logo.svg         # Logo
```

## 📋 Prochaines étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer les pages Next.js
Pour chaque vue, créer une page dans `pages/`:
- `pages/cockpit.js`
- `pages/projects.js`
- `pages/electricity.js`
- `pages/collateral.js`
- `pages/admin-panel.js`

### 3. Convertir les vues JS en composants React
- Convertir `frontend/js/views/*.js` en composants React
- Adapter les imports/exports
- Utiliser les hooks React (useState, useEffect, etc.)

### 4. Migrer les utilitaires
- Convertir `frontend/js/api.js` en hooks React ou utilitaires
- Adapter `frontend/js/config.js` pour Next.js
- Migrer les composants (modal, notification, etc.)

### 5. Gérer le routing
- Utiliser Next.js Router au lieu de la navigation manuelle
- Adapter les liens et la navigation

### 6. API Routes (optionnel)
- Créer `pages/api/` pour les routes API Next.js
- Ou garder le backend Express séparé (recommandé)

## 🚀 Démarrer

```bash
# Installer les dépendances
npm install

# Démarrer le backend (dans un terminal séparé)
npm run backend

# Démarrer Next.js (dans un autre terminal)
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## ⚠️ Notes importantes

1. **Code existant**: Le code JS existant est dans `public/js/` et peut être chargé côté client
2. **CSS**: Les fichiers CSS sont dans `public/css/` et chargés dans `_app.js`
3. **Migration progressive**: La migration peut être faite progressivement, en gardant le code existant fonctionnel
4. **SSR**: Certains composants utilisent `dynamic` avec `ssr: false` car ils dépendent de Chart.js et d'APIs navigateur

## 🔄 Approche hybride

Pour une migration progressive, vous pouvez:
1. Garder le code JS existant dans `public/js/`
2. Charger les scripts existants via `<script>` tags
3. Convertir progressivement les vues en composants React
4. Utiliser Next.js pour le routing et le layout

