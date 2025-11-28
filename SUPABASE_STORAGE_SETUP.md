# 📸 Configuration Supabase Storage pour les Images

## ✅ Problème résolu

Les images ne se chargeaient pas sur Vercel car le système de fichiers est en lecture seule. Les fichiers uploadés dans `public/uploads/` ne persistent pas entre les déploiements.

**Solution** : Migration vers Supabase Storage pour un stockage persistant et accessible.

## 🔧 Configuration requise

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` (local) et sur Vercel (production) :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qwldfqlhnxukxczyumje.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-ici
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
```

### Où trouver les clés Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gardez-la secrète !)

## 📦 Buckets créés

Deux buckets ont été créés dans Supabase Storage :

1. **`project-images`** : Pour les images des projets
   - Public : ✅ Oui
   - Taille max : 5 MB
   - Types autorisés : JPEG, PNG, WebP, GIF

2. **`portfolio-images`** : Pour les images du portfolio
   - Public : ✅ Oui
   - Taille max : 5 MB
   - Types autorisés : JPEG, PNG, WebP, GIF

## 🔄 Changements effectués

### 1. Installation de Supabase
- ✅ `@supabase/supabase-js` installé

### 2. Client Supabase créé
- ✅ `lib/supabase.ts` : Client Supabase configuré

### 3. APIs mises à jour
- ✅ `app/api/projects/route.ts` : Utilise maintenant Supabase Storage
- ✅ `app/api/portfolio/upload/route.ts` : Utilise maintenant Supabase Storage

### 4. Configuration Next.js
- ✅ `next.config.js` : Support des images Supabase Storage ajouté

## 🚀 Comment ça fonctionne maintenant

### Upload d'image de projet

1. L'utilisateur upload une image via le formulaire
2. L'image est envoyée à `/api/projects` (POST)
3. L'API upload l'image vers Supabase Storage : `project-images/projects/{userId}/{filename}`
4. L'URL publique Supabase est stockée dans la base de données
5. L'image est accessible via l'URL Supabase publique

### Upload d'image de portfolio

1. L'utilisateur upload une image via le formulaire
2. L'image est envoyée à `/api/portfolio/upload` (POST)
3. L'API upload l'image vers Supabase Storage : `portfolio-images/portfolio/{userId}/{filename}`
4. L'URL publique Supabase est stockée dans la base de données
5. L'image est accessible via l'URL Supabase publique

## 📝 Format des URLs

Les images sont maintenant stockées avec des URLs Supabase :

```
https://qwldfqlhnxukxczyumje.supabase.co/storage/v1/object/public/project-images/projects/{userId}/{filename}
```

ou

```
https://qwldfqlhnxukxczyumje.supabase.co/storage/v1/object/public/portfolio-images/portfolio/{userId}/{filename}
```

## ✅ Avantages

- ✅ **Persistance** : Les images persistent entre les déploiements
- ✅ **Performance** : CDN Supabase pour un chargement rapide
- ✅ **Scalabilité** : Pas de limite de stockage (selon votre plan)
- ✅ **Sécurité** : Contrôle d'accès via Supabase RLS
- ✅ **Compatibilité** : Fonctionne en local ET en production

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Vérifier les buckets** :
   - Allez sur Supabase Dashboard > Storage
   - Vous devriez voir `project-images` et `portfolio-images`

2. **Tester l'upload** :
   - Créez un nouveau projet avec une image
   - Vérifiez que l'image s'affiche correctement
   - Vérifiez dans Supabase Storage que le fichier est présent

3. **Vérifier les URLs** :
   - Les URLs des images doivent commencer par `https://qwldfqlhnxukxczyumje.supabase.co/storage/...`

## 🆘 Dépannage

### Les images ne se chargent pas

1. Vérifiez que les variables d'environnement sont bien configurées
2. Vérifiez que les buckets existent dans Supabase Storage
3. Vérifiez que les buckets sont publics (Settings > Public)
4. Vérifiez les logs de l'API pour voir les erreurs

### Erreur "Missing Supabase URL"

- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est défini
- Redémarrez le serveur de développement après avoir ajouté les variables

### Erreur "Missing Supabase key"

- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est défini
- ⚠️ Ne partagez JAMAIS cette clé publiquement !

## 📚 Documentation

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/storage)



