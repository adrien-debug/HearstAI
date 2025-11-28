# 🔐 Guide CSR pour Fireblocks - HearstAI

## 📋 Qu'est-ce qu'un CSR ?

Un **CSR (Certificate Signing Request)** est un fichier qui contient des informations sur votre clé publique et votre organisation. Fireblocks l'utilise pour générer les clés API sécurisées.

## ✅ Méthode Rapide (Recommandée)

### Option 1: Utiliser OpenSSL (le plus simple)

1. **Ouvrez un terminal** dans le dossier du projet

2. **Exécutez cette commande** (remplacez les valeurs si nécessaire):

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout fireblocks-private-key.pem \
  -out fireblocks-csr.pem \
  -subj "/C=FR/ST=Paris/L=Paris/O=Beyond Labs/OU=HearstAI/CN=hearstai-api"
```

**OU** version interactive (plus simple):

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout fireblocks-private-key.pem \
  -out fireblocks-csr.pem
```

Puis répondez aux questions:
- **Country Name**: `FR` (ou votre pays)
- **State or Province**: `Paris` (ou votre région)
- **Locality**: `Paris` (ou votre ville)
- **Organization Name**: `Beyond Labs` (ou votre organisation)
- **Organizational Unit**: `HearstAI` (ou votre unité)
- **Common Name**: `hearstai-api` (peut être n'importe quoi)
- **Email Address**: (optionnel, appuyez sur Entrée pour ignorer)
- **Challenge password**: (appuyez sur Entrée pour ignorer)
- **Optional company name**: (appuyez sur Entrée pour ignorer)

3. **Deux fichiers seront créés**:
   - `fireblocks-csr.pem` → **À uploader dans Fireblocks**
   - `fireblocks-private-key.pem` → **À sauvegarder précieusement** (c'est votre clé privée !)

## 📤 Uploader le CSR dans Fireblocks

1. Allez dans **Fireblocks** → **Settings** → **API Users**
2. Cliquez sur **"Add API User"** ou **"Create API User"**
3. Remplissez les informations de base (nom, permissions, etc.)
4. Quand Fireblocks demande le **CSR file**:
   - Cliquez sur **"Upload"** ou **"Choose File"**
   - Sélectionnez le fichier **`fireblocks-csr.pem`**
   - Cliquez sur **"Upload"** ou **"Submit"**

5. Fireblocks va:
   - Générer une **API Key** (UUID) → **Copiez-la immédiatement !**
   - Créer la clé publique correspondante
   - Vous pouvez maintenant utiliser l'API

## 🔧 Configuration dans HearstAI

Une fois que vous avez:
- ✅ L'**API Key** (générée par Fireblocks)
- ✅ La **clé privée** (`fireblocks-private-key.pem`)

Ajoutez-les dans `.env.local`:

```env
# Fireblocks API Configuration
FIREBLOCKS_API_KEY=votre_api_key_ici
FIREBLOCKS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[contenu du fichier fireblocks-private-key.pem]
-----END PRIVATE KEY-----"
```

**OU** si vous préférez référencer le fichier directement (non recommandé en production):

```env
FIREBLOCKS_API_KEY=votre_api_key_ici
FIREBLOCKS_PRIVATE_KEY_PATH=./fireblocks-private-key.pem
```

## 🧪 Test de la Configuration

```bash
# Redémarrer le serveur
npm run dev

# Tester la connexion
node scripts/test-fireblocks-connection.js
```

## ⚠️ Sécurité IMPORTANTE

- 🔒 **Ne partagez JAMAIS** votre clé privée (`fireblocks-private-key.pem`)
- 🔒 **Ne commitez JAMAIS** la clé privée dans Git
- 🔒 **Sauvegardez** la clé privée dans un gestionnaire de mots de passe
- 🔒 Si la clé est compromise, **révoquez-la immédiatement** dans Fireblocks

## ❓ Problèmes Courants

### "OpenSSL not found"
→ Installez OpenSSL:
- **macOS**: `brew install openssl`
- **Linux**: `sudo apt-get install openssl` ou `sudo yum install openssl`
- **Windows**: Téléchargez depuis https://slproweb.com/products/Win32OpenSSL.html

### "Invalid CSR format"
→ Vérifiez que le fichier CSR est au format PEM valide:
```bash
openssl req -in fireblocks-csr.pem -text -noout
```

### "CSR doesn't match private key"
→ Assurez-vous d'utiliser la clé privée qui correspond au CSR:
- Le CSR et la clé privée doivent être générés ensemble
- Utilisez `fireblocks-private-key.pem` qui a été créé en même temps que `fireblocks-csr.pem`

## 📚 Documentation

- **Fireblocks CSR Guide**: https://developers.fireblocks.com/docs/api-users#creating-an-api-user
- **OpenSSL Documentation**: https://www.openssl.org/docs/

## 🚀 Script Automatique

Un script est disponible pour vous guider:

```bash
node scripts/generate-fireblocks-csr.js
```

Ce script vous donnera les instructions détaillées et la commande exacte à exécuter.






