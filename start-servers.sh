#!/bin/bash

# Script de démarrage des serveurs HearstAI (Frontend + Backend)
# Ports: Frontend 5555, Backend 5556

# Obtenir le répertoire du script (répertoire racine du projet)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# S'assurer qu'on est dans le bon répertoire
cd "$SCRIPT_DIR" || {
    echo "❌ ERREUR: Impossible d'accéder au répertoire du projet"
    exit 1
}

# Vérifier qu'on n'est pas dans un dossier de backup
if [[ "$SCRIPT_DIR" == *"backup"* ]] || [[ "$SCRIPT_DIR" == *"backups"* ]]; then
    echo ""
    echo "❌ ERREUR: Ce script ne doit pas être exécuté depuis un dossier de backup!"
    echo "   Chemin détecté: $SCRIPT_DIR"
    echo ""
    echo "💡 Solution: Exécutez ce script depuis le répertoire racine du projet:"
    echo "   cd /Users/adrienbeyondcrypto/Desktop/DEV/HearstAI"
    echo "   ./start-servers.sh"
    echo ""
    exit 1
fi

# Vérifier que les répertoires nécessaires existent
if [ ! -d "frontend" ]; then
    echo ""
    echo "❌ ERREUR: Le dossier 'frontend' est introuvable!"
    echo "   Répertoire actuel: $SCRIPT_DIR"
    echo ""
    exit 1
fi

if [ ! -d "backend" ]; then
    echo ""
    echo "❌ ERREUR: Le dossier 'backend' est introuvable!"
    echo "   Répertoire actuel: $SCRIPT_DIR"
    echo ""
    exit 1
fi

# Fonction pour arrêter les serveurs
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    pkill -f "node dev-server.js" 2>/dev/null
    pkill -f "backend/server.js" 2>/dev/null
    exit 0
}

# Gérer l'interruption Ctrl+C
trap cleanup INT TERM

# Arrêter les serveurs existants s'ils tournent
echo "🧹 Vérification des serveurs existants..."
pkill -f "node dev-server.js" 2>/dev/null
pkill -f "backend/server.js" 2>/dev/null
sleep 1

# Vérifier que les ports sont libres
if lsof -ti:5555 > /dev/null 2>&1; then
    echo ""
    echo "⚠️  Le port 5555 est déjà utilisé. Tentative de libération..."
    lsof -ti:5555 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -ti:5556 > /dev/null 2>&1; then
    echo ""
    echo "⚠️  Le port 5556 est déjà utilisé. Tentative de libération..."
    lsof -ti:5556 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Démarrer le serveur frontend
echo ""
echo "🚀 Démarrage du serveur frontend sur le port 5555..."
node dev-server.js > /tmp/frontend-server.log 2>&1 &
FRONTEND_PID=$!

# Démarrer le serveur backend
echo "🚀 Démarrage du serveur backend sur le port 5556..."
PORT=5556 node backend/server.js > /tmp/backend-server.log 2>&1 &
BACKEND_PID=$!

# Attendre un peu pour vérifier que les serveurs démarrent correctement
sleep 2

# Vérifier que les serveurs sont bien démarrés
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo ""
    echo "❌ ERREUR: Le serveur frontend n'a pas pu démarrer"
    echo "   Vérifiez les logs: cat /tmp/frontend-server.log"
    cat /tmp/frontend-server.log
    exit 1
fi

if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo ""
    echo "❌ ERREUR: Le serveur backend n'a pas pu démarrer"
    echo "   Vérifiez les logs: cat /tmp/backend-server.log"
    cat /tmp/backend-server.log
    cleanup
    exit 1
fi

# Afficher les informations de démarrage
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Serveurs démarrés avec succès!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend: http://localhost:5555"
echo "🔌 Backend API: http://localhost:5556/api"
echo ""
echo "📁 Répertoire du projet: $SCRIPT_DIR"
echo "📋 PIDs: Frontend=$FRONTEND_PID, Backend=$BACKEND_PID"
echo ""
echo "📝 Logs:"
echo "   Frontend: tail -f /tmp/frontend-server.log"
echo "   Backend:  tail -f /tmp/backend-server.log"
echo ""
echo "⚠️  Pour arrêter les serveurs, appuyez sur Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Attendre que les processus se terminent
wait $FRONTEND_PID $BACKEND_PID

