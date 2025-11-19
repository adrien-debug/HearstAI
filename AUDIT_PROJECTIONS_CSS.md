# 🔍 AUDIT COMPLET - projections.css

**Date :** 18 Novembre 2025  
**Fichier :** `frontend/css/projections.css`  
**Lignes totales :** 1222

---

## 📊 STRUCTURE EXACTE DU FICHIER

### 1. EN-TÊTE & VARIABLES (Lignes 1-13)
```css
1-2:   Commentaires d'en-tête
3:     Ligne vide
4:     Commentaire "Variables HEARST pour projections"
5-13:  :root { variables CSS }
```

**Variables définies :**
- `--hearst-primary: #8afd81`
- `--hearst-primary-dark: #6fdc66`
- `--hearst-primary-light: #a5ff9c`
- `--hearst-mint-500: #7bed9f`
- `--hearst-dark-900: #0A0A0A`
- `--hearst-dark-800: #141414`
- `--hearst-dark-700: #1A1A1A`

**⚠️ PROBLÈME :** Ces variables sont redondantes avec `design-tokens.css`. Devrait utiliser les tokens du design system.

---

### 2. SECTION PREMIUM (Lignes 15-18)
```css
15:    Commentaire "Section Premium"
16-18: .section-premium { margin-bottom: 24px; }
```

**⚠️ PROBLÈME :** Utilise `24px` au lieu de `var(--spacing-6)` (24px).

---

### 3. ACCORDION SYSTEM (Lignes 20-112)
```css
20-34:   .accordion-section (base + hover)
36-53:   .accordion-header (base + hover + active)
55-63:   .accordion-title
65-75:   .accordion-icon (base + collapsed state)
77-91:   .accordion-content (base + collapsed state)
93-104:  .accordion-badge
106-112: .accordion-subtitle
```

**⚠️ PROBLÈMES :**
- Ligne 24 : `var(--radius-xl)` - OK
- Ligne 25 : Couleur hardcodée `rgba(26, 26, 26, 0.95)` au lieu de token
- Ligne 28 : `0.3s ease` au lieu de `var(--transition-normal)`
- Ligne 40 : `20px 28px` au lieu de tokens spacing
- Ligne 56 : `16px` au lieu de `var(--typography-body-size)`
- Ligne 69 : `0.4s cubic-bezier(...)` au lieu de `var(--transition-slow)`
- Ligne 70 : `#8afd81` hardcodé au lieu de `var(--color-primary-light-green)`

---

### 4. MARKET METRICS CARDS (Lignes 114-201)
```css
115-120: .metrics-grid
122-142: .metric-card (base + hover + variants)
152-167: .metric-icon-wrapper (base + variants)
169-177: .metric-label
179-186: .metric-value (base + variants)
195-201: .metric-description
```

**⚠️ PROBLÈMES :**
- Ligne 118 : `12px` au lieu de `var(--spacing-4)`
- Ligne 119 : `40px` au lieu de `var(--spacing-8)`
- Ligne 123 : `#1A1A1A` hardcodé au lieu de `var(--color-black-300)`
- Ligne 124 : `rgba(138, 253, 129, 0.08)` au lieu de token
- Ligne 126 : `24px` au lieu de `var(--spacing-6)`
- Ligne 148 : `#8afd81` hardcodé (x4 occurrences)
- Ligne 180 : `24px` au lieu de token typography

---

### 5. NEWS ITEMS (Lignes 203-217)
```css
204-211: .news-item (base)
213-217: .news-item:hover
```

**⚠️ PROBLÈMES :**
- Ligne 205 : `var(--bg-secondary)` - Variable non définie dans ce fichier
- Ligne 206 : `var(--border-color)` - Variable non définie
- Ligne 214 : `#8afd81` hardcodé

**🔴 ERREUR CRITIQUE :** Variables `--bg-secondary` et `--border-color` non définies dans `:root` de ce fichier. Dépend de `main.css`.

---

### 6. TABLES PREMIUM (Lignes 219-257)
```css
220-227: .table-container
229-232: .table-premium
234-246: .table-premium thead + th
248-253: .table-premium td
255-257: .table-premium tbody tr:hover
```

