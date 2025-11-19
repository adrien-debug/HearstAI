# PROMPT DE VÉRIFICATION - PAGE PROJECTIONS

## OBJECTIF
Claude, tu dois te concentrer EXCLUSIVEMENT sur la page **Projections** (Projestions) de l'application HearstAI et vérifier que la page affiche correctement tout le code que tu viens de recoder.

## CONTEXTE
La page Projections a été récemment recodée avec:
- **`frontend/js/projections.js`** - Gestion de la navigation entre sections
- **`frontend/css/projections.css`** - Styles HEARST Design System (#8afd81)
- **`frontend/js/views/projects-sections.js`** - Rendu de toutes les sections de projections

## TÂCHES À EFFECTUER

### 1. ANALYSE DE L'ARCHITECTURE ACTUELLE
- Vérifier le flow de navigation: Sidebar → "Projestions" → Chargement de la vue
- Analyser comment `initProjections()` est appelée depuis `app.js`
- Vérifier que `showProjectionSection()` fonctionne correctement
- Valider que le container `#projections-sections-container` existe et est accessible

### 2. VÉRIFICATION DU RENDU INITIAL
- Tester que la section **"overview"** s'affiche par défaut au chargement
- Vérifier que les 5 cartes de projections (Alpha, Beta, Gamma, Delta, Epsilon) s'affichent correctement
- Valider que les styles HEARST (#8afd81) sont appliqués correctement
- Contrôler que le responsive mobile fonctionne (grille sur mobile = 1 colonne)

### 3. TEST DES NAVIGATIONS ENTRE SECTIONS
Tester chaque onglet de navigation dans le header:
- ✅ **Overview** - Devrait afficher les dernières projections
- ✅ **Calculator** - Calculateur de rentabilité mining
- ✅ **Results** - Résultats d'analyse financière
- ✅ **Charts** - Visualisations graphiques
- ✅ **Monte Carlo** - Analyse probabiliste
- ✅ **Projects** - Liste des projets/scénarios
- ✅ **Hardware** - Configuration matérielle ASIC
- ✅ **Energy** - Optimisation énergétique
- ✅ **Infrastructure** - Design des installations

Pour chaque section:
1. Cliquer sur l'onglet
2. Vérifier que le contenu se charge sans erreur console
3. Vérifier que l'onglet devient actif (classe `active`)
4. Vérifier que les styles s'appliquent correctement

### 4. VÉRIFICATION DES STYLES HEARST
- **Couleur primaire**: #8afd81 (vert HEARST) doit être utilisée partout
- **Cards/Containers**: Background `#1A1A1A` ou `rgba(26, 26, 26, 0.9)`
- **Borders**: `rgba(138, 253, 129, 0.15)` ou variations
- **Typography**: Fonts, sizes, weights cohérents
- **Responsive**: Grilles qui s'adaptent sur mobile (force `1fr !important`)

### 5. VÉRIFICATION DES FONCTIONNALITÉS SPÉCIFIQUES

#### Section Overview
- ✅ Les 5 cartes de projections s'affichent
- ✅ Le sélecteur "Projection History" fonctionne
- ✅ Les styles inline sont correctement appliqués
- ✅ Le responsive fonctionne (grille 5 colonnes → 1 colonne sur mobile)

#### Section Calculator
- ✅ Le stepper navigation s'affiche
- ✅ Les étapes sont navigables
- ✅ Le panel de résumé est sticky
- ✅ Les formulaires sont fonctionnels

#### Autres sections
- ✅ Chaque section affiche son contenu sans erreur
- ✅ Les fonctions d'initialisation (`initOverview`, `initCalculator`, etc.) sont appelées
- ✅ Pas d'erreurs JavaScript dans la console

### 6. TESTS RESPONSIVE
- ✅ Desktop (> 1024px): Grilles multi-colonnes normales
- ✅ Tablet (768px - 1024px): Adaptation des grilles
- ✅ Mobile (< 768px): 
  - Grilles forcées en 1 colonne
  - Flex containers en colonne
  - Padding adapté
  - Pas de scroll horizontal

### 7. VÉRIFICATION DES ERREURS
- ✅ Console JavaScript: Aucune erreur au chargement
- ✅ Console JavaScript: Aucune erreur lors de la navigation
- ✅ Pas d'erreurs 404 pour les imports dynamiques
- ✅ Les styles CSS sont appliqués (pas de styles manquants)

## ACTIONS ATTENDUES

### Si tout fonctionne ✅
1. Confirmer que la page Projections affiche correctement le code recodé
2. Lister les sections qui fonctionnent
3. Confirmer que les styles HEARST sont appliqués
4. Confirmer que le responsive fonctionne

### Si problème détecté ❌
1. Identifier le problème exact (console error, style manquant, fonction non appelée, etc.)
2. Localiser le fichier et la ligne concernée
3. Proposer une correction immédiate
4. Tester la correction

## FICHIERS À EXAMINER EN PRIORITÉ

```
frontend/js/projections.js              - Navigation entre sections
frontend/css/projections.css            - Styles HEARST
frontend/js/views/projects-sections.js  - Contenu de toutes les sections
frontend/js/views/projects.js           - Vue principale Projects
frontend/js/app.js                      - Initialisation (ligne 1342-1362)
frontend/index.html                     - Structure HTML
```

## COMMANDES DE TEST

1. **Ouvrir l'application**: Naviguer vers la page dans le navigateur
2. **Ouvrir DevTools**: F12 ou Cmd+Option+I
3. **Aller dans l'onglet Projestions**: Cliquer sur "Projestions" dans la sidebar
4. **Vérifier la console**: Aucune erreur rouge
5. **Tester chaque onglet**: Cliquer sur tous les onglets de navigation
6. **Tester le responsive**: Redimensionner la fenêtre ou utiliser DevTools mobile

## CRITÈRES DE SUCCÈS

✅ La page Projections charge sans erreur  
✅ La section Overview s'affiche par défaut  
✅ Toutes les sections sont navigables  
✅ Les styles HEARST (#8afd81) sont appliqués  
✅ Le responsive fonctionne sur mobile  
✅ Aucune erreur JavaScript dans la console  
✅ Les fonctionnalités spécifiques fonctionnent  

---

**IMPORTANT**: Claude, concentre-toi UNIQUEMENT sur la page Projections. Ne modifie rien d'autre dans l'application. L'objectif est de VERIFIER que le code recodé s'affiche correctement.


