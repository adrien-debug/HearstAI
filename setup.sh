#!/bin/bash

# Script de configuration automatique pour HearstAI
# Ce script configure tout ce qui est nécessaire pour que le projet fonctionne
# Mise à jour automatique : Ce script est maintenu à jour avec la configuration actuelle

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Configuration HearstAI v3.0      ║${NC}"
echo -e "${CYAN}║  Supabase + Prisma Accelerate         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}\n"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# 1. Vérifier Node.js
echo -e "${CYAN}📦 Vérification de Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}\n"

# 2. Sauvegarder .env.local s'il existe
if [ -f ".env.local" ]; then
    echo -e "${CYAN}💾 Sauvegarde de .env.local...${NC}"
    cp .env.local .env.local.backup
    echo -e "${GREEN}✅ Sauvegarde créée (.env.local.backup)${NC}\n"
fi

# 3. Installer/Mettre à jour les dépendances
echo -e "${CYAN}📦 Installation/Mise à jour des dépendances...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}   Installation initiale...${NC}"
    npm install
else
    echo -e "${BLUE}   Mise à jour des dépendances...${NC}"
    npm install
    echo -e "${BLUE}   Vérification des dépendances obsolètes...${NC}"
    npm outdated || true
fi
echo -e "${GREEN}✅ Dépendances à jour${NC}\n"

# 4. Configurer .env.local
echo -e "${CYAN}⚙️  Configuration de l'environnement...${NC}"
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local n'existe pas, création...${NC}"
    cat > .env.local << 'EOF'
# Database - Prisma Accelerate (Supabase PostgreSQL)
# Obtenez cette URL depuis Prisma Data Platform: https://console.prisma.io
# Databases → Votre base → Connection Strings → Accelerate Connection
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY_HERE"

# Supabase (optionnel, pour utilisation directe si nécessaire)
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""

# Next.js API URL (vide pour utiliser les routes relatives)
NEXT_PUBLIC_API_URL=""

# DeBank API (OBLIGATOIRE pour la fonctionnalité Collateral)
DEBANK_ACCESS_KEY=""

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Autres APIs (optionnel)
ANTHROPIC_API_KEY=""
FIREBLOCKS_API_KEY=""
FIREBLOCKS_SECRET_KEY=""
LUXOR_API_KEY=""
EOF
    echo -e "${GREEN}✅ .env.local créé${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Configurez DATABASE_URL avec votre URL Prisma Accelerate${NC}"
    echo -e "${YELLOW}   Obtenez-la depuis: https://console.prisma.io → Databases → Connection Strings${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Remplis DEBANK_ACCESS_KEY dans .env.local${NC}"
else
    # Vérifier et corriger DATABASE_URL
    if ! grep -q "^DATABASE_URL" .env.local; then
        echo -e "${YELLOW}⚠️  Ajout de DATABASE_URL...${NC}"
        echo 'DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY_HERE"' >> .env.local
        echo -e "${YELLOW}⚠️  IMPORTANT: Configurez DATABASE_URL avec votre URL Prisma Accelerate${NC}"
    fi
    
    # Nettoyer les doublons DATABASE_URL (garder le premier)
    DATABASE_URL_COUNT=$(grep -c "^DATABASE_URL" .env.local || echo "0")
    if [ "$DATABASE_URL_COUNT" -gt 1 ]; then
        echo -e "${YELLOW}⚠️  Nettoyage des doublons DATABASE_URL...${NC}"
        grep -v "^DATABASE_URL" .env.local > .env.local.tmp
        FIRST_DATABASE_URL=$(grep "^DATABASE_URL" .env.local | head -1)
        echo "$FIRST_DATABASE_URL" >> .env.local.tmp
        mv .env.local.tmp .env.local
    fi
    
    # S'assurer que NEXT_PUBLIC_API_URL est présent
    if ! grep -q "^NEXT_PUBLIC_API_URL" .env.local; then
        echo -e "${YELLOW}⚠️  Ajout de NEXT_PUBLIC_API_URL...${NC}"
        echo 'NEXT_PUBLIC_API_URL=""' >> .env.local
    fi
    
    # Générer NEXTAUTH_SECRET s'il est vide
    if ! grep -q "^NEXTAUTH_SECRET=" .env.local || grep -q "^NEXTAUTH_SECRET=\"\"" .env.local; then
        echo -e "${YELLOW}⚠️  Génération de NEXTAUTH_SECRET...${NC}"
        if command -v openssl &> /dev/null; then
            SECRET=$(openssl rand -base64 32)
            if grep -q "^NEXTAUTH_SECRET=" .env.local; then
                sed -i.bak "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env.local
                rm -f .env.local.bak
            else
                echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
            fi
        fi
    fi
    
    echo -e "${GREEN}✅ .env.local configuré${NC}"
