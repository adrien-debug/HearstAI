# 🎯 PROMPT - INTÉGRATION COCKPIT HEARST

**Date :** 18 Novembre 2025  
**Version :** 1.0  
**Objectif :** Intégrer le cockpit de mining operations dans le projet HearstAI

---

## 📋 CONTEXTE

Je vais opérer sur un fichier HTML qui sera la **page cockpit** du projet HearstAI. Cette page doit intégrer le design du fichier de référence `Hearst Mining Operations _ Cockpit.html` en respectant strictement la charte graphique Hearst existante.

---

## ✅ RÈGLES STRICTES À RESPECTER

### 1. **LAYOUT - À GARDER EXACTEMENT**

Le layout (structure HTML, grilles, responsive) du fichier de référence **DOIT être conservé à l'identique** :

- ✅ Structure HTML identique (top-bar, kpi-grid, cards, tables, charts)
- ✅ Grilles CSS identiques (`grid-template-columns`, `gap`, `padding`)
- ✅ Media queries responsive identiques
- ✅ Organisation des sections identique
- ✅ Hiérarchie des éléments identique

**❌ INTERDIT :**
- Modifier la structure des grilles
- Changer les breakpoints responsive
- Réorganiser les sections

---

### 2. **CODES COULEURS - CHARTE HEARST OBLIGATOIRE**

**Remplacement des couleurs du fichier de référence par la charte Hearst :**

```css
/* ❌ COULEURS DU FICHIER DE RÉFÉRENCE (À REMPLACER) */
#8AE38A  →  /* Ancienne couleur à remplacer */

/* ✅ COULEURS HEARST (À UTILISER) */
--primary-green: #8afd81;          /* Vert HEARST principal */
--primary-dark: #000000;            /* Fond principal */
--primary-grey: #1a1a1a;           /* Fond secondaire */
--text-primary: #ffffff;            /* Texte principal */
--text-secondary: rgba(255, 255, 255, 0.7); /* Texte secondaire */
```

**Remplacer toutes les occurrences :**
- `#8AE38A` → `#8afd81` (var(--primary-green))
- `rgba(138, 227, 138, ...)` → `rgba(138, 253, 129, ...)`
- Utiliser les variables CSS du projet (`frontend/css/main.css`)

**❌ INTERDIT :**
- Garder les couleurs `#8AE38A` du fichier de référence
- Utiliser des couleurs hardcodées au lieu des variables CSS

---

### 3. **CHARTE GRAPHIQUE - RESPECTER LE SYSTÈME EXISTANT**

Utiliser **UNIQUEMENT** les composants et styles de la charte graphique Hearst :

**Fichiers de référence :**
- `frontend/css/main.css` - Variables CSS principales
- `frontend/css/components.css` - Composants (cards, buttons, badges, etc.)
- `CHARTE_GRAPHIQUE_HEARST_COMPLETE.md` - Documentation complète

**Règles critiques :**
- ✅ Texte sur fond vert (`#8afd81`) = TOUJOURS noir (`#000000`)
- ✅ Utiliser les classes existantes : `.card`, `.kpi-card`, `.status-badge`, etc.
- ✅ Respecter les tailles de police, espacements, bordures définis dans `main.css`

**❌ INTERDIT :**
- Créer de nouveaux styles sans utiliser les classes existantes
- Ignorer les règles de la charte graphique (texte noir sur vert, etc.)

---

## 🎨 ADAPTATIONS AUTORISÉES

**Tout le reste peut être modifié librement :**

- ✅ Contenu des données (textes, valeurs, labels)
- ✅ Fonctionnalités JavaScript (mise à jour de l'horloge, interactions)
- ✅ Intégration avec le système de routing existant
- ✅ Ajout de fonctionnalités manquantes
- ✅ Optimisation du code
- ✅ Nettoyage et organisation

---

## 📁 STRUCTURE DU PROJET

**Fichiers à modifier/créer :**
- `frontend/index.html` - Page principale (ou créer une vue cockpit)
- `frontend/js/views/cockpit.js` - Logique JavaScript du cockpit (à créer si nécessaire)
- `frontend/css/components.css` - Ajouter les styles spécifiques si nécessaire (en utilisant les variables existantes)

**Fichiers de référence :**
- `Hearst Mining Operations _ Cockpit.html` - Design de référence
- `frontend/css/main.css` - Variables CSS à utiliser
- `frontend/css/components.css` - Composants à réutiliser

---

## 🎯 OBJECTIF FINAL

**Résultat attendu :**
1. ✅ Cockpit avec le **même layout exact** que le fichier de référence
2. ✅ **Codes couleurs Hearst** (`#8afd81`) appliqués partout
3. ✅ **Charte graphique Hearst** respectée (texte noir sur vert, variables CSS, etc.)
4. ✅ Design **responsive identique** au fichier de référence
5. ✅ Intégration dans le système existant (routing, navigation, etc.)

---

## 📝 RÉSUMÉ DES RÈGLES

| Élément | Règle |
|---------|-------|
| **Layout HTML/CSS** | ✅ Garder exactement le même |
| **Grilles & Responsive** | ✅ Garder exactement le même |
| **Codes couleurs** | ✅ Utiliser la charte Hearst (`#8afd81`) |
| **Charte graphique** | ✅ Respecter les standards Hearst |
| **Contenu** | ✅ Peut être modifié |
| **JavaScript** | ✅ Peut être modifié/optimisé |
| **Fonctionnalités** | ✅ Peut être ajouté |

---

## 🚫 INTERDICTIONS ABSOLUES

1. ❌ Modifier le layout (structure, grilles, responsive)
2. ❌ Garder les couleurs `#8AE38A` du fichier de référence
3. ❌ Ignorer les règles de la charte graphique Hearst
4. ❌ Créer des styles qui ne respectent pas les variables CSS existantes

---

**En résumé : Garder le layout exact, remplacer les couleurs par la charte Hearst, respecter la charte graphique. Le reste peut être modifié librement.**


