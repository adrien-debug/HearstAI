#!/usr/bin/env node

/**
 * Script pour ajouter un customer directement via Prisma
 * Usage: node scripts/add-customer-direct.js <name> <erc20Address> [tag] [chains]
 */

const { PrismaClient } = require('@prisma/client');
const { buildCollateralClientFromDeBank } = require('../lib/debank');

const prisma = new PrismaClient();

async function addCustomer(name, erc20Address, tag = 'Client', chains = ['eth'], protocols = []) {
  try {
    console.log(`\n📝 Création du customer: ${name}`);
    console.log(`   ERC20: ${erc20Address}`);
    
    // Vérifier si le customer existe déjà
    const existing = await prisma.customer.findFirst({
      where: { erc20Address: erc20Address.toLowerCase() }
    });
    
    if (existing) {
      console.log('⚠️  Customer existe déjà, mise à jour...');
      
      // Récupérer les données DeBank
      const debankData = await buildCollateralClientFromDeBank(erc20Address.toLowerCase(), {
        name,
        tag,
        chains,
        allowedProtocols: protocols,
      });
      
      // Mettre à jour
      const updated = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name,
          tag,
          totalValue: debankData.totalValue,
          totalDebt: debankData.totalDebt,
          healthFactor: debankData.healthFactor,
          status: debankData.healthFactor > 1.5 ? 'active' : 
                  debankData.healthFactor > 1.0 ? 'warning' : 'critical',
          lastUpdate: new Date(),
        }
      });
      
      console.log('✅ Customer mis à jour');
      console.log(`   Total Value: $${updated.totalValue.toLocaleString()}`);
      console.log(`   Health Factor: ${updated.healthFactor.toFixed(2)}`);
      console.log(`   Status: ${updated.status}`);
      
      return updated;
    }
    
    // Récupérer les données DeBank
    console.log('📊 Récupération des données DeBank...');
    const debankData = await buildCollateralClientFromDeBank(erc20Address.toLowerCase(), {
      name,
      tag,
      chains,
      allowedProtocols: protocols,
    });
    
    console.log(`   Total Value: $${debankData.totalValue.toLocaleString()}`);
    console.log(`   Total Debt: $${debankData.totalDebt.toLocaleString()}`);
    console.log(`   Health Factor: ${debankData.healthFactor.toFixed(2)}`);
    console.log(`   Positions: ${debankData.positions.length}`);
    
    // Créer le customer
    const customer = await prisma.customer.create({
      data: {
        name,
        erc20Address: erc20Address.toLowerCase(),
        tag,
        chains: JSON.stringify(chains),
        protocols: JSON.stringify(protocols),
        totalValue: debankData.totalValue,
        totalDebt: debankData.totalDebt,
        healthFactor: debankData.healthFactor,
        status: debankData.healthFactor > 1.5 ? 'active' : 
                debankData.healthFactor > 1.0 ? 'warning' : 'unknown',
        lastUpdate: new Date(),
      }
    });
    
    console.log('✅ Customer créé avec succès');
    console.log(`   ID: ${customer.id}`);
    console.log(`   Status: ${customer.status}`);
    
    return customer;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Point d'entrée
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node scripts/add-customer-direct.js <name> <erc20Address> [tag] [chains]');
  console.error('Exemple: node scripts/add-customer-direct.js "Dennis STEIRH" "0x581cd214ee109caa719559e41341ce8c1d9cc638" "Client" "eth"');
  process.exit(1);
}

const name = args[0];
const erc20Address = args[1];
const tag = args[2] || 'Client';
const chainsStr = args[3] || 'eth';
const chains = chainsStr.split(',').map(c => c.trim()).filter(Boolean);

addCustomer(name, erc20Address, tag, chains)
  .then(() => {
    console.log('\n🎉 Terminé !\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error.message);
    process.exit(1);
  });






