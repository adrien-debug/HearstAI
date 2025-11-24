/**
 * Configuration pour l'API Fireblocks
 */

import { FireblocksConfig } from './fireblocks-types';

export class FireblocksConfigManager {
  private static instance: FireblocksConfigManager;
  private config: FireblocksConfig | null = null;

  private constructor() {}

  static getInstance(): FireblocksConfigManager {
    if (!FireblocksConfigManager.instance) {
      FireblocksConfigManager.instance = new FireblocksConfigManager();
    }
    return FireblocksConfigManager.instance;
  }

  /**
   * Initialise la configuration depuis les variables d'environnement
   */
  initializeFromEnv(): FireblocksConfig {
    const apiKey = process.env.FIREBLOCKS_API_KEY;
    const privateKey = process.env.FIREBLOCKS_PRIVATE_KEY;
    const baseUrl = process.env.FIREBLOCKS_BASE_URL || 'https://api.fireblocks.io';
    const timeout = parseInt(process.env.FIREBLOCKS_TIMEOUT || '30000');

    if (!apiKey) {
      throw new Error('FIREBLOCKS_API_KEY n\'est pas définie dans les variables d\'environnement');
    }

    if (!privateKey) {
      throw new Error('FIREBLOCKS_PRIVATE_KEY n\'est pas définie dans les variables d\'environnement');
    }

    // Si la clé privée est encodée en base64, la décoder
    let decodedPrivateKey = privateKey;
    try {
      // Vérifier si c'est du base64
      if (!privateKey.includes('-----BEGIN')) {
        decodedPrivateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
      }
    } catch (e) {
      // Si le décodage échoue, utiliser la clé telle quelle
      decodedPrivateKey = privateKey;
    }

    this.config = {
      apiKey,
      privateKey: decodedPrivateKey,
      baseUrl,
      timeout,
    };

    return this.config;
  }

  /**
   * Définit la configuration manuellement
   */
  setConfig(config: FireblocksConfig): void {
    this.config = config;
  }

  /**
   * Récupère la configuration actuelle
   */
  getConfig(): FireblocksConfig {
    if (!this.config) {
      return this.initializeFromEnv();
    }
    return this.config;
  }

  /**
   * Vérifie si la configuration est valide
   */
  isValid(): boolean {
    try {
      // Si pas de config, essayer d'initialiser depuis .env
      if (!this.config) {
        try {
          this.initializeFromEnv();
        } catch (e) {
          return false;
        }
      }
      return !!(this.config && this.config.apiKey && this.config.privateKey);
    } catch {
      return false;
    }
  }
}

// Export singleton
export const fireblocksConfig = FireblocksConfigManager.getInstance();

