# 🧪 Test: Utiliser l'API User ID comme API Key

## 🔍 Situation Actuelle

- **API User ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
- **API Key dans .env.local**: `8220b577-89f6-4968-a786-f1f158ccd0f6` (même valeur)
- **Erreur**: 401 - Unauthorized: JWT is missing

## ❓ Question

Dans certains cas, Fireblocks peut utiliser l'API User ID comme API Key, mais généralement ils sont différents.

## ✅ Solutions Possibles

### Option 1: L'API Key est Différente

Si dans les détails de l'API User, vous voyez un champ "API Key" avec une valeur différente:
1. Copiez cette API Key
2. Vérifiez que vous avez la clé privée correspondante
3. Mettez à jour `.env.local`

### Option 2: Régénérer l'API Key

Si l'API Key n'est pas visible:
1. Cliquez sur **"Regenerate API Key"** ou **"Reset API Key"**
2. Une nouvelle API Key sera générée
3. **Copiez-la immédiatement**
4. Téléchargez la nouvelle clé privée
5. Mettez à jour `.env.local`

### Option 3: Vérifier la Clé Privée

Il est possible que:
- L'API Key soit correcte (`8220b577-89f6-4968-a786-f1f158ccd0f6`)
- Mais la clé privée ne corresponde pas

**Vérification:**
- La clé privée doit être téléchargée depuis Fireblocks pour cet API User
- Elle doit être créée en même temps que l'API Key
- Si vous avez régénéré l'API Key, vous devez aussi télécharger la nouvelle clé privée

## 🔧 Action Recommandée

1. **Dans Fireblocks**, dans les détails de l'API User:
   - Cherchez un bouton **"Regenerate API Key"** ou **"Reset API Key"**
   - Cliquez dessus
   - **Copiez la nouvelle API Key** (elle sera différente de l'ID)
   - **Téléchargez la nouvelle clé privée**

2. **Mettez à jour `.env.local`**:
   ```bash
   FIREBLOCKS_API_KEY=la_nouvelle_api_key
   FIREBLOCKS_PRIVATE_KEY=la_nouvelle_clé_privée_base64
   ```

3. **Redémarrez le serveur**

## 📋 Ce que Vous Devez Voir dans Fireblocks

Dans les détails de l'API User, vous devriez voir:
- **API User ID**: `8220b577-89f6-4968-a786-f1f158ccd0f6`
- **API Key**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (différente de l'ID)
- **Status**: Active
- **Boutons**: "Regenerate API Key", "Download Private Key", etc.