**⚠️ PROBLÈMES :**
- Ligne 221 : `#1A1A1A` hardcodé
- Ligne 222 : `rgba(138, 253, 129, 0.08)` au lieu de token
- Ligne 235 : `#141414` hardcodé au lieu de `var(--color-black-800)`
- Ligne 239 : `18px 24px` au lieu de tokens spacing
- Ligne 243 : `#8afd81` hardcodé
- Ligne 250 : `var(--border-color)` - Variable non définie

---

### 7. PROJECTION TAB CONTENT (Lignes 259-267)
```css
260-262: .projection-tab-content (base)
264-267: .projection-tab-content.active
```

**✅ OK** - Pas de problèmes majeurs.

---

### 8. CONTAINER & OVERVIEW SECTION (Lignes 269-321)
```css
270-276: #projections-sections-container
278-321: #overview-section (avec styles très spécifiques)
```

**⚠️ PROBLÈMES :**
- Ligne 280 : `20px` au lieu de `var(--spacing-5)`
- Ligne 293 : `24px` au lieu de token typography
- Ligne 302 : `20px` au lieu de `var(--spacing-5)`
- Ligne 304 : `48px` au lieu de `var(--spacing-8)`
- Ligne 312 : `12px 16px` au lieu de tokens spacing
- Ligne 313 : `rgba(26, 26, 26, 0.9)` hardcodé

**🔴 ERREUR CRITIQUE :** Utilisation excessive de `!important` (lignes 271-321). Indique des conflits de styles.

---

### 9. ANIMATIONS (Lignes 324-333)
```css
324-327: @keyframes fadeIn
330-333: @keyframes pulse
```

**⚠️ PROBLÈME :** Animation `pulse` définie 2 fois (lignes 330-333 et 1062-1065).

---

### 10. PROJECTION SECTION PLACEHOLDER (Lignes 335-340)
```css
336-340: .projection-section-placeholder
```

**✅ OK**

---

### 11. STEPPER NAVIGATION (Lignes 342-471)
```css
343-350: .stepper-container
352-358: .stepper
360-384: .progress-line-container + .progress-line-bg + .stepper-progress
386-471: .step (base + completed + active + hover)
```

**⚠️ PROBLÈMES :**
- Ligne 344 : `#1A1A1A` hardcodé
- Ligne 347 : `48px 60px` au lieu de tokens spacing
- Ligne 381 : `#8afd81` hardcodé
- Ligne 402 : `#1A1A1A` hardcodé
- Ligne 403 : `var(--border-color)` - Variable non définie
- Ligne 416 : `#8afd81` hardcodé (x3 occurrences)
- Ligne 421 : `#8afd81` hardcodé (x2 occurrences)

---

### 12. STEP CONTENT (Lignes 473-481)
```css
474-477: .step-content (base)
479-481: .step-content.active
```

**✅ OK**

---

### 13. PARAM CARD (Lignes 483-509)
```css
484-491: .param-card
493-503: .param-card-title
505-509: .param-card-subtitle
```

**⚠️ PROBLÈMES :**
- Ligne 485 : `#1A1A1A` hardcodé
- Ligne 486 : `rgba(138, 253, 129, 0.08)` au lieu de token
- Ligne 488 : `24px` au lieu de `var(--spacing-6)`
- Ligne 494 : `16px` au lieu de token typography

---

### 14. GRID LAYOUTS (Lignes 511-528)
```css
512-516: .grid-2
518-522: .grid-3
524-528: .grid-4
```

**⚠️ PROBLÈME :** Ligne 515, 521, 527 : `16px` au lieu de `var(--spacing-5)`

---

### 15. RADIO CARDS (Lignes 530-583)
```css
531-536: .radio-cards
538-551: .radio-card (base + hover)
553-569: .radio-card input + checked states
571-577: .radio-card-label
579-583: .radio-card-desc
```

**⚠️ PROBLÈMES :**
- Ligne 534 : `12px` au lieu de `var(--spacing-4)`
- Ligne 541 : `#1A1A1A` hardcodé
- Ligne 542 : `var(--border-color)` - Variable non définie
- Ligne 549 : `#8afd81` hardcodé (x2 occurrences)
- Ligne 559 : `#8afd81` hardcodé
- Ligne 566 : `:has()` - Support navigateur limité

