#!/bin/bash

# Script de test complet des APIs synchronisées
# Usage: ./test-all-apis.sh

echo "🧪 TESTS COMPLETS DES APIs SYNCHRONISÉES"
echo "========================================"
echo ""

FRONTEND_URL="http://localhost:6001"
BACKEND_URL="http://localhost:5001"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de test
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "  Response: $body"
        return 1
    fi
}

# Tests Frontend
echo "📡 TESTS FRONTEND (Next.js API Routes)"
echo "--------------------------------------"

test_endpoint "Health Check" "$FRONTEND_URL/api/health"
test_endpoint "Calculator Metrics" "$FRONTEND_URL/api/calculator/metrics"
test_endpoint "Setup Miners" "$FRONTEND_URL/api/setup/miners"
test_endpoint "Setup Hosters" "$FRONTEND_URL/api/setup/hosters"
test_endpoint "Setup Prices" "$FRONTEND_URL/api/setup/prices"
test_endpoint "Setup Summary" "$FRONTEND_URL/api/setup/summary"
test_endpoint "Transactions" "$FRONTEND_URL/api/transactions"
test_endpoint "Wallets" "$FRONTEND_URL/api/wallets"
test_endpoint "Hashprice Current" "$FRONTEND_URL/api/hashprice/current"
test_endpoint "Profitability Summary" "$FRONTEND_URL/api/profitability/summary"

echo ""
echo "📡 TESTS BACKEND (Express API)"
echo "--------------------------------"

test_endpoint "Backend Health" "$BACKEND_URL/api/health"
test_endpoint "Hashprice Lite" "$BACKEND_URL/api/hashprice-lite"
test_endpoint "Calculator Metrics (Backend)" "$BACKEND_URL/api/calculator/metrics"

echo ""
echo "📊 RÉSUMÉ"
echo "--------"
echo "Tests effectués. Vérifiez les résultats ci-dessus."
echo ""
echo "💡 Pour démarrer les serveurs:"
echo "  Backend:  cd backend && npm start"
echo "  Frontend: npm run dev"
echo ""

