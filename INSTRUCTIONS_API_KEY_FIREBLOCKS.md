# 🔑 Instructions: Récupérer l'API Key pour "HearstAI Integration"

## 📍 Vous êtes sur la bonne page !

Vous êtes actuellement sur: **Settings > Users**

## ✅ Étape par Étape

### 1. Cliquez sur l'API User "HearstAI Inte..."

Dans le tableau des utilisateurs, trouvez la ligne:
- **Name**: "API user: HearstAI Inte..."
- **Status**: "Active" (en vert)
- **Icône de clé** à côté du nom

**Cliquez sur cette ligne** pour ouvrir les détails.

### 2. Voir les Détails de l'API User

Une fois que vous avez cliqué, vous devriez voir:
- **API User ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
- **API Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` ← **C'est celle-ci !**
- **Status**: Active
- **Permissions**: Viewer (ou autres)
- **Created**: Date de création

### 3. Si l'API Key est Visible

1. **Copiez l'API Key** (format UUID)
2. **Vérifiez si vous avez la clé privée correspondante**
   - Cherchez un bouton "Download Private Key" ou "View Private Key"
   - Si vous l'avez déjà téléchargée, elle devrait être dans votre projet

### 4. Si l'API Key N'est PAS Visible

Fireblocks n'affiche l'API Key qu'une seule fois. Si elle n'est plus visible:

**Option A: Regenerate API Key** (Recommandé)
1. Dans les détails de l'API User, cherchez le bouton **"Regenerate API Key"** ou **"Reset API Key"**
2. Cliquez dessus
3. ⚠️ **Attention**: Cela invalidera l'ancienne clé
4. Une nouvelle API Key sera générée
5. **Copiez-la immédiatement** (elle ne sera plus visible après)
6. **Téléchargez la nouvelle clé privée** (bouton "Download Private Key")

**Option B: Créer un Nouvel API User** (Si vous préférez)
1. Retournez à la liste des Users
2. Cliquez sur **"+ Add user"** (en haut à droite)
3. Sélectionnez **"API User"** ou **"Add API User"**
4. Remplissez:
   - **Name**: `HearstAI Integration` (ou autre nom)
   - **Permissions**: Vaults (Read/Write), Transactions (Create/Read)
5. Cliquez sur **"Create"**
6. **Copiez l'API Key immédiatement**
7. **Téléchargez la clé privée immédiatement**

## 🔧 Après Avoir Récupéré l'API Key

1. **Copiez l'API Key** (format UUID, ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

2. **Vérifiez la clé privée**:
   - Si vous avez déjà `fireblocks-private-key.pem` dans le projet, vérifiez qu'elle correspond
   - Sinon, téléchargez-la depuis Fireblocks

3. **Mettez à jour `.env.local`**:
   ```bash
   FIREBLOCKS_API_KEY=la_vraie_api_key_copiée
   FIREBLOCKS_PRIVATE_KEY=la_clé_privée_base64
   ```

4. **Redémarrez le serveur**:
   ```bash
   npm run dev
   ```

## ⚠️ Important

- L'API Key n'est affichée qu'**une seule fois** lors de la création
- Si vous régénérez l'API Key, vous devez aussi télécharger la nouvelle clé privée
- L'API Key et la Private Key doivent **correspondre** (créées ensemble)

## 🎯 Action Immédiate

1. **Cliquez sur "API user: HearstAI Inte..."** dans le tableau
2. **Regardez si l'API Key est affichée**
3. **Si oui**: Copiez-la et vérifiez la clé privée
4. **Si non**: Cliquez sur "Regenerate API Key" ou créez un nouvel API User






