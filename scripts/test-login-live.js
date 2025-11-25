#!/usr/bin/env node

/**
 * 🌐 Test en direct de la page de login
 * 
 * Teste l'authentification en faisant des requêtes HTTP réelles
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const http = require('http');

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

const PORT = 6001;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Fait une requête HTTP
 */
function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Test 1: Vérifier que le serveur répond
 */
async function testServerRunning() {
  logSection('🌐 Test 1: Serveur en cours d\'exécution');
  
  try {
    const response = await makeRequest('/');
    log(`✅ Serveur répond (status: ${response.status})`, 'green');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('❌ Serveur non démarré', 'red');
      log('   Démarre le serveur avec: npm run dev', 'yellow');
      return false;
    }
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 2: Vérifier la page de login
 */
async function testLoginPage() {
  logSection('📄 Test 2: Page de login');
  
  try {
    const response = await makeRequest('/auth/signin');
    
    if (response.status === 200) {
      log('✅ Page de login accessible', 'green');
      
      // Vérifier que c'est bien la page React
      if (response.data.includes('HearstAI') || response.data.includes('signIn')) {
        log('✅ Page React détectée', 'green');
      }
      
      return true;
    } else {
      log(`⚠️  Status: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 3: Vérifier l'API NextAuth
 */
async function testNextAuthAPI() {
  logSection('🔐 Test 3: API NextAuth');
  
  try {
    // Test de l'endpoint de session
    const response = await makeRequest('/api/auth/session');
    
    if (response.status === 200) {
      log('✅ API NextAuth accessible', 'green');
      
      try {
        const data = JSON.parse(response.data);
        if (data.user) {
          log(`   Utilisateur connecté: ${data.user.email}`, 'blue');
        } else {
          log('   Aucun utilisateur connecté (normal)', 'blue');
        }
      } catch (e) {
        // Pas de JSON, c'est OK
      }
      
      return true;
    } else {
      log(`⚠️  Status: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 4: Vérifier les providers NextAuth
 */
async function testNextAuthProviders() {
  logSection('🔑 Test 4: Providers NextAuth');
  
  try {
    const response = await makeRequest('/api/auth/providers');
    
    if (response.status === 200) {
      log('✅ Providers accessibles', 'green');
      
      try {
        const providers = JSON.parse(response.data);
        log(`   Providers disponibles: ${Object.keys(providers).join(', ')}`, 'blue');
        
        if (providers.credentials) {
          log('✅ Provider Credentials configuré', 'green');
        }
      } catch (e) {
        // Pas de JSON, c'est OK
      }
      
      return true;
    } else {
      log(`⚠️  Status: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n');
  log('🌐 Test en direct de la page de login', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const results = {
    server: false,
    loginPage: false,
    nextAuthAPI: false,
    providers: false,
  };
  
  try {
    results.server = await testServerRunning();
    
    if (!results.server) {
      log('\n💡 Pour démarrer le serveur:', 'yellow');
      log('   npm run dev', 'blue');
      log('\n   Puis relance ce script', 'yellow');
      process.exit(1);
    }
    
    results.loginPage = await testLoginPage();
    results.nextAuthAPI = await testNextAuthAPI();
    results.providers = await testNextAuthProviders();
    
    // Résumé
    logSection('📊 Résumé des tests');
    
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌';
      const color = passed ? 'green' : 'red';
      log(`${icon} ${test.padEnd(20)} ${passed ? 'PASSÉ' : 'ÉCHOUÉ'}`, color);
    });
    
    console.log('');
    
    const allPassed = Object.values(results).every(r => r === true);
    
    if (allPassed) {
      log('✅ Tous les tests sont passés !', 'green');
      log('\n🚀 Vous pouvez maintenant:', 'cyan');
      log(`   1. Ouvrir: ${BASE_URL}/auth/signin`, 'blue');
      log('   2. Se connecter avec:', 'blue');
      log('      Email: admin@hearst.ai', 'blue');
      log('      Mot de passe: n\'importe quel mot de passe', 'blue');
    } else {
      log('❌ Certains tests ont échoué', 'red');
    }
    
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();


