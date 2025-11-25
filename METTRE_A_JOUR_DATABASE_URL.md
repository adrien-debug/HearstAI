# 🔧 Mettre à Jour DATABASE_URL avec PRISMA_DATABASE_URL

## ⚠️ Problème Actuel

`DATABASE_URL` pointe actuellement vers **Supabase** :
```
postgresql://postgres.tjakoymdonbylndibedh:...@db.tjakoymdonbylndibedh.supabase.co:6543/postgres
```

Il devrait utiliser **Prisma Accelerate** (optimisé pour la production) :
```
prisma+postgres://accelerate.prisma-data.net/?api_key=...
```

## ✅ Solution : Mettre à Jour DATABASE_URL

### Étape 1 : Récupérer PRISMA_DATABASE_URL

1. Va sur : https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables
2. Trouve **PRISMA_DATABASE_URL** dans la liste
3. Clique sur les **3 points** (⋯) à droite
4. Clique sur **"View"**
5. **Copie** toute la valeur (elle commence par `prisma+postgres://accelerate.prisma-data.net/`)

### Étape 2 : Mettre à Jour DATABASE_URL

1. Trouve **DATABASE_URL** dans la liste
2. Pour chaque environnement (Production, Preview, Development) :
   - Clique sur les **3 points** (⋯) à droite de DATABASE_URL
   - Clique sur **"Edit"**
   - **Supprime** l'ancienne valeur (Supabase)
   - **Colle** la valeur de PRISMA_DATABASE_URL que tu as copiée
   - Clique sur **"Save"**

### Étape 3 : Vérifier

Après avoir mis à jour les 3 environnements, vérifie que :
- DATABASE_URL commence par `prisma+postgres://accelerate.prisma-data.net/`
- Pas de `supabase.co` dans l'URL

### Étape 4 : Redéployer

Une fois mis à jour, Vercel redéploiera automatiquement, ou tu peux redéployer manuellement :
```bash
vercel --prod
```

## 📋 Valeur à Utiliser

La valeur de `PRISMA_DATABASE_URL` devrait ressembler à :
```
prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ Avantages de Prisma Accelerate

- ✅ **Optimisé pour la production**
- ✅ **Cache intégré** pour de meilleures performances
- ✅ **Connection pooling** automatique
- ✅ **Meilleure gestion des connexions**
- ✅ **Compatible avec Prisma**

## 🔍 Vérification

Après la mise à jour, tu peux vérifier que tout fonctionne :
1. Visite : `/api/init-user` (pour créer l'utilisateur)
2. Visite : `/auth/signin` (pour te connecter)
3. Email : `admin@hearst.ai`
4. Mot de passe : n'importe quel mot de passe


