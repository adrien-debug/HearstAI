# 🎨 CHARTE GRAPHIQUE HEARST - COMPLÈTE

**Date :** 18 Novembre 2025  
**Version :** 2.0  
**Projet :** HearstAI  
**Source :** Hearst Flow + DS (4) + Codebase existant

---

## 📋 TABLE DES MATIÈRES

1. [Tokens de Couleurs](#-tokens-de-couleurs)
2. [Tokens de Typographie](#-tokens-de-typographie)
3. [Tokens d'Espacement](#-tokens-despacement)
4. [Tokens de Bordures & Ombres](#-tokens-de-bordures--ombres)
5. [Tokens d'Animations](#-tokens-danimations--transitions)
6. [Tokens de Layout](#-tokens-de-layout)
7. [Composants](#-composants)
8. [Règles Critiques](#-règles-critiques)
9. [Variables CSS Complètes](#-variables-css-complètes)

---

## 🎨 TOKENS DE COULEURS

### Couleur principale HEARST (Signature)
```css
--primary-green: #8afd81;          /* ⬤ Vert HEARST - Accent principal */
--accent-primary: #8afd81;         /* Alias */
--hearst-primary: #8afd81;         /* Alias cockpit */
```

**Variations :**
```css
--accent-primary-dark: #6fdc66;    /* Hover, états actifs */
--accent-primary-light: #a5ff9c;   /* États hover légers */
--hearst-primary-dark: #6fdc66;    /* Alias */
--hearst-primary-light: #a5ff9c;   /* Alias */
```

### Backgrounds
```css
--primary-dark: #000000;           /* ⬤ Fond principal (body) */
--bg-primary: #0a0a0a;             /* ⬤ Fond principal (header) */
--primary-grey: #1a1a1a;           /* ⬤ Fond secondaire (sidebar, cards) */
--bg-secondary: #1a1a1a;           /* Alias */
--bg-tertiary: #242424;            /* ⬤ Éléments tertiaires */
--bg-hover: #2a2a2a;               /* ⬤ États hover */
--hearst-dark-900: #0A0A0A;        /* Alias */
--hearst-dark-800: #141414;        /* Alias */
--hearst-dark-700: #1A1A1A;        /* Alias */
```

### Nuances de gris
```css
--grey-100: #2a2a2a;               /* ⬤ Bordures, séparateurs */
--grey-200: #3a3a3a;               /* ⬤ Hover backgrounds */
--grey-300: #4a4a3a;               /* ⬤ Disabled states */
--grey-400: #666666;               /* ⬤ Texte secondaire */
--grey-500: #999999;               /* ⬤ Texte tertiaire */
```

### Accents secondaires
```css
--accent-secondary: #7bed9f;       /* ⬤ Mint green (accent secondaire) */
--hearst-mint-500: #7bed9f;        /* Alias */
--accent-success: #8afd81;         /* ⬤ Succès (vert HEARST) */
--success: #27ae60;                /* ⬤ Succès alternatif */
--accent-warning: #f6c344;         /* ⬤ Avertissement (orange) */
--warning: #f39c12;                /* ⬤ Avertissement alternatif */
--accent-danger: #ff6b6b;          /* ⬤ Erreur, danger (rouge) */
--error: #e74c3c;                  /* ⬤ Erreur alternatif */
--accent-info: #4ecdc4;            /* ⬤ Information (cyan) */
--info: #3498db;                   /* ⬤ Information alternatif */
```

### Textes
```css
--text-primary: #ffffff;           /* ⬤ Texte principal (blanc) */
--text-secondary: #cccccc;         /* ⬤ Texte secondaire (gris clair) */
--text-muted: #999999;             /* ⬤ Texte atténué (gris) */
```

### Bordures
```css
--border-color: #2a2a2a;           /* ⬤ Bordures par défaut */
--border-hover: #3a3a3a;           /* ⬤ Bordures au survol */
--border-color-alpha: rgba(255, 255, 255, 0.08); /* Bordures transparentes */
```

### Modes clair (optionnel)
```css
--bg-light: #ffffff;               /* Fond mode clair */
--text-light: #000000;             /* Texte mode clair */
```

---

## 📐 TOKENS DE TYPOGRAPHIE

### Familles de polices
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
--font-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;
```

**Priorité :**
1. Inter (si disponible)
2. System fonts (Apple, Windows, Android)
3. Fallback Roboto

### Tailles de police
```css
--text-xs: 0.75rem;      /* 12px - Small text, badges */
--text-sm: 0.875rem;     /* 14px - Body text */
--text-base: 1rem;       /* 16px - Logo, card titles */
--text-lg: 1.125rem;     /* 18px - Section titles */
--text-xl: 1.25rem;      /* 20px - Page title */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 2rem;        /* 32px */
--text-4xl: 2.5rem;      /* 40px */
```

**Usage spécifique :**
- **Logo** : `16px` (uppercase, letter-spacing: 0.5px)
- **Page title** : `20px` (letter-spacing: -0.02em)
- **Section titles** : `18px` (letter-spacing: -0.01em)
- **Card titles** : `16px` (letter-spacing: -0.01em)
- **Body text** : `13px` (normal)
- **Small text** : `11-12px` (uppercase pour badges)
- **Caption** : `11px` (normal)

### Poids de police
```css
--font-normal: 400;      /* Texte de contenu normal */
--font-medium: 500;      /* Labels, texte secondaire */
--font-semibold: 600;    /* Titres, boutons, navigation */
--font-bold: 700;        /* Titres principaux, emphase */
```

### Line heights
```css
--leading-tight: 1.25;      /* Titres compacts */
--leading-normal: 1.5;      /* Texte de contenu lisible */
--leading-relaxed: 1.75;    /* Texte aéré */
```

### Letter-spacing
- **Titres** : `-0.01em` à `-0.02em` (plus serré)
- **Logo** : `0.5px`
- **Badges** : `0.5px` à `1px`
- **Uppercase** : `0.5px` à `0.8px`
- **Body** : `normal`

---

## 📏 TOKENS D'ESPACEMENT

### Espacements (multiples de 4px)
```css
--space-1: 0.25rem;      /* 4px - XS */
--space-2: 0.5rem;       /* 8px - SM */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px - MD */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px - LG (grid gap) */
--space-8: 2rem;         /* 32px - XL */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
```

**Aliases (compatibilité) :**
```css
--spacing-xs: var(--space-1);    /* 4px */
--spacing-sm: var(--space-2);    /* 8px */
--spacing-md: var(--space-4);    /* 16px */
--spacing-lg: var(--space-6);    /* 24px */
--spacing-xl: var(--space-8);    /* 32px */
```

---

## 🎨 TOKENS DE BORDURES & OMBRES

### Rayons de bordure
```css
--radius-sm: 4px;        /* Petits éléments */
--radius-md: 8px;        /* Éléments moyens */
--radius-lg: 12px;       /* Cards */
--radius-xl: 16px;       /* Cards grandes */
--radius-full: 9999px;   /* Pill shape (boutons) */
```

### Épaisseurs de bordure
```css
--border-thin: 1px;      /* Bordures standard */
--border-medium: 2px;    /* Bordures moyennes */
--border-thick: 3px;     /* Bordures épaisses */
```

### Ombres
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.6);
```

### Glow effects (vert HEARST)
```css
--glow-green: 0 0 20px rgba(138, 253, 129, 0.3);
--glow-green-strong: 0 0 30px rgba(138, 253, 129, 0.5);
```

---

## ⏱️ TOKENS D'ANIMATIONS & TRANSITIONS

### Durées
```css
--duration-fast: 150ms;      /* Hover rapides */
--duration-normal: 250ms;    /* Transitions standards */
--duration-slow: 350ms;      /* Animations complexes */
```

### Easings
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**Fonction principale :**
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

### Transitions (aliases)
```css
--transition-fast: var(--duration-fast) var(--ease-in-out);      /* 150ms */
--transition-normal: var(--duration-normal) var(--ease-in-out);  /* 250ms */
```

---

## 📐 TOKENS DE LAYOUT

### Dimensions principales
```css
--sidebar-width: 200px;      /* Largeur sidebar (fixe) */
--header-height: 70px;       /* Hauteur header */
```

### Structure
```
┌─────────────────────────────────────────┐
│  Sidebar (200px)  │  Main Content      │
│                   │  ┌───────────────┐ │
│  - Logo           │  │ Header (70px) │ │
│  - Navigation     │  └───────────────┘ │
│  - Version        │  ┌───────────────┐ │
│                   │  │ Content Area  │ │
│                   │  │ (scrollable)  │ │
│                   │  └───────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎯 RÈGLES CRITIQUES

### ⚠️ RÈGLE #1 : Texte sur fond vert
**TOUJOURS utiliser du texte noir sur fond vert `#8afd81`**

```css
/* ✅ CORRECT */
background: #8afd81;
color: #000000;  /* ou #0a0a0a */

/* ❌ INCORRECT */
background: #8afd81;
color: #ffffff;  /* JAMAIS blanc sur vert */
```

**S'applique à :**
- Boutons primaires
- Navigation active
- Badges sur fond vert
- Tous les éléments avec background `#8afd81`

### ⚠️ RÈGLE #2 : Couleur principale
**TOUJOURS utiliser `#8afd81` (pas `#7bed9f`)**

```css
/* ✅ CORRECT */
--accent-primary: #8afd81;  /* Vert HEARST */

/* ❌ INCORRECT */
--accent-primary: #7bed9f;  /* Vert menthe NEARST (ancien) */
```

**Note :** `#7bed9f` reste utilisé comme `--accent-secondary` (mint green), ce qui est correct.

### ⚠️ RÈGLE #3 : Badges
**TOUJOURS uppercase avec letter-spacing**

```css
.badge {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
    border: 1px solid;
}
```

### ⚠️ RÈGLE #4 : Logo
**Text-only uppercase (pas d'image si possible)**

```css
.logo {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--text-primary);
}
```

### ⚠️ RÈGLE #5 : Sidebar
**Largeur fixe 200px (pas 260px)**

```css
.sidebar {
    width: var(--sidebar-width);  /* 200px */
}
```

---

## 📋 COMPOSANTS

### Bouton Primary
```css
.btn-primary {
    background: var(--accent-primary);  /* #8afd81 */
    color: #000000;                     /* Texte noir */
    font-weight: var(--font-semibold);  /* 600 */
    font-size: var(--text-sm);          /* 14px */
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);  /* 9999px */
    padding: var(--space-3) var(--space-6);  /* 12px 24px */
    border: none;
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.btn-primary:hover:not(:disabled) {
    background: var(--accent-primary-dark);  /* #6fdc66 */
    transform: scale(1.02);
    box-shadow: var(--glow-green);
}
```

### Navigation Active
```css
.nav-item.active {
    background: var(--accent-primary);  /* #8afd81 */
    color: #000000;                     /* Texte noir */
    font-weight: var(--font-semibold);  /* 600 */
}
```

### Card
```css
.card {
    background: var(--bg-secondary);     /* #1a1a1a */
    border-radius: var(--radius-xl);     /* 16px */
    padding: var(--space-6);             /* 24px */
    box-shadow: var(--shadow-lg);
    border: var(--border-thin) solid var(--border-color);
    transition: var(--transition-normal);
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    border-color: rgba(138, 253, 129, 0.15);
}
```

### Badge Success
```css
.badge-success {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);          /* 11px */
    font-weight: var(--font-semibold);  /* 600 */
    border-radius: var(--radius-sm);    /* 4px */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(138, 253, 129, 0.1);
    color: var(--accent-primary);       /* #8afd81 */
    border: var(--border-thin) solid rgba(138, 253, 129, 0.3);
}
```

---

## 💻 VARIABLES CSS COMPLÈTES

```css
:root {
    /* ====================================
       COULEURS PRINCIPALES - HEARST
       ==================================== */
    
    /* Couleurs principales */
    --primary-green: #8afd81;          /* Accent principal (CTA, focus, highlights) */
    --primary-dark: #000000;           /* Fond principal */
    --primary-grey: #1a1a1a;          /* Fond secondaire (cards, panels) */
    
    /* Nuances de gris */
    --grey-100: #2a2a2a;              /* Bordures, séparateurs */
    --grey-200: #3a3a3a;              /* Hover backgrounds */
    --grey-300: #4a4a4a;              /* Disabled states */
    --grey-400: #666666;              /* Texte secondaire */
    --grey-500: #999999;              /* Texte tertiaire, placeholders */
    
    /* Texte */
    --text-primary: #fff;              /* Texte principal */
    --text-secondary: rgba(255, 255, 255, 0.7); /* Texte secondaire */
    --text-muted: #999999;            /* Texte désactivé/tertiaire */
    
    /* États et feedback */
    --success: #27ae60;               /* Succès, validation */
    --warning: #f39c12;               /* Avertissement */
    --error: #e74c3c;                 /* Erreur, danger */
    --info: #3498db;                  /* Information */
    
    /* Modes */
    --bg-light: #ffffff;              /* Fond mode clair */
    --text-light: #000000;            /* Texte mode clair */
    
    /* ====================================
       TYPOGRAPHIE
       ==================================== */
    
    /* Familles */
    --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    --font-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;
    
    /* Tailles */
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;      /* 16px */
    --text-lg: 1.125rem;    /* 18px */
    --text-xl: 1.25rem;     /* 20px */
    --text-2xl: 1.5rem;     /* 24px */
    --text-3xl: 2rem;       /* 32px */
    --text-4xl: 2.5rem;     /* 40px */
    
    /* Poids */
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    
    /* Line heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.75;
    
    /* ====================================
       ESPACEMENTS (multiples de 4px)
       ==================================== */
    --space-1: 0.25rem;   /* 4px */
    --space-2: 0.5rem;    /* 8px */
    --space-3: 0.75rem;   /* 12px */
    --space-4: 1rem;      /* 16px */
    --space-5: 1.25rem;   /* 20px */
    --space-6: 1.5rem;    /* 24px */
    --space-8: 2rem;      /* 32px */
    --space-10: 2.5rem;   /* 40px */
    --space-12: 3rem;     /* 48px */
    --space-16: 4rem;     /* 64px */
    --space-20: 5rem;     /* 80px */
    
    /* ====================================
       BORDURES & OMBRES
       ==================================== */
    
    /* Rayons de bordure */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
    
    /* Épaisseurs de bordure */
    --border-thin: 1px;
    --border-medium: 2px;
    --border-thick: 3px;
    
    /* Ombres */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.6);
    
    /* Glow green (accent) */
    --glow-green: 0 0 20px rgba(138, 253, 129, 0.3);
    --glow-green-strong: 0 0 30px rgba(138, 253, 129, 0.5);
    
    /* ====================================
       ANIMATIONS & TRANSITIONS
       ==================================== */
    
    /* Durées */
    --duration-fast: 150ms;
    --duration-normal: 250ms;
    --duration-slow: 350ms;
    
    /* Easings */
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    
    /* ====================================
       LAYOUT
       ==================================== */
    --sidebar-width: 200px;
    --header-height: 70px;
    
    /* ====================================
       COMPATIBILITÉ (aliases pour migration)
       ==================================== */
    --bg-primary: #0a0a0a; /* Background principal */
    --bg-secondary: #1a1a1a; /* Background secondaire */
    --bg-tertiary: #242424; /* Background tertiaire */
    --accent-primary: var(--primary-green);
    --accent-color: var(--primary-green);
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: var(--grey-200);
    --spacing-xs: var(--space-1);
    --spacing-sm: var(--space-2);
    --spacing-md: var(--space-4);
    --spacing-lg: var(--space-6);
    --spacing-xl: var(--space-8);
}
```

---

## 📊 STATISTIQUES

### Occurrences de #8afd81
- `frontend/css/cockpit.css` : **8 occurrences**
- `frontend/css/components.css` : **4 occurrences**
- `frontend/css/main.css` : **2 occurrences**
- `frontend/css/projections.css` : **42 occurrences**
- **Total : 56 occurrences exactes**

### Variables CSS
- **Variables principales** : 26 variables (main.css)
- **Variables HEARST** : 7 variables supplémentaires (cockpit.css, projections.css)
- **Total : 33 variables CSS**

---

## 📁 FICHIERS DE RÉFÉRENCE

### CSS
1. **`frontend/css/main.css`** - Variables CSS (lignes 11-148)
2. **`frontend/css/components.css`** - Composants
3. **`frontend/css/cockpit.css`** - Styles cockpit
4. **`frontend/css/projections.css`** - Styles projections

### Documentation
1. **`CHARTE_GRAPHIQUE_HEARST_COMPLETE.md`** - Ce fichier
2. **`TOKENS_ET_CHARTE_GRAPHIQUE.md`** - Référence rapide
3. **`STANDARDS_HEARST.md`** - Référence des standards
4. **`CHARTE_NEARST_APPLIED.md`** - Historique NEARST

### Design System Source
- **`Hearst Flow + DS (4)/`** - Fichiers SVG Figma exportés

---

## ✅ CHECKLIST DE VALIDATION

### Couleurs
- [x] Couleur principale : `#8afd81` (pas `#7bed9f`)
- [x] Texte sur vert : noir `#000000` ou `#0a0a0a`
- [x] Backgrounds : `#0a0a0a` et `#1a1a1a`
- [x] Variables CSS utilisées partout

### Typographie
- [x] Police : Inter (fallback system-ui)
- [x] Letter-spacing : négatif pour titres (-0.01em à -0.02em)
- [x] Badges : uppercase avec letter-spacing 0.5px
- [x] Tailles : conformes (11px badges, 13px body, etc.)

### Layout
- [x] Sidebar : `200px` (variable CSS)
- [x] Header : `70px` (variable CSS)
- [x] Espacements : variables CSS utilisées
- [x] Grid gap : `24px`

### Composants
- [x] Boutons : vert `#8afd81` + texte noir
- [x] Nav active : fond vert complet avec texte noir
- [x] Badges : uppercase + border + 11px
- [x] Cards : hover avec border verte
- [x] Tables : headers uppercase 11px

### Animations
- [x] Timing : variables CSS `--transition-fast` et `--transition-normal`
- [x] Function : `cubic-bezier(0.4, 0, 0.2, 1)`
- [x] Durées : `150ms` (fast), `250ms` (normal)

---

**Dernière mise à jour :** 18 Novembre 2025  
**Version :** 2.0  
**Statut :** ✅ Complète et consolidée
