#!/usr/bin/env node

/**
 * 🧪 Test complet de l'application en production
 */

const http = require('https');

const PRODUCTION_URL = 'https://hearstai.vercel.app';

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

function logSection(title) {
  console.log('\n' + '━'.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('━'.repeat(70) + '\n');
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const req = http.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testHomePage() {
  logSection('🏠 Test 1: Page d\'accueil');
  
  try {
    const response = await makeRequest(PRODUCTION_URL);
    
    if (response.status === 307 || response.status === 200) {
      log(`✅ Page accessible (Status: ${response.status})`, 'green');
      
      if (response.status === 307) {
        const location = response.headers.location;
        log(`   Redirection vers: ${location}`, 'blue');
        
        if (location && location.includes('/auth/signin')) {
          log('✅ Redirection vers login (normal si non connecté)', 'green');
        }
      }
      
      return true;
    } else {
      log(`❌ Status inattendu: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testLoginPage() {
  logSection('🔐 Test 2: Page de login');
  
  try {
    const response = await makeRequest(`${PRODUCTION_URL}/auth/signin`);
    
    if (response.status === 200) {
      log(`✅ Page de login accessible (Status: ${response.status})`, 'green');
      
      // Vérifier le contenu
      if (response.data.includes('HearstAI')) {
        log('✅ Contenu "HearstAI" trouvé', 'green');
      }
      
      if (response.data.includes('signIn') || response.data.includes('SignIn')) {
        log('✅ Composant de login détecté', 'green');
      }
      
      return true;
    } else {
      log(`❌ Status inattendu: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testNextAuthAPI() {
  logSection('🔑 Test 3: API NextAuth');
  
  try {
    const response = await makeRequest(`${PRODUCTION_URL}/api/auth/session`);
    
    if (response.status === 200) {
      log(`✅ API NextAuth accessible (Status: ${response.status})`, 'green');
      
      try {
        const data = JSON.parse(response.data);
        log(`   Réponse: ${JSON.stringify(data)}`, 'blue');
        
        if (typeof data === 'object') {
          log('✅ Réponse JSON valide', 'green');
        }
      } catch (e) {
        log('⚠️  Réponse non-JSON (peut être normal)', 'yellow');
      }
      
      return true;
    } else {
      log(`❌ Status inattendu: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testNextAuthProviders() {
  logSection('🔧 Test 4: Providers NextAuth');
  
  try {
    const response = await makeRequest(`${PRODUCTION_URL}/api/auth/providers`);
    
    if (response.status === 200) {
      log(`✅ Providers accessibles (Status: ${response.status})`, 'green');
      
      try {
        const providers = JSON.parse(response.data);
        const providerNames = Object.keys(providers);
        
        log(`   Providers disponibles: ${providerNames.join(', ')}`, 'blue');
        
        if (providers.credentials) {
          log('✅ Provider Credentials configuré', 'green');
        } else {
          log('⚠️  Provider Credentials non trouvé', 'yellow');
        }
      } catch (e) {
        log('⚠️  Réponse non-JSON', 'yellow');
      }
      
      return true;
    } else {
      log(`❌ Status inattendu: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testHealthCheck() {
  logSection('🏥 Test 5: Health Check');
  
  try {
    // Test de plusieurs endpoints
    const endpoints = [
      '/',
      '/auth/signin',
      '/api/auth/session',
      '/api/auth/providers',
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(`${PRODUCTION_URL}${endpoint}`);
        results.push({
          endpoint,
          status: response.status,
          success: response.status < 400,
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          success: false,
          error: error.message,
        });
      }
    }
    
    log('Résultats des endpoints:', 'blue');
    results.forEach(result => {
      const icon = result.success ? '✅' : '❌';
      const color = result.success ? 'green' : 'red';
      log(`  ${icon} ${result.endpoint.padEnd(25)} ${result.status}`, color);
    });
    
    const allSuccess = results.every(r => r.success);
    return allSuccess;
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  console.log('\n');
  log('🧪 Test complet de l\'application en production', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`URL: ${PRODUCTION_URL}`, 'blue');
  
  const results = {
    homePage: false,
    loginPage: false,
    nextAuthAPI: false,
    providers: false,
    healthCheck: false,
  };
  
  try {
    results.homePage = await testHomePage();
    results.loginPage = await testLoginPage();
    results.nextAuthAPI = await testNextAuthAPI();
    results.providers = await testNextAuthProviders();
    results.healthCheck = await testHealthCheck();
    
    // Résumé
    logSection('📊 Résumé des tests');
    
    const allPassed = Object.values(results).every(r => r === true);
    
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌';
      const color = passed ? 'green' : 'red';
      log(`${icon} ${test.padEnd(20)} ${passed ? 'PASSÉ' : 'ÉCHOUÉ'}`, color);
    });
    
    console.log('');
    
    if (allPassed) {
      log('✅ Tous les tests sont passés !', 'green');
      log('\n🚀 L\'application est opérationnelle en production !', 'cyan');
      log('\n📋 Prochaines étapes:', 'blue');
      log('   1. Teste l\'authentification manuellement', 'blue');
      log('   2. Connecte-toi avec: admin@hearst.ai', 'blue');
      log('   3. Vérifie que la redirection fonctionne', 'blue');
    } else {
      log('❌ Certains tests ont échoué', 'red');
      log('   Vérifie les erreurs ci-dessus', 'yellow');
    }
    
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();

