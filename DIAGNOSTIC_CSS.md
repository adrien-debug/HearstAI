# 🔍 DIAGNOSTIC CSS - Problèmes identifiés

## ❌ PROBLÈMES CRITIQUES

### 1. RÉFÉRENCES CIRCULAIRES dans main.css

**Ligne 113-116 :**
```css
--shadow-sm: var(--shadow-sm);  /* ❌ CIRCULAIRE */
--shadow-md: var(--shadow-md);  /* ❌ CIRCULAIRE */
--shadow-lg: var(--shadow-lg);  /* ❌ CIRCULAIRE */
--shadow-xl: var(--shadow-xl);  /* ❌ CIRCULAIRE */
```

**Ligne 157-158 :**
```css
--transition-fast: var(--transition-fast);  /* ❌ CIRCULAIRE */
--transition-normal: var(--transition-normal);  /* ❌ CIRCULAIRE */
```

**Problème :** Ces variables se référencent elles-mêmes au lieu de référencer les tokens du design system.

**Solution :** Supprimer ces lignes car les variables `--shadow-*` et `--transition-*` existent déjà dans `design-tokens.css`.

---

### 2. DOUBLON DE VARIABLES

**Dans main.css ligne 84-85 :**
```css
--space-1: var(--spacing-2); /* 4px */
--space-2: var(--spacing-2); /* 4px */
```

**Problème :** `--space-1` et `--space-2` pointent vers la même valeur, ce qui est incorrect.

**Solution :** 
- `--space-1` devrait pointer vers `--spacing-1` (2px) ou être supprimé
- `--space-2` devrait pointer vers `--spacing-2` (4px)

---

### 3. CONFLIT DE NOMS

**design-tokens.css définit :**
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- `--transition-fast`, `--transition-normal`, `--transition-slow`

**main.css redéfinit les mêmes noms :**
- `--shadow-sm: var(--shadow-sm)` (circulaire)
- `--transition-fast: var(--transition-fast)` (circulaire)

**Problème :** `main.css` écrase les valeurs de `design-tokens.css` avec des références circulaires.

---

### 4. STRUCTURE DES FICHIERS

**Ordre de chargement actuel :**
1. `design-tokens.css` ✅ (définit les tokens de base)
2. `main.css` ❌ (redéfinit des variables avec des références circulaires)
3. `components.css`
4. `cockpit.css`
5. `projections.css`
6. `override-cockpit.css`

**Problème :** `main.css` devrait uniquement créer des ALIAS de compatibilité, pas redéfinir les mêmes noms.

---

## ✅ SOLUTIONS

### Solution 1 : Supprimer les références circulaires

Dans `main.css`, supprimer ou corriger :
- Lignes 113-116 (shadows)
- Lignes 157-158 (transitions)

### Solution 2 : Corriger les espacements

Dans `main.css`, corriger :
- `--space-1: var(--spacing-1)` au lieu de `var(--spacing-2)`

### Solution 3 : Vérifier les autres fichiers CSS

Vérifier si `components.css`, `cockpit.css`, `projections.css` ou `override-cockpit.css` redéfinissent aussi des variables du design system.

---

## 📊 RÉSUMÉ

- **Références circulaires :** 6
- **Doublons problématiques :** 1
- **Fichiers à corriger :** 1 (main.css)


