#!/bin/bash

# Script pour configurer les variables d'environnement Vercel
# Usage: ./scripts/setup-vercel-env.sh

echo "🚀 Configuration des variables d'environnement Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "📦 Installation: npm i -g vercel"
    exit 1
fi

# Demander le domaine Vercel
read -p "🌐 Entrez votre domaine Vercel (ex: hearstai.vercel.app): " VERCEL_DOMAIN

if [ -z "$VERCEL_DOMAIN" ]; then
    echo "❌ Le domaine est requis"
    exit 1
fi

# URL complète
VERCEL_URL="https://${VERCEL_DOMAIN}"

# Backend Railway
RAILWAY_BACKEND="https://hearstai-backend-production.up.railway.app/api"

echo ""
echo "📝 Configuration des variables d'environnement..."
echo ""

# NEXT_PUBLIC_API_URL
echo "🔗 Configuration de NEXT_PUBLIC_API_URL..."
vercel env add NEXT_PUBLIC_API_URL production <<< "$RAILWAY_BACKEND" || echo "⚠️  Variable peut-être déjà configurée"

# NEXTAUTH_URL
echo "🔐 Configuration de NEXTAUTH_URL..."
vercel env add NEXTAUTH_URL production <<< "$VERCEL_URL" || echo "⚠️  Variable peut-être déjà configurée"

# NEXTAUTH_SECRET
echo "🔑 Génération de NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET" || echo "⚠️  Variable peut-être déjà configurée"

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Variables configurées:"
echo "   NEXT_PUBLIC_API_URL=$RAILWAY_BACKEND"
echo "   NEXTAUTH_URL=$VERCEL_URL"
echo "   NEXTAUTH_SECRET=*** (généré)"
echo ""
echo "⚠️  Note: Vous devrez peut-être configurer DATABASE_URL manuellement"
echo "   si vous utilisez Prisma pour certaines routes API Next.js"
echo ""
echo "🔄 Pour redéployer avec les nouvelles variables:"
echo "   vercel --prod"

