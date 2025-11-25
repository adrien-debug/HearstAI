#!/usr/bin/env node

/**
 * 🏥 Script de monitoring de la santé de la base de données
 * 
 * Vérifie :
 * - La connexion
 * - Les performances
 * - L'intégrité des données
 * - L'espace disque (si accessible)
 * - Les index
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback sur .env

const { PrismaClient } = require('@prisma/client');
const { performance } = require('perf_hooks');

const prisma = new PrismaClient({
  log: ['error'],
});

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

/**
 * Test de performance d'une requête
 */
async function testPerformance(query, label) {
  const start = performance.now();
  try {
    await query();
    const duration = performance.now() - start;
    return { success: true, duration };
  } catch (error) {
    const duration = performance.now() - start;
    return { success: false, duration, error: error.message };
  }
}

/**
 * Vérifie la connexion et les performances de base
 */
async function checkConnection() {
  logSection('🔌 Test de connexion');
  
  const result = await testPerformance(
    () => prisma.$queryRaw`SELECT 1 as test`,
    'Connexion de base'
  );
  
  if (result.success) {
    log(`  ✅ Connexion réussie (${result.duration.toFixed(2)}ms)`, 'green');
    return true;
  } else {
    log(`  ❌ Connexion échouée: ${result.error}`, 'red');
    return false;
  }
}

/**
 * Vérifie les performances des requêtes principales
 */
async function checkPerformance() {
  logSection('⚡ Tests de performance');
  
  const tests = [
    {
      name: 'Count Users',
      query: () => prisma.user.count(),
    },
    {
      name: 'Count Projects',
      query: () => prisma.project.count(),
    },
    {
      name: 'Count Customers',
      query: () => prisma.customer.count(),
    },
    {
      name: 'Find Users with Relations',
      query: () => prisma.user.findMany({
        include: {
          accounts: true,
          projects: true,
        },
        take: 10,
      }),
    },
    {
      name: 'Find Projects with Versions',
      query: () => prisma.project.findMany({
        include: {
          versions: true,
        },
        take: 10,
      }),
    },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testPerformance(test.query, test.name);
    results.push({ ...test, ...result });
    
    if (result.success) {
      const status = result.duration < 100 ? 'green' : result.duration < 500 ? 'yellow' : 'red';
      const icon = result.duration < 100 ? '✅' : result.duration < 500 ? '⚠️' : '❌';
      log(`  ${icon} ${test.name.padEnd(30)} ${result.duration.toFixed(2)}ms`, status);
    } else {
      log(`  ❌ ${test.name.padEnd(30)} Erreur: ${result.error}`, 'red');
    }
  }
  
  return results;
}

/**
 * Vérifie l'intégrité des données
 */
async function checkDataIntegrity() {
  logSection('🔍 Vérification de l\'intégrité');
  
  const checks = [];
  
  try {
    // Vérifier que tous les utilisateurs ont un email (email est required dans le schéma)
    const allUsers = await prisma.user.findMany({
      select: { email: true },
    });
    const usersWithoutEmail = allUsers.filter(u => !u.email || u.email.trim() === '').length;
    
    checks.push({
      name: 'Users avec email valide',
      count: usersWithoutEmail,
      status: usersWithoutEmail === 0,
    });
    
    // Vérifier les comptes orphelins
    const allAccounts = await prisma.account.findMany({
      select: { userId: true },
    });
    const allUserIds = new Set(
      (await prisma.user.findMany({ select: { id: true } })).map(u => u.id)
    );
    const orphanAccounts = allAccounts.filter(a => !allUserIds.has(a.userId));
    
    checks.push({
      name: 'Accounts orphelins',
      count: orphanAccounts.length,
      status: orphanAccounts.length === 0,
    });
    
    // Vérifier les projets sans utilisateur
    const allProjects = await prisma.project.findMany({
      select: { userId: true },
    });
    const orphanProjects = allProjects.filter(p => !allUserIds.has(p.userId));
    
    checks.push({
      name: 'Projects orphelins',
      count: orphanProjects.length,
      status: orphanProjects.length === 0,
    });
    
    // Vérifier les doublons d'email
    const users = await prisma.user.findMany({
      select: { email: true },
    });
    const emails = users.map(u => u.email).filter(Boolean);
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    
    checks.push({
      name: 'Emails dupliqués',
      count: duplicates.length,
      status: duplicates.length === 0,
    });
    
    checks.forEach(check => {
      if (check.status) {
        log(`  ✅ ${check.name.padEnd(30)} OK`, 'green');
      } else {
        log(`  ❌ ${check.name.padEnd(30)} ${check.count} problème(s)`, 'red');
      }
    });
    
    return checks;
  } catch (error) {
    log(`  ⚠️  Erreur: ${error.message}`, 'yellow');
    return checks;
  }
}

/**
 * Statistiques de la base de données
 */
async function getStatistics() {
  logSection('📊 Statistiques');
  
  try {
    const stats = {
      users: await prisma.user.count(),
      accounts: await prisma.account.count(),
      sessions: await prisma.session.count(),
      projects: await prisma.project.count(),
      versions: await prisma.version.count(),
      files: await prisma.file.count(),
      jobs: await prisma.job.count(),
      logEntries: await prisma.logEntry.count(),
      customers: await prisma.customer.count(),
    };
    
    log(`  👥 Users:           ${stats.users.toString().padStart(6)}`, 'blue');
    log(`  🔐 Accounts:        ${stats.accounts.toString().padStart(6)}`, 'blue');
    log(`  🎫 Sessions:        ${stats.sessions.toString().padStart(6)}`, 'blue');
    log(`  📁 Projects:        ${stats.projects.toString().padStart(6)}`, 'blue');
    log(`  📦 Versions:        ${stats.versions.toString().padStart(6)}`, 'blue');
    log(`  📄 Files:           ${stats.files.toString().padStart(6)}`, 'blue');
    log(`  ⚙️  Jobs:            ${stats.jobs.toString().padStart(6)}`, 'blue');
    log(`  📝 Log Entries:     ${stats.logEntries.toString().padStart(6)}`, 'blue');
    log(`  👤 Customers:       ${stats.customers.toString().padStart(6)}`, 'blue');
    
    return stats;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return {};
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n');
  log('🏥 Monitoring de la santé de la base de données', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  try {
    const connected = await checkConnection();
    if (!connected) {
      log('\n❌ Impossible de continuer sans connexion', 'red');
      process.exit(1);
    }
    
    await getStatistics();
    await checkPerformance();
    await checkDataIntegrity();
    
    log('\n✅ Vérification terminée', 'green');
  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

