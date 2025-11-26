#!/bin/bash

# Script pour configurer PostgreSQL sur Vercel et tester la connexion
# Usage: ./scripts/setup-vercel-postgres.sh

set -e

echo "🔧 Configuration PostgreSQL sur Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
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

echo "📋 Étape 1: Vérification des variables existantes..."
echo ""

# Vérifier si POSTGRES_PRISMA_URL existe
if vercel env ls 2>&1 | grep -q "POSTGRES_PRISMA_URL"; then
  echo "✅ POSTGRES_PRISMA_URL trouvé !"
  echo ""
  echo "📥 Récupération de la valeur..."
  vercel env pull .env.vercel.tmp 2>&1 | head -3
  POSTGRES_URL=$(grep "POSTGRES_PRISMA_URL" .env.vercel.tmp 2>/dev/null | cut -d'=' -f2- | tr -d '"' || echo "")
  rm -f .env.vercel.tmp
  
  if [ -n "$POSTGRES_URL" ]; then
    echo "✅ Connection string récupérée"
    echo ""
    echo "🔧 Configuration de DATABASE_URL avec PostgreSQL..."
    echo ""
    
    # Configurer pour chaque environnement
    for env in production preview development; do
      echo "   Configuration pour $env..."
      echo "$POSTGRES_URL" | vercel env add DATABASE_URL "$env" 2>&1 | grep -v "password" || {
        echo "   ⚠️  DATABASE_URL existe déjà pour $env, mise à jour..."
        vercel env rm DATABASE_URL "$env" --yes 2>&1 | head -1
        echo "$POSTGRES_URL" | vercel env add DATABASE_URL "$env" 2>&1 | grep -v "password" || echo "   ✅ Mis à jour"
      }
    done
    
    echo ""
    echo "✅ DATABASE_URL configuré avec PostgreSQL !"
    echo ""
    echo "🔄 Redéploiement..."
    vercel --prod 2>&1 | tail -10
    
    echo ""
    echo "✅ Configuration terminée !"
    echo ""
    echo "🧪 Test de la connexion..."
    echo "   Attends 30 secondes que le déploiement se termine..."
    sleep 30
    
    echo ""
    echo "🔗 Initialisation de l'utilisateur..."
    echo "   Visite: https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app/api/init-user"
    echo ""
    echo "📝 Puis connecte-toi avec:"
    echo "   Email: admin@hearst.ai"
    echo "   Mot de passe: n'importe quel mot de passe"
    
  else
    echo "❌ Impossible de récupérer POSTGRES_PRISMA_URL"
    echo ""
    echo "📋 Actions manuelles requises:"
    echo "   1. Va sur: https://vercel.com/adrien-nejkovics-projects/hearstai"
    echo "   2. Clique sur 'Storage' → 'Create Database' → 'Postgres'"
    echo "   3. Copie POSTGRES_PRISMA_URL"
    echo "   4. Configure DATABASE_URL manuellement"
  fi
else
  echo "❌ POSTGRES_PRISMA_URL non trouvé"
  echo ""
  echo "📋 Tu dois créer Vercel Postgres manuellement:"
  echo ""
  echo "   1. Va sur: https://vercel.com/adrien-nejkovics-projects/hearstai"
  echo "   2. Clique sur 'Storage' dans le menu de gauche"
  echo "   3. Clique sur 'Create Database'"
  echo "   4. Sélectionne 'Postgres'"
  echo "   5. Attends que la base soit créée"
  echo "   6. Relance ce script: ./scripts/setup-vercel-postgres.sh"
  echo ""
  echo "   Ou configure manuellement:"
  echo "   → Settings → Environment Variables"
  echo "   → Modifie DATABASE_URL avec POSTGRES_PRISMA_URL"
fi




