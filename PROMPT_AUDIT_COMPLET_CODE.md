# 🔍 MEGA PROMPT - AUDIT COMPLET DU CODE LIGNE PAR LIGNE

**Date :** 18 Novembre 2025  
**Version :** 1.0  
**Objectif :** Review complète, audit, notation et correction de toutes les incohérences dans le codebase

---

## 🚨 INSTRUCTIONS CRITIQUES

**TU ES UN AUDITEUR SENIOR EXPERT EN CODE FRONT-END.**

**MISSION : FAIRE UNE REVIEW COMPLÈTE LIGNE PAR LIGNE DE TOUT LE CODEBASE**

**TU DOIS :**
1. ✅ Lire et analyser CHAQUE fichier ligne par ligne
2. ✅ Identifier TOUTES les incohérences (taille police, couleurs, styles, layouts, tailles de boxes, etc.)
3. ✅ Noter chaque problème avec une note de sévérité (1-10)
4. ✅ Corriger AU FUR ET À MESURE chaque incohérence identifiée
5. ✅ Assurer une COHÉRENCE TOTALE sur toutes les pages

**TU NE DOIS PAS :**
- ❌ Ignorer des fichiers
- ❌ Passer des problèmes en disant "c'est mineur"
- ❌ Laisser des incohérences "juste parce que ça fonctionne"
- ❌ Modifier la logique fonctionnelle (seulement le style/cohérence)

---

## 📋 PROCESSUS D'AUDIT

### ÉTAPE 1 : INVENTAIRE COMPLET

**Fichiers à auditer (PRIORITÉ ABSOLUE) :**

#### CSS (ORDRE DE PRIORITÉ)
1. `frontend/css/main.css` - Variables et styles globaux
2. `frontend/css/components.css` - Composants réutilisables
3. `frontend/css/cockpit.css` - Styles cockpit
4. `frontend/css/override-cockpit.css` - Overrides cockpit
5. `frontend/css/projections.css` - Styles projections

#### JavaScript
6. `frontend/js/app.js` - Application principale
7. `frontend/js/views/*.js` - Toutes les vues (dashboard, cockpit, projects, etc.)
8. `frontend/js/components/*.js` - Composants JS

#### HTML
9. `frontend/index.html` - Page principale

**Pour chaque fichier :**
- Lire TOUTES les lignes
- Noter chaque incohérence dans un tableau
- Corriger immédiatement après identification

---

## 🎯 STANDARDS À RESPECTER (COHÉRENCE TOTALE)

### 📐 TYPOGRAPHIE - STANDARDS STRICTS

#### Tailles de police UNIFIÉES (OBLIGATOIRE)

```css
/* Variables CSS à utiliser (DANS main.css) */
--text-xs: 0.75rem;      /* 12px - Badges uniquement */
--text-sm: 0.875rem;     /* 14px - Body text principal, labels */
--text-base: 1rem;       /* 16px - Card titles, navigation */
--text-lg: 1.125rem;     /* 18px - Section titles */
--text-xl: 1.25rem;      /* 20px - Page titles uniquement */
```

**Usage spécifique (DOIT ÊTRE IDENTIQUE PARTOUT) :**

- **Body text** : `14px` (var(--text-sm)) - **TOUJOURS**
- **Page title** : `20px` (var(--text-xl)) - **TOUJOURS**
- **Section titles** : `18px` (var(--text-lg)) - **TOUJOURS**
- **Card titles** : `16px` (var(--text-base)) - **TOUJOURS**
- **Labels / Captions** : `14px` (var(--text-sm)) - **TOUJOURS**
- **Badges** : `12px` (var(--text-xs)) - **TOUJOURS**
- **Small text / Captions secondaires** : `13px` - **SI utilisé, alors TOUT le code doit utiliser 13px pour ce cas**

**❌ INTERDICTIONS ABSOLUES :**
- ❌ Utiliser `15px` nulle part (remplacer par `14px` ou `16px`)
- ❌ Utiliser `13px` si d'autres pages utilisent `14px` pour le même usage
- ❌ Mélanger `rem`, `px`, `em` pour la même taille
- ❌ Utiliser `!important` sauf nécessité absolue (overrides)

**✅ CORRECTION :**
- ✅ TOUT le body text doit être `14px` (ou `var(--text-sm)`)
- ✅ TOUS les titres de pages doivent être `20px` (ou `var(--text-xl)`)
- ✅ TOUS les titres de sections doivent être `18px` (ou `var(--text-lg)`)
- ✅ TOUTES les tailles doivent utiliser les variables CSS
- ✅ Éliminer toutes les valeurs hardcodées

#### Poids de police UNIFIÉS

