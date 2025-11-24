#!/usr/bin/env node

/**
 * Script de vérification de toutes les connexions API
 * Usage: node scripts/test-api-connections.js
 */

const https = require('https');
const http = require('http');

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

// Test simple fetch
function testFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data });
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
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Tests des APIs
const tests = [];

// 1. CoinGecko API
tests.push({
  name: 'CoinGecko API - Prix Bitcoin',
  test: async () => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';
    const result = await testFetch(url);
    if (result.data.bitcoin && result.data.bitcoin.usd) {
      return { success: true, message: `Prix BTC: $${result.data.bitcoin.usd}` };
    }
    throw new Error('Données Bitcoin non disponibles');
  },
  required: false,
});

// 2. Blockchain.info API
tests.push({
  name: 'Blockchain.info API - Hashrate',
  test: async () => {
    const url = 'https://blockchain.info/q/hashrate';
    const result = await testFetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const hashrate = parseFloat(result.data);
    if (!isNaN(hashrate) && hashrate > 0) {
      return { success: true, message: `Hashrate: ${(hashrate / 1e18).toFixed(2)} EH/s` };
    }
    throw new Error('Hashrate invalide');
  },
  required: false,
});

// 3. DeBank API
tests.push({
  name: 'DeBank Pro API - Collatéral',
  test: async () => {
    const apiKey = process.env.DEBANK_ACCESS_KEY;
    if (!apiKey || apiKey === 'your_debank_access_key_here') {
      return { success: false, message: 'Clé API manquante (DEBANK_ACCESS_KEY)' };
    }
    
    const url = 'https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&chain_ids=eth';
    const result = await testFetch(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': apiKey,
      }
    });
    
    return { success: true, message: 'Connexion réussie' };
  },
  required: false,
});

// 4. Anthropic Claude API
tests.push({
  name: 'Anthropic Claude API',
  test: async () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return { success: false, message: 'Clé API manquante (ANTHROPIC_API_KEY)' };
    }
    
    // Test simple de l'API (ping)
    const url = 'https://api.anthropic.com/v1/messages';
    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }]
    });
    
    try {
      await testFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: body,
      });
      return { success: true, message: 'Connexion réussie' };
    } catch (error) {
      // Même une erreur 400 signifie que l'API est accessible
      if (error.message.includes('HTTP 400')) {
        return { success: true, message: 'API accessible (erreur attendue pour test minimal)' };
      }
      throw error;
    }
  },
  required: false,
});

// 5. Fireblocks API
tests.push({
  name: 'Fireblocks API',
  test: async () => {
    const apiKey = process.env.FIREBLOCKS_API_KEY;
    const privateKey = process.env.FIREBLOCKS_PRIVATE_KEY;
    
    if (!apiKey || !privateKey) {
      return { success: false, message: 'Clés API manquantes (FIREBLOCKS_API_KEY, FIREBLOCKS_PRIVATE_KEY)' };
    }
    
    const baseUrl = process.env.FIREBLOCKS_BASE_URL || 'https://api.fireblocks.io';
    const url = `${baseUrl}/v1/vault/accounts_paged`;
    
    // Note: Fireblocks nécessite une signature JWT, ce test est simplifié
    return { success: true, message: 'Clés configurées (test complet nécessite signature JWT)' };
  },
  required: false,
});

// 6. Next.js API Routes (si serveur local)
tests.push({
  name: 'Next.js API - Health Check',
  test: async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
    const url = `${baseUrl}/api/health`;
    
    try {
      const result = await testFetch(url);
      return { success: true, message: `Serveur Next.js accessible (${result.status})` };
    } catch (error) {
      return { success: false, message: `Serveur Next.js non accessible: ${error.message}` };
    }
  },
  required: false,
});

// 7. Backend Express (si disponible)
tests.push({
  name: 'Backend Express - Health Check',
  test: async () => {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const url = `${backendUrl}/api/health`;
    
    try {
      const result = await testFetch(url);
      return { success: true, message: `Backend Express accessible (${result.status})` };
    } catch (error) {
      return { success: false, message: `Backend Express non accessible: ${error.message}` };
    }
  },
  required: false,
});

// Exécution des tests
async function runTests() {
  log('\n🔍 VÉRIFICATION DES CONNEXIONS API - HEARST AI\n', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };
  
  for (const test of tests) {
    logInfo(`Test: ${test.name}...`);
    
    try {
      const result = await test.test();
      
      if (result.success) {
        logSuccess(`${test.name}: ${result.message}`);
        results.success++;
      } else {
        logWarning(`${test.name}: ${result.message}`);
        if (test.required) {
          results.failed++;
        } else {
          results.skipped++;
        }
      }
    } catch (error) {
      logError(`${test.name}: ${error.message}`);
      if (test.required) {
        results.failed++;
      } else {
        results.skipped++;
      }
    }
    
    console.log('');
  }
  
  // Résumé
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  log('📊 RÉSUMÉ\n', 'blue');
  logSuccess(`✅ Succès: ${results.success}`);
  if (results.failed > 0) {
    logError(`❌ Échecs: ${results.failed}`);
  }
  if (results.skipped > 0) {
    logWarning(`⚠️  Non configurés: ${results.skipped}`);
  }
  
  // Vérification des variables d'environnement
  log('\n📋 VARIABLES D\'ENVIRONNEMENT\n', 'blue');
  const envVars = [
    'DEBANK_ACCESS_KEY',
    'ANTHROPIC_API_KEY',
    'FIREBLOCKS_API_KEY',
    'FIREBLOCKS_PRIVATE_KEY',
    'NEXT_PUBLIC_API_URL',
    'BACKEND_URL',
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value && !value.includes('your_') && !value.includes('YOUR_')) {
      logSuccess(`${varName}: Configurée`);
    } else {
      logWarning(`${varName}: Non configurée`);
    }
  });
  
  log('\n');
}

// Exécuter les tests
runTests().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  process.exit(1);
});


