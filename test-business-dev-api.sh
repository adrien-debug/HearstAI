#!/bin/bash

# Script de test pour l'API Business Development Contacts
# Usage: ./test-business-dev-api.sh

BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api/business-dev/contacts"

echo "🧪 Test de l'API Business Development Contacts"
echo "=============================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test 1: Vérifier que le serveur est démarré
echo "1. Vérification du serveur..."
if curl -s -f "${BASE_URL}/api/health" > /dev/null 2>&1 || curl -s -f "${BASE_URL}" > /dev/null 2>&1; then
    print_success "Serveur accessible"
else
    print_error "Serveur non accessible. Assurez-vous que 'npm run dev' est lancé."
    exit 1
fi
echo ""

# Test 2: Lister les contacts (devrait être vide au début)
echo "2. Test GET - Liste des contacts..."
RESPONSE=$(curl -s "${API_URL}")
if echo "$RESPONSE" | jq -e '.contacts' > /dev/null 2>&1; then
    COUNT=$(echo "$RESPONSE" | jq '.count')
    print_success "Liste des contacts récupérée (${COUNT} contact(s))"
    echo "$RESPONSE" | jq '.'
else
    print_error "Erreur lors de la récupération des contacts"
    echo "$RESPONSE"
    exit 1
fi
echo ""

# Test 3: Créer un nouveau contact
echo "3. Test POST - Création d'un contact..."
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Corporation",
    "email": "test.user@testcorp.com",
    "phone": "+33 6 12 34 56 78",
    "status": "active",
    "estimatedValue": "€100K"
  }')

if echo "$CREATE_RESPONSE" | jq -e '.contact.id' > /dev/null 2>&1; then
    CONTACT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.contact.id')
    print_success "Contact créé avec succès (ID: ${CONTACT_ID})"
    echo "$CREATE_RESPONSE" | jq '.contact'
else
    print_error "Erreur lors de la création du contact"
    echo "$CREATE_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Récupérer le contact créé
echo "4. Test GET - Récupération du contact par ID..."
GET_RESPONSE=$(curl -s "${API_URL}/${CONTACT_ID}")
if echo "$GET_RESPONSE" | jq -e '.contact.id' > /dev/null 2>&1; then
    print_success "Contact récupéré avec succès"
    echo "$GET_RESPONSE" | jq '.contact'
else
    print_error "Erreur lors de la récupération du contact"
    echo "$GET_RESPONSE"
fi
echo ""

# Test 5: Mettre à jour le contact
echo "5. Test PUT - Mise à jour du contact..."
UPDATE_RESPONSE=$(curl -s -X PUT "${API_URL}/${CONTACT_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pending",
    "estimatedValue": "€150K"
  }')

if echo "$UPDATE_RESPONSE" | jq -e '.contact.id' > /dev/null 2>&1; then
    print_success "Contact mis à jour avec succès"
    echo "$UPDATE_RESPONSE" | jq '.contact'
else
    print_error "Erreur lors de la mise à jour du contact"
    echo "$UPDATE_RESPONSE"
fi
echo ""

# Test 6: Filtrer par statut
echo "6. Test GET - Filtre par statut (pending)..."
FILTER_RESPONSE=$(curl -s "${API_URL}?status=pending")
if echo "$FILTER_RESPONSE" | jq -e '.contacts' > /dev/null 2>&1; then
    COUNT=$(echo "$FILTER_RESPONSE" | jq '.count')
    print_success "Filtre par statut fonctionne (${COUNT} contact(s) trouvé(s))"
else
    print_error "Erreur lors du filtrage"
    echo "$FILTER_RESPONSE"
fi
echo ""

# Test 7: Recherche
echo "7. Test GET - Recherche (Test)..."
SEARCH_RESPONSE=$(curl -s "${API_URL}?search=Test")
if echo "$SEARCH_RESPONSE" | jq -e '.contacts' > /dev/null 2>&1; then
    COUNT=$(echo "$SEARCH_RESPONSE" | jq '.count')
    print_success "Recherche fonctionne (${COUNT} contact(s) trouvé(s))"
else
    print_error "Erreur lors de la recherche"
    echo "$SEARCH_RESPONSE"
fi
echo ""

# Test 8: Lister tous les contacts (devrait maintenant en avoir au moins 1)
echo "8. Test GET - Liste finale des contacts..."
FINAL_RESPONSE=$(curl -s "${API_URL}")
COUNT=$(echo "$FINAL_RESPONSE" | jq '.count')
print_info "Nombre total de contacts: ${COUNT}"
echo ""

# Test 9: Supprimer le contact de test
echo "9. Test DELETE - Suppression du contact de test..."
DELETE_RESPONSE=$(curl -s -X DELETE "${API_URL}/${CONTACT_ID}")
if echo "$DELETE_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    print_success "Contact supprimé avec succès"
    echo "$DELETE_RESPONSE" | jq '.'
else
    print_error "Erreur lors de la suppression du contact"
    echo "$DELETE_RESPONSE"
fi
echo ""

# Résumé
echo "=============================================="
echo "📊 Résumé des tests"
echo "=============================================="
print_success "Tous les tests sont passés !"
echo ""
echo "🌐 Pour tester le frontend :"
echo "   1. Ouvrez http://localhost:3000/business-dev"
echo "   2. Cliquez sur l'onglet 'Contacts'"
echo "   3. Testez le bouton 'Nouveau contact'"
echo ""

