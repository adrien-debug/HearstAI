# 📊 ANALYSE : Configuration API Hearst - Port 4001

## 🔍 État Actuel de la Configuration

### Configuration Actuelle

**URL API Hearst configurée :**
- **Valeur par défaut** : `https://api.hearstcorporation.io`
- **Variable d'environnement** : `HEARST_API_URL`
- **Token d'authentification** : `HEARST_API_TOKEN`

### Où est utilisée l'API Hearst ?

#### 1. Route API Cockpit (`app/api/cockpit/route.ts`)

```typescript
// Ligne 73
const hearstApiUrl = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
const apiToken = process.env.HEARST_API_TOKEN
```

**Endpoints appelés :**
- `GET ${hearstApiUrl}/api/mining-operations/customers?limit=1000&pageNumber=1`
- `GET ${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/chart`
- `GET ${hearstApiUrl}/api/mining-operations/customers/${userId}/hashrate/statistics`

#### 2. Scripts de test (`scripts/test-cockpit-backend.js`)

```javascript
const HEARST_API_URL = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
const HEARST_API_TOKEN = process.env.HEARST_API_TOKEN
```

---

## ⚠️ Problème Identifié

### Port 4001 non configuré

**Situation :**
- L'API Hearst est actuellement configurée pour utiliser l'URL de production : `https://api.hearstcorporation.io`
- **Aucune référence au port 4001** n'a été trouvée dans le code
- Le port 4001 n'est **pas utilisé** actuellement

**Vérifications effectuées :**
- ✅ Recherche dans tout le codebase : **Aucune référence au port 4001**
- ✅ Test de connexion sur `http://localhost:4001` : **Aucun serveur en écoute**
- ✅ Vérification des processus : **Aucun processus sur le port 4001**

---

## 📋 Configuration Actuelle des Ports

### Ports utilisés actuellement :

| Port | Service | Statut |
|------|---------|--------|
| **4000** | Backend Express | ✅ **Actif** |
| **6001** | Frontend Next.js | ✅ **Actif** |
| **4001** | API Hearst (local) | ❌ **Non configuré** |

---

## 🔧 Ce qui devrait être configuré

### Pour utiliser l'API Hearst en local sur le port 4001 :

**Option 1 : API Hearst locale**
```env
HEARST_API_URL=http://localhost:4001
HEARST_API_TOKEN=votre_token_ici
```

**Option 2 : API Hearst production (actuel)**
```env
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=votre_token_ici
```

---

## 📍 Où la configuration est utilisée

### Fichiers qui utilisent `HEARST_API_URL` :

1. **`app/api/cockpit/route.ts`** (ligne 73)
   - Fonction : `fetchGlobalHashrateAndMiners()`
   - Utilisation : Récupération des données de hashrate et miners

2. **`scripts/test-cockpit-backend.js`** (ligne 10)
   - Fonction : Tests de connexion à l'API Hearst
   - Utilisation : Vérification de la configuration

3. **`scripts/test-all.js`** (ligne 54-55)
   - Fonction : Tests globaux
   - Utilisation : Vérification des variables d'environnement

---

## 🔍 Analyse du Code Actuel

### Route Cockpit (`app/api/cockpit/route.ts`)

**Fonction `fetchGlobalHashrateAndMiners()` :**
```typescript
// Ligne 72-73
const hearstApiUrl = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
const apiToken = process.env.HEARST_API_TOKEN
```

**Comportement actuel :**
- Si `HEARST_API_URL` n'est pas défini → utilise `https://api.hearstcorporation.io`
- Si `HEARST_API_TOKEN` n'est pas défini → retourne des données vides (0)

**Endpoints appelés :**
1. `/api/mining-operations/customers` - Liste des clients
2. `/api/mining-operations/customers/{id}/hashrate/chart` - Graphique hashrate
3. `/api/mining-operations/customers/{id}/hashrate/statistics` - Statistiques

---

## 📊 État des Variables d'Environnement

### Variables requises pour l'API Hearst :

| Variable | Statut | Valeur actuelle |
|----------|--------|-----------------|
| `HEARST_API_URL` | ⚠️ **Non vérifié** | `https://api.hearstcorporation.io` (défaut) |
| `HEARST_API_TOKEN` | ⚠️ **Non vérifié** | Non défini (retourne 0) |

**Note :** Le fichier `.env.local` est filtré par `.gitignore`, donc je ne peux pas vérifier son contenu directement.

---

## 🎯 Recommandations

### Pour configurer l'API Hearst sur le port 4001 :

1. **Vérifier si un serveur API Hearst local existe**
   - Chercher dans la documentation du projet
   - Vérifier s'il y a un serveur séparé à démarrer

2. **Si un serveur local existe :**
   ```env
   # Dans .env.local
   HEARST_API_URL=http://localhost:4001
   HEARST_API_TOKEN=votre_token_local
   ```

3. **Si pas de serveur local :**
   - Utiliser l'API de production : `https://api.hearstcorporation.io`
   - Configurer uniquement le token : `HEARST_API_TOKEN`

---

## 🔄 Actions Nécessaires (à faire manuellement)

### 1. Vérifier la configuration actuelle

```bash
# Vérifier les variables d'environnement
grep HEARST_API .env.local
```

### 2. Si un serveur local doit tourner sur 4001

```bash
# Vérifier si un serveur est en cours d'exécution
lsof -i :4001

# Démarrer le serveur API Hearst local (si disponible)
# (commande à déterminer selon votre setup)
```

### 3. Configurer les variables d'environnement

```bash
# Éditer .env.local
nano .env.local

# Ajouter ou modifier :
HEARST_API_URL=http://localhost:4001  # Si local
# OU
HEARST_API_URL=https://api.hearstcorporation.io  # Si production

HEARST_API_TOKEN=votre_token_ici
```

### 4. Redémarrer les serveurs

```bash
# Arrêter les serveurs actuels
pkill -f "next dev"
pkill -f "node.*server.js"

# Redémarrer
./start-local-all.sh
```

---

## 📝 Résumé

### État Actuel :
- ✅ Code prêt à utiliser `HEARST_API_URL` depuis les variables d'environnement
- ✅ Fallback vers `https://api.hearstcorporation.io` si non configuré
- ❌ **Port 4001 non référencé dans le code**
- ❌ **Aucun serveur en écoute sur le port 4001**

### Pour activer le port 4001 :
1. Démarrer le serveur API Hearst local sur le port 4001 (si disponible)
2. Configurer `HEARST_API_URL=http://localhost:4001` dans `.env.local`
3. Configurer `HEARST_API_TOKEN` avec le token approprié
4. Redémarrer les serveurs

---

**Date d'analyse** : 2025-11-28
**Version** : 1.0.0


