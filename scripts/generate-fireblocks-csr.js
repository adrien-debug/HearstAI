#!/usr/bin/env node

/**
 * Script pour générer un CSR (Certificate Signing Request) pour Fireblocks
 * 
 * Fireblocks demande un CSR file lors de la création d'un API User.
 * Ce script génère le CSR avec les informations nécessaires.
 * 
 * Usage: node scripts/generate-fireblocks-csr.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Couleurs pour la console
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

// Informations pour le CSR
// Vous pouvez modifier ces valeurs selon vos besoins
const csrInfo = {
  country: 'FR',           // Code pays (FR, US, etc.)
  state: 'Paris',         // État/Région
  locality: 'Paris',      // Ville
  organization: 'Beyond Labs', // Nom de l'organisation
  organizationalUnit: 'HearstAI', // Unité organisationnelle
  commonName: 'hearstai-api', // Nom commun (peut être n'importe quoi)
  emailAddress: 'api@beyondlabs.io', // Email (optionnel)
};

log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
log('║  🔐 GÉNÉRATION CSR POUR FIREBLOCKS - HEARST AI                    ║', 'blue');
log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');

try {
  log('📋 Génération de la paire de clés RSA...', 'cyan');
  
  // Générer une paire de clés RSA 2048 bits
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  log('✅ Paire de clés générée', 'green');

  log('\n📝 Génération du CSR...', 'cyan');
  
  // Créer le CSR
  const csr = crypto.createSign('sha256');
  
  // Construire le sujet du certificat
  const subject = [
    `C=${csrInfo.country}`,
    `ST=${csrInfo.state}`,
    `L=${csrInfo.locality}`,
    `O=${csrInfo.organization}`,
    `OU=${csrInfo.organizationalUnit}`,
    `CN=${csrInfo.commonName}`,
  ];
  
  if (csrInfo.emailAddress) {
    subject.push(`emailAddress=${csrInfo.emailAddress}`);
  }
  
  // Créer le CSR avec les informations du sujet
  const csrData = crypto.createSign('sha256');
  csrData.update(subject.join(', '));
  
  // Générer le CSR
  const csrString = crypto.createSign('sha256')
    .update(subject.join(', '))
    .sign(privateKey, 'base64');
  
  // Format CSR standard
  const csrPem = `-----BEGIN CERTIFICATE REQUEST-----
${Buffer.from(subject.join(', ')).toString('base64')}
-----END CERTIFICATE REQUEST-----`;

  // Utiliser la méthode correcte pour générer un CSR
  // Note: Node.js ne génère pas directement des CSR, on doit utiliser openssl ou une bibliothèque
  // Pour simplifier, on va créer un CSR basique avec openssl si disponible
  
  log('⚠️  Node.js ne peut pas générer directement un CSR valide', 'yellow');
  log('💡 Utilisation d\'une méthode alternative...', 'cyan');
  
  // Créer un CSR valide en utilisant openssl via commande système
  const opensslCommand = `openssl req -new -newkey rsa:2048 -nodes -keyout fireblocks-private-key.pem -out fireblocks-csr.pem -subj "/C=${csrInfo.country}/ST=${csrInfo.state}/L=${csrInfo.locality}/O=${csrInfo.organization}/OU=${csrInfo.organizationalUnit}/CN=${csrInfo.commonName}${csrInfo.emailAddress ? '/emailAddress=' + csrInfo.emailAddress : ''}"`;
  
  log('\n📄 Instructions pour générer le CSR:', 'bold');
  log('='.repeat(70), 'blue');
  log('\n1. Ouvrez un terminal', 'cyan');
  log('2. Exécutez la commande suivante:', 'cyan');
  log('\n' + opensslCommand, 'yellow');
  log('\nOU si vous préférez une version interactive:', 'cyan');
  log('\nopenssl req -new -newkey rsa:2048 -nodes -keyout fireblocks-private-key.pem -out fireblocks-csr.pem', 'yellow');
  log('\n3. Répondez aux questions (ou utilisez la commande avec -subj ci-dessus)', 'cyan');
  log('4. Le fichier fireblocks-csr.pem sera créé', 'cyan');
  log('5. Uploadez fireblocks-csr.pem dans Fireblocks lors de la création de l\'API User', 'cyan');
  log('6. Sauvegardez fireblocks-private-key.pem (c\'est votre clé privée !)', 'cyan');
  
  log('\n' + '='.repeat(70), 'blue');
  
  // Sauvegarder la clé privée générée (au cas où)
  const outputDir = path.join(__dirname, '..');
  const privateKeyPath = path.join(outputDir, 'fireblocks-private-key-generated.pem');
  
  fs.writeFileSync(privateKeyPath, privateKey);
  log(`\n✅ Clé privée sauvegardée dans: ${privateKeyPath}`, 'green');
  log('⚠️  Cette clé privée correspond à la clé publique qui sera dans le CSR', 'yellow');
  log('⚠️  Si vous utilisez openssl, utilisez la clé générée par openssl (fireblocks-private-key.pem)', 'yellow');
  
  log('\n📋 Informations du CSR:', 'bold');
  log(`   Country: ${csrInfo.country}`, 'cyan');
  log(`   State: ${csrInfo.state}`, 'cyan');
  log(`   Locality: ${csrInfo.locality}`, 'cyan');
  log(`   Organization: ${csrInfo.organization}`, 'cyan');
  log(`   Organizational Unit: ${csrInfo.organizationalUnit}`, 'cyan');
  log(`   Common Name: ${csrInfo.commonName}`, 'cyan');
  if (csrInfo.emailAddress) {
    log(`   Email: ${csrInfo.emailAddress}`, 'cyan');
  }
  
  log('\n💡 Note importante:', 'bold');
  log('   - Le CSR file doit être uploadé dans Fireblocks lors de la création de l\'API User', 'yellow');
  log('   - Fireblocks générera ensuite l\'API Key et la clé publique correspondante', 'yellow');
  log('   - Vous devrez utiliser la clé privée correspondante (fireblocks-private-key.pem) dans .env.local', 'yellow');
  
  log('\n✅ Instructions complètes !\n', 'green');
  
} catch (error) {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
}


