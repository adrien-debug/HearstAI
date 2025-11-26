# Configuration de Navigation

Ce fichier permet de masquer temporairement les pages en développement pour ne déployer en production que ce qui fonctionne.

## Fichier de configuration

Le fichier `lib/navigation-config.ts` contient la configuration de visibilité de tous les éléments de navigation.

## Comment masquer une page

Pour masquer une page temporairement, modifiez le fichier `lib/navigation-config.ts` :

```typescript
// Exemple : Masquer "Business Dev"
strategie: {
  enabled: true,
  items: {
    calculator: { enabled: true },
    'business-dev': { enabled: false }, // ← Changez à false pour masquer
    partnership: { enabled: false },
  },
},
```

## Comment masquer une section entière

Pour masquer toute une section :

```typescript
// Exemple : Masquer toute la section Management
management: {
  enabled: false, // ← Changez à false pour masquer toute la section
  items: {
    // ...
  },
},
```

## Pages actuellement masquées

Par défaut, les pages suivantes sont masquées (en développement) :
- **Business Dev** (`/business-dev`)
- **Partnership** (`/partnership`)
- **Portfolio** (`/portfolio`)

## Activer une page

Quand une page est prête, changez simplement `enabled: false` à `enabled: true` dans `lib/navigation-config.ts`.

## Notes

- Les pages masquées ne sont pas supprimées, juste invisibles dans le menu
- Les URLs directes vers les pages masquées fonctionnent toujours (pour les tests)
- Pour masquer complètement l'accès, il faudrait ajouter une vérification dans les pages elles-mêmes

