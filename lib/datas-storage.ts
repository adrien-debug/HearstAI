/**
 * Storage partagé pour les données Miners et Hosters
 * En production, remplacer par Prisma/PostgreSQL
 */

interface Miner {
  id: string
  name: string
  hashrate: number
  power: number
  efficiency: number
  price: number
  coolingType: 'hydro' | 'air' | 'immersion'
  manufacturer?: string
  model?: string
  releaseDate?: string
  photo?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface Hoster {
  id: string
  name: string
  country: string
  location: string
  electricityPrice: number
  additionalFees: number
  deposit: number
  photo?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// Stockage en mémoire (partagé entre toutes les routes)
let miners: Miner[] = []
let hosters: Hoster[] = []

export const minersStorage = {
  getAll: (filter?: { coolingType?: string }): Miner[] => {
    let result = [...miners]
    if (filter?.coolingType && filter.coolingType !== 'all') {
      result = result.filter(m => m.coolingType === filter.coolingType)
    }
    return result
  },
  
  getById: (id: string): Miner | undefined => {
    return miners.find(m => m.id === id)
  },
  
  create: (miner: Omit<Miner, 'id' | 'createdAt'>): Miner => {
    const newMiner: Miner = {
      ...miner,
      id: `miner-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    miners.push(newMiner)
    return newMiner
  },
  
  update: (id: string, updates: Partial<Miner>): Miner | null => {
    const index = miners.findIndex(m => m.id === id)
    if (index === -1) return null
    
    miners[index] = {
      ...miners[index],
      ...updates,
      id, // Garder l'ID original
      updatedAt: new Date().toISOString()
    }
    return miners[index]
  },
  
  delete: (id: string): boolean => {
    const index = miners.findIndex(m => m.id === id)
    if (index === -1) return false
    miners.splice(index, 1)
    return true
  }
}

export const hostersStorage = {
  getAll: (filter?: { country?: string }): Hoster[] => {
    let result = [...hosters]
    if (filter?.country && filter.country !== 'all') {
      result = result.filter(h => h.country === filter.country)
    }
    return result
  },
  
  getById: (id: string): Hoster | undefined => {
    return hosters.find(h => h.id === id)
  },
  
  create: (hoster: Omit<Hoster, 'id' | 'createdAt'>): Hoster => {
    const newHoster: Hoster = {
      ...hoster,
      id: `hoster-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    hosters.push(newHoster)
    return newHoster
  },
  
  update: (id: string, updates: Partial<Hoster>): Hoster | null => {
    const index = hosters.findIndex(h => h.id === id)
    if (index === -1) return null
    
    hosters[index] = {
      ...hosters[index],
      ...updates,
      id, // Garder l'ID original
      updatedAt: new Date().toISOString()
    }
    return hosters[index]
  },
  
  delete: (id: string): boolean => {
    const index = hosters.findIndex(h => h.id === id)
    if (index === -1) return false
    hosters.splice(index, 1)
    return true
  }
}

