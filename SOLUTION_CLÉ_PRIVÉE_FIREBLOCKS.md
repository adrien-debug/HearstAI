# 🔑 Solution: Télécharger la Clé Privée Correspondante

## ✅ API Key Confirmée

- **API User**: HearstAI Integration
- **API Key**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
- **Status**: Active

## ❌ Problème Actuel

**Erreur 401 - Unauthorized**: La clé privée dans `.env.local` ne correspond probablement pas à cette API Key.

## ✅ Solution: Télécharger la Clé Privée depuis Fireblocks

### Étape 1: Dans Fireblocks

1. Vous êtes dans les détails de l'API User "HearstAI Integration"
2. Cherchez un bouton ou un lien:
   - **"Download Private Key"**
   - **"View Private Key"**
   - **"Export Private Key"**
   - **"Download Key"**
   - Ou un bouton avec une icône de téléchargement 📥

3. **Cliquez sur ce bouton** pour télécharger la clé privée
4. Le fichier sera téléchargé (format `.pem` ou `.key`)

### Étape 2: Encoder la Clé en Base64

Une fois le fichier téléchargé:

```bash
# Si le fichier est dans votre dossier de téléchargements
cd ~/Downloads

# Trouvez le fichier (généralement nommé comme "fireblocks-private-key.pem" ou similaire)
ls -la | grep -i fireblocks

# Encodez en base64 et copiez dans le presse-papier
cat nom_du_fichier.pem | base64 | tr -d '\n' | pbcopy
```

### Étape 3: Mettre à Jour .env.local

1. Ouvrez `.env.local`
2. Trouvez la ligne:
   ```
   FIREBLOCKS_PRIVATE_KEY=
   ```
3. Collez le contenu base64 après le `=`
4. Sauvegardez le fichier

### Étape 4: Redémarrer le Serveur

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

## 🔍 Alternative: Si Vous Ne Trouvez Pas le Bouton

Si vous ne voyez pas de bouton "Download Private Key":

1. **Regenerate API Key** (Recommandé)
   - Cliquez sur "Regenerate API Key" ou "Reset API Key"
   - ⚠️ Cela invalidera l'ancienne clé
   - Une nouvelle API Key sera générée
   - **Copiez la nouvelle API Key**
   - **Téléchargez la nouvelle clé privée** (sera disponible après régénération)
   - Mettez à jour `.env.local` avec les deux nouvelles valeurs

2. **Créer un Nouvel API User**
   - Retournez à la liste des Users
   - Cliquez sur "+ Add user" → "API User"
   - Créez un nouvel API User
   - **Copiez l'API Key immédiatement**
   - **Téléchargez la clé privée immédiatement**

## 📋 Vérification

Après avoir mis à jour `.env.local`, vérifiez:

```bash
# Vérifier que les variables sont bien définies
grep "FIREBLOCKS" .env.local | sed 's/=.*/=***/'
```

Vous devriez voir:
```
FIREBLOCKS_API_KEY=***
FIREBLOCKS_PRIVATE_KEY=***
```

## 🧪 Test

Une fois configuré, testez:

```bash
curl http://localhost:6001/api/fireblocks/vaults
```

Vous devriez obtenir une liste de vaults, pas une erreur 401.



