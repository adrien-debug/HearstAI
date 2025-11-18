# 📚 INDEX - CHARTE GRAPHIQUE HEARST

**Date :** 18 Novembre 2025  
**Version :** 2.0

---

## 📁 FICHIERS DE LA CHARTE GRAPHIQUE

### 📖 Documentation Principale

1. **`CHARTE_GRAPHIQUE_HEARST_COMPLETE.md`** ⭐
   - **Fichier principal** - Charte graphique complète et consolidée
   - Tous les tokens CSS
   - Tous les composants
   - Règles critiques
   - Variables CSS complètes

2. **`TOKENS_ET_CHARTE_GRAPHIQUE.md`**
   - Référence rapide des tokens
   - Checklist de validation
   - Statistiques d'utilisation

3. **`STANDARDS_HEARST.md`**
   - Standards de design
   - Règles de code
   - Référence complète

4. **`FIGMA_DESIGN_SYSTEM.md`**
   - Spécifications Figma
   - Template pour extraction

### 🎨 Assets Design System

5. **`hearst-flow-ds-assets/`**
   - Fichiers SVG exportés depuis Figma
   - Designs "Hearst Flow + DS (4)"
   - Composants visuels de référence

---

## 🎯 UTILISATION RAPIDE

### Pour développer un nouveau composant :
1. Consulter `CHARTE_GRAPHIQUE_HEARST_COMPLETE.md` pour les tokens
2. Utiliser les variables CSS définies dans `frontend/css/main.css`
3. Respecter les règles critiques (texte noir sur vert, etc.)

### Pour vérifier la conformité :
1. Utiliser `TOKENS_ET_CHARTE_GRAPHIQUE.md` - Checklist de validation
2. Vérifier les occurrences de `#8afd81` vs `#7bed9f`
3. Valider les tailles de police et espacements

### Pour référencer les designs :
1. Consulter les SVG dans `hearst-flow-ds-assets/`
2. Vérifier `FIGMA_DESIGN_SYSTEM.md` pour les spécifications

---

## 🔑 POINTS CLÉS

### Couleur Principale
- **HEARST Green** : `#8afd81` ⬤
- **NEVER USE** : `#7bed9f` (ancien NEARST)

### Règle #1
- **Texte sur fond vert** = TOUJOURS noir `#000000`

### Variables CSS
- Toutes dans `frontend/css/main.css`
- Utiliser les variables, jamais les valeurs hardcodées

---

## 📊 STATISTIQUES

- **Variables CSS** : 33 variables principales
- **Occurrences #8afd81** : 56 dans le codebase
- **Fichiers CSS** : 4 fichiers (main, components, cockpit, projections)
- **Fichiers SVG** : 47 fichiers dans hearst-flow-ds-assets

---

**Dernière mise à jour :** 18 Novembre 2025

