#!/bin/bash

# Script pour encoder automatiquement la clé privée Fireblocks

echo "🔑 Encodeur de clé privée Fireblocks"
echo ""

# Demander le chemin du fichier
if [ -z "$1" ]; then
  echo "📁 Entrez le chemin du fichier .pem:"
  read -r key_path
else
  key_path="$1"
fi

# Vérifier que le fichier existe
if [ ! -f "$key_path" ]; then
  echo "❌ Fichier non trouvé: $key_path"
  exit 1
fi

# Vérifier le format
if ! head -1 "$key_path" | grep -q "BEGIN PRIVATE KEY\|BEGIN RSA PRIVATE KEY"; then
  echo "⚠️  Attention: Le fichier ne semble pas être une clé privée PEM valide"
  echo "   Première ligne: $(head -1 "$key_path")"
  read -p "Continuer quand même? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Encoder en base64
echo "🔄 Encodage en base64..."
encoded_key=$(cat "$key_path" | base64 | tr -d '\n')

# Copier dans le presse-papier (macOS)
if command -v pbcopy &> /dev/null; then
  echo "$encoded_key" | pbcopy
  echo "✅ Clé encodée et copiée dans le presse-papier !"
  echo ""
  echo "📋 Prochaines étapes:"
  echo "   1. Ouvrez .env.local"
  echo "   2. Trouvez FIREBLOCKS_PRIVATE_KEY="
  echo "   3. Collez le contenu (Cmd+V)"
  echo "   4. Sauvegardez"
  echo ""
  echo "💡 Ou je peux mettre à jour .env.local automatiquement ? (y/n)"
  read -p "" -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Mettre à jour .env.local
    if grep -q "FIREBLOCKS_PRIVATE_KEY=" .env.local; then
      # Échapper les caractères spéciaux pour sed
      escaped_key=$(echo "$encoded_key" | sed 's/[[\.*^$()+?{|]/\\&/g')
      sed -i '' "s|^FIREBLOCKS_PRIVATE_KEY=.*|FIREBLOCKS_PRIVATE_KEY=${escaped_key}|" .env.local
      echo "✅ FIREBLOCKS_PRIVATE_KEY mise à jour dans .env.local"
    else
      echo "FIREBLOCKS_PRIVATE_KEY=${encoded_key}" >> .env.local
      echo "✅ FIREBLOCKS_PRIVATE_KEY ajoutée dans .env.local"
    fi
    echo ""
    echo "✅ Configuration complète ! Redémarrez le serveur: npm run dev"
  fi
else
  echo "✅ Clé encodée:"
  echo "$encoded_key"
  echo ""
  echo "📋 Copiez cette valeur et collez-la dans .env.local après FIREBLOCKS_PRIVATE_KEY="
fi



