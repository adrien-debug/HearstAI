# 🔍 DIAGNOSTIC DOUBLONS - Problèmes identifiés

## ❌ PROBLÈMES CRITIQUES

### 1. DOUBLONS DE STYLES `.nav-item` dans main.css

**Première définition (lignes 296-376) :**
```css
.nav-item { ... }
.nav-item:hover { ... }
.nav-item.active { ... }
.nav-item.active:hover { ... }
```

**Deuxième définition (lignes 753-814) :**
```css
.nav-item { ... }  /* ❌ DOUBLON */
.nav-item:hover { ... }  /* ❌ DOUBLON */
.nav-item.active { ... }  /* ❌ DOUBLON */
.nav-item.active:hover { ... }  /* ❌ DOUBLON */
```

**Problème :** Les deux définitions se chevauchent et créent des conflits. La deuxième écrase la première avec `!important`, causant des changements de couleur soudains.

---

### 2. COULEURS HARDCODÉES OBSOLÈTES

**Lignes 322, 331 :**
```css
rgba(138, 253, 129, 0.2)  /* ❌ Ancienne couleur #8afd81 */
rgba(138, 253, 129, 0.3)  /* ❌ Ancienne couleur #8afd81 */
```

**Problème :** Utilise l'ancienne couleur au lieu de la nouvelle `#A3FF8B` (rgba(163, 255, 139, ...))

---

### 3. CONFLITS DE SPÉCIFICITÉ

**Première définition :**
- Utilise `!important` sur certains styles
- Couleurs : `var(--color-primary-light-green)`

**Deuxième définition :**
- Utilise aussi `!important` partout
- Couleurs : `var(--color-primary-light-green)` mais avec des valeurs différentes

**Résultat :** Les deux se battent, causant des changements soudains au clic.

---

## ✅ SOLUTIONS

### Solution 1 : Supprimer la deuxième définition

La section "DESIGN PREMIUM" (lignes 744-814) redéfinit `.nav-item` inutilement. Supprimer cette section ou la fusionner avec la première.

### Solution 2 : Corriger les couleurs hardcodées

Remplacer `rgba(138, 253, 129, ...)` par `rgba(163, 255, 139, ...)` ou utiliser les variables CSS.

### Solution 3 : Unifier les styles

Garder une seule définition de `.nav-item` avec tous les styles nécessaires.

---

## 📊 RÉSUMÉ

- **Doublons de `.nav-item` :** 2 définitions complètes
- **Couleurs obsolètes :** 2 occurrences
- **Conflits `!important` :** Multiples
- **Fichier à corriger :** main.css

