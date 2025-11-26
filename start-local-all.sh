#!/bin/bash

# ============================================
# Script de démarrage complet en LOCAL
# Démarre Frontend (Next.js), Backend (Express) et toutes les APIs
# ============================================

# set -e  # Désactivé pour permettre la gestion d'erreurs manuelle

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🚀 HearstAI - Démarrage complet en LOCAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Configuration des ports (TOUT EN LOCAL)
BACKEND_PORT=4000
FRONTEND_PORT=6001

# Fonction pour libérer les ports
free_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}⚠️  Port $port déjà utilisé, arrêt du processus $pid...${NC}"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Libérer les ports avant de démarrer
free_port $BACKEND_PORT
free_port $FRONTEND_PORT

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt des serveurs...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    free_port $BACKEND_PORT
    free_port $FRONTEND_PORT
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

# 3. Générer Prisma si nécessaire
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${CYAN}🔧 Génération de Prisma...${NC}"
    if ! npx prisma generate 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Prisma generate a échoué (peut être normal si déjà généré)${NC}"
    else
        echo -e "${GREEN}✅ Prisma généré${NC}"
    fi
    echo ""
fi

# 4. Démarrer le backend Express (port 4000) - accessible sur le réseau local
echo -e "${CYAN}🔌 Démarrage du backend Express (accessible sur le réseau local)...${NC}"
cd backend
PORT=$BACKEND_PORT HOST=0.0.0.0 node server.js > /tmp/hearst-backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 4

# Vérifier que le backend est démarré
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend Express démarré (PID: $BACKEND_PID)${NC}"
    echo -e "   URL: http://localhost:$BACKEND_PORT"
    echo -e "   API: http://localhost:$BACKEND_PORT/api"
    echo -e "   Health: http://localhost:$BACKEND_PORT/api/health"
    
    # Attendre un peu et tester le health check
    sleep 2
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Health check réussi${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Health check non disponible (peut être normal)${NC}"
    fi
else
    echo -e "${RED}❌ Erreur au démarrage du backend${NC}"
    echo -e "${RED}Logs:${NC}"
    cat /tmp/hearst-backend.log
    echo ""
    echo -e "${RED}Vérifiez les logs ci-dessus pour plus de détails${NC}"
    exit 1
fi
echo ""

# 5. Configurer les variables d'environnement pour le frontend
export NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT"

# 6. Démarrer le frontend Next.js (port 6001) - accessible sur le réseau local
echo -e "${CYAN}⚡ Démarrage du frontend Next.js (accessible sur le réseau local)...${NC}"
# Utiliser -H 0.0.0.0 pour rendre accessible sur le réseau local
PORT=$FRONTEND_PORT HOSTNAME=0.0.0.0 npx next dev -p $FRONTEND_PORT -H 0.0.0.0 > /tmp/hearst-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 6

# Vérifier que le frontend est démarré
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend Next.js démarré (PID: $FRONTEND_PID)${NC}"
    echo -e "   URL: http://localhost:$FRONTEND_PORT"
    echo -e "   API Routes: http://localhost:$FRONTEND_PORT/api/*"
    
    # Attendre un peu et tester le health check
    sleep 3
    if curl -s http://localhost:$FRONTEND_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Health check réussi${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Health check non disponible (Next.js peut prendre du temps)${NC}"
    fi
else
    echo -e "${RED}❌ Erreur au démarrage du frontend${NC}"
    echo -e "${RED}Logs:${NC}"
    tail -50 /tmp/hearst-frontend.log
    echo ""
    echo -e "${RED}Vérifiez les logs ci-dessus pour plus de détails${NC}"
    echo -e "${YELLOW}Logs complets: tail -f /tmp/hearst-frontend.log${NC}"
    exit 1
fi
echo ""

# 7. Attendre un peu pour que tout soit prêt
echo -e "${CYAN}⏳ Attente de 3 secondes pour que les serveurs soient prêts...${NC}"
sleep 3

# 8. Tester les health checks
echo -e "${CYAN}🧪 Test des health checks...${NC}"
if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend health check: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check: Non accessible (peut être normal au démarrage)${NC}"
fi

if curl -s http://localhost:$FRONTEND_PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend health check: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check: Non accessible (peut être normal au démarrage)${NC}"
fi
echo ""

# 9. Récupérer l'adresse IP locale
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "VOTRE_IP_LOCALE")
fi

# 10. Afficher le résumé
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Tous les serveurs sont démarrés et accessibles sur le réseau local!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}🌐 Frontend Next.js:${NC}"
echo -e "   Local:    http://localhost:$FRONTEND_PORT"
echo -e "   Réseau:   http://$LOCAL_IP:$FRONTEND_PORT"
echo ""
echo -e "${CYAN}🔌 Backend Express:${NC}"
echo -e "   Local:    http://localhost:$BACKEND_PORT"
echo -e "   Réseau:   http://$LOCAL_IP:$BACKEND_PORT"
echo ""
echo -e "${CYAN}📡 API Routes:${NC}"
echo -e "   Local:    http://localhost:$FRONTEND_PORT/api/*"
echo -e "   Réseau:   http://$LOCAL_IP:$FRONTEND_PORT/api/*"
echo ""
echo -e "${CYAN}📋 Routes API disponibles:${NC}"
echo -e "   • http://localhost:$FRONTEND_PORT/api/health"
echo -e "   • http://localhost:$FRONTEND_PORT/api/status"
echo -e "   • http://localhost:$FRONTEND_PORT/api/collateral"
echo -e "   • http://localhost:$FRONTEND_PORT/api/customers"
echo -e "   • http://localhost:$FRONTEND_PORT/api/fireblocks/vaults"
echo -e "   • http://localhost:$BACKEND_PORT/api/projects"
echo -e "   • http://localhost:$BACKEND_PORT/api/jobs"
echo ""
echo -e "${CYAN}📝 Logs:${NC}"
echo -e "   Backend:  tail -f /tmp/hearst-backend.log"
echo -e "   Frontend: tail -f /tmp/hearst-frontend.log"
echo ""
echo -e "${YELLOW}⚠️  Appuyez sur Ctrl+C pour arrêter tous les serveurs${NC}"
echo ""

# Attendre les processus
wait $BACKEND_PID $FRONTEND_PID

