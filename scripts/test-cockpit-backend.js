#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion au backend Hearst API
 * Usage: node scripts/test-cockpit-backend.js
 */

require('dotenv').config({ path: '.env.local' })

const HEARST_API_URL = process.env.HEARST_API_URL || 'https://api.hearstcorporation.io'
const HEARST_API_TOKEN = process.env.HEARST_API_TOKEN

console.log('🔍 Test de connexion au backend Hearst API\n')
console.log('Configuration:')
console.log(`  HEARST_API_URL: ${HEARST_API_URL}`)
console.log(`  HEARST_API_TOKEN: ${HEARST_API_TOKEN ? '✅ Configuré' : '❌ Non configuré'}\n`)

if (!HEARST_API_TOKEN) {
  console.error('❌ ERREUR: HEARST_API_TOKEN n\'est pas configuré dans .env.local')
  console.error('   Ajoutez: HEARST_API_TOKEN=votre_token_ici')
  process.exit(1)
}

async function testBackendConnection() {
  try {
    console.log('📡 Test 1: Récupération des customers...')
    const customersUrl = `${HEARST_API_URL}/api/mining-operations/customers?limit=10&pageNumber=1`
    
    const customersResponse = await fetch(customersUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': HEARST_API_TOKEN,
      },
    })

    if (!customersResponse.ok) {
      const errorText = await customersResponse.text()
      console.error(`❌ Erreur ${customersResponse.status}: ${errorText}`)
      return false
    }

    const customersData = await customersResponse.json()
    const users = customersData.users || []
    console.log(`✅ ${users.length} customers trouvés\n`)

    if (users.length === 0) {
      console.log('⚠️  Aucun customer trouvé, mais la connexion fonctionne')
      return true
    }

    // Test avec le premier customer
    const firstUser = users[0]
    console.log(`📡 Test 2: Récupération des données pour le customer "${firstUser.name || firstUser.id}"...`)
    
    const hashrateUrl = `${HEARST_API_URL}/api/mining-operations/customers/${firstUser.id}/hashrate/chart`
    const statisticsUrl = `${HEARST_API_URL}/api/mining-operations/customers/${firstUser.id}/hashrate/statistics`

    const [hashrateResponse, statisticsResponse] = await Promise.all([
      fetch(hashrateUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': HEARST_API_TOKEN,
        },
      }),
      fetch(statisticsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': HEARST_API_TOKEN,
        },
      }),
    ])

    if (hashrateResponse.ok) {
      const hashrateData = await hashrateResponse.json()
      const statistics = hashrateData.statistics || hashrateData.data?.statistics || {}
      const hashrate = statistics.hashrateRealTime || 0
      console.log(`✅ Hashrate récupéré: ${hashrate} TH/s`)
    } else {
      console.log(`⚠️  Hashrate non disponible (${hashrateResponse.status})`)
    }

    if (statisticsResponse.ok) {
      const statisticsData = await statisticsResponse.json()
      const machines = statisticsData.machines || statisticsData.data?.machines || 0
      console.log(`✅ Machines récupérées: ${machines}`)
    } else {
      console.log(`⚠️  Statistics non disponibles (${statisticsResponse.status})`)
    }

    console.log('\n✅ Connexion au backend réussie !')
    return true

  } catch (error) {
    console.error('\n❌ Erreur lors de la connexion:', error.message)
    if (error.message.includes('fetch')) {
      console.error('   Vérifiez que HEARST_API_URL est correct et accessible')
    }
    return false
  }
}

// Exécuter le test
testBackendConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Tous les tests sont passés !')
      process.exit(0)
    } else {
      console.log('\n❌ Certains tests ont échoué')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale:', error)
    process.exit(1)
  })


