#!/usr/bin/env node

/**
 * Script de test en temps réel des APIs HearstAI
 * Teste toutes les routes API Next.js avec données réelles
 * Usage: node scripts/test-realtime-apis.js
 */

const http = require('http');

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

// Test HTTP
function testAPI(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? require('https') : http;
    
    const req = protocol.request(url, {
      timeout: 15000,
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
      reject(new Error('Timeout après 15s'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Attendre que le serveur soit prêt
async function waitForServer(baseUrl, maxAttempts = 30) {
  log('\n⏳ Attente du démarrage du serveur Next.js...', 'cyan');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await testAPI(`${baseUrl}/api/health`);
      log('✅ Serveur prêt !\n', 'green');
      return true;
    } catch (error) {
      if (i < maxAttempts - 1) {
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  log('\n❌ Serveur non accessible après 30 secondes', 'red');
  return false;
}

// Tests des routes API
const apiTests = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
  },
  {
    name: 'Status API',
    path: '/api/status',
    method: 'GET',
  },
  {
    name: 'Hashprice Current',
    path: '/api/hashprice/current',
    method: 'GET',
  },
  {
    name: 'Collateral API',
    path: '/api/collateral?wallets=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    method: 'GET',
  },
  {
    name: 'Cockpit Data',
    path: '/api/cockpit',
    method: 'GET',
  },
  {
    name: 'Electricity Data',
    path: '/api/electricity',
    method: 'GET',
  },
  {
    name: 'Profitability Summary',
    path: '/api/profitability/summary',
    method: 'GET',
  },
  {
    name: 'Customers List',
    path: '/api/customers',
    method: 'GET',
  },
  {
    name: 'Wallets List',
    path: '/api/wallets',
    method: 'GET',
  },
  {
    name: 'Setup Miners',
    path: '/api/setup/miners',
    method: 'GET',
  },
  {
    name: 'Setup Hosters',
    path: '/api/setup/hosters',
    method: 'GET',
  },
  {
    name: 'Setup Prices',
    path: '/api/setup/prices',
    method: 'GET',
  },
];

async function runTests() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';
  
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🚀 TEST EN TEMPS RÉEL DES APIs - HEARST AI                       ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');
  
  // Attendre le serveur
  const serverReady = await waitForServer(baseUrl);
  if (!serverReady) {
    log('\n❌ Impossible de continuer sans serveur. Démarrez avec: npm run dev\n', 'red');
    process.exit(1);
  }
  
  const results = {
    success: [],
    failed: [],
    total: 0,
  };
  
  // Exécuter les tests
  for (const test of apiTests) {
    results.total++;
    log(`\n🧪 Test: ${test.name}`, 'cyan');
    log(`   ${baseUrl}${test.path}`, 'reset');
    
    try {
      const result = await testAPI(`${baseUrl}${test.path}`, {
        method: test.method,
      });
      
      if (result.status >= 200 && result.status < 300) {
        log(`   ✅ Succès (HTTP ${result.status})`, 'green');
        
        // Afficher un aperçu des données
        if (result.data && typeof result.data === 'object') {
          const preview = JSON.stringify(result.data).substring(0, 150);
          log(`   📊 Données: ${preview}...`, 'reset');
        }
        
        results.success.push({ name: test.name, status: result.status });
      } else if (result.status === 401 || result.status === 403) {
        log(`   ⚠️  Authentification requise (HTTP ${result.status})`, 'yellow');
        results.success.push({ name: test.name, status: result.status, auth: true });
      } else {
        log(`   ⚠️  Réponse inattendue (HTTP ${result.status})`, 'yellow');
        results.failed.push({ name: test.name, status: result.status, error: 'HTTP ' + result.status });
      }
    } catch (error) {
      log(`   ❌ Erreur: ${error.message}`, 'red');
      results.failed.push({ name: test.name, error: error.message });
    }
  }
  
  // Rapport final
  log('\n\n' + '='.repeat(70), 'blue');
  log('📊 RAPPORT FINAL', 'bold');
  log('='.repeat(70) + '\n', 'blue');
  
  log(`✅ Succès: ${results.success.length}/${results.total}`, 'green');
  if (results.failed.length > 0) {
    log(`❌ Échecs: ${results.failed.length}/${results.total}`, 'red');
    log('\nÉchecs détaillés:', 'yellow');
    results.failed.forEach(f => {
      log(`  - ${f.name}: ${f.error || f.status}`, 'red');
    });
  }
  
  log('\n' + '='.repeat(70) + '\n', 'blue');
  
  // Afficher les APIs qui fonctionnent
  if (results.success.length > 0) {
    log('✅ APIs fonctionnelles:', 'green');
    results.success.forEach(s => {
      const icon = s.auth ? '🔐' : '✅';
      log(`  ${icon} ${s.name} (HTTP ${s.status})`, 'green');
    });
  }
  
  log('\n');
  
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Démarrer
runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});