**🔴 ERREUR CRITIQUE :** Ligne 566 utilise `:has()` qui n'est pas supporté par tous les navigateurs.

---

### 16. MACHINE CARDS (Lignes 585-670)
```css
586-591: .machine-grid
593-612: .machine-card (base + hover + selected)
614-619: .machine-card-header
621-625: .machine-name
627-636: .machine-badge
638-642: .machine-specs
644-657: .machine-spec + variants
659-670: .machine-price + value
```

**⚠️ PROBLÈMES :**
- Ligne 589 : `16px` au lieu de `var(--spacing-5)`
- Ligne 594 : `#1A1A1A` hardcodé
- Ligne 595 : `var(--border-color)` - Variable non définie
- Ligne 604 : `#8afd81` hardcodé (x3 occurrences)
- Ligne 610 : `#8afd81` hardcodé
- Ligne 651 : `#8afd81` hardcodé
- Ligne 669 : `#8afd81` hardcodé

---

### 17. FORM INPUTS (Lignes 672-707)
```css
673-680: .form-label
682-694: .form-input + .form-select (base)
696-702: .form-input:focus + .form-select:focus
704-707: .form-input:hover + .form-select:hover
```

**⚠️ PROBLÈMES :**
- Ligne 677 : `#8afd81` hardcodé
- Ligne 686 : `#1A1A1A` hardcodé
- Ligne 687 : `var(--border-color)` - Variable non définie
- Ligne 691 : `'Inter', sans-serif` - Police hardcodée au lieu de `var(--font-family-primary)`
- Ligne 699 : `#8afd81` hardcodé
- Ligne 700 : `#141414` hardcodé

---

### 18. SUMMARY PANEL (Lignes 709-757)
```css
710-718: .summary-panel (première définition)
720-730: .summary-title (première définition)
732-751: .summary-item + variants
```

**⚠️ PROBLÈMES :**
- Ligne 713 : `rgba(26, 26, 26, 0.95)` hardcodé
- Ligne 714 : `#8afd81` hardcodé
- Ligne 723 : `#8afd81` hardcodé
- Ligne 754 : `#8afd81` hardcodé

**🔴 ERREUR CRITIQUE :** `.summary-panel` et `.summary-title` sont définis 2 fois (lignes 710-757 et 919-962).

---

### 19. BADGE (Lignes 759-777)
```css
760-770: .badge (base)
772-777: .badge.badge-green
```

**⚠️ PROBLÈMES :**
- Ligne 763 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 764 : `#8afd81` hardcodé (x2 occurrences)
- Ligne 773 : `#8afd81` hardcodé (x2 occurrences)

---

### 20. BUTTON GROUP (Lignes 779-785)
```css
780-785: .btn-group
```

**⚠️ PROBLÈME :** Ligne 782 : `12px` au lieu de `var(--spacing-4)`

---

### 21. RESPONSIVE (Lignes 787-917)
```css
790-812: .section-header-premium + variants
821-843: .chart-container + variants
845-856: .calculator-content + variants
859-869: @media (max-width: 1024px)
872-917: @media (max-width: 768px)
```

**⚠️ PROBLÈMES :**
- Ligne 795 : `24px` au lieu de `var(--spacing-6)`
- Ligne 801 : `16px` au lieu de token typography
- Ligne 823 : `#1A1A1A` hardcodé
- Ligne 824 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 826 : `24px` au lieu de `var(--spacing-6)`
- Ligne 849 : `24px` au lieu de `var(--spacing-6)`

---

### 22. SUMMARY PANEL (REDÉFINITION) (Lignes 919-962)
```css
919-928: .summary-panel (deuxième définition)
930-937: .summary-title (deuxième définition)
939-962: .summary-item + variants (redéfinition)
```

**🔴 ERREUR CRITIQUE :** Doublon complet des styles `.summary-panel`, `.summary-title`, `.summary-item` déjà définis lignes 710-757.

**⚠️ PROBLÈMES :**
- Ligne 920 : `#1A1A1A` hardcodé
- Ligne 921 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 923 : `24px` au lieu de `var(--spacing-6)`
- Ligne 959 : `#8afd81` hardcodé

---

### 23. PROJECTS TOOLBAR (Lignes 964-981)
```css
965-971: .projects-toolbar
973-981: .projects-toolbar .form-input + select
```

