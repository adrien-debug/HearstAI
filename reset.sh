#!/bin/bash

# Script de réinitialisation complète de HearstAI
# ATTENTION: Ce script supprime les données locales (base de données, cache, etc.)
# Mais préserve .env.local et les fichiers de configuration

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════╗${NC}"
echo -e "${RED}║  ⚠️  RÉINITIALISATION COMPLÈTE         ║${NC}"
echo -e "${RED}╚════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}Ce script va:${NC}"
echo -e "  ❌ Arrêter tous les serveurs"
echo -e "  ❌ Supprimer node_modules"
echo -e "  ❌ Supprimer .next (cache Next.js)"
echo -e "  ❌ Supprimer la base de données locale"
echo -e "  ❌ Nettoyer les logs"
echo -e "  ✅ Préserver .env.local (sauvegardé)"
echo ""

read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'RESET' pour confirmer): " CONFIRM

if [ "$CONFIRM" != "RESET" ]; then
    echo -e "${YELLOW}❌ Annulé${NC}"
    exit 0
fi

echo -e "\n${CYAN}🛑 Arrêt des serveurs...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:6001 | xargs kill -9 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Serveurs arrêtés${NC}\n"

echo -e "${CYAN}💾 Sauvegarde de .env.local...${NC}"
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    echo -e "${GREEN}✅ .env.local sauvegardé${NC}\n"
fi

echo -e "${CYAN}🗑️  Suppression de node_modules...${NC}"
rm -rf node_modules
echo -e "${GREEN}✅ node_modules supprimé${NC}\n"

echo -e "${CYAN}🗑️  Suppression du cache Next.js...${NC}"
rm -rf .next
echo -e "${GREEN}✅ Cache Next.js supprimé${NC}\n"

echo -e "${CYAN}🗑️  Suppression de la base de données...${NC}"
rm -f prisma/storage/*.db
rm -f prisma/storage/*.db-journal
rm -f prisma/storage/*.db-wal
rm -f prisma/storage/*.db-shm
echo -e "${GREEN}✅ Base de données supprimée${NC}\n"

echo -e "${CYAN}🗑️  Nettoyage des logs...${NC}"
rm -f /tmp/hearst-backend.log
rm -f /tmp/hearst-frontend.log
rm -f *.log
echo -e "${GREEN}✅ Logs supprimés${NC}\n"

echo -e "${CYAN}🔄 Réinstallation...${NC}"
echo -e "${YELLOW}   Exécution de setup.sh...${NC}\n"

# Exécuter setup.sh
./setup.sh

echo -e "\n${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Réinitialisation terminée !       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}📋 Prochaines étapes:${NC}"
echo -e "   ${GREEN}1.${NC} Vérifie que .env.local est correct (restauré depuis backup)"
echo -e "   ${GREEN}2.${NC} Lance: ${GREEN}./start-local-all.sh${NC}"
echo ""


