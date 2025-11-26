#!/usr/bin/env node

/**
 * Mise à jour des variables d'environnement Vercel
 */

const { execSync } = require('child_process');

const NEXTAUTH_URL = 'https://hearstai.vercel.app';

console.log('🔄 Mise à jour de NEXTAUTH_URL sur Vercel...\n');

// Supprimer et recréer pour tous les environnements
const envs = ['production', 'preview', 'development'];

for (const env of envs) {
  try {
    console.log(`📝 Mise à jour pour ${env}...`);
    
    // Supprimer (avec confirmation automatique)
    try {
      execSync(`echo "y" | vercel env rm NEXTAUTH_URL ${env}`, { 
        stdio: 'pipe',
        timeout: 10000 
      });
    } catch (e) {
      // Ignorer si n'existe pas
    }
    
    // Ajouter
    execSync(`echo "${NEXTAUTH_URL}" | vercel env add NEXTAUTH_URL ${env}`, {
      stdio: 'inherit',
      input: NEXTAUTH_URL
    });
    
    console.log(`✅ ${env} mis à jour\n`);
  } catch (error) {
    console.error(`❌ Erreur pour ${env}:`, error.message);
  }
}

console.log('✅ Mise à jour terminée !');
console.log('\n💡 Redéploie pour appliquer les changements:');
console.log('   vercel --prod');




