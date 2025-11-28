#!/usr/bin/env node

/**
 * Script de test complet de l'intégration DeBank
 * Teste la création de customers, la récupération des données, et toutes les sections
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

function testAPI(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, {
      timeout: 30000,
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
      reject(new Error('Timeout après 30s'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
  log('║  🧪 TEST COMPLET INTÉGRATION DEBANK - HEARST AI                  ║', 'blue');
  log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');
  
  const results = {
    success: [],
    failed: [],
  };
  
  // Test 1: Health Check
  log('1️⃣  Test Health Check...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/health`);
    if (result.status === 200) {
      log('   ✅ Serveur accessible', 'green');
      results.success.push('Health Check');
    } else {
      throw new Error(`HTTP ${result.status}`);
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('Health Check');
  }
  
  // Test 2: Status API (vérifier DeBank configuré)
  log('\n2️⃣  Test Status API (vérification DeBank)...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/status`);
    if (result.status === 200 && result.data.status?.debank?.configured) {
      log('   ✅ DeBank API configurée', 'green');
      results.success.push('Status API');
    } else {
      log('   ⚠️  DeBank non configuré ou erreur', 'yellow');
      results.success.push('Status API (warning)');
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('Status API');
  }
  
  // Test 3: Liste des customers (vide au début)
  log('\n3️⃣  Test GET /api/customers (liste)...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/customers`);
    if (result.status === 200) {
      const count = result.data.customers?.length || 0;
      log(`   ✅ ${count} customer(s) trouvé(s)`, 'green');
      results.success.push('GET Customers');
    } else {
      throw new Error(`HTTP ${result.status}`);
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('GET Customers');
  }
  
  // Test 4: Création d'un customer de test
  log('\n4️⃣  Test POST /api/customers (création)...', 'cyan');
  const testWallet = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  try {
    const result = await testAPI(`${baseUrl}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer DeBank',
        erc20Address: testWallet,
        tag: 'Test',
        chains: ['eth'],
        protocols: [],
      }),
    });
    
    if (result.status === 201 || result.status === 200) {
      log('   ✅ Customer créé avec succès', 'green');
      if (result.data.customer) {
        log(`   📊 Total Value: $${result.data.customer.totalValue || 0}`, 'cyan');
        log(`   📊 Health Factor: ${result.data.customer.healthFactor || 0}`, 'cyan');
      }
      results.success.push('POST Customers');
    } else if (result.status === 409) {
      log('   ⚠️  Customer existe déjà (normal si déjà créé)', 'yellow');
      results.success.push('POST Customers (exists)');
    } else {
      throw new Error(`HTTP ${result.status}: ${result.data.error || 'Unknown'}`);
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('POST Customers');
  }
  
  // Test 5: Récupération des données DeBank pour le customer
  log('\n5️⃣  Test GET /api/customers?refresh=true (DeBank)...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/customers?refresh=true`);
    if (result.status === 200 && result.data.customers && result.data.customers.length > 0) {
      const customer = result.data.customers[0];
      log('   ✅ Données DeBank récupérées', 'green');
      log(`   📊 Customer: ${customer.name}`, 'cyan');
      log(`   📊 Total Value: $${customer.totalValue?.toLocaleString() || 0}`, 'cyan');
      log(`   📊 Total Debt: $${customer.totalDebt?.toLocaleString() || 0}`, 'cyan');
      log(`   📊 Health Factor: ${customer.healthFactor?.toFixed(2) || 0}`, 'cyan');
      log(`   📊 Positions: ${customer.positions?.length || 0}`, 'cyan');
      log(`   📊 Source: ${result.data.source || 'unknown'}`, 'cyan');
      results.success.push('GET Customers DeBank');
    } else {
      throw new Error('Aucun customer ou données invalides');
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('GET Customers DeBank');
  }
  
  // Test 6: API Collateral (utilise les customers de la DB)
  log('\n6️⃣  Test GET /api/collateral (données DeBank)...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/collateral`);
    if (result.status === 200) {
      const clients = result.data.clients || [];
      log(`   ✅ ${clients.length} client(s) avec données DeBank`, 'green');
      if (clients.length > 0) {
        const client = clients[0];
        log(`   📊 Client: ${client.name}`, 'cyan');
        log(`   📊 Positions: ${client.positions?.length || 0}`, 'cyan');
        log(`   📊 Total Value: $${client.totalValue?.toLocaleString() || 0}`, 'cyan');
      }
      results.success.push('GET Collateral');
    } else {
      throw new Error(`HTTP ${result.status}`);
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('GET Collateral');
  }
  
  // Test 7: Collateral avec wallet spécifique
  log('\n7️⃣  Test GET /api/collateral?wallets=... (wallet spécifique)...', 'cyan');
  try {
    const result = await testAPI(`${baseUrl}/api/collateral?wallets=${testWallet}`);
    if (result.status === 200) {
      const clients = result.data.clients || [];
      log(`   ✅ ${clients.length} client(s) trouvé(s)`, 'green');
      results.success.push('GET Collateral (wallet)');
    } else {
      throw new Error(`HTTP ${result.status}`);
    }
  } catch (error) {
    log(`   ❌ Erreur: ${error.message}`, 'red');
    results.failed.push('GET Collateral (wallet)');
  }
  
  // Rapport final
  log('\n\n' + '='.repeat(70), 'blue');
  log('📊 RAPPORT FINAL', 'bold');
  log('='.repeat(70) + '\n', 'blue');
  
  log(`✅ Succès: ${results.success.length}`, 'green');
  if (results.failed.length > 0) {
    log(`❌ Échecs: ${results.failed.length}`, 'red');
    log('\nÉchecs détaillés:', 'yellow');
    results.failed.forEach(f => {
      log(`  - ${f}`, 'red');
    });
  }
  
  log('\n' + '='.repeat(70) + '\n', 'blue');
  
  if (results.failed.length === 0) {
    log('🎉 Tous les tests sont passés ! L\'intégration DeBank est opérationnelle.\n', 'green');
    process.exit(0);
  } else {
    log('⚠️  Certains tests ont échoué. Vérifiez la configuration.\n', 'yellow');
    process.exit(1);
  }
}

runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}\n`, 'red');
  console.error(error);
  process.exit(1);
});






