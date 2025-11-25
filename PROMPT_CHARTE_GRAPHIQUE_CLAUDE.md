# 🎨 PROMPT CHARTE GRAPHIQUE HEARSTAI - GUIDE COMPLET POUR CLAUDE

**Date :** 24 Janvier 2025  
**Version :** 3.0  
**Projet :** HearstAI  
**Objectif :** Définir exactement la charte graphique appliquée et ce qui est INTERDIT

---

## 🚨 RÈGLE PRINCIPALE - INTERDICTIONS ABSOLUES

### ❌ CE QUE TU NE PEUX PAS FAIRE :

1. **NE JAMAIS modifier le layout/structure HTML existante** sans autorisation explicite
2. **NE JAMAIS changer la disposition des éléments** (grid, flex, position)
3. **NE JAMAIS ajouter ou supprimer des sections** sans demande explicite
4. **NE JAMAIS modifier les classes HTML** principales (kpi-card, premium-stat-box, etc.)
5. **NE JAMAIS utiliser d'autres couleurs** que celles définies dans cette charte
6. **NE JAMAIS utiliser d'autres tailles** de police que celles définies
7. **NE JAMAIS modifier les espacements** sans justification

### ✅ CE QUE TU PEUX FAIRE :

1. **APPLIQUER les styles CSS** selon cette charte
2. **Ajuster les couleurs** pour correspondre exactement à la charte
3. **Modifier les tailles** pour correspondre exactement à la charte
4. **Ajouter des effets visuels** (lignes, gradients) conformes à la charte
5. **Corriger les styles** pour qu'ils correspondent à la page de référence (Overview)

---

## 🎨 CHARTE GRAPHIQUE COMPLÈTE - TOUS LES ÉLÉMENTS

### 🔴 COULEUR PRINCIPALE - HEARST GREEN

**Couleur signature HEARST :**
```css
#C5FFA7  /* Dashboard Green - Utilisé dans Overview et MyEarthAI */
```

**Variations autorisées :**
```css
rgba(197, 255, 167, 0.1)   /* Backgrounds transparents */
rgba(197, 255, 167, 0.15)  /* Badges, highlights */
rgba(197, 255, 167, 0.2)   /* Bordures, hover */
rgba(197, 255, 167, 0.3)   /* Bordures actives */
rgba(197, 255, 167, 0.05)  /* Gradients subtils */
```

