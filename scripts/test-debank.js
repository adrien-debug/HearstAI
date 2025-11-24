#!/usr/bin/env node

/**
 * Script de test spécifique pour l'API DeBank
 * Usage: node scripts/test-debank.js
 */

// Charger les variables d'environnement depuis .env.local
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Retirer les guillemets si présents
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  // Ignorer les erreurs de chargement
}

const https = require('https');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Test DeBank API
async function testDeBankAPI() {
  log('\n🔍 TEST DE L\'API DEBANK\n', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  const apiKey = process.env.DEBANK_ACCESS_KEY;

  // Vérifier la clé API
  if (!apiKey || apiKey === 'your_debank_access_key_here') {
    logError('DEBANK_ACCESS_KEY non configurée');
    logWarning('\nPour configurer DeBank:');
    log('  1. Obtenez votre clé sur: https://pro.debank.com/', 'cyan');
    log('  2. Ajoutez dans .env.local:', 'cyan');
    log('     DEBANK_ACCESS_KEY=votre_cle_ici\n', 'cyan');
    return;
  }

  logSuccess(`Clé API trouvée: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

  // Wallet de test (adresse Ethereum valide - Vitalik Buterin)
  const testWallet = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const chains = 'eth';

  logInfo(`\nTest avec le wallet: ${testWallet}`);
  logInfo(`Chains: ${chains}\n`);

  // Test 1: Endpoint all_complex_protocol_list
  log('📡 Test 1: Récupération des protocoles complexes...', 'cyan');
  
  try {
    const url = `https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=${testWallet}&chain_ids=${chains}`;
    
    const result = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        headers: {
          'Accept': 'application/json',
          'AccessKey': apiKey,
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
      req.end();
    });

    logSuccess('✅ Connexion à l\'API DeBank réussie !');
    logInfo(`\nRésultat:`);
    
    if (Array.isArray(result)) {
      log(`   Protocoles trouvés: ${result.length}`, 'cyan');
      
      if (result.length > 0) {
        log('\n   Détails du premier protocole:', 'cyan');
        const first = result[0];
        console.log(JSON.stringify(first, null, 2).substring(0, 500) + '...');
      } else {
        logWarning('   Aucun protocole trouvé pour ce wallet');
        logInfo('   (C\'est normal si le wallet n\'a pas de positions DeFi)');
      }
    } else {
      logInfo('   Réponse reçue (format non-array)');
      console.log(JSON.stringify(result, null, 2).substring(0, 500));
    }

  } catch (error) {
    logError(`Erreur lors du test: ${error.message}`);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      logWarning('\n⚠️  Clé API invalide ou expirée');
      log('  Vérifiez votre clé sur https://pro.debank.com/', 'cyan');
    } else if (error.message.includes('429')) {
      logWarning('\n⚠️  Rate limit atteint');
      log('  Attendez quelques minutes avant de réessayer', 'cyan');
    } else if (error.message.includes('Timeout')) {
      logWarning('\n⚠️  Timeout - L\'API DeBank ne répond pas');
    }
  }

  // Test 2: Via la route API Next.js (si serveur disponible)
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  log('📡 Test 2: Route API Next.js /api/collateral...', 'cyan');
  
  try {
    const http = require('http');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
    const testUrl = `${apiUrl}/api/collateral?wallets=${testWallet}&chains=${chains}`;
    
    logInfo(`URL: ${testUrl}`);
    
    const result = await new Promise((resolve, reject) => {
      const url = new URL(testUrl);
      const req = http.request({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        timeout: 5000,
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 500) {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout - Serveur Next.js non accessible'));
      });
      req.end();
    });

    logSuccess('✅ Route API Next.js accessible !');
    logInfo('\nRésultat:');
    console.log(JSON.stringify(result, null, 2).substring(0, 800));

  } catch (error) {
    logWarning(`Route API Next.js non accessible: ${error.message}`);
    logInfo('  (Normal si le serveur Next.js n\'est pas démarré)');
    log('  Démarrez avec: npm run dev', 'cyan');
  }

  // Résumé
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  log('📊 RÉSUMÉ\n', 'blue');
  
  if (apiKey && apiKey !== 'your_debank_access_key_here') {
    logSuccess('✅ DeBank API configurée');
    logSuccess('✅ Test de connexion effectué');
    logInfo('\n💡 Pour utiliser dans votre code:');
    log('  import { buildCollateralClientFromDeBank } from \'@/lib/debank\'', 'cyan');
    log('  const client = await buildCollateralClientFromDeBank(wallet, { chains: [\'eth\'] })', 'cyan');
  } else {
    logWarning('⚠️  DeBank API non configurée');
    log('  Configurez DEBANK_ACCESS_KEY dans .env.local', 'cyan');
  }
  
  log('\n');
}

// Exécuter le test
testDeBankAPI().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});

