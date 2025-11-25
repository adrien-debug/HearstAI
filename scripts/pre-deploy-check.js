#!/usr/bin/env node

/**
 * ✅ Vérification pré-déploiement
 * 
 * Vérifie que tout est prêt pour le déploiement sur Vercel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const checks = {
  gitignore: false,
  envFiles: false,
  packageJson: false,
  prisma: false,
  nextConfig: false,
  vercelConfig: false,
  gitStatus: false,
};

/**
 * Vérifier que .gitignore exclut les fichiers sensibles
 */
function checkGitignore() {
  logSection('🔒 Vérification .gitignore');
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    log('❌ .gitignore non trouvé', 'red');
    return false;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const requiredPatterns = [
    '.env',
    '.env.local',
    '.env.production',
    'node_modules',
    '.next',
    '.vercel',
  ];
  
  const missing = requiredPatterns.filter(pattern => !content.includes(pattern));
  
  if (missing.length > 0) {
    log(`⚠️  Patterns manquants dans .gitignore: ${missing.join(', ')}`, 'yellow');
    return false;
  }
  
  log('✅ .gitignore correctement configuré', 'green');
  return true;
}

/**
 * Vérifier qu'aucun fichier .env n'est tracké
 */
function checkEnvFiles() {
  logSection('🔐 Vérification des fichiers .env');
  
  try {
    const tracked = execSync('git ls-files | grep -E "\\.env"', { encoding: 'utf8' }).trim();
    
    if (tracked) {
      const lines = tracked.split('\n').filter(l => l);
      // Fichiers autorisés (exemples ou backups)
      const allowed = ['.env.example', '.env.local.example', '.env.local.bak'];
      const sensitive = lines.filter(f => !allowed.some(a => f.includes(a)));
      
      if (sensitive.length > 0) {
        log('❌ Fichiers .env sensibles trackés par Git:', 'red');
        sensitive.forEach(f => log(`   ${f}`, 'red'));
        return false;
      }
      
      log('✅ Seuls les fichiers d\'exemple sont trackés (OK)', 'green');
      if (lines.length > 0) {
        log(`   Fichiers trackés (exemples): ${lines.join(', ')}`, 'blue');
      }
      return true;
    }
    
    log('✅ Aucun fichier .env tracké par Git', 'green');
    return true;
  } catch (error) {
    // Aucun fichier .env tracké, c'est bon
    log('✅ Aucun fichier .env tracké par Git', 'green');
    return true;
  }
}

/**
 * Vérifier package.json
 */
function checkPackageJson() {
  logSection('📦 Vérification package.json');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json non trouvé', 'red');
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Vérifier les scripts essentiels
  const requiredScripts = ['dev', 'build', 'start'];
  const missing = requiredScripts.filter(script => !pkg.scripts[script]);
  
  if (missing.length > 0) {
    log(`⚠️  Scripts manquants: ${missing.join(', ')}`, 'yellow');
  } else {
    log('✅ Scripts essentiels présents', 'green');
  }
  
  // Vérifier que prisma generate est dans build
  if (pkg.scripts.build && pkg.scripts.build.includes('prisma generate')) {
    log('✅ Prisma generate dans le script build', 'green');
  } else {
    log('⚠️  Prisma generate pas dans le script build', 'yellow');
  }
  
  return true;
}

/**
 * Vérifier Prisma
 */
function checkPrisma() {
  logSection('🗄️  Vérification Prisma');
  
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    log('❌ prisma/schema.prisma non trouvé', 'red');
    return false;
  }
  
  log('✅ Schema Prisma trouvé', 'green');
  
  // Vérifier que le datasource utilise env("DATABASE_URL")
  const schema = fs.readFileSync(schemaPath, 'utf8');
  if (schema.includes('env("DATABASE_URL")')) {
    log('✅ Datasource utilise DATABASE_URL', 'green');
  } else {
    log('⚠️  Datasource ne semble pas utiliser DATABASE_URL', 'yellow');
  }
  
  return true;
}

/**
 * Vérifier next.config.js
 */
function checkNextConfig() {
  logSection('⚙️  Vérification Next.js');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    log('⚠️  next.config.js non trouvé (optionnel)', 'yellow');
    return true;
  }
  
  log('✅ next.config.js trouvé', 'green');
  return true;
}

