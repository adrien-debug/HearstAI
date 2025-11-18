# 🎯 PROPOSITION - APPLICATION STYLE GUIDE SUR COCKPIT

**Page Test :** Cockpit (`frontend/js/views/cockpit.js` + `frontend/css/cockpit.css`)  
**Date :** 18 Novembre 2025  
**Status :** ⏳ EN ATTENTE DE VALIDATION

---

## 📋 RÉSUMÉ

Application du **STYLE GUIDE HOME PAGE** sur la page **Cockpit** comme test.

**⚠️ IMPORTANT :** Aucune modification de structure/layout. Uniquement les styles visuels.

---

## 🔍 ANALYSE AVANT/APRÈS

### ❌ AVANT (Cockpit actuel)

**Couleurs utilisées :**
- Vert : `#8afd81` (primary-green)
- Vert RGBA : `rgba(138, 253, 129, ...)`

**Styles Cards :**
- Background : `rgba(37, 37, 37, 0.6)`
- Border : `1px solid rgba(255, 255, 255, 0.08)`
- Border radius : `16px`
- Backdrop filter : `blur(20px)`

**Styles Buttons :**
- Action button : background transparent, border
- Time filter active : `background: #8afd81; color: #1a1a1a;`

**Styles Tables :**
- Header : pas de gradient
- Row hover : `background: rgba(138, 253, 167, 0.03)`

**Styles KPI Values :**
- Success : `color: #8afd81`
- Warning : `color: #FFA500`
- Danger : `color: #FF4D4D`

---

### ✅ APRÈS (Avec Style Guide Home Page)

**Couleurs à utiliser :**
- Vert Dashboard : `#C5FFA7` (pour valeurs, amounts, accents)
- Vert RGBA : `rgba(197, 255, 167, ...)`
- Primary Green : `#8afd81` (pour CTA, boutons principaux)

**Styles Cards :**
- Background : `rgba(26, 26, 26, 0.7)` ✅
- Border : `1px solid rgba(255, 255, 255, 0.05)` ✅
- Border radius : `var(--radius-xl)` (16px) ✅
- Backdrop filter : `blur(20px) saturate(180%)` ✅
- Box shadow : (ombres Home Page) ✅
- Gradient overlay ::after ✅

**Styles Buttons :**
- Action button : style Home Page (background, hover)
- Time filter active : `background: #C5FFA7; color: #000000;` ✅

**Styles Tables :**
- Header : `linear-gradient(180deg, #454646 0%, #3a3a3a 100%)` ✅
- Header border bottom : `2px solid rgba(197, 255, 167, 0.3)` ✅
- Row hover : gradient horizontal + border gauche vert ✅

**Styles KPI Values :**
- Success : `color: #C5FFA7` ✅
- Text shadow : `0 0 10px rgba(197, 255, 167, 0.2)` ✅
- Warning : `color: #FFA500` (inchangé)
- Danger : `color: #FF4D4D` (inchangé)

---

## 📝 LISTE DES CLASSES À MODIFIER

### Fichier : `frontend/css/cockpit.css`

#### 1. Couleurs Globales

**À modifier :**
- `.header-clock` : `color: var(--primary-green)` → `color: #C5FFA7`
- `.live-badge` : `background: rgba(138, 253, 129, 0.1)` → `rgba(197, 255, 167, 0.1)`
- `.live-badge` : `border: 1px solid rgba(138, 253, 129, 0.3)` → `rgba(197, 255, 167, 0.3)`
- `.live-badge` : `color: var(--primary-green)` → `color: #C5FFA7`
- `.live-dot` : `background: var(--primary-green)` → `background: #C5FFA7`
- `@keyframes pulse` : `box-shadow: 0 0 8px var(--primary-green)` → `0 0 8px #C5FFA7`

#### 2. Cards (KPI Cards)

**À modifier :**
- `.kpi-card` : `background: rgba(37, 37, 37, 0.6)` → `rgba(26, 26, 26, 0.7)`
- `.kpi-card` : `border: 1px solid rgba(255, 255, 255, 0.08)` → `1px solid rgba(255, 255, 255, 0.05)`
- `.kpi-card` : ajouter `backdrop-filter: blur(20px) saturate(180%)`
- `.kpi-card` : ajouter box-shadow Home Page
- `.kpi-card` : ajouter gradient overlay ::after
- `.kpi-card.neon-accent` : `border-top: 2px solid rgba(138, 253, 129, 0.4)` → `rgba(197, 255, 167, 0.4)`

#### 3. KPI Values

**À modifier :**
- `.kpi-value.text-success` : `color: var(--primary-green)` → `color: #C5FFA7`
- `.kpi-value.text-success` : ajouter `text-shadow: 0 0 10px rgba(197, 255, 167, 0.2)`
- `.kpi-subtext.positive` : `color: var(--primary-green)` → `color: #C5FFA7`
- `.kpi-main` : `background: rgba(138, 253, 129, 0.1)` → `rgba(197, 255, 167, 0.1)`
- `.kpi-main` : `border: 1px solid rgba(138, 253, 129, 0.3)` → `rgba(197, 255, 167, 0.3)`
- `.kpi-main` : `color: var(--primary-green)` → `color: #C5FFA7`

