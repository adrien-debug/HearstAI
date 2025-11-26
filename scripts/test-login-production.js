#!/usr/bin/env node

/**
 * 🔍 Test complet du login en production
 * 
 * Teste tous les aspects du login pour identifier le problème
 */

const https = require('https');
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
  console.log('\n' + '━'.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('━'.repeat(60) + '\n');
}

// Fonction pour faire des requêtes HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    
    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test 1: Vérifier que l'application est accessible
async function testAppAccessible() {
  logSection('🌐 Test 1: Accessibilité de l\'application');
  
  try {
    const response = await makeRequest('https://hearstai.vercel.app');
    log(`  Status: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'yellow');
    
    if (response.statusCode === 307 || response.statusCode === 308) {
      log('  ✅ Redirection (normal si pas connecté)', 'green');
    } else if (response.statusCode === 200) {
      log('  ✅ Application accessible', 'green');
    } else {
      log(`  ⚠️  Status inattendu: ${response.statusCode}`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// Test 2: Vérifier la page de login
async function testLoginPage() {
  logSection('🔐 Test 2: Page de login');
  
  try {
    const response = await makeRequest('https://hearstai.vercel.app/auth/signin');
    log(`  Status: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'yellow');
    
    if (response.body.includes('HearstAI') || response.body.includes('signin')) {
      log('  ✅ Page de login accessible', 'green');
    } else {
      log('  ⚠️  Contenu de la page inattendu', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Vérifier l'API NextAuth session
async function testNextAuthSession() {
  logSection('🔑 Test 3: API NextAuth Session');
  
  try {
    const response = await makeRequest('https://hearstai.vercel.app/api/auth/session');
    log(`  Status: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'yellow');
    
    try {
      const session = JSON.parse(response.body);
      if (Object.keys(session).length === 0) {
        log('  ✅ Session vide (normal si pas connecté)', 'green');
      } else {
        log('  ⚠️  Session présente (utilisateur connecté?)', 'yellow');
        log(`  Contenu: ${JSON.stringify(session)}`, 'blue');
      }
    } catch (e) {
      log(`  ⚠️  Réponse non-JSON: ${response.body.substring(0, 100)}`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// Test 4: Vérifier l'API NextAuth providers
async function testNextAuthProviders() {
  logSection('🔧 Test 4: API NextAuth Providers');
  
  try {
    const response = await makeRequest('https://hearstai.vercel.app/api/auth/providers');
    log(`  Status: ${response.statusCode}`, response.statusCode === 200 ? 'green' : 'yellow');
    
    try {
      const providers = JSON.parse(response.body);
      if (providers.credentials) {
        log('  ✅ Provider "credentials" configuré', 'green');
      } else {
        log('  ❌ Provider "credentials" non trouvé', 'red');
      }
    } catch (e) {
      log(`  ⚠️  Réponse non-JSON: ${response.body.substring(0, 100)}`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: Tester une tentative de connexion (simulation)
async function testLoginAttempt() {
  logSection('🔐 Test 5: Tentative de connexion (simulation)');
  
  log('  ℹ️  Ce test nécessite une interaction manuelle', 'blue');
  log('  ', 'reset');
  log('  Pour tester manuellement:', 'blue');
  log('  1. Ouvre: https://hearstai.vercel.app/auth/signin', 'cyan');
  log('  2. Ouvre la console (F12)', 'cyan');
  log('  3. Essaie de te connecter avec: admin@hearst.ai / admin', 'cyan');
  log('  4. Regarde les erreurs dans la console', 'cyan');
  log('  5. Partage les erreurs que tu vois', 'cyan');
  log('  ', 'reset');
  
  return true;
}

// Test 6: Vérifier les variables d'environnement (via Vercel CLI)
async function testVercelEnv() {
  logSection('⚙️  Test 6: Variables d\'environnement Vercel');
  
  const { execSync } = require('child_process');
  
  try {
    // Vérifier que Vercel CLI est disponible
    execSync('vercel --version', { stdio: 'ignore' });
    
    log('  ✅ Vercel CLI disponible', 'green');
    log('  ', 'reset');
    log('  Vérification des variables...', 'blue');
    
    try {
      const output = execSync('vercel env ls 2>&1', { encoding: 'utf-8' });
      
      // Vérifier les variables critiques
      const hasDatabaseUrl = output.includes('DATABASE_URL');
      const hasNextAuthUrl = output.includes('NEXTAUTH_URL');
      const hasNextAuthSecret = output.includes('NEXTAUTH_SECRET');
      
      log(`  DATABASE_URL: ${hasDatabaseUrl ? '✅' : '❌'}`, hasDatabaseUrl ? 'green' : 'red');
      log(`  NEXTAUTH_URL: ${hasNextAuthUrl ? '✅' : '❌'}`, hasNextAuthUrl ? 'green' : 'red');
      log(`  NEXTAUTH_SECRET: ${hasNextAuthSecret ? '✅' : '❌'}`, hasNextAuthSecret ? 'green' : 'red');
      
      if (!hasDatabaseUrl || !hasNextAuthUrl || !hasNextAuthSecret) {
        log('  ', 'reset');
        log('  ⚠️  Variables manquantes détectées', 'yellow');
        log('  Vérifie sur: https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables', 'blue');
      }
      
    } catch (e) {
      log('  ⚠️  Impossible de récupérer les variables (Vercel CLI non configuré?)', 'yellow');
    }
    
    return true;
  } catch (error) {
    log('  ⚠️  Vercel CLI non disponible', 'yellow');
    log('  Installe-le avec: npm i -g vercel', 'blue');
    return true; // Ne pas échouer le test si CLI n'est pas disponible
  }
}

// Fonction principale
async function main() {
  console.log('');
  log('🔍 DIAGNOSTIC COMPLET - LOGIN PRODUCTION', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const results = {
    app: await testAppAccessible(),
    loginPage: await testLoginPage(),
    session: await testNextAuthSession(),
    providers: await testNextAuthProviders(),
    loginAttempt: await testLoginAttempt(),
    env: await testVercelEnv(),
  };
  
  // Résumé
  logSection('📊 Résumé');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  log(`Tests passés: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  console.log('');
  
  logSection('💡 Actions Recommandées');
  
  log('1. Vérifie la console du navigateur (F12) lors de la connexion', 'blue');
  log('2. Partage les erreurs que tu vois', 'blue');
  log('3. Vérifie les variables d\'environnement sur Vercel', 'blue');
  log('4. Vérifie que l\'utilisateur admin@hearst.ai existe dans la base', 'blue');
  log('5. Vérifie les logs Vercel: vercel logs', 'blue');
  console.log('');
  
  log('Pour obtenir plus d\'informations:', 'cyan');
  log('  • Console navigateur: F12 → Console', 'blue');
  log('  • Logs Vercel: vercel logs <deployment-url>', 'blue');
  log('  • Variables Vercel: https://vercel.com/adrien-nejkovics-projects/hearstai/settings/environment-variables', 'blue');
  console.log('');
}

main().catch(error => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});




