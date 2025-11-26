# 🚨 PROMPT URGENT - DEBUG MENUS DÉROULANTS CALCULATOR

## PROBLÈME CRITIQUE

Les menus déroulants de la page Calculator (`/app/calculator/page.tsx`) passent **derrière** les sections et les boxes au lieu de s'afficher au-dessus. C'est un problème de **z-index** et de **stacking context** CSS.

## SYMPTÔMES

- Quand on clique sur les menus déroulants "Sélection de la Machine" ou "Sélection de l'Hoster", le menu s'ouvre mais est masqué par les sections suivantes
- Les menus déroulants ne sont pas cliquables car ils sont derrière d'autres éléments
- Le problème affecte l'UX de manière critique car l'utilisateur ne peut pas sélectionner de machine ou d'hoster

## FICHIERS CONCERNÉS

1. **`/app/calculator/page.tsx`** - Composant React avec les menus déroulants
2. **`/app/calculator/CalculatorPage.css`** - Styles CSS (lignes 620-808 pour les dropdowns, lignes 898-942 pour les sections)

## CODE PERTINENT

### Structure HTML (dans page.tsx)

```tsx
// Ligne 891-1007 : Menu déroulant Machine
<div className="calculator-section-card calculator-section-card-large">
  <div className="calculator-premium-dropdown">
    <button className="calculator-dropdown-trigger">...</button>
    {machineDropdownOpen && (
      <div className="calculator-dropdown-menu">
        {/* Items du menu */}
      </div>
    )}
  </div>
</div>
```

### CSS Actuel (CalculatorPage.css)

**Menu déroulant** (lignes 716-736):
```css
.calculator-dropdown-menu {
    position: absolute;
    top: calc(100% + var(--space-2));
    left: 0;
    right: 0;
    z-index: 1000;  /* ⚠️ Problème ici */
    /* ... */
}
```

**Section Card** (lignes 898-932):
```css
.calculator-section-card {
    position: relative;  /* ⚠️ Crée un nouveau stacking context */
    overflow: visible;
    /* ... */
}

.calculator-section-card > * {
    position: relative;
    z-index: 1;  /* ⚠️ Les enfants ont z-index: 1 */
}
```

## CAUSE DU PROBLÈME

1. **Stacking Context** : `.calculator-section-card` a `position: relative`, ce qui crée un nouveau stacking context
2. **Z-index insuffisant** : Le menu déroulant a `z-index: 1000`, mais il est à l'intérieur d'une section qui a ses propres enfants avec `z-index: 1`
3. **Ordre de rendu** : Les sections suivantes dans le DOM sont rendues après, donc elles passent au-dessus même avec un z-index inférieur dans certains cas
4. **Overflow** : Même si `overflow: visible` est défini, le stacking context peut limiter l'affichage

## SOLUTION REQUISE

### Option 1 : Augmenter le z-index du menu (RECOMMANDÉ)

Augmenter significativement le z-index du menu déroulant pour qu'il soit au-dessus de tous les autres éléments :

```css
.calculator-dropdown-menu {
    position: absolute;
    top: calc(100% + var(--space-2));
    left: 0;
    right: 0;
    z-index: 9999;  /* ✅ Augmenter à 9999 */
    /* ... reste du code ... */
}
```

### Option 2 : Utiliser un portal React (SOLUTION ROBUSTE)

Déplacer le menu déroulant en dehors du DOM de la section en utilisant un portal React :

```tsx
import { createPortal } from 'react-dom';

// Dans le composant
{machineDropdownOpen && createPortal(
  <div className="calculator-dropdown-menu">
    {/* Items */}
  </div>,
  document.body
)}
```

### Option 3 : Ajuster le stacking context de la section

S'assurer que la section ne crée pas de stacking context qui bloque le menu :

```css
.calculator-section-card {
    position: relative;
    overflow: visible;
    /* Ne pas mettre z-index sur les enfants si pas nécessaire */
}

.calculator-premium-dropdown {
    position: relative;
    z-index: 10;  /* ✅ Créer un stacking context pour le dropdown */
}

.calculator-dropdown-menu {
    z-index: 9999;  /* ✅ Menu au-dessus de tout */
}
```

## CORRECTIONS À APPLIQUER

### 1. Modifier CalculatorPage.css

**Ligne 731** - Augmenter le z-index :
```css
.calculator-dropdown-menu {
    /* ... */
    z-index: 9999;  /* Changer de 1000 à 9999 */
    /* ... */
}
```

**Ligne 620** - Ajouter z-index au conteneur dropdown :
```css
.calculator-premium-dropdown {
    position: relative;
    width: 100%;
    margin-bottom: var(--space-4);
    z-index: 10;  /* ✅ Ajouter cette ligne */
}
```

### 2. Vérifier les autres sections

S'assurer que les sections suivantes n'ont pas de z-index trop élevé qui pourrait interférer :

- `.premium-stats-section` (si présente)
- `.calculator-inputs-section`
- `.calculator-params-section`

## TESTS À EFFECTUER

1. ✅ Ouvrir le menu "Sélection de la Machine" → Le menu doit être visible au-dessus de toutes les sections
2. ✅ Ouvrir le menu "Sélection de l'Hoster" → Le menu doit être visible au-dessus de toutes les sections
3. ✅ Cliquer sur un item du menu → Le menu doit se fermer et la sélection doit fonctionner
4. ✅ Scroller la page avec un menu ouvert → Le menu doit rester positionné correctement
5. ✅ Tester sur mobile → Le menu doit être responsive et fonctionnel

## PRIORITÉ

🔴 **URGENT ET CRITIQUE** - Bloque l'utilisation de la page Calculator

## CONTEXTE TECHNIQUE

- **Framework** : Next.js 14+ (App Router)
- **Styling** : CSS Modules avec variables CSS
- **Composants** : React fonctionnels avec hooks
- **Design System** : Charte graphique Hearst (couleur principale #C5FFA7)

## NOTES IMPORTANTES

- Ne pas utiliser `z-index` trop élevé partout (risque de conflits futurs)
- Préférer une solution qui respecte le stacking context naturel
- Tester sur différents navigateurs (Chrome, Firefox, Safari)
- Vérifier que les animations du menu fonctionnent toujours après correction

---

**INSTRUCTIONS POUR CLAUDE** : 
1. Analyser le problème de z-index dans les fichiers mentionnés
2. Appliquer la solution recommandée (Option 1 en premier)
3. Tester visuellement que les menus s'affichent correctement
4. Vérifier qu'il n'y a pas de régressions sur d'autres éléments
5. Documenter les changements effectués

