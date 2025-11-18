# 🎨 PROMPT — HARMONISATION DESIGN (DESIGNER MODE)

## 🔒 MODE ACTIVÉ : DESIGNER ONLY — ZERO CASSE

Tu es en **DESIGNER MODE** : tu modifies **UNIQUEMENT** le CSS et les styles visuels.  
**AUCUNE** modification de logique, structure HTML, ou fonctionnalités.

---

## 📋 MISSION

Harmoniser le **style et format** de **TOUTES les pages** avec la **page Dashboard (Home)**.

### ✅ Référence : `frontend/js/views/dashboard.js`

La page Dashboard est la **référence absolue** pour :
- Structure de padding/marges
- Styles de sections et headers
- Styles de tables
- Styles de cards
- Espacements et gaps
- Couleurs, ombres, transitions
- Typographie

---

## 🎯 PAGES À HARMONISER

1. **Jobs** → `frontend/js/views/jobs.js`
2. **Prompts** → `frontend/js/views/prompts.js`
3. **Versions** → `frontend/js/views/versions.js`
4. **Logs** → `frontend/js/views/logs.js`
5. **Projects** → `frontend/js/views/projects.js`
6. **Cockpit** → `frontend/js/views/cockpit.js` (si applicable)

---

## 📐 RÈGLES D'HARMONISATION

### 1. STRUCTURE DE VUE

**Dashboard utilise :**
```css
.dashboard-view {
    padding: var(--space-6);
    width: 100%;
    max-width: 100%;
    margin: 0;
}

.dashboard-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}
```

**→ Appliquer la MÊME structure à toutes les vues :**
- `.jobs-view`, `.prompts-view`, `.versions-view`, etc.
- Même padding, même gap, même structure flex

---

### 2. HEADERS DE SECTION

**Dashboard utilise :**
```css
.section-header-home {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-4);
}

.section-title-home {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.4;
}
```

**→ Appliquer les MÊMES classes/styles à toutes les pages**

---

### 3. TABLES

**Dashboard utilise :**
```css
.table-container {
    background: var(--primary-grey);
    border: 1px solid var(--grey-100);
    border-radius: 12px;
    overflow: hidden;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

.table thead tr {
    background: #454646;
}

.table thead th {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-primary);
    border-bottom: 1px solid var(--grey-100);
}

.table tbody tr {
    transition: background-color var(--duration-fast) var(--ease-in-out);
}

.table tbody tr:hover {
    background-color: rgba(138, 253, 129, 0.05);
}

.table tbody td {
    padding: 12px 16px;
    font-size: 14px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--grey-100);
}
```

**→ Harmoniser TOUTES les tables avec ces styles**

---

### 4. CARDS

**Dashboard utilise :**
```css
.wallet-card {
    background: var(--primary-grey);
    border: var(--border-thin) solid var(--grey-100);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    margin-bottom: var(--space-6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(138, 253, 129, 0.05);
    transition: all var(--duration-normal) var(--ease-in-out);
}

.wallet-card:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(138, 253, 129, 0.1);
    transform: translateY(-2px);
}
```

**→ Appliquer les MÊMES styles de cards (ombres, bordures, hover) partout**

---

### 5. BOUTONS ET CONTROLES

**Dashboard utilise :**
```css
.btn-export-excel {
    white-space: nowrap !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    background-color: #8afd81 !important;
    color: #000000 !important;
    border: none !important;
    transition: all var(--duration-fast) var(--ease-in-out) !important;
    cursor: pointer !important;
}

.btn-export-excel:hover {
    background-color: #75fc6c;
    box-shadow: 0 0 20px rgba(138, 253, 129, 0.3);
    transform: translateY(-1px);
}
```

**→ Harmoniser TOUS les boutons avec ce style**

---

### 6. SELECTS

**Dashboard utilise :**
```css
.date-range-select,
.contract-select {
    padding: 12px 16px !important;
    background: #2a2a2a !important;
    border: 1px solid #3a3a3a !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    font-size: 14px !important;
    font-family: var(--font-primary) !important;
    cursor: pointer !important;
    transition: all var(--duration-fast) var(--ease-in-out) !important;
    appearance: none !important;
    background-image: url("data:image/svg+xml,...") !important;
    background-repeat: no-repeat !important;
    background-position: right 14px center !important;
    padding-right: 40px !important;
}

.date-range-select:hover,
.contract-select:hover {
    border-color: var(--primary-green);
    background: rgba(138, 253, 129, 0.05);
}
```

**→ Harmoniser TOUS les selects avec ces styles**

---

## 🚫 INTERDICTIONS ABSOLUES

❌ **NE PAS** modifier :
- La structure HTML (pas de changement de balises, classes, IDs)
- La logique JavaScript (pas de changement de fonctions, événements, API calls)
- Les noms de classes existants (sauf si tu ajoutes des classes pour le style)
- Les fonctionnalités (tout doit continuer à fonctionner exactement pareil)

✅ **UNIQUEMENT** modifier :
- Les styles CSS dans les `<style>` blocks
- Les valeurs de padding, margin, gap, colors, shadows, borders, transitions
- Les tailles de police, font-weight, line-height
- Les styles visuels (hover, focus, etc.)

---

## 📝 FORMAT DE RÉPONSE

Pour chaque page modifiée, fournir :

1. **Fichier modifié** : `frontend/js/views/[nom].js`
2. **Section modifiée** : Le bloc `<style>` uniquement
3. **Diff-style** : Montrer les changements CSS uniquement

**Exemple :**
```css
/* AVANT */
.jobs-view {
    padding: 0;
    width: 100%;
}

/* APRÈS */
.jobs-view {
    padding: var(--space-6);
    width: 100%;
    max-width: 100%;
    margin: 0;
}

.jobs-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}
```

---

## ✅ CHECKLIST FINALE

Avant de terminer, vérifier que :

- [ ] Toutes les pages ont le même padding de vue (`var(--space-6)`)
- [ ] Toutes les pages ont la même structure de contenu (flex column, gap `var(--space-8)`)
- [ ] Toutes les sections ont les mêmes headers (`.section-header-home`, `.section-title-home`)
- [ ] Toutes les tables ont les mêmes styles (background, borders, padding, hover)
- [ ] Toutes les cards ont les mêmes ombres et transitions
- [ ] Tous les boutons ont le même style (couleur, padding, hover)
- [ ] Tous les selects ont le même style (background, border, hover)
- [ ] Aucune fonctionnalité n'a été cassée
- [ ] Aucune structure HTML n'a été modifiée

---

## 🎯 RÉSULTAT ATTENDU

Après harmonisation, **toutes les pages doivent avoir** :
- Le même look & feel que la page Dashboard
- La même cohérence visuelle
- Les mêmes espacements et proportions
- Les mêmes effets hover/transitions
- La même typographie et couleurs

**Mais** : toutes les fonctionnalités doivent rester **100% identiques**.

---

## 🚀 ACTION

**Applique ces règles à toutes les pages listées ci-dessus.**

**Commence par :**
1. Jobs
2. Prompts  
3. Versions
4. Logs
5. Projects
6. Cockpit

**Une page à la fois, en montrant les diffs CSS uniquement.**

---

**HEARST ENGINEER MODE — DESIGNER ONLY — ZERO CASSE**


