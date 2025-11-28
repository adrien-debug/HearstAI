# 🔥 Guide de Configuration API User Fireblocks - HearstAI

## 📋 État Actuel

Vous voyez le message **"Pending API user setup"**, ce qui signifie qu'aucun API User n'a encore été configuré dans votre compte Fireblocks.

## ✅ Étapes pour Créer un API User

### 1. Accéder aux Paramètres API

1. Connectez-vous à votre compte Fireblocks
2. Allez dans **Settings** (Paramètres)
3. Cliquez sur **API Users** (ou **API Users & Co-signers**)

### 2. Créer un Nouvel API User

1. Cliquez sur **"Add API User"** ou **"Create API User"**
2. Remplissez les informations:
   - **Name**: Nom descriptif (ex: "HearstAI Integration")
   - **Role**: Sélectionnez les permissions nécessaires
     - Pour commencer, vous pouvez utiliser un rôle avec permissions de lecture/écriture
   - **Permissions**: Configurez les permissions selon vos besoins
     - **Vaults**: Lecture/Écriture
     - **Transactions**: Création et consultation
     - **External Wallets**: Si nécessaire

### 3. Générer les Clés

Lors de la création de l'API User, Fireblocks va:

1. **Générer une clé API** (API Key)
   - Format: UUID (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
   - **⚠️ IMPORTANT**: Copiez cette clé immédiatement, elle ne sera plus affichée !

2. **Générer une paire de clés RSA**
   - Une clé publique (stockée dans Fireblocks)
   - Une clé privée (à télécharger)

3. **Télécharger la clé privée**
   - Format: Fichier `.pem` ou `.key`
   - Contenu: Clé privée RSA au format PEM
   - **⚠️ IMPORTANT**: Téléchargez et sauvegardez cette clé en sécurité !

### 4. Format de la Clé Privée

La clé privée téléchargée devrait ressembler à ceci:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
[plusieurs lignes de caractères base64]
...
-----END PRIVATE KEY-----
```

## 🔧 Configuration dans HearstAI

Une fois que vous avez:
- ✅ L'API Key (UUID)
- ✅ La clé privée (fichier .pem)

Ajoutez-les dans votre fichier `.env.local`:

```env
# Fireblocks API Configuration
FIREBLOCKS_API_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890
FIREBLOCKS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----"
```

**OU** si vous préférez mettre la clé privée sur une seule ligne (base64):

```env
FIREBLOCKS_API_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890
FIREBLOCKS_PRIVATE_KEY=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
```

Le système décodera automatiquement la clé base64.

## 🧪 Test de la Configuration

Après avoir ajouté les clés dans `.env.local`:

```bash
# Redémarrer le serveur pour charger les nouvelles variables d'environnement
# (arrêtez avec Ctrl+C puis relancez)
npm run dev

# Dans un autre terminal, tester la connexion
node scripts/test-fireblocks-connection.js
```

## 📚 Documentation Fireblocks

- **API Users Setup**: https://developers.fireblocks.com/docs/api-users
- **Getting Started**: https://developers.fireblocks.com/docs/getting-started
- **API Keys**: https://developers.fireblocks.com/docs/api-keys

## ⚠️ Permissions Recommandées

Pour utiliser toutes les fonctionnalités de HearstAI avec Fireblocks, votre API User devrait avoir:

- ✅ **Vault Accounts**: Read & Write
- ✅ **Transactions**: Create & Read
- ✅ **External Wallets**: Read (optionnel)
- ✅ **Network Connections**: Read (optionnel)

## 🔐 Sécurité

**IMPORTANT**:
- ⚠️ Ne partagez JAMAIS votre clé privée
- ⚠️ Ne commitez JAMAIS votre `.env.local` dans Git
- ⚠️ Stockez la clé privée en sécurité (gestionnaire de mots de passe, etc.)
- ⚠️ Si la clé est compromise, révoquez-la immédiatement dans Fireblocks

## ❓ Problèmes Courants

### "Pending API user setup"
→ Vous devez créer un API User dans Fireblocks (voir étapes ci-dessus)

### "Invalid API Key"
→ Vérifiez que l'API Key est correcte et active dans Fireblocks

### "Invalid signature"
→ Vérifiez le format de votre clé privée (doit être PEM valide)

### "Unauthorized"
→ Vérifiez les permissions de votre API User

## 🚀 Une Fois Configuré

Une fois l'API User créé et configuré, vous pourrez:

1. ✅ Lister les vaults: `GET /api/fireblocks/vaults`
2. ✅ Créer des transactions: `POST /api/fireblocks/transactions`
3. ✅ Associer des vaults aux customers dans HearstAI
4. ✅ Gérer les transactions depuis l'interface

## 📞 Support

Si vous avez des difficultés:
1. Consultez la documentation Fireblocks
2. Contactez le support Fireblocks
3. Vérifiez les logs du serveur pour plus de détails






