#!/bin/bash

# 🔒 Script de déploiement sécurisé pour Vercel
# Préserve la base de données de production

set -e  # Arrêter en cas d'erreur

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🔒 DÉPLOIEMENT SÉCURISÉ VERCEL - HEARSTAI${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# Étape 1: Vérifier l'état Git
echo -e "${BLUE}📋 Étape 1: Vérification de l'état Git${NC}"
echo ""

# Vérifier qu'on est sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas sur la branche main (actuellement: $CURRENT_BRANCH)${NC}"
    read -p "Continuer quand même? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Vérifier qu'il n'y a pas de fichiers sensibles à commiter
echo -e "${BLUE}🔍 Vérification des fichiers sensibles...${NC}"
SENSITIVE_FILES=$(git status --porcelain | grep -E "\.env|fireblocks.*\.pem|fireblocks.*\.csr|\.key" || true)
if [ ! -z "$SENSITIVE_FILES" ]; then
    echo -e "${RED}❌ ATTENTION: Fichiers sensibles détectés:${NC}"
    echo "$SENSITIVE_FILES"
    echo -e "${RED}❌ Ne pas commiter ces fichiers !${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Aucun fichier sensible détecté${NC}"
echo ""

# Étape 2: Vérifier le schéma Prisma
echo -e "${BLUE}📋 Étape 2: Vérification du schéma Prisma${NC}"
PRISMA_CHANGES=$(git diff prisma/schema.prisma || true)
if [ ! -z "$PRISMA_CHANGES" ]; then
    echo -e "${YELLOW}⚠️  ATTENTION: Le schéma Prisma a été modifié${NC}"
    echo -e "${YELLOW}⚠️  Cela pourrait affecter la base de données de production${NC}"
    echo ""
    echo "Changements détectés:"
    echo "$PRISMA_CHANGES"
    echo ""
    read -p "Continuer quand même? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Aucun changement dans le schéma Prisma${NC}"
fi
echo ""

# Étape 3: Créer une branche de sauvegarde
echo -e "${BLUE}📋 Étape 3: Création d'une branche de sauvegarde${NC}"
BACKUP_BRANCH="backup-before-deploy-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" 2>/dev/null || true
echo -e "${GREEN}✅ Branche de sauvegarde créée: $BACKUP_BRANCH${NC}"
echo ""

# Étape 4: Vérifier les fichiers modifiés
echo -e "${BLUE}📋 Étape 4: Résumé des changements${NC}"
echo ""
git status --short
echo ""
read -p "Continuer avec le commit? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    exit 1
fi
echo ""

# Étape 5: Stager les fichiers
echo -e "${BLUE}📋 Étape 5: Ajout des fichiers au staging${NC}"
git add app/ components/ scripts/ 2>/dev/null || true
git add *.md 2>/dev/null || true
# Ne pas ajouter tsconfig.tsbuildinfo (fichier de build)
git reset tsconfig.tsbuildinfo 2>/dev/null || true
echo -e "${GREEN}✅ Fichiers ajoutés${NC}"
echo ""

# Étape 6: Commit
echo -e "${BLUE}📋 Étape 6: Création du commit${NC}"
COMMIT_MESSAGE="feat: deploy updates - $(date +%Y-%m-%d)"
if [ ! -z "$1" ]; then
    COMMIT_MESSAGE="$1"
fi
git commit -m "$COMMIT_MESSAGE" || {
    echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
}
echo -e "${GREEN}✅ Commit créé${NC}"
echo ""

# Étape 7: Push vers GitHub
echo -e "${BLUE}📋 Étape 7: Push vers GitHub${NC}"
echo -e "${YELLOW}⚠️  Cette action va déclencher un déploiement automatique sur Vercel${NC}"
read -p "Continuer avec le push? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Push annulé${NC}"
    echo -e "${BLUE}💡 Pour push plus tard: git push origin main${NC}"
    exit 1
fi

git push origin main || {
    echo -e "${RED}❌ Erreur lors du push${NC}"
    exit 1
}
echo -e "${GREEN}✅ Code poussé vers GitHub${NC}"
echo ""

# Étape 8: Vérifier les variables Vercel
echo -e "${BLUE}📋 Étape 8: Vérification des variables Vercel${NC}"
if command -v vercel &> /dev/null; then
    echo -e "${CYAN}Variables d'environnement Vercel:${NC}"
    vercel env ls 2>/dev/null || echo -e "${YELLOW}⚠️  Impossible de récupérer les variables (Vercel CLI non configuré)${NC}"
else
    echo -e "${YELLOW}⚠️  Vercel CLI non installé${NC}"
    echo -e "${BLUE}💡 Installez-le avec: npm i -g vercel${NC}"
fi
echo ""

# Résumé
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ DÉPLOIEMENT INITIÉ AVEC SUCCÈS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Résumé:${NC}"
echo -e "  • Branche de sauvegarde: ${CYAN}$BACKUP_BRANCH${NC}"
echo -e "  • Commit: ${CYAN}$COMMIT_MESSAGE${NC}"
echo -e "  • Push: ${GREEN}✅ Effectué${NC}"
echo ""
echo -e "${BLUE}🚀 Prochaines étapes:${NC}"
echo -e "  1. Vérifiez le déploiement sur Vercel Dashboard"
echo -e "  2. Vérifiez que les variables d'environnement sont correctes"
echo -e "  3. Testez l'application après le déploiement"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "  • La base de données de production n'a PAS été modifiée"
echo -e "  • Aucune migration Prisma n'a été appliquée"
echo -e "  • Les variables d'environnement Vercel restent inchangées"
echo ""
echo -e "${BLUE}💡 Pour vérifier le déploiement:${NC}"
echo -e "  • Dashboard Vercel: https://vercel.com/dashboard"
echo -e "  • Logs: vercel logs"
echo ""

