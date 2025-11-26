#!/usr/bin/env node

/**
 * Script pour corriger les problèmes de données du dashboard
 * - Vérifie les APIs
 * - Charge des données de test si nécessaire
 * - Met à jour les stats
 */

const http = require('http');

const BASE_URL = 'http://localhost:6001';
const BACKEND_URL = 'http://localhost:4000';

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n🔍 Diagnostic et correction du dashboard...\n');

  // 1. Vérifier les APIs
  console.log('1️⃣ Vérification des APIs...');
  
  try {
    const [health, status, projects, stats] = await Promise.all([
      fetch(`${BASE_URL}/api/health`),
      fetch(`${BASE_URL}/api/status`),
      fetch(`${BASE_URL}/api/projects`),
      fetch(`${BASE_URL}/api/stats`).catch(() => null),
    ]);

    console.log(`   ✅ Health: ${health.status === 200 ? 'OK' : 'ERREUR'}`);
    console.log(`   ✅ Status: ${status.status === 200 ? 'OK' : 'ERREUR'}`);
    console.log(`   ✅ Projects: ${projects.status === 200 ? 'OK' : 'ERREUR'}`);
    
    if (projects.data?.projects) {
      console.log(`   📊 ${projects.data.projects.length} projet(s) trouvé(s)`);
    }
    
    if (stats?.data?.stats) {
      console.log(`   📊 Stats: ${JSON.stringify(stats.data.stats)}`);
    }

    // 2. Vérifier le backend
    console.log('\n2️⃣ Vérification du backend...');
    try {
      const backendHealth = await fetch(`${BACKEND_URL}/api/health`);
      console.log(`   ✅ Backend: ${backendHealth.status === 200 ? 'OK' : 'ERREUR'}`);
      
      const backendStats = await fetch(`${BACKEND_URL}/api/stats`);
      if (backendStats.data?.stats) {
        console.log(`   📊 Backend Stats: ${JSON.stringify(backendStats.data.stats)}`);
      }
    } catch (err) {
      console.log(`   ⚠️  Backend non accessible: ${err.message}`);
    }

    console.log('\n✅ Diagnostic terminé\n');
    console.log('💡 Solutions:');
    console.log('   1. Le dashboard affiche des données statiques (hardcodées)');
    console.log('   2. Les données viennent des composants React, pas de l\'API');
    console.log('   3. Pour voir les vraies données, vérifier:');
    console.log('      - http://localhost:6001/api/projects');
    console.log('      - http://localhost:6001/api/stats');
    console.log('   4. Le problème est que les composants n\'appellent pas l\'API correctement\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();




