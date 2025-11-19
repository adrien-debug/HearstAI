#!/bin/bash

# Script de démarrage local pour HearstAI (Next.js + Backend)
# Usage: ./start-local.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Fonction pour arrêter les serveurs
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    
    if [ -f /tmp/hearstai-backend.pid ]; then
        BACKEND_PID=$(cat /tmp/hearstai-backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm /tmp/hearstai-backend.pid
    fi
    
    if [ -f /tmp/hearstai-frontend.pid ]; then
        FRONTEND_PID=$(cat /tmp/hearstai-frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm /tmp/hearstai-frontend.pid
    fi
    
    # Kill par nom aussi
    pkill -f "next dev" 2>/dev/null
    pkill -f "backend/server.js" 2>/dev/null
    
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Gérer l'interruption Ctrl+C
trap cleanup INT TERM

# Vérifier que les ports sont libres
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Le port 3000 est déjà utilisé. Libération..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -ti:5556 > /dev/null 2>&1; then
    echo "⚠️  Le port 5556 est déjà utilisé. Libération..."
    lsof -ti:5556 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo ""
echo "🚀 Démarrage de HearstAI en local..."
echo ""

# Démarrer le backend
echo "📦 Démarrage du backend sur le port 5556..."
npm run backend > /tmp/hearstai-backend.log 2>&1 &
echo $! > /tmp/hearstai-backend.pid
sleep 2

# Vérifier que le backend est démarré
if ! kill -0 $(cat /tmp/hearstai-backend.pid) 2>/dev/null; then
    echo "❌ ERREUR: Le backend n'a pas pu démarrer"
    echo "   Logs: cat /tmp/hearstai-backend.log"
    exit 1
fi

# Démarrer Next.js
echo "⚛️  Démarrage de Next.js sur le port 3000..."
npm run dev > /tmp/hearstai-frontend.log 2>&1 &
echo $! > /tmp/hearstai-frontend.pid
sleep 3

# Vérifier que Next.js est démarré
if ! kill -0 $(cat /tmp/hearstai-frontend.pid) 2>/dev/null; then
    echo "❌ ERREUR: Next.js n'a pas pu démarrer"
    echo "   Logs: cat /tmp/hearstai-frontend.log"
    cleanup
    exit 1
fi

# Afficher les informations
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ HearstAI est maintenant hébergé en local!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend Next.js: http://localhost:3000"
echo "🔌 Backend API:      http://localhost:5556/api"
echo ""
echo "📁 Répertoire: $SCRIPT_DIR"
echo "📋 PIDs: Frontend=$(cat /tmp/hearstai-frontend.pid), Backend=$(cat /tmp/hearstai-backend.pid)"
echo ""
echo "📝 Logs:"
echo "   Frontend: tail -f /tmp/hearstai-frontend.log"
echo "   Backend:  tail -f /tmp/hearstai-backend.log"
echo ""
echo "⚠️  Pour arrêter les serveurs, appuyez sur Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Attendre que les processus se terminent
wait

