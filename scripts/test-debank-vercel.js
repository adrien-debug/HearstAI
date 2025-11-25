#!/usr/bin/env node

/**
 * Script de test pour vérifier l'API DeBank sur Vercel
 * Teste directement l'endpoint /api/customers sur la production
 */

require('dotenv').config({ path: '.env.local' });

const VERCEL_URL = process.env.VERCEL_URL || 'hearstai.vercel.app';
const BASE_URL = VERCEL_URL.startsWith('http') ? VERCEL_URL : `https://${VERCEL_URL}`;

async function testDeBankOnVercel() {
  console.log('🧪 Test de l\'API DeBank sur Vercel\n');
  console.log('='.repeat(60));
  console.log(`📍 URL: ${BASE_URL}`);
  console.log('='.repeat(60) + '\n');

  // Test 1: GET /api/customers
  console.log('📡 Test 1: GET /api/customers (avec refresh DeBank)...');
  try {
    const url = `${BASE_URL}/api/customers?refresh=true`;
    console.log(`   URL: ${url}\n`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    console.log(`   ✅ Succès! Status: ${response.status}`);
    console.log(`   📊 Source: ${data.source || 'unknown'}`);
    console.log(`   📋 Nombre de customers: ${data.count || data.customers?.length || 0}`);

    if (data.customers && data.customers.length > 0) {
      console.log(`\n   📝 Détails des customers:`);
      data.customers.forEach((customer, idx) => {
        console.log(`\n   ${idx + 1}. ${customer.name || customer.erc20Address}`);
        console.log(`      - Address: ${customer.erc20Address}`);
        console.log(`      - Total Value: $${customer.totalValue || 0}`);
        console.log(`      - Total Debt: $${customer.totalDebt || 0}`);
        console.log(`      - Health Factor: ${customer.healthFactor || 0}`);
        console.log(`      - Positions: ${customer.positions?.length || 0}`);
        if (customer.error) {
          console.log(`      - ⚠️  Erreur: ${customer.error}`);
        }
      });
    } else {
      console.log(`   ⚠️  Aucun customer trouvé`);
    }

  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    if (error.message.includes('fetch failed')) {
      console.error(`   💡 Vérifie que l'URL Vercel est correcte: ${BASE_URL}`);
    }
  }

  console.log('\n' + '='.repeat(60));

  // Test 2: GET /api/collateral
  console.log('\n📡 Test 2: GET /api/collateral...');
  try {
    // Récupérer d'abord les customers pour avoir leurs adresses
    const customersUrl = `${BASE_URL}/api/customers`;
    const customersRes = await fetch(customersUrl);
    const customersData = await customersRes.json();

    if (customersData.customers && customersData.customers.length > 0) {
      const firstCustomer = customersData.customers[0];
      const wallet = firstCustomer.erc20Address;
      
      const url = `${BASE_URL}/api/collateral?wallets=${wallet}&chains=eth`;
      console.log(`   URL: ${url}\n`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();
      console.log(`   ✅ Succès! Status: ${response.status}`);
      console.log(`   📊 Source: ${data.source || 'unknown'}`);
      console.log(`   📋 Nombre de clients: ${data.count || data.clients?.length || 0}`);

      if (data.clients && data.clients.length > 0) {
        const client = data.clients[0];
        console.log(`\n   📝 Détails du premier client:`);
        console.log(`      - ID: ${client.id}`);
        console.log(`      - Nom: ${client.name}`);
        console.log(`      - Positions: ${client.positions?.length || 0}`);
        console.log(`      - Total Value: $${client.totalValue || 0}`);
        console.log(`      - Total Debt: $${client.totalDebt || 0}`);
        if (client.error) {
          console.log(`      - ⚠️  Erreur: ${client.error}`);
        }
      }
    } else {
      console.log(`   ⚠️  Aucun customer trouvé pour tester /api/collateral`);
    }

  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Tests terminés!\n');
  console.log('💡 Pour voir les logs détaillés sur Vercel:');
  console.log(`   https://vercel.com/adrien-nejkovics-projects/hearstai/logs\n`);
}

// Exécuter les tests
testDeBankOnVercel().catch(console.error);


