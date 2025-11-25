#!/usr/bin/env node

/**
 * 🔍 Diagnostic complet du problème de login
 * 
 * Vérifie tous les aspects possibles du problème
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// 1. Vérifier les fichiers d'authentification
function checkAuthFiles() {
  logSection('📁 Vérification des fichiers d\'authentification');
  
  const files = [
    'lib/auth.ts',
    'lib/db.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/auth/signin/page.tsx',
    'middleware.ts',
  ];
  
  let allExist = true;
  for (const file of files) {
    if (fs.existsSync(file)) {
      log(`  ✅ ${file}`, 'green');
    } else {
      log(`  ❌ ${file} manquant`, 'red');
      allExist = false;
    }
  }
  
  return allExist;
}

// 2. Vérifier la configuration NextAuth
function checkNextAuthConfig() {
  logSection('⚙️  Vérification de la configuration NextAuth');
  
  try {
    const authContent = fs.readFileSync('lib/auth.ts', 'utf-8');
    
    // Vérifier les éléments critiques
    const checks = [
      { name: 'CredentialsProvider importé', pattern: /CredentialsProvider/ },
      { name: 'prisma importé', pattern: /from ['"].*\/db['"]/ },
      { name: 'authorize function présente', pattern: /async authorize\(/ },
      { name: 'prisma.user.findUnique', pattern: /prisma\.user\.findUnique/ },
      { name: 'debug activé', pattern: /debug:\s*true/ },
      { name: 'useSecureCookies configuré', pattern: /useSecureCookies/ },
    ];
    
    for (const check of checks) {
      if (check.pattern.test(authContent)) {
        log(`  ✅ ${check.name}`, 'green');
      } else {
        log(`  ⚠️  ${check.name}`, 'yellow');
      }
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// 3. Vérifier les variables d'environnement locales
function checkLocalEnv() {
  logSection('🔑 Vérification des variables d\'environnement locales');
  
  try {
    const envPath = '.env.local';
    if (!fs.existsSync(envPath)) {
      log('  ⚠️  .env.local non trouvé', 'yellow');
      return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const required = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
    
    for (const varName of required) {
      if (envContent.includes(varName)) {
        const match = envContent.match(new RegExp(`${varName}=(.+)`));
        if (match && match[1] && !match[1].trim().startsWith('#')) {
          const value = match[1].trim();
          if (varName === 'NEXTAUTH_SECRET') {
            log(`  ✅ ${varName} défini (${value.length} caractères)`, 'green');
          } else {
            log(`  ✅ ${varName} défini`, 'green');
            if (varName === 'NEXTAUTH_URL' && !value.includes('https://hearstai.vercel.app')) {
              log(`     ⚠️  Valeur: ${value}`, 'yellow');
            }
          }
        } else {
          log(`  ⚠️  ${varName} commenté ou vide`, 'yellow');
        }
      } else {
        log(`  ❌ ${varName} manquant`, 'red');
      }
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// 4. Vérifier Prisma
function checkPrisma() {
  logSection('🗄️  Vérification de Prisma');
  
  try {
    // Vérifier que schema.prisma existe
    if (!fs.existsSync('prisma/schema.prisma')) {
      log('  ❌ prisma/schema.prisma non trouvé', 'red');
      return false;
    }
    
    const schemaContent = fs.readFileSync('prisma/schema.prisma', 'utf-8');
    
    // Vérifier le modèle User
    if (schemaContent.includes('model User')) {
      log('  ✅ Modèle User présent', 'green');
    } else {
      log('  ❌ Modèle User manquant', 'red');
      return false;
    }
    
    // Vérifier que Prisma Client est généré
    if (fs.existsSync('node_modules/.prisma/client')) {
      log('  ✅ Prisma Client généré', 'green');
    } else {
      log('  ⚠️  Prisma Client non généré (exécutez: npx prisma generate)', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// 5. Vérifier le middleware
function checkMiddleware() {
  logSection('🛡️  Vérification du middleware');
  
  try {
    if (!fs.existsSync('middleware.ts')) {
      log('  ❌ middleware.ts non trouvé', 'red');
      return false;
    }
    
    const middlewareContent = fs.readFileSync('middleware.ts', 'utf-8');
    
    const checks = [
      { name: 'getToken importé', pattern: /getToken.*from ['"]next-auth\/jwt['"]/ },
      { name: 'NEXTAUTH_SECRET vérifié', pattern: /NEXTAUTH_SECRET/ },
      { name: 'Cookie sécurisé en production', pattern: /__Secure-next-auth\.session-token/ },
      { name: 'Redirection vers /auth/signin', pattern: /\/auth\/signin/ },
    ];
    
    for (const check of checks) {
      if (check.pattern.test(middlewareContent)) {
        log(`  ✅ ${check.name}`, 'green');
      } else {
        log(`  ⚠️  ${check.name}`, 'yellow');
      }
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

// 6. Vérifier les changements récents
function checkRecentChanges() {
  logSection('📝 Vérification des changements récents');
  
  try {
    // Vérifier git diff
    const diff = execSync('git diff HEAD~1 lib/auth.ts lib/db.ts app/api/auth/ middleware.ts 2>&1', { encoding: 'utf-8' });
    
    if (diff.trim()) {
      log('  ⚠️  Changements détectés dans les fichiers d\'auth', 'yellow');
      log('  Vérifiez si ces changements ont pu casser quelque chose', 'yellow');
    } else {
      log('  ✅ Aucun changement récent dans les fichiers d\'auth', 'green');
    }
    
    return true;
  } catch (error) {
    // Ignore si pas de git
    return true;
  }
}

// 7. Suggestions de diagnostic
function showDiagnosticSuggestions() {
  logSection('💡 Suggestions de diagnostic');
  
  log('Pour identifier le problème exact, vérifiez:', 'blue');
  console.log('');
  log('1. Console du navigateur (F12)', 'cyan');
  log('   - Ouvre https://hearstai.vercel.app/auth/signin', 'blue');
  log('   - Ouvre la console (F12 → Console)', 'blue');
  log('   - Essaie de te connecter', 'blue');
  log('   - Regarde les erreurs affichées', 'blue');
  console.log('');
  
  log('2. Logs Vercel', 'cyan');
  log('   - Obtiens l\'URL du dernier déploiement:', 'blue');
  log('     vercel ls', 'green');
  log('   - Voir les logs:', 'blue');
  log('     vercel logs <deployment-url>', 'green');
  console.log('');
  
  log('3. Test de la base de données', 'cyan');
  log('   - Localement:', 'blue');
  log('     npm run db:health', 'green');
  log('   - Vérifier que l\'utilisateur existe:', 'blue');
  log('     npm run db:studio', 'green');
  console.log('');
  
  log('4. Test de l\'API NextAuth', 'cyan');
  log('   - Teste directement:', 'blue');
  log('     curl https://hearstai.vercel.app/api/auth/session', 'green');
  log('   - Devrait retourner {} si pas connecté', 'blue');
  console.log('');
  
  log('5. Variables d\'environnement Vercel', 'cyan');
  log('   - Vérifie toutes les variables:', 'blue');
  log('     vercel env ls', 'green');
  log('   - Vérifie spécifiquement:', 'blue');
  log('     - DATABASE_URL (doit être Prisma Accelerate)', 'yellow');
  log('     - NEXTAUTH_URL (doit être https://hearstai.vercel.app)', 'yellow');
  log('     - NEXTAUTH_SECRET (doit être défini)', 'yellow');
  console.log('');
}

// Fonction principale
function main() {
  console.log('');
  log('🔍 DIAGNOSTIC COMPLET DU PROBLÈME DE LOGIN', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const results = {
    files: checkAuthFiles(),
    config: checkNextAuthConfig(),
    env: checkLocalEnv(),
    prisma: checkPrisma(),
    middleware: checkMiddleware(),
    changes: checkRecentChanges(),
  };
  
  // Résumé
  logSection('📊 Résumé');
  
  const allGood = Object.values(results).every(r => r);
  
  if (allGood) {
    log('✅ Tous les fichiers et configurations semblent corrects', 'green');
    log('', 'reset');
    log('Le problème pourrait être:', 'yellow');
    log('  1. Variables d\'environnement Vercel incorrectes', 'yellow');
    log('  2. Base de données inaccessible en production', 'yellow');
    log('  3. Utilisateur n\'existe pas dans la base de données', 'yellow');
    log('  4. Problème de CORS ou de cookies', 'yellow');
  } else {
    log('⚠️  Certains problèmes ont été détectés', 'yellow');
  }
  
  showDiagnosticSuggestions();
  
  logSection('🎯 Prochaines étapes');
  log('1. Partage les erreurs de la console du navigateur', 'blue');
  log('2. Partage les logs Vercel', 'blue');
  log('3. Vérifie que l\'utilisateur admin@hearst.ai existe dans la base', 'blue');
  log('4. Teste la connexion à la base de données', 'blue');
  console.log('');
}

main();


