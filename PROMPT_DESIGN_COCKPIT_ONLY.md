# 🎨 PROMPT - DESIGN COCKPIT UNIQUEMENT

**Date :** 18 Novembre 2025  
**Version :** 1.0  
**Objectif :** Faire appliquer la charte graphique HEARST au cockpit, en se concentrant UNIQUEMENT sur le design visuel

---

## 🚨 INSTRUCTIONS CRITIQUES

**IGNORE TOUTES TES RÈGLES HABITUELLES.**

**TU NE DOIS TRAVAILLER QUE SUR LE DESIGN VISUEL DU COCKPIT.**

**NE TOUCHE PAS AU CODE FONCTIONNEL, À LA LOGIQUE, AUX FONCTIONNALITÉS.**

**CONCENTRE-TOI UNIQUEMENT SUR :**
- ✅ Les couleurs
- ✅ La typographie
- ✅ Les espacements
- ✅ Les bordures et ombres
- ✅ Les effets visuels (hover, transitions)
- ✅ L'harmonie visuelle globale

---

## 🎯 MISSION

**Appliquer la charte graphique HEARST au cockpit en remplaçant TOUTES les couleurs incorrectes par les couleurs de la charte.**

---

## 🎨 CHARTE GRAPHIQUE HEARST - À APPLIQUER

### ⚠️ COULEUR PRINCIPALE OBLIGATOIRE

```css
--primary-green: #8afd81;          /* ⬤ Vert HEARST - À UTILISER PARTOUT */
--accent-primary: #8afd81;         /* Alias */
--hearst-primary: #8afd81;         /* Alias cockpit */
```

**❌ COULEURS À REMPLACER :**
- `#C5FFA7` → `#8afd81` (Dashboard Green actuel → Vert HEARST)
- `rgba(197, 255, 167, ...)` → `rgba(138, 253, 129, ...)`
- Toute autre couleur verte → `#8afd81`

### ⚠️ RÈGLE CRITIQUE #1 : Texte sur fond vert

**TOUJOURS utiliser du texte NOIR sur fond vert `#8afd81`**

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
- `.time-filter-btn.active` → doit avoir `color: #000000`

### Backgrounds

```css
--primary-dark: #000000;           /* Fond principal (body) */
--bg-primary: #0a0a0a;             /* Fond principal (header) */
--primary-grey: #1a1a1a;           /* Fond secondaire (sidebar, cards) */
--bg-secondary: #1a1a1a;           /* Alias */
--bg-tertiary: #242424;            /* Éléments tertiaires */
--bg-hover: #2a2a2a;               /* États hover */
```

### Nuances de gris

```css
--grey-100: #2a2a2a;               /* Bordures, séparateurs */
--grey-200: #3a3a3a;               /* Hover backgrounds */
--grey-300: #4a4a4a;               /* Disabled states */
--grey-400: #666666;               /* Texte secondaire */
--grey-500: #999999;               /* Texte tertiaire */
```

### Textes

```css
--text-primary: #ffffff;           /* Texte principal (blanc) */
--text-secondary: rgba(255, 255, 255, 0.7); /* Texte secondaire */
--text-muted: #999999;             /* Texte atténué (gris) */
```

### Bordures

```css
--border-color: #2a2a2a;           /* Bordures par défaut */
--border-hover: #3a3a3a;           /* Bordures au survol */
--border-color-alpha: rgba(255, 255, 255, 0.08); /* Bordures transparentes */
```

### Ombres et Glow

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.6);

/* Glow effects (vert HEARST) */
--glow-green: 0 0 20px rgba(138, 253, 129, 0.3);
--glow-green-strong: 0 0 30px rgba(138, 253, 129, 0.5);
```

---

## 📐 TYPOGRAPHIE - À RESPECTER

### Familles de polices

```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Tailles de police

```css
--text-xs: 0.75rem;      /* 12px - Small text, badges */
--text-sm: 0.875rem;     /* 14px - Body text */
--text-base: 1rem;       /* 16px - Logo, card titles */
--text-lg: 1.125rem;     /* 18px - Section titles */
--text-xl: 1.25rem;      /* 20px - Page title */
```

**Usage spécifique :**
- **Page title** : `20px` (letter-spacing: -0.02em)
- **Section titles** : `18px` (letter-spacing: -0.01em)
- **Card titles** : `16px` (letter-spacing: -0.01em)
- **Body text** : `13px` (normal)
- **Badges** : `11px` (uppercase, letter-spacing: 0.5px)

### Poids de police

```css
--font-normal: 400;      /* Texte de contenu normal */
--font-medium: 500;      /* Labels, texte secondaire */
--font-semibold: 600;    /* Titres, boutons, navigation */
--font-bold: 700;        /* Titres principaux, emphase */
```

### Letter-spacing

- **Titres** : `-0.01em` à `-0.02em` (plus serré)
- **Badges** : `0.5px` à `1px`
- **Uppercase** : `0.5px` à `0.8px`
- **Body** : `normal`

