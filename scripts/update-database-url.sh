#!/bin/bash

# Script pour mettre à jour DATABASE_URL avec Prisma Accelerate
# Usage: ./scripts/update-database-url.sh 'prisma+postgres://accelerate...'

set -e

if [ -z "$1" ]; then
  echo "❌ Erreur: URL Prisma Accelerate requise"
  echo ""
  echo "Usage: ./scripts/update-database-url.sh 'prisma+postgres://accelerate...'"
  exit 1
fi

ACCELERATE_URL="$1"

echo "🔄 Mise à jour de DATABASE_URL avec Prisma Accelerate..."
echo ""

# Vérifier le format
if [[ ! "$ACCELERATE_URL" =~ ^prisma\+postgres://accelerate ]]; then
  echo "⚠️  Attention: L'URL ne semble pas être une URL Prisma Accelerate"
  echo "   Format attendu: prisma+postgres://accelerate.prisma-data.net/?api_key=..."
  echo ""
  read -p "   Continuer quand même ? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   Annulé"
    exit 0
  fi
fi

# Mettre à jour .env.local
if [ -f .env.local ]; then
  if grep -q "^DATABASE_URL=" .env.local; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"$ACCELERATE_URL\"|" .env.local
    echo "✅ DATABASE_URL mis à jour dans .env.local"
  else
    echo "DATABASE_URL=\"$ACCELERATE_URL\"" >> .env.local
    echo "✅ DATABASE_URL ajouté à .env.local"
  fi
else
  echo "DATABASE_URL=\"$ACCELERATE_URL\"" > .env.local
  echo "✅ .env.local créé avec DATABASE_URL"
fi

echo ""
echo "🧪 Test de la connexion..."
echo ""

export $(cat .env.local | grep -v '^#' | xargs)

node -e "
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✅ Connexion réussie avec Prisma Accelerate !');
    return prisma.user.count();
  })
  .then(count => {
    console.log('👥 Utilisateurs:', count);
    prisma.\$disconnect();
  })
  .catch(err => {
    console.error('❌ Erreur:', err.message);
    prisma.\$disconnect();
    process.exit(1);
  });
" 2>&1

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Mettre à jour DATABASE_URL sur Vercel avec la même URL"
echo "   2. Tester l'application: npm run dev"
echo ""
