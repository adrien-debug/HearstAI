# 🎨 STYLE GUIDE - HOME PAGE (Dashboard)
**Source :** `frontend/js/views/dashboard.js`  
**Date :** 18 Novembre 2025  
**Version :** 1.0

---

## 📋 RÉSUMÉ

Ce document extrait **TOUS** les styles visuels de la Home Page (Dashboard) pour créer un style guide réutilisable sur les autres pages.

---

## 🎨 COULEURS

### Couleurs Principales

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--primary-green` | `#8afd81` | Accent principal (CTA, focus) |
| `--primary-dark` | `#000000` | Fond principal |
| `--primary-grey` | `#1a1a1a` | Fond secondaire (cards, panels) |
| `--text-primary` | `#fff` | Texte principal |
| `--text-secondary` | `rgba(255, 255, 255, 0.7)` | Texte secondaire |
| `--text-muted` | `#999999` | Texte tertiaire |

### Couleurs Spécifiques Dashboard

| Couleur | Valeur | Usage |
|---------|--------|-------|
| **Dashboard Green** | `#C5FFA7` | Wallet balance, transaction amounts, accents |
| **Dashboard Green RGBA** | `rgba(197, 255, 167, ...)` | Overlays, hovers, glows |
| **Grey Legend** | `#888888` | Legend dots, secondary data |
| **Table Header Gradient** | `linear-gradient(180deg, #454646 0%, #3a3a3a 100%)` | Table headers |
| **Border Color** | `rgba(255, 255, 255, 0.05)` | Card borders |
| **Border Hover** | `rgba(197, 255, 167, 0.2)` | Card hover borders |
| **Border Accent** | `rgba(197, 255, 167, 0.3)` | Table header bottom border |

### Couleurs d'État

| État | Couleur | Usage |
|------|---------|-------|
| Success | `#C5FFA7` | Positive values, amounts |
| Warning | `#FFA500` | Warnings |
| Error | `#FF4D4D` | Errors |
| Info | `#4a9eff` | Info elements |

---

## 📝 TYPOGRAPHIE

### Familles de Police

| Variable | Valeur |
|----------|--------|
| `--font-primary` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif` |
| `--font-mono` | `'Fira Code', 'Consolas', 'Monaco', monospace` |

### Tailles de Police

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--text-xs` | `0.75rem` (12px) | Labels, badges, small text |
| `--text-sm` | `0.875rem` (14px) | Secondary text, table cells |
| `--text-base` | `1rem` (16px) | Body text, buttons |
| `--text-lg` | `1.125rem` (18px) | Section titles, card titles |
| `--text-xl` | `1.25rem` (20px) | Page titles |
| `--text-2xl` | `1.5rem` (24px) | Large titles |
| `--text-3xl` | `2rem` (32px) | Very large titles |
| `--text-4xl` | `2.5rem` (40px) | Wallet balance BTC |

### Poids de Police

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--font-normal` | `400` | Body text |
| `--font-medium` | `500` | Secondary emphasis |
| `--font-semibold` | `600` | Titles, labels |
| `--font-bold` | `700` | Main titles, values |

### Line Heights

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--leading-tight` | `1.25` | Large titles |
| `--leading-normal` | `1.5` | Body text |
| `--leading-relaxed` | `1.75` | Long paragraphs |

### Letter Spacing

| Usage | Valeur |
|-------|--------|
| Titres principaux | `-0.02em` |
| Titres secondaires | `-0.01em` |
| Labels uppercase | `0.5px` |
| Badges | `0.5px` |
| Small text | `0.1px` |

---

## 📦 ESPACEMENTS

