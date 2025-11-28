# 🔧 CLARIFICATION : Configuration API Hearst - Ports 6001 vs 4001

## 📍 Architecture Actuelle

### Port 6001 (Frontend Next.js)
- **Service** : Serveur Next.js (Frontend + API Routes)
- **Rôle** : Fait les appels HTTP vers l'API Hearst externe
- **Configuration** : Variables dans `.env.local` lues par Next.js

### Port 4001 (API Hearst locale - si existe)
- **Service** : Serveur API Hearst local (à démarrer séparément)
- **Rôle** : API Hearst qui tourne en local
- **Configuration** : Nécessite un serveur séparé à démarrer

---

## ✅ Où Configurer le Token ?

### Le token `HEARST_API_TOKEN` doit être configuré dans `.env.local`

**Pourquoi ?**
- Le serveur Next.js (port 6001) lit les variables d'environnement depuis `.env.local`
- C'est Next.js qui fait les appels à l'API Hearst (via `app/api/cockpit/route.ts`)
- Le token est utilisé dans les headers des requêtes HTTP

---

## 🔄 Deux Scénarios Possibles

### Scénario 1 : API Hearst Production (actuel)

**Configuration dans `.env.local` :**
```env
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=3L0XE30A8KZ9O0R21CUV5EYJC
```

**Comment ça marche :**
1. Next.js (port 6001) lit `.env.local`
2. Next.js fait des appels HTTP vers `https://api.hearstcorporation.io`
3. Le token est envoyé dans le header `x-api-token`

---

### Scénario 2 : API Hearst Locale sur Port 4001

**Si vous avez un serveur API Hearst local à démarrer :**

1. **Démarrer le serveur API Hearst sur le port 4001** (commande à déterminer)

2. **Configuration dans `.env.local` :**
```env
HEARST_API_URL=http://localhost:4001
HEARST_API_TOKEN=3L0XE30A8KZ9O0R21CUV5EYJC
```

**Comment ça marche :**
1. Serveur API Hearst local tourne sur port 4001
2. Next.js (port 6001) lit `.env.local`
3. Next.js fait des appels HTTP vers `http://localhost:4001`
4. Le token est envoyé dans le header `x-api-token`

---

## 📊 État Actuel

### Configuration Actuelle dans `.env.local` :
```env
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=3L0XE30A8KZ9O0R21CUV5EYJC
```

### Ports Actifs :
- ✅ **Port 6001** : Next.js (Frontend + API Routes) - **ACTIF**
- ❌ **Port 4001** : API Hearst locale - **NON ACTIF** (aucun serveur)

---

## 🎯 Réponse à votre Question

**Le token est configuré dans `.env.local` qui est lu par Next.js sur le port 6001.**

**Mais :**
- Si vous voulez utiliser l'API Hearst **production** → Gardez `HEARST_API_URL=https://api.hearstcorporation.io`
- Si vous voulez utiliser l'API Hearst **locale** sur port 4001 → Changez en `HEARST_API_URL=http://localhost:4001` et démarrez le serveur local

---

## ❓ Question pour Vous

**Avez-vous un serveur API Hearst local à démarrer sur le port 4001 ?**

- Si **OUI** → Il faut :
  1. Trouver comment démarrer ce serveur
  2. Changer `HEARST_API_URL=http://localhost:4001` dans `.env.local`
  3. Redémarrer Next.js (port 6001)

- Si **NON** → Gardez la configuration actuelle avec `https://api.hearstcorporation.io`

---

## 📝 Résumé

| Élément | Port | Rôle | Configuration |
|---------|------|------|---------------|
| **Next.js** | 6001 | Fait les appels API | Lit `.env.local` |
| **API Hearst locale** | 4001 | Reçoit les appels | À démarrer séparément |
| **Token** | - | Authentification | Dans `.env.local` (lu par Next.js) |

**Le token est toujours configuré dans `.env.local` (lu par Next.js sur 6001), mais l'URL peut pointer vers production ou local (4001).**


