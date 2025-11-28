# 🔧 Désactiver le Mode Local - Utiliser les Vraies APIs

## 🔍 Problème Identifié

L'application détecte automatiquement qu'elle tourne en local (`localhost:6001`) et active le **MODE LOCAL** qui utilise des données mockées au lieu de faire de vrais appels API.

### Messages dans la console :
```
[Header] 🔧 MODE LOCAL - Utilisation de données mockées
[Header] 🔧 MODE LOCAL - Utilisation de prix crypto mockés
[HomeOverview] 🔧 MODE LOCAL - Utilisation de données mockées
```

---

## 📍 Où est la Détection du Mode Local ?

### 1. `components/Header.tsx` (lignes 53-57)
```typescript
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

### 2. `components/home/HomeOverview.tsx` (lignes 97-101)
```typescript
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

---

## ✅ Solutions pour Désactiver le Mode Local

### Solution 1 : Utiliser une Variable d'Environnement (RECOMMANDÉ)

**Modifier le code pour vérifier une variable d'environnement :**

#### Dans `components/Header.tsx` :

**Avant (lignes 53-57) :**
```typescript
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

**Après :**
```typescript
// Vérifier si on doit forcer l'utilisation des vraies APIs
const forceRealAPI = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
const isLocal = !forceRealAPI && typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

#### Dans `components/home/HomeOverview.tsx` :

**Même modification :**
```typescript
const forceRealAPI = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
const isLocal = !forceRealAPI && typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

#### Dans `.env.local` :

**Ajouter :**
```env
NEXT_PUBLIC_USE_REAL_API=true
```

---

### Solution 2 : Désactiver Complètement le Mode Local

**Modifier directement la condition `isLocal` :**

#### Dans `components/Header.tsx` et `components/home/HomeOverview.tsx` :

**Remplacer :**
```typescript
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

**Par :**
```typescript
const isLocal = false // Désactiver le mode local
```

---

### Solution 3 : Utiliser un Domaine Local Différent

**Modifier `/etc/hosts` pour utiliser un domaine :**

```bash
# Ajouter dans /etc/hosts
127.0.0.1 hearstai.local
```

**Puis accéder à :**
```
http://hearstai.local:6001
```

Le code ne détectera plus `localhost` et utilisera les vraies APIs.

---

## 🎯 Solution Recommandée : Variable d'Environnement

### Avantages :
- ✅ Contrôle facile via `.env.local`
- ✅ Pas besoin de modifier le code à chaque fois
- ✅ Peut être activé/désactivé selon les besoins
- ✅ Pas de modification de `/etc/hosts`

### Étapes :

1. **Ajouter dans `.env.local` :**
```env
NEXT_PUBLIC_USE_REAL_API=true
```

2. **Modifier `components/Header.tsx` (ligne 53) :**
```typescript
const forceRealAPI = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
const isLocal = !forceRealAPI && typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

3. **Modifier `components/home/HomeOverview.tsx` (ligne 97) :**
```typescript
const forceRealAPI = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'
const isLocal = !forceRealAPI && typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.port === '6001'
)
```

4. **Redémarrer Next.js :**
```bash
# Arrêter (Ctrl+C)
# Redémarrer
./start-local-all.sh
```

---

## 📊 Fichiers à Modifier

### Fichiers avec détection du mode local :

1. ✅ `components/Header.tsx` (2 endroits)
   - Ligne 53 : Stats
   - Ligne 110 : Prix crypto

2. ✅ `components/home/HomeOverview.tsx` (1 endroit)
   - Ligne 97 : Stats

3. ⚠️ `components/MyEarthAI.tsx` (1 endroit)
   - Ligne 187 : Données MyEarthAI

4. ⚠️ `app/auth/signin/page.tsx` (1 endroit)
   - Ligne 31 : Redirection automatique

---

## 🔄 Après Modification

### Vérification :

1. **Ouvrir la console du navigateur**
2. **Rafraîchir la page**
3. **Vérifier qu'il n'y a plus de messages "MODE LOCAL"**
4. **Vérifier que les données sont réelles** (pas mockées)

### Tests à faire :

```bash
# Vérifier que les APIs sont appelées
# Ouvrir DevTools → Network
# Vérifier les appels vers /api/stats, /api/cockpit, etc.
```

---

## 📝 Résumé

**Pour utiliser les vraies APIs en local :**

1. ✅ Ajouter `NEXT_PUBLIC_USE_REAL_API=true` dans `.env.local`
2. ✅ Modifier la détection `isLocal` dans les composants
3. ✅ Redémarrer Next.js

**Ou simplement :**
- Modifier `const isLocal = false` dans les composants concernés

---

**Date** : 2025-11-28
**Version** : 1.0.0


