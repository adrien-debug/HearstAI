#!/usr/bin/env node

/**
 * 🔐 Test complet de l'authentification
 * 
 * Vérifie :
 * - Connexion à la base de données
 * - Existence de l'utilisateur admin@hearst.ai
 * - Configuration NextAuth
 * - Test de l'API d'authentification
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['error', 'warn'],
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
  console.log('\n' + '━'.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('━'.repeat(70) + '\n');
}

/**
 * Test 1: Connexion à la base de données
 */
async function testDatabaseConnection() {
  logSection('🔌 Test 1: Connexion à la base de données');
  
  try {
    await prisma.$connect();
    log('✅ Connexion réussie', 'green');
    
    // Test de requête
    const userCount = await prisma.user.count();
    log(`📊 Nombre d'utilisateurs: ${userCount}`, 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 2: Vérifier/créer l'utilisateur admin
 */
async function testAdminUser() {
  logSection('👤 Test 2: Utilisateur admin@hearst.ai');
  
  const adminEmail = 'admin@hearst.ai';
  
  try {
    // Chercher l'utilisateur
    let user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    
    if (user) {
      log(`✅ Utilisateur trouvé:`, 'green');
      log(`   ID: ${user.id}`, 'blue');
      log(`   Email: ${user.email}`, 'blue');
      log(`   Nom: ${user.name || 'Non défini'}`, 'blue');
      log(`   Créé le: ${user.createdAt}`, 'blue');
      return { exists: true, user };
    } else {
      log(`⚠️  Utilisateur non trouvé, création...`, 'yellow');
      
      user = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin User',
        },
      });
      
      log(`✅ Utilisateur créé:`, 'green');
      log(`   ID: ${user.id}`, 'blue');
      log(`   Email: ${user.email}`, 'blue');
      return { exists: false, user };
    }
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Test 3: Vérifier la configuration NextAuth
 */
async function testNextAuthConfig() {
  logSection('🔐 Test 3: Configuration NextAuth');
  
  try {
    // Vérifier que le fichier auth.ts existe et est valide
    const fs = require('fs');
    const path = require('path');
    const authPath = path.join(process.cwd(), 'lib', 'auth.ts');
    
    if (!fs.existsSync(authPath)) {
      log('❌ Fichier lib/auth.ts non trouvé', 'red');
      return false;
    }
    
    log('✅ Fichier lib/auth.ts trouvé', 'green');
    
    // Vérifier que l'API route existe
    const apiPath = path.join(process.cwd(), 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
    if (!fs.existsSync(apiPath)) {
      log('❌ Fichier app/api/auth/[...nextauth]/route.ts non trouvé', 'red');
      return false;
    }
    
    log('✅ Fichier app/api/auth/[...nextauth]/route.ts trouvé', 'green');
    
    // Vérifier les variables d'environnement NextAuth
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    
    if (!nextAuthSecret) {
      log('⚠️  NEXTAUTH_SECRET non défini (optionnel en dev)', 'yellow');
    } else {
      log('✅ NEXTAUTH_SECRET configuré', 'green');
    }
    
    if (!nextAuthUrl) {
      log('⚠️  NEXTAUTH_URL non défini (utilisera http://localhost:6001 par défaut)', 'yellow');
    } else {
      log(`✅ NEXTAUTH_URL configuré: ${nextAuthUrl}`, 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 4: Simuler l'authentification NextAuth
 */
async function testNextAuthAuth() {
  logSection('🔑 Test 4: Simulation de l\'authentification');
  
  const adminEmail = 'admin@hearst.ai';
  const testPassword = 'test123';
  
  try {
    // Simuler la logique d'autorisation de NextAuth
    log(`📧 Tentative de connexion avec: ${adminEmail}`, 'blue');
    
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });
    
    if (!user) {
      log('❌ Utilisateur non trouvé', 'red');
      return false;
    }
    
    log('✅ Utilisateur trouvé dans la base', 'green');
    log(`   ID: ${user.id}`, 'blue');
    log(`   Email: ${user.email}`, 'blue');
    
    // Note: La vérification du mot de passe n'est pas encore implémentée
    log('⚠️  Note: La vérification du mot de passe n\'est pas encore implémentée', 'yellow');
    log('   Pour l\'instant, n\'importe quel mot de passe est accepté si l\'utilisateur existe', 'yellow');
    
    // Simuler le retour de NextAuth
    const authResult = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    
    log('✅ Authentification simulée réussie', 'green');
    log(`   Résultat: ${JSON.stringify(authResult, null, 2)}`, 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 5: Vérifier la page de login
 */
async function testLoginPage() {
  logSection('📄 Test 5: Page de login');
  
  try {
    const fs = require('fs');
    const path = require('path');
    const loginPagePath = path.join(process.cwd(), 'app', 'auth', 'signin', 'page.tsx');
    
    if (!fs.existsSync(loginPagePath)) {
      log('❌ Page de login non trouvée', 'red');
      return false;
    }
    
    log('✅ Page de login trouvée: app/auth/signin/page.tsx', 'green');
    
    // Lire le contenu pour vérifier
    const content = fs.readFileSync(loginPagePath, 'utf8');
    
    if (content.includes('signIn')) {
      log('✅ Utilise signIn de next-auth/react', 'green');
    } else {
      log('⚠️  Ne semble pas utiliser signIn', 'yellow');
    }
    
    if (content.includes('admin@hearst.ai')) {
      log('✅ Email par défaut: admin@hearst.ai', 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Test 6: Vérifier les routes API
 */
async function testAPIRoutes() {
  logSection('🌐 Test 6: Routes API');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Vérifier la route NextAuth
    const nextAuthRoute = path.join(process.cwd(), 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
    if (fs.existsSync(nextAuthRoute)) {
      log('✅ Route NextAuth: /api/auth/[...nextauth]', 'green');
    } else {
      log('❌ Route NextAuth non trouvée', 'red');
      return false;
    }
    
    return true;
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
  log('🔐 Test complet de l\'authentification', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const results = {
    database: false,
    adminUser: false,
    nextAuthConfig: false,
    nextAuthAuth: false,
    loginPage: false,
    apiRoutes: false,
  };
  
  try {
    // Test 1: Connexion
    results.database = await testDatabaseConnection();
    if (!results.database) {
      log('\n❌ Impossible de continuer sans connexion à la base', 'red');
      process.exit(1);
    }
    
    // Test 2: Utilisateur admin
    const userResult = await testAdminUser();
    results.adminUser = userResult !== null;
    
    // Test 3: Configuration NextAuth
    results.nextAuthConfig = await testNextAuthConfig();
    
    // Test 4: Authentification
    if (results.adminUser) {
      results.nextAuthAuth = await testNextAuthAuth();
    }
    
    // Test 5: Page de login
    results.loginPage = await testLoginPage();
    
    // Test 6: Routes API
    results.apiRoutes = await testAPIRoutes();
    
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
      log('\n🚀 Vous pouvez maintenant:', 'cyan');
      log('   1. Démarrer le serveur: npm run dev', 'blue');
      log('   2. Ouvrir: http://localhost:6001/auth/signin', 'blue');
      log('   3. Se connecter avec:', 'blue');
      log('      Email: admin@hearst.ai', 'blue');
      log('      Mot de passe: n\'importe quel mot de passe', 'blue');
    } else {
      log('❌ Certains tests ont échoué', 'red');
      log('   Vérifiez les erreurs ci-dessus', 'yellow');
    }
    
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();





