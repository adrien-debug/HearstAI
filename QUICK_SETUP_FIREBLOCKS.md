# ⚡ Configuration Rapide Fireblocks - HearstAI

## ❌ Erreur 503: Fireblocks non configuré

Si vous voyez l'erreur **503 (Service Unavailable)**, c'est que Fireblocks n'est pas encore configuré.

## ✅ Solution Rapide

### 1. Obtenir les Clés depuis Fireblocks

1. **Connectez-vous à Fireblocks**
   - URL: https://console.fireblocks.io
   - Utilisez vos identifiants

2. **Allez dans Settings > API Users**
   - Menu latéral → **Settings**
   - Section **API Users** (ou **API Users & Co-signers**)

3. **Créez un API User** (si pas encore fait)
   - Cliquez sur **"Add API User"** ou **"Create API User"**
   - Nom: `HearstAI Integration`
   - Permissions: Vaults (Read/Write), Transactions (Create/Read)
   - Cliquez sur **"Create"**

4. **Récupérez les clés**
   - **API Key**: Copiez l'UUID affiché (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
   - **Private Key**: Téléchargez le fichier `.pem` ou `.key`
     - ⚠️ **IMPORTANT**: Téléchargez immédiatement, vous ne pourrez plus le faire après !

### 2. Configurer .env.local

Ouvrez le fichier `.env.local` à la racine du projet et ajoutez:

```bash
# Fireblocks Configuration
FIREBLOCKS_API_KEY=votre_api_key_ici
FIREBLOCKS_PRIVATE_KEY=votre_private_key_ici
```

**Format de la clé privée:**

Si vous avez téléchargé un fichier `.pem`, vous pouvez soit:

**Option A: Copier le contenu complet du fichier**
```bash
FIREBLOCKS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...tout le contenu...
-----END PRIVATE KEY-----"
```

**Option B: Encoder en base64 (recommandé)**
```bash
# Sur macOS/Linux:
cat fireblocks-private-key.pem | base64 | tr -d '\n'

# Puis dans .env.local:
FIREBLOCKS_PRIVATE_KEY="LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t..."
```

### 3. Redémarrer le Serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez:
npm run dev
```

### 4. Vérifier la Configuration

Une fois configuré, allez sur:
- http://localhost:6001/fireblocks/viewer

L'erreur 503 devrait disparaître et vous pourrez tester l'API.

## 🔍 Vérification

Pour vérifier que la configuration est correcte:

```bash
# Vérifier que les variables existent (sans afficher les valeurs)
grep -E "FIREBLOCKS" .env.local | sed 's/=.*/=***/'
```

Vous devriez voir:
```
FIREBLOCKS_API_KEY=***
FIREBLOCKS_PRIVATE_KEY=***
```

## ❓ Problèmes Courants

### Erreur: "FIREBLOCKS_API_KEY n'est pas définie"
- Vérifiez que `.env.local` existe à la racine du projet
- Vérifiez que les variables sont bien nommées (sans espaces)
- Redémarrez le serveur Next.js

### Erreur: "Erreur lors de la création de la signature"
- Vérifiez que la clé privée est au bon format (PEM)
- Si vous avez encodé en base64, assurez-vous que c'est bien fait
- Vérifiez qu'il n'y a pas d'espaces ou de retours à la ligne en trop

### Erreur: "Fireblocks API Error: 401"
- Vérifiez que l'API Key est correcte
- Vérifiez que la clé privée correspond à l'API Key
- Vérifiez que l'API User a les bonnes permissions

## 📚 Documentation Complète

Pour plus de détails, consultez:
- `GUIDE_FIREBLOCKS_API_USER_SETUP.md` - Guide complet de création d'API User
- `GUIDE_FIREBLOCKS_CSR.md` - Guide pour générer un CSR (si nécessaire)






