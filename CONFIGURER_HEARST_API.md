# 🔑 Configuration HEARST_API_TOKEN

## ⚠️ Problème Actuel

L'API Cockpit retourne des données vides car `HEARST_API_TOKEN` n'est pas configuré.

## ✅ Solution

### 1. Obtenir votre Token API

Vous devez obtenir votre token API depuis votre compte Hearst. Le token devrait ressembler à :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Ajouter dans `.env.local`

J'ai déjà ajouté les lignes dans votre `.env.local`. Il vous suffit de remplir le token :

```bash
# Backend Hearst API
HEARST_API_URL=https://api.hearstcorporation.io
HEARST_API_TOKEN=votre_token_ici
```

### 3. Redémarrer le serveur

Après avoir ajouté le token, redémarrez le serveur :

```bash
# Arrêter les serveurs
pkill -f "next dev"
pkill -f "node.*server.js"

# Redémarrer
./start-local-all.sh
```

## 🧪 Tester la Connexion

Une fois le token configuré, testez la connexion :

```bash
npm run test:cockpit-backend
```

Ou manuellement :

```bash
curl http://localhost:6001/api/cockpit
```

Vous devriez voir des données au lieu de zéros.

## 📝 Où Trouver le Token ?

Le token `HEARST_API_TOKEN` devrait être disponible :
1. Dans votre dashboard Hearst
2. Dans les variables d'environnement Vercel (si déjà configuré en production)
3. Dans votre documentation API Hearst

## ⚠️ Important

- Ne commitez **JAMAIS** le token dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- Utilisez le même token que celui configuré sur Vercel pour la cohérence


