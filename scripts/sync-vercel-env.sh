#!/bin/bash

# Script pour synchroniser les variables d'environnement de .env.local vers Vercel

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔄 Synchronisation des variables d'environnement vers Vercel...${NC}\n"

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local non trouvé${NC}"
    exit 1
fi

# Fonction pour ajouter une variable à Vercel
add_env_var() {
    local var_name=$1
    local var_value=$2
    local env_type=${3:-production}  # production, preview, development
    
    if [ -z "$var_value" ]; then
        echo -e "${YELLOW}⚠️  $var_name est vide, on skip${NC}"
        return
    fi
    
    echo -e "${CYAN}📝 Ajout de $var_name pour $env_type...${NC}"
    
    # Utiliser echo pour passer la valeur à vercel env add
    echo "$var_value" | vercel env add "$var_name" "$env_type" 2>&1 | grep -v "password" || {
        echo -e "${YELLOW}⚠️  $var_name existe peut-être déjà${NC}"
    }
}

# Lire .env.local et extraire les variables importantes
echo -e "${CYAN}📖 Lecture de .env.local...${NC}\n"

# Variables à synchroniser
VARS=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "DEBANK_ACCESS_KEY"
    "ANTHROPIC_API_KEY"
    "FIREBLOCKS_API_KEY"
    "FIREBLOCKS_SECRET_KEY"
    "LUXOR_API_KEY"
    "NEXT_PUBLIC_API_URL"
)

# Lire chaque variable
for var in "${VARS[@]}"; do
    # Extraire la valeur (gérer les guillemets)
    value=$(grep "^${var}=" .env.local 2>/dev/null | cut -d'=' -f2- | sed 's/^"//;s/"$//' || echo "")
    
    if [ -n "$value" ] && [ "$value" != '""' ] && [ "$value" != "''" ]; then
        # Pour NEXTAUTH_URL, utiliser l'URL Vercel si vide
        if [ "$var" = "NEXTAUTH_URL" ] && [ -z "$value" ] || [ "$value" = '""' ]; then
            value="https://hearstai.vercel.app"
        fi
        
        # Pour NEXT_PUBLIC_API_URL, laisser vide
        if [ "$var" = "NEXT_PUBLIC_API_URL" ]; then
            value=""
        fi
        
        # Ajouter pour production, preview et development
        if [ "$var" != "NEXT_PUBLIC_API_URL" ] || [ -n "$value" ]; then
            add_env_var "$var" "$value" "production"
            add_env_var "$var" "$value" "preview"
            add_env_var "$var" "$value" "development"
        fi
    else
        echo -e "${YELLOW}⚠️  $var n'est pas configuré dans .env.local${NC}"
    fi
done

echo -e "\n${GREEN}✅ Synchronisation terminée !${NC}"
echo -e "${CYAN}💡 Vérifie sur https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables${NC}"

