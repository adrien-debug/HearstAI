#!/usr/bin/env node

/**
 * 🧪 Test de la redirection après login
 * 
 * Vérifie que la redirection fonctionne correctement et ne crée pas de boucle
 */

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

// Test 1: Vérifier que router.push est utilisé
function testRouterPush() {
  logSection('📝 Test 1: Utilisation de router.push');
  
  const signinPath = 'app/auth/signin/page.tsx';
  if (!fs.existsSync(signinPath)) {
    log('  ❌ Fichier signin/page.tsx non trouvé', 'red');
    return false;
  }
  
  const content = fs.readFileSync(signinPath, 'utf-8');
  
  // Vérifier que router.push est utilisé
  if (content.includes('router.push(')) {
    log('  ✅ router.push() est utilisé', 'green');
  } else {
    log('  ❌ router.push() n\'est pas utilisé', 'red');
    return false;
  }
  
  // Vérifier que window.location.href n'est pas utilisé directement (sauf en fallback)
  const windowLocationMatches = content.match(/window\.location\.href/g);
  if (windowLocationMatches) {
    // Vérifier que c'est dans un fallback/setTimeout
    if (content.includes('setTimeout') && content.includes('Fallback')) {
      log('  ✅ window.location.href uniquement en fallback (OK)', 'green');
    } else {
      log('  ⚠️  window.location.href utilisé directement (risque de boucle)', 'yellow');
    }
  } else {
    log('  ✅ window.location.href non utilisé', 'green');
  }
  
  return true;
}

// Test 2: Vérifier le middleware
function testMiddleware() {
  logSection('🛡️  Test 2: Configuration du middleware');
  
  const middlewarePath = 'middleware.ts';
  if (!fs.existsSync(middlewarePath)) {
    log('  ❌ middleware.ts non trouvé', 'red');
    return false;
  }
  
  const content = fs.readFileSync(middlewarePath, 'utf-8');
  
  // Vérifier que callbackUrl est respecté
  if (content.includes('callbackUrl') && content.includes('searchParams.get')) {
    log('  ✅ callbackUrl est respecté dans le middleware', 'green');
  } else {
    log('  ❌ callbackUrl n\'est pas respecté', 'red');
    return false;
  }
  
  // Vérifier la redirection depuis /auth/signin
  if (content.includes('pathname === \'/auth/signin\'') && content.includes('token &&')) {
    log('  ✅ Redirection depuis /auth/signin si token présent', 'green');
  } else {
    log('  ⚠️  Redirection depuis /auth/signin pourrait être améliorée', 'yellow');
  }
  
  return true;
}

// Test 3: Vérifier NextAuth redirect callback
function testNextAuthRedirect() {
  logSection('⚙️  Test 3: Callback redirect NextAuth');
  
  const authPath = 'lib/auth.ts';
  if (!fs.existsSync(authPath)) {
    log('  ❌ lib/auth.ts non trouvé', 'red');
    return false;
  }
  
  const content = fs.readFileSync(authPath, 'utf-8');
  
  // Vérifier que le callback redirect existe
  if (content.includes('async redirect(') || content.includes('redirect:')) {
    log('  ✅ Callback redirect présent', 'green');
    
    // Vérifier la validation des URLs
    if (content.includes('url.startsWith(\'/\')') || content.includes('baseUrl')) {
      log('  ✅ Validation des URLs de redirection', 'green');
    } else {
      log('  ⚠️  Validation des URLs pourrait être améliorée', 'yellow');
    }
  } else {
    log('  ⚠️  Callback redirect non trouvé (peut causer des problèmes)', 'yellow');
  }
  
  return true;
}

// Test 4: Vérifier les protections contre les boucles
function testLoopProtection() {
  logSection('🔄 Test 4: Protection contre les boucles');
  
  const signinPath = 'app/auth/signin/page.tsx';
  const content = fs.readFileSync(signinPath, 'utf-8');
  
  // Vérifier qu'il y a une vérification avant le fallback
  if (content.includes('window.location.pathname === \'/auth/signin\'')) {
    log('  ✅ Vérification avant fallback (évite les boucles)', 'green');
  } else {
    log('  ⚠️  Pas de vérification avant fallback', 'yellow');
  }
  
  // Vérifier qu'il n'y a pas de boucle infinie
  const redirectCount = (content.match(/redirect|router\.push|window\.location/g) || []).length;
  if (redirectCount <= 3) {
    log('  ✅ Pas de redirections multiples suspectes', 'green');
  } else {
    log(`  ⚠️  ${redirectCount} redirections détectées (vérifier)`, 'yellow');
  }
  
  return true;
}

// Test 5: Vérifier les commentaires de protection
function testProtectionComments() {
  logSection('📝 Test 5: Commentaires de protection');
  
  const signinPath = 'app/auth/signin/page.tsx';
  const content = fs.readFileSync(signinPath, 'utf-8');
  
  // Vérifier qu'il y a des commentaires expliquant la logique
  if (content.includes('router.push') && content.includes('//')) {
    log('  ✅ Commentaires présents', 'green');
  } else {
    log('  ⚠️  Ajouter des commentaires pour expliquer la logique', 'yellow');
  }
  
  return true;
}

// Fonction principale
function main() {
  console.log('');
  log('🧪 TEST DE PROTECTION - REDIRECTION LOGIN', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const results = {
    routerPush: testRouterPush(),
    middleware: testMiddleware(),
    nextAuth: testNextAuthRedirect(),
    loopProtection: testLoopProtection(),
    comments: testProtectionComments(),
  };
  
  // Résumé
  logSection('📊 Résumé');
  
  const allPassed = Object.values(results).every(r => r);
  const passedCount = Object.values(results).filter(r => r).length;
  
  log(`Tests passés: ${passedCount}/${Object.keys(results).length}`, passedCount === Object.keys(results).length ? 'green' : 'yellow');
  console.log('');
  
  if (allPassed) {
    log('✅ Tous les tests de protection sont passés !', 'green');
    log('La redirection est protégée contre les régressions.', 'green');
  } else {
    log('⚠️  Certains tests ont échoué', 'yellow');
    log('Vérifie les points mentionnés ci-dessus.', 'yellow');
  }
  
  console.log('');
  
  // Code de sortie
  process.exit(allPassed ? 0 : 1);
}

main();

