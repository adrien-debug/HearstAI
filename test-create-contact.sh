#!/bin/bash

# Script pour tester la création d'un contact Business Development
# Usage: ./test-create-contact.sh

API_URL="http://localhost:6001/api/business-dev/contacts"

echo "🧪 Test de création d'un contact Business Development"
echo "======================================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📝 Étape 1 : Vérifier que le serveur est accessible..."
if curl -s -f "${API_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur accessible${NC}"
else
    echo -e "${RED}❌ Serveur non accessible sur ${API_URL}${NC}"
    echo -e "${YELLOW}💡 Assurez-vous que le serveur Next.js est démarré${NC}"
    exit 1
fi
echo ""

echo "📝 Étape 2 : Lister les contacts existants..."
LIST_RESPONSE=$(curl -s "${API_URL}")
echo "$LIST_RESPONSE" | jq '.' 2>/dev/null || echo "$LIST_RESPONSE"
echo ""

echo "📝 Étape 3 : Créer un nouveau contact..."
CREATE_RESPONSE=$(curl -s -X POST "${API_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "company": "TechCorp Solutions",
    "email": "jean.dupont@techcorp.com",
    "phone": "+33 6 12 34 56 78",
    "status": "active",
    "estimatedValue": "€120K"
  }')

if echo "$CREATE_RESPONSE" | jq -e '.contact.id' > /dev/null 2>&1; then
    CONTACT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.contact.id')
    echo -e "${GREEN}✅ Contact créé avec succès !${NC}"
    echo "ID du contact: ${CONTACT_ID}"
    echo ""
    echo "Détails du contact créé:"
    echo "$CREATE_RESPONSE" | jq '.contact'
else
    echo -e "${RED}❌ Erreur lors de la création du contact${NC}"
    echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
    echo ""
    echo -e "${YELLOW}💡 Solutions possibles :${NC}"
    echo "   1. Vérifier que la migration Prisma a été appliquée : npx prisma db push"
    echo "   2. Vérifier que le client Prisma a été généré : npx prisma generate"
    echo "   3. Redémarrer le serveur Next.js"
    exit 1
fi
echo ""

echo "📝 Étape 4 : Vérifier que le contact apparaît dans la liste..."
FINAL_LIST=$(curl -s "${API_URL}")
COUNT=$(echo "$FINAL_LIST" | jq '.count // 0' 2>/dev/null || echo "0")
echo "Nombre de contacts: ${COUNT}"

if [ "$COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Le contact apparaît dans la liste !${NC}"
    echo ""
    echo "Liste des contacts:"
    echo "$FINAL_LIST" | jq '.contacts' 2>/dev/null || echo "$FINAL_LIST"
else
    echo -e "${YELLOW}⚠️  Aucun contact trouvé dans la liste${NC}"
fi
echo ""

echo "======================================================"
echo -e "${GREEN}✅ Test terminé !${NC}"
echo ""

