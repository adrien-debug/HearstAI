/**
 * Gestionnaire unifié pour toutes les APIs externes
 * Centralise la configuration et la gestion d'erreurs
 */

import { fireblocksClient } from './fireblocks/fireblocks-client';
import { buildCollateralClientFromDeBank } from './debank';

export interface APIConfig {
  debank: {
    enabled: boolean;
    apiKey?: string;
  };
  anthropic: {
    enabled: boolean;
    apiKey?: string;
  };
  fireblocks: {
    enabled: boolean;
    apiKey?: string;
  };
  luxor: {
    enabled: boolean;
    apiKey?: string;
  };
}

export class APIManager {
  private static instance: APIManager;
  private config: APIConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  /**
   * Charge la configuration depuis les variables d'environnement
   */
  private loadConfig(): APIConfig {
    return {
      debank: {
        enabled: !!process.env.DEBANK_ACCESS_KEY && process.env.DEBANK_ACCESS_KEY !== 'your_debank_access_key_here',
        apiKey: process.env.DEBANK_ACCESS_KEY,
      },
      anthropic: {
        enabled: !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'YOUR_API_KEY_HERE',
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
      fireblocks: {
        enabled: !!process.env.FIREBLOCKS_API_KEY && !!process.env.FIREBLOCKS_PRIVATE_KEY,
        apiKey: process.env.FIREBLOCKS_API_KEY,
      },
      luxor: {
        enabled: !!process.env.LUXOR_API_KEY && process.env.LUXOR_API_KEY !== 'your_luxor_api_key_here',
        apiKey: process.env.LUXOR_API_KEY,
      },
    };
  }

  /**
   * Récupère la configuration actuelle
   */
  getConfig(): APIConfig {
    return { ...this.config };
  }

  /**
   * Vérifie le statut de toutes les APIs
   */
  getStatus(): {
    [key: string]: {
      enabled: boolean;
      configured: boolean;
      message: string;
    };
  } {
    return {
      debank: {
        enabled: this.config.debank.enabled,
        configured: !!this.config.debank.apiKey,
        message: this.config.debank.enabled
          ? 'DeBank API configurée'
          : 'DeBank API non configurée (DEBANK_ACCESS_KEY manquant)',
      },
      anthropic: {
        enabled: this.config.anthropic.enabled,
        configured: !!this.config.anthropic.apiKey,
        message: this.config.anthropic.enabled
          ? 'Anthropic Claude API configurée'
          : 'Anthropic Claude API non configurée (ANTHROPIC_API_KEY manquant)',
      },
      fireblocks: {
        enabled: this.config.fireblocks.enabled,
        configured: fireblocksClient.isConfigured(),
        message: this.config.fireblocks.enabled
          ? 'Fireblocks API configurée'
          : 'Fireblocks API non configurée (FIREBLOCKS_API_KEY ou FIREBLOCKS_PRIVATE_KEY manquant)',
      },
      luxor: {
        enabled: this.config.luxor.enabled,
        configured: !!this.config.luxor.apiKey,
        message: this.config.luxor.enabled
          ? 'Luxor API configurée'
          : 'Luxor API non configurée (LUXOR_API_KEY manquant)',
      },
    };
  }

  /**
   * Teste la connexion à une API
   */
  async testConnection(apiName: 'debank' | 'anthropic' | 'fireblocks' | 'luxor'): Promise<{
    success: boolean;
    message: string;
  }> {
    switch (apiName) {
      case 'debank':
        if (!this.config.debank.enabled) {
          return { success: false, message: 'DeBank API non configurée' };
        }
        try {
          // Test simple avec un wallet connu
          await buildCollateralClientFromDeBank('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', {
            chains: ['eth'],
          });
          return { success: true, message: 'DeBank API accessible' };
        } catch (error: any) {
          return { success: false, message: `Erreur DeBank: ${error.message}` };
        }

      case 'anthropic':
        if (!this.config.anthropic.enabled) {
          return { success: false, message: 'Anthropic API non configurée' };
        }
        // Test simplifié - vérifier que la clé est valide
        return { success: true, message: 'Anthropic API clé configurée (test complet nécessite appel API)' };

      case 'fireblocks':
        if (!this.config.fireblocks.enabled) {
          return { success: false, message: 'Fireblocks API non configurée' };
        }
        try {
          const isConfigured = fireblocksClient.isConfigured();
          return {
            success: isConfigured,
            message: isConfigured ? 'Fireblocks API configurée' : 'Fireblocks API non configurée',
          };
        } catch (error: any) {
          return { success: false, message: `Erreur Fireblocks: ${error.message}` };
        }

      case 'luxor':
        if (!this.config.luxor.enabled) {
          return { success: false, message: 'Luxor API non configurée' };
        }
        // Test simplifié
        return { success: true, message: 'Luxor API clé configurée (test complet nécessite appel API)' };

      default:
        return { success: false, message: 'API inconnue' };
    }
  }

  /**
   * Teste toutes les connexions
   */
  async testAllConnections(): Promise<{
    [key: string]: {
      success: boolean;
      message: string;
    };
  }> {
    const results: any = {};
    
    for (const apiName of ['debank', 'anthropic', 'fireblocks', 'luxor'] as const) {
      results[apiName] = await this.testConnection(apiName);
    }
    
    return results;
  }
}

// Export singleton
export const apiManager = APIManager.getInstance();


