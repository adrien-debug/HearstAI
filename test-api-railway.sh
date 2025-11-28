#!/bin/bash

# Script pour tester l'API Business Dev Contacts
# Utilise l'URL locale qui se connecte à la base Railway via DATABASE_URL

API_URL="http://localhost:6001/api/business-dev/contacts"

echo "🧪 Test de l'API Business Development Contacts"
echo "=============================================="
echo ""
echo "📍 URL: ${API_URL}"
echo "💡 Cette API utilise la base de données Railway via DATABASE_URL"
echo ""

# Test 1: Lister les contacts
echo "📝 Test 1: Lister les contacts existants..."
LIST_RESPONSE=$(curl -s "${API_URL}")
echo "$LIST_RESPONSE" | jq '.' 2>/dev/null || echo "$LIST_RESPONSE"
echo ""

# Test 2: Créer un contact
echo "📝 Test 2: Créer un nouveau contact..."
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
    echo "✅ Contact créé avec succès !"
    echo "ID: ${CONTACT_ID}"
    echo ""
    echo "Détails:"
    echo "$CREATE_RESPONSE" | jq '.contact'
else
    echo "❌ Erreur lors de la création:"
    echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
    echo ""
    echo "💡 Solutions possibles:"
    echo "   1. Vérifier que DATABASE_URL est configurée (pointant vers Railway)"
    echo "   2. Appliquer la migration: npx prisma db push"
    echo "   3. Générer le client: npx prisma generate"
    echo "   4. Redémarrer le serveur: npm run dev"
    exit 1
fi
echo ""

# Test 3: Vérifier dans la liste
echo "📝 Test 3: Vérifier que le contact apparaît dans la liste..."
FINAL_LIST=$(curl -s "${API_URL}")
COUNT=$(echo "$FINAL_LIST" | jq '.count // 0' 2>/dev/null || echo "0")
echo "Nombre de contacts: ${COUNT}"
echo ""
if [ "$COUNT" -gt 0 ]; then
    echo "✅ Liste des contacts:"
    echo "$FINAL_LIST" | jq '.contacts' 2>/dev/null || echo "$FINAL_LIST"
else
    echo "⚠️  Aucun contact trouvé"
fi

echo ""
echo "=============================================="
echo "✅ Test terminé !"
