#!/bin/bash

# Script de déploiement GitHub + Vercel pour HearstAI
# Ce script prépare et déploie le projet sur GitHub et Vercel

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Déploiement GitHub + Vercel       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}\n"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# 1. Vérifier Git
echo -e "${CYAN}📦 Vérification de Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé${NC}"
    exit 1
fi

# Vérifier si c'est un repo Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Initialisation du repo Git...${NC}"
    git init
    echo -e "${GREEN}✅ Repo Git initialisé${NC}\n"
else
    echo -e "${GREEN}✅ Repo Git détecté${NC}\n"
fi

# 2. Vérifier les changements
echo -e "${CYAN}📋 Vérification des changements...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}\n"
else
    echo -e "${BLUE}   Changements détectés:${NC}"
    git status --short | head -10
    echo ""
    
    read -p "Voulez-vous commiter ces changements ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Message de commit: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update: $(date +%Y-%m-%d)"
        fi
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Changements commités${NC}\n"
    fi
fi

# 3. Vérifier la branche
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo -e "${CYAN}🌿 Branche actuelle: ${CURRENT_BRANCH}${NC}"

# 4. Vérifier le remote GitHub
echo -e "${CYAN}🔗 Vérification du remote GitHub...${NC}"
if git remote get-url origin &> /dev/null; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ Remote GitHub configuré: ${REMOTE_URL}${NC}\n"
else
    echo -e "${YELLOW}⚠️  Aucun remote GitHub configuré${NC}"
    read -p "URL du repo GitHub (ex: https://github.com/user/repo.git): " GITHUB_URL
    if [ -n "$GITHUB_URL" ]; then
        git remote add origin "$GITHUB_URL"
        echo -e "${GREEN}✅ Remote GitHub ajouté${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Remote GitHub non configuré, on continue...${NC}\n"
    fi
fi

# 5. Push vers GitHub
if git remote get-url origin &> /dev/null; then
    echo -e "${CYAN}📤 Push vers GitHub...${NC}"
    read -p "Voulez-vous push vers GitHub ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin "$CURRENT_BRANCH" || {
            echo -e "${YELLOW}⚠️  Push échoué, essayons de forcer...${NC}"
            read -p "Voulez-vous forcer le push ? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push -u origin "$CURRENT_BRANCH" --force
            fi
        }
        echo -e "${GREEN}✅ Push vers GitHub réussi${NC}\n"
    fi
fi

# 6. Vérifier Vercel CLI
echo -e "${CYAN}🔍 Vérification de Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI n'est pas installé${NC}"
    read -p "Voulez-vous installer Vercel CLI ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI installé${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Vercel CLI non installé, on continue...${NC}\n"
    fi
else
    echo -e "${GREEN}✅ Vercel CLI installé${NC}\n"
fi

# 7. Déployer sur Vercel
if command -v vercel &> /dev/null; then
    echo -e "${CYAN}🚀 Déploiement sur Vercel...${NC}"
    read -p "Voulez-vous déployer sur Vercel ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f ".vercel/project.json" ]; then
            echo -e "${BLUE}   Projet Vercel détecté, déploiement...${NC}"
            vercel --prod
        else
            echo -e "${BLUE}   Premier déploiement, configuration...${NC}"
            vercel
            echo -e "${YELLOW}⚠️  Configure les variables d'environnement sur Vercel:${NC}"
            echo -e "   - DATABASE_URL"
            echo -e "   - NEXTAUTH_SECRET"
            echo -e "   - NEXTAUTH_URL"
            echo -e "   - DEBANK_ACCESS_KEY"
            echo -e "   - ANTHROPIC_API_KEY (optionnel)"
            echo -e "   - FIREBLOCKS_API_KEY (optionnel)"
            echo -e "   - FIREBLOCKS_SECRET_KEY (optionnel)"
            echo -e "   - LUXOR_API_KEY (optionnel)"
        fi
        echo -e "${GREEN}✅ Déploiement Vercel terminé${NC}\n"
    fi
fi

# 8. Résumé
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Déploiement terminé !             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo -e "   ${BLUE}1.${NC} Configure les secrets GitHub Actions:"
echo -e "      - VERCEL_TOKEN"
echo -e "      - VERCEL_ORG_ID"
echo -e "      - VERCEL_PROJECT_ID"
echo -e "      - DATABASE_URL"
echo -e "      - NEXTAUTH_SECRET"
echo -e "      - DEBANK_ACCESS_KEY"
echo -e ""
echo -e "   ${BLUE}2.${NC} Configure les variables d'environnement sur Vercel"
echo -e "   ${BLUE}3.${NC} Les déploiements automatiques se feront via GitHub Actions"
echo ""


