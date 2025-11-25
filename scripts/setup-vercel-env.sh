#!/bin/bash

# Script pour configurer les variables d'environnement Vercel
# Usage: ./scripts/setup-vercel-env.sh

set -e

echo "🚀 Configuration des variables d'environnement Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Charger les variables locales
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI n'est pas installé"
  echo ""
  echo "Installe-le avec:"
  echo "  npm i -g vercel"
  exit 1
fi

echo "✅ Vercel CLI trouvé"
echo ""

# Vérifier que le projet est lié
if [ ! -f .vercel/project.json ]; then
  echo "⚠️  Projet Vercel non lié"
  echo ""
  echo "Lance: vercel link"
  exit 1
fi

echo "✅ Projet Vercel lié"
echo ""

# Lire le nom du projet
PROJECT_NAME=$(cat .vercel/project.json | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "📋 Projet: $PROJECT_NAME"
echo ""

# Variables à configurer
VARS=(
  "DATABASE_URL"
  "NEXTAUTH_URL"
  "NEXTAUTH_SECRET"
)

echo "🔑 Variables à configurer:"
for var in "${VARS[@]}"; do
  echo "  - $var"
done
echo ""

# Demander confirmation
read -p "Continuer avec la configuration ? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Annulé"
  exit 0
fi

# DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
  echo ""
  echo "📊 Configuration de DATABASE_URL..."
  echo "   Valeur actuelle: ${DATABASE_URL:0:60}..."
  echo ""
  read -p "Utiliser cette valeur ? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel env add DATABASE_URL production <<< "$DATABASE_URL"
    vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
    vercel env add DATABASE_URL development <<< "$DATABASE_URL"
    echo "✅ DATABASE_URL configuré"
  fi
else
  echo "⚠️  DATABASE_URL non trouvé dans .env.local"
  echo "   Configure-le manuellement sur Vercel"
fi

# NEXTAUTH_URL
echo ""
echo "🔐 Configuration de NEXTAUTH_URL..."
echo "   Format attendu: https://$PROJECT_NAME.vercel.app"
echo ""
read -p "Entrer l'URL (ou appuyer sur Entrée pour utiliser le format par défaut): " NEXTAUTH_URL_INPUT

if [ -z "$NEXTAUTH_URL_INPUT" ]; then
  NEXTAUTH_URL_INPUT="https://$PROJECT_NAME.vercel.app"
fi

vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL_INPUT"
vercel env add NEXTAUTH_URL preview <<< "$NEXTAUTH_URL_INPUT"
vercel env add NEXTAUTH_URL development <<< "http://localhost:6001"
echo "✅ NEXTAUTH_URL configuré"

# NEXTAUTH_SECRET
if [ -n "$NEXTAUTH_SECRET" ]; then
  echo ""
  echo "🔒 Configuration de NEXTAUTH_SECRET..."
  echo "   Valeur trouvée dans .env.local"
  echo ""
  read -p "Utiliser cette valeur ? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
    vercel env add NEXTAUTH_SECRET preview <<< "$NEXTAUTH_SECRET"
    vercel env add NEXTAUTH_SECRET development <<< "$NEXTAUTH_SECRET"
    echo "✅ NEXTAUTH_SECRET configuré"
  fi
else
  echo ""
  echo "⚠️  NEXTAUTH_SECRET non trouvé"
  echo "   Génère un secret avec: openssl rand -base64 32"
  echo "   Puis configure-le manuellement sur Vercel"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Vérifie les variables avec:"
echo "   vercel env ls"
echo ""
echo "🚀 Déploie avec:"
echo "   git push origin main"
echo "   (ou: vercel --prod)"
echo ""
