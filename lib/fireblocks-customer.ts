/**
 * Utilitaires pour connecter Fireblocks aux customers
 */

import { prisma } from './db'
import { fireblocksClient } from './fireblocks/fireblocks-client'
import type { VaultAccount, ExternalWallet } from './fireblocks/fireblocks-types'

/**
 * Associe un vault Fireblocks à un customer
 */
export async function associateVaultToCustomer(
  customerId: string,
  vaultId: string
): Promise<void> {
  // Vérifier que le vault existe
  const vault = await fireblocksClient.getVaultAccount(vaultId)
  
  // Mettre à jour le customer
  await prisma.customer.update({
    where: { id: customerId },
    data: { fireblocksVaultId: vaultId }
  })
}

/**
 * Associe un wallet externe Fireblocks à un customer
 */
export async function associateWalletToCustomer(
  customerId: string,
  walletId: string
): Promise<void> {
  // Vérifier que le wallet existe
  const wallets = await fireblocksClient.getExternalWallets()
  const wallet = wallets.find(w => w.id === walletId)
  
  if (!wallet) {
    throw new Error(`Wallet externe ${walletId} non trouvé`)
  }
  
  // Mettre à jour le customer
  await prisma.customer.update({
    where: { id: customerId },
    data: { fireblocksWalletId: walletId }
  })
}

/**
 * Récupère les informations Fireblocks d'un customer
 */
export async function getCustomerFireblocksInfo(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  })
  
  if (!customer) {
    throw new Error('Customer non trouvé')
  }
  
  const result: {
    vault?: VaultAccount
    wallet?: ExternalWallet
    hasVault: boolean
    hasWallet: boolean
  } = {
    hasVault: !!customer.fireblocksVaultId,
    hasWallet: !!customer.fireblocksWalletId,
  }
  
  // Récupérer le vault si associé
  if (customer.fireblocksVaultId) {
    try {
      result.vault = await fireblocksClient.getVaultAccount(customer.fireblocksVaultId)
    } catch (error) {
      console.warn(`[Fireblocks] Erreur récupération vault ${customer.fireblocksVaultId}:`, error)
    }
  }
  
  // Récupérer le wallet si associé
  if (customer.fireblocksWalletId) {
    try {
      const wallets = await fireblocksClient.getExternalWallets()
      result.wallet = wallets.find(w => w.id === customer.fireblocksWalletId)
    } catch (error) {
      console.warn(`[Fireblocks] Erreur récupération wallet ${customer.fireblocksWalletId}:`, error)
    }
  }
  
  return result
}

/**
 * Liste tous les vaults disponibles dans Fireblocks
 */
export async function listAvailableVaults(): Promise<VaultAccount[]> {
  if (!fireblocksClient.isConfigured()) {
    return []
  }
  
  try {
    return await fireblocksClient.getVaultAccounts()
  } catch (error) {
    console.error('[Fireblocks] Erreur liste vaults:', error)
    return []
  }
}

/**
 * Liste tous les wallets externes disponibles dans Fireblocks
 */
export async function listAvailableWallets(): Promise<ExternalWallet[]> {
  if (!fireblocksClient.isConfigured()) {
    return []
  }
  
  try {
    return await fireblocksClient.getExternalWallets()
  } catch (error) {
    console.error('[Fireblocks] Erreur liste wallets:', error)
    return []
  }
}






