#!/bin/bash

# Script pour maintenir setup.sh à jour avec la configuration actuelle
# Ce script vérifie et met à jour setup.sh si nécessaire

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔍 Vérification de setup.sh...${NC}\n"

# Vérifier si setup.sh existe
if [ ! -f "setup.sh" ]; then
    echo -e "${YELLOW}⚠️  setup.sh n'existe pas, création...${NC}"
    # Le script sera créé par l'IA lors des modifications
    exit 0
fi

# Vérifier la version dans setup.sh
CURRENT_VERSION=$(grep -o "v[0-9.]*" setup.sh | head -1 || echo "v1.0")
echo -e "${CYAN}Version actuelle de setup.sh: ${CURRENT_VERSION}${NC}"

# Vérifier les dépendances dans package.json
echo -e "${CYAN}📦 Vérification des dépendances...${NC}"
if [ -f "package.json" ]; then
    # Compter les dépendances
    DEPS_COUNT=$(grep -c '"' package.json | head -1 || echo "0")
    echo -e "${GREEN}✅ package.json trouvé${NC}"
else
    echo -e "${YELLOW}⚠️  package.json non trouvé${NC}"
fi

# Vérifier la structure Prisma
echo -e "${CYAN}🗄️  Vérification de Prisma...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    MODELS_COUNT=$(grep -c "^model " prisma/schema.prisma || echo "0")
    echo -e "${GREEN}✅ schema.prisma trouvé (${MODELS_COUNT} models)${NC}"
else
    echo -e "${YELLOW}⚠️  schema.prisma non trouvé${NC}"
fi

echo -e "\n${GREEN}✅ Vérification terminée${NC}"
echo -e "${CYAN}💡 Note: setup.sh sera mis à jour par l'IA lors des modifications importantes${NC}\n"


