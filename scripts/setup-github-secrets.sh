#!/bin/bash

# Script pour configurer les secrets GitHub Actions
# Nécessite GitHub CLI (gh) installé et authentifié

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔐 Configuration des secrets GitHub Actions...${NC}\n"

# Vérifier GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) n'est pas installé${NC}"
    echo -e "${YELLOW}   Installe-le avec: brew install gh${NC}"
    exit 1
fi

# Vérifier l'authentification
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI n'est pas authentifié${NC}"
    echo -e "${CYAN}   Authentification...${NC}"
    gh auth login
fi

# IDs Vercel (depuis VERCEL_IDS.md ou .vercel/project.json)
if [ -f ".vercel/project.json" ]; then
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
else
    # Valeurs par défaut
    ORG_ID="team_24ksZavpe77QgViQF5OhZ4Hc"
    PROJECT_ID="prj_Y9b1LDmGKluAPN3RmbHlNBb7eQ2j"
fi

echo -e "${CYAN}📋 IDs Vercel:${NC}"
echo -e "   Org ID: ${ORG_ID}"
echo -e "   Project ID: ${PROJECT_ID}\n"

# VERCEL_TOKEN
echo -e "${CYAN}🔑 Configuration de VERCEL_TOKEN...${NC}"
echo -e "${YELLOW}⚠️  Tu dois créer un token Vercel:${NC}"
echo -e "   1. Va sur https://vercel.com/account/tokens"
echo -e "   2. Crée un nouveau token"
echo -e "   3. Copie le token\n"

read -p "Colle ton VERCEL_TOKEN (ou appuie sur Entrée pour skip): " VERCEL_TOKEN

if [ -n "$VERCEL_TOKEN" ]; then
    echo -e "${CYAN}📝 Ajout de VERCEL_TOKEN...${NC}"
    echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN --repo adrien-debug/HearstAI
    echo -e "${GREEN}✅ VERCEL_TOKEN ajouté${NC}\n"
else
    echo -e "${YELLOW}⚠️  VERCEL_TOKEN non ajouté (tu peux le faire manuellement)${NC}\n"
fi

# VERCEL_ORG_ID
echo -e "${CYAN}📝 Ajout de VERCEL_ORG_ID...${NC}"
echo "$ORG_ID" | gh secret set VERCEL_ORG_ID --repo adrien-debug/HearstAI
echo -e "${GREEN}✅ VERCEL_ORG_ID ajouté${NC}\n"

# VERCEL_PROJECT_ID
echo -e "${CYAN}📝 Ajout de VERCEL_PROJECT_ID...${NC}"
echo "$PROJECT_ID" | gh secret set VERCEL_PROJECT_ID --repo adrien-debug/HearstAI
echo -e "${GREEN}✅ VERCEL_PROJECT_ID ajouté${NC}\n"

# Autres secrets depuis .env.local
if [ -f ".env.local" ]; then
    echo -e "${CYAN}📖 Lecture des secrets depuis .env.local...${NC}\n"
    
    # DATABASE_URL
    if grep -q "^DATABASE_URL=" .env.local; then
        DATABASE_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'"' -f2)
        if [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != '""' ]; then
            echo -e "${CYAN}📝 Ajout de DATABASE_URL...${NC}"
            echo "$DATABASE_URL" | gh secret set DATABASE_URL --repo adrien-debug/HearstAI
            echo -e "${GREEN}✅ DATABASE_URL ajouté${NC}\n"
        fi
    fi
    
    # NEXTAUTH_SECRET
    if grep -q "^NEXTAUTH_SECRET=" .env.local; then
        NEXTAUTH_SECRET=$(grep "^NEXTAUTH_SECRET=" .env.local | cut -d'"' -f2)
        if [ -n "$NEXTAUTH_SECRET" ] && [ "$NEXTAUTH_SECRET" != '""' ]; then
            echo -e "${CYAN}📝 Ajout de NEXTAUTH_SECRET...${NC}"
            echo "$NEXTAUTH_SECRET" | gh secret set NEXTAUTH_SECRET --repo adrien-debug/HearstAI
            echo -e "${GREEN}✅ NEXTAUTH_SECRET ajouté${NC}\n"
        fi
    fi
    
    # DEBANK_ACCESS_KEY
    if grep -q "^DEBANK_ACCESS_KEY=" .env.local; then
        DEBANK_KEY=$(grep "^DEBANK_ACCESS_KEY=" .env.local | cut -d'"' -f2)
        if [ -n "$DEBANK_KEY" ] && [ "$DEBANK_KEY" != '""' ]; then
            echo -e "${CYAN}📝 Ajout de DEBANK_ACCESS_KEY...${NC}"
            echo "$DEBANK_KEY" | gh secret set DEBANK_ACCESS_KEY --repo adrien-debug/HearstAI
            echo -e "${GREEN}✅ DEBANK_ACCESS_KEY ajouté${NC}\n"
        fi
    fi
fi

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Secrets GitHub Actions configurés ! ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}💡 Vérifie sur GitHub:${NC}"
echo -e "   https://github.com/adrien-debug/HearstAI/settings/secrets/actions\n"

