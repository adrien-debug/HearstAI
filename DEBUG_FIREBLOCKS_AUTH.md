# 🔍 Debug Authentification Fireblocks

## ❌ Erreur Actuelle

**401 - Unauthorized: JWT is missing**

## 🔍 Causes Possibles

### 1. API Key et Private Key ne correspondent pas

L'API Key `8220b577-89f6-4968-a786-f1f158ccd0f6` doit correspondre à la clé privée dans `.env.local`.

**Vérification:**
- L'API Key vient de Settings > API Users dans Fireblocks
- La clé privée téléchargée correspond à cet API User
- Les deux doivent être créés ensemble lors de la création de l'API User

### 2. Format de la clé privée incorrect

La clé privée doit être au format PEM:
```
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

**Vérification actuelle:**
- Clé encodée en base64 dans `.env.local` ✅
- Le code décode automatiquement ✅

### 3. Format de signature incorrect

Fireblocks attend un format spécifique pour la signature RSA-SHA256.

**Format du message:**
```
timestamp + nonce + method + path + bodyHash
```

**Vérification:**
- ✅ Timestamp: Date.now().toString()
- ✅ Nonce: crypto.randomBytes(16).toString('hex')
- ✅ Method: GET/POST/etc
- ✅ Path: /v1/vault/accounts/{id}
- ✅ BodyHash: SHA256 du body (vide pour GET)

### 4. L'API Key n'est pas une vraie API Key Fireblocks

L'ID `8220b577-89f6-4968-a786-f1f158ccd0f6` pourrait être:
- Un Vault Account ID (pas une API Key)
- Un Transaction ID (pas une API Key)
- Un autre type d'ID Fireblocks

**Vérification:**
- Allez dans Fireblocks > Settings > API Users
- Vérifiez que l'API Key est bien un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- L'API Key est différente d'un Vault ID ou Transaction ID

## ✅ Solution

### Étape 1: Vérifier l'API Key

1. Connectez-vous à https://console.fireblocks.io
2. Allez dans **Settings > API Users**
3. Vérifiez que vous avez un API User créé
4. **Copiez l'API Key** (format UUID)
5. **Téléchargez la clé privée** correspondante

### Étape 2: Mettre à jour .env.local

```bash
# Remplacez avec la vraie API Key
FIREBLOCKS_API_KEY=votre_vraie_api_key_ici

# Remplacez avec la clé privée correspondante (base64)
FIREBLOCKS_PRIVATE_KEY=votre_vraie_private_key_ici
```

### Étape 3: Vérifier la correspondance

L'API Key et la Private Key doivent:
- ✅ Être créées ensemble lors de la création de l'API User
- ✅ Appartenir au même API User
- ✅ Être actives (pas révoquées)

## 🧪 Test de la Configuration

Une fois configuré correctement, testez:

```bash
curl http://localhost:6001/api/fireblocks/vaults
```

Vous devriez obtenir une liste de vaults, pas une erreur 401.

## 📚 Documentation Fireblocks

- [Authentication](https://developers.fireblocks.com/reference/authentication)
- [API Users](https://developers.fireblocks.com/docs/api-users)



