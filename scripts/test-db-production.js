#!/usr/bin/env node

/**
 * 🗄️ Test de la base de données en production
 * 
 * Vérifie la connexion et l'existence de l'utilisateur
 */

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

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

async function main() {
  console.log('');
  log('🗄️  TEST BASE DE DONNÉES PRODUCTION', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  try {
    // Test 1: Connexion
    logSection('🔌 Test 1: Connexion à la base de données');
    
    try {
      await prisma.$connect();
      log('  ✅ Connexion réussie', 'green');
    } catch (error) {
      log(`  ❌ Erreur de connexion: ${error.message}`, 'red');
      log('  ', 'reset');
      log('  💡 Vérifie DATABASE_URL dans .env.local', 'yellow');
      log('  💡 Vérifie que l\'URL Prisma Accelerate est correcte', 'yellow');
      process.exit(1);
    }
    
    // Test 2: Vérifier l'utilisateur admin@hearst.ai
    logSection('👤 Test 2: Vérification de l\'utilisateur');
    
    try {
      const user = await prisma.user.findUnique({
        where: { email: 'admin@hearst.ai' },
      });
      
      if (user) {
        log('  ✅ Utilisateur admin@hearst.ai trouvé', 'green');
        log(`  ID: ${user.id}`, 'blue');
        log(`  Email: ${user.email}`, 'blue');
        log(`  Name: ${user.name || 'N/A'}`, 'blue');
        log(`  Créé le: ${user.createdAt}`, 'blue');
      } else {
        log('  ❌ Utilisateur admin@hearst.ai NON TROUVÉ', 'red');
        log('  ', 'reset');
        log('  💡 Solution: Créer l\'utilisateur', 'yellow');
        log('  ', 'reset');
        log('  Exécute: npm run create-user', 'cyan');
        log('  Ou crée-le manuellement via Prisma Studio: npm run db:studio', 'cyan');
      }
    } catch (error) {
      log(`  ❌ Erreur lors de la recherche: ${error.message}`, 'red');
    }
    
    // Test 3: Lister tous les utilisateurs
    logSection('📋 Test 3: Liste des utilisateurs');
    
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
        take: 10,
      });
      
      if (users.length > 0) {
        log(`  ✅ ${users.length} utilisateur(s) trouvé(s)`, 'green');
        users.forEach((user, index) => {
          log(`  ${index + 1}. ${user.email} (${user.name || 'N/A'})`, 'blue');
        });
      } else {
        log('  ⚠️  Aucun utilisateur trouvé dans la base', 'yellow');
        log('  ', 'reset');
        log('  💡 Solution: Créer au moins un utilisateur', 'yellow');
        log('  Exécute: npm run create-user', 'cyan');
      }
    } catch (error) {
      log(`  ❌ Erreur: ${error.message}`, 'red');
    }
    
    // Test 4: Vérifier la structure de la table User
    logSection('🔍 Test 4: Structure de la table User');
    
    try {
      const userCount = await prisma.user.count();
      log(`  ✅ Table User accessible (${userCount} utilisateur(s))`, 'green');
    } catch (error) {
      log(`  ❌ Erreur: ${error.message}`, 'red');
      log('  💡 La table User pourrait ne pas exister', 'yellow');
      log('  💡 Exécute: npm run db:push', 'cyan');
    }
    
    // Résumé
    logSection('📊 Résumé');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@hearst.ai' },
    });
    
    if (user) {
      log('✅ Base de données OK', 'green');
      log('✅ Utilisateur admin@hearst.ai existe', 'green');
      log('', 'reset');
      log('💡 Si le login ne fonctionne toujours pas:', 'yellow');
      log('  1. Vérifie les logs Vercel: vercel logs', 'blue');
      log('  2. Vérifie la console du navigateur (F12)', 'blue');
      log('  3. Vérifie NEXTAUTH_URL sur Vercel', 'blue');
    } else {
      log('⚠️  Utilisateur admin@hearst.ai manquant', 'yellow');
      log('', 'reset');
      log('💡 Solution:', 'yellow');
      log('  1. Crée l\'utilisateur: npm run create-user', 'cyan');
      log('  2. Ou via Prisma Studio: npm run db:studio', 'cyan');
      log('  3. Redéploie après création', 'cyan');
    }
    
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('');
}

main();