**⚠️ PROBLÈMES :**
- Ligne 967 : `12px` au lieu de `var(--spacing-4)`
- Ligne 968 : `20px` au lieu de `var(--spacing-5)`

---

### 24. NEWS FEED CONTAINER (Lignes 983-1041)
```css
984-990: .news-feed-container
992-1004: .news-item (redéfinition)
1006-1041: .news-item-content + variants
```

**🔴 ERREUR CRITIQUE :** `.news-item` est défini 2 fois (lignes 204-217 et 992-1004).

**⚠️ PROBLÈMES :**
- Ligne 987 : `12px` au lieu de `var(--spacing-4)`
- Ligne 994 : `#1A1A1A` hardcodé
- Ligne 995 : `rgba(138, 253, 129, 0.15)` au lieu de token

---

### 25. UPDATE BADGE (Lignes 1043-1065)
```css
1044-1052: .update-badge
1054-1060: .update-dot
1062-1065: @keyframes pulse (redéfinition)
```

**🔴 ERREUR CRITIQUE :** `@keyframes pulse` est défini 2 fois (lignes 330-333 et 1062-1065).

**⚠️ PROBLÈMES :**
- Ligne 1049 : `var(--bg-secondary)` - Variable non définie
- Ligne 1050 : `var(--border-color)` - Variable non définie
- Ligne 1057 : `#8afd81` hardcodé

---

### 26. SECTION ICON (Lignes 1067-1077)
```css
1068-1077: .section-icon
```

**⚠️ PROBLÈMES :**
- Ligne 1071 : `rgba(138, 253, 129, ...)` au lieu de token
- Ligne 1076 : `rgba(138, 253, 129, 0.3)` au lieu de token

---

### 27. ALERT INFO (Lignes 1079-1094)
```css
1080-1086: .alert-info
1088-1094: .alert-info strong + span
```

**⚠️ PROBLÈMES :**
- Ligne 1081 : `rgba(138, 253, 129, 0.1)` au lieu de token
- Ligne 1082 : `#8afd81` hardcodé
- Ligne 1089 : `#8afd81` hardcodé

---

### 28. PERCENTILE GRID (Lignes 1096-1132)
```css
1097-1102: .percentile-grid
1104-1116: .percentile-item (base + hover)
1118-1125: .percentile-label
1127-1132: .percentile-value
```

**⚠️ PROBLÈMES :**
- Ligne 1100 : `16px` au lieu de `var(--spacing-5)`
- Ligne 1106 : `rgba(26, 26, 26, 0.9)` hardcodé
- Ligne 1109 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 1114 : `#8afd81` hardcodé

---

### 29. PROJECT CARD (Lignes 1134-1220)
```css
1135-1149: .project-card (base + hover)
1151-1156: .project-header
1158-1163: .project-name
1165-1168: .project-date
1170-1173: .project-actions
1175-1193: .btn-icon (base + hover)
1195-1200: .project-stats
1202-1220: .project-stat + variants
```

**⚠️ PROBLÈMES :**
- Ligne 1136 : `#1A1A1A` hardcodé
- Ligne 1137 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 1146 : `#8afd81` hardcodé
- Ligne 1159 : `16px` au lieu de token typography
- Ligne 1181 : `rgba(26, 26, 26, 0.9)` hardcodé
- Ligne 1182 : `rgba(138, 253, 129, 0.15)` au lieu de token
- Ligne 1191 : `#8afd81` hardcodé (x2 occurrences)
- Ligne 1218 : `#8afd81` hardcodé

---

## 🔴 ERREURS CRITIQUES

### 1. DOUBLONS DE CLASSES
- **`.summary-panel`** : Lignes 710-718 et 919-928
- **`.summary-title`** : Lignes 720-730 et 930-937
- **`.summary-item`** : Lignes 732-751 et 939-962
- **`.news-item`** : Lignes 204-217 et 992-1004
- **`@keyframes pulse`** : Lignes 330-333 et 1062-1065

### 2. VARIABLES NON DÉFINIES
- `var(--bg-secondary)` : Utilisée lignes 205, 1049
- `var(--border-color)` : Utilisée lignes 206, 250, 403, 542, 595, 687

