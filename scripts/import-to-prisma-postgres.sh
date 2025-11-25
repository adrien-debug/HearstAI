#!/bin/bash

# Script pour importer des données dans Prisma Postgres
# Usage: ./scripts/import-to-prisma-postgres.sh [SOURCE_DATABASE_URL]

set -e

echo "🚀 Import de données dans Prisma Postgres"
echo ""

# Charger les variables d'environnement
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Vérifier que DATABASE_URL est configuré
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erreur: DATABASE_URL n'est pas configuré"
  echo "   Configure-le dans .env.local"
  exit 1
fi

echo "📋 DATABASE_URL configuré: ${DATABASE_URL:0:60}..."
echo ""

# Option 1: Créer les tables vides avec Prisma (si pas de source)
if [ -z "$1" ]; then
  echo "📊 Option 1: Création des tables avec Prisma db push"
  echo ""
  echo "   Cette commande va créer toutes les tables selon ton schéma Prisma"
  echo ""
  read -p "   Continuer ? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Exécution de: npx prisma db push"
    npx prisma db push --accept-data-loss
    echo ""
    echo "✅ Tables créées !"
    echo ""
    echo "🔍 Vérification avec Prisma Studio..."
    echo "   Lance: npx prisma studio"
    exit 0
  else
    echo "   Annulé"
    exit 0
  fi
fi

# Option 2: Importer depuis une base existante
SOURCE_DB_URL="$1"
DUMP_FILE="db_dump_$(date +%Y%m%d_%H%M%S).bak"

echo "📊 Option 2: Import depuis une base existante"
echo ""
echo "   Source: ${SOURCE_DB_URL:0:60}..."
echo "   Destination: ${DATABASE_URL:0:60}..."
echo ""

# Étape 1: Export
echo "📤 Étape 1: Export depuis la source..."
echo "   Commande: pg_dump -Fc -v -d \"$SOURCE_DB_URL\" -n public -f $DUMP_FILE"
echo ""

read -p "   Continuer avec l'export ? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "   Annulé"
  exit 0
fi

pg_dump \
  -Fc \
  -v \
  -d "$SOURCE_DB_URL" \
  -n public \
  -f "$DUMP_FILE"

if [ ! -f "$DUMP_FILE" ]; then
  echo "❌ Erreur: Le fichier de dump n'a pas été créé"
  exit 1
fi

echo "✅ Export terminé: $DUMP_FILE"
echo ""

# Étape 2: Import
echo "📥 Étape 2: Import dans Prisma Postgres..."
echo "   Commande: pg_restore -d \"$DATABASE_URL\" -v $DUMP_FILE"
echo ""

read -p "   Continuer avec l'import ? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "   Annulé"
  rm -f "$DUMP_FILE"
  exit 0
fi

pg_restore \
  -d "$DATABASE_URL" \
  -v \
  "$DUMP_FILE" \
  && echo "-complete-"

echo ""
echo "✅ Import terminé !"
echo ""

# Nettoyer
echo "🧹 Nettoyage..."
rm -f "$DUMP_FILE"
echo "✅ Fichier temporaire supprimé"
echo ""

# Vérification
echo "🔍 Vérification avec Prisma Studio..."
echo "   Lance: npx prisma studio"
echo ""

