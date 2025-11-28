# ✅ Correction du problème d'images sur Vercel

## 🔍 Problème identifié

Les photos ne se chargeaient pas sur Vercel car :
- Le système de fichiers Vercel est **en lecture seule**
- Les fichiers dans `public/uploads/` **ne persistent pas** entre les déploiements
- Chaque nouveau déploiement efface les fichiers uploadés

## ✅ Solution implémentée

Migration vers **Supabase Storage** pour un stockage persistant et accessible.

## 🔧 Configuration requise

### Variables d'environnement à ajouter

**Sur Vercel** (Settings > Environment Variables) et dans `.env.local` :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qwldfqlhnxukxczyumje.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-ici
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bGRmcWxobnh1a3hjenl1bWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjg5MTEsImV4cCI6MjA3OTYwNDkxMX0.uROfIKVKhbt28zT0IsenMPPxVNFSHhL7IHYhgROW98k
```

### ⚠️ Important : Récupérer la Service Role Key

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez la **service_role key** (⚠️ gardez-la secrète !)
5. Ajoutez-la comme `SUPABASE_SERVICE_ROLE_KEY` sur Vercel

## 📦 Ce qui a été fait

✅ **Installation** : `@supabase/supabase-js` installé  
✅ **Buckets créés** : `project-images` et `portfolio-images` dans Supabase Storage  
✅ **Client Supabase** : `lib/supabase.ts` créé  
✅ **API Projects** : `app/api/projects/route.ts` mis à jour pour utiliser Supabase Storage  
✅ **API Portfolio** : `app/api/portfolio/upload/route.ts` mis à jour pour utiliser Supabase Storage  
✅ **Next.js Config** : `next.config.js` mis à jour pour supporter les images Supabase  

## 🚀 Prochaines étapes

1. **Ajouter les variables d'environnement sur Vercel** :
   - Allez sur votre projet Vercel
   - Settings > Environment Variables
   - Ajoutez les 3 variables ci-dessus

2. **Redéployer sur Vercel** :
   - Les nouvelles variables seront prises en compte au prochain déploiement

3. **Tester** :
   - Upload une nouvelle image de projet
   - Vérifiez qu'elle s'affiche correctement
   - Vérifiez dans Supabase Storage que le fichier est présent

## 📊 Base de données

✅ **Base de données Supabase connectée** :
- URL : `https://qwldfqlhnxukxczyumje.supabase.co`
- Tables : User, Project, PortfolioSection, PortfolioImage, etc.
- Toutes les tables sont présentes et fonctionnelles

## 🔗 Liens utiles

- **Supabase Dashboard** : https://app.supabase.com
- **Storage Buckets** : https://app.supabase.com/project/qwldfqlhnxukxczyumje/storage/buckets
- **Documentation** : Voir `SUPABASE_STORAGE_SETUP.md`

## ✅ Résultat attendu

Après configuration :
- ✅ Les images uploadées sont stockées dans Supabase Storage
- ✅ Les images persistent entre les déploiements
- ✅ Les images sont accessibles via des URLs publiques Supabase
- ✅ Les images se chargent correctement sur Vercel



