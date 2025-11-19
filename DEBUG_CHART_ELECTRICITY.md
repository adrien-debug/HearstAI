# 🔍 DEBUG COMPLET - Graphiques Chart.js sur /electricity

## 📋 ÉTAT ACTUEL - Corrections CSS déjà appliquées

D'après `CORRECTIONS_CANVAS_CONFLICTS.md`, les corrections suivantes ont été faites :

1. ✅ **Suppression des propriétés CSS problématiques** :
   - `transform: translateZ(0)` supprimé des boutons `.btn-primary`
   - `isolation: isolate` supprimé
   - `transform: translateZ(0)` supprimé des animations `@keyframes fadeInUp`
   - `transform: translateZ(0)` supprimé des cartes `.card`

2. ✅ **Règles CSS spécifiques pour les conteneurs de canvas** :
   - `.chart-container`, `.wallet-chart-section` : `transform: none !important`, `isolation: auto !important`
   - Position `static` pour les enfants des conteneurs dans les cartes

3. ✅ **Propriétés anti-blur conservées** (ne créent pas de stacking context)

## 🐛 PROBLÈME IDENTIFIÉ

**Page concernée** : `/electricity` (composant `ElectricitySection`)

**Symptôme** : Le graphique Chart.js ne s'affiche pas / reste vide

**Cause identifiée** : 
- Le composant React `ElectricitySection` utilisait initialement une approche avec `window.Chart` et `useEffect`, ce qui était fragile dans Next.js
- Migration vers `react-chartjs-2` effectuée, mais le graphique ne s'affiche toujours pas

## 🔧 CORRECTIONS APPLIQUÉES

### Fichier modifié : `components/sections/electricity/Electricity.js`

#### 1. Migration vers `react-chartjs-2`

**AVANT** :
```javascript
// Approche fragile avec window.Chart
useEffect(() => {
  const initChart = () => {
    if (typeof window.Chart === 'undefined') {
      setTimeout(initChart, 100);
      return;
    }
    const canvas = chartRef.current;
    new window.Chart(canvas, { ... });
  };
  setTimeout(initChart, 100);
}, []);
```

**APRÈS** :
```javascript
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ... } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dans le JSX :
<Bar data={chartData} options={chartOptions} />
```

#### 2. Ajout de debug console

**Ajouté** :
```javascript
useEffect(() => {
  if (chartContainerRef.current) {
    const checkDimensions = () => {
      const rect = chartContainerRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(chartContainerRef.current);
      console.log('[Chart Debug] Container dimensions:', {
        width: rect.width,
        height: rect.height,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        position: computedStyle.position,
        zIndex: computedStyle.zIndex,
        transform: computedStyle.transform,
        isolation: computedStyle.isolation
      });
      
      const canvas = chartContainerRef.current.querySelector('canvas');
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        console.log('[Chart Debug] Canvas dimensions:', {
          width: canvasRect.width,
          height: canvasRect.height,
          display: window.getComputedStyle(canvas).display,
          visibility: window.getComputedStyle(canvas).visibility
        });
      } else {
        console.warn('[Chart Debug] No canvas found in container');
      }
    };
    
    checkDimensions();
    setTimeout(checkDimensions, 500);
  }
}, []);
```

#### 3. Amélioration du conteneur

**Ajouté** :
- `ref={chartContainerRef}` sur le conteneur du graphique
- `minHeight: '400px'` et `minWidth: '100%'` pour garantir des dimensions minimales
- Dimensions explicites : `height: '400px'`, `width: '100%'`

## 🔍 DIAGNOSTIC À FAIRE

Pour identifier la cause exacte, vérifier dans la console du navigateur :

1. **Les logs de debug** doivent afficher :
   - Les dimensions du conteneur (width, height)
   - Les dimensions du canvas (width, height)
   - Les propriétés CSS (display, visibility, transform, isolation)

2. **Scénarios possibles** :
   - ✅ **Canvas créé mais dimensions 0x0** → Problème de layout CSS
   - ✅ **Canvas non trouvé** → Problème de rendu React
   - ✅ **Dimensions OK mais graphique invisible** → Problème de z-index ou overflow
   - ✅ **Erreur dans la console** → Problème d'initialisation Chart.js

## 📝 PROCHAINES ÉTAPES

1. **Tester la page `/electricity`** et vérifier les logs de la console
2. **Si le problème persiste**, analyser les logs pour identifier la cause exacte
3. **Vérifier les autres pages** avec des graphiques (Projects, Collateral) si nécessaire

## 🎯 RÉSULTAT ATTENDU

Le graphique en barres doit s'afficher correctement avec :
- Dimensions : 400px de hauteur, 100% de largeur
- Données : AKT02A ($1,474.70), AKT06A ($722.95), LR02 ($0), LR06 ($0)
- Style : Couleurs du design system HEARST (#C5FFA7)

---

**Date** : $(date)
**Fichier modifié** : `components/sections/electricity/Electricity.js`