**❌ INTERDIT :**
- `#8afd81` (cette couleur est pour d'autres parties du projet)
- `#7bed9f` (couleur NEARST - interdite)
- Toute autre nuance de vert

---

### 🖤 BACKGROUNDS

**Fonds principaux :**
```css
rgba(26, 26, 26, 0.7)        /* Cards, boxes principales */
backdrop-filter: blur(20px) saturate(180%)  /* TOUJOURS avec les cards */
-webkit-backdrop-filter: blur(20px) saturate(180%)  /* Préfixe requis */

#0a0a0a                      /* Header, fonds très sombres */
#1a1a1a                      /* Sidebar, fonds secondaires */
```

**❌ INTERDIT :**
- Fonds blancs ou clairs
- Opacités différentes de 0.7 pour les cards premium
- Backdrop-filter différent de `blur(20px) saturate(180%)`

---

### 📐 TYPOGRAPHIE - TAILLES EXACTES

#### Labels (KPI Cards, Stat Boxes)
```css
font-size: var(--text-xs);              /* 12px */
color: var(--text-secondary);           /* #cccccc */
text-transform: uppercase;
letter-spacing: 0.5px;
font-weight: var(--font-normal);        /* 400 */
margin-bottom: var(--space-3);          /* Pour premium-stat-label */
margin-bottom: var(--space-2);          /* Pour kpi-label */
```

#### Valeurs (KPI Cards, Stat Boxes)
```css
font-size: var(--text-3xl);             /* 32px exactement */
font-weight: var(--font-bold);          /* 700 */
color: var(--text-primary);             /* #ffffff par défaut */
color: #C5FFA7;                         /* Pour valeurs vertes */
line-height: var(--leading-tight);
margin-bottom: var(--space-2);
font-variant-numeric: tabular-nums;     /* REQUIS pour les nombres */
font-family: var(--font-mono);          /* OPTIONNEL, pour certaines valeurs */
```

#### Descriptions
```css
font-size: var(--text-sm);              /* 14px */
color: var(--text-secondary);           /* #cccccc */
```

**❌ INTERDIT :**
- `var(--text-2xl)` pour les valeurs (doit être `text-3xl`)
- Couleurs différentes des valeurs définies
- Tailles de police différentes

---

### 🎯 BORDURES

**Bordures standards :**
```css
border: 1px solid rgba(255, 255, 255, 0.05);  /* Par défaut */
border-radius: var(--radius-xl);              /* 16px */
```

**Bordures hover :**
```css
border-color: rgba(197, 255, 167, 0.2);       /* Vert HEARST au hover */
```

**❌ INTERDIT :**
- Bordures épaisses (> 1px) sauf cas spéciaux
- Border-radius différents de `var(--radius-xl)`
- Couleurs de bordures non définies

---

### ✨ OMBRES (BOX SHADOWS)

**Ombres standard (cards, boxes) :**
```css
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

**Ombres hover :**
```css
box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(197, 255, 167, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

**❌ INTERDIT :**
- Ombres différentes de celles définies
- Ombres colorées (sauf la bordure verte au hover)

---

### 🌈 EFFETS VISUELS OBLIGATOIRES

#### 1. Ligne verte en haut des boxes (::before)
**Obligatoire sur toutes les cards/boxes :**
```css
.card::before,
.kpi-card::before,
.premium-stat-box::before,
.suggestion-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(197, 255, 167, 0.8) 0%, rgba(197, 255, 167, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.card:hover::before,
.kpi-card:hover::before,
.premium-stat-box:hover::before,
.suggestion-card:hover::before {
    opacity: 1;
}
```

#### 2. Gradient radial en arrière-plan (::after)
**Obligatoire sur toutes les cards/boxes :**
```css
.card::after,
.kpi-card::after,
.premium-stat-box::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at top right,
        rgba(197, 255, 167, 0.05) 0%,
        transparent 50%
    );
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
}

.card > *,
.kpi-card > *,
.premium-stat-box > * {
    position: relative;
    z-index: 1;
}
```

**❌ INTERDIT :**
- Oublier les pseudo-éléments ::before et ::after
- Positions z-index incorrectes
- Gradients différents

---

### 📊 TABLEAUX - HEADER GRIS

**Header de tableau OBLIGATOIRE :**
```css
.table thead tr,
.premium-transaction-table thead,
.transaction-history-table thead tr {
    background: linear-gradient(180deg, #454646 0%, #3a3a3a 100%);
    border-bottom: 2px solid rgba(197, 255, 167, 0.3);
}
```

**Cellules header :**
```css
.table thead th,
.premium-transaction-table th,
.transaction-history-table thead th {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    font-size: var(--text-xs);
    font-weight: var(--font-normal);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-primary);
}
```

**❌ INTERDIT :**
- Headers sans fond gris gradient
- Headers avec autres couleurs
- Headers sans bordure verte en bas

---

### 🎴 CARDS HEADER (Popular Searches, Recent Activity, etc.)

**Header des cards OBLIGATOIRE :**
```css
.card-header-dashboard,
.home-card-header {
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: linear-gradient(180deg, #454646 0%, #3a3a3a 100%);
}
```

**Titre dans header :**
```css
.card-title-dashboard,
.home-card-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
}
```

**❌ INTERDIT :**
- Headers sans fond gris gradient
- Padding différent

---

### 🎨 STRUCTURE DES CARDS/BOXES

#### KPI Cards (Structure HTML)
```html
<div className="kpi-card">
    <div className="kpi-label">Label</div>
    <div className="kpi-value">Valeur</div>
    <div className="kpi-description">Description</div>
</div>
```

#### Premium Stat Boxes (Structure HTML)
```html
<div className="premium-stat-box">
    <div className="premium-stat-box-header">
        <div className="premium-stat-icon">Icon</div>
        <div className="premium-stat-label">Label</div>
    </div>
    <div className="premium-stat-value">Valeur</div>
    <div className="premium-stat-footer">
        <span className="premium-stat-description">Description</span>
    </div>
</div>
```

**❌ INTERDIT :**
- Modifier cette structure HTML
- Ajouter des éléments supplémentaires
- Changer l'ordre des éléments

---

### 📏 ESPACEMENTS (Spacing)

**Gap entre cards :**
```css
gap: var(--space-4);  /* 16px entre les cards */
```

**Margin bottom sections :**
```css
margin-bottom: var(--space-6);  /* 24px entre les sections */
```

**Padding inside cards :**
```css
padding: var(--space-4);  /* 16px padding interne */
```

**❌ INTERDIT :**
- Espacements différents de ceux définis
- Utiliser des valeurs fixes (px) au lieu de variables CSS

---

### 🎭 TRANSITIONS & ANIMATIONS

**Transitions standards :**
```css
transition: all var(--duration-normal) var(--ease-in-out);
```

**Hover transform :**
```css
transform: translateY(-4px);  /* Pour les cards */
transform: translateY(-2px);  /* Pour les suggestion-cards */
```

**❌ INTERDIT :**
- Animations différentes
- Durées différentes
- Transforms différents

---

### 🎯 COULEURS SPÉCIFIQUES PAR ÉLÉMENT

#### Montants/Valeurs monétaires
```css
color: #C5FFA7 !important;
font-weight: var(--font-semibold);
font-family: var(--font-mono);
```

#### Boutons Primary
```css
background: #C5FFA7;
color: #000000;  /* TOUJOURS noir sur vert */
font-weight: var(--font-semibold);
border-radius: var(--radius-full);
box-shadow: 
    0 4px 16px rgba(197, 255, 167, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
```

#### Boutons Hover
```css
background: #B0FF8F;
box-shadow: 
    0 6px 24px rgba(197, 255, 167, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
transform: translateY(-1px) scale(1.02);
```

**❌ INTERDIT :**
- Texte blanc sur fond vert (#C5FFA7)
- Autres couleurs de boutons
- Ombres différentes

---

### 📐 GRID LAYOUTS

#### KPI Grid / Premium Stats Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: var(--space-4);
```

#### Wallet Charts Container
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
gap: var(--space-4);
```

**❌ INTERDIT :**
- Changer les grid-template-columns
- Utiliser flexbox au lieu de grid pour ces sections
- Modifier les minmax values

---

### 🎨 RÉSUMÉ DES COULEURS AUTORISÉES

**Couleurs principales :**
- `#C5FFA7` - Vert HEARST principal
- `#ffffff` - Texte primary
- `#cccccc` - Texte secondary
- `rgba(26, 26, 26, 0.7)` - Background cards
- `#454646` / `#3a3a3a` - Gradient header tableau
- `rgba(255, 255, 255, 0.05)` - Bordures
- `rgba(255, 255, 255, 0.1)` - Bordures hover

**Couleurs interdites :**
- `#8afd81` - Autre vert du projet
- `#7bed9f` - Vert NEARST
- Toute autre couleur non listée

---

### 📝 CHECKLIST DE VALIDATION

Avant de finaliser, vérifier :

- [ ] Toutes les cards ont ::before avec ligne verte
- [ ] Toutes les cards ont ::after avec gradient radial
- [ ] Tous les headers de tableaux ont fond gris gradient
- [ ] Tous les headers de cards ont fond gris gradient
- [ ] Toutes les valeurs utilisent `var(--text-3xl)`
- [ ] Toutes les valeurs numériques ont `font-variant-numeric: tabular-nums`
- [ ] Toutes les couleurs sont exactement celles définies
- [ ] Tous les espacements utilisent les variables CSS
- [ ] Tous les backdrop-filter sont `blur(20px) saturate(180%)`
- [ ] Toutes les ombres correspondent exactement
- [ ] Aucun layout/structure HTML modifié

---

## 🚫 INTERDICTIONS FINALES - LISTE COMPLÈTE

### ❌ INTERDICTIONS STRUCTURELLES

1. **NE JAMAIS modifier la structure HTML** des composants existants
   - Ne pas changer les `<div>`, `<section>`, ordre des éléments
   - Ne pas ajouter/supprimer de wrappers
   - Ne pas modifier les classes principales (kpi-card, premium-stat-box, etc.)

2. **NE JAMAIS modifier le layout/disposition**
   - Ne pas changer grid en flexbox (ou vice versa)
   - Ne pas modifier les colonnes du grid
   - Ne pas changer les positions (absolute, relative, etc.)

3. **NE JAMAIS ajouter ou supprimer de sections**
   - Ne pas créer de nouvelles sections sans demande
   - Ne pas supprimer de sections existantes
   - Ne pas modifier l'ordre des sections

### ❌ INTERDICTIONS COULEURS

4. **NE JAMAIS utiliser d'autres couleurs**
   - ❌ `#8afd81` - Interdit (autre vert du projet)
   - ❌ `#7bed9f` - Interdit (vert NEARST)
   - ❌ Toute autre nuance de vert
   - ❌ Couleurs non listées dans la charte
   - ✅ UNIQUEMENT `#C5FFA7` pour le vert principal

5. **NE JAMAIS utiliser de texte blanc sur fond vert**
   - Toujours `#000000` ou `#0a0a0a` sur `#C5FFA7`

### ❌ INTERDICTIONS STYLES

6. **NE JAMAIS modifier les tailles de police**
   - Labels : `var(--text-xs)` uniquement
   - Valeurs : `var(--text-3xl)` uniquement (PAS `text-2xl`)
   - Descriptions : `var(--text-sm)` uniquement

7. **NE JAMAIS oublier les effets visuels obligatoires**
   - ❌ Cards sans `::before` (ligne verte)
   - ❌ Cards sans `::after` (gradient radial)
   - ❌ Headers sans fond gris gradient
   - ❌ Tableaux sans header gris

8. **NE JAMAIS modifier les ombres**
   - Utiliser EXACTEMENT les box-shadow définies
   - Ne pas ajouter/supprimer d'ombres

9. **NE JAMAIS modifier les espacements**
   - Utiliser UNIQUEMENT les variables CSS (`var(--space-X)`)
   - Ne pas utiliser de valeurs fixes en px

10. **NE JAMAIS oublier les propriétés CSS obligatoires**
    - `font-variant-numeric: tabular-nums` sur les valeurs numériques
    - `backdrop-filter: blur(20px) saturate(180%)` sur toutes les cards
    - `position: relative` sur les cards
    - `overflow: hidden` sur les cards

### ❌ INTERDICTIONS TECHNIQUES

11. **NE JAMAIS créer de nouveaux composants** sans demande explicite
12. **NE JAMAIS utiliser de valeurs hardcodées** (px fixes) au lieu de variables CSS
13. **NE JAMAIS modifier les imports** ou dépendances
14. **NE JAMAIS ajouter de nouvelles dépendances** sans autorisation

---

## ✅ CHECKLIST FINALE - AVANT VALIDATION

Avant de finaliser TOUTE modification, vérifier :

### Structure
- [ ] Aucune structure HTML modifiée
- [ ] Aucune classe principale changée
- [ ] Aucune section ajoutée/supprimée

### Styles
- [ ] Toutes les cards ont `::before` avec ligne verte
- [ ] Toutes les cards ont `::after` avec gradient radial
- [ ] Tous les z-index sont corrects (0, 1, 2)
- [ ] Tous les headers de tableaux ont fond gris gradient `#454646 → #3a3a3a`
- [ ] Tous les headers de cards ont fond gris gradient
- [ ] Toutes les bordures utilisent `rgba(255, 255, 255, 0.05)`

### Typographie
- [ ] Toutes les valeurs utilisent `var(--text-3xl)` (PAS text-2xl)
- [ ] Tous les labels utilisent `var(--text-xs)`
- [ ] Tous les labels sont `text-transform: uppercase`
- [ ] Toutes les valeurs numériques ont `font-variant-numeric: tabular-nums`

### Couleurs
- [ ] Couleur principale : UNIQUEMENT `#C5FFA7`
- [ ] Backgrounds cards : `rgba(26, 26, 26, 0.7)`
- [ ] Texte primary : `#ffffff`
- [ ] Texte secondary : `#cccccc`
- [ ] Aucune autre couleur utilisée

### Effets
- [ ] Tous les backdrop-filter : `blur(20px) saturate(180%)`
- [ ] Toutes les ombres correspondent exactement
- [ ] Tous les hover ont `transform: translateY(-4px)`
- [ ] Toutes les transitions utilisent les variables CSS

### Référence
- [ ] Tous les styles correspondent EXACTEMENT à la page Overview
- [ ] Tous les styles correspondent EXACTEMENT à `components/home/Home.css`

---

**Dernière mise à jour :** 24 Janvier 2025  
**Version :** 3.0  
**Référence principale :** 
- Page Overview : `components/home/HomeOverview.tsx`
- Styles Overview : `components/home/Home.css`
- Styles MyEarthAI : `components/MyEarthAI.css` (doit correspondre à Home.css)

