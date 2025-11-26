/**
 * Configuration de visibilité des éléments de navigation
 * Permet de masquer temporairement les pages en développement
 */

export interface NavItemConfig {
  href: string
  label: string
  icon: string
  view: string
  enabled: boolean // true = visible, false = masqué
}

export interface NavSectionConfig {
  label: string
  items: NavItemConfig[]
  enabled: boolean // true = section visible, false = section masquée
}

// Configuration de visibilité - Modifier ici pour activer/désactiver des éléments
export const navigationConfig = {
  // Pages principales (toujours visibles)
  mainPages: {
    overview: { enabled: true },
    myearthai: { enabled: true },
  },

  // Section Mining
  mining: {
    enabled: true,
    items: {
      cockpit: { enabled: true },
      projection: { enabled: true },
    },
  },

  // Section Cost Center
  costCenter: {
    enabled: true,
    items: {
      electricity: { enabled: true },
    },
  },

  // Section Hearst Tools
  hearstTools: {
    enabled: true,
    items: {
      calculator: { enabled: true },
      transactions: { enabled: true },
      'profitability-index': { enabled: false }, // Masqué temporairement
      collateral: { enabled: true },
      'wallet-scraper': { enabled: false }, // Masqué temporairement
    },
  },

  // Section Strategie
  strategie: {
    enabled: false, // Section masquée temporairement
    items: {
      'business-dev': { enabled: true },
      partnership: { enabled: true },
    },
  },

  // Section Datas
  datas: {
    enabled: true,
    items: {
      'datas/miner': { enabled: true },
      'datas/hoster': { enabled: true },
      glossaire: { enabled: true },
    },
  },

  // Section Management
  management: {
    enabled: true,
    items: {
      trello: { enabled: false }, // Masqué temporairement
      projects: { enabled: false }, // Masqué temporairement
      portfolio: { enabled: true },
      'documents-vault': { enabled: true },
    },
  },
}

/**
 * Vérifie si un item de navigation est activé
 */
export function isNavItemEnabled(href: string): boolean {
  // Pages principales
  if (href === '/' && navigationConfig.mainPages.overview.enabled) return true
  if (href === '/myearthai' && navigationConfig.mainPages.myearthai.enabled) return true

  // Section Mining
  if (href === '/cockpit') return navigationConfig.mining.enabled && navigationConfig.mining.items.cockpit.enabled
  if (href === '/projection') return navigationConfig.mining.enabled && navigationConfig.mining.items.projection.enabled

  // Section Cost Center
  if (href === '/electricity') return navigationConfig.costCenter.enabled && navigationConfig.costCenter.items.electricity.enabled

  // Section Hearst Tools
  if (href === '/calculator') return navigationConfig.hearstTools.enabled && navigationConfig.hearstTools.items.calculator.enabled
  if (href === '/transactions') return navigationConfig.hearstTools.enabled && navigationConfig.hearstTools.items.transactions.enabled
  if (href === '/profitability-index') return navigationConfig.hearstTools.enabled && navigationConfig.hearstTools.items['profitability-index'].enabled
  if (href === '/collateral') return navigationConfig.hearstTools.enabled && navigationConfig.hearstTools.items.collateral.enabled
  if (href === '/wallet-scraper') return navigationConfig.hearstTools.enabled && navigationConfig.hearstTools.items['wallet-scraper'].enabled

  // Section Strategie
  if (href === '/business-dev') return navigationConfig.strategie.enabled && navigationConfig.strategie.items['business-dev'].enabled
  if (href === '/partnership') return navigationConfig.strategie.enabled && navigationConfig.strategie.items.partnership.enabled

  // Section Datas
  if (href === '/datas/miner') return navigationConfig.datas.enabled && navigationConfig.datas.items['datas/miner'].enabled
  if (href === '/datas/hoster') return navigationConfig.datas.enabled && navigationConfig.datas.items['datas/hoster'].enabled
  if (href === '/glossaire') return navigationConfig.datas.enabled && navigationConfig.datas.items.glossaire.enabled

  // Section Management
  if (href === '/trello') return navigationConfig.management.enabled && navigationConfig.management.items.trello.enabled
  if (href === '/projects') return navigationConfig.management.enabled && navigationConfig.management.items.projects.enabled
  if (href === '/portfolio') return navigationConfig.management.enabled && navigationConfig.management.items.portfolio.enabled
  if (href === '/documents-vault') return navigationConfig.management.enabled && navigationConfig.management.items['documents-vault'].enabled

  // Par défaut, si non trouvé, on affiche (pour éviter de casser des liens existants)
  return true
}

/**
 * Vérifie si une section entière est activée
 */
export function isNavSectionEnabled(sectionKey: keyof typeof navigationConfig): boolean {
  if (sectionKey === 'mainPages') return true // Toujours visible
  
  const section = navigationConfig[sectionKey] as { enabled: boolean }
  return section?.enabled ?? true
}

/**
 * Filtre les items d'une section selon la configuration
 */
export function filterNavItems<T extends { href: string }>(items: T[]): T[] {
  return items.filter(item => isNavItemEnabled(item.href))
}

