/**
 * Client Google Drive API
 * Documentation: https://developers.google.com/drive/api
 */

import { google } from 'googleapis';
import { googleDriveConfig } from './googledrive-config';
import type {
  GoogleDriveFile,
  GoogleDriveFolder,
  GoogleDriveToken,
  CreateFileRequest,
  UpdateFileRequest,
  ListFilesRequest,
  ListFilesResponse,
  DownloadFileRequest,
  GoogleDrivePermission,
} from './googledrive-types';
import { OAuth2Client } from 'google-auth-library';

export class GoogleDriveClient {
  private config = googleDriveConfig;
  private oauth2Client: OAuth2Client | null = null;
  private drive: ReturnType<typeof google.drive> | null = null;

  /**
   * Initialise le client OAuth2
   */
  private initializeOAuth2Client(): OAuth2Client {
    const config = this.config.getConfig();
    
    if (!this.oauth2Client) {
      this.oauth2Client = new OAuth2Client(
        config.clientId,
        config.clientSecret,
        config.redirectUri
      );
    }

    return this.oauth2Client;
  }

  /**
   * Définit les tokens d'accès pour l'authentification
   */
  setTokens(tokens: GoogleDriveToken): void {
    const client = this.initializeOAuth2Client();
    client.setCredentials(tokens);
    this.drive = google.drive({ version: 'v3', auth: client });
  }

  /**
   * Génère l'URL d'autorisation OAuth2
   */
  getAuthUrl(): string {
    const client = this.initializeOAuth2Client();
    const config = this.config.getConfig();
    
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: config.scopes,
      prompt: 'consent',
    });
  }

  /**
   * Échange le code d'autorisation contre des tokens
   */
  async getTokensFromCode(code: string): Promise<GoogleDriveToken> {
    const client = this.initializeOAuth2Client();
    const { tokens } = await client.getToken(code);
    
    return {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : undefined,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    };
  }

  /**
   * Vérifie que le client Drive est initialisé
   */
  private ensureDriveInitialized(): void {
    if (!this.drive) {
      throw new Error('Google Drive client non initialisé. Appelez setTokens() d\'abord.');
    }
  }

  /**
   * Liste les fichiers et dossiers
   */
  async listFiles(request: ListFilesRequest = {}): Promise<ListFilesResponse> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.files.list({
      q: request.q,
      pageSize: request.pageSize || 100,
      pageToken: request.pageToken,
      fields: request.fields || 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, parents, thumbnailLink, description, starred, trashed, shared, owners)',
      orderBy: request.orderBy,
      spaces: request.spaces,
      includeItemsFromAllDrives: request.includeItemsFromAllDrives || false,
      supportsAllDrives: true,
    });

    return {
      files: (response.data.files || []) as GoogleDriveFile[],
      nextPageToken: response.data.nextPageToken || undefined,
      incompleteSearch: response.data.incompleteSearch || false,
    };
  }

  /**
   * Récupère un fichier par ID
   */
  async getFile(fileId: string): Promise<GoogleDriveFile> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.files.get({
      fileId,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, parents, thumbnailLink, description, starred, trashed, shared, owners',
      supportsAllDrives: true,
    });

    return response.data as GoogleDriveFile;
  }

  /**
   * Crée un fichier
   */
  async createFile(request: CreateFileRequest): Promise<GoogleDriveFile> {
    this.ensureDriveInitialized();
    
    const fileMetadata: any = {
      name: request.name,
      mimeType: request.mimeType,
      parents: request.parents,
      description: request.description,
    };

    let media: any = undefined;
    if (request.content) {
      media = {
        mimeType: request.mimeType || 'text/plain',
        body: typeof request.content === 'string' 
          ? Buffer.from(request.content, 'utf-8')
          : request.content,
      };
    }

    const response = await this.drive!.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, parents, thumbnailLink, description',
      supportsAllDrives: true,
    });

    return response.data as GoogleDriveFile;
  }

  /**
   * Met à jour un fichier
   */
  async updateFile(fileId: string, request: UpdateFileRequest): Promise<GoogleDriveFile> {
    this.ensureDriveInitialized();
    
    const fileMetadata: any = {};
    if (request.name !== undefined) fileMetadata.name = request.name;
    if (request.description !== undefined) fileMetadata.description = request.description;
    if (request.parents !== undefined) fileMetadata.parents = request.parents;
    if (request.trashed !== undefined) fileMetadata.trashed = request.trashed;
    if (request.starred !== undefined) fileMetadata.starred = request.starred;

    let media: any = undefined;
    if (request.content) {
      media = {
        mimeType: 'text/plain',
        body: typeof request.content === 'string' 
          ? Buffer.from(request.content, 'utf-8')
          : request.content,
      };
    }

    const response = await this.drive!.files.update({
      fileId,
      requestBody: fileMetadata,
      media,
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, parents, thumbnailLink, description',
      supportsAllDrives: true,
    });

    return response.data as GoogleDriveFile;
  }

  /**
   * Supprime un fichier
   */
  async deleteFile(fileId: string): Promise<void> {
    this.ensureDriveInitialized();
    
    await this.drive!.files.delete({
      fileId,
      supportsAllDrives: true,
    });
  }

  /**
   * Télécharge le contenu d'un fichier
   */
  async downloadFile(request: DownloadFileRequest): Promise<Buffer> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.files.get(
      {
        fileId: request.fileId,
        alt: request.alt || 'media',
        supportsAllDrives: true,
      },
      { responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data as ArrayBuffer);
  }

  /**
   * Crée un dossier
   */
  async createFolder(name: string, parents?: string[]): Promise<GoogleDriveFolder> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents,
      },
      fields: 'id, name, mimeType, createdTime, modifiedTime, parents, webViewLink, description',
      supportsAllDrives: true,
    });

    return response.data as GoogleDriveFolder;
  }

  /**
   * Liste les permissions d'un fichier
   */
  async listPermissions(fileId: string): Promise<GoogleDrivePermission[]> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.permissions.list({
      fileId,
      fields: 'permissions(id, type, role, emailAddress, displayName, allowFileDiscovery)',
      supportsAllDrives: true,
    });

    return (response.data.permissions || []) as GoogleDrivePermission[];
  }

  /**
   * Crée une permission (partage) pour un fichier
   */
  async createPermission(
    fileId: string,
    permission: Omit<GoogleDrivePermission, 'id'>
  ): Promise<GoogleDrivePermission> {
    this.ensureDriveInitialized();
    
    const response = await this.drive!.permissions.create({
      fileId,
      requestBody: {
        type: permission.type,
        role: permission.role,
        emailAddress: permission.emailAddress,
        allowFileDiscovery: permission.allowFileDiscovery,
      },
      fields: 'id, type, role, emailAddress, displayName, allowFileDiscovery',
      supportsAllDrives: true,
    });

    return response.data as GoogleDrivePermission;
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

  /**
   * Vérifie si le client est authentifié
   */
  isAuthenticated(): boolean {
    return this.drive !== null && this.oauth2Client !== null;
  }
}

// Export singleton
export const googleDriveClient = new GoogleDriveClient();


