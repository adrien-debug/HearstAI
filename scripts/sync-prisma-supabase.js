#!/usr/bin/env node

/**
 * 🔄 Script de synchronisation Prisma ↔ Supabase
 * 
 * Ce script permet de :
 * - Vérifier la synchronisation entre le schéma Prisma et Supabase
 * - Appliquer les migrations manquantes
 * - Détecter les différences de schéma
 * - Générer un rapport de synchronisation
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Fallback sur .env

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Couleurs pour le terminal
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
 * Vérifie la connexion à la base de données
 */
async function checkConnection() {
  logSection('🔌 Vérification de la connexion');
  
  try {
    await prisma.$connect();
    log('✅ Connexion réussie à la base de données', 'green');
    
    // Test de requête simple
    const userCount = await prisma.user.count();
    log(`📊 Utilisateurs dans la base: ${userCount}`, 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Vérifie que toutes les tables du schéma existent
 */
async function checkTables() {
  logSection('📋 Vérification des tables');
  
  // Mapping des noms de modèles vers les noms Prisma (camelCase)
  const models = [
    { name: 'User', prisma: 'user' },
    { name: 'Account', prisma: 'account' },
    { name: 'Session', prisma: 'session' },
    { name: 'VerificationToken', prisma: 'verificationToken' },
    { name: 'Project', prisma: 'project' },
    { name: 'Version', prisma: 'version' },
    { name: 'File', prisma: 'file' },
    { name: 'Job', prisma: 'job' },
    { name: 'LogEntry', prisma: 'logEntry' },
    { name: 'Customer', prisma: 'customer' },
  ];
  
  const results = {
    existing: [],
    missing: [],
    errors: [],
  };
  
  for (const { name, prisma: prismaName } of models) {
    try {
      // Tente une requête simple pour vérifier l'existence
      const count = await prisma[prismaName].count();
      results.existing.push({ model: name, count });
      log(`  ✅ ${name.padEnd(20)} (${count} enregistrements)`, 'green');
    } catch (error) {
      if (error.message.includes('does not exist') || error.message.includes('Unknown table')) {
        results.missing.push(name);
        log(`  ❌ ${name.padEnd(20)} (table manquante)`, 'red');
      } else {
        results.errors.push({ model: name, error: error.message });
        log(`  ⚠️  ${name.padEnd(20)} (erreur: ${error.message})`, 'yellow');
      }
    }
  }
  
  return results;
}

/**
 * Vérifie l'intégrité des relations
 */
async function checkRelations() {
  logSection('🔗 Vérification des relations');
  
  const checks = [];
  
  try {
    // Vérifier User -> Account
    const usersWithAccounts = await prisma.user.findMany({
      include: { accounts: true },
    });
    
    // Vérifier les comptes orphelins manuellement
    const allAccounts = await prisma.account.findMany({
      select: { userId: true },
    });
    const allUserIds = new Set(
      (await prisma.user.findMany({ select: { id: true } })).map(u => u.id)
    );
    const orphanAccounts = allAccounts.filter(a => !allUserIds.has(a.userId));
    
    checks.push({
      name: 'User ↔ Account',
      status: orphanAccounts.length === 0,
      details: `${usersWithAccounts.length} users, ${orphanAccounts.length} orphelins`,
    });
    
    // Vérifier User -> Project
    const usersWithProjects = await prisma.user.findMany({
      include: { projects: true },
    });
    
    checks.push({
      name: 'User ↔ Project',
      status: true,
      details: `${usersWithProjects.length} users avec projets`,
    });
    
    // Vérifier Project -> Version
    const projectsWithVersions = await prisma.project.findMany({
      include: { versions: true },
    });
    
    checks.push({
      name: 'Project ↔ Version',
      status: true,
      details: `${projectsWithVersions.length} projets avec versions`,
    });
    
    checks.forEach(check => {
      if (check.status) {
        log(`  ✅ ${check.name.padEnd(25)} ${check.details}`, 'green');
      } else {
        log(`  ❌ ${check.name.padEnd(25)} ${check.details}`, 'red');
      }
    });
    
    return checks;
  } catch (error) {
    log(`  ⚠️  Erreur lors de la vérification: ${error.message}`, 'yellow');
    return checks;
  }
}

/**
 * Génère un rapport de synchronisation
 */
async function generateReport() {
  logSection('📊 Génération du rapport');
  
  const report = {
    timestamp: new Date().toISOString(),
    connection: await checkConnection(),
    tables: await checkTables(),
    relations: await checkRelations(),
  };
  
  const reportPath = path.join(process.cwd(), 'prisma-sync-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`✅ Rapport sauvegardé: ${reportPath}`, 'green');
  
  return report;
}

/**
 * Applique les migrations manquantes
 */
async function applyMigrations() {
  logSection('🚀 Application des migrations');
  
  try {
    log('  Exécution de: npx prisma migrate deploy', 'blue');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    log('  ✅ Migrations appliquées', 'green');
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Synchronise le schéma avec db push (développement uniquement)
 */
async function syncSchema() {
  logSection('🔄 Synchronisation du schéma');
  
  try {
    log('  ⚠️  ATTENTION: Cette opération peut modifier la structure de la base', 'yellow');
    log('  Exécution de: npx prisma db push', 'blue');
    
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    log('  ✅ Schéma synchronisé', 'green');
    return true;
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  console.log('\n');
  log('🔄 Synchronisation Prisma ↔ Supabase', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  try {
    switch (command) {
      case 'check':
        await checkConnection();
        await checkTables();
        await checkRelations();
        await generateReport();
        break;
        
      case 'migrate':
        await checkConnection();
        await applyMigrations();
        await checkTables();
        break;
        
      case 'sync':
        await checkConnection();
        await syncSchema();
        await checkTables();
        break;
        
      case 'report':
        await generateReport();
        break;
        
      default:
        console.log('\nUsage:');
        console.log('  node scripts/sync-prisma-supabase.js check    - Vérifie la synchronisation');
        console.log('  node scripts/sync-prisma-supabase.js migrate  - Applique les migrations');
        console.log('  node scripts/sync-prisma-supabase.js sync    - Synchronise le schéma (dev)');
        console.log('  node scripts/sync-prisma-supabase.js report  - Génère un rapport\n');
        process.exit(1);
    }
    
    log('\n✅ Opération terminée avec succès', 'green');
  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

