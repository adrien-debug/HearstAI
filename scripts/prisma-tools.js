#!/usr/bin/env node

/**
 * 🛠️  Hub central pour tous les outils Prisma/Supabase
 * 
 * Affiche un menu interactif avec tous les outils disponibles
 */

const { execSync } = require('child_process');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '━'.repeat(70));
  log(`  ${title}`, 'cyan');
  console.log('━'.repeat(70) + '\n');
}

const tools = [
  {
    id: '1',
    name: 'Vérifier la synchronisation',
    description: 'Vérifie l\'état de synchronisation entre Prisma et Supabase',
    command: 'node scripts/sync-prisma-supabase.js check',
    category: 'Synchronisation',
  },
  {
    id: '2',
    name: 'Synchroniser le schéma (dev)',
    description: 'Synchronise rapidement le schéma (ATTENTION: dev uniquement)',
    command: 'node scripts/sync-prisma-supabase.js sync',
    category: 'Synchronisation',
    warning: '⚠️  Peut modifier la structure de la base',
  },
  {
    id: '3',
    name: 'Monitoring de la santé',
    description: 'Vérifie la connexion, performances et intégrité',
    command: 'node scripts/check-db-health.js',
    category: 'Monitoring',
  },
  {
    id: '4',
    name: 'Migration sécurisée (dev)',
    description: 'Crée et applique une migration avec backup automatique',
    command: 'node scripts/migrate-safe.js dev',
    category: 'Migration',
  },
  {
    id: '5',
    name: 'Migration sécurisée (production)',
    description: 'Applique les migrations en production avec backup',
    command: 'node scripts/migrate-safe.js deploy',
    category: 'Migration',
  },
  {
    id: '6',
    name: 'Générer le client Prisma',
    description: 'Génère le client Prisma après modification du schéma',
    command: 'npx prisma generate',
    category: 'Utilitaires',
  },
  {
    id: '7',
    name: 'Ouvrir Prisma Studio',
    description: 'Interface graphique pour visualiser et éditer les données',
    command: 'npx prisma studio',
    category: 'Utilitaires',
  },
  {
    id: '8',
    name: 'Voir le statut des migrations',
    description: 'Affiche l\'état des migrations Prisma',
    command: 'npx prisma migrate status',
    category: 'Migration',
  },
  {
    id: '9',
    name: 'Récupérer le schéma depuis Supabase',
    description: 'Récupère le schéma actuel de la base de données',
    command: 'npx prisma db pull',
    category: 'Synchronisation',
  },
  {
    id: '0',
    name: 'Quitter',
    description: 'Fermer le menu',
    command: null,
    category: 'Menu',
  },
];

function displayMenu() {
  console.clear();
  log('\n🛠️  Hub Prisma/Supabase - Outils de synchronisation', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  
  const categories = {};
  tools.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  
  Object.keys(categories).forEach(category => {
    if (category !== 'Menu') {
      logSection(`📁 ${category}`);
      categories[category].forEach(tool => {
        const warning = tool.warning ? ` ${colors.yellow}${tool.warning}${colors.reset}` : '';
        log(`  [${tool.id}] ${tool.name}${warning}`, 'blue');
        log(`      ${tool.description}`, 'reset');
        console.log('');
      });
    }
  });
  
  logSection('Menu');
  log('  [0] Quitter', 'blue');
  console.log('');
}

function executeTool(toolId) {
  const tool = tools.find(t => t.id === toolId);
  
  if (!tool) {
    log('❌ Outil non trouvé', 'red');
    return;
  }
  
  if (tool.command) {
    logSection(`🚀 Exécution: ${tool.name}`);
    log(`Commande: ${tool.command}`, 'blue');
    console.log('');
    
    try {
      execSync(tool.command, { stdio: 'inherit' });
      log('\n✅ Commande exécutée avec succès', 'green');
    } catch (error) {
      log('\n❌ Erreur lors de l\'exécution', 'red');
    }
  }
}

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  function askChoice() {
    displayMenu();
    rl.question('\n👉 Choisis un outil (0-9) : ', answer => {
      if (answer === '0') {
        log('\n👋 Au revoir !', 'cyan');
        rl.close();
        process.exit(0);
      }
      
      executeTool(answer);
      
      rl.question('\n⏎ Appuie sur Entrée pour continuer...', () => {
        askChoice();
      });
    });
  }
  
  askChoice();
}

// Si un argument est fourni, exécute directement
const args = process.argv.slice(2);
if (args.length > 0) {
  const toolId = args[0];
  const tool = tools.find(t => t.id === toolId);
  
  if (tool && tool.command) {
    executeTool(toolId);
  } else {
    log('❌ Outil non trouvé', 'red');
    process.exit(1);
  }
} else {
  main();
}


