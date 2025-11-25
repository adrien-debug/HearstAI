#!/bin/bash

# 🔧 Script pour corriger NEXTAUTH_URL sur Vercel
# Usage: ./scripts/fix-nextauth-url.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🔧 CORRECTION NEXTAUTH_URL - VERCEL${NC}"
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

# URL correcte
CORRECT_URL="https://hearstai.vercel.app"

echo -e "${BLUE}📋 URL correcte: ${CYAN}${CORRECT_URL}${NC}"
echo ""

# Vérifier les variables actuelles
echo -e "${BLUE}🔍 Vérification des variables actuelles...${NC}"
echo ""

vercel env ls | grep -i "NEXTAUTH" || echo -e "${YELLOW}⚠️  Aucune variable NEXTAUTH trouvée${NC}"

echo ""
echo -e "${YELLOW}⚠️  ACTION MANUELLE REQUISE${NC}"
echo ""
echo -e "${BLUE}Pour corriger NEXTAUTH_URL, exécutez ces commandes:${NC}"
echo ""
echo -e "${CYAN}1. Supprimer l'ancienne valeur (si elle existe):${NC}"
echo -e "   ${GREEN}vercel env rm NEXTAUTH_URL production --yes${NC}"
echo ""
echo -e "${CYAN}2. Ajouter la nouvelle valeur:${NC}"
echo -e "   ${GREEN}vercel env add NEXTAUTH_URL production${NC}"
echo -e "   ${YELLOW}Quand demandé, entrez: ${CORRECT_URL}${NC}"
echo ""
echo -e "${CYAN}3. Faire de même pour Preview (optionnel):${NC}"
echo -e "   ${GREEN}vercel env add NEXTAUTH_URL preview${NC}"
echo -e "   ${YELLOW}Quand demandé, entrez: ${CORRECT_URL}${NC}"
echo ""
echo -e "${CYAN}4. Redéployer:${NC}"
echo -e "   ${GREEN}vercel --prod${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 ALTERNATIVE: Via Dashboard Vercel${NC}"
echo ""
echo -e "1. Va sur: ${CYAN}https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables${NC}"
echo -e "2. Trouve ${CYAN}NEXTAUTH_URL${NC}"
echo -e "3. Pour ${CYAN}Production${NC}: Change en ${GREEN}${CORRECT_URL}${NC}"
echo -e "4. Pour ${CYAN}Preview${NC}: Change en ${GREEN}${CORRECT_URL}${NC}"
echo -e "5. Sauvegarde"
echo -e "6. Redéploie: ${GREEN}vercel --prod${NC}"
echo ""