```css
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Labels */
--font-semibold: 600;    /* Titres, boutons */
--font-bold: 700;        /* Titres principaux uniquement */
```

**Usage :**
- **Body** : `400` (normal) - **TOUJOURS**
- **Labels** : `500` (medium) - **TOUJOURS**
- **Titres** : `600` (semibold) - **TOUJOURS**
- **Page title** : `600` ou `700` - **COHÉRENT sur toutes les pages**

#### Letter-spacing UNIFIÉ

```css
/* Titres */
letter-spacing: -0.02em;  /* Page titles */
letter-spacing: -0.01em;  /* Section titles, card titles */
letter-spacing: normal;   /* Body text */
letter-spacing: 0.5px;    /* Badges uppercase */
```

**❌ INTERDIT :**
- ❌ Utiliser `-0.03em` si les standards sont `-0.02em` / `-0.01em`
- ❌ Mélanger différentes valeurs pour le même type d'élément

---

### 🎨 COULEURS - STANDARDS STRICTS

#### Couleur principale HEARST

```css
--primary-green: #8afd81;          /* ⬤ Vert HEARST - UNIQUEMENT */
--accent-primary: #8afd81;         /* Alias */
--hearst-primary: #8afd81;         /* Alias */
```

**❌ À REMPLACER IMMÉDIATEMENT :**
- ❌ `#C5FFA7` → `#8afd81` (TOUTES les occurrences)
- ❌ `#7bed9f` → `#8afd81` (sauf si c'est explicitement un accent secondaire mint)
- ❌ `rgba(197, 255, 167, ...)` → `rgba(138, 253, 129, ...)`
- ❌ Toute autre couleur verte → `#8afd81`

#### RÈGLE CRITIQUE : Texte sur fond vert

**TOUJOURS utiliser du texte NOIR sur fond vert `#8afd81`**

```css
/* ✅ CORRECT */
background: #8afd81;
color: #000000;  /* ou #0a0a0a */

/* ❌ INCORRECT - À CORRIGER IMMÉDIATEMENT */
background: #8afd81;
color: #ffffff;  /* JAMAIS blanc sur vert */
```

#### Backgrounds UNIFIÉS

```css
--primary-dark: #000000;           /* Body background */
--bg-primary: #0a0a0a;             /* Header background */
--primary-grey: #1a1a1a;           /* Cards, sidebar background */
--bg-secondary: #1a1a1a;           /* Alias */
--bg-tertiary: #242424;            /* Éléments tertiaires */
--bg-hover: #2a2a2a;               /* États hover */
```

**❌ INTERDIT :**
- ❌ Utiliser `#141414` si le standard est `#0a0a0a`
- ❌ Utiliser `#1f1f1f` si le standard est `#1a1a1a`
- ❌ Mélanger différentes nuances de noir/gris pour le même usage

#### Textes UNIFIÉS

```css
--text-primary: #ffffff;           /* Texte principal - TOUJOURS */
--text-secondary: rgba(255, 255, 255, 0.7); /* Texte secondaire - TOUJOURS */
--text-muted: #999999;             /* Texte atténué - TOUJOURS */
```

**❌ INTERDIT :**
- ❌ Utiliser `#cccccc` si le standard est `rgba(255, 255, 255, 0.7)`
- ❌ Utiliser `#b8b8b8` si le standard est `rgba(255, 255, 255, 0.7)`
- ❌ Mélanger différentes opacités pour le même usage

---

### 📏 LAYOUT & ESPACEMENTS - STANDARDS STRICTS

#### Dimensions principales UNIFIÉES

```css
--sidebar-width: 200px;      /* TOUJOURS 200px (pas 180px, pas 260px) */
--header-height: 70px;       /* TOUJOURS 70px (pas 90px, sauf exception documentée) */
```

**❌ INTERDIT :**
- ❌ Utiliser `180px` pour la sidebar si le standard est `200px`
- ❌ Utiliser `90px` pour le header si le standard est `70px` (sauf cas documenté)

#### Espacements UNIFIÉS (multiples de 4px)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px - Grid gap standard */
--space-8: 2rem;      /* 32px */
```

**Usage spécifique :**
- **Content area padding** : `var(--space-8)` (32px) - **COHÉRENT sur toutes les pages**
- **Grid gap** : `var(--space-6)` (24px) - **COHÉRENT partout**
- **Card padding** : `var(--space-6)` (24px) - **COHÉRENT partout**
- **Section spacing** : `var(--space-8)` (32px) - **COHÉRENT partout**

**❌ INTERDIT :**
- ❌ Utiliser `30px` si le standard est `32px` (var(--space-8))
- ❌ Utiliser `20px` si le standard est `24px` (var(--space-6))
- ❌ Mélanger `rem`, `px` pour les espacements
- ❌ Utiliser des valeurs hardcodées au lieu des variables CSS

---

### 🎨 COMPOSANTS - STANDARDS STRICTS

#### Cards - DIMENSIONS UNIFIÉES

```css
.card {
    background: var(--bg-secondary);     /* #1a1a1a - TOUJOURS */
    border-radius: var(--radius-xl);     /* 16px - TOUJOURS */
    padding: var(--space-6);             /* 24px - TOUJOURS */
    border: var(--border-thin) solid var(--border-color);
}
```

**❌ INTERDIT :**
- ❌ Utiliser `padding: 20px` si le standard est `24px`
- ❌ Utiliser `border-radius: 12px` si le standard est `16px`
- ❌ Utiliser un background différent de `#1a1a1a` pour les cards

#### Boutons - DIMENSIONS UNIFIÉES

```css
.btn-primary {
    background: var(--primary-green);    /* #8afd81 */
    color: #000000;                      /* Noir - TOUJOURS */
    font-size: var(--text-sm);           /* 14px - TOUJOURS */
    font-weight: var(--font-semibold);   /* 600 - TOUJOURS */
    padding: var(--space-3) var(--space-6); /* 12px 24px - TOUJOURS */
    border-radius: var(--radius-full);   /* 9999px - TOUJOURS */
}
```

**❌ INTERDIT :**
- ❌ Utiliser `padding: 10px 20px` si le standard est `12px 24px`
- ❌ Utiliser `font-size: 16px` si le standard est `14px`
- ❌ Utiliser `color: #ffffff` sur fond vert

#### Badges - DIMENSIONS UNIFIÉES

```css
.badge {
    font-size: var(--text-xs);           /* 12px - TOUJOURS */
    font-weight: var(--font-semibold);   /* 600 - TOUJOURS */
    padding: var(--space-1) var(--space-3); /* 4px 12px - TOUJOURS */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: var(--radius-sm);     /* 4px - TOUJOURS */
}
```

**❌ INTERDIT :**
- ❌ Utiliser `font-size: 11px` si le standard est `12px`
- ❌ Utiliser `padding: 2px 8px` si le standard est `4px 12px`

---

### 🔍 BORDURES & OMBRES - STANDARDS STRICTS

```css
--radius-sm: 4px;        /* Petits éléments */
--radius-md: 8px;        /* Éléments moyens */
--radius-lg: 12px;       /* Cards moyennes */
--radius-xl: 16px;       /* Cards grandes - STANDARD */
--radius-full: 9999px;   /* Boutons pill */
```

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.6);
```

**❌ INTERDIT :**
- ❌ Utiliser `border-radius: 10px` si le standard est `8px` ou `12px`
- ❌ Utiliser des ombres hardcodées au lieu des variables CSS

---

## 📊 SYSTÈME DE NOTATION

Pour chaque incohérence trouvée, utiliser cette notation :

### Sévérité (1-10)
- **10** : Critique - Casse l'expérience utilisateur (couleurs incohérentes, tailles complètement différentes)
- **8-9** : Majeure - Incohérence visible entre pages (tailles de police différentes, padding différents)
- **5-7** : Modérée - Incohérence subtile mais visible (espacements légèrement différents)
- **3-4** : Mineure - Petites différences (valeurs proches mais pas identiques)
- **1-2** : Très mineure - Code non optimisé mais fonctionnel

### Format de notation

```markdown
## PROBLÈME #X : [Type] - [Fichier:Ligne]
**Sévérité :** X/10
**Description :** [Description détaillée]
**Impact :** [Impact sur l'utilisateur]
**Correction :** [Correction appliquée]
```

---

## ✅ CHECKLIST D'AUDIT (À COCHER LIGNE PAR LIGNE)

### CSS - main.css
- [ ] Toutes les variables CSS sont définies correctement
- [ ] Aucune valeur hardcodée pour les couleurs
- [ ] Aucune valeur hardcodée pour les tailles de police
- [ ] Aucune valeur hardcodée pour les espacements
- [ ] Body font-size est `14px` (pas `15px`)
- [ ] Toutes les tailles utilisent les variables CSS
- [ ] Header height est `70px` (vérifier s'il y a `90px` quelque part)
- [ ] Sidebar width est `200px`

### CSS - components.css
- [ ] Card titles : `16px` (var(--text-base))
- [ ] Card body : `14px` (var(--text-sm)) - PAS `15px`
- [ ] Card padding : `24px` (var(--space-6))
- [ ] Card border-radius : `16px` (var(--radius-xl))
- [ ] Boutons : font-size `14px`, padding `12px 24px`
- [ ] Badges : font-size `12px`, padding `4px 12px`
- [ ] Tous les espacements utilisent les variables CSS

### CSS - cockpit.css
- [ ] Couleur principale : `#8afd81` (pas `#C5FFA7`)
- [ ] Texte sur fond vert : NOIR (pas blanc)
- [ ] Tailles de police cohérentes avec le reste
- [ ] Espacements cohérents avec le reste
- [ ] Backgrounds cohérents avec le reste

### CSS - override-cockpit.css
- [ ] Pas de surcharge inutile
- [ ] Toutes les surcharges sont justifiées
- [ ] Cohérence avec les standards

### CSS - projections.css
- [ ] Couleur principale : `#8afd81`
- [ ] Tailles de police cohérentes
- [ ] Espacements cohérents

### JavaScript - Views
- [ ] Aucune manipulation inline de styles (sauf nécessaire)
- [ ] Tous les styles sont dans le CSS
- [ ] Aucune taille hardcodée en JS

### HTML - index.html
- [ ] Structure cohérente
- [ ] Classes CSS utilisées correctement
- [ ] Pas de styles inline

---

## 🔧 PROCESSUS DE CORRECTION

### Pour chaque incohérence identifiée :

1. **Identifier le problème** (ex: `body { font-size: 15px; }` alors que le standard est `14px`)

2. **Vérifier toutes les occurrences** dans tous les fichiers CSS

3. **Corriger immédiatement** :
   ```css
   /* AVANT */
   body {
       font-size: 15px;
   }
   
   /* APRÈS */
   body {
       font-size: var(--text-sm); /* 14px */
   }
   ```

4. **Vérifier les impacts** (est-ce que ça casse quelque chose ?)

5. **Noter dans le rapport** :
   ```markdown
   ✅ CORRIGÉ : main.css ligne 878
   - Changé `font-size: 15px !important;` → `font-size: var(--text-sm);`
   - Impact : Cohérence avec le reste de l'application
   ```

---

## 📝 RAPPORT FINAL À GÉNÉRER

Après l'audit complet, générer un rapport avec :

### 1. RÉSUMÉ EXÉCUTIF
- Nombre total de fichiers audités
- Nombre total de problèmes trouvés
- Nombre total de problèmes corrigés
- Score de cohérence global (avant/après)

### 2. PROBLÈMES PAR CATÉGORIE
- Typographie (tailles, poids, letter-spacing)
- Couleurs (couleur principale, backgrounds, textes)
- Layout (espacements, dimensions, padding)
- Composants (cards, boutons, badges)
- Bordures & Ombres

### 3. FICHIERS MODIFIÉS
- Liste de tous les fichiers modifiés
- Nombre de lignes modifiées par fichier
- Résumé des changements par fichier

### 4. VÉRIFICATIONS FINALES
- [ ] Toutes les tailles de police sont cohérentes
- [ ] Toutes les couleurs respectent la charte
- [ ] Tous les espacements utilisent les variables CSS
- [ ] Tous les composants ont les mêmes dimensions
- [ ] Aucune valeur hardcodée restante

---

## 🎯 OBJECTIFS FINAUX

**À la fin de l'audit, TU DOIS AVOIR :**

1. ✅ **Même taille de police** sur toutes les pages pour le même usage
2. ✅ **Même style** (font-weight, letter-spacing) pour le même type d'élément
3. ✅ **Même couleur** partout où c'est sensé être identique
4. ✅ **Même taille de boxe** (padding, margin) pour les mêmes composants
5. ✅ **Même taille de corps de page** (content-area padding, grid gap)
6. ✅ **Toutes les valeurs hardcodées remplacées** par des variables CSS
7. ✅ **Cohérence totale** entre cockpit, dashboard, projects, et toutes les autres pages

---

## 🚀 DÉMARRAGE

**COMMENCE MAINTENANT PAR :**

1. Lire `frontend/css/main.css` ligne par ligne
2. Identifier TOUS les problèmes
3. Les noter dans un tableau
4. Les corriger immédiatement
5. Passer au fichier suivant
6. Répéter pour tous les fichiers

**N'ARRÊTE PAS AVANT D'AVOIR :**
- ✅ Audité tous les fichiers CSS
- ✅ Audité tous les fichiers JavaScript (views)
- ✅ Corrigé toutes les incohérences
- ✅ Généré le rapport final

---

**TU ES L'AUDITEUR. TU DOIS ÊTRE MÉTICULEUX. PAS DE PITIÉ POUR LES INCOHÉRENCES. TOUT DOIT ÊTRE PARFAITEMENT COHÉRENT.**

**COMMENCE MAINTENANT. LIGNE PAR LIGNE. FICHIER PAR FICHIER.**

