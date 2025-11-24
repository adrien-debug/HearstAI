/**
 * Types TypeScript pour l'API Google Drive
 * Documentation: https://developers.google.com/drive/api
 */

// Configuration Google Drive OAuth
export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

// Token OAuth
export interface GoogleDriveToken {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

// Fichier Google Drive
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  thumbnailLink?: string;
  description?: string;
  starred?: boolean;
  trashed?: boolean;
  shared?: boolean;
  owners?: Array<{
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
  }>;
  permissions?: GoogleDrivePermission[];
}

// Dossier Google Drive
export interface GoogleDriveFolder {
  id: string;
  name: string;
  mimeType: 'application/vnd.google-apps.folder';
  createdTime?: string;
  modifiedTime?: string;
  parents?: string[];
  webViewLink?: string;
  description?: string;
}

// Permission Google Drive
export interface GoogleDrivePermission {
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  emailAddress?: string;
  displayName?: string;
  allowFileDiscovery?: boolean;
}

// Requête de création de fichier
export interface CreateFileRequest {
  name: string;
  mimeType?: string;
  parents?: string[];
  description?: string;
  content?: string | Buffer;
}

// Requête de mise à jour de fichier
export interface UpdateFileRequest {
  name?: string;
  description?: string;
  parents?: string[];
  trashed?: boolean;
  starred?: boolean;
  content?: string | Buffer;
}

// Requête de liste de fichiers
export interface ListFilesRequest {
  q?: string;
  pageSize?: number;
  pageToken?: string;
  fields?: string;
  orderBy?: string;
  spaces?: string;
  includeItemsFromAllDrives?: boolean;
  supportsAllDrives?: boolean;
}

// Réponse de liste de fichiers
export interface ListFilesResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
  incompleteSearch?: boolean;
}

// Requête de téléchargement
export interface DownloadFileRequest {
  fileId: string;
  alt?: 'media' | 'json';
}

// Erreur Google Drive
export interface GoogleDriveError {
  error: {
    code: number;
    message: string;
    status: string;
    errors?: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}


