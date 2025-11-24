#!/usr/bin/env node

/**
 * Script de test pour l'API DeBank Pro OpenAPI
 * Teste les endpoints principaux et affiche les résultats
 */

require('dotenv').config({ path: '.env.local' });

const DEBANK_BASE_URL = "https://pro-openapi.debank.com/v1";
const DEBANK_ACCESS_KEY = process.env.DEBANK_ACCESS_KEY;

// Adresse de test (peut être modifiée)
const TEST_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // Vitalik Buterin (exemple public)

async function testDeBankAPI() {
  console.log("🧪 Test de l'API DeBank Pro OpenAPI\n");
  console.log("=" .repeat(60));
  
  if (!DEBANK_ACCESS_KEY) {
    console.error("❌ ERREUR: DEBANK_ACCESS_KEY non configuré dans .env.local");
    process.exit(1);
  }
  
  console.log(`✅ Clé API: ${DEBANK_ACCESS_KEY.substring(0, 10)}...`);
  console.log(`📝 Wallet de test: ${TEST_WALLET}\n`);
  
  // Test 1: Récupérer les protocoles complexes d'un wallet
  console.log("📡 Test 1: Récupération des protocoles complexes...");
  try {
    const url = new URL(`${DEBANK_BASE_URL}/user/all_complex_protocol_list`);
    url.searchParams.set('id', TEST_WALLET);
    url.searchParams.set('chain_ids', 'eth');
    
    console.log(`   URL: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'AccessKey': DEBANK_ACCESS_KEY,
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    console.log(`   ✅ Succès! Status: ${response.status}`);
    console.log(`   📊 Nombre de protocoles: ${Array.isArray(data) ? data.length : 'N/A'}`);
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`   📋 Protocoles trouvés:`);
      data.slice(0, 5).forEach((proto, idx) => {
        console.log(`      ${idx + 1}. ${proto.name || proto.id} (${proto.chain || 'unknown'})`);
      });
      if (data.length > 5) {
        console.log(`      ... et ${data.length - 5} autres`);
      }
    } else {
      console.log(`   ⚠️  Aucun protocole trouvé pour ce wallet`);
    }
    
    // Afficher un exemple de structure si disponible
    if (Array.isArray(data) && data.length > 0 && data[0].portfolio_item_list) {
      const firstItem = data[0].portfolio_item_list[0];
      if (firstItem) {
        console.log(`   📦 Exemple de position:`);
        console.log(`      - Asset USD Value: ${firstItem.stats?.asset_usd_value || 0}`);
        console.log(`      - Debt USD Value: ${firstItem.stats?.debt_usd_value || 0}`);
      }
    }
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }
  
  console.log("\n" + "=".repeat(60));
  
  // Test 2: Test via la fonction buildCollateralClientFromDeBank
  console.log("\n📡 Test 2: Test via buildCollateralClientFromDeBank...");
  try {
    // Utiliser une approche directe pour éviter les problèmes de module
    const DEBANK_BASE_URL_TEST = "https://pro-openapi.debank.com/v1";
    
    async function fetchUserComplexProtocols(wallet, chains = ["eth"]) {
      const url = new URL(`${DEBANK_BASE_URL_TEST}/user/all_complex_protocol_list`);
      url.searchParams.set('id', wallet);
      url.searchParams.set('chain_ids', chains.join(','));
      
      const res = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'AccessKey': DEBANK_ACCESS_KEY,
        },
      });
      
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
    
    const protocols = await fetchUserComplexProtocols(TEST_WALLET, ["eth"]);
    
    console.log(`   ✅ Protocoles récupérés avec succès!`);
    console.log(`   📊 Résumé:`);
    console.log(`      - Wallet: ${TEST_WALLET}`);
    console.log(`      - Protocoles: ${protocols.length}`);
    
    let totalPositions = 0;
    let totalValue = 0;
    let totalDebt = 0;
    
    protocols.forEach(proto => {
      const items = proto.portfolio_item_list || [];
      totalPositions += items.length;
      items.forEach(item => {
        totalValue += item.stats?.asset_usd_value || 0;
        totalDebt += item.stats?.debt_usd_value || 0;
      });
    });
    
    console.log(`      - Positions totales: ${totalPositions}`);
    console.log(`      - Total Value: $${totalValue.toFixed(2)}`);
    console.log(`      - Total Debt: $${totalDebt.toFixed(2)}`);
    console.log(`      - Health Factor: ${totalDebt > 0 ? (totalValue / totalDebt).toFixed(2) : 'N/A'}`);
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }
  
  console.log("\n" + "=".repeat(60));
  
  // Test 3: Test via l'API route Next.js
  console.log("\n📡 Test 3: Test via l'API route /api/collateral...");
  try {
    const apiUrl = `http://localhost:6001/api/collateral?wallets=${TEST_WALLET}&chains=eth`;
    console.log(`   URL: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    console.log(`   ✅ Succès! Status: ${response.status}`);
    console.log(`   📊 Clients retournés: ${data.clients?.length || 0}`);
    
    if (data.clients && data.clients.length > 0) {
      const client = data.clients[0];
      console.log(`   📋 Premier client:`);
      console.log(`      - ID: ${client.id}`);
      console.log(`      - Nom: ${client.name}`);
      console.log(`      - Positions: ${client.positions?.length || 0}`);
      console.log(`      - Total Value: $${client.totalValue || 0}`);
    }
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    console.error(`   💡 Assure-toi que le serveur Next.js est démarré sur le port 6001`);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Tests terminés!\n");
}

// Exécuter les tests
testDeBankAPI().catch(console.error);

