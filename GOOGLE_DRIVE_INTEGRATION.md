# Intégration Google Drive

Ce document explique comment configurer et utiliser l'intégration Google Drive dans votre plateforme HearstAI.

## Configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Drive :
   - Allez dans "APIs & Services" > "Library"
   - Recherchez "Google Drive API"
   - Cliquez sur "Enable"

### 2. Créer des identifiants OAuth 2.0

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth client ID"
3. Sélectionnez "Web application"
4. Configurez :
   - **Name**: HearstAI Google Drive Integration
   - **Authorized JavaScript origins**: `http://localhost:6001` (pour le développement)
   - **Authorized redirect URIs**: `http://localhost:6001/api/googledrive/auth/callback`
5. Copiez le **Client ID** et le **Client Secret**

### 3. Variables d'environnement

Ajoutez les variables suivantes dans votre fichier `.env.local` :

```env
# Google Drive OAuth Configuration
GOOGLE_DRIVE_CLIENT_ID=votre_client_id_ici
GOOGLE_DRIVE_CLIENT_SECRET=votre_client_secret_ici
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:6001/api/googledrive/auth/callback
GOOGLE_DRIVE_SCOPES=https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file
```

**Scopes disponibles :**
- `https://www.googleapis.com/auth/drive.readonly` - Lecture seule
- `https://www.googleapis.com/auth/drive.file` - Accès aux fichiers créés par l'application
- `https://www.googleapis.com/auth/drive` - Accès complet (lecture/écriture)

## Utilisation

### 1. Authentification

#### Étape 1 : Obtenir l'URL d'autorisation

```bash
GET /api/googledrive/auth/url
```

**Réponse :**
```json
{
  "success": true,
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Utilisez cette URL pour autoriser l'accès à Google Drive"
}
```

#### Étape 2 : Rediriger l'utilisateur

Redirigez l'utilisateur vers l'URL `authUrl` retournée. L'utilisateur sera invité à autoriser l'accès à son Google Drive.

#### Étape 3 : Callback automatique

Après autorisation, Google redirige vers `/api/googledrive/auth/callback?code=...`. Cette route :
- Échange le code contre des tokens
- Stocke les tokens dans la base de données
- Initialise le client Google Drive

### 2. Lister les fichiers

```bash
GET /api/googledrive/files
```

**Paramètres de requête (optionnels) :**
- `q`: Requête de recherche (ex: `name contains 'document'`)
- `pageSize`: Nombre de résultats par page (défaut: 100)
- `pageToken`: Token pour la pagination
- `orderBy`: Tri (ex: `modifiedTime desc`)

**Exemple :**
```bash
GET /api/googledrive/files?q=name contains 'rapport'&orderBy=modifiedTime desc
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        "name": "Rapport mensuel.pdf",
        "mimeType": "application/pdf",
        "size": "1024000",
        "createdTime": "2024-01-15T10:30:00.000Z",
        "modifiedTime": "2024-01-20T14:45:00.000Z",
        "webViewLink": "https://drive.google.com/file/d/...",
        "parents": ["0AC8aEs7dght6Uk9PVA"]
      }
    ],
    "nextPageToken": "...",
    "incompleteSearch": false
  }
}
```

### 3. Récupérer un fichier spécifique

```bash
GET /api/googledrive/files/{fileId}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "name": "Rapport mensuel.pdf",
    "mimeType": "application/pdf",
    "size": "1024000",
    "webViewLink": "https://drive.google.com/file/d/...",
    "webContentLink": "https://drive.google.com/uc?export=download&id=...",
    ...
  }
}
```

### 4. Télécharger un fichier

```bash
GET /api/googledrive/files/{fileId}/download
```

**Paramètres de requête (optionnels) :**
- `alt`: Format de réponse (`media` ou `json`, défaut: `media`)

Le fichier sera téléchargé avec les en-têtes appropriés (Content-Type, Content-Disposition).

### 5. Créer un fichier

