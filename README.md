# HearstAI - Collateral Management Platform

Plateforme de gestion et surveillance des positions collatérales en temps réel avec intégration DeBank.

## 🚀 Démarrage rapide

### Installation automatique

```bash
# Configuration complète automatique
chmod +x setup.sh
./setup.sh

# Démarrer les serveurs
./start-local-all.sh
```

### Installation manuelle

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec tes clés API

# Générer Prisma
npx prisma generate
npx prisma db push

# Démarrer
npm run dev
```

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Clé API DeBank (optionnel pour commencer)

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` :

```env
# Database
DATABASE_URL="file:./prisma/storage/hearstai.db"

# Next.js API URL (vide pour routes relatives)
NEXT_PUBLIC_API_URL=""

# DeBank API
DEBANK_ACCESS_KEY="ta_cle_debank"

# NextAuth
NEXTAUTH_URL="http://localhost:6001"
NEXTAUTH_SECRET="generer_avec_openssl_rand_base64_32"

# Autres APIs (optionnel)
ANTHROPIC_API_KEY=""
FIREBLOCKS_API_KEY=""
FIREBLOCKS_SECRET_KEY=""
LUXOR_API_KEY=""
```

## 🎯 Fonctionnalités

- ✅ Gestion des clients avec adresses ERC20
- ✅ Surveillance en temps réel via DeBank API
- ✅ Vue détaillée des positions collatérales
- ✅ Calcul automatique du Health Factor
- ✅ Support multi-chains (ETH, ARB, BASE, etc.)
- ✅ Filtrage par protocoles (Morpho, Aave, etc.)

## 📁 Structure du projet

```
HearstAI/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── collateral/        # Page Collateral
├── components/            # Composants React
│   └── collateral/        # Composants Collateral
├── lib/                   # Utilitaires
│   ├── api.ts            # Client API
│   └── debank.ts         # Intégration DeBank
├── prisma/                # Prisma ORM
│   └── schema.prisma     # Schéma de base de données
├── scripts/               # Scripts utilitaires
├── setup.sh              # Script de configuration
└── start-local-all.sh    # Script de démarrage
```

## 🛠️ Scripts disponibles

```bash
# Configuration automatique (peut être relancé à tout moment)
./setup.sh

# Réinitialisation complète (supprime tout sauf .env.local)
./reset.sh

# Démarrer tout (backend + frontend)
./start-local-all.sh

# Initialiser Git et préparer GitHub
./init-git.sh

# Développement
npm run dev

# Build
npm run build

# Prisma
npx prisma generate
npx prisma db push
npx prisma studio
```

### 🔄 Workflow de mise à jour

Quand tu fais des changements dans le projet :

1. **Mets à jour la configuration** :
   ```bash
   ./setup.sh  # Met à jour tout automatiquement
   ```

2. **Si tu veux repartir de zéro** :
   ```bash
   ./reset.sh  # Réinitialise tout (préserve .env.local)
   ```

3. **Teste** :
   ```bash
   ./start-local-all.sh
   ```

Le script `setup.sh` est maintenu à jour avec la configuration actuelle du projet.

## 🌐 Déploiement

Voir [DEPLOY.md](./DEPLOY.md) pour les instructions complètes de déploiement sur Vercel.

## 📝 Documentation

- [Guide de déploiement](./DEPLOY.md)
- [API Documentation](./docs/API.md) (à venir)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriétaire - HearstAI
