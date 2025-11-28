#!/usr/bin/env node

/**
 * Script pour importer des customers depuis un fichier Excel
 * 
 * Usage: node scripts/import-customers-from-excel.js <chemin-vers-fichier.xlsx>
 * 
 * Format Excel attendu (colonnes):
 * - name: Nom du customer
 * - erc20Address: Adresse ERC20 (requis)
 * - tag: Tag (optionnel, défaut: "Client")
 * - chains: Chaînes séparées par virgules (optionnel, défaut: "eth")
 * - protocols: Protocoles séparés par virgules (optionnel, défaut: vide)
 * - email: Email (optionnel)
 * - btcWallet: Adresse BTC (optionnel)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Vérifier si xlsx est installé
let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  console.error('❌ Le module "xlsx" n\'est pas installé.');
  console.error('   Installez-le avec: npm install xlsx');
  process.exit(1);
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001';

function createCustomer(customerData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(customerData);
    
    const options = {
      hostname: new URL(baseUrl).hostname,
      port: new URL(baseUrl).port || 6001,
      path: '/api/customers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          if (res.statusCode === 201 || res.statusCode === 200) {
            resolve({ success: true, data: json });
          } else if (res.statusCode === 409) {
            resolve({ success: false, error: 'Customer existe déjà', data: json });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${json.error || responseData}`));
          }
        } catch (e) {
          reject(new Error(`Erreur parsing: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function parseExcelFile(filePath) {
  log(`\n📖 Lecture du fichier: ${filePath}`, 'cyan');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier non trouvé: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertir en JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  log(`✅ ${data.length} ligne(s) trouvée(s) dans "${sheetName}"`, 'green');
  
  return data;
}

function normalizeCustomer(row, index) {
  // Normaliser les noms de colonnes (insensible à la casse et aux espaces)
  const normalizeKey = (key) => {
    if (!key) return null;
    return key.toString().toLowerCase().trim().replace(/\s+/g, '');
  };

  const getValue = (keys) => {
    for (const key of keys) {
      for (const rowKey of Object.keys(row)) {
        if (normalizeKey(rowKey) === normalizeKey(key)) {
          const value = row[rowKey];
          return value !== undefined && value !== null && value !== '' ? value.toString().trim() : null;
        }
      }
    }
    return null;
  };

  const name = getValue(['name', 'nom', 'customer', 'client', 'customer name']);
  const erc20Address = getValue(['erc20address', 'erc20', 'address', 'wallet', 'adresse', 'ethereum address']);
  const tag = getValue(['tag', 'type', 'category']) || 'Client';
  const chainsStr = getValue(['chains', 'chain', 'blockchain', 'réseau']) || 'eth';
  const protocolsStr = getValue(['protocols', 'protocol', 'protocole']) || '';
  const email = getValue(['email', 'e-mail', 'mail']);
  const btcWallet = getValue(['btcwallet', 'btc', 'bitcoin address', 'adresse btc']);

  // Validation
  if (!name) {
    throw new Error(`Ligne ${index + 1}: Le nom est requis`);
  }

  if (!erc20Address) {
    throw new Error(`Ligne ${index + 1}: L'adresse ERC20 est requise`);
  }

  // Validation format ERC20
  const erc20Regex = /^0x[a-fA-F0-9]{40}$/;
  if (!erc20Regex.test(erc20Address)) {
    throw new Error(`Ligne ${index + 1}: Format d'adresse ERC20 invalide: ${erc20Address}`);
  }

  // Parser chains (séparées par virgules)
  const chains = chainsStr
    .split(',')
    .map(c => c.trim().toLowerCase())
    .filter(c => c.length > 0);

  // Parser protocols (séparés par virgules)
  const protocols = protocolsStr
    .split(',')
    .map(p => p.trim().toLowerCase())
    .filter(p => p.length > 0);

  return {
    name,
    erc20Address: erc20Address.toLowerCase(),
    tag,
    chains: chains.length > 0 ? chains : ['eth'],
    protocols,
    email: email || null,
    btcWallet: btcWallet || null,
  };
}

async function importCustomers(filePath) {
  try {
    log('\n╔════════════════════════════════════════════════════════════════════╗', 'blue');
    log('║  📥 IMPORT CUSTOMERS DEPUIS EXCEL - HEARST AI                    ║', 'blue');
    log('╚════════════════════════════════════════════════════════════════════╝\n', 'blue');

    // Parser le fichier Excel
    const rows = parseExcelFile(filePath);

    if (rows.length === 0) {
      log('⚠️  Aucune donnée trouvée dans le fichier Excel', 'yellow');
      return;
    }

    log(`\n📊 Traitement de ${rows.length} customer(s)...\n`, 'cyan');

    const results = {
      success: [],
      failed: [],
      skipped: [],
    };

    // Traiter chaque ligne
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        log(`\n${i + 1}/${rows.length} - Traitement...`, 'cyan');
        
        const customerData = normalizeCustomer(row, i);
        
        log(`   Nom: ${customerData.name}`, 'reset');
        log(`   ERC20: ${customerData.erc20Address.substring(0, 10)}...`, 'reset');
        log(`   Tag: ${customerData.tag}`, 'reset');
        log(`   Chains: ${customerData.chains.join(', ')}`, 'reset');
        
        // Créer le customer via l'API
        const result = await createCustomer(customerData);
        
        if (result.success) {
          log(`   ✅ Customer créé avec succès`, 'green');
          if (result.data.customer) {
            log(`   📊 Total Value: $${result.data.customer.totalValue || 0}`, 'cyan');
            log(`   📊 Health Factor: ${result.data.customer.healthFactor || 0}`, 'cyan');
          }
          results.success.push({ index: i + 1, name: customerData.name, data: result.data });
        } else {
          log(`   ⚠️  ${result.error}`, 'yellow');
          results.skipped.push({ index: i + 1, name: customerData.name, reason: result.error });
        }
      } catch (error) {
        log(`   ❌ Erreur: ${error.message}`, 'red');
        results.failed.push({ index: i + 1, name: row.name || 'Unknown', error: error.message });
      }
    }

    // Rapport final
    log('\n\n' + '='.repeat(70), 'blue');
    log('📊 RAPPORT FINAL', 'bold');
    log('='.repeat(70) + '\n', 'blue');

    log(`✅ Succès: ${results.success.length}/${rows.length}`, 'green');
    if (results.skipped.length > 0) {
      log(`⚠️  Ignorés: ${results.skipped.length}`, 'yellow');
    }
    if (results.failed.length > 0) {
      log(`❌ Échecs: ${results.failed.length}`, 'red');
    }

    if (results.failed.length > 0) {
      log('\nÉchecs détaillés:', 'yellow');
      results.failed.forEach(f => {
        log(`  - Ligne ${f.index} (${f.name}): ${f.error}`, 'red');
      });
    }

    if (results.skipped.length > 0) {
      log('\nIgnorés (déjà existants):', 'yellow');
      results.skipped.forEach(s => {
        log(`  - Ligne ${s.index} (${s.name}): ${s.reason}`, 'yellow');
      });
    }

    log('\n' + '='.repeat(70) + '\n', 'blue');

    if (results.failed.length === 0) {
      log('🎉 Import terminé avec succès !\n', 'green');
      process.exit(0);
    } else {
      log('⚠️  Certains customers n\'ont pas pu être importés.\n', 'yellow');
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}\n`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Point d'entrée
const filePath = process.argv[2];

if (!filePath) {
  log('❌ Usage: node scripts/import-customers-from-excel.js <chemin-vers-fichier.xlsx>', 'red');
  log('\nFormat Excel attendu (colonnes):', 'yellow');
  log('  - name / nom / customer: Nom du customer (requis)', 'reset');
  log('  - erc20Address / erc20 / address / wallet: Adresse ERC20 (requis)', 'reset');
  log('  - tag / type: Tag (optionnel, défaut: "Client")', 'reset');
  log('  - chains / chain: Chaînes séparées par virgules (optionnel, défaut: "eth")', 'reset');
  log('  - protocols / protocol: Protocoles séparés par virgules (optionnel)', 'reset');
  log('  - email: Email (optionnel)', 'reset');
  log('  - btcWallet / btc: Adresse BTC (optionnel)', 'reset');
  process.exit(1);
}

importCustomers(filePath);






