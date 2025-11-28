# Mise à jour de setup.sh

## 🔄 Comment ça fonctionne

Le script `setup.sh` est maintenu à jour manuellement par l'IA lors des modifications importantes du projet.

## 📋 Quand setup.sh est mis à jour

L'IA met à jour `setup.sh` automatiquement quand :

1. **Nouvelles dépendances** ajoutées dans `package.json`
2. **Changements dans Prisma** (nouveaux models, migrations)
3. **Nouvelles variables d'environnement** nécessaires
4. **Changements dans la structure** du projet
5. **Nouveaux scripts** ou outils ajoutés

## 🔧 Mise à jour manuelle

Si tu fais des changements et que `setup.sh` n'est pas à jour :

1. **Demande à l'IA** : "Mets à jour setup.sh avec les nouveaux changements"
2. **Ou décris les changements** : "J'ai ajouté une nouvelle API, mets à jour setup.sh"

## ✅ Vérification

Pour vérifier que setup.sh est à jour :

```bash
./.setup-maintainer.sh
```

## 📝 Contenu de setup.sh

Le script `setup.sh` inclut :

- ✅ Vérification de Node.js
- ✅ Installation/mise à jour des dépendances
- ✅ Configuration de .env.local
- ✅ Génération Prisma Client
- ✅ Synchronisation de la base de données
- ✅ Libération des ports
- ✅ Vérification de la configuration API

## 🚀 Utilisation

```bash
# Mettre à jour la configuration
./setup.sh

# Réinitialiser complètement
./reset.sh
```





