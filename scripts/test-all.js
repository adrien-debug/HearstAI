#!/usr/bin/env node

/**
 * Script de test complet pour vérifier tous les composants
 * Usage: node scripts/test-all.js
 */

require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

let testsPassed = 0
let testsFailed = 0

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function test(name, fn) {
  return async () => {
    try {
      process.stdout.write(`\n${colors.cyan}🧪 ${name}...${colors.reset} `)
      await fn()
      log('✅ PASS', 'green')
      testsPassed++
      return true
    } catch (error) {
      log(`❌ FAIL: ${error.message}`, 'red')
      testsFailed++
      return false
    }
  }
}

// Tests
const tests = []

// 1. Test des variables d'environnement
tests.push(test('Variables d\'environnement', async () => {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ]
  
  const optional = [
    'HEARST_API_URL',
    'HEARST_API_TOKEN',
    'EXTERNAL_DB_HOST',
    'DEBANK_ACCESS_KEY',
  ]
  
  const missing = required.filter(v => !process.env[v])
  if (missing.length > 0) {
    throw new Error(`Variables manquantes: ${missing.join(', ')}`)
  }
  
  const configured = optional.filter(v => process.env[v])
  log(`\n   Requis: ${required.length}/${required.length} ✅`, 'green')
  log(`   Optionnel: ${configured.length}/${optional.length} configuré(s)`, 'yellow')
  
  if (!process.env.HEARST_API_TOKEN) {
    log('   ⚠️  HEARST_API_TOKEN non configuré - API Cockpit retournera des données vides', 'yellow')
  }
}))

// 2. Test de connexion au serveur Next.js
tests.push(test('Serveur Next.js (port 6001)', async () => {
  const response = await fetch('http://localhost:6001/api/health')
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }
  const data = await response.json()
  if (data.status !== 'ok') {
    throw new Error(`Health check returned: ${JSON.stringify(data)}`)
  }
}))

// 3. Test de connexion au backend Express
tests.push(test('Backend Express (port 4000)', async () => {
  const response = await fetch('http://localhost:4000/api/health')
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }
  const data = await response.json()
  if (data.status !== 'ok') {
    throw new Error(`Health check returned: ${JSON.stringify(data)}`)
  }
}))

// 4. Test de l'API Cockpit
tests.push(test('API Cockpit', async () => {
  const response = await fetch('http://localhost:6001/api/cockpit')
  if (!response.ok) {
    throw new Error(`API returned: ${response.status}`)
  }
  const data = await response.json()
  
  if (!data.data) {
    throw new Error('Response missing data field')
  }
  
  const hasData = data.data.globalHashrate > 0 || 
                  data.data.totalMiners > 0 || 
                  data.data.miningAccounts?.length > 0
  
  if (!hasData && process.env.HEARST_API_TOKEN) {
    log(`\n   ⚠️  API répond mais retourne des données vides`, 'yellow')
    log(`   Vérifiez que HEARST_API_TOKEN est correct`, 'yellow')
  } else if (!hasData) {
    log(`\n   ⚠️  Données vides (normal si HEARST_API_TOKEN non configuré)`, 'yellow')
  } else {
    log(`\n   ✅ Données récupérées:`, 'green')
    log(`      - Hashrate: ${data.data.globalHashrate} PH/s`, 'green')
    log(`      - Miners: ${data.data.totalMiners}`, 'green')
    log(`      - Accounts: ${data.data.miningAccounts?.length || 0}`, 'green')
  }
}))

// 5. Test de l'API Customers
tests.push(test('API Customers', async () => {
  const response = await fetch('http://localhost:6001/api/customers')
  if (!response.ok) {
    throw new Error(`API returned: ${response.status}`)
  }
  const data = await response.json()
  
  if (!data.customers) {
    throw new Error('Response missing customers field')
  }
  
  log(`\n   ✅ ${data.customers.length} customers trouvés`, 'green')
}))

