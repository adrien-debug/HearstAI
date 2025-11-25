#!/usr/bin/env node

/**
 * 🚀 Configuration automatique Vercel
 * Configure toutes les variables d'environnement nécessaires
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

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
  console.log('\n' + '━'.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('━'.repeat(70) + '\n');
}

// Variables à configurer
const DATABASE_URL = process.env.DATABASE_URL;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!DATABASE_URL) {
  log('❌ DATABASE_URL non trouvé dans .env.local', 'red');
  process.exit(1);
}

if (!NEXTAUTH_SECRET) {
  log('❌ NEXTAUTH_SECRET non trouvé dans .env.local', 'red');
  process.exit(1);
}

// Récupérer l'URL du projet Vercel
function getVercelURL() {
  try {
    // Essayer de récupérer depuis les déploiements
    const output = execSync('vercel ls --json', { encoding: 'utf8', stdio: 'pipe' });
    const deployments = JSON.parse(output);
    
    if (deployments && deployments.length > 0) {
      const latest = deployments[0];
      if (latest.url) {
        return `https://${latest.url}`;
      }
    }
  } catch (error) {
    // Ignorer les erreurs
  }
  
  // Essayer depuis le projet
  try {
    const projectFile = path.join(process.cwd(), '.vercel', 'project.json');
    if (fs.existsSync(projectFile)) {
      const project = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
      const projectName = project.projectName;
      return `https://${projectName}.vercel.app`;
    }
  } catch (error) {
    // Ignorer
  }
  
  return null;
}

// Configurer une variable d'environnement
function setEnvVar(name, value, environments = ['production', 'preview', 'development']) {
  log(`📝 Configuration de ${name}...`, 'blue');
  
  for (const env of environments) {
    try {
      // Vérifier si la variable existe déjà
      const existing = execSync(`vercel env ls ${env}`, { encoding: 'utf8', stdio: 'pipe' });
      
      if (existing.includes(name)) {
        log(`   ⚠️  ${name} existe déjà pour ${env}`, 'yellow');
        log(`   💡 Pour la mettre à jour, utilise: vercel env rm ${name} ${env}`, 'yellow');
        continue;
      }
      
      // Ajouter la variable
      execSync(`echo "${value}" | vercel env add ${name} ${env}`, { 
        stdio: 'inherit',
        input: value 
      });
      
      log(`   ✅ ${name} configuré pour ${env}`, 'green');
    } catch (error) {
      log(`   ❌ Erreur pour ${env}: ${error.message}`, 'red');
    }
  }
}

// Fonction principale
async function main() {
  console.log('\n');
  log('🚀 Configuration automatique Vercel', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  logSection('📋 Vérification');
  
  // Vérifier Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log('✅ Vercel CLI installé', 'green');
  } catch (error) {
    log('❌ Vercel CLI non installé', 'red');
    log('   Installe-le avec: npm i -g vercel', 'yellow');
    process.exit(1);
  }
  
  // Vérifier que le projet est lié
  const projectFile = path.join(process.cwd(), '.vercel', 'project.json');
  if (!fs.existsSync(projectFile)) {
    log('❌ Projet Vercel non lié', 'red');
    log('   Lance: vercel link', 'yellow');
    process.exit(1);
  }
  
  const project = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
  log(`✅ Projet lié: ${project.projectName}`, 'green');
  
  // Récupérer l'URL
  logSection('🌐 Récupération de l\'URL Vercel');
  
  let NEXTAUTH_URL = getVercelURL();
  
  if (!NEXTAUTH_URL) {
    log('⚠️  Impossible de récupérer l\'URL automatiquement', 'yellow');
    log('   Utilise le format: https://ton-projet.vercel.app', 'yellow');
    log('   Ou récupère-la depuis le dashboard Vercel', 'yellow');
    
    // Utiliser le nom du projet comme fallback
    NEXTAUTH_URL = `https://${project.projectName}.vercel.app`;
    log(`   URL par défaut: ${NEXTAUTH_URL}`, 'blue');
  } else {
    log(`✅ URL trouvée: ${NEXTAUTH_URL}`, 'green');
  }
  
  // Configuration
  logSection('⚙️  Configuration des variables');
  
  log('Variables à configurer:', 'blue');
  log(`  - DATABASE_URL: ${DATABASE_URL.substring(0, 60)}...`, 'blue');
  log(`  - NEXTAUTH_URL: ${NEXTAUTH_URL}`, 'blue');
  log(`  - NEXTAUTH_SECRET: ${NEXTAUTH_SECRET.substring(0, 20)}...`, 'blue');
  console.log('');
  
  // Configurer DATABASE_URL
  setEnvVar('DATABASE_URL', DATABASE_URL);
  
  // Configurer NEXTAUTH_URL
  setEnvVar('NEXTAUTH_URL', NEXTAUTH_URL);
  
  // Configurer NEXTAUTH_SECRET
  setEnvVar('NEXTAUTH_SECRET', NEXTAUTH_SECRET);
  
  // Résumé
  logSection('📊 Résumé');
  
  log('✅ Configuration terminée !', 'green');
  log('\n📋 Vérifie les variables avec:', 'cyan');
  log('   vercel env ls', 'blue');
  log('\n🚀 Le prochain push déclenchera un déploiement', 'cyan');
  log('   Ou déploie manuellement avec: vercel --prod', 'blue');
  console.log('');
}

main().catch(error => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

