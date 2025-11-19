# 📦 Archive des Fichiers de Configuration

## 📋 Contenu de l'archive

Cette archive contient tous les fichiers de configuration récents du projet HearstAI :

### Fichiers principaux
- ✅ `package.json` - Configuration npm avec dépendances et scripts
- ✅ `vercel.json` - Configuration de déploiement Vercel
- ✅ `next.config.js` - Configuration Next.js
- ✅ `server.js` - Serveur Express backend

### Routes API
- ✅ `routes/diff.js` - Route pour les différences
- ✅ `routes/jobs.js` - Route pour les jobs
- ✅ `routes/logs.js` - Route pour les logs
- ✅ `routes/projects.js` - Route pour les projets
- ✅ `routes/prompts.js` - Route pour les prompts
- ✅ `routes/stats.js` - Route pour les statistiques
- ✅ `routes/versions.js` - Route pour les versions

## 📅 Date de création
19 Novembre 2025

## 🔧 Utilisation

### Extraire l'archive
```bash
tar -xzf config_files_YYYYMMDD_HHMMSS.tar.gz
```

### Restaurer les fichiers
```bash
cp config_files_*/package.json .
cp config_files_*/vercel.json .
cp config_files_*/next.config.js .
cp config_files_*/server.js backend/
cp config_files_*/routes/*.js backend/routes/
```

## 📝 Notes

- Les fichiers `node_modules` ne sont pas inclus
- Les fichiers de backup ne sont pas inclus
- Seuls les fichiers de configuration sont inclus

