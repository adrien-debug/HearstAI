#!/usr/bin/env node

/**
 * Script pour ajouter le client Dennis via l'API
 */

const DENNIS_ADDRESS = "0x581cd214ee109caa719559e41341ce8c1d9cc638";
const DENNIS_NAME = "Dennis STEIRH";

async function addDennisClient() {
  console.log("📝 Ajout du client Dennis...\n");
  
  const clientData = {
    name: DENNIS_NAME,
    erc20Address: DENNIS_ADDRESS.toLowerCase(),
    tag: "Client",
    chains: ["eth"],
    protocols: []
  };
  
  try {
    const response = await fetch('http://localhost:6001/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log("✅ Client créé avec succès !\n");
    console.log("📊 Détails du client:");
    console.log(`   - ID: ${result.customer?.id || 'N/A'}`);
    console.log(`   - Nom: ${result.customer?.name || DENNIS_NAME}`);
    console.log(`   - Adresse: ${result.customer?.erc20Address || DENNIS_ADDRESS}`);
    console.log(`   - Tag: ${result.customer?.tag || 'Client'}`);
    console.log(`   - Chains: ${result.customer?.chains || '["eth"]'}`);
    console.log("\n🔄 Test des données DeBank...");
    
    // Tester la récupération des données collatérales
    const collateralUrl = `http://localhost:6001/api/collateral?wallets=${DENNIS_ADDRESS}&chains=eth`;
    console.log(`   URL: ${collateralUrl}`);
    
    const collateralResponse = await fetch(collateralUrl);
    if (collateralResponse.ok) {
      const collateralData = await collateralResponse.json();
      if (collateralData.clients && collateralData.clients.length > 0) {
        const client = collateralData.clients[0];
        console.log(`   ✅ Données DeBank récupérées !`);
        console.log(`   📊 Positions: ${client.positions?.length || 0}`);
        console.log(`   💰 Total Value: $${(client.totalValue || 0).toFixed(2)}`);
        console.log(`   💳 Total Debt: $${(client.totalDebt || 0).toFixed(2)}`);
        console.log(`   🏥 Health Factor: ${(client.healthFactor || 0).toFixed(2)}`);
      } else {
        console.log(`   ⚠️  Aucune position trouvée pour ce wallet`);
      }
    } else {
      console.log(`   ⚠️  Erreur lors de la récupération des données: ${collateralResponse.status}`);
    }
    
    console.log("\n✅ Test terminé avec succès !");
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    if (error.message.includes('already exists') || error.message.includes('unique constraint')) {
      console.log("\n💡 Le client existe déjà. C'est normal !");
    } else {
      console.log("\n💡 Assure-toi que le serveur Next.js est démarré sur le port 6001");
    }
    process.exit(1);
  }
}

addDennisClient();

