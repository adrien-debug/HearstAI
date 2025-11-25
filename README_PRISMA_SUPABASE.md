# 🔄 Outils Prisma/Supabase - Guide Rapide

## 🚀 Démarrage rapide

### Menu interactif (recommandé)

```bash
npm run db:tools
```

Ou directement :

```bash
node scripts/prisma-tools.js
```

## 📋 Scripts disponibles

### Synchronisation

```bash
# Vérifier l'état de synchronisation
npm run db:sync

# Synchroniser le schéma (dev uniquement)
npm run db:sync:force
```

### Monitoring

```bash
# Vérifier la santé de la base
npm run db:health
```

### Migrations

```bash
# Migration sécurisée (dev)
npm run db:migrate:safe

# Migration sécurisée (production)
npm run db:migrate:deploy

# Migration standard
npm run db:migrate
```

## 🛠️ Scripts individuels

| Script | Description |
|--------|-------------|
| `sync-prisma-supabase.js` | Vérification et synchronisation |
| `check-db-health.js` | Monitoring de la santé |
| `migrate-safe.js` | Migration avec backup automatique |
| `prisma-tools.js` | Menu interactif |

## 📚 Documentation complète

Consulte le guide complet : [GUIDE_SYNCHRONISATION_PRISMA_SUPABASE.md](./GUIDE_SYNCHRONISATION_PRISMA_SUPABASE.md)

## ⚡ Commandes rapides

```bash
# Vérifier la connexion
npm run db:health

# Vérifier la synchronisation
npm run db:sync

# Créer une migration
npm run db:migrate:safe

# Ouvrir Prisma Studio
npm run db:studio
```

## 🔍 Exemples d'utilisation

### Vérifier avant déploiement

```bash
npm run db:health && npm run db:sync
```

### Migration en production

```bash
npm run db:migrate:deploy
```

### Synchronisation rapide (dev)

```bash
npm run db:sync:force
```

---

**💡 Astuce :** Utilise `npm run db:tools` pour accéder à tous les outils via un menu interactif !


