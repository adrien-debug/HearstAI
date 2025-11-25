#!/usr/bin/env node

/**
 * 🔧 Script pour corriger le problème de login en production
 * 
 * Vérifie et corrige NEXTAUTH_URL sur Vercel
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
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

// Vérifier que Vercel CLI est installé
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Obtenir l'URL du projet Vercel
function getVercelProjectURL() {
  try {
    const output = execSync('vercel ls --json', { encoding: 'utf-8' });
    const deployments = JSON.parse(output);
    if (deployments && deployments.length > 0) {
      return deployments[0].url;
    }
  } catch (error) {
    // Si ça échoue, on utilise l'URL par défaut
  }
  return 'https://hearstai.vercel.app';
}

// Vérifier les variables d'environnement
function checkEnvVars() {
  logSection('🔍 Vérification des variables d\'environnement');
  
  try {
    const output = execSync('vercel env ls --json', { encoding: 'utf-8' });
    const vars = JSON.parse(output);
    
    const nextAuthUrl = vars.find(v => v.key === 'NEXTAUTH_URL');
    const nextAuthSecret = vars.find(v => v.key === 'NEXTAUTH_SECRET');
    
    log('Variables trouvées:', 'blue');
    console.log('');
    
    if (nextAuthUrl) {
      log(`  NEXTAUTH_URL: ${nextAuthUrl.value}`, nextAuthUrl.value === 'https://hearstai.vercel.app' ? 'green' : 'yellow');
      if (nextAuthUrl.value !== 'https://hearstai.vercel.app') {
        log('  ⚠️  Cette valeur est incorrecte !', 'yellow');
      }
    } else {
      log('  NEXTAUTH_URL: ❌ Non trouvé', 'red');
    }
    
    if (nextAuthSecret) {
      log(`  NEXTAUTH_SECRET: ${nextAuthSecret.value ? '✅ Défini' : '❌ Vide'}`, nextAuthSecret.value ? 'green' : 'red');
    } else {
      log('  NEXTAUTH_SECRET: ❌ Non trouvé', 'red');
    }
    
    return { nextAuthUrl, nextAuthSecret };
  } catch (error) {
    log('  ❌ Erreur lors de la vérification:', 'red');
    log(`  ${error.message}`, 'red');
    return null;
  }
}

// Corriger NEXTAUTH_URL
function fixNextAuthUrl() {
  return new Promise((resolve) => {
    logSection('🔧 Correction de NEXTAUTH_URL');
    
    const correctUrl = 'https://hearstai.vercel.app';
    
    log(`URL correcte: ${correctUrl}`, 'blue');
    console.log('');
    
    rl.question('Voulez-vous mettre à jour NEXTAUTH_URL sur Vercel ? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        try {
          log('Mise à jour en cours...', 'blue');
          
          // Supprimer l'ancienne variable pour Production
          try {
            execSync(`vercel env rm NEXTAUTH_URL production --yes`, { stdio: 'ignore' });
          } catch {
            // Ignore si elle n'existe pas
          }
          
          // Ajouter la nouvelle variable
          // Note: On ne peut pas automatiser l'input, donc on affiche les instructions
          log('\n⚠️  Action manuelle requise:', 'yellow');
          log('Exécutez cette commande dans votre terminal:', 'blue');
          console.log('');
          log(`  vercel env add NEXTAUTH_URL production`, 'cyan');
          console.log('');
          log(`  Quand demandé, entrez: ${correctUrl}`, 'cyan');
          console.log('');
          log('Puis redéployez:', 'blue');
          log('  vercel --prod', 'cyan');
          console.log('');
          
        } catch (error) {
          log(`  ❌ Erreur: ${error.message}`, 'red');
        }
      } else {
        log('  ⏭️  Correction annulée', 'yellow');
      }
      
      resolve();
    });
  });
}

// Vérifier la configuration du middleware
function checkMiddlewareConfig() {
  logSection('🔍 Vérification du middleware');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf-8');
      
      if (content.includes('__Secure-next-auth.session-token')) {
        log('  ✅ Middleware configuré pour les cookies sécurisés', 'green');
      } else {
        log('  ⚠️  Middleware pourrait nécessiter une mise à jour', 'yellow');
      }
      
      if (content.includes('NEXTAUTH_SECRET')) {
        log('  ✅ Middleware vérifie NEXTAUTH_SECRET', 'green');
      }
    } else {
      log('  ⚠️  Fichier middleware.ts non trouvé', 'yellow');
    }
  } catch (error) {
    log(`  ❌ Erreur: ${error.message}`, 'red');
  }
}

// Fonction principale
async function main() {
  console.log('');
  log('🔧 Diagnostic et Correction du Login en Production', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  // Vérifier Vercel CLI
  if (!checkVercelCLI()) {
    log('\n❌ Vercel CLI n\'est pas installé', 'red');
    log('Installez-le avec: npm i -g vercel', 'yellow');
    process.exit(1);
  }
  
  log('\n✅ Vercel CLI trouvé', 'green');
  
  // Vérifier les variables
  const envVars = checkEnvVars();
  
  // Vérifier le middleware
  checkMiddlewareConfig();
  
  // Proposer la correction
  if (envVars && (!envVars.nextAuthUrl || envVars.nextAuthUrl.value !== 'https://hearstai.vercel.app')) {
    await fixNextAuthUrl();
  } else if (envVars && envVars.nextAuthUrl && envVars.nextAuthUrl.value === 'https://hearstai.vercel.app') {
    log('\n✅ NEXTAUTH_URL est correctement configuré', 'green');
    log('\nSi le login ne fonctionne toujours pas, vérifiez:', 'blue');
    log('  1. Que le déploiement est terminé', 'blue');
    log('  2. Les logs Vercel: vercel logs', 'blue');
    log('  3. La console du navigateur pour les erreurs', 'blue');
  }
  
  // Résumé
  logSection('📋 Résumé');
  log('Problèmes courants avec NextAuth en production:', 'blue');
  console.log('');
  log('  1. ❌ NEXTAUTH_URL incorrect (doit être https://hearstai.vercel.app)', 'yellow');
  log('  2. ❌ NEXTAUTH_SECRET manquant ou incorrect', 'yellow');
  log('  3. ❌ Cookies sécurisés non activés', 'yellow');
  log('  4. ❌ Base de données inaccessible', 'yellow');
  console.log('');
  log('Solutions:', 'blue');
  log('  1. Vérifier NEXTAUTH_URL sur Vercel Dashboard', 'green');
  log('  2. Vérifier NEXTAUTH_SECRET', 'green');
  log('  3. Redéployer après modification des variables', 'green');
  log('  4. Vérifier les logs: vercel logs', 'green');
  console.log('');
  
  rl.close();
}

main().catch(error => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  console.error(error);
  rl.close();
  process.exit(1);
});


