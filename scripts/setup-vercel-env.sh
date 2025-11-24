#!/bin/bash

# Script pour configurer les variables d'environnement sur Vercel
# Usage: ./scripts/setup-vercel-env.sh

set -e

echo "🔧 Configuration des variables d'environnement Vercel"
echo ""

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI n'est pas installé"
  echo "   Installe-le avec: npm install -g vercel"
  exit 1
fi

# Vérifier que l'utilisateur est connecté à Vercel
if ! vercel whoami &> /dev/null; then
  echo "❌ Tu n'es pas connecté à Vercel"
  echo "   Connecte-toi avec: vercel login"
  exit 1
fi

# Lire les variables depuis .env.local
if [ ! -f .env.local ]; then
  echo "❌ Fichier .env.local non trouvé"
  exit 1
fi

# URL Vercel (mise à jour avec l'URL réelle)
VERCEL_URL="https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app"

# Charger les variables depuis .env.local
source .env.local

echo "📋 Variables à configurer:"
echo "   DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "   NEXTAUTH_URL: ${VERCEL_URL}"
echo ""

# Demander confirmation
read -p "Continuer ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Annulé"
  exit 1
fi

# Configurer DATABASE_URL
# ⚠️ IMPORTANT: SQLite ne fonctionne pas sur Vercel (système de fichiers en lecture seule)
# Il faut utiliser PostgreSQL (Vercel Postgres, Supabase, Neon, etc.)
if [ -n "$DATABASE_URL" ]; then
  echo "🔧 Configuration de DATABASE_URL..."
  echo "⚠️  ATTENTION: SQLite ne fonctionne pas sur Vercel !"
  echo "   Tu dois utiliser PostgreSQL pour la production."
  echo "   Options: Vercel Postgres, Supabase, Neon, etc."
  echo ""
  read -p "Continuer quand même ? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel env add DATABASE_URL production <<< "$DATABASE_URL" || echo "⚠️  DATABASE_URL existe déjà ou erreur"
    vercel env add DATABASE_URL preview <<< "$DATABASE_URL" || echo "⚠️  DATABASE_URL existe déjà ou erreur"
    vercel env add DATABASE_URL development <<< "$DATABASE_URL" || echo "⚠️  DATABASE_URL existe déjà ou erreur"
  else
    echo "⏭️  DATABASE_URL ignoré. Configure-le manuellement avec une base PostgreSQL."
  fi
fi

# Configurer NEXTAUTH_SECRET
if [ -n "$NEXTAUTH_SECRET" ]; then
  echo "🔧 Configuration de NEXTAUTH_SECRET..."
  vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET" || echo "⚠️  NEXTAUTH_SECRET existe déjà ou erreur"
  vercel env add NEXTAUTH_SECRET preview <<< "$NEXTAUTH_SECRET" || echo "⚠️  NEXTAUTH_SECRET existe déjà ou erreur"
  vercel env add NEXTAUTH_SECRET development <<< "$NEXTAUTH_SECRET" || echo "⚠️  NEXTAUTH_SECRET existe déjà ou erreur"
fi

# Configurer NEXTAUTH_URL
echo "🔧 Configuration de NEXTAUTH_URL..."
vercel env add NEXTAUTH_URL production <<< "$VERCEL_URL" || echo "⚠️  NEXTAUTH_URL existe déjà ou erreur"
vercel env add NEXTAUTH_URL preview <<< "$VERCEL_URL" || echo "⚠️  NEXTAUTH_URL existe déjà ou erreur"
vercel env add NEXTAUTH_URL development <<< "http://localhost:3000" || echo "⚠️  NEXTAUTH_URL existe déjà ou erreur"

echo ""
echo "✅ Variables d'environnement configurées !"
echo ""
echo "📝 Note: Pour SQLite sur Vercel, tu devras peut-être utiliser une base PostgreSQL"
echo "   ou configurer un stockage persistant pour SQLite"
echo ""
echo "🔄 Pour redéployer avec les nouvelles variables:"
echo "   vercel --prod"
