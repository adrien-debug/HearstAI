#!/usr/bin/env node

/**
 * Script de test dédié pour l'API Fireblocks
 * Teste la configuration, la connexion et les endpoints Fireblocks
 * Usage: node scripts/test-fireblocks.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
      timeout: 15000,
      ...options,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data, raw: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout après 15s'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Créer une signature Fireblocks
function createFireblocksSignature(path, body, method, apiKey, privateKey) {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const bodyHash = body ? crypto.createHash('sha256').update(body).digest('hex') : '';
  const message = `${timestamp}${nonce}${method}${path}${bodyHash}`;
  
  try {
    // Décoder la clé privée si nécessaire
    let decodedKey = privateKey;
    if (!privateKey.includes('-----BEGIN')) {
      try {
        decodedKey = Buffer.from(privateKey, 'base64').toString('utf-8');
      } catch (e) {
        // Utiliser telle quelle
      }
    }
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    const signature = sign.sign(decodedKey, 'base64');
    
    return { signature, timestamp, nonce };
  } catch (error) {
    throw new Error(`Erreur signature: ${error.message}`);
  }
}

// Test de la configuration
async function testConfiguration() {
  log('\n📋 Test de la configuration Fireblocks...', 'cyan');
  
  const apiKey = process.env.FIREBLOCKS_API_KEY;
  const privateKey = process.env.FIREBLOCKS_PRIVATE_KEY;
  const baseUrl = process.env.FIREBLOCKS_BASE_URL || 'https://api.fireblocks.io';
  
  if (!apiKey) {
    log('  ❌ FIREBLOCKS_API_KEY non définie', 'red');
    return { configured: false, apiKey: null, privateKey: null, baseUrl };
  }
  
  if (!privateKey) {
    log('  ❌ FIREBLOCKS_PRIVATE_KEY non définie', 'red');
    return { configured: false, apiKey, privateKey: null, baseUrl };
  }
  
  log(`  ✅ FIREBLOCKS_API_KEY: ${apiKey.substring(0, 8)}...`, 'green');
  log(`  ✅ FIREBLOCKS_PRIVATE_KEY: ${privateKey.length > 0 ? 'Définie' : 'Vide'}`, 'green');
  log(`  ✅ Base URL: ${baseUrl}`, 'green');
  
  // Vérifier le format de la clé privée
  let keyFormat = 'Inconnu';
  if (privateKey.includes('-----BEGIN')) {
    keyFormat = 'PEM';
  } else if (privateKey.length > 100) {
    keyFormat = 'Base64 (probable)';
  }
  log(`  ℹ️  Format clé privée: ${keyFormat}`, 'blue');
  
  return { configured: true, apiKey, privateKey, baseUrl };
}

// Test direct de l'API Fireblocks
async function testFireblocksAPI(config) {
  log('\n🔥 Test direct de l\'API Fireblocks...', 'cyan');
  
  if (!config.configured) {
    log('  ⚠️  Configuration manquante, impossible de tester', 'yellow');
    return { success: false, error: 'Configuration manquante' };
  }
  
  try {
    const path = '/v1/vault/accounts_paged';
    const method = 'GET';
    const body = '';
    const { signature, timestamp, nonce } = createFireblocksSignature(
      path, body, method, config.apiKey, config.privateKey
    );
    
    const url = `${config.baseUrl}${path}`;
    
    log(`  📡 Appel: ${method} ${url}`, 'blue');
    
    const result = await testHTTP(url, {
      method: 'GET',
      headers: {
        'X-API-Key': config.apiKey,
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Signature': signature,
        'Content-Type': 'application/json',
      },
    });
    
    if (result.status === 200) {
      const accounts = result.data?.accounts || result.data || [];
      log(`  ✅ API Fireblocks: Connexion réussie !`, 'green');
      log(`  📊 Nombre de vaults: ${Array.isArray(accounts) ? accounts.length : 'N/A'}`, 'green');
      
      if (Array.isArray(accounts) && accounts.length > 0) {
        log(`  📝 Premier vault:`, 'blue');
        const firstVault = accounts[0];
        log(`     - ID: ${firstVault.id || firstVault.name || 'N/A'}`, 'blue');
        log(`     - Nom: ${firstVault.name || 'N/A'}`, 'blue');
      }
      
      return { success: true, data: result.data, status: result.status };
    } else {
      log(`  ❌ API Fireblocks: Erreur HTTP ${result.status}`, 'red');
      log(`  📄 Réponse: ${JSON.stringify(result.data, null, 2).substring(0, 200)}`, 'yellow');
      return { success: false, error: `HTTP ${result.status}`, data: result.data };
    }
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    if (error.message.includes('signature')) {
      log(`  💡 Vérifiez que votre clé privée est au format PEM valide`, 'yellow');
    }
    return { success: false, error: error.message };
  }
}

// Test des routes API locales
async function testLocalRoutes() {
  log('\n🌐 Test des routes API locales Fireblocks...', 'cyan');
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
  
  const routes = [
    { path: '/api/fireblocks/vaults', name: 'Liste des vaults', method: 'GET' },
    { path: '/api/status', name: 'Status API (vérifier Fireblocks)', method: 'GET' },
  ];
  
  const results = {};
  
  for (const route of routes) {
    try {
      const url = `${baseUrl}${route.path}`;
      log(`  📡 Test: ${route.method} ${route.path}`, 'blue');
      
      const result = await testHTTP(url, { method: route.method });
      
      if (result.status === 200) {
        log(`  ✅ ${route.name}: ${result.status}`, 'green');
        
        if (route.path === '/api/status' && result.data?.status?.fireblocks) {
          const fbStatus = result.data.status.fireblocks;
          log(`     - Fireblocks enabled: ${fbStatus.enabled}`, 'blue');
        }
        
        results[route.path] = { success: true, status: result.status, data: result.data };
      } else if (result.status === 401) {
        log(`  ⚠️  ${route.name}: ${result.status} (Authentification requise)`, 'yellow');
        results[route.path] = { success: false, status: result.status, error: 'Auth required' };
      } else if (result.status === 503) {
        log(`  ⚠️  ${route.name}: ${result.status} (Non configuré)`, 'yellow');
        if (result.data?.message) {
          log(`     Message: ${result.data.message}`, 'yellow');
        }
        results[route.path] = { success: false, status: result.status, error: 'Not configured' };
      } else {
        log(`  ❌ ${route.name}: ${result.status}`, 'red');
        results[route.path] = { success: false, status: result.status };
      }
    } catch (error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('Invalid URL')) {
        log(`  ⚠️  ${route.name}: Serveur non démarré (${error.message})`, 'yellow');
        log(`     💡 Démarrez le serveur avec: npm run dev`, 'yellow');
      } else {
        log(`  ❌ ${route.name}: ${error.message}`, 'red');
      }
      results[route.path] = { success: false, error: error.message };
    }
  }
  
  return results;
}

// Rapport final
function generateReport(config, apiResult, routesResult) {
  log('\n' + '='.repeat(70), 'blue');
  log('📊 RAPPORT DE TEST FIREBLOCKS', 'bold');
  log('='.repeat(70) + '\n', 'blue');
  
  // Configuration
  log('📋 CONFIGURATION:', 'bold');
  if (config.configured) {
    log('  ✅ Configuration complète', 'green');
    log(`     - API Key: ${config.apiKey.substring(0, 12)}...`, 'cyan');
    log(`     - Base URL: ${config.baseUrl}`, 'cyan');
  } else {
    log('  ❌ Configuration incomplète', 'red');
    log('     Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY dans .env.local', 'yellow');
  }
  
  // Test API directe
  log('\n🔥 TEST API FIREBLOCKS DIRECTE:', 'bold');
  if (apiResult.success) {
    log('  ✅ Connexion réussie à l\'API Fireblocks', 'green');
    log(`     - Status: ${apiResult.status}`, 'cyan');
  } else if (apiResult.error === 'Configuration manquante') {
    log('  ⚠️  Test non effectué (configuration manquante)', 'yellow');
  } else {
    log('  ❌ Échec de connexion', 'red');
    log(`     - Erreur: ${apiResult.error}`, 'red');
    if (apiResult.error.includes('signature')) {
      log('     💡 Vérifiez le format de votre clé privée (PEM requis)', 'yellow');
    }
  }
  
  // Test routes locales
  log('\n🌐 TEST ROUTES API LOCALES:', 'bold');
  const routesOk = Object.values(routesResult).filter(r => r.success).length;
  const routesTotal = Object.keys(routesResult).length;
  
  if (routesTotal === 0) {
    log('  ⚠️  Aucun test effectué (serveur non démarré)', 'yellow');
  } else {
    log(`  Routes testées: ${routesTotal}`, 'cyan');
    log(`  Routes OK: ${routesOk}/${routesTotal}`, routesOk === routesTotal ? 'green' : 'yellow');
    
    Object.entries(routesResult).forEach(([path, result]) => {
      const icon = result.success ? '✅' : result.status === 401 || result.status === 503 ? '⚠️' : '❌';
      const color = result.success ? 'green' : result.status === 401 || result.status === 503 ? 'yellow' : 'red';
      log(`  ${icon} ${path}: ${result.status || 'Error'}`, color);
    });
  }
  
  // Recommandations
  log('\n💡 RECOMMANDATIONS:', 'bold');
  if (!config.configured) {
    log('  1. Ajoutez FIREBLOCKS_API_KEY dans .env.local', 'yellow');
    log('  2. Ajoutez FIREBLOCKS_PRIVATE_KEY dans .env.local', 'yellow');
    log('  3. Format clé privée: PEM (-----BEGIN PRIVATE KEY-----)', 'yellow');
  } else if (!apiResult.success && apiResult.error !== 'Configuration manquante') {
    log('  1. Vérifiez que votre clé privée est au format PEM valide', 'yellow');
    log('  2. Vérifiez que votre API Key est correcte', 'yellow');
    log('  3. Vérifiez vos permissions Fireblocks', 'yellow');
  } else if (apiResult.success) {
    log('  ✅ Configuration Fireblocks fonctionnelle !', 'green');
  }
  
  if (routesTotal === 0 || Object.values(routesResult).some(r => r.error?.includes('ECONNREFUSED'))) {
    log('  4. Démarrez le serveur Next.js: npm run dev', 'yellow');
  }
  
  log('\n' + '='.repeat(70) + '\n', 'blue');
}

// Exécution principale
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🔥 TEST API FIREBLOCKS - HEARST AI                               ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');
  
  // 1. Test configuration
  const config = await testConfiguration();
  
  // 2. Test API directe (si configuré)
  let apiResult = { success: false, error: 'Not tested' };
  if (config.configured) {
    apiResult = await testFireblocksAPI(config);
  }
  
  // 3. Test routes locales
  const routesResult = await testLocalRoutes();
  
  // 4. Rapport
  generateReport(config, apiResult, routesResult);
  
  // Code de sortie
  const allOk = config.configured && apiResult.success && 
                Object.values(routesResult).every(r => r.success || r.status === 401 || r.status === 503);
  
  if (allOk) {
    log('✅ Tous les tests sont passés !\n', 'green');
    process.exit(0);
  } else {
    log('⚠️  Certains tests nécessitent une attention.\n', 'yellow');
    process.exit(1);
  }
}

// Démarrer
runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});


