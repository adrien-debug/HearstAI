#!/usr/bin/env node

/**
 * Script de test rapide de la connexion Fireblocks
 * Usage: node scripts/test-fireblocks-connection.js
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

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';

function testAPI(url) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data, raw: data });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function runTest() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🔥 TEST CONNEXION FIREBLOCKS - HEARST AI                         ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');

  // Test 1: Status API
  log('1️⃣  Test Status API...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/status`);
    if (result.status === 200 && result.data?.status?.fireblocks) {
      const fb = result.data.status.fireblocks;
      log(`   ✅ Fireblocks: ${fb.enabled ? 'Configuré' : 'Non configuré'}`, fb.enabled ? 'green' : 'yellow');
      log(`   📝 ${fb.message}`, 'cyan');
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
  }

  // Test 2: Vaults API
  log('\n2️⃣  Test GET /api/fireblocks/vaults...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/fireblocks/vaults`);
    if (result.status === 200) {
      log('   ✅ API accessible', 'green');
      if (result.data?.data && Array.isArray(result.data.data)) {
        log(`   📊 ${result.data.data.length} vault(s) trouvé(s)`, 'cyan');
        if (result.data.data.length > 0) {
          const vault = result.data.data[0];
          log(`   📝 Premier vault: ${vault.name || vault.id}`, 'cyan');
        }
      }
    } else if (result.status === 503) {
      log('   ⚠️  Fireblocks non configuré', 'yellow');
      log(`   📝 ${result.data?.message || 'Configurez FIREBLOCKS_API_KEY et FIREBLOCKS_PRIVATE_KEY'}`, 'yellow');
    } else {
      log(`   ❌ Erreur HTTP ${result.status}`, 'red');
    }
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      log('   ⚠️  Serveur non démarré', 'yellow');
    } else {
      log(`   ❌ Erreur: ${error.message}`, 'red');
    }
  }

  log('\n' + '='.repeat(70) + '\n', 'blue');
}

runTest().catch(error => {
  log(`\n❌ Erreur: ${error.message}\n`, 'red');
  process.exit(1);
});

