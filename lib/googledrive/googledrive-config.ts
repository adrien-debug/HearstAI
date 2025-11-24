/**
 * Configuration pour l'API Google Drive
 */

import { GoogleDriveConfig } from './googledrive-types';

export class GoogleDriveConfigManager {
  private static instance: GoogleDriveConfigManager;
  private config: GoogleDriveConfig | null = null;

  private constructor() {}

  static getInstance(): GoogleDriveConfigManager {
    if (!GoogleDriveConfigManager.instance) {
      GoogleDriveConfigManager.instance = new GoogleDriveConfigManager();
    }
    return GoogleDriveConfigManager.instance;
  }

  /**
   * Initialise la configuration depuis les variables d'environnement
   */
  initializeFromEnv(): GoogleDriveConfig {
    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'http://localhost:6001/api/googledrive/auth/callback';
    const scopes = (process.env.GOOGLE_DRIVE_SCOPES || 
      'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file').split(' ');

    if (!clientId) {
      throw new Error('GOOGLE_DRIVE_CLIENT_ID n\'est pas définie dans les variables d\'environnement');
    }

    if (!clientSecret) {
      throw new Error('GOOGLE_DRIVE_CLIENT_SECRET n\'est pas définie dans les variables d\'environnement');
    }

    this.config = {
      clientId,
      clientSecret,
      redirectUri,
      scopes,
    };

    return this.config;
  }

  /**
   * Définit la configuration manuellement
   */
  setConfig(config: GoogleDriveConfig): void {
    this.config = config;
  }

  /**
   * Récupère la configuration actuelle
   */
  getConfig(): GoogleDriveConfig {
    if (!this.config) {
      return this.initializeFromEnv();
    }
    return this.config;
  }

  /**
   * Vérifie si la configuration est valide
   */
  isValid(): boolean {
    if (!this.config) {
      return false;
    }
    return !!(this.config.clientId && this.config.clientSecret);
  }
}

// Export singleton
export const googleDriveConfig = GoogleDriveConfigManager.getInstance();