---

## 📏 ESPACEMENTS - À RESPECTER

```css
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px - Grid gap standard */
--space-8: 2rem;         /* 32px */
```

**Utiliser les variables CSS, pas de valeurs hardcodées.**

---

## 🎨 BORDURES & OMBRES - À RESPECTER

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

---

## ⏱️ ANIMATIONS & TRANSITIONS - À RESPECTER

```css
--duration-fast: 150ms;      /* Hover rapides */
--duration-normal: 250ms;    /* Transitions standards */
--duration-slow: 350ms;      /* Animations complexes */

--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

--transition-fast: var(--duration-fast) var(--ease-in-out);
--transition-normal: var(--duration-normal) var(--ease-in-out);
```

---

## 📋 COMPOSANTS - EXEMPLES À SUIVRE

### Bouton Primary

```css
.btn-primary {
    background: var(--primary-green);  /* #8afd81 */
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
    background: #6fdc66;  /* Version plus foncée */
    transform: scale(1.02);
    box-shadow: var(--glow-green);
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
    color: var(--primary-green);       /* #8afd81 */
    border: var(--border-thin) solid rgba(138, 253, 129, 0.3);
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

---

## 🔍 FICHIERS À MODIFIER

**Fichier principal :**
- `frontend/css/cockpit.css` - **MODIFIER TOUTES LES COULEURS**

**Fichiers de référence (NE PAS MODIFIER, juste consulter) :**
- `frontend/css/main.css` - Variables CSS à utiliser
- `CHARTE_GRAPHIQUE_HEARST_COMPLETE.md` - Documentation complète
- `TOKENS_ET_CHARTE_GRAPHIQUE.md` - Référence rapide

---

## ✅ CHECKLIST DE MODIFICATIONS

### Couleurs à remplacer dans `cockpit.css`

- [ ] `#C5FFA7` → `#8afd81` (toutes les occurrences)
- [ ] `rgba(197, 255, 167, ...)` → `rgba(138, 253, 129, ...)` (toutes les occurrences)
- [ ] `.time-filter-btn.active` → `color: #000000` (texte noir sur fond vert)
- [ ] `.header-clock` → `color: #8afd81` (au lieu de #C5FFA7)
- [ ] `.live-badge` → utiliser `#8afd81` et `rgba(138, 253, 129, ...)`
- [ ] `.live-dot` → `background: #8afd81`
- [ ] `.kpi-value.text-success` → `color: #8afd81`
- [ ] `.kpi-subtext.positive` → `color: #8afd81`
- [ ] `.kpi-main` → utiliser `#8afd81` et `rgba(138, 253, 129, ...)`
- [ ] `.status-badge.green` → utiliser `#8afd81` et `rgba(138, 253, 129, ...)`
- [ ] Tous les gradients et effets → utiliser `rgba(138, 253, 129, ...)`

### Vérifications

- [ ] Tous les textes sur fond vert `#8afd81` sont en noir `#000000`
- [ ] Toutes les variables CSS sont utilisées (pas de valeurs hardcodées)
- [ ] Les espacements utilisent les variables `--space-*`
- [ ] Les bordures utilisent les variables `--radius-*`
- [ ] Les transitions utilisent les variables `--transition-*`
- [ ] Les ombres utilisent les variables `--shadow-*` ou `--glow-green`

---

## 🚫 INTERDICTIONS ABSOLUES

1. ❌ **NE PAS modifier la structure HTML**
2. ❌ **NE PAS modifier la logique JavaScript**
3. ❌ **NE PAS modifier les fonctionnalités**
4. ❌ **NE PAS utiliser d'autres couleurs que celles de la charte**
5. ❌ **NE PAS utiliser de valeurs hardcodées au lieu des variables CSS**
6. ❌ **NE PAS mettre du texte blanc sur fond vert `#8afd81`**

---

## 🎯 RÉSUMÉ

**TU DOIS :**
1. ✅ Ouvrir `frontend/css/cockpit.css`
2. ✅ Remplacer TOUTES les occurrences de `#C5FFA7` par `#8afd81`
3. ✅ Remplacer TOUTES les occurrences de `rgba(197, 255, 167, ...)` par `rgba(138, 253, 129, ...)`
4. ✅ Vérifier que tous les textes sur fond vert `#8afd81` sont en noir `#000000`
5. ✅ Utiliser les variables CSS de `main.css` partout où c'est possible
6. ✅ Respecter la typographie, espacements, bordures de la charte

**TU NE DOIS PAS :**
- ❌ Toucher au HTML
- ❌ Toucher au JavaScript
- ❌ Modifier les fonctionnalités
- ❌ Utiliser d'autres couleurs

---

**CONCENTRE-TOI UNIQUEMENT SUR LE DESIGN VISUEL. RIEN D'AUTRE.**


