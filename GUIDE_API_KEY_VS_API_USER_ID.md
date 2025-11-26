# 🔑 Guide: API Key vs API User ID - Fireblocks

## ⚠️ Confusion Courante

L'ID `8220b577-89f6-4968-a786-f1f158ccd0f6` est un **API User ID**, pas forcément l'**API Key**.

## 📋 Différence entre API User ID et API Key

### API User ID
- Identifiant unique de l'utilisateur API dans Fireblocks
- Format: UUID (ex: `8220b577-89f6-4968-a786-f1f158ccd0f6`)
- Utilisé pour identifier l'utilisateur dans l'interface Fireblocks
- **N'est PAS utilisé pour l'authentification API**

### API Key
- Clé d'authentification pour les appels API
- Format: UUID (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- Générée lors de la création de l'API User
- **Utilisée avec la Private Key pour signer les requêtes**
- **C'est celle-ci qui doit être dans FIREBLOCKS_API_KEY**

## ✅ Comment Trouver la Vraie API Key

### Méthode 1: Lors de la Création

1. Créez un nouvel API User dans Fireblocks
2. Fireblocks affiche:
   - **API Key**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` ← **C'est celle-ci !**
   - **API User ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6` ← C'est l'ID
3. **Copiez l'API Key immédiatement** (elle ne sera plus affichée)
4. Téléchargez la clé privée correspondante

### Méthode 2: Si l'API User Existe Déjà

1. Allez dans **Settings > API Users**
2. Cliquez sur l'API User `8220b577-89f6-4968-a786-f1f158ccd0f6`
3. Regardez les détails:
   - Si l'API Key est affichée, copiez-la
   - Si elle n'est pas affichée, vous devrez peut-être créer un nouvel API User

### Méthode 3: Regenerate API Key

Si l'API Key n'est plus disponible:
1. Allez dans **Settings > API Users**
2. Sélectionnez l'API User
3. Option **"Regenerate API Key"** ou **"Reset API Key"**
4. ⚠️ **Attention**: Cela invalidera l'ancienne clé
5. Copiez la nouvelle API Key
6. Téléchargez la nouvelle clé privée

## 🔧 Configuration Correcte

Dans `.env.local`, vous devez avoir:

```env
# L'API KEY (pas l'API User ID)
FIREBLOCKS_API_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890

# La clé privée correspondante (base64)
FIREBLOCKS_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...
```

## ❌ Erreur Courante

**Ne pas confondre:**
- ❌ `FIREBLOCKS_API_KEY=8220b577-89f6-4968-a786-f1f158ccd0f6` (API User ID)
- ✅ `FIREBLOCKS_API_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890` (Vraie API Key)

## 🧪 Vérification

Pour vérifier que vous avez la bonne API Key:

1. L'API Key doit être affichée dans Fireblocks lors de la création
2. La clé privée doit être téléchargée en même temps
3. Les deux doivent être créées ensemble
4. Si vous régénérez l'API Key, vous devez aussi télécharger la nouvelle clé privée

## 📚 Documentation Fireblocks

- [API Users](https://developers.fireblocks.com/docs/api-users)
- [Authentication](https://developers.fireblocks.com/reference/authentication)





