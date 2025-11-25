# 🔧 Dépannage CSR Fireblocks

## ❌ Problème: Fireblocks n'accepte pas le fichier CSR

### Solutions à essayer:

## 1️⃣ Vérifier le Format du Fichier

Le CSR doit être au format **PEM** avec ces en-têtes exacts:
```
-----BEGIN CERTIFICATE REQUEST-----
[contenu base64]
-----END CERTIFICATE REQUEST-----
```

**Vérification:**
```bash
head -1 fireblocks-csr.pem
# Doit afficher: -----BEGIN CERTIFICATE REQUEST-----

tail -1 fireblocks-csr.pem
# Doit afficher: -----END CERTIFICATE REQUEST-----
```

## 2️⃣ Copier-Coller le Contenu au Lieu d'Uploader

Certaines interfaces Fireblocks acceptent mieux le contenu collé que l'upload de fichier:

1. **Ouvrez le fichier CSR:**
   ```bash
   cat fireblocks-csr.pem
   ```

2. **Copiez TOUT le contenu** (y compris les lignes BEGIN et END)

3. **Dans Fireblocks**, au lieu d'uploader, **collez le contenu** dans le champ texte

## 3️⃣ Vérifier l'Extension du Fichier

- ✅ Le fichier doit s'appeler `fireblocks-csr.pem`
- ❌ Pas `.txt`, pas `.csr` seul
- ✅ Extension `.pem` obligatoire

## 4️⃣ Vérifier que le Fichier n'est pas Vide

```bash
wc -l fireblocks-csr.pem
# Doit afficher au moins 5-10 lignes
```

## 5️⃣ Régénérer le CSR avec un Format Différent

Si Fireblocks demande un format spécifique, essayez:

### Option A: CSR sans Email
```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout fireblocks-private-key.pem \
  -out fireblocks-csr.pem \
  -subj "/C=FR/ST=Paris/L=Paris/O=Beyond Labs/OU=HearstAI/CN=hearstai-api"
```

### Option B: CSR avec Configuration Interactive
```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout fireblocks-private-key.pem \
  -out fireblocks-csr.pem
```
Puis répondez aux questions (sans email si possible)

## 6️⃣ Vérifier les Exigences Fireblocks

Fireblocks peut avoir des exigences spécifiques:
- ✅ Taille de clé: 2048 bits (déjà fait)
- ✅ Format: PEM (déjà fait)
- ⚠️ Peut-être besoin d'un email dans le CSR
- ⚠️ Peut-être besoin d'un format de CN spécifique

## 7️⃣ Essayer avec Email dans le CSR

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout fireblocks-private-key.pem \
  -out fireblocks-csr.pem \
  -subj "/C=FR/ST=Paris/L=Paris/O=Beyond Labs/OU=HearstAI/CN=hearstai-api/emailAddress=api@beyondlabs.io"
```

## 8️⃣ Vérifier le Contenu du CSR

```bash
openssl req -in fireblocks-csr.pem -text -noout
```

Vérifiez que:
- ✅ Subject contient les bonnes informations
- ✅ Public Key Algorithm est RSA
- ✅ Key Size est 2048 bits

## 9️⃣ Alternative: Utiliser l'Interface Web Fireblocks

Parfois, Fireblocks permet de:
1. Générer le CSR directement dans leur interface
2. Télécharger la clé privée correspondante
3. Utiliser cette clé privée avec votre API Key

## 🔟 Contacter le Support Fireblocks

Si rien ne fonctionne:
1. Vérifiez la documentation Fireblocks pour les exigences exactes
2. Contactez le support Fireblocks avec:
   - Le message d'erreur exact
   - Le format de CSR que vous utilisez
   - Les informations de votre compte

## 📋 Checklist de Vérification

- [ ] Le fichier s'appelle `fireblocks-csr.pem`
- [ ] Le fichier commence par `-----BEGIN CERTIFICATE REQUEST-----`
- [ ] Le fichier se termine par `-----END CERTIFICATE REQUEST-----`
- [ ] Le fichier n'est pas vide (au moins 5 lignes)
- [ ] Le CSR est valide (testé avec `openssl req -in fireblocks-csr.pem -text -noout`)
- [ ] La clé privée correspond au CSR
- [ ] Vous essayez d'uploader le fichier (pas juste le nom)
- [ ] Vous avez essayé de copier-coller le contenu

## 💡 Astuce: Afficher le Contenu Complet

Pour copier-coller facilement dans Fireblocks:

```bash
cat fireblocks-csr.pem
```

Copiez TOUT le contenu affiché (y compris BEGIN et END) et collez-le dans Fireblocks.