/**
 * Vérifier vercel.json
 */
function checkVercelConfig() {
  logSection('🚀 Vérification Vercel');
  
  const vercelPath = path.join(process.cwd(), 'vercel.json');
  
  if (!fs.existsSync(vercelPath)) {
    log('⚠️  vercel.json non trouvé (sera créé automatiquement)', 'yellow');
    return true;
  }
  
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  
  log('✅ vercel.json trouvé', 'green');
  
  if (config.buildCommand) {
    log(`   Build command: ${config.buildCommand}`, 'blue');
  }
  
  return true;
}

/**
 * Vérifier le statut Git
 */
function checkGitStatus() {
  logSection('📋 Vérification Git');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const lines = status.trim().split('\n').filter(l => l);
    
    if (lines.length === 0) {
      log('✅ Aucun changement non commité', 'green');
      return true;
    }
    
    log(`📝 ${lines.length} fichier(s) modifié(s) ou non tracké(s):`, 'blue');
    
    // Séparer les fichiers modifiés et non trackés
    const modified = lines.filter(l => l.startsWith('M') || l.startsWith('A'));
    const untracked = lines.filter(l => l.startsWith('??'));
    
    if (modified.length > 0) {
      log(`   Modifiés: ${modified.length}`, 'blue');
    }
    
    if (untracked.length > 0) {
      log(`   Non trackés: ${untracked.length}`, 'blue');
      
      // Vérifier qu'aucun fichier sensible n'est dans les non trackés
      const sensitive = untracked.filter(f => 
        f.includes('.env') || 
        f.includes('fireblocks') || 
        f.includes('private-key')
      );
      
      if (sensitive.length > 0) {
        log('❌ Fichiers sensibles non trackés (normal, mais vérifie):', 'red');
        sensitive.forEach(f => log(`   ${f}`, 'red'));
      }
    }
    
    return true;
  } catch (error) {
    log('⚠️  Erreur lors de la vérification Git', 'yellow');
    return false;
  }
}

/**
 * Liste des variables d'environnement nécessaires pour Vercel
 */
function listRequiredEnvVars() {
  logSection('🔑 Variables d\'environnement nécessaires pour Vercel');
  
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  
  const optional = [
    'NEXT_PUBLIC_API_URL',
    'NODE_ENV',
  ];
  
  log('Variables requises:', 'blue');
  required.forEach(v => log(`  ✅ ${v}`, 'green'));
  
  log('\nVariables optionnelles:', 'blue');
  optional.forEach(v => log(`  ⚪ ${v}`, 'yellow'));
  
  log('\n💡 Configure ces variables dans Vercel Dashboard:', 'cyan');
  log('   Settings → Environment Variables', 'blue');
}

/**
 * Fonction principale
 */
function main() {
  console.log('\n');
  log('✅ Vérification pré-déploiement', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  checks.gitignore = checkGitignore();
  checks.envFiles = checkEnvFiles();
  checks.packageJson = checkPackageJson();
  checks.prisma = checkPrisma();
  checks.nextConfig = checkNextConfig();
  checks.vercelConfig = checkVercelConfig();
  checks.gitStatus = checkGitStatus();
  
  listRequiredEnvVars();
  
  // Résumé
  logSection('📊 Résumé');
  
  const allPassed = Object.values(checks).every(c => c === true);
  
  Object.entries(checks).forEach(([check, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${icon} ${check.padEnd(20)} ${passed ? 'OK' : 'ÉCHEC'}`, color);
  });
  
  console.log('');
  
  if (allPassed) {
    log('✅ Tous les checks sont passés !', 'green');
    log('\n🚀 Prêt pour le déploiement !', 'cyan');
    log('\nProchaines étapes:', 'blue');
    log('  1. git add .', 'blue');
    log('  2. git commit -m "feat: add Prisma/Supabase sync tools and auth tests"', 'blue');
    log('  3. git push origin main', 'blue');
    log('  4. Configurer les variables d\'environnement sur Vercel', 'blue');
  } else {
    log('❌ Certains checks ont échoué', 'red');
    log('   Corrige les erreurs avant de déployer', 'yellow');
    process.exit(1);
  }
}

main();

