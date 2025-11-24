# 🔧 Résoudre le Conflit DATABASE_URL sur Vercel

## ⚠️ Problème

Lors de la connexion de Vercel Postgres, tu vois cette erreur :
```
This project already has an existing environment variable with name DATABASE_URL 
in one of the chosen environments
```

Cela signifie que `DATABASE_URL` existe déjà avec la valeur SQLite (`file:./prisma/storage/hearstai.db`).

## ✅ Solution : Supprimer l'Ancienne Variable

### Étape 1 : Annuler le Modal

Dans le modal "Configure hearstai", clique sur **"Cancel"**.

### Étape 2 : Aller dans Environment Variables

1. Va dans **Settings** → **Environment Variables**
2. Ou directement : https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables

### Étape 3 : Supprimer DATABASE_URL

1. Trouve `DATABASE_URL` dans la liste des variables
2. Pour chaque environnement (Production, Preview, Development) :
   - Clique sur les **3 points** (⋯) à droite de la variable
   - Clique sur **"Delete"**
   - Confirme la suppression

### Étape 4 : Reconnecter Postgres

1. Retourne dans **Storage** → **Connect to Database**
2. Sélectionne **"prisma-postgres-cyan-chair"**
3. Dans le modal "Configure hearstai" :
   - **Environments** : Coche Development, Preview et Production ✅
   - **Custom Prefix** : Laisse **vide** (ou utilise "DATABASE" si vide ne fonctionne pas)
     - Si vide : Vercel créera `DATABASE_URL`
     - Si "DATABASE" : Vercel créera `DATABASE_URL` aussi
4. Clique sur **"Connect"**

### Étape 5 : Vérifier

Après la connexion, vérifie que `DATABASE_URL` pointe vers PostgreSQL :
- Va dans **Settings** → **Environment Variables**
- `DATABASE_URL` devrait commencer par `postgresql://` (pas `file:./`)

## 🔄 Alternative : Via Vercel CLI

Si tu préfères utiliser la ligne de commande :

```bash
# Supprimer DATABASE_URL pour chaque environnement
vercel env rm DATABASE_URL production --yes
vercel env rm DATABASE_URL preview --yes
vercel env rm DATABASE_URL development --yes

# Ensuite, connecte Postgres via le dashboard
# Vercel créera automatiquement DATABASE_URL avec la bonne valeur
```

## ✅ Après la Configuration

1. **Redéploie** :
   ```bash
   vercel --prod
   ```

2. **Initialise l'utilisateur** :
   Visite : `https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app/api/init-user`

3. **Teste la connexion** :
   - Email : `admin@hearst.ai`
   - Mot de passe : n'importe quel mot de passe

## 📝 Notes

- ⚠️ **Ne supprime PAS** `POSTGRES_PRISMA_URL` ou `POSTGRES_URL` - ce sont les variables créées automatiquement par Vercel
- ✅ **Supprime SEULEMENT** l'ancienne `DATABASE_URL` (SQLite)
- 🔄 Après suppression, Vercel créera automatiquement la nouvelle `DATABASE_URL` (PostgreSQL) lors de la connexion

