// Script automatique pour créer l'utilisateur
// Fonctionne avec SQLite (local) ou PostgreSQL (Vercel)
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')
const https = require('https')
const http = require('http')

const prisma = new PrismaClient()

async function createUserViaAPI() {
  return new Promise((resolve, reject) => {
    const apiUrl = 'http://localhost:3000/api/init-user'
    
    console.log(`🌐 Tentative via l'API: ${apiUrl}`)
    
    const client = apiUrl.startsWith('https') ? https : http
    
    const req = client.get(apiUrl, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          reject(new Error(`Réponse invalide: ${data}`))
        }
      })
    })
    
    req.on('error', (err) => {
      reject(err)
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Timeout'))
    })
  })
}

async function createUserViaPrisma() {
  const email = 'admin@hearst.ai'
  const name = 'Admin User'

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      success: true,
      message: 'Utilisateur déjà existant',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
    }
  }

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  })

  return {
    success: true,
    message: 'Utilisateur créé avec succès',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  }
}

async function main() {
  console.log('🔐 Création de l\'utilisateur par défaut...')
  console.log(`📧 Email: admin@hearst.ai`)
  console.log(`👤 Nom: Admin User`)
  console.log('')

  try {
    // Essayer d'abord via l'API (si le serveur est démarré)
    try {
      const result = await createUserViaAPI()
      console.log('✅ Utilisateur créé via l\'API !')
      console.log(`   ${result.message}`)
      if (result.user) {
        console.log(`   ID: ${result.user.id}`)
        console.log(`   Email: ${result.user.email}`)
        console.log(`   Nom: ${result.user.name}`)
      }
      return
    } catch (apiError) {
      console.log(`⚠️  API non disponible: ${apiError.message}`)
      console.log('   Tentative directe via Prisma...')
      console.log('')
    }

    // Sinon, essayer directement via Prisma
    const result = await createUserViaPrisma()
    console.log('✅ Utilisateur créé via Prisma !')
    console.log(`   ${result.message}`)
    if (result.user) {
      console.log(`   ID: ${result.user.id}`)
      console.log(`   Email: ${result.user.email}`)
      console.log(`   Nom: ${result.user.name}`)
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('postgresql') || error.message.includes('postgres://')) {
      console.error('')
      console.error('💡 Le schéma Prisma est configuré pour PostgreSQL')
      console.error('   Mais DATABASE_URL pointe vers SQLite')
      console.error('')
      console.error('📋 Solutions:')
      console.error('   1. Démarrer le serveur: npm run dev')
      console.error('   2. Puis appeler: http://localhost:3000/api/init-user')
      console.error('   3. Ou modifier DATABASE_URL pour PostgreSQL')
    } else if (error.message.includes('DATABASE_URL')) {
      console.error('')
      console.error('💡 DATABASE_URL n\'est pas configuré')
      console.error('   Vérifiez votre fichier .env.local')
    }
    throw error
  } finally {
    await prisma.$disconnect()
  }

  console.log('')
  console.log('💡 Vous pouvez maintenant vous connecter avec:')
  console.log('   Email: admin@hearst.ai')
  console.log('   Mot de passe: n\'importe quel mot de passe')
  console.log('   (la vérification du mot de passe n\'est pas encore implémentée)')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

