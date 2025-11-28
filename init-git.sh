#!/bin/bash

# Script pour initialiser Git et préparer le push vers GitHub

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}📦 Initialisation de Git pour HearstAI${NC}\n"

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé${NC}"
    exit 1
fi

# Vérifier si on est déjà dans un repo Git
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Un dépôt Git existe déjà${NC}"
    read -p "Voulez-vous continuer ? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Initialiser Git
    echo -e "${CYAN}🔧 Initialisation de Git...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialisé${NC}\n"
fi

# Vérifier le statut
echo -e "${CYAN}📋 Statut actuel:${NC}"
git status --short

echo ""
read -p "Voulez-vous ajouter tous les fichiers et créer le premier commit ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Ajouter tous les fichiers
    echo -e "${CYAN}📝 Ajout des fichiers...${NC}"
    git add .
    echo -e "${GREEN}✅ Fichiers ajoutés${NC}\n"
    
    # Créer le premier commit
    echo -e "${CYAN}💾 Création du commit initial...${NC}"
    git commit -m "Initial commit: HearstAI Collateral Management Platform

- Configuration automatique avec setup.sh
- Intégration DeBank API
- Gestion des clients et positions collatérales
- Vue détaillée des positions
- Prêt pour déploiement Vercel"
    echo -e "${GREEN}✅ Commit créé${NC}\n"
    
    # Demander l'URL du remote
    echo -e "${CYAN}🔗 Configuration du remote GitHub${NC}"
    echo -e "${YELLOW}💡 Si tu n'as pas encore créé le repo sur GitHub:${NC}"
    echo -e "   1. Va sur https://github.com/new"
    echo -e "   2. Crée un nouveau repository (ex: hearstai)"
    echo -e "   3. Ne coche PAS 'Initialize with README'"
    echo ""
    read -p "URL du repository GitHub (ex: https://github.com/username/hearstai.git) ou appuie sur Entrée pour passer: " GITHUB_URL
    
    if [ ! -z "$GITHUB_URL" ]; then
        # Vérifier si le remote existe déjà
        if git remote | grep -q "origin"; then
            echo -e "${YELLOW}⚠️  Le remote 'origin' existe déjà${NC}"
            read -p "Voulez-vous le remplacer ? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git remote set-url origin "$GITHUB_URL"
            fi
        else
            git remote add origin "$GITHUB_URL"
        fi
        
        echo -e "${GREEN}✅ Remote configuré${NC}\n"
        
        # Demander si on veut pousser
        read -p "Voulez-vous pousser vers GitHub maintenant ? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Créer la branche main si elle n'existe pas
            git branch -M main
            
            echo -e "${CYAN}🚀 Push vers GitHub...${NC}"
            git push -u origin main
            echo -e "${GREEN}✅ Code poussé vers GitHub !${NC}\n"
        fi
    fi
fi

echo -e "${GREEN}✅ Configuration Git terminée !${NC}\n"
echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo -e "   1. Si pas encore fait, crée le repo sur GitHub"
echo -e "   2. Configure le remote: ${GREEN}git remote add origin <url>${NC}"
echo -e "   3. Push: ${GREEN}git push -u origin main${NC}"
echo -e "   4. Déploie sur Vercel (voir DEPLOY.md)"
echo ""





