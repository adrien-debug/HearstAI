#!/usr/bin/env node

/**
 * Script d'analyse et d'intégration d'identifiants
 * Supporte différents types d'identifiants:
 * - Adresses ERC20 (0x...)
 * - Identifiants Fireblocks (vault, wallet, etc.)
 * - Identifiants personnalisés
 * 
 * Usage: node scripts/analyze-identifier.js EanqSBKHd
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

/**
 * Identifie le type d'identifiant
 */
function identifyType(identifier) {
  const id = identifier.trim();
  
  // Adresse ERC20 (0x suivi de 40 caractères hexadécimaux)
  if (/^0x[a-fA-F0-9]{40}$/.test(id)) {
    return 'erc20_address';
  }
  
  // UUID (format Fireblocks)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return 'fireblocks_uuid';
  }
  
  // Identifiant court (comme EanqSBKHd)
  if (/^[a-zA-Z0-9]{8,}$/.test(id)) {
    return 'custom_id';
  }
  
  return 'unknown';
}

/**
 * Appel HTTP générique
 */
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

/**
 * Récupère les données pour une adresse ERC20 via DeBank
 */
async function fetchERC20Data(address) {
  console.log(`\n📊 Récupération des données DeBank pour ${address}...`);
  
  const apiKey = process.env.DEBANK_ACCESS_KEY;
  if (!apiKey || apiKey === 'your_debank_access_key_here') {
    return {
      type: 'erc20_address',
      address: address,
      error: 'DEBANK_ACCESS_KEY non configurée',
      source: 'debank',
    };
  }
  
  try {
    const url = `https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=${address.toLowerCase()}&chain_ids=eth,arb,base,op`;
    
    const result = await httpRequest(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': apiKey,
      },
    });
    
    const protocols = Array.isArray(result.data) ? result.data : [];
    
    // Calculer les totaux depuis les protocoles
    let totalValue = 0;
    let totalDebt = 0;
    const positions = [];
    
    for (const protocol of protocols) {
      const stats = protocol.stats || {};
      const protocolValue = stats.asset_usd_value || 0;
      const protocolDebt = stats.debt_usd_value || 0;
      
      totalValue += protocolValue;
      totalDebt += protocolDebt;
      
      if (protocolValue > 0 || protocolDebt > 0) {
        positions.push({
          protocol: protocol.id || protocol.name || 'unknown',
          chain: protocol.chain || 'unknown',
          assetValue: protocolValue,
          debtValue: protocolDebt,
        });
      }
    }
    
    const healthFactor = totalDebt > 0 ? totalValue / totalDebt : (totalValue > 0 ? 999 : 0);
    
    return {
      type: 'erc20_address',
      address: address,
      data: {
        name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        tag: 'Client',
        totalValue,
        totalDebt,
        healthFactor,
        positions,
        lastUpdate: new Date().toISOString(),
      },
      source: 'debank',
    };
  } catch (error) {
    console.error(`❌ Erreur DeBank pour ${address}:`, error.message);
    return {
      type: 'erc20_address',
      address: address,
      error: error.message,
      source: 'debank',
    };
  }
}

/**
 * Récupère les données Fireblocks pour un UUID
 * NOTE: Désactivé - on travaille uniquement avec DeBank
 */
async function fetchFireblocksData(uuid) {
  console.log(`\n⚠️  Fireblocks désactivé - focus sur DeBank uniquement`);
  return {
    type: 'fireblocks_uuid',
    id: uuid,
    error: 'Fireblocks désactivé - focus sur DeBank uniquement',
    source: 'fireblocks',
  };
}

/**
 * Recherche dans la base de données
 */
async function searchDatabase(identifier) {
  console.log(`\n🔍 Recherche dans la base de données...`);
  
  const results = {
    customers: [],
    projects: [],
  };
  
  try {
    // Rechercher dans les customers
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { erc20Address: { contains: identifier, mode: 'insensitive' } },
          { name: { contains: identifier, mode: 'insensitive' } },
          { fireblocksVaultId: { contains: identifier, mode: 'insensitive' } },
          { fireblocksWalletId: { contains: identifier, mode: 'insensitive' } },
        ],
      },
    });
    
    results.customers = customers;
    
    // Rechercher dans les projets
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: identifier, mode: 'insensitive' } },
          { id: identifier },
        ],
      },
    });
    
    results.projects = projects;
    
    return results;
  } catch (error) {
    console.error(`❌ Erreur recherche DB:`, error.message);
    return results;
  }
}

/**
 * Crée ou met à jour un customer dans la base de données
 */
