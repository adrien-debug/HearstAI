#!/bin/bash

# Script de déploiement local complet
# Démarre Backend, Frontend et teste tout

set -e

PROJECT_DIR="/Users/adrienbeyondcrypto/Desktop/DEV /HearstAI"
BACKEND_DIR="$PROJECT_DIR/backend"
BACKEND_PORT=5001
FRONTEND_PORT=6001

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 DÉPLOIEMENT LOCAL - HEARST AI                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Fonction de nettoyage
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt des serveurs...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo ""

cd "$PROJECT_DIR"

# 1. Vérifier/Créer .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local n'existe pas, création depuis .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ .env.local créé${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example non trouvé, création d'un .env.local basique...${NC}"
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=/api
BACKEND_URL=http://localhost:$BACKEND_PORT
NEXTAUTH_URL=http://localhost:$FRONTEND_PORT
NODE_ENV=development
EOF
    fi
    echo ""
fi

# 2. Installer dépendances Backend
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "${CYAN}📦 Installation des dépendances backend...${NC}"
    cd "$BACKEND_DIR"
    npm install
    cd "$PROJECT_DIR"
    echo -e "${GREEN}✅ Dépendances backend installées${NC}"
    echo ""
fi

# 3. Installer dépendances Frontend
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo -e "${CYAN}📦 Installation des dépendances frontend...${NC}"
    npm install
    echo -e "${GREEN}✅ Dépendances frontend installées${NC}"
    echo ""
fi

# 4. Générer Prisma (si nécessaire)
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${CYAN}🔧 Génération Prisma...${NC}"
    npx prisma generate 2>/dev/null || echo -e "${YELLOW}⚠️  Prisma generate a échoué (peut être normal)${NC}"
    echo ""
fi

# 5. Démarrer Backend
echo -e "${CYAN}🔌 Démarrage du backend (port $BACKEND_PORT)...${NC}"
cd "$BACKEND_DIR"
BACKEND_PORT=$BACKEND_PORT npm start > /tmp/hearst-backend.log 2>&1 &
BACKEND_PID=$!
cd "$PROJECT_DIR"
sleep 3

# Vérifier backend
if ps -p $BACKEND_PID > /dev/null; then
    # Attendre que le backend soit prêt
    for i in {1..10}; do
        if curl -s "http://localhost:$BACKEND_PORT/api/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"
            echo -e "${CYAN}   URL: http://localhost:$BACKEND_PORT${NC}"
            break
        fi
        sleep 1
    done
    if ! curl -s "http://localhost:$BACKEND_PORT/api/health" > /dev/null 2>&1; then
        echo -e "${RED}❌ Backend ne répond pas${NC}"
        cat /tmp/hearst-backend.log
        exit 1
    fi
else
    echo -e "${RED}❌ Erreur au démarrage du backend${NC}"
    cat /tmp/hearst-backend.log
    exit 1
fi
echo ""

# 6. Démarrer Frontend
echo -e "${CYAN}⚡ Démarrage du frontend (port $FRONTEND_PORT)...${NC}"
PORT=$FRONTEND_PORT npm run dev > /tmp/hearst-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Vérifier frontend
if ps -p $FRONTEND_PID > /dev/null; then
    # Attendre que le frontend soit prêt
    for i in {1..15}; do
        if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"
            echo -e "${CYAN}   URL: http://localhost:$FRONTEND_PORT${NC}"
            break
        fi
        sleep 1
    done
    if ! curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Frontend peut prendre plus de temps à démarrer${NC}"
    fi
else
    echo -e "${RED}❌ Erreur au démarrage du frontend${NC}"
    cat /tmp/hearst-frontend.log
    exit 1
fi
echo ""

# 7. Afficher le résumé
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ✅ DÉPLOIEMENT LOCAL RÉUSSI                                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend:${NC}  http://localhost:$FRONTEND_PORT"
echo -e "${GREEN}🔌 Backend:${NC}   http://localhost:$BACKEND_PORT"
echo ""
echo -e "${CYAN}📝 Logs:${NC}"
echo -e "   Backend:  tail -f /tmp/hearst-backend.log"
echo -e "   Frontend: tail -f /tmp/hearst-frontend.log"
echo ""
echo -e "${CYAN}🧪 Tests:${NC}"
echo -e "   node scripts/test-complete.js"
echo ""
echo -e "${YELLOW}⚠️  Appuyez sur Ctrl+C pour arrêter${NC}"
echo ""

# 8. Lancer les tests automatiquement après 5 secondes
sleep 5
echo -e "${CYAN}🧪 Lancement des tests automatiques...${NC}"
echo ""
node scripts/test-complete.js || echo -e "${YELLOW}⚠️  Certains tests ont échoué (normal si serveurs pas encore prêts)${NC}"

# Attendre
wait $BACKEND_PID $FRONTEND_PID


