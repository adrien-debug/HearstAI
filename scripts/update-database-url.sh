#!/bin/bash

# Script pour mettre à jour DATABASE_URL avec PRISMA_DATABASE_URL sur Vercel

set -e

echo "🔧 Mise à jour de DATABASE_URL avec PRISMA_DATABASE_URL..."
echo ""

# Récupérer les variables
vercel env pull .env.vercel.tmp 2>&1 | head -3

PRISMA_URL=$(grep "^PRISMA_DATABASE_URL=" .env.vercel.tmp 2>/dev/null | cut -d'=' -f2- | tr -d '"' || echo "")
rm -f .env.vercel.tmp

if [ -z "$PRISMA_URL" ]; then
  echo "❌ Impossible de récupérer PRISMA_DATABASE_URL"
  exit 1
fi

echo "✅ PRISMA_DATABASE_URL récupéré"
echo ""

# Supprimer DATABASE_URL pour tous les environnements d'abord
echo "🗑️  Suppression de l'ancienne DATABASE_URL..."
for env in production preview development; do
  vercel env rm DATABASE_URL "$env" --yes 2>&1 | head -1 || true
done

echo ""
echo "✅ Ancienne DATABASE_URL supprimée"
echo ""

# Mettre à jour pour chaque environnement
for env in production preview development; do
  echo "🔧 Configuration de DATABASE_URL pour $env..."
  
  # Ajouter la nouvelle valeur
  echo "$PRISMA_URL" | vercel env add DATABASE_URL "$env" 2>&1 | grep -v "password" || {
    echo "⚠️  Erreur lors de l'ajout pour $env"
  }
  
  echo ""
done

echo "✅ DATABASE_URL mis à jour avec PRISMA_DATABASE_URL pour tous les environnements !"
echo ""
echo "🔄 Redéploiement..."
vercel --prod 2>&1 | tail -5

