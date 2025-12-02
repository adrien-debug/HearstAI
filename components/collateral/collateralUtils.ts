/**
 * Utilitaires partagés pour les calculs de métriques collateral
 * Évite la duplication de code entre les différents composants
 */

export interface ClientMetrics {
  totalCollateralUsd: number
  totalDebtUsd: number
  collateralizationRatio: number
  healthFactor: number
  riskPercent: number
  avgBorrowRate: number
  availableCredit: number
  utilizationRate: number
  totalBtcCollateral: number
  totalEthCollateral: number
  totalUsdcCollateral: number
  btcLiqPrice: number | null
  ethLiqPrice: number | null
}

export interface Position {
  asset: string
  collateralAmount: number
  collateralPriceUsd: number
  debtAmount: number
  debtToken: string
  borrowApr: number
  protocol: string
  chain: string
}

export interface Client {
  id: string
  name: string
  tag: string
  wallets: string[]
  positions?: Position[]
  lastUpdate?: string
  totalValue?: number
  totalDebt?: number
  healthFactor?: number
}

/**
 * Calcule les métriques complètes d'un client à partir de ses positions
 */
export function computeClientMetrics(client: Client): ClientMetrics {
  let totalCollateralUsd = 0
  let totalDebtUsd = 0
  let weightedRateNumerator = 0
  let totalBtcCollateral = 0
  let totalEthCollateral = 0
  let totalUsdcCollateral = 0

  client.positions?.forEach((pos: Position) => {
    const collatUsd = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    const debtUsd = pos.debtAmount || 0

    totalCollateralUsd += collatUsd
    totalDebtUsd += debtUsd
    weightedRateNumerator += debtUsd * (pos.borrowApr || 0)

    if (pos.asset === 'BTC') totalBtcCollateral += pos.collateralAmount || 0
    if (pos.asset === 'ETH') totalEthCollateral += pos.collateralAmount || 0
    if (pos.asset === 'USDC' || pos.asset === 'USDT') totalUsdcCollateral += pos.collateralAmount || 0
  })

  const collateralizationRatio = totalDebtUsd === 0 ? Infinity : totalCollateralUsd / totalDebtUsd
  const healthFactor = collateralizationRatio === Infinity ? 999 : collateralizationRatio
  const threshold = 0.9
  const maxDebtSafe = totalCollateralUsd * threshold
  const riskRaw = maxDebtSafe === 0 ? 0 : totalDebtUsd / maxDebtSafe
  const riskPercent = Math.max(0, Math.min(100, riskRaw * 100))
  const avgBorrowRate = totalDebtUsd === 0 ? 0 : weightedRateNumerator / totalDebtUsd
  const availableCredit = Math.max(0, maxDebtSafe - totalDebtUsd)
  const utilizationRate = totalCollateralUsd > 0 ? (totalDebtUsd / totalCollateralUsd) * 100 : 0

  // Calcul du prix de liquidation pour BTC et ETH
  let btcLiqPrice: number | null = null
  if (totalBtcCollateral > 0 && totalDebtUsd > 0) {
    btcLiqPrice = totalDebtUsd / (threshold * totalBtcCollateral)
  }

  let ethLiqPrice: number | null = null
  if (totalEthCollateral > 0 && totalDebtUsd > 0) {
    ethLiqPrice = totalDebtUsd / (threshold * totalEthCollateral)
  }

  return {
    totalCollateralUsd,
    totalDebtUsd,
    collateralizationRatio,
    healthFactor,
    riskPercent,
    avgBorrowRate,
    availableCredit,
    utilizationRate,
    totalBtcCollateral,
    totalEthCollateral,
    totalUsdcCollateral,
    btcLiqPrice,
    ethLiqPrice,
  }
}

/**
 * Calcule les métriques globales à partir d'une liste de clients
 */
export function computeGlobalMetrics(clients: Client[]) {
  const allMetrics = clients.map(client => computeClientMetrics(client))
  
  const totalCollateral = allMetrics.reduce((sum, m) => sum + m.totalCollateralUsd, 0)
  const totalDebt = allMetrics.reduce((sum, m) => sum + m.totalDebtUsd, 0)
  const totalAvailable = allMetrics.reduce((sum, m) => sum + m.availableCredit, 0)
  const utilizationRate = totalCollateral > 0 ? (totalDebt / totalCollateral) * 100 : 0
  
  const clientsWithDebt = clients.filter(c => computeClientMetrics(c).totalDebtUsd > 0)
  const avgHealthFactor = clientsWithDebt.length > 0
    ? clientsWithDebt.reduce((sum, c) => sum + computeClientMetrics(c).healthFactor, 0) / clientsWithDebt.length
    : 0
  
  const avgUtilizationRate = allMetrics.length > 0
    ? allMetrics.reduce((sum, m) => sum + m.utilizationRate, 0) / allMetrics.length
    : 0

  return {
    totalCollateral,
    totalDebt,
    totalAvailable,
    utilizationRate,
    avgHealthFactor,
    avgUtilizationRate,
    totalClients: clients.length,
    activeClients: clients.filter(c => (c.positions?.length || 0) > 0).length,
    clientsWithDebt: clientsWithDebt.length,
  }
}

/**
 * Collecte tous les assets de tous les clients avec accumulation
 */
