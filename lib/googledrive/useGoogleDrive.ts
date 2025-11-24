/**
 * Hook React personnalisé pour interagir avec Google Drive
 */

import { useState, useCallback } from 'react';
import type {
  GoogleDriveFile,
  GoogleDriveFolder,
  ListFilesResponse,
  CreateFileRequest,
  UpdateFileRequest,
} from './googledrive-types';

interface UseGoogleDriveReturn {
  // État
  loading: boolean;
  error: string | null;
  authenticated: boolean;

  // Actions
  connect: () => Promise<void>;
  listFiles: (query?: string, pageSize?: number, orderBy?: string) => Promise<ListFilesResponse>;
  getFile: (fileId: string) => Promise<GoogleDriveFile>;
  createFile: (request: CreateFileRequest) => Promise<GoogleDriveFile>;
  updateFile: (fileId: string, request: UpdateFileRequest) => Promise<GoogleDriveFile>;
  deleteFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string) => Promise<Blob>;
  createFolder: (name: string, parents?: string[]) => Promise<GoogleDriveFolder>;
}

export function useGoogleDrive(): UseGoogleDriveReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Se connecter à Google Drive
   */
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/googledrive/auth/url');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération de l\'URL d\'autorisation');
      }

      // Rediriger vers l'URL d'autorisation
      window.location.href = data.authUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lister les fichiers
   */
  const listFiles = useCallback(async (
    query?: string,
    pageSize?: number,
    orderBy?: string
  ): Promise<ListFilesResponse> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (pageSize) params.append('pageSize', pageSize.toString());
      if (orderBy) params.append('orderBy', orderBy);

      const response = await fetch(`/api/googledrive/files?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la récupération des fichiers');
      }

      setAuthenticated(true);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupérer un fichier
   */
  const getFile = useCallback(async (fileId: string): Promise<GoogleDriveFile> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/googledrive/files/${fileId}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la récupération du fichier');
      }

      setAuthenticated(true);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer un fichier
   */
  const createFile = useCallback(async (request: CreateFileRequest): Promise<GoogleDriveFile> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/googledrive/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la création du fichier');
      }

      setAuthenticated(true);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mettre à jour un fichier
   */
  const updateFile = useCallback(async (
    fileId: string,
    request: UpdateFileRequest
  ): Promise<GoogleDriveFile> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/googledrive/files/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la mise à jour du fichier');
      }

      setAuthenticated(true);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprimer un fichier
   */
  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/googledrive/files/${fileId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la suppression du fichier');
      }

      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Télécharger un fichier
   */
  const downloadFile = useCallback(async (fileId: string): Promise<Blob> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/googledrive/files/${fileId}/download`);

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du téléchargement du fichier');
      }

      setAuthenticated(true);
      return await response.blob();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Créer un dossier
   */
  const createFolder = useCallback(async (
    name: string,
    parents?: string[]
  ): Promise<GoogleDriveFolder> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/googledrive/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parents }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          throw new Error('Non authentifié. Connectez-vous d\'abord à Google Drive.');
        }
        throw new Error(data.error || 'Erreur lors de la création du dossier');
      }

      setAuthenticated(true);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    authenticated,
    connect,
    listFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
    downloadFile,
    createFolder,
  };
}


