# 🚀 Appliquer la Migration Google Drive

## Migration Créée

La migration pour le modèle `Document` a été créée dans :
```
prisma/migrations/20250124120000_add_google_drive_documents/migration.sql
```

## Options pour Appliquer la Migration

### Option 1 : Migration Prisma (Recommandé)

Si vous avez `DATABASE_URL` configurée dans votre `.env.local` :

```bash
# Appliquer la migration
npx prisma migrate deploy

# Ou en développement
npx prisma migrate dev
```

### Option 2 : SQL Direct

Si vous préférez exécuter le SQL directement :

```bash
# Avec psql
psql -d votre_database -f prisma/migrations/20250124120000_add_google_drive_documents/migration.sql

# Ou copiez-collez le contenu du fichier dans votre client SQL
```

### Option 3 : Fichier SQL Manuel

Un fichier SQL alternatif est disponible :
```bash
psql -d votre_database < prisma/migrations/manual_add_google_drive_documents.sql
```

## Vérification

Après avoir appliqué la migration, vérifiez que la table existe :

```sql
SELECT * FROM "Document" LIMIT 1;
```

Ou avec Prisma Studio :

```bash
npx prisma studio
```

## Prochaines Étapes

Une fois la migration appliquée :

1. ✅ La table `Document` sera créée
2. ✅ Les index seront en place pour les performances
3. ✅ La relation avec `User` sera configurée
4. ✅ Vous pourrez utiliser l'intégration Google Drive

---

**Note** : Si vous utilisez Supabase ou Vercel Postgres, utilisez leur interface pour exécuter le SQL ou configurez `DATABASE_URL` pour utiliser Prisma migrate.


