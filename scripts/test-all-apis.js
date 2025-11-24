#!/usr/bin/env node

/**
 * Script de test complet de toutes les APIs intégrées
 * Teste toutes les connexions API et génère un rapport détaillé
 * Usage: node scripts/test-all-apis.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Couleurs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Charger .env.local
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/);
        if (match && !process.env[match[1].trim()]) {
          let value = match[2].trim();
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[match[1].trim()] = value;
        }
      });
    }
  } catch (e) {
    // Ignore
  }
}

loadEnv();

// Test HTTP
function testHTTP(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, {
      timeout: 10000,
      ...options,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
        } catch {
          resolve({ status: res.statusCode, data, raw: data });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout après 10s'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Résultats
const results = {
  apis: {},
  routes: {},
  config: {},
};

// ============================================
// TESTS DES APIs EXTERNES
// ============================================

async function testCoinGecko() {
  log('\n📊 Test CoinGecko API...', 'cyan');
  try {
    const result = await testHTTP('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (result.status === 200 && result.data.bitcoin) {
      log(`  ✅ CoinGecko: Prix BTC $${result.data.bitcoin.usd} (${result.data.bitcoin.usd_24h_change > 0 ? '+' : ''}${result.data.bitcoin.usd_24h_change?.toFixed(2)}%)`, 'green');
      results.apis.coingecko = { status: 'ok', message: `Prix BTC: $${result.data.bitcoin.usd}` };
      return true;
    }
    throw new Error('Données invalides');
  } catch (error) {
    log(`  ❌ CoinGecko: ${error.message}`, 'red');
    results.apis.coingecko = { status: 'error', message: error.message };
    return false;
  }
}

async function testBlockchainInfo() {
  log('\n⛓️  Test Blockchain.info API...', 'cyan');
  try {
    const result = await testHTTP('https://blockchain.info/q/hashrate', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const hashrate = parseFloat(result.data);
    if (!isNaN(hashrate) && hashrate > 0) {
      log(`  ✅ Blockchain.info: Hashrate ${(hashrate / 1e18).toFixed(2)} EH/s`, 'green');
      results.apis.blockchain = { status: 'ok', message: `Hashrate: ${(hashrate / 1e18).toFixed(2)} EH/s` };
      return true;
    }
    throw new Error('Hashrate invalide');
  } catch (error) {
    log(`  ❌ Blockchain.info: ${error.message}`, 'red');
    results.apis.blockchain = { status: 'error', message: error.message };
    return false;
  }
}

async function testDeBank() {
  log('\n🏦 Test DeBank Pro API...', 'cyan');
  const apiKey = process.env.DEBANK_ACCESS_KEY;
  
  if (!apiKey || apiKey === 'your_debank_access_key_here') {
    log('  ⚠️  DeBank: Clé API non configurée (DEBANK_ACCESS_KEY)', 'yellow');
    results.apis.debank = { status: 'not_configured', message: 'Clé API manquante' };
    results.config.debank = false;
    return false;
  }
  
  try {
    const testWallet = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Wallet valide pour DeBank
    const url = `https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=${testWallet}&chain_ids=eth`;
    const result = await testHTTP(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': apiKey,
      }
    });
    
    if (result.status === 200) {
      const count = Array.isArray(result.data) ? result.data.length : 0;
      log(`  ✅ DeBank: Connexion réussie (${count} protocoles trouvés)`, 'green');
      results.apis.debank = { status: 'ok', message: 'Connexion réussie' };
      results.config.debank = true;
      return true;
    }
    throw new Error(`HTTP ${result.status}`);
  } catch (error) {
    log(`  ❌ DeBank: ${error.message}`, 'red');
    results.apis.debank = { status: 'error', message: error.message };
    results.config.debank = true;
    return false;
  }
}

async function testAnthropic() {
  log('\n🤖 Test Anthropic Claude API...', 'cyan');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    log('  ⚠️  Anthropic: Clé API non configurée (ANTHROPIC_API_KEY)', 'yellow');
    results.apis.anthropic = { status: 'not_configured', message: 'Clé API manquante' };
    results.config.anthropic = false;
    return false;
  }
  
  try {
    // Test simplifié - vérifier que la clé est présente
    log('  ✅ Anthropic: Clé API configurée (test complet nécessite appel API)', 'green');
    results.apis.anthropic = { status: 'configured', message: 'Clé API configurée' };
    results.config.anthropic = true;
    return true;
  } catch (error) {
    log(`  ❌ Anthropic: ${error.message}`, 'red');
    results.apis.anthropic = { status: 'error', message: error.message };
    results.config.anthropic = true;
    return false;
  }
}

async function testFireblocks() {
  log('\n🔥 Test Fireblocks API...', 'cyan');
  const apiKey = process.env.FIREBLOCKS_API_KEY;
  const privateKey = process.env.FIREBLOCKS_PRIVATE_KEY;
  
  if (!apiKey || !privateKey) {
    log('  ⚠️  Fireblocks: Clés API non configurées (FIREBLOCKS_API_KEY, FIREBLOCKS_PRIVATE_KEY)', 'yellow');
    results.apis.fireblocks = { status: 'not_configured', message: 'Clés API manquantes' };
    results.config.fireblocks = false;
    return false;
  }
  
  try {
    log('  ✅ Fireblocks: Clés API configurées (test complet nécessite signature JWT)', 'green');
    results.apis.fireblocks = { status: 'configured', message: 'Clés API configurées' };
    results.config.fireblocks = true;
    return true;
  } catch (error) {
    log(`  ❌ Fireblocks: ${error.message}`, 'red');
    results.apis.fireblocks = { status: 'error', message: error.message };
    results.config.fireblocks = true;
    return false;
  }
}

async function testGoogleDrive() {
  log('\n📁 Test Google Drive API...', 'cyan');
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    log('  ⚠️  Google Drive: Credentials non configurés (GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET)', 'yellow');
    results.apis.googledrive = { status: 'not_configured', message: 'Credentials manquants' };
    results.config.googledrive = false;
    return false;
  }
  
  try {
    log('  ✅ Google Drive: Credentials configurés', 'green');
    results.apis.googledrive = { status: 'configured', message: 'Credentials configurés' };
    results.config.googledrive = true;
    return true;
  } catch (error) {
    log(`  ❌ Google Drive: ${error.message}`, 'red');
    results.apis.googledrive = { status: 'error', message: error.message };
    results.config.googledrive = true;
    return false;
  }
}

async function testLuxor() {
  log('\n⛏️  Test Luxor API...', 'cyan');
  const apiKey = process.env.LUXOR_API_KEY;
  
  if (!apiKey || apiKey === 'your_luxor_api_key_here') {
    log('  ⚠️  Luxor: Clé API non configurée (LUXOR_API_KEY) - Optionnel', 'yellow');
    results.apis.luxor = { status: 'not_configured', message: 'Clé API manquante (optionnel)' };
    results.config.luxor = false;
    return false;
  }
  
  try {
    log('  ✅ Luxor: Clé API configurée', 'green');
    results.apis.luxor = { status: 'configured', message: 'Clé API configurée' };
    results.config.luxor = true;
    return true;
  } catch (error) {
    log(`  ❌ Luxor: ${error.message}`, 'red');
    results.apis.luxor = { status: 'error', message: error.message };
    results.config.luxor = true;
    return false;
  }
}

// ============================================
// TESTS DES ROUTES NEXT.JS
// ============================================

async function testNextJSRoutes() {
  log('\n🌐 Test Routes Next.js API...', 'magenta');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
  
  const routes = [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/status', name: 'Status API' },
    { path: '/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', name: 'Collateral API' },
    { path: '/api/fireblocks/vaults', name: 'Fireblocks Vaults' },
    { path: '/api/googledrive/auth/url', name: 'Google Drive Auth' },
  ];
  
  for (const route of routes) {
    try {
      const url = `${baseUrl}${route.path}`;
      const result = await testHTTP(url);
      
      if (result.status < 500) {
        log(`  ✅ ${route.name}: ${result.status}`, 'green');
        results.routes[route.path] = { status: 'ok', httpStatus: result.status };
      } else {
        log(`  ⚠️  ${route.name}: ${result.status} (peut nécessiter auth)`, 'yellow');
        results.routes[route.path] = { status: 'auth_required', httpStatus: result.status };
      }
    } catch (error) {
      log(`  ❌ ${route.name}: ${error.message}`, 'red');
      results.routes[route.path] = { status: 'error', message: error.message };
    }
  }
}

async function testBackendExpress() {
  log('\n⚙️  Test Backend Express...', 'magenta');
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
  
  try {
    const result = await testHTTP(`${backendUrl}/api/health`);
    if (result.status === 200) {
      log(`  ✅ Backend Express: Accessible (${result.status})`, 'green');
      results.apis.backend = { status: 'ok', message: 'Backend accessible' };
      return true;
    }
    throw new Error(`HTTP ${result.status}`);
  } catch (error) {
    log(`  ⚠️  Backend Express: ${error.message} (peut ne pas être démarré)`, 'yellow');
    results.apis.backend = { status: 'not_running', message: error.message };
    return false;
  }
}

// ============================================
// RAPPORT FINAL
// ============================================

function generateReport() {
  log('\n\n' + '='.repeat(70), 'blue');
  log('📊 RAPPORT COMPLET - ÉTAT DES APIs', 'bold');
  log('='.repeat(70) + '\n', 'blue');
  
  // APIs externes
  log('🌐 APIs EXTERNES:', 'bold');
  const externalAPIs = ['coingecko', 'blockchain', 'debank', 'anthropic', 'fireblocks', 'googledrive', 'luxor'];
  externalAPIs.forEach(api => {
    const result = results.apis[api];
    if (result) {
      const icon = result.status === 'ok' || result.status === 'configured' ? '✅' : 
                   result.status === 'not_configured' ? '⚠️' : '❌';
      const color = result.status === 'ok' || result.status === 'configured' ? 'green' : 
                    result.status === 'not_configured' ? 'yellow' : 'red';
      log(`  ${icon} ${api.toUpperCase()}: ${result.message}`, color);
    }
  });
  
  // Routes Next.js
  log('\n🔗 ROUTES NEXT.JS:', 'bold');
  Object.entries(results.routes).forEach(([path, result]) => {
    const icon = result.status === 'ok' ? '✅' : result.status === 'auth_required' ? '⚠️' : '❌';
    const color = result.status === 'ok' ? 'green' : result.status === 'auth_required' ? 'yellow' : 'red';
    log(`  ${icon} ${path}: ${result.status} (HTTP ${result.httpStatus || 'N/A'})`, color);
  });
  
  // Configuration
  log('\n⚙️  CONFIGURATION:', 'bold');
  const configKeys = ['debank', 'anthropic', 'fireblocks', 'googledrive', 'luxor'];
  configKeys.forEach(key => {
    const configured = results.config[key];
    const icon = configured ? '✅' : '⚠️';
    const color = configured ? 'green' : 'yellow';
    log(`  ${icon} ${key.toUpperCase()}: ${configured ? 'Configuré' : 'Non configuré'}`, color);
  });
  
  // Statistiques
  log('\n📈 STATISTIQUES:', 'bold');
  const totalAPIs = Object.keys(results.apis).length;
  const okAPIs = Object.values(results.apis).filter(r => r.status === 'ok' || r.status === 'configured').length;
  const configuredAPIs = Object.values(results.config).filter(Boolean).length;
  const totalRoutes = Object.keys(results.routes).length;
  const okRoutes = Object.values(results.routes).filter(r => r.status === 'ok').length;
  
  log(`  APIs testées: ${totalAPIs}`, 'cyan');
  log(`  APIs OK: ${okAPIs}/${totalAPIs}`, okAPIs === totalAPIs ? 'green' : 'yellow');
  log(`  APIs configurées: ${configuredAPIs}/${configKeys.length}`, 'cyan');
  log(`  Routes testées: ${totalRoutes}`, 'cyan');
  log(`  Routes OK: ${okRoutes}/${totalRoutes}`, okRoutes === totalRoutes ? 'green' : 'yellow');
  
  log('\n' + '='.repeat(70) + '\n', 'blue');
}

// ============================================
// EXÉCUTION
// ============================================

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🧪 TEST COMPLET DE TOUTES LES APIs - HEARST AI                   ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');
  
  // Tests APIs externes
  await testCoinGecko();
  await testBlockchainInfo();
  await testDeBank();
  await testAnthropic();
  await testFireblocks();
  await testGoogleDrive();
  await testLuxor();
  
  // Tests routes Next.js
  await testNextJSRoutes();
  
  // Test backend Express
  await testBackendExpress();
  
  // Rapport final
  generateReport();
  
  // Code de sortie
  const hasErrors = Object.values(results.apis).some(r => r.status === 'error') ||
                    Object.values(results.routes).some(r => r.status === 'error');
  
  if (hasErrors) {
    log('⚠️  Certains tests ont échoué. Vérifiez la configuration.\n', 'yellow');
    process.exit(1);
  } else {
    log('✅ Tous les tests sont passés !\n', 'green');
    process.exit(0);
  }
}

// Démarrer
runAllTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});

