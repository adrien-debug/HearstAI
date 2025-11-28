# 🔑 Comment Trouver votre HEARST_API_TOKEN

## 📍 Option 1 : Depuis Vercel (Recommandé)

Si vous avez déjà configuré le token sur Vercel en production :

1. Allez sur **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
2. Cherchez `HEARST_API_TOKEN`
3. Cliquez sur l'icône 👁️ pour révéler le token
4. Copiez le token
5. Ajoutez-le dans votre `.env.local` :

```bash
HEARST_API_TOKEN=votre_token_copié_ici
```

## 📍 Option 2 : Depuis votre Dashboard Hearst

1. Connectez-vous à votre dashboard Hearst
2. Allez dans **Settings** → **API Keys** ou **Tokens**
3. Créez ou copiez votre token API
4. Ajoutez-le dans votre `.env.local`

## 📍 Option 3 : Depuis votre Documentation API

Si vous avez une documentation API Hearst, le token devrait être mentionné là-bas.

## ⚠️ Format du Token

Le token devrait ressembler à :
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT)
- Ou une chaîne alphanumérique longue

## ✅ Après avoir ajouté le token

1. **Redémarrez le serveur** :
   ```bash
   pkill -f "next dev"
   pkill -f "node.*server.js"
   ./start-local-all.sh
   ```

2. **Testez la connexion** :
   ```bash
   npm run test:cockpit-backend
   ```

3. **Vérifiez l'API** :
   ```bash
   curl http://localhost:6001/api/cockpit
   ```

## 🆘 Si vous n'avez pas de token

Contactez votre équipe Hearst ou l'administrateur de l'API pour obtenir un token d'accès.


