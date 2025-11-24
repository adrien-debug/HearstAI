# 🚀 Quick Start Fireblocks - HearstAI

## ⚡ Configuration en 3 Étapes

### 1️⃣ Uploader le CSR dans Fireblocks

1. Allez dans **Fireblocks** → **Settings** → **API Users**
2. Cliquez sur **"Add API User"**
3. Remplissez les informations (nom, permissions)
4. **Uploadez** le fichier `fireblocks-csr.pem`
5. **Copiez l'API Key** générée (UUID)

### 2️⃣ Configurer dans .env.local

```env
FIREBLOCKS_API_KEY=votre_api_key_ici
FIREBLOCKS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[contenu de fireblocks-private-key.pem]
-----END PRIVATE KEY-----"
```

Pour obtenir le contenu de la clé privée:
```bash
cat fireblocks-private-key.pem
```

### 3️⃣ Tester

```bash
# Redémarrer le serveur
npm run dev

# Tester la connexion
node scripts/test-fireblocks-connection.js
```

## ✅ C'est tout !

Une fois configuré, vous pouvez:
- Lister les vaults: `/api/fireblocks/vaults`
- Créer des transactions: `/api/fireblocks/transactions`
- Associer des vaults aux customers: `/customers/[id]`

## 📚 Documentation Complète

- `INTEGRATION_FIREBLOCKS_COMPLETE.md` - Documentation complète
- `GUIDE_FIREBLOCKS_CSR.md` - Guide CSR
- `GUIDE_FIREBLOCKS_API_USER_SETUP.md` - Guide API User
