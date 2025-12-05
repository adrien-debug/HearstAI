#!/usr/bin/env node

/**
 * Script to add sample wallets with real DeBank data
 * These are well-known wallets that have DeFi positions
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// DeBank API configuration
const DEBANK_BASE_URL = "https://pro-openapi.debank.com/v1";
const DEBANK_ACCESS_KEY = process.env.DEBANK_ACCESS_KEY || '77886e5c8a992d3e7b6d37c36325d2f701b2a904';

// Fetch DeBank data directly
async function fetchDeBankData(wallet, chains = ['eth']) {
  const chainIds = chains.join(',');
  const normalizedWallet = wallet.toLowerCase();
  const url = `${DEBANK_BASE_URL}/user/all_complex_protocol_list?id=${normalizedWallet}&chain_ids=${chainIds}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'AccessKey': DEBANK_ACCESS_KEY,
    },
  });
  
  if (!response.ok) {
    throw new Error(`DeBank API error: ${response.status} ${response.statusText}`);
  }
  
  const protocols = await response.json();
  const protocolList = Array.isArray(protocols) ? protocols : [];
  
  // Debug: log first protocol structure
  if (protocolList.length > 0 && process.env.DEBUG) {
    console.log('   Debug - First protocol structure:', JSON.stringify(protocolList[0], null, 2).substring(0, 500));
  }
  
  // Calculate totals
  let totalValue = 0;
  let totalDebt = 0;
  const positions = [];
  
  for (const protocol of protocolList) {
    const stats = protocol.stats || {};
    const protocolValue = stats.asset_usd_value || 0;
    const protocolDebt = stats.debt_usd_value || 0;
    
    // Check portfolio items for more detailed positions
    const items = protocol.portfolio_item_list || [];
    
    if (items.length > 0) {
      // Process each portfolio item
      for (const item of items) {
        const itemStats = item.stats || {};
        const itemValue = itemStats.asset_usd_value || 0;
        const itemDebt = itemStats.debt_usd_value || 0;
        
        // Add to totals
        totalValue += itemValue;
        totalDebt += itemDebt;
        
        if (itemValue > 0 || itemDebt > 0) {
          const detail = item.detail || {};
          const assetTokens = detail.supply_token_list || detail.asset_token_list || detail.collateral_token_list || [];
          const debtTokens = detail.borrow_token_list || detail.debt_token_list || [];
          
          const mainAsset = assetTokens[0] || { symbol: 'MIXED', amount: itemValue, price: 1 };
          const mainDebt = debtTokens[0] || { symbol: 'USD', amount: itemDebt, price: 1 };
          
          // Calculate collateral value
          const collateralValue = (mainAsset.amount || 0) * (mainAsset.price || 1);
          const collateralAmount = mainAsset.amount || (itemValue / (mainAsset.price || 1)) || 0;
          
          positions.push({
            asset: mainAsset.symbol || 'MIXED',
            protocol: protocol.id || protocol.name || 'unknown',
            chain: protocol.chain || 'unknown',
            collateralAmount: collateralAmount,
            collateralPriceUsd: mainAsset.price || (itemValue / collateralAmount) || 1,
            debtToken: mainDebt.symbol || 'USD',
            debtAmount: mainDebt.amount || itemDebt,
            borrowApr: 0,
            liquidationThreshold: itemStats.liquidation_threshold || 0.9,
          });
        }
      }
    } else if (protocolValue > 0 || protocolDebt > 0) {
      // Fallback to protocol-level stats
      totalValue += protocolValue;
      totalDebt += protocolDebt;
      
      positions.push({
        asset: 'MIXED',
        protocol: protocol.id || protocol.name || 'unknown',
        chain: protocol.chain || 'unknown',
        collateralAmount: protocolValue,
        collateralPriceUsd: 1,
        debtToken: 'USD',
        debtAmount: protocolDebt,
        borrowApr: 0,
        liquidationThreshold: 0.9,
      });
    }
  }
  
  const healthFactor = totalDebt > 0 ? totalValue / totalDebt : (totalValue > 0 ? 999 : 0);
  
  return {
    totalValue,
    totalDebt,
    healthFactor,
    positions,
  };
}

// Sample wallets - well-known addresses with DeFi activity
// Using wallets that are known to have active DeFi positions
const sampleWallets = [
  {
    name: 'Vitalik Buterin',
    erc20Address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    tag: 'VIP',
    chains: ['eth', 'arb', 'base', 'op'],
    protocols: []
  },
  {
    name: 'Sample DeFi User 1',
    erc20Address: '0x56178a0d5F301bAf6CF3e1cD85d130D549E79132',
    tag: 'Client',
    chains: ['eth', 'arb'],
    protocols: []
  },
  {
    name: 'Sample DeFi User 2',
    erc20Address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503',
    tag: 'Client',
    chains: ['eth'],
    protocols: []
  }
];

async function addSampleWallets() {
  console.log('🚀 Adding sample wallets with DeBank data...\n');
  
  let added = 0;
  let updated = 0;
  let errors = 0;

  for (const wallet of sampleWallets) {
    try {
      console.log(`\n📝 Processing: ${wallet.name}`);
      console.log(`   Address: ${wallet.erc20Address}`);
      
      // Check if exists
      const existing = await prisma.customer.findFirst({
        where: { erc20Address: wallet.erc20Address.toLowerCase() }
      });
      
      // Fetch DeBank data
      let debankData = null;
      try {
        console.log('   Fetching DeBank data...');
        debankData = await fetchDeBankData(wallet.erc20Address, wallet.chains);
        console.log(`   ✅ Found ${debankData.positions.length} positions`);
        console.log(`   Total Value: $${debankData.totalValue.toLocaleString()}`);
        console.log(`   Total Debt: $${debankData.totalDebt.toLocaleString()}`);
        console.log(`   Health Factor: ${debankData.healthFactor.toFixed(2)}`);
        
        // Show first few positions for debugging
        if (debankData.positions.length > 0) {
          console.log(`   Sample positions:`);
          debankData.positions.slice(0, 3).forEach((pos, idx) => {
            console.log(`     ${idx + 1}. ${pos.protocol} - ${pos.asset}: $${(pos.collateralAmount * pos.collateralPriceUsd).toLocaleString()}`);
          });
        }
      } catch (error) {
        console.log(`   ⚠️  DeBank error: ${error.message}`);
        // Continue with empty data
      }
      
      if (existing) {
        // Update existing
        await prisma.customer.update({
          where: { id: existing.id },
          data: {
            name: wallet.name,
            tag: wallet.tag,
            chains: JSON.stringify(wallet.chains),
            protocols: JSON.stringify(wallet.protocols),
            totalValue: debankData?.totalValue || 0,
            totalDebt: debankData?.totalDebt || 0,
            healthFactor: debankData?.healthFactor || 0,
            status: debankData?.healthFactor && debankData.healthFactor > 1.5 ? 'active' : 
                    debankData?.healthFactor && debankData.healthFactor > 1.0 ? 'warning' : 'unknown',
            lastUpdate: new Date(),
          }
        });
        console.log('   ✅ Updated');
        updated++;
      } else {
        // Create new
        await prisma.customer.create({
          data: {
            name: wallet.name,
            erc20Address: wallet.erc20Address.toLowerCase(),
            tag: wallet.tag,
            chains: JSON.stringify(wallet.chains),
            protocols: JSON.stringify(wallet.protocols),
            totalValue: debankData?.totalValue || 0,
            totalDebt: debankData?.totalDebt || 0,
            healthFactor: debankData?.healthFactor || 0,
            status: debankData?.healthFactor && debankData.healthFactor > 1.5 ? 'active' : 
                    debankData?.healthFactor && debankData.healthFactor > 1.0 ? 'warning' : 'unknown',
            lastUpdate: new Date(),
          }
        });
        console.log('   ✅ Created');
        added++;
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Added: ${added}`);
  console.log(`   🔄 Updated: ${updated}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(50) + '\n');
  
  await prisma.$disconnect();
}

// Run
addSampleWallets().catch(console.error);