### Espacements Standards (multiples de 4px)

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--space-1` | `0.25rem` (4px) | Très petits gaps |
| `--space-2` | `0.5rem` (8px) | Petits gaps |
| `--space-3` | `0.75rem` (12px) | Gaps moyens |
| `--space-4` | `1rem` (16px) | Gaps standards |
| `--space-5` | `1.25rem` (20px) | Gaps moyens-grands |
| `--space-6` | `1.5rem` (24px) | Gaps grands |
| `--space-8` | `2rem` (32px) | Sections spacing |

### Espacements Spécifiques Dashboard

| Usage | Valeur |
|-------|--------|
| Dashboard content gap | `var(--space-8)` (32px) |
| Section margin bottom | `var(--space-6)` (24px) |
| Card padding | `var(--space-4)` (16px) |
| Table cell padding | `var(--space-4)` (16px) |
| Table header padding | `var(--space-3) var(--space-4)` (12px 16px) |
| Button padding | `var(--space-3) var(--space-6)` (12px 24px) |

---

## 🎯 BORDURES & RAYONS

### Rayons de Bordure

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--radius-sm` | `4px` | Petits éléments |
| `--radius-md` | `8px` | Boutons, inputs |
| `--radius-lg` | `12px` | Cards moyennes |
| `--radius-xl` | `16px` | Cards principales |
| `--radius-full` | `9999px` | Boutons ronds, badges |

### Épaisseurs de Bordure

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--border-thin` | `1px` | Bordures standards |
| `--border-medium` | `2px` | Bordures accentuées (table headers) |

### Couleurs de Bordure

| Usage | Valeur |
|-------|--------|
| Card border | `rgba(255, 255, 255, 0.05)` |
| Card hover border | `rgba(197, 255, 167, 0.2)` |
| Table header bottom | `rgba(197, 255, 167, 0.3)` |
| Input border | `rgba(255, 255, 255, 0.08)` |
| Input hover border | `rgba(197, 255, 167, 0.3)` |
| Input focus border | `#C5FFA7` |

---

## 🌑 OMBRES & EFFETS

### Ombres de Cards

