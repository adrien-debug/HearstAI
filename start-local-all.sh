#!/bin/bash

# Script pour démarrer tout en local (Backend + Frontend)
# Usage: ./start-local-all.sh

echo "🚀 Démarrage de HearstAI en mode local"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "backend" ]; then
    echo "❌ Erreur: Le dossier 'backend' n'existe pas"
    echo "   Assurez-vous d'être à la racine du projet"
    exit 1
fi

# Vérifier que .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local n'existe pas, création d'un fichier de base..."
    cat > .env.local << EOF
# Backend Local
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=

# NextAuth
NEXTAUTH_URL=http://localhost:6001
NEXTAUTH_SECRET=Y9FcSzOygamSCuacy+p+tyh6Y9R9vq9fnKj0eZihgRM=
EOF
    echo -e "${GREEN}✅ .env.local créé${NC}"
fi

echo "📋 Configuration détectée:"
echo "   - Backend: http://localhost:4000"
echo "   - Frontend: http://localhost:6001"
echo ""

# Vérifier si les ports sont libres
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Le port 4000 est déjà utilisé${NC}"
    echo "   Le backend pourrait déjà être démarré"
fi

if lsof -Pi :6001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Le port 6001 est déjà utilisé${NC}"
    echo "   Le frontend pourrait déjà être démarré"
fi

echo ""
echo "🔧 Installation des dépendances..."
echo ""

# Installer les dépendances du backend
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend
    npm install
    cd ..
fi

# Installer les dépendances du frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    npm install
fi

echo ""
echo "🚀 Démarrage des services..."
echo ""
echo "Terminal 1: Backend Express (port 4000)"
echo "Terminal 2: Next.js Frontend (port 6001)"
echo ""
echo "Pour démarrer manuellement:"
echo ""
echo "Terminal 1:"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2:"
echo "  npm run dev"
echo ""

# Option: Démarrer automatiquement (décommenter si souhaité)
# echo "Démarrage automatique..."
# 
# # Démarrer le backend en arrière-plan
# cd backend
# npm start &
# BACKEND_PID=$!
# cd ..
# 
# # Attendre que le backend démarre
# sleep 3
# 
# # Démarrer le frontend
# npm run dev &
# FRONTEND_PID=$!
# 
# echo ""
# echo -e "${GREEN}✅ Services démarrés${NC}"
# echo "   Backend PID: $BACKEND_PID"
# echo "   Frontend PID: $FRONTEND_PID"
# echo ""
# echo "Pour arrêter:"
# echo "  kill $BACKEND_PID $FRONTEND_PID"