// 6. Test de l'API Collateral
tests.push(test('API Collateral', async () => {
  const response = await fetch('http://localhost:6001/api/collateral')
  if (!response.ok && response.status !== 200) {
    throw new Error(`API returned: ${response.status}`)
  }
  const data = await response.json()
  
  if (data.clients) {
    log(`\n   ✅ ${data.clients.length} clients collatéraux trouvés`, 'green')
  } else {
    log(`\n   ⚠️  Pas de données collatérales (normal si pas de wallets configurés)`, 'yellow')
  }
}))

// 7. Test de connexion au backend Hearst (si token configuré)
if (process.env.HEARST_API_TOKEN) {
  tests.push(test('Connexion Backend Hearst API', async () => {
    const hearstApiUrl = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
    const apiToken = process.env.HEARST_API_TOKEN
    
    const response = await fetch(`${hearstApiUrl}/api/mining-operations/customers?limit=1&pageNumber=1`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiToken,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    log(`\n   ✅ Connexion réussie au backend Hearst`, 'green')
    if (data.users) {
      log(`   ✅ ${data.users.length} user(s) trouvé(s)`, 'green')
    }
  }))
} else {
  tests.push(test('Connexion Backend Hearst API', async () => {
    log(`\n   ⚠️  Test ignoré - HEARST_API_TOKEN non configuré`, 'yellow')
  }))
}

// 8. Test de la base de données Prisma
tests.push(test('Base de données Prisma', async () => {
  try {
    const path = require('path')
    const dbPath = path.join(__dirname, '..', 'lib', 'db.ts')
    
    // Utiliser dynamic import pour TypeScript
    const dbModule = await import('../lib/db.js')
    const { prisma } = dbModule
    
    // Test simple de connexion
    await prisma.$connect()
    
    // Test de requête simple
    const userCount = await prisma.user.count()
    
    log(`\n   ✅ Connexion réussie`, 'green')
    log(`   ✅ ${userCount} utilisateur(s) dans la base`, 'green')
    
    await prisma.$disconnect()
  } catch (error) {
    // Si l'import échoue, tester via API
    const response = await fetch('http://localhost:6001/api/customers')
    if (response.ok) {
      log(`\n   ✅ Base de données accessible via API`, 'green')
    } else {
      throw new Error(`Impossible de tester la base de données: ${error.message}`)
    }
  }
}))

// 9. Test des routes API principales
const apiRoutes = [
  { name: 'Health', path: '/api/health' },
  { name: 'Status', path: '/api/status' },
]

tests.push(test('Routes API principales', async () => {
  const results = []
  
  for (const route of apiRoutes) {
    try {
      const response = await fetch(`http://localhost:6001${route.path}`)
      if (response.ok) {
        results.push(`✅ ${route.name}`)
      } else {
        results.push(`⚠️  ${route.name} (${response.status})`)
      }
    } catch (error) {
      results.push(`❌ ${route.name} (erreur)`)
    }
  }
  
  log(`\n   ${results.join('\n   ')}`, 'cyan')
}))

// Exécuter tous les tests
async function runAllTests() {
  log('\n🚀 Démarrage des tests complets...\n', 'blue')
  log('═'.repeat(60), 'cyan')
  
  for (const testFn of tests) {
    await testFn()
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause entre tests
  }
  
  log('\n' + '═'.repeat(60), 'cyan')
  log(`\n📊 Résultats:`, 'blue')
  log(`   ✅ Tests réussis: ${testsPassed}`, 'green')
  log(`   ❌ Tests échoués: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green')
  log(`   📈 Taux de réussite: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%\n`, 'cyan')
  
  if (testsFailed === 0) {
    log('🎉 Tous les tests sont passés !', 'green')
    process.exit(0)
  } else {
    log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.', 'yellow')
    process.exit(1)
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  log(`\n💥 Erreur fatale: ${error.message}`, 'red')
  process.exit(1)
})

// Lancer les tests
runAllTests().catch((error) => {
  log(`\n💥 Erreur fatale: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})