fi
echo ""

# 5. Vérifier la configuration de la base de données
echo -e "${CYAN}💾 Configuration de la base de données...${NC}"
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Vérifier que DATABASE_URL est configuré
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"YOUR_API_KEY_HERE"* ]]; then
    echo -e "${RED}❌ DATABASE_URL n'est pas configuré correctement${NC}"
    echo -e "${YELLOW}⚠️  Configurez DATABASE_URL dans .env.local avec votre URL Prisma Accelerate${NC}"
    echo -e "${YELLOW}   Obtenez-la depuis: https://console.prisma.io → Databases → Connection Strings${NC}"
    echo -e "${YELLOW}   Format: prisma+postgres://accelerate.prisma-data.net/?api_key=...${NC}"
    echo -e "${YELLOW}⚠️  Le script continue, mais la base de données ne sera pas synchronisée${NC}\n"
    SKIP_DB=true
else
    echo -e "${GREEN}✅ DATABASE_URL configuré${NC}"
    SKIP_DB=false
fi

# 6. Générer Prisma Client
echo -e "${CYAN}🔧 Génération de Prisma Client...${NC}"
if [ "$SKIP_DB" = false ]; then
    if npx prisma generate 2>&1 | tee /tmp/prisma-generate.log; then
        echo -e "${GREEN}✅ Prisma Client généré${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Erreur lors de la génération Prisma, mais on continue...${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Génération Prisma ignorée (DATABASE_URL non configuré)${NC}\n"
fi

# 7. Créer/Mettre à jour les tables dans la base de données
echo -e "${CYAN}🗄️  Synchronisation de la base de données...${NC}"
if [ "$SKIP_DB" = false ]; then
    if npx prisma db push --accept-data-loss 2>&1 | tee /tmp/prisma-push.log; then
        echo -e "${GREEN}✅ Base de données synchronisée${NC}\n"
        
        # Créer l'utilisateur par défaut si le script existe
        if [ -f "scripts/create-user.js" ]; then
            echo -e "${CYAN}👤 Création de l'utilisateur par défaut...${NC}"
            if node scripts/create-user.js 2>&1 | grep -q "créé\|existe"; then
                echo -e "${GREEN}✅ Utilisateur vérifié/créé${NC}\n"
            else
                echo -e "${YELLOW}⚠️  Utilisateur non créé (peut-être déjà existant)${NC}\n"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  Erreur lors de la synchronisation, mais on continue...${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Synchronisation ignorée (DATABASE_URL non configuré)${NC}\n"
fi

# 8. Vérifier que les ports sont libres
echo -e "${CYAN}🔌 Vérification des ports...${NC}"
BACKEND_PORT=4000
FRONTEND_PORT=6001

kill_port() {
    local port=$1
    local pid=$(lsof -t -i:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}⚠️  Port $port utilisé par PID $pid, arrêt...${NC}"
        kill -9 $pid 2>/dev/null || true
        sleep 1
        if lsof -t -i:$port 2>/dev/null | grep -q .; then
            echo -e "${RED}❌ Impossible de libérer le port $port${NC}"
            return 1
        else
            echo -e "${GREEN}✅ Port $port libéré${NC}"
            return 0
        fi
    else
        echo -e "${GREEN}✅ Port $port libre${NC}"
        return 0
    fi
}

kill_port $BACKEND_PORT || true
kill_port $FRONTEND_PORT || true
echo ""

# 9. Vérifier la configuration API
echo -e "${CYAN}🔍 Vérification de la configuration...${NC}"
if grep -q 'DEBANK_ACCESS_KEY=""' .env.local || ! grep -q "^DEBANK_ACCESS_KEY=" .env.local; then
    echo -e "${YELLOW}⚠️  DEBANK_ACCESS_KEY n'est pas configuré${NC}"
    echo -e "${YELLOW}   La fonctionnalité Collateral ne fonctionnera pas sans cette clé${NC}"
else
    DEBANK_KEY=$(grep "^DEBANK_ACCESS_KEY=" .env.local | cut -d'"' -f2)
    if [ -z "$DEBANK_KEY" ]; then
        echo -e "${YELLOW}⚠️  DEBANK_ACCESS_KEY est vide${NC}"
    else
        echo -e "${GREEN}✅ DEBANK_ACCESS_KEY configuré${NC}"
    fi
fi
echo ""

# 10. Configuration GitHub et Vercel
echo -e "${CYAN}🔗 Configuration GitHub et Vercel...${NC}"

# Créer le répertoire .github/workflows s'il n'existe pas
mkdir -p .github/workflows

# Vérifier si le workflow GitHub Actions existe
if [ ! -f ".github/workflows/deploy.yml" ]; then
    echo -e "${YELLOW}⚠️  Création du workflow GitHub Actions...${NC}"
    cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Run linter
        run: npm run lint || true

      - name: Build project
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          DEBANK_ACCESS_KEY: ${{ secrets.DEBANK_ACCESS_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
EOF
    echo -e "${GREEN}✅ Workflow GitHub Actions créé${NC}"
else
    echo -e "${GREEN}✅ Workflow GitHub Actions existe déjà${NC}"
fi

# Vérifier si vercel.json existe
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  Création de vercel.json...${NC}"
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": [
    "iad1"
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "DEBANK_ACCESS_KEY": "@debank_access_key",
    "ANTHROPIC_API_KEY": "@anthropic_api_key",
    "FIREBLOCKS_API_KEY": "@fireblocks_api_key",
    "FIREBLOCKS_SECRET_KEY": "@fireblocks_secret_key",
    "LUXOR_API_KEY": "@luxor_api_key"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url",
      "NEXT_PUBLIC_API_URL": ""
    }
  }
}
EOF
    echo -e "${GREEN}✅ vercel.json créé${NC}"
