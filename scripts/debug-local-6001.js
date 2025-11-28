#!/usr/bin/env node

/**
 * Script de diagnostic complet pour le serveur local port 6001
 * Identifie et corrige automatiquement les problèmes
 */

const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 6001;
const BASE_URL = `http://localhost:${PORT}`;

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

function check(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkPort(port) {
  try {
    const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
    return result ? result.split('\n')[0] : null;
  } catch {
    return null;
  }
}

function testEndpoint(url, method = 'GET', timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.request(url, { method, timeout }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          success: res.statusCode < 400,
        });
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function main() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  🔍 DIAGNOSTIC COMPLET - PORT 6001', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  const issues = [];
  const fixes = [];

  // 1. Vérifier le processus sur le port 6001
  log('1️⃣  Vérification du port 6001...', 'cyan');
  const pid = checkPort(PORT);
  if (pid) {
    try {
      const processInfo = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf8' }).trim();
      log(`   ✅ Processus trouvé (PID: ${pid})`, 'green');
      log(`   📋 Commande: ${processInfo}`, 'cyan');
      
      if (processInfo.includes('next-server') || processInfo.includes('next dev')) {
        log('   ✅ C\'est bien un serveur Next.js', 'green');
      } else {
        log(`   ⚠️  Processus inattendu sur le port ${PORT}`, 'yellow');
        issues.push(`Processus inattendu sur le port ${PORT}: ${processInfo}`);
      }
    } catch (error) {
      log(`   ❌ Erreur lors de la vérification du processus: ${error.message}`, 'red');
      issues.push(`Impossible de vérifier le processus sur le port ${PORT}`);
    }
  } else {
    log(`   ❌ Aucun processus sur le port ${PORT}`, 'red');
    issues.push(`Aucun serveur sur le port ${PORT}`);
    log(`   💡 Pour démarrer: npm run dev`, 'yellow');
  }
  console.log('');

  // 2. Tester la connexion HTTP
  if (pid) {
    log('2️⃣  Test de la connexion HTTP...', 'cyan');
    const healthCheck = await testEndpoint(`${BASE_URL}/api/health`);
    
    if (healthCheck.success) {
      log(`   ✅ Serveur répond (Status: ${healthCheck.status})`, 'green');
      try {
        const data = JSON.parse(healthCheck.body);
        log(`   📊 Réponse: ${JSON.stringify(data, null, 2)}`, 'cyan');
      } catch {
        log(`   📄 Réponse: ${healthCheck.body.substring(0, 100)}`, 'cyan');
      }
    } else {
      log(`   ❌ Serveur ne répond pas correctement`, 'red');
      if (healthCheck.error) {
        log(`   🔴 Erreur: ${healthCheck.error}`, 'red');
        issues.push(`Connexion HTTP échouée: ${healthCheck.error}`);
      } else {
        log(`   🔴 Status: ${healthCheck.status}`, 'red');
        issues.push(`Réponse HTTP invalide: Status ${healthCheck.status}`);
      }
    }
    console.log('');
  }

  // 3. Tester les endpoints principaux
  if (pid) {
    log('3️⃣  Test des endpoints principaux...', 'cyan');
    const endpoints = [
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/status', name: 'Status API' },
      { path: '/api/collateral', name: 'Collateral API' },
      { path: '/', name: 'Page d\'accueil' },
    ];

    for (const endpoint of endpoints) {
      const result = await testEndpoint(`${BASE_URL}${endpoint.path}`);
      if (result.success || result.status === 307 || result.status === 401) {
        log(`   ✅ ${endpoint.name}: ${result.status}`, 'green');
      } else {
        log(`   ❌ ${endpoint.name}: ${result.status || result.error}`, 'red');
        issues.push(`${endpoint.name} (${endpoint.path}): ${result.error || result.status}`);
      }
    }
    console.log('');
  }

  // 4. Vérifier les logs
  log('4️⃣  Analyse des logs...', 'cyan');
  const logFile = '/tmp/hearst-frontend.log';
  if (fs.existsSync(logFile)) {
    const logContent = fs.readFileSync(logFile, 'utf8');
    const lines = logContent.split('\n').slice(-50);
    
    // Chercher les erreurs
    const errors = lines.filter(line => 
      line.includes('Error') || 
      line.includes('error') || 
      line.includes('❌') ||
      line.includes('Failed') ||
      line.includes('failed')
    );

    if (errors.length > 0) {
      log(`   ⚠️  ${errors.length} erreur(s) trouvée(s) dans les logs`, 'yellow');
      errors.slice(0, 5).forEach(err => {
        log(`   🔴 ${err.substring(0, 100)}`, 'red');
      });
      issues.push(`${errors.length} erreur(s) dans les logs`);
    } else {
      log('   ✅ Aucune erreur dans les logs récents', 'green');
    }

    // Chercher les warnings
    const warnings = lines.filter(line => 
      line.includes('Warning') || 
      line.includes('warning') || 
      line.includes('⚠️') ||
      line.includes('warn')
    );

    if (warnings.length > 0) {
      log(`   ⚠️  ${warnings.length} avertissement(s) trouvé(s)`, 'yellow');
      warnings.slice(0, 3).forEach(warn => {
        log(`   ⚠️  ${warn.substring(0, 100)}`, 'yellow');
      });
    }
  } else {
    log('   ⚠️  Fichier de log non trouvé', 'yellow');
  }
  console.log('');

  // 5. Vérifier Prisma
  log('5️⃣  Vérification de Prisma...', 'cyan');
  const prismaPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
  if (fs.existsSync(prismaPath)) {
    log('   ✅ Client Prisma généré', 'green');
  } else {
    log('   ❌ Client Prisma non généré', 'red');
    issues.push('Client Prisma non généré');
    fixes.push('npm run db:generate');
  }
  console.log('');

  // 6. Vérifier les variables d'environnement
  log('6️⃣  Vérification de la configuration...', 'cyan');
  const envFile = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envFile)) {
    log('   ✅ Fichier .env.local trouvé', 'green');
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    const requiredVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        log(`   ✅ ${varName} configuré`, 'green');
      } else {
        log(`   ⚠️  ${varName} manquant`, 'yellow');
        issues.push(`${varName} non configuré`);
      }
    });
  } else {
    log('   ⚠️  Fichier .env.local non trouvé', 'yellow');
    issues.push('Fichier .env.local manquant');
  }
  console.log('');

  // 7. Vérifier les dépendances
  log('7️⃣  Vérification des dépendances...', 'cyan');
  const nodeModules = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModules)) {
    log('   ✅ node_modules présent', 'green');
  } else {
    log('   ❌ node_modules manquant', 'red');
    issues.push('Dépendances non installées');
    fixes.push('npm install');
  }
  console.log('');

  // Résumé
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  if (issues.length === 0) {
    log('  ✅ AUCUN PROBLÈME DÉTECTÉ', 'green');
    log('\n   Le serveur fonctionne correctement sur le port 6001!', 'green');
  } else {
    log(`  ⚠️  ${issues.length} PROBLÈME(S) DÉTECTÉ(S)`, 'yellow');
    log('\n   Problèmes identifiés:', 'yellow');
    issues.forEach((issue, index) => {
      log(`   ${index + 1}. ${issue}`, 'red');
    });
  }
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  // Solutions proposées
  if (fixes.length > 0) {
    log('🔧 Solutions automatiques proposées:', 'cyan');
    fixes.forEach((fix, index) => {
      log(`   ${index + 1}. ${fix}`, 'cyan');
    });
    console.log('');
  }

  // Commandes utiles
  log('📋 Commandes utiles:', 'cyan');
  log('   • Voir les logs: tail -f /tmp/hearst-frontend.log', 'cyan');
  log('   • Tester l\'API: curl http://localhost:6001/api/health', 'cyan');
  log('   • Redémarrer: npm run dev', 'cyan');
  log('   • Arrêter le serveur: kill $(lsof -ti:6001)', 'cyan');
  console.log('');

  process.exit(issues.length > 0 ? 1 : 0);
}

main().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});