export function collectAllAssets(clients: Client[]) {
  const assetsMap = new Map<string, {
    asset: string
    protocol: string
    chain: string
    amount: number
    priceUsd: number
    totalValue: number
    clients: string[]
  }>()

  clients.forEach((client) => {
    client.positions?.forEach((pos: Position) => {
      if (pos.collateralAmount > 0) {
        const key = `${pos.asset}-${pos.protocol}-${pos.chain}`
        const existing = assetsMap.get(key)
        
        if (existing) {
          existing.amount += pos.collateralAmount
          existing.totalValue += pos.collateralAmount * (pos.collateralPriceUsd || 0)
          if (!existing.clients.includes(client.name)) {
            existing.clients.push(client.name)
          }
        } else {
          assetsMap.set(key, {
            asset: pos.asset || 'UNKNOWN',
            protocol: pos.protocol || 'Unknown',
            chain: pos.chain || 'unknown',
            amount: pos.collateralAmount,
            priceUsd: pos.collateralPriceUsd || 0,
            totalValue: pos.collateralAmount * (pos.collateralPriceUsd || 0),
            clients: [client.name],
          })
        }
      }
    })
  })

  return Array.from(assetsMap.values()).sort((a, b) => b.totalValue - a.totalValue)
}

/**
 * Collecte tous les prêts actifs de tous les clients
 */
export function collectAllLoans(clients: Client[]) {
  const allLoans: Array<{
    loanId: string
    clientName: string
    clientId: string
    principal: number
    debtToken: string
    interestRate: number
    collateral: string
    collateralValue: number
    protocol: string
    chain: string
    healthFactor: number
    ltv: number
    status: string
    lastUpdate?: string
  }> = []

  clients.forEach((client) => {
    const clientMetrics = computeClientMetrics(client)
    client.positions?.forEach((pos: Position, posIdx: number) => {
      if (pos.debtAmount > 0) {
        const collateralValue = (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
        const ltv = collateralValue > 0 ? (pos.debtAmount / collateralValue) * 100 : 0
        const status = clientMetrics.healthFactor >= 2 ? 'Safe' : clientMetrics.healthFactor >= 1.5 ? 'At Risk' : 'Critical'
        
        allLoans.push({
          loanId: `${client.id.slice(0, 8)}-${posIdx}`,
          clientName: client.name,
          clientId: client.id,
          principal: pos.debtAmount,
          debtToken: pos.debtToken || 'USD',
          interestRate: (pos.borrowApr || 0) * 100,
          collateral: `${pos.collateralAmount.toFixed(2)} ${pos.asset}`,
          collateralValue,
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          healthFactor: clientMetrics.healthFactor,
          ltv,
          status,
          lastUpdate: client.lastUpdate,
        })
      }
    })
  })

  return allLoans.sort((a, b) => b.principal - a.principal)
}

/**
 * Collecte toutes les transactions depuis les positions
 */
export function collectAllTransactions(clients: Client[]) {
  const allTransactions: Array<{
    id: string
    date: string
    type: 'Supply' | 'Borrow' | 'Repay'
    amount: number
    asset: string
    assetValue: number
    protocol: string
    chain: string
    status: string
    txHash: string | null
    clientName: string
  }> = []

  clients.forEach((client) => {
    const lastUpdate = client.lastUpdate ? new Date(client.lastUpdate) : new Date()
    
    client.positions?.forEach((pos: Position, posIdx: number) => {
      if (pos.collateralAmount > 0) {
        allTransactions.push({
          id: `${client.id}-supply-${posIdx}`,
          date: lastUpdate.toISOString(),
          type: 'Supply',
          amount: pos.collateralAmount,
          asset: pos.asset,
          assetValue: pos.collateralAmount * (pos.collateralPriceUsd || 0),
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          status: 'Active',
          txHash: null,
          clientName: client.name,
        })
      }
      
      if (pos.debtAmount > 0) {
        allTransactions.push({
          id: `${client.id}-borrow-${posIdx}`,
          date: lastUpdate.toISOString(),
          type: 'Borrow',
          amount: pos.debtAmount,
          asset: pos.debtToken || 'USD',
          assetValue: pos.debtAmount,
          protocol: pos.protocol || 'Unknown',
          chain: pos.chain || 'unknown',
          status: 'Active',
          txHash: null,
          clientName: client.name,
        })
      }
    })
  })

  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Calcule la répartition par protocole
 */
export function computeProtocolBreakdown(clients: Client[]) {
  const breakdown: { [key: string]: { collateral: number; debt: number; positions: number } } = {}
  
  clients.forEach((client) => {
    client.positions?.forEach((pos: Position) => {
      const protocol = pos.protocol || 'Unknown'
      if (!breakdown[protocol]) {
        breakdown[protocol] = { collateral: 0, debt: 0, positions: 0 }
      }
      breakdown[protocol].collateral += (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
      breakdown[protocol].debt += pos.debtAmount || 0
      breakdown[protocol].positions += 1
    })
  })
  
  return breakdown
}

/**
 * Calcule la répartition par asset
 */
export function computeAssetBreakdown(clients: Client[]) {
  const breakdown: { [key: string]: { amount: number; value: number } } = {}
  
  clients.forEach((client) => {
    client.positions?.forEach((pos: Position) => {
      const asset = pos.asset || 'UNKNOWN'
      if (!breakdown[asset]) {
        breakdown[asset] = { amount: 0, value: 0 }
      }
      breakdown[asset].amount += pos.collateralAmount || 0
      breakdown[asset].value += (pos.collateralAmount || 0) * (pos.collateralPriceUsd || 0)
    })
  })
  
  return breakdown
}

/**
 * Formate une date relative
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

/**
 * Tronque un hash pour l'affichage
 */
export function truncateHash(hash: string | null): string {
  if (!hash) return 'N/A'
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

/**
 * Formate un montant en devise USD de manière lisible
 * - >= 1M: "$X.XXM" (ex: "$1.03M")
 * - >= 1K: "$X.XXK" (ex: "$1.23K")
 * - < 1K: "$X.XX" (ex: "$123.45")
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`
  } else {
    return `$${amount.toFixed(2)}`
  }
}