else
    echo -e "${GREEN}✅ vercel.json existe déjà${NC}"
fi

# Vérifier si deploy.sh existe
if [ ! -f "deploy.sh" ]; then
    echo -e "${YELLOW}⚠️  Script deploy.sh non trouvé, mais ce n'est pas critique${NC}"
fi

echo ""

# 11. Résumé
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Configuration terminée !          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo -e "   ${BLUE}1.${NC} Configurez DATABASE_URL dans .env.local avec votre URL Prisma Accelerate"
echo -e "      Obtenez-la depuis: ${GREEN}https://console.prisma.io → Databases → Connection Strings${NC}"
echo -e "   ${BLUE}2.${NC} Vérifie que .env.local contient toutes tes clés API (DEBANK_ACCESS_KEY, etc.)"
echo -e "   ${BLUE}3.${NC} Lance le projet avec: ${GREEN}npm run dev${NC}"
echo -e "   ${BLUE}4.${NC} Ouvre: ${GREEN}http://localhost:3000/auth/signin${NC}"
echo -e "      Email: ${GREEN}admin@hearst.ai${NC}"
echo -e "      Mot de passe: ${GREEN}n'importe quel mot de passe${NC}"
echo ""

echo -e "${CYAN}🚀 Déploiement GitHub + Vercel:${NC}"
echo -e "   ${BLUE}1.${NC} Configure le repo GitHub: ${GREEN}git remote add origin <url>${NC}"
echo -e "   ${BLUE}2.${NC} Déploie avec: ${GREEN}./deploy.sh${NC}"
echo -e "   ${BLUE}3.${NC} Configure les secrets GitHub Actions:"
echo -e "      - VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo -e "      - DATABASE_URL (URL Prisma Accelerate), NEXTAUTH_SECRET, DEBANK_ACCESS_KEY"
echo -e "   ${BLUE}4.${NC} Configure les variables d'environnement sur Vercel:"
echo -e "      - DATABASE_URL: ${GREEN}URL Prisma Accelerate (prisma+postgres://accelerate...){NC}"
echo -e "      - NEXTAUTH_URL: ${GREEN}URL de votre app Vercel${NC}"
echo -e "      - NEXTAUTH_SECRET, DEBANK_ACCESS_KEY, etc."
echo ""

echo -e "${CYAN}💡 Astuces:${NC}"
echo -e "   - Pour tout réinitialiser: ${GREEN}./reset.sh${NC}"
echo -e "   - Pour mettre à jour: ${GREEN}./setup.sh${NC} (peut être relancé à tout moment)"
echo -e "   - Pour déployer: ${GREEN}./deploy.sh${NC}"
echo -e "   - Logs backend: ${GREEN}tail -f /tmp/hearst-backend.log${NC}"
echo -e "   - Logs frontend: ${GREEN}tail -f /tmp/hearst-frontend.log${NC}"
echo ""
