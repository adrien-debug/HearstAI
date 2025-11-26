// Script pour créer l'utilisateur localement (SQLite)
require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@hearst.ai'
  const name = 'Admin User'

  console.log('🔐 Création de l\'utilisateur par défaut (local)...')
  console.log(`📧 Email: ${email}`)
  console.log(`👤 Nom: ${name}`)
  console.log('')

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('✅ L\'utilisateur existe déjà dans la base de données')
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Nom: ${existingUser.name || 'Non défini'}`)
      console.log('')
      console.log('💡 Vous pouvez vous connecter avec:')
      console.log(`   Email: ${email}`)
      console.log('   Mot de passe: n\'importe quel mot de passe')
      console.log('   (la vérification du mot de passe n\'est pas encore implémentée)')
      return
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })

    console.log('✅ Utilisateur créé avec succès!')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nom: ${user.name}`)
    console.log('')
    console.log('💡 Vous pouvez maintenant vous connecter avec:')
    console.log(`   Email: ${email}`)
    console.log('   Mot de passe: n\'importe quel mot de passe')
    console.log('   (la vérification du mot de passe n\'est pas encore implémentée)')
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message)
    if (error.message.includes('postgresql') || error.message.includes('postgres://')) {
      console.error('')
      console.error('💡 Le schéma Prisma est configuré pour PostgreSQL')
      console.error('   Mais DATABASE_URL pointe vers SQLite')
      console.error('')
      console.error('📋 Solutions:')
      console.error('   1. Démarrer le serveur: npm run dev')
      console.error('   2. Appeler: http://localhost:3000/api/init-user')
      console.error('   3. Ou modifier temporairement le schéma pour SQLite')
    }
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })




