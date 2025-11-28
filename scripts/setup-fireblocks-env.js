#!/usr/bin/env node

/**
 * Script pour configurer les variables Fireblocks dans .env.local
 * Usage: node scripts/setup-fireblocks-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🔥 Configuration Fireblocks - HearstAI                          ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ Fichier .env.local non trouvé', 'red');
    log('   Création du fichier...', 'yellow');
    fs.writeFileSync(envPath, '');
  }

  let envContent = fs.readFileSync(envPath, 'utf-8');

  log('📋 Configuration des variables Fireblocks\n', 'cyan');

  // API Key
  let apiKey = await question('🔑 Entrez votre FIREBLOCKS_API_KEY (UUID): ');
  apiKey = apiKey.trim();

  if (!apiKey) {
    log('❌ API Key vide, annulation', 'red');
    process.exit(1);
  }

  // Private Key
  log('\n📄 Pour la clé privée, vous avez 2 options:', 'cyan');
  log('   1. Chemin vers le fichier .pem', 'yellow');
  log('   2. Contenu de la clé (base64 ou PEM)', 'yellow');
  
  const keyOption = await question('\nChoisissez (1 ou 2): ');
  
  let privateKey = '';
  
  if (keyOption.trim() === '1') {
    const keyPath = await question('📁 Chemin vers le fichier .pem: ');
    const fullPath = path.isAbsolute(keyPath) ? keyPath : path.join(process.cwd(), keyPath);
    
    if (!fs.existsSync(fullPath)) {
      log(`❌ Fichier non trouvé: ${fullPath}`, 'red');
      process.exit(1);
    }
    
    const keyContent = fs.readFileSync(fullPath, 'utf-8');
    
    // Vérifier si c'est déjà en base64 ou en PEM
    if (keyContent.includes('-----BEGIN')) {
      // Format PEM, encoder en base64
      privateKey = Buffer.from(keyContent).toString('base64');
      log('✅ Clé PEM détectée, encodée en base64', 'green');
    } else {
      // Déjà en base64
      privateKey = keyContent.trim();
    }
  } else {
    privateKey = await question('📋 Collez le contenu de la clé privée: ');
    privateKey = privateKey.trim();
    
    // Si c'est du PEM, encoder en base64
    if (privateKey.includes('-----BEGIN')) {
      privateKey = Buffer.from(privateKey).toString('base64');
      log('✅ Clé PEM détectée, encodée en base64', 'green');
    }
  }

  if (!privateKey) {
    log('❌ Clé privée vide, annulation', 'red');
    process.exit(1);
  }

  // Mettre à jour .env.local
  log('\n📝 Mise à jour de .env.local...', 'cyan');

  // Supprimer les anciennes valeurs si elles existent
  envContent = envContent.replace(/^FIREBLOCKS_API_KEY=.*$/m, '');
  envContent = envContent.replace(/^FIREBLOCKS_PRIVATE_KEY=.*$/m, '');

  // Ajouter les nouvelles valeurs
  if (!envContent.endsWith('\n') && envContent.length > 0) {
    envContent += '\n';
  }
  
  envContent += '\n# Fireblocks Configuration\n';
  envContent += `FIREBLOCKS_API_KEY=${apiKey}\n`;
  envContent += `FIREBLOCKS_PRIVATE_KEY=${privateKey}\n`;

  fs.writeFileSync(envPath, envContent);

  log('✅ Configuration sauvegardée dans .env.local', 'green');
  log('\n⚠️  IMPORTANT: Redémarrez le serveur Next.js pour appliquer les changements', 'yellow');
  log('   npm run dev', 'cyan');

  rl.close();
}

main().catch(error => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  console.error(error);
  rl.close();
  process.exit(1);
});






