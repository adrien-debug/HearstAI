#!/bin/bash
# Script de test complet pour vérifier que tout fonctionne en local

echo "🧪 Test complet de la configuration locale..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Test 1: Vérifier Node.js
echo "1. Test Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js non installé${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 2: Vérifier les dépendances backend
echo "2. Test dépendances backend..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend node_modules existe${NC}"
else
    echo -e "${RED}❌ Backend node_modules manquant${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 3: Vérifier les dépendances frontend
echo "3. Test dépendances frontend..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Frontend node_modules existe${NC}"
else
    echo -e "${RED}❌ Frontend node_modules manquant${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test 4: Vérifier les ports
echo "4. Test ports..."
BACKEND_PORT=4000
FRONTEND_PORT=6001

if lsof -ti:$BACKEND_PORT &>/dev/null; then
    echo -e "${YELLOW}⚠️  Port $BACKEND_PORT utilisé${NC}"
else
    echo -e "${GREEN}✅ Port $BACKEND_PORT libre${NC}"
fi

if lsof -ti:$FRONTEND_PORT &>/dev/null; then
    echo -e "${YELLOW}⚠️  Port $FRONTEND_PORT utilisé${NC}"
else
    echo -e "${GREEN}✅ Port $FRONTEND_PORT libre${NC}"
fi

# Test 5: Test démarrage backend
echo "5. Test démarrage backend..."
cd backend
PORT=$BACKEND_PORT node server.js > /tmp/test-backend-full.log 2>&1 &
BACKEND_PID=$!
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend démarre correctement${NC}"
    
    # Test health check
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend health check OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend health check échoué${NC}"
    fi
    
    kill $BACKEND_PID 2>/dev/null
    sleep 1
else
    echo -e "${RED}❌ Backend ne démarre pas${NC}"
    cat /tmp/test-backend-full.log
    ERRORS=$((ERRORS + 1))
fi
cd ..

# Test 6: Vérifier Prisma
echo "6. Test Prisma..."
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✅ Prisma schema existe${NC}"
    if npx prisma generate --dry-run &>/dev/null; then
        echo -e "${GREEN}✅ Prisma peut être généré${NC}"
    else
        echo -e "${YELLOW}⚠️  Prisma generate a des warnings${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Prisma schema non trouvé${NC}"
fi

# Test 7: Vérifier Chart.js local
echo "7. Test Chart.js local..."
if [ -f "public/js/chart.umd.min.js" ]; then
    echo -e "${GREEN}✅ Chart.js local existe${NC}"
else
    echo -e "${RED}❌ Chart.js local manquant${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
    echo ""
    echo "Vous pouvez démarrer avec: ./start-local-all.sh"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
    echo ""
    echo "Corrigez les erreurs avant de démarrer."
    exit 1
fi