#### 4. Cards (General)

**À modifier :**
- `.cockpit-container .card` : `background: rgba(37, 37, 37, 0.6)` → `rgba(26, 26, 26, 0.7)`
- `.cockpit-container .card` : `border: 1px solid rgba(255, 255, 255, 0.08)` → `1px solid rgba(255, 255, 255, 0.05)`
- `.cockpit-container .card` : ajouter `backdrop-filter: blur(20px) saturate(180%)`
- `.cockpit-container .card` : ajouter box-shadow Home Page
- `.cockpit-container .card` : ajouter gradient overlay ::after

#### 5. Tables

**À modifier :**
- `.data-table thead th` : ajouter `background: linear-gradient(180deg, #454646 0%, #3a3a3a 100%)`
- `.data-table thead th` : ajouter `border-bottom: 2px solid rgba(197, 255, 167, 0.3)`
- `.data-table tbody tr:hover` : `background: rgba(138, 253, 167, 0.03)` → gradient horizontal Home Page
- `.data-table tbody tr:hover` : ajouter `box-shadow: inset 2px 0 0 #C5FFA7`
- `.data-table tbody tr:hover` : ajouter `transform: translateX(2px)`
- `.data-table tbody tr:nth-child(even)` : ajouter `background: rgba(255, 255, 255, 0.02)`

#### 6. Status Badges

**À modifier :**
- `.status-badge.green` : `background: rgba(138, 253, 129, 0.15)` → `rgba(197, 255, 167, 0.15)`
- `.status-badge.green` : `color: var(--primary-green)` → `color: #C5FFA7`

#### 7. Buttons

**À modifier :**
- `.action-btn:hover` : `background: rgba(138, 253, 129, 0.1)` → `rgba(197, 255, 167, 0.1)`
- `.action-btn:hover` : `border-color: rgba(138, 253, 129, 0.3)` → `rgba(197, 255, 167, 0.3)`
- `.time-filter-btn.active` : `background: var(--primary-green)` → `background: #C5FFA7`
- `.time-filter-btn.active` : `color: #1a1a1a` → `color: #000000` (noir)
- `.time-filter-btn:hover:not(.active)` : `background: rgba(138, 253, 129, 0.1)` → `rgba(197, 255, 167, 0.1)`

#### 8. Chart Values (dans le HTML inline)

**À modifier dans `cockpit.js` :**
- Tous les `var(--primary-green)` → `#C5FFA7` pour les valeurs/amounts
- Tous les `rgba(138, 253, 129, ...)` → `rgba(197, 255, 167, ...)`

---

## 🎯 MODIFICATIONS PRÉVUES

### Résumé des changements

| Élément | Avant | Après |
|---------|-------|-------|
| **Couleur principale** | `#8afd81` | `#C5FFA7` (Dashboard Green) |
| **Card background** | `rgba(37, 37, 37, 0.6)` | `rgba(26, 26, 26, 0.7)` |
| **Card border** | `rgba(255, 255, 255, 0.08)` | `rgba(255, 255, 255, 0.05)` |
| **Backdrop filter** | `blur(20px)` | `blur(20px) saturate(180%)` |
| **Table header** | Pas de gradient | Gradient `#454646 → #3a3a3a` |
| **Table row hover** | Background simple | Gradient horizontal + border gauche |
| **Button active** | `#8afd81` | `#C5FFA7` (texte noir) |
| **Text shadows** | Aucun | Ajout sur valeurs importantes |

### Nombre de modifications

- **Fichiers à modifier :** 2
  - `frontend/css/cockpit.css` : ~50 lignes modifiées
  - `frontend/js/views/cockpit.js` : ~10 lignes modifiées (couleurs inline)

- **Classes modifiées :** ~15 classes CSS
- **Aucune modification de structure/layout** ✅

---

## ✅ GARANTIES

1. ✅ **Aucune modification de structure HTML**
2. ✅ **Aucune modification de layout/position**
3. ✅ **Aucune modification de données**
4. ✅ **Uniquement styles visuels (couleurs, ombres, effets)**
5. ✅ **Toutes les classes existantes conservées**
6. ✅ **Responsive inchangé**

---

## 🚦 VALIDATION REQUISE

**Avant d'appliquer ces modifications, j'attends ta validation sur :**

1. ✅ Le choix de la page Cockpit comme test
2. ✅ Les modifications proposées
3. ✅ L'approche (uniquement styles, pas de structure)

**Une fois validé, je procède à l'application et je te montre le résultat.**

---

**STATUS : ⏳ EN ATTENTE DE VALIDATION**

