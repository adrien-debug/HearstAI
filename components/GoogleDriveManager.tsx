'use client';

/**
 * Composant React pour gérer l'intégration Google Drive
 */

import { useState, useEffect } from 'react';
import { useGoogleDrive } from '@/lib/googledrive/useGoogleDrive';
import type { GoogleDriveFile } from '@/lib/googledrive/googledrive-types';

interface GoogleDriveManagerProps {
  folderId?: string; // ID du dossier spécifique (ex: "0AC8aEs7dght6Uk9PVA")
  onFileSelect?: (file: GoogleDriveFile) => void;
}

export default function GoogleDriveManager({ folderId, onFileSelect }: GoogleDriveManagerProps) {
  const {
    loading,
    error,
    authenticated,
    connect,
    listFiles,
    createFile,
    deleteFile,
    downloadFile,
    createFolder,
  } = useGoogleDrive();

  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  // Charger les fichiers au montage
  useEffect(() => {
    if (authenticated) {
      loadFiles();
    }
  }, [authenticated, folderId]);

  const loadFiles = async () => {
    try {
      let query = '';
      if (folderId) {
        query = `'${folderId}' in parents`;
      }
      if (searchQuery) {
        query += (query ? ' and ' : '') + `name contains '${searchQuery}'`;
      }

      const result = await listFiles(query, 50, 'modifiedTime desc');
      setFiles(result.files);
    } catch (err) {
      console.error('Erreur lors du chargement des fichiers:', err);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
    }
  };

  const handleCreateFile = async () => {
    try {
      await createFile({
        name: newFileName,
        content: newFileContent,
        parents: folderId ? [folderId] : undefined,
        mimeType: 'text/plain',
      });
      setShowCreateFile(false);
      setNewFileName('');
      setNewFileContent('');
      await loadFiles();
    } catch (err) {
      console.error('Erreur lors de la création du fichier:', err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      return;
    }

    try {
      await deleteFile(fileId);
      await loadFiles();
    } catch (err) {
      console.error('Erreur lors de la suppression du fichier:', err);
    }
  };

  const handleDownloadFile = async (file: GoogleDriveFile) => {
    try {
      const blob = await downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    }
  };

  const handleFileClick = (file: GoogleDriveFile) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  if (!authenticated) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Connexion à Google Drive</h2>
        <p className="text-gray-600 mb-4">
          Connectez-vous à votre compte Google Drive pour accéder à vos fichiers.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter à Google Drive'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Google Drive</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateFile(!showCreateFile)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Nouveau fichier
          </button>
          <button
            onClick={loadFiles}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {showCreateFile && (
        <div className="mb-4 p-4 bg-gray-50 rounded border">
          <h3 className="font-semibold mb-2">Créer un nouveau fichier</h3>
          <input
            type="text"
            placeholder="Nom du fichier"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Contenu du fichier"
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateFile}
              disabled={!newFileName || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setShowCreateFile(false);
                setNewFileName('');
                setNewFileContent('');
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher des fichiers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              loadFiles();
            }
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && !files.length ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun fichier trouvé</div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {file.mimeType} •{' '}
                    {file.size ? `${(parseInt(file.size) / 1024).toFixed(2)} KB` : 'Taille inconnue'}
                    {file.modifiedTime && ` • Modifié le ${new Date(file.modifiedTime).toLocaleDateString()}`}
                  </p>
                  {file.description && (
                    <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Ouvrir
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile(file);
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Télécharger
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.id);
                    }}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