```bash
POST /api/googledrive/files
Content-Type: application/json

{
  "name": "Nouveau document.txt",
  "mimeType": "text/plain",
  "parents": ["0AC8aEs7dght6Uk9PVA"],
  "description": "Description du fichier",
  "content": "Contenu du fichier"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "name": "Nouveau document.txt",
    "mimeType": "text/plain",
    "webViewLink": "https://drive.google.com/file/d/...",
    ...
  }
}
```

### 6. Mettre à jour un fichier

```bash
PATCH /api/googledrive/files/{fileId}
Content-Type: application/json

{
  "name": "Document modifié.txt",
  "description": "Nouvelle description",
  "content": "Nouveau contenu"
}
```

### 7. Supprimer un fichier

```bash
DELETE /api/googledrive/files/{fileId}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Fichier supprimé avec succès"
}
```

### 8. Créer un dossier

```bash
POST /api/googledrive/folders
Content-Type: application/json

{
  "name": "Mon nouveau dossier",
  "parents": ["0AC8aEs7dght6Uk9PVA"]
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "name": "Mon nouveau dossier",
    "mimeType": "application/vnd.google-apps.folder",
    "webViewLink": "https://drive.google.com/drive/folders/...",
    ...
  }
}
```

## Exemple d'utilisation dans le frontend

```typescript
// 1. Obtenir l'URL d'autorisation
const response = await fetch('/api/googledrive/auth/url');
const { authUrl } = await response.json();

// 2. Rediriger l'utilisateur
window.location.href = authUrl;

// 3. Après autorisation, lister les fichiers
const filesResponse = await fetch('/api/googledrive/files?q=name contains "document"');
const { data } = await filesResponse.json();
console.log(data.files);

// 4. Créer un fichier
const createResponse = await fetch('/api/googledrive/files', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mon fichier.txt',
    content: 'Contenu du fichier',
    parents: ['0AC8aEs7dght6Uk9PVA']
  })
});
const newFile = await createResponse.json();
```

## Dossier spécifique

Pour interagir avec le dossier spécifique que vous avez partagé (`0AC8aEs7dght6Uk9PVA`), vous pouvez :

1. **Lister les fichiers du dossier :**
```bash
GET /api/googledrive/files?q='0AC8aEs7dght6Uk9PVA' in parents
```

2. **Créer un fichier dans le dossier :**
```bash
POST /api/googledrive/files
{
  "name": "Mon fichier.txt",
  "parents": ["0AC8aEs7dght6Uk9PVA"],
  "content": "Contenu"
}
```

3. **Créer un sous-dossier :**
```bash
POST /api/googledrive/folders
{
  "name": "Sous-dossier",
  "parents": ["0AC8aEs7dght6Uk9PVA"]
}
```

## Gestion des erreurs

Toutes les routes retournent des erreurs au format suivant :

```json
{
  "error": "Description de l'erreur",
  "message": "Message détaillé",
  "details": "Détails techniques (en développement)"
}
```

**Codes d'erreur courants :**
- `401`: Non authentifié - Connectez-vous d'abord à Google Drive
- `400`: Requête invalide - Vérifiez les paramètres
- `403`: Accès refusé - Vérifiez les permissions OAuth
- `404`: Fichier non trouvé
- `500`: Erreur serveur
- `503`: Google Drive API non configurée

## Notes importantes

1. **Tokens OAuth** : Les tokens sont stockés dans la table `Account` de Prisma et associés à l'utilisateur connecté.

2. **Refresh Token** : Le refresh token est stocké et peut être utilisé pour renouveler automatiquement les tokens expirés (à implémenter si nécessaire).

3. **Sécurité** : Assurez-vous que les variables d'environnement ne sont jamais exposées côté client.

4. **Production** : Pour la production, mettez à jour les URLs de redirection dans Google Cloud Console avec votre domaine de production.

5. **Permissions** : L'utilisateur doit autoriser l'accès lors de la première connexion. Les tokens restent valides jusqu'à expiration ou révocation.

## Support

Pour plus d'informations, consultez :
- [Documentation Google Drive API](https://developers.google.com/drive/api)
- [Guide OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)


