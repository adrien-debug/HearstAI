#!/bin/bash

# Script de démarrage complet - Frontend, Backend et API
# Démarre tous les serveurs nécessaires pour HearstAI

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 Démarrage complet HearstAI - Frontend, Backend & API${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt des serveurs...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "   Installez Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js détecté: $(node --version)${NC}"
echo ""

# Vérifier le répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

# 1. Installer les dépendances backend si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo -e "${CYAN}📦 Installation des dépendances backend...${NC}"
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✅ Dépendances backend installées${NC}"
    echo ""
fi

# 2. Installer les dépendances frontend si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${CYAN}📦 Installation des dépendances frontend...${NC}"
    npm install
    echo -e "${GREEN}✅ Dépendances frontend installées${NC}"
    echo ""
fi

# 3. Démarrer le backend Express
echo -e "${CYAN}🔌 Démarrage du backend Express...${NC}"
cd backend
PORT=5001 BACKEND_PORT=5001 node server.js > /tmp/hearst-backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

# Vérifier que le backend est démarré
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend Express démarré (PID: $BACKEND_PID) sur http://localhost:5001${NC}"
    echo -e "   Health: http://localhost:5001/api/health"
else
    echo -e "${RED}❌ Erreur au démarrage du backend${NC}"
    cat /tmp/hearst-backend.log
    exit 1
fi
echo ""

# 4. Démarrer le frontend Next.js (qui contient aussi les routes API)
echo -e "${CYAN}⚡ Démarrage du frontend Next.js (avec routes API)...${NC}"
PORT=6001 npm run dev > /tmp/hearst-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Vérifier que le frontend est démarré
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend Next.js démarré (PID: $FRONTEND_PID) sur http://localhost:6001${NC}"
    echo -e "   Health: http://localhost:6001/api/health"
    echo -e "   Status: http://localhost:6001/api/status"
else
    echo -e "${RED}❌ Erreur au démarrage du frontend${NC}"
    cat /tmp/hearst-frontend.log
    exit 1
fi
echo ""

# 5. Attendre un peu pour que tout soit prêt
echo -e "${CYAN}⏳ Attente de 2 secondes pour que les serveurs soient prêts...${NC}"
sleep 2

# 6. Tester les health checks
echo -e "${CYAN}🧪 Test des health checks...${NC}"
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend health check: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check: Non accessible (peut être normal au démarrage)${NC}"
fi

if curl -s http://localhost:6001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend health check: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check: Non accessible (peut être normal au démarrage)${NC}"
fi
echo ""

# 7. Afficher le résumé
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Tous les serveurs sont démarrés!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}🌐 Frontend Next.js:${NC}  http://localhost:6001"
echo -e "${CYAN}🔌 Backend Express:${NC}   http://localhost:5001"
echo -e "${CYAN}📡 API Routes:${NC}       http://localhost:6001/api/*"
echo ""
echo -e "${CYAN}📋 Routes API disponibles:${NC}"
echo -e "   • http://localhost:6001/api/health"
echo -e "   • http://localhost:6001/api/status"
echo -e "   • http://localhost:6001/api/collateral"
echo -e "   • http://localhost:6001/api/fireblocks/vaults"
echo -e "   • http://localhost:6001/api/googledrive/auth/url"
echo ""
echo -e "${CYAN}📝 Logs:${NC}"
echo -e "   Backend:  tail -f /tmp/hearst-backend.log"
echo -e "   Frontend: tail -f /tmp/hearst-frontend.log"
echo ""
echo -e "${YELLOW}⚠️  Appuyez sur Ctrl+C pour arrêter tous les serveurs${NC}"
echo ""

# Attendre les processus
wait $BACKEND_PID $FRONTEND_PID


