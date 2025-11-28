#!/bin/bash
echo "🧪 Test simple de l'API Business Dev Contacts"
echo ""
echo "1. Test GET (liste des contacts):"
curl -s http://localhost:6001/api/business-dev/contacts | jq '.' 2>/dev/null || curl -s http://localhost:6001/api/business-dev/contacts
echo ""
echo ""
echo "2. Test POST (création d'un contact):"
curl -s -X POST http://localhost:6001/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Corp",
    "email": "test@testcorp.com",
    "phone": "+33 6 11 22 33 44",
    "status": "active",
    "estimatedValue": "€100K"
  }' | jq '.' 2>/dev/null || curl -s -X POST http://localhost:6001/api/business-dev/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Corp",
    "email": "test@testcorp.com",
    "phone": "+33 6 11 22 33 44",
    "status": "active",
    "estimatedValue": "€100K"
  }'
echo ""
