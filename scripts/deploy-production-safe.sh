#!/bin/bash

# 🔒 Script de déploiement sécurisé en production
# Nécessite une confirmation explicite avant de déployer

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🔒 DÉPLOIEMENT PRODUCTION SÉCURISÉ - HEARSTAI${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI n'est pas installé${NC}"
    echo -e "${YELLOW}Installez-le avec: npm i -g vercel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI trouvé${NC}"
echo ""

# Étape 1: Vérifier les tests de protection
echo -e "${BLUE}📋 Étape 1: Vérification des tests de protection${NC}"
echo ""

if node scripts/test-login-redirect.js; then
    echo -e "${GREEN}✅ Tests de protection passés${NC}"
else
    echo -e "${RED}❌ Tests de protection échoués${NC}"
    echo -e "${YELLOW}Corrige les problèmes avant de déployer en production${NC}"
    exit 1
fi

echo ""

# Étape 2: Afficher les informations du déploiement
echo -e "${BLUE}📋 Étape 2: Informations du déploiement${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
LAST_COMMIT=$(git log -1 --oneline)
PROJECT_URL="https://hearstai.vercel.app"

echo -e "${CYAN}Branche:${NC} ${CURRENT_BRANCH}"
echo -e "${CYAN}Dernier commit:${NC} ${LAST_COMMIT}"
echo -e "${CYAN}URL de production:${NC} ${PROJECT_URL}"
echo ""

# Étape 3: Avertissement et confirmation
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}  ⚠️  ATTENTION : DÉPLOIEMENT EN PRODUCTION${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Ce déploiement va:${NC}"
echo -e "  • Déployer sur ${CYAN}${PROJECT_URL}${NC}"
echo -e "  • Remplacer la version actuelle en production"
echo -e "  • Être visible par tous les utilisateurs"
echo ""
echo -e "${YELLOW}Vérifications effectuées:${NC}"
echo -e "  ✅ Tests de protection de la redirection"
echo -e "  ✅ Branche: ${CURRENT_BRANCH}"
echo -e "  ✅ Dernier commit: ${LAST_COMMIT}"
echo ""

# Demander confirmation
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
read -p "⚠️  Êtes-vous SÛR de vouloir déployer en PRODUCTION ? (tapez 'DEPLOY' en majuscules) " -r
echo ""

if [[ ! $REPLY == "DEPLOY" ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    echo -e "${BLUE}Pour déployer, vous devez taper exactement: DEPLOY${NC}"
    exit 1
fi

echo ""

# Étape 4: Dernière confirmation
read -p "⚠️  Dernière confirmation: Déployer sur ${PROJECT_URL} ? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Déploiement annulé${NC}"
    exit 1
fi

echo ""

# Étape 5: Déploiement
echo -e "${BLUE}📋 Étape 5: Déploiement en cours...${NC}"
echo ""

if vercel --prod; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✅ DÉPLOIEMENT RÉUSSI${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📊 Résumé:${NC}"
    echo -e "  • URL: ${CYAN}${PROJECT_URL}${NC}"
    echo -e "  • Commit: ${CYAN}${LAST_COMMIT}${NC}"
    echo -e "  • Statut: ${GREEN}✅ Déployé${NC}"
    echo ""
    echo -e "${BLUE}💡 Prochaines étapes:${NC}"
    echo -e "  1. Attends 30-60 secondes que le déploiement se termine"
    echo -e "  2. Teste le login sur ${CYAN}${PROJECT_URL}/auth/signin${NC}"
    echo -e "  3. Vérifie que la redirection fonctionne correctement"
    echo ""
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ❌ DÉPLOIEMENT ÉCHOUÉ${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Vérifie les erreurs ci-dessus${NC}"
    exit 1
fi


