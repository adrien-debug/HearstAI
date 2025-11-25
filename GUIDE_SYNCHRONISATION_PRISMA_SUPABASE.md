# 🔄 Guide Complet : Synchronisation Prisma ↔ Supabase

## 🎯 Vue d'ensemble

Ce guide couvre tous les aspects de la synchronisation entre Prisma et Supabase pour le projet HearstAI.

## 📚 Table des matières

1. [Concepts de base](#concepts-de-base)
2. [Configuration initiale](#configuration-initiale)
3. [Synchronisation du schéma](#synchronisation-du-schéma)
4. [Migrations](#migrations)
5. [Monitoring et santé](#monitoring-et-santé)
6. [Dépannage](#dépannage)
7. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎓 Concepts de base

### Prisma vs Supabase

- **Prisma** : ORM (Object-Relational Mapping) qui gère le schéma et les requêtes
- **Supabase** : Base de données PostgreSQL hébergée
- **Synchronisation** : Alignement du schéma Prisma avec la structure réelle de Supabase

### Types de synchronisation

1. **`prisma db push`** : Synchronise rapidement (développement)
2. **`prisma migrate dev`** : Crée et applique des migrations (recommandé)
3. **`prisma migrate deploy`** : Applique les migrations en production

---

## ⚙️ Configuration initiale

### 1. Variables d'environnement

Crée ou mets à jour `.env.local` :

```bash
# URL Supabase directe
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# OU URL Prisma Accelerate (recommandé)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=xxx"
```

### 2. Vérifier la connexion

```bash
# Test rapide
node scripts/check-db-health.js

# Ou avec Prisma CLI
npx prisma db pull
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

---

## 🔄 Synchronisation du schéma

### Méthode 1 : Vérification automatique

```bash
# Vérifie l'état de synchronisation
node scripts/sync-prisma-supabase.js check
```

Ce script vérifie :
- ✅ Connexion à la base
- ✅ Existence de toutes les tables
- ✅ Intégrité des relations
- ✅ Génère un rapport JSON

### Méthode 2 : Synchronisation rapide (dev)

```bash
# Synchronise le schéma avec la base (ATTENTION: peut perdre des données)
node scripts/sync-prisma-supabase.js sync
```

**⚠️ Utilise uniquement en développement !**

### Méthode 3 : Migration sécurisée

```bash
# Migration avec backup automatique
node scripts/migrate-safe.js dev
```

Options :
- `dev` : Crée une nouvelle migration
- `deploy` : Applique les migrations existantes (production)
- `push` : Push direct (dev uniquement)

---

## 📦 Migrations

### Créer une migration

```bash
# 1. Modifie prisma/schema.prisma
# 2. Crée la migration
npx prisma migrate dev --name nom_de_la_migration

# Ou avec le script sécurisé
node scripts/migrate-safe.js dev
```

### Appliquer les migrations

```bash
# En développement
npx prisma migrate dev

# En production
npx prisma migrate deploy

# Avec backup automatique
node scripts/migrate-safe.js deploy
```

### Voir l'historique

```bash
# Liste les migrations
ls prisma/migrations/

# Voir le statut
npx prisma migrate status
```

---

## 🏥 Monitoring et santé

### Vérification complète

```bash
# Vérifie la santé complète de la base
node scripts/check-db-health.js
```

Ce script vérifie :
- 🔌 Connexion
- ⚡ Performances des requêtes
- 🔍 Intégrité des données
- 📊 Statistiques

### Rapport de synchronisation

```bash
# Génère un rapport détaillé
node scripts/sync-prisma-supabase.js report
```

Le rapport est sauvegardé dans `prisma-sync-report.json`.

---

## 🔧 Dépannage

### Problème : "Table does not exist"

**Solution :**
```bash
# Vérifie le schéma
node scripts/sync-prisma-supabase.js check

# Synchronise si nécessaire
node scripts/sync-prisma-supabase.js sync
```

### Problème : "Migration failed"

**Solution :**
```bash
# Vérifie l'état
npx prisma migrate status

# Résout les migrations
npx prisma migrate resolve --applied nom_migration

# Réessaie
node scripts/migrate-safe.js deploy
```

### Problème : "Connection timeout"

**Solutions :**
1. Vérifie `DATABASE_URL` dans `.env.local`
2. Vérifie que Supabase est accessible
3. Utilise Prisma Accelerate pour de meilleures performances

### Problème : "Schema drift"

**Solution :**
```bash
# Récupère le schéma actuel de Supabase
npx prisma db pull

# Compare avec schema.prisma
# Applique les changements
npx prisma migrate dev --name fix_drift
```

---

## ✅ Bonnes pratiques

### 1. Toujours faire un backup avant migration

```bash
# Le script migrate-safe.js le fait automatiquement
node scripts/migrate-safe.js dev
```

### 2. Utiliser des migrations en production

```bash
# ❌ Ne jamais utiliser db push en production
# ✅ Toujours utiliser migrate deploy
npx prisma migrate deploy
```

### 3. Vérifier régulièrement la synchronisation

```bash
# Ajoute dans ton workflow CI/CD
node scripts/sync-prisma-supabase.js check
```

### 4. Monitorer les performances

```bash
# Exécute régulièrement
node scripts/check-db-health.js
```

### 5. Utiliser Prisma Accelerate

Pour de meilleures performances en production :
- Connection pooling automatique
- Cache des requêtes
- Monitoring intégré

---

## 📋 Checklist de synchronisation

Avant chaque déploiement :

- [ ] Vérifier la connexion : `node scripts/check-db-health.js`
- [ ] Vérifier la synchronisation : `node scripts/sync-prisma-supabase.js check`
- [ ] Appliquer les migrations : `node scripts/migrate-safe.js deploy`
- [ ] Vérifier l'intégrité : `node scripts/check-db-health.js`
- [ ] Tester l'application : `npm run dev`

---

## 🚀 Workflow recommandé

### Développement

```bash
# 1. Modifie le schéma
vim prisma/schema.prisma

# 2. Synchronise avec backup
node scripts/migrate-safe.js dev

# 3. Vérifie
node scripts/sync-prisma-supabase.js check
```

### Production

```bash
# 1. Vérifie l'état
npx prisma migrate status

# 2. Applique avec backup
node scripts/migrate-safe.js deploy

# 3. Vérifie la santé
node scripts/check-db-health.js
```

---

## 📊 Scripts disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `sync-prisma-supabase.js` | Synchronisation et vérification | `node scripts/sync-prisma-supabase.js check` |
| `check-db-health.js` | Monitoring de la santé | `node scripts/check-db-health.js` |
| `migrate-safe.js` | Migration sécurisée | `node scripts/migrate-safe.js dev` |
| `update-database-url.sh` | Mise à jour DATABASE_URL | `./scripts/update-database-url.sh 'url'` |
| `connect-supabase-to-prisma.sh` | Guide de connexion | `./scripts/connect-supabase-to-prisma.sh` |

---

## 🆘 Support

En cas de problème :

1. Vérifie les logs : `prisma-sync-report.json`
2. Vérifie la santé : `node scripts/check-db-health.js`
3. Consulte la documentation Prisma : https://www.prisma.io/docs
4. Consulte la documentation Supabase : https://supabase.com/docs

---

## 📝 Notes importantes

- ⚠️ **Ne jamais** utiliser `db push` en production
- ✅ **Toujours** utiliser des migrations en production
- 💾 **Toujours** faire un backup avant migration
- 🔍 **Vérifier** régulièrement la synchronisation
- 📊 **Monitorer** les performances

---

**Dernière mise à jour :** 2024


