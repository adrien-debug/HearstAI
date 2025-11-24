/**
 * Client Fireblocks API
 * Documentation: https://developers.fireblocks.com/
 */

import { fireblocksConfig } from './fireblocks-config';
import type {
  TransactionRequest,
  TransactionResponse,
  VaultAccount,
  ExternalWallet,
  FireblocksError,
} from './fireblocks-types';
import * as crypto from 'crypto';

export class FireblocksClient {
  private config = fireblocksConfig;

  /**
   * Crée une signature pour l'authentification Fireblocks
   * Fireblocks utilise une signature RSA-SHA256 avec un format spécifique
   */
  private createSignature(path: string, body: string = '', method: string = 'GET'): string {
    const config = this.config.getConfig();
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const bodyHash = body ? crypto.createHash('sha256').update(body).digest('hex') : '';
    
    // Format du message pour Fireblocks: timestamp + nonce + method + path + bodyHash
    const message = `${timestamp}${nonce}${method}${path}${bodyHash}`;
    
    try {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(message);
      const signature = sign.sign(config.privateKey, 'base64');
      
      return signature;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la signature: ${error}`);
    }
  }

  /**
   * Appel générique à l'API Fireblocks
   */
  private async fireblocksRequest<T>(
    path: string,
    options: {
      method?: string;
      body?: any;
    } = {}
  ): Promise<T> {
    const config = this.config.getConfig();
    const method = options.method || 'GET';
    const bodyString = options.body ? JSON.stringify(options.body) : '';
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const signature = this.createSignature(path, bodyString, method);
    
    const url = `${config.baseUrl}${path}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'X-API-Key': config.apiKey,
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Signature': signature,
        'Content-Type': 'application/json',
      },
      body: bodyString || undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Fireblocks API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Crée une transaction
   */
  async createTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    return this.fireblocksRequest<TransactionResponse>('/v1/transactions', {
      method: 'POST',
      body: request,
    });
  }

  /**
   * Récupère une transaction par ID
   */
  async getTransaction(txId: string): Promise<TransactionResponse> {
    return this.fireblocksRequest<TransactionResponse>(`/v1/transactions/${txId}`);
  }

  /**
   * Liste les comptes vault
   */
  async getVaultAccounts(): Promise<VaultAccount[]> {
    const response = await this.fireblocksRequest<{ accounts: VaultAccount[] }>('/v1/vault/accounts_paged');
    return response.accounts || [];
  }

  /**
   * Récupère un compte vault par ID
   */
  async getVaultAccount(vaultAccountId: string): Promise<VaultAccount> {
    return this.fireblocksRequest<VaultAccount>(`/v1/vault/accounts/${vaultAccountId}`);
  }

  /**
   * Liste les wallets externes
   */
  async getExternalWallets(): Promise<ExternalWallet[]> {
    return this.fireblocksRequest<ExternalWallet[]>('/v1/external_wallets');
  }

  /**
   * Vérifie si la configuration est valide
   */
  isConfigured(): boolean {
    try {
      return this.config.isValid();
    } catch {
      return false;
    }
  }
}

// Export singleton
export const fireblocksClient = new FireblocksClient();

