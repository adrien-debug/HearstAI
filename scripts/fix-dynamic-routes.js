// Script pour ajouter 'export const dynamic = force-dynamic' aux routes API qui en ont besoin
const fs = require('fs');
const path = require('path');

const routesToFix = [
  'app/api/customers/route.ts',
  'app/api/customers/[id]/route.ts',
  'app/api/calculator/metrics/route.ts',
  'app/api/calculator/calculate/route.ts',
  'app/api/projects/route.ts',
  'app/api/projects/[id]/route.ts',
  'app/api/projects/[id]/rollback/route.ts',
  'app/api/setup/prices/route.ts',
  'app/api/setup/hosters/route.ts',
  'app/api/setup/miners/route.ts',
  'app/api/setup/summary/route.ts',
  'app/api/versions/route.ts',
  'app/api/versions/[id]/stable/route.ts',
  'app/api/versions/[id]/route.ts',
  'app/api/transactions/route.ts',
  'app/api/fireblocks/transactions/route.ts',
  'app/api/fireblocks/vaults/route.ts',
  'app/api/prompts/route.ts',
  'app/api/wallets/route.ts',
  'app/api/jobs/route.ts',
  'app/api/jobs/[id]/route.ts',
  'app/api/jobs/[id]/execute/route.ts',
  'app/api/stats/route.ts',
];

function addDynamicExport(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Vérifier si déjà présent
  if (content.includes('export const dynamic')) {
    console.log(`✅ Déjà configuré: ${filePath}`);
    return false;
  }

  // Trouver la première export function ou export async function
  const exportMatch = content.match(/^(export (async )?function \w+)/m);
  
  if (!exportMatch) {
    console.log(`⚠️  Pas d'export function trouvé dans: ${filePath}`);
    return false;
  }

  // Ajouter export const dynamic avant la première export function
  const newContent = content.replace(
    /^(export (async )?function \w+)/m,
    "export const dynamic = 'force-dynamic'\n\n$1"
  );

  fs.writeFileSync(fullPath, newContent, 'utf-8');
  console.log(`✅ Corrigé: ${filePath}`);
  return true;
}

console.log('🔧 Correction des routes API dynamiques...\n');

let fixed = 0;
routesToFix.forEach(route => {
  if (addDynamicExport(route)) {
    fixed++;
  }
});

console.log(`\n✅ ${fixed} route(s) corrigée(s) !`);

