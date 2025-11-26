# 🔍 Guide: Où Trouver l'API Key dans Fireblocks

## 📍 Localisation dans Fireblocks

### Étape 1: Accéder aux Paramètres

1. **Connectez-vous à Fireblocks**
   - URL: https://console.fireblocks.io
   - Utilisez vos identifiants

2. **Allez dans Settings (Paramètres)**
   - Menu latéral gauche → **Settings** (ou ⚙️)
   - Ou cliquez sur votre profil en haut à droite → **Settings**

### Étape 2: Accéder aux API Users

1. Dans le menu Settings, cherchez la section **"API Users"**
   - Peut s'appeler: **"API Users"**, **"API Users & Co-signers"**, ou **"API"**
   - Généralement dans la section **"Security"** ou **"Access Control"**

2. Cliquez sur **"API Users"**

### Étape 3: Trouver l'API User

Vous verrez une liste d'API Users. Cherchez celui avec:
- **ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
- Ou le nom que vous avez donné lors de la création

### Étape 4: Voir l'API Key

**Option A: Si l'API User est récent (créé récemment)**

1. Cliquez sur l'API User `8220b577-89f6-4968-a786-f1f158ccd0f6`
2. Dans les détails, vous devriez voir:
   - **API User ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
   - **API Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` ← **C'est celle-ci !**
   - **Status**: Active/Inactive
   - **Created**: Date de création

**Option B: Si l'API Key n'est pas visible**

Fireblocks ne montre l'API Key qu'une seule fois lors de la création. Si elle n'est plus visible:

1. **Option 1: Regenerate API Key** (Recommandé)
   - Cliquez sur l'API User
   - Cherchez le bouton **"Regenerate API Key"** ou **"Reset API Key"**
   - ⚠️ **Attention**: Cela invalidera l'ancienne clé
   - Une nouvelle API Key sera générée
   - **Copiez-la immédiatement**
   - Téléchargez la nouvelle clé privée

2. **Option 2: Créer un Nouvel API User** (Si vous ne voulez pas régénérer)
   - Cliquez sur **"Add API User"** ou **"Create API User"**
   - Nom: `HearstAI Integration` (ou autre)
   - Permissions: Vaults (Read/Write), Transactions (Create/Read)
   - Cliquez sur **"Create"**
   - **Copiez l'API Key affichée** (elle ne sera plus visible après)
   - **Téléchargez la clé privée** immédiatement

## 📋 Ce que Vous Devez Copier

### ✅ API Key (à mettre dans FIREBLOCKS_API_KEY)
- Format: UUID (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- Différente de l'API User ID
- Visible uniquement lors de la création/régénération

### ✅ Private Key (à mettre dans FIREBLOCKS_PRIVATE_KEY)
- Fichier `.pem` ou `.key`
- Téléchargé en même temps que l'API Key
- Doit correspondre à l'API Key

## 🎯 Chemin Complet dans Fireblocks

```
Fireblocks Console
  ↓
Settings (⚙️)
  ↓
API Users (ou API Users & Co-signers)
  ↓
Liste des API Users
  ↓
API User: 8220b577-89f6-4968-a786-f1f158ccd0f6
  ↓
Détails → API Key: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## ⚠️ Si Vous Ne Trouvez Pas l'API Key

Si l'API Key n'est plus visible (car elle n'est affichée qu'une seule fois):

1. **Régénérez l'API Key** (recommandé)
   - Cela créera une nouvelle paire API Key / Private Key
   - Mettez à jour `.env.local` avec les nouvelles valeurs

2. **Ou créez un nouvel API User**
   - Plus simple si vous n'avez pas besoin de garder l'ancien
   - Vous obtiendrez une nouvelle API Key immédiatement

## 📸 Capture d'Écran Attendue

Dans Fireblocks, vous devriez voir quelque chose comme:

```
API Users
├── HearstAI Integration
│   ├── API User ID: 8220b577-89f6-4968-a786-f1f158ccd0f6
│   ├── API Key: a1b2c3d4-e5f6-7890-abcd-ef1234567890  ← COPIER CECI
│   ├── Status: Active
│   └── [Regenerate API Key] [Download Private Key]
```

## 🔧 Après Avoir Trouvé l'API Key

1. Copiez l'API Key
2. Téléchargez la clé privée correspondante
3. Mettez à jour `.env.local`:
   ```bash
   FIREBLOCKS_API_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890
   FIREBLOCKS_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t... (base64)
   ```
4. Redémarrez le serveur: `npm run dev`





