# 📐 STRUCTURE EXACTE - projections.css

**Fichier :** `frontend/css/projections.css`  
**Lignes totales :** 1222

---

## 📋 TABLE DES MATIÈRES

1. [En-tête & Variables](#1-en-tête--variables-lignes-1-13)
2. [Section Premium](#2-section-premium-lignes-15-18)
3. [Accordion System](#3-accordion-system-lignes-20-112)
4. [Market Metrics Cards](#4-market-metrics-cards-lignes-114-201)
5. [News Items](#5-news-items-lignes-203-217)
6. [Tables Premium](#6-tables-premium-lignes-219-257)
7. [Projection Tab Content](#7-projection-tab-content-lignes-259-267)
8. [Container & Overview Section](#8-container--overview-section-lignes-269-321)
9. [Animations](#9-animations-lignes-324-333)
10. [Projection Section Placeholder](#10-projection-section-placeholder-lignes-335-340)
11. [Stepper Navigation](#11-stepper-navigation-lignes-342-471)
12. [Step Content](#12-step-content-lignes-473-481)
13. [Param Card](#13-param-card-lignes-483-509)
14. [Grid Layouts](#14-grid-layouts-lignes-511-528)
15. [Radio Cards](#15-radio-cards-lignes-530-583)
16. [Machine Cards](#16-machine-cards-lignes-585-670)
17. [Form Inputs](#17-form-inputs-lignes-672-707)
18. [Summary Panel](#18-summary-panel-lignes-709-757)
19. [Badge](#19-badge-lignes-759-777)
20. [Button Group](#20-button-group-lignes-779-785)
21. [Responsive](#21-responsive-lignes-787-917)
22. [Summary Panel (Redéfinition)](#22-summary-panel-redéfinition-lignes-919-962)
23. [Projects Toolbar](#23-projects-toolbar-lignes-964-981)
24. [News Feed Container](#24-news-feed-container-lignes-983-1041)
25. [Update Badge](#25-update-badge-lignes-1043-1065)
26. [Section Icon](#26-section-icon-lignes-1067-1077)
27. [Alert Info](#27-alert-info-lignes-1079-1094)
28. [Percentile Grid](#28-percentile-grid-lignes-1096-1132)
29. [Project Card](#29-project-card-lignes-1134-1220)

---

## 1. EN-TÊTE & VARIABLES (Lignes 1-13)

```css
1:  /* Projections Mining Intelligence Platform - HEARST Design System */
2:  /* Toutes les couleurs utilisent #8afd81 (vert HEARST) */
3:  (ligne vide)
4:  /* Variables HEARST pour projections */
5:  :root {
6:      --hearst-primary: #8afd81;
7:      --hearst-primary-dark: #6fdc66;
8:      --hearst-primary-light: #a5ff9c;
9:      --hearst-mint-500: #7bed9f;
10:     --hearst-dark-900: #0A0A0A;
11:     --hearst-dark-800: #141414;
12:     --hearst-dark-700: #1A1A1A;
13: }
```

---

## 2. SECTION PREMIUM (Lignes 15-18)

```css
15: /* Section Premium */
16: .section-premium {
17:     margin-bottom: 24px;
18: }
```

---

## 3. ACCORDION SYSTEM (Lignes 20-112)

```css
20: /* Accordion System Premium */
21: .accordion-section { ... }
31: .accordion-section:hover { ... }
36: .accordion-header { ... }
47: .accordion-header:hover { ... }
51: .accordion-header:active { ... }
55: .accordion-title { ... }
65: .accordion-icon { ... }
73: .accordion-section.collapsed .accordion-icon { ... }
77: .accordion-content { ... }
87: .accordion-section.collapsed .accordion-content { ... }
93: .accordion-badge { ... }
106: .accordion-subtitle { ... }
```

---

## 4. MARKET METRICS CARDS (Lignes 114-201)

```css
114: /* Market Metrics Cards */
115: .metrics-grid { ... }
122: .metric-card { ... }
134: .metric-card > * { ... }
138: .metric-card:hover { ... }
144: .metric-card.green:hover, .metric-card.blue:hover, ... { ... }
152: .metric-icon-wrapper { ... }
162: .metric-icon-wrapper.green, .metric-icon-wrapper.blue, ... { ... }
169: .metric-label { ... }
179: .metric-value { ... }
188: .metric-value.green, .metric-value.blue, ... { ... }
195: .metric-description { ... }
```

---

## 5. NEWS ITEMS (Lignes 203-217)

```css
203: /* News Items */
204: .news-item { ... }
213: .news-item:hover { ... }
```

---

## 6. TABLES PREMIUM (Lignes 219-257)

```css
219: /* Tables Premium */
220: .table-container { ... }
229: .table-premium { ... }
234: .table-premium thead { ... }
238: .table-premium th { ... }
248: .table-premium td { ... }
255: .table-premium tbody tr:hover { ... }
```

---

## 7. PROJECTION TAB CONTENT (Lignes 259-267)

```css
259: /* Projection Tab Content */
260: .projection-tab-content { ... }
264: .projection-tab-content.active { ... }
```

---

## 8. CONTAINER & OVERVIEW SECTION (Lignes 269-321)

```css
269: /* Conteneur principal des sections */
270: #projections-sections-container { ... }
278: /* Overview Section - Styles isolés pour éviter conflits */
279: #overview-section { ... }
288: #overview-section * { ... }
292: #overview-section h2 { ... }
300: #overview-section > div:first-of-type { ... }
309: #projection-history-select { ... }
323: (ligne vide)
```

---

## 9. ANIMATIONS (Lignes 324-333)

```css
324: @keyframes fadeIn { ... }
329: (ligne vide)
330: /* Pulse Animation */
331: @keyframes pulse { ... }
```

---

## 10. PROJECTION SECTION PLACEHOLDER (Lignes 335-340)

```css
335: /* Projection Section Placeholder */
336: .projection-section-placeholder { ... }
```

---

## 11. STEPPER NAVIGATION (Lignes 342-471)

```css
342: /* Stepper Navigation */
343: .stepper-container { ... }
352: .stepper { ... }
360: .progress-line-container { ... }
369: .progress-line-bg { ... }
376: .stepper-progress { ... }
386: .step { ... }
398: .step-circle { ... }
414: .step.completed .step-circle { ... }
420: .step.active .step-circle { ... }
427: .step.completed .step-circle::after { ... }
435: .step.completed .step-circle { ... }
439: .step-label { ... }
451: .step.active .step-label { ... }
456: .step.completed .step-label { ... }
460: .step:hover .step-circle { ... }
465: .step.active:hover .step-circle { ... }
469: .step:hover .step-label { ... }
```

---

## 12. STEP CONTENT (Lignes 473-481)

```css
473: /* Step Content */
474: .step-content { ... }
479: .step-content.active { ... }
```

---

## 13. PARAM CARD (Lignes 483-509)

```css
483: /* Param Card */
484: .param-card { ... }
493: .param-card-title { ... }
505: .param-card-subtitle { ... }
```

---

## 14. GRID LAYOUTS (Lignes 511-528)

```css
511: /* Grid Layouts */
512: .grid-2 { ... }
518: .grid-3 { ... }
524: .grid-4 { ... }
```

---

## 15. RADIO CARDS (Lignes 530-583)

```css
530: /* Radio Cards */
531: .radio-cards { ... }
538: .radio-card { ... }
548: .radio-card:hover { ... }
553: .radio-card input[type="radio"] { ... }
558: .radio-card input[type="radio"]:checked ~ .radio-card-label { ... }
562: .radio-card input[type="radio"]:checked ~ * { ... }
566: .radio-card:has(input[type="radio"]:checked) { ... }
571: .radio-card-label { ... }
579: .radio-card-desc { ... }
```

---

## 16. MACHINE CARDS (Lignes 585-670)

```css
585: /* Machine Cards */
586: .machine-grid { ... }
593: .machine-card { ... }
603: .machine-card:hover { ... }
609: .machine-card.selected { ... }
614: .machine-card-header { ... }
621: .machine-name { ... }
627: .machine-badge { ... }
638: .machine-specs { ... }
644: .machine-spec { ... }
650: .machine-spec-label { ... }
654: .machine-spec-value { ... }
659: .machine-price { ... }
666: .machine-price-value { ... }
```

---

## 17. FORM INPUTS (Lignes 672-707)

```css
672: /* Form Inputs */
673: .form-label { ... }
682: .form-input, .form-select { ... }
696: .form-input:focus, .form-select:focus { ... }
704: .form-input:hover, .form-select:hover { ... }
```

---

## 18. SUMMARY PANEL (Lignes 709-757)

```css
709: /* Summary Panel */
710: .summary-panel { ... }
720: .summary-title { ... }
732: .summary-item { ... }
740: .summary-item:last-child { ... }
744: .summary-label { ... }
748: .summary-value { ... }
753: .summary-value.highlight { ... }
```

---

## 19. BADGE (Lignes 759-777)

```css
759: /* Badge */
760: .badge { ... }
772: .badge.badge-green { ... }
```

---

## 20. BUTTON GROUP (Lignes 779-785)

```css
779: /* Button Group */
780: .btn-group { ... }
```

---

## 21. RESPONSIVE (Lignes 787-917)

```css
787: /* Responsive - Force override des styles inline */
788: (ligne vide)
789: (ligne vide)
790: /* Section Header */
791: .section-header-premium { ... }
800: .section-title-premium { ... }
808: .section-desc-premium { ... }
814: .section-actions { ... }
821: /* Chart Container */
822: .chart-container { ... }
831: .chart-title { ... }
838: /* Results Charts Grid */
839: .results-charts-grid { ... }
845: /* Calculator Main Content */
846: .calculator-content { ... }
852: .calculator-steps { ... }
858: /* Responsive Calculator */
859: @media (max-width: 1024px) { ... }
871: /* Responsive Mobile - Force 1 colonne pour toutes les grilles */
872: @media (max-width: 768px) { ... }
```

---

## 22. SUMMARY PANEL (REDÉFINITION) (Lignes 919-962)

```css
919: .summary-panel { ... }
930: .summary-title { ... }
939: .summary-item { ... }
947: .summary-label { ... }
952: .summary-value { ... }
958: .summary-value.highlight { ... }
```

**⚠️ DOUBLON :** Ces classes sont déjà définies lignes 710-757.

---

## 23. PROJECTS TOOLBAR (Lignes 964-981)

```css
964: /* Projects Toolbar */
965: .projects-toolbar { ... }
973: .projects-toolbar .form-input { ... }
978: .projects-toolbar select.form-input { ... }
```

---

## 24. NEWS FEED CONTAINER (Lignes 983-1041)

```css
983: /* News Feed Container */
984: .news-feed-container { ... }
992: /* News Item */
993: .news-item { ... }
1001: .news-item:hover { ... }
1006: .news-item-content { ... }
1011: .news-item-icon { ... }
1023: .news-item-body { ... }
1027: .news-item-header { ... }
1035: .news-item-meta { ... }
```

**⚠️ DOUBLON :** `.news-item` est déjà défini lignes 204-217.

---

## 25. UPDATE BADGE (Lignes 1043-1065)

```css
1043: /* Update Badge */
1044: .update-badge { ... }
1054: .update-dot { ... }
1062: @keyframes pulse { ... }
```

**⚠️ DOUBLON :** `@keyframes pulse` est déjà défini lignes 330-333.

---

## 26. SECTION ICON (Lignes 1067-1077)

```css
1067: /* Section Icon */
1068: .section-icon { ... }
```

---

## 27. ALERT INFO (Lignes 1079-1094)

```css
1079: /* Alert Info */
1080: .alert-info { ... }
1088: .alert-info strong { ... }
1092: .alert-info span { ... }
```

---

## 28. PERCENTILE GRID (Lignes 1096-1132)

```css
1096: /* Percentile Grid (Monte Carlo) */
1097: .percentile-grid { ... }
1104: .percentile-item { ... }
1113: .percentile-item:hover { ... }
1118: .percentile-label { ... }
1127: .percentile-value { ... }
```

---

## 29. PROJECT CARD (Lignes 1134-1220)

```css
1134: /* Project Card (Projects List) */
1135: .project-card { ... }
1145: .project-card:hover { ... }
1151: .project-header { ... }
1158: .project-name { ... }
1165: .project-date { ... }
1170: .project-actions { ... }
1175: .btn-icon { ... }
1189: .btn-icon:hover { ... }
1195: .project-stats { ... }
1202: .project-stat { ... }
1206: .project-stat-label { ... }
1215: .project-stat-value { ... }
1222: (fin du fichier)
```

---

## 📊 RÉSUMÉ DE LA STRUCTURE

### Sections principales :
1. **Variables** (lignes 1-13)
2. **Composants UI** (lignes 15-785)
3. **Responsive** (lignes 787-917)
4. **Composants redéfinis** (lignes 919-1220)

### Nombre de classes CSS : ~80
### Nombre de media queries : 2
### Nombre d'animations : 2 (dont 1 doublon)
### Nombre de doublons : 5

---

**Dernière mise à jour :** 18 Novembre 2025