async function createOrUpdateCustomer(identifier, data) {
  console.log(`\n💾 Création/Mise à jour du customer...`);
  
  try {
    if (data.type === 'erc20_address' && data.data) {
      const address = data.address.toLowerCase();
      
      // Vérifier si le customer existe déjà
      const existing = await prisma.customer.findFirst({
        where: { erc20Address: address },
      });
      
      if (existing) {
        // Mettre à jour
        const updated = await prisma.customer.update({
          where: { id: existing.id },
          data: {
            totalValue: data.data.totalValue || existing.totalValue,
            totalDebt: data.data.totalDebt || existing.totalDebt,
            healthFactor: data.data.healthFactor || existing.healthFactor,
            status: data.data.healthFactor > 1.5 ? 'active' : 
                    data.data.healthFactor > 1.0 ? 'warning' : 'critical',
            lastUpdate: new Date(),
          },
        });
        
        console.log(`✅ Customer mis à jour: ${updated.name} (${updated.id})`);
        return updated;
      } else {
        // Créer
        const created = await prisma.customer.create({
          data: {
            name: data.data.name || `Customer ${address.substring(0, 8)}...`,
            erc20Address: address,
            tag: data.data.tag || 'Client',
            chains: JSON.stringify(['eth']),
            protocols: JSON.stringify([]),
            totalValue: data.data.totalValue || 0,
            totalDebt: data.data.totalDebt || 0,
            healthFactor: data.data.healthFactor || 0,
            status: data.data.healthFactor > 1.5 ? 'active' : 
                    data.data.healthFactor > 1.0 ? 'warning' : 'unknown',
            lastUpdate: new Date(),
          },
        });
        
        console.log(`✅ Customer créé: ${created.name} (${created.id})`);
        return created;
      }
    }
  } catch (error) {
    console.error(`❌ Erreur création/mise à jour customer:`, error.message);
    return null;
  }
}

/**
 * Fonction principale
 */
async function main() {
  const identifier = process.argv[2];
  
  if (!identifier) {
    console.error('❌ Usage: node scripts/analyze-identifier.js <IDENTIFIER>');
    console.error('   Exemple: node scripts/analyze-identifier.js EanqSBKHd');
    process.exit(1);
  }
  
  console.log(`\n🔍 Analyse de l'identifiant: ${identifier}`);
  console.log('='.repeat(60));
  
  // Identifier le type
  const type = identifyType(identifier);
  console.log(`\n📋 Type identifié: ${type}`);
  
  let analysisResult = {
    identifier,
    type,
    timestamp: new Date().toISOString(),
    data: null,
    database: null,
  };
  
  // Récupérer les données selon le type
  if (type === 'erc20_address') {
    analysisResult.data = await fetchERC20Data(identifier);
    
    // Créer ou mettre à jour dans la DB
    if (analysisResult.data.data) {
      await createOrUpdateCustomer(identifier, analysisResult.data);
    }
  } else if (type === 'fireblocks_uuid') {
    analysisResult.data = await fetchFireblocksData(identifier);
  } else if (type === 'custom_id') {
    // Rechercher dans la base de données
    analysisResult.database = await searchDatabase(identifier);
    
    // Si trouvé comme adresse ERC20 dans un customer, récupérer les données DeBank
    if (analysisResult.database.customers.length > 0) {
      const customer = analysisResult.database.customers[0];
      if (customer.erc20Address) {
        analysisResult.data = await fetchERC20Data(customer.erc20Address);
      }
    }
  }
  
  // Afficher les résultats
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DE L\'ANALYSE');
  console.log('='.repeat(60));
  console.log(JSON.stringify(analysisResult, null, 2));
  
  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📋 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`Identifiant: ${identifier}`);
  console.log(`Type: ${type}`);
  
  if (analysisResult.data) {
    console.log(`Source: ${analysisResult.data.source}`);
    if (analysisResult.data.error) {
      console.log(`❌ Erreur: ${analysisResult.data.error}`);
    } else {
      console.log(`✅ Données récupérées avec succès`);
      if (analysisResult.data.data) {
        if (analysisResult.data.data.totalValue !== undefined) {
          console.log(`💰 Valeur totale: $${analysisResult.data.data.totalValue.toLocaleString()}`);
        }
        if (analysisResult.data.data.healthFactor !== undefined) {
          console.log(`🏥 Health Factor: ${analysisResult.data.data.healthFactor.toFixed(2)}`);
        }
      }
    }
  }
  
  if (analysisResult.database) {
    console.log(`\n📚 Résultats base de données:`);
    console.log(`   - Customers trouvés: ${analysisResult.database.customers.length}`);
    console.log(`   - Projets trouvés: ${analysisResult.database.projects.length}`);
  }
  
  await prisma.$disconnect();
}

// Exécuter
main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