### 3. SUPPORT NAVIGATEUR
- Ligne 566 : `:has()` - Support limité (pas IE, Safari < 15.4)

### 4. UTILISATION EXCESSIVE DE `!important`
- Lignes 271-321 : 15+ occurrences de `!important` dans `#overview-section`

---

## ⚠️ PROBLÈMES MAJEURS

### 1. COULEURS HARDCODÉES
**Occurrences de `#8afd81` :** 42+ occurrences au lieu d'utiliser `var(--color-primary-light-green)`

**Occurrences de `#1A1A1A` :** 15+ occurrences au lieu de `var(--color-black-300)`

**Occurrences de `#141414` :** 2 occurrences au lieu de `var(--color-black-800)`

### 2. SPACING HARDCODÉ
**Valeurs hardcodées au lieu de tokens :**
- `24px` : 10+ occurrences → devrait être `var(--spacing-6)`
- `20px` : 8+ occurrences → devrait être `var(--spacing-5)`
- `16px` : 12+ occurrences → devrait être `var(--spacing-5)`
- `12px` : 6+ occurrences → devrait être `var(--spacing-4)`

### 3. TYPOGRAPHY HARDCODÉE
**Tailles hardcodées au lieu de tokens :**
- `16px` : 8+ occurrences → devrait être `var(--typography-body-size)`
- `24px` : 4+ occurrences → devrait être `var(--typography-section-title-size)`
- `12px` : 6+ occurrences → devrait être `var(--typography-caption-size)`

### 4. TRANSITIONS HARDCODÉES
**Valeurs hardcodées au lieu de tokens :**
- `0.3s ease` : 5+ occurrences → devrait être `var(--transition-normal)`
- `0.2s ease` : 8+ occurrences → devrait être `var(--transition-fast)`

### 5. POLICE HARDCODÉE
- Ligne 691 : `'Inter', sans-serif` → devrait être `var(--font-family-primary)`

---

## 📋 RECOMMANDATIONS

### 1. SUPPRIMER LES DOUBLONS
- Fusionner les définitions de `.summary-panel`, `.summary-title`, `.summary-item`
- Fusionner les définitions de `.news-item`
- Supprimer la redéfinition de `@keyframes pulse`

### 2. UTILISER LES TOKENS DU DESIGN SYSTEM
- Remplacer toutes les couleurs hardcodées par les variables de `design-tokens.css`
- Remplacer tous les spacing hardcodés par les variables `--spacing-*`
- Remplacer toutes les tailles de police par les variables `--typography-*`
- Remplacer toutes les transitions par les variables `--transition-*`

### 3. CORRIGER LES VARIABLES MANQUANTES
- Ajouter les variables manquantes dans `:root` ou utiliser celles de `main.css`
- Vérifier la dépendance avec `main.css` et `design-tokens.css`

### 4. RÉDUIRE L'UTILISATION DE `!important`
- Réorganiser la spécificité CSS
- Utiliser des sélecteurs plus spécifiques au lieu de `!important`

### 5. CORRIGER LE SUPPORT NAVIGATEUR
- Remplacer `:has()` par une solution compatible ou ajouter un fallback

---

## 📊 STATISTIQUES

- **Lignes totales :** 1222
- **Classes CSS :** ~80
- **Variables définies :** 7 (redondantes)
- **Couleurs hardcodées :** 60+
- **Spacing hardcodé :** 40+
- **Doublons :** 5 classes/animations
- **Variables non définies :** 2
- **`!important` :** 15+ occurrences
- **Support navigateur :** 1 problème (`:has()`)

---

## ✅ ACTIONS PRIORITAIRES

1. **URGENT :** Supprimer les doublons (`.summary-panel`, `.news-item`, `@keyframes pulse`)
2. **URGENT :** Corriger les variables non définies (`--bg-secondary`, `--border-color`)
3. **IMPORTANT :** Remplacer toutes les couleurs hardcodées par les tokens
4. **IMPORTANT :** Remplacer tous les spacing hardcodés par les tokens
5. **IMPORTANT :** Réduire l'utilisation de `!important`
6. **MOYEN :** Corriger le support navigateur (`:has()`)
7. **MOYEN :** Remplacer la police hardcodée par le token

---

**Dernière mise à jour :** 18 Novembre 2025