**Card Standard :**
```css
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

**Card Hover :**
```css
box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(197, 255, 167, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### Text Shadows

| Usage | Valeur |
|-------|--------|
| Wallet balance BTC | `0 0 20px rgba(197, 255, 167, 0.3)` |
| Transaction amounts | `0 0 10px rgba(197, 255, 167, 0.2)` |

### Backdrop Filters

| Usage | Valeur |
|-------|--------|
| Cards | `blur(20px) saturate(180%)` |
| Inputs | `blur(10px)` |

### Backgrounds

**Card Background :**
```css
background: rgba(26, 26, 26, 0.7);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
```

**Card Gradient Overlay (::after) :**
```css
background: radial-gradient(
    circle at top right,
    rgba(197, 255, 167, 0.05) 0%,
    transparent 50%
);
```

---

## 🎛️ COMPOSANTS

### Cards

**Structure :**
- Background : `rgba(26, 26, 26, 0.7)`
- Border : `1px solid rgba(255, 255, 255, 0.05)`
- Border radius : `var(--radius-xl)` (16px)
- Padding : `var(--space-4)` (16px)
- Box shadow : (voir section Ombres)
- Transition : `all var(--duration-normal) var(--ease-in-out)`
- Position : `relative` (pour ::after gradient)

**Hover :**
- Transform : `translateY(-4px)`
- Box shadow : (voir section Ombres hover)
- Border : `1px solid rgba(197, 255, 167, 0.2)`

### Tables

**Table Container :**
- Background : `rgba(26, 26, 26, 0.7)`
- Border : `1px solid rgba(255, 255, 255, 0.05)`
- Border radius : `var(--radius-xl)` (16px)
- Overflow : `hidden`

**Table Header :**
- Background : `linear-gradient(180deg, #454646 0%, #3a3a3a 100%)`
- Border bottom : `2px solid rgba(197, 255, 167, 0.3)`
- Padding : `var(--space-3) var(--space-4)` (12px 16px)
- Font size : `var(--text-xs)` (12px)
- Font weight : `var(--font-normal)` (400)
- Text transform : `uppercase`
- Letter spacing : `0.5px`
- Color : `var(--text-primary)` (#fff)

**Table Body Rows :**
- Padding : `var(--space-4)` (16px)
- Font size : `var(--text-base)` (16px)
- Color : `var(--text-secondary)` (rgba(255, 255, 255, 0.7))
- Border bottom : `1px solid rgba(255, 255, 255, 0.05)`

**Table Row Even :**
- Background : `rgba(255, 255, 255, 0.02)`

**Table Row Hover :**
- Background : `linear-gradient(90deg, rgba(197, 255, 167, 0.05) 0%, rgba(197, 255, 167, 0.1) 50%, rgba(197, 255, 167, 0.05) 100%)`
- Box shadow : `inset 2px 0 0 #C5FFA7`
- Transform : `translateX(2px)`

### Buttons

**Button Primary (Export Excel) :**
- Background : `#C5FFA7`
- Color : `#000000` (texte noir sur fond vert)
- Padding : `var(--space-3) var(--space-6)` (12px 24px)
- Border radius : `var(--radius-full)` (30px)
- Font size : `var(--text-sm)` (14px)
- Font weight : `var(--font-semibold)` (600)
- Letter spacing : `-0.01em`
- Box shadow : `0 4px 16px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)`

**Button Hover :**
- Background : `#B0FF8F`
- Box shadow : `0 6px 24px rgba(197, 255, 167, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)`
- Transform : `translateY(-1px) scale(1.02)`

**Button See More :**
- Background : `transparent`
- Color : `var(--text-secondary)` (rgba(255, 255, 255, 0.7))
- Padding : `4px 8px`
- Font size : `11px`
- Font weight : `var(--font-normal)` (400)
- Border radius : `var(--radius-sm)` (4px)
- Opacity : `0.7`

**Button See More Hover :**
- Color : `#C5FFA7`
- Background : `rgba(197, 255, 167, 0.03)`
- Opacity : `1`

### Inputs / Selects

**Select (Date Range, Contract) :**
- Background : `rgba(10, 10, 10, 0.6)`
- Border : `1px solid rgba(255, 255, 255, 0.08)`
- Border radius : `var(--radius-md)` (8px)
- Padding : `var(--space-3) var(--space-4)` (12px 16px)
- Padding right : `40px` (pour flèche)
- Color : `var(--text-primary)` (#fff)
- Font size : `var(--text-sm)` (14px)
- Backdrop filter : `blur(10px)`
- Min width : `180px` / `200px`
- Max width : `220px` / `240px`

**Select Hover :**
- Border color : `rgba(197, 255, 167, 0.3)`
- Background : `rgba(10, 10, 10, 0.8)`

**Select Focus :**
- Border color : `#C5FFA7`
- Box shadow : `0 0 0 3px rgba(197, 255, 167, 0.1)`

### Titles & Headers

**Page Title :**
- Font size : `var(--text-3xl)` (32px)
- Font weight : `var(--font-bold)` (700)
- Color : `var(--text-primary)` (#fff)
- Letter spacing : `-0.02em`
- Line height : `1.3`

**Section Title :**
- Font size : `var(--text-lg)` (18px)
- Font weight : `var(--font-semibold)` (600)
- Color : `var(--text-primary)` (#fff)
- Letter spacing : `-0.01em`
- Line height : `var(--leading-normal)` (1.5)

**Card Title :**
- Font size : `var(--text-base)` (16px)
- Font weight : `var(--font-semibold)` (600)
- Color : `var(--text-primary)` (#fff)
- Letter spacing : `-0.01em`

**Transaction History Title :**
- Font size : `var(--text-xl)` (20px)
- Font weight : `var(--font-semibold)` (600)
- Color : `var(--text-primary)` (#fff)
- Letter spacing : `-0.02em`

### Values & Amounts

**Wallet Balance BTC :**
- Font size : `var(--text-4xl)` (40px)
- Font weight : `var(--font-bold)` (700)
- Color : `#C5FFA7`
- Letter spacing : `-0.02em`
- Line height : `var(--leading-tight)` (1.25)
- Text shadow : `0 0 20px rgba(197, 255, 167, 0.3)`

**Transaction Amount / Reward :**
- Font size : `var(--text-base)` (16px)
- Font weight : `var(--font-semibold)` (600)
- Color : `#C5FFA7`
- Font family : `var(--font-mono)`
- Text shadow : `0 0 10px rgba(197, 255, 167, 0.2)`

**Total Amount :**
- Font size : `var(--text-lg)` (18px)
- Font weight : `var(--font-semibold)` (600)
- Color : `#C5FFA7`
- Text shadow : `0 0 10px rgba(197, 255, 167, 0.2)`

### Labels & Subtitles

**KPI Label / Section Label :**
- Font size : `var(--text-xs)` (12px)
- Font weight : `var(--font-semibold)` (600)
- Color : `var(--text-secondary)` (rgba(255, 255, 255, 0.7))
- Text transform : `uppercase`
- Letter spacing : `0.5px` / `1px`

**Page Subtitle :**
- Font size : `var(--text-base)` (16px)
- Color : `var(--text-secondary)` (rgba(255, 255, 255, 0.7))

---

## ⚡ TRANSITIONS & ANIMATIONS

### Durées

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--duration-fast` | `150ms` | Hovers rapides |
| `--duration-normal` | `250ms` | Transitions standards |
| `--duration-slow` | `350ms` | Animations lentes |

### Easings

| Variable | Valeur |
|----------|--------|
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### Transitions Standards

**Cards :**
```css
transition: all var(--duration-normal) var(--ease-in-out);
```

**Buttons :**
```css
transition: all var(--duration-normal) var(--ease-in-out);
```

**Table Rows :**
```css
transition: all var(--duration-fast) var(--ease-in-out);
```

**See More Button :**
```css
transition: all 0.15s ease;
```

---

## 📐 LAYOUT & STRUCTURE

### Container Padding

| Usage | Valeur |
|-------|--------|
| Dashboard view padding top | `10px` |
| Dashboard content gap | `var(--space-8)` (32px) |
| Section margin bottom | `var(--space-6)` (24px) |

### Grid Layouts

**Wallet Charts Container :**
- Display : `flex`
- Gap : `var(--space-6)` (24px)
- Width : `100%`

**Two Column Grid (Charts) :**
- Display : `grid`
- Grid template columns : `repeat(2, 1fr)`
- Gap : `24px`

### Table Layout

**Table Unified Grid :**
- Table layout : `fixed`
- Width : `100%`

**Column Widths :**
- Date : `20%`
- Account/BTC Transaction : `25%`
- Total Reward/Wallet Address : `35%`
- Hashrate/Trx ID : `20%`

---

## 🎨 COULEURS SPÉCIFIQUES DASHBOARD

### Dashboard Green (#C5FFA7)

Cette couleur est **différente** de `--primary-green` (#8afd81) et est utilisée spécifiquement pour :
- Wallet balance BTC
- Transaction amounts
- Transaction rewards
- Total amounts
- Accents et highlights

**Utilisation :**
- Texte : `color: #C5FFA7;`
- Backgrounds : `rgba(197, 255, 167, 0.1)` à `rgba(197, 255, 167, 0.3)`
- Borders : `rgba(197, 255, 167, 0.2)` à `rgba(197, 255, 167, 0.3)`
- Shadows : `rgba(197, 255, 167, 0.2)` à `rgba(197, 255, 167, 0.4)`

---

## ✅ RÈGLES CRITIQUES

1. **Texte sur fond vert = TOUJOURS noir** (#000000)
2. **Cards = toujours backdrop-filter blur(20px) saturate(180%)**
3. **Table headers = gradient #454646 → #3a3a3a**
4. **Hover cards = translateY(-4px) + border vert**
5. **Table row hover = gradient horizontal + border gauche vert**
6. **Dashboard Green (#C5FFA7) ≠ Primary Green (#8afd81)**

---

## 📝 NOTES IMPORTANTES

- Tous les styles sont basés sur la Home Page (Dashboard)
- Les variables CSS doivent être utilisées quand disponibles
- Les valeurs hardcodées sont documentées ci-dessus
- Les responsive breakpoints sont : 1024px et 768px
- Les transitions sont toujours fluides (ease-in-out)

---

**FIN DU STYLE GUIDE**



