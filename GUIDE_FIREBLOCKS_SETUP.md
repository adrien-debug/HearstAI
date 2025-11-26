# 🔥 Guide de Configuration Fireblocks - HearstAI

## 📋 Informations du Token Fourni

Le token JWT fourni est un **token de pairing d'appareil** (devicePairing), pas une clé API.

**Détails du token:**
- Type: `devicePairing`
- Tenant: Beyond Labs
- Tenant ID: `edc5e38e-5c66-4faa-b94d-0bcaf3118703`
- User ID: `8339ab25-431b-481a-92e9-00a1d3b16a58`
- Expiration: Token temporaire (expire après 1 heure)

## ⚠️ Ce Token n'est PAS Utilisable pour l'API

Ce token est utilisé pour le **pairing d'appareil** dans l'application Fireblocks, pas pour les appels API.

## ✅ Configuration Requise pour l'API Fireblocks

Pour utiliser l'API Fireblocks dans HearstAI, vous avez besoin de **2 éléments**:

### 1. FIREBLOCKS_API_KEY

Une clé API Fireblocks (généralement un UUID).

**Comment l'obtenir:**
1. Connectez-vous à votre compte Fireblocks
2. Allez dans **Settings** → **API Users**
3. Créez un nouvel API User ou utilisez un existant
4. Copiez l'**API Key** (format: UUID)

### 2. FIREBLOCKS_PRIVATE_KEY

Une clé privée RSA au format PEM.

**Comment l'obtenir:**
1. Lors de la création de l'API User, Fireblocks génère une paire de clés
2. Téléchargez la **clé privée** (fichier `.pem`)
3. Le format doit être:
   ```
   -----BEGIN PRIVATE KEY-----
   [contenu base64]
   -----END PRIVATE KEY-----
   ```

**OU** si vous avez déjà une clé privée en base64, le système la décodera automatiquement.

## 🔧 Configuration dans .env.local

Ajoutez ces lignes dans votre fichier `.env.local`:

```env
# Fireblocks API Configuration
FIREBLOCKS_API_KEY=votre_cle_api_ici
FIREBLOCKS_PRIVATE_KEY=votre_cle_privee_pem_ici

# Optionnel
FIREBLOCKS_BASE_URL=https://api.fireblocks.io
FIREBLOCKS_TIMEOUT=30000
```

### Format de la Clé Privée

**Option 1: Format PEM (recommandé)**
```env
FIREBLOCKS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----"
```

**Option 2: Base64 (le système décodera automatiquement)**
```env
FIREBLOCKS_PRIVATE_KEY=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
```

## 🧪 Test de la Configuration

Une fois configuré, testez la connexion:

```bash
# Test rapide
node scripts/test-fireblocks-connection.js

# Test complet
node scripts/test-fireblocks.js
```

## 📚 Documentation Fireblocks

- **API Documentation**: https://developers.fireblocks.com/
- **Getting Started**: https://developers.fireblocks.com/docs/getting-started
- **API Keys**: https://developers.fireblocks.com/docs/api-keys

## 🔐 Sécurité

⚠️ **IMPORTANT**: 
- Ne commitez JAMAIS votre `.env.local` dans Git
- La clé privée doit rester secrète
- Utilisez des variables d'environnement pour la production

## 🚀 Utilisation dans HearstAI

Une fois configuré, vous pourrez:

1. **Lister les vaults**: `GET /api/fireblocks/vaults`
2. **Créer des transactions**: `POST /api/fireblocks/transactions`
3. **Associer des vaults aux customers**: Via `/customers/[id]`

## ❓ Problèmes Courants

### Erreur: "Fireblocks API non configurée"
→ Vérifiez que `FIREBLOCKS_API_KEY` et `FIREBLOCKS_PRIVATE_KEY` sont définis dans `.env.local`

### Erreur: "Invalid signature"
→ Vérifiez le format de votre clé privée (doit être PEM valide)

### Erreur: "Unauthorized"
→ Vérifiez que votre API Key est correcte et active dans Fireblocks

## 📞 Support

Si vous avez besoin d'aide:
1. Vérifiez la documentation Fireblocks
2. Contactez le support Fireblocks pour obtenir vos clés API
3. Vérifiez les logs du serveur pour plus de détails





