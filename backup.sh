#!/bin/bash

# Script de sauvegarde locale avec versioning
# Usage: ./backup.sh

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CURRENT_BACKUP="$BACKUP_DIR/backup_$TIMESTAMP"

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$CURRENT_BACKUP"

# Créer un dossier pour les fichiers frontend
mkdir -p "$CURRENT_BACKUP/frontend"
mkdir -p "$CURRENT_BACKUP/frontend/css"
mkdir -p "$CURRENT_BACKUP/frontend/js"
mkdir -p "$CURRENT_BACKUP/frontend/js/views"
mkdir -p "$CURRENT_BACKUP/frontend/js/components"
mkdir -p "$CURRENT_BACKUP/backend"

# Sauvegarder les fichiers modifiés récemment (dernières 5 minutes)
echo "📦 Sauvegarde en cours..."

# Frontend CSS
if [ -f "frontend/css/main.css" ]; then
    cp "frontend/css/main.css" "$CURRENT_BACKUP/frontend/css/main.css"
fi
if [ -f "frontend/css/components.css" ]; then
    cp "frontend/css/components.css" "$CURRENT_BACKUP/frontend/css/components.css"
fi
if [ -f "frontend/css/cockpit.css" ]; then
    cp "frontend/css/cockpit.css" "$CURRENT_BACKUP/frontend/css/cockpit.css"
fi
if [ -f "frontend/css/projections.css" ]; then
    cp "frontend/css/projections.css" "$CURRENT_BACKUP/frontend/css/projections.css"
fi

# Frontend JS
if [ -f "frontend/js/app.js" ]; then
    cp "frontend/js/app.js" "$CURRENT_BACKUP/frontend/js/app.js"
fi
if [ -f "frontend/js/views/dashboard.js" ]; then
    cp "frontend/js/views/dashboard.js" "$CURRENT_BACKUP/frontend/js/views/dashboard.js"
fi
if [ -f "frontend/js/views/jobs.js" ]; then
    cp "frontend/js/views/jobs.js" "$CURRENT_BACKUP/frontend/js/views/jobs.js"
fi
if [ -f "frontend/js/views/versions.js" ]; then
    cp "frontend/js/views/versions.js" "$CURRENT_BACKUP/frontend/js/views/versions.js"
fi
if [ -f "frontend/js/views/prompts.js" ]; then
    cp "frontend/js/views/prompts.js" "$CURRENT_BACKUP/frontend/js/views/prompts.js"
fi
if [ -f "frontend/js/views/logs.js" ]; then
    cp "frontend/js/views/logs.js" "$CURRENT_BACKUP/frontend/js/views/logs.js"
fi

# HTML
if [ -f "frontend/index.html" ]; then
    cp "frontend/index.html" "$CURRENT_BACKUP/frontend/index.html"
fi

# Créer un fichier info avec la date et l'heure
echo "Backup créé le: $(date)" > "$CURRENT_BACKUP/backup_info.txt"
echo "Timestamp: $TIMESTAMP" >> "$CURRENT_BACKUP/backup_info.txt"

echo "✅ Sauvegarde créée: $CURRENT_BACKUP"

# Garder seulement les 20 dernières sauvegardes
cd "$BACKUP_DIR"
ls -t | tail -n +21 | xargs rm -rf 2>/dev/null
cd ..

echo "📁 Sauvegardes disponibles:"
ls -1t "$BACKUP_DIR" | head -5


