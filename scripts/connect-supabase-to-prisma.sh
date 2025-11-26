#!/bin/bash

# Script pour connecter Supabase à Prisma Data Platform
# Usage: ./scripts/connect-supabase-to-prisma.sh

set -e

echo "🔗 Connexion de Supabase à Prisma Data Platform"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Charger les variables d'environnement
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# URL Supabase PostgreSQL
SUPABASE_URL="postgresql://postgres:Adrien0334\$\$@db.qwldfqlhnxukxczyumje.supabase.co:5432/postgres"

echo "📋 Informations de connexion:"
echo ""
echo "   Base de données: Supabase PostgreSQL"
echo "   Host: db.qwldfqlhnxukxczyumje.supabase.co"
echo "   Port: 5432"
echo "   Database: postgres"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 URL de connexion PostgreSQL:"
echo ""
echo "$SUPABASE_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Instructions pour connecter dans Prisma Data Platform:"
echo ""
echo "1. Ouvre: https://console.prisma.io"
echo ""
echo "2. Sélectionne ton projet: 'prisma-postgres-cya...'"
echo ""
echo "3. Clique sur 'Databases' dans la sidebar"
echo ""
echo "4. Clique sur 'Add Database' ou 'Connect Database'"
echo ""
echo "5. Choisis 'PostgreSQL'"
echo ""
echo "6. Colle cette URL:"
echo "   $SUPABASE_URL"
echo ""
echo "7. Clique sur 'Connect'"
echo ""
echo "8. Attends que la connexion soit établie"
echo ""
echo "9. Active 'Prisma Accelerate'"
echo ""
echo "10. Copie l'URL Prisma Accelerate (commence par prisma+postgres://accelerate...)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Une fois l'URL Prisma Accelerate obtenue, exécute:"
echo "   ./scripts/update-database-url.sh 'prisma+postgres://accelerate...'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"




