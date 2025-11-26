# 🔧 Configuration Vercel - Base de données

## ✅ Configuration correcte

### Variables nécessaires sur Vercel

**UNE SEULE variable est nécessaire :**

```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=...
```

### ❌ Variables NON nécessaires

Tu peux supprimer ces variables (elles ne sont pas utilisées par l'application) :

- `POSTGRES_URL` - Non nécessaire
- `PRISMA_DATABASE_URL` - Non nécessaire (c'est la même chose que DATABASE_URL)
- Toutes les URLs Supabase - Non nécessaires

## 📊 Comment ça fonctionne

### Avec Prisma Accelerate

1. **L'application utilise uniquement `DATABASE_URL`**
   - Format : `prisma+postgres://accelerate.prisma-data.net/?api_key=...`
   - Prisma Accelerate gère automatiquement la connexion à PostgreSQL

2. **Prisma Accelerate agit comme un proxy**
   - Il se connecte à la base PostgreSQL réelle
   - Il optimise les requêtes
   - Il gère le pooling de connexions
   - Il fournit des performances améliorées

3. **Pas besoin d'URL PostgreSQL directe**
   - L'application n'a pas besoin de l'URL PostgreSQL directe
   - Prisma Accelerate s'en charge

### URLs PostgreSQL directes (optionnelles)

Les URLs PostgreSQL directes (`postgres://...`) sont utiles uniquement pour :

- **pg_dump** : Export de la base de données
- **pg_restore** : Import de la base de données
- **Outils externes** : DBeaver, pgAdmin, etc.
- **Scripts de migration manuels**

Mais **PAS pour l'application Next.js**.

## ✅ Configuration finale recommandée

### Sur Vercel

**Variables d'environnement nécessaires :**

```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=...
NEXTAUTH_SECRET = ton-secret-here
NEXTAUTH_URL = https://ton-app.vercel.app
DEBANK_ACCESS_KEY = ton-key-here (si utilisé)
```

**Variables à supprimer (si présentes) :**

```
POSTGRES_URL (non nécessaire)
PRISMA_DATABASE_URL (non nécessaire)
Toutes les URLs Supabase (non nécessaires)
```

### Localement (.env.local)

```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=...
NEXTAUTH_SECRET = ton-secret-here
NEXTAUTH_URL = http://localhost:3000
```

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Localement :**
   ```bash
   npm run dev
   # Puis teste la connexion
   ```

2. **Sur Vercel :**
   - Vérifie les logs de déploiement
   - Teste l'application déployée
   - Vérifie que les routes API fonctionnent

## 📝 Notes importantes

- **Prisma Accelerate est gratuit** pour commencer
- **Une seule URL est nécessaire** : `DATABASE_URL` avec Prisma Accelerate
- **Les URLs Supabase peuvent être supprimées** sans problème
- **L'application fonctionne uniquement avec Prisma Accelerate**

## 🆘 En cas de problème

Si tu rencontres des erreurs de connexion :

1. Vérifie que `DATABASE_URL` utilise bien Prisma Accelerate
2. Vérifie que Prisma Accelerate est activé dans Prisma Data Platform
3. Vérifie que la base de données est bien liée au projet dans Prisma Data Platform




