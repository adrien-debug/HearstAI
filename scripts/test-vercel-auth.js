// Script pour tester l'authentification sur Vercel
// Usage: node scripts/test-vercel-auth.js

const https = require('https');

const VERCEL_URL = 'https://hearstai-6dnhm44p9-adrien-nejkovics-projects.vercel.app';

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, VERCEL_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: json,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function main() {
  console.log('🧪 Test de l\'authentification Vercel');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Initialiser l'utilisateur
  console.log('📋 Test 1: Initialisation de l\'utilisateur...');
  try {
    const initResult = await testEndpoint('/api/init-user');
    if (initResult.status === 200) {
      console.log('✅ Utilisateur initialisé avec succès');
      console.log(`   Email: ${initResult.data.user?.email || 'N/A'}`);
      console.log(`   ID: ${initResult.data.user?.id || 'N/A'}\n`);
    } else {
      console.log(`❌ Erreur ${initResult.status}: ${initResult.data.error || initResult.data}\n`);
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}\n`);
  }

  // Test 2: Vérifier que l'API répond
  console.log('📋 Test 2: Vérification de l\'API...');
  try {
    const apiResult = await testEndpoint('/api/auth/providers');
    if (apiResult.status === 200) {
      console.log('✅ API NextAuth accessible\n');
    } else {
      console.log(`⚠️  API répond avec le statut ${apiResult.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}\n`);
  }

  // Test 3: Vérifier la page de connexion
  console.log('📋 Test 3: Vérification de la page de connexion...');
  try {
    const signinResult = await testEndpoint('/auth/signin');
    if (signinResult.status === 200) {
      console.log('✅ Page de connexion accessible\n');
    } else {
      console.log(`⚠️  Page répond avec le statut ${signinResult.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}\n`);
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📝 Résumé:');
  console.log('   Si tous les tests passent, tu peux te connecter avec:');
  console.log('   Email: admin@hearst.ai');
  console.log('   Mot de passe: n\'importe quel mot de passe');
  console.log(`\n🔗 URL de connexion: ${VERCEL_URL}/auth/signin`);
}

main().catch(console.error);

