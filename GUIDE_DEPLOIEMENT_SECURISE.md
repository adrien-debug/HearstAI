# 🔒 Guide de Déploiement Sécurisé - HearstAI

## 🎯 Objectif

Déployer les modifications locales vers Vercel **sans casser la base de données de production**.

---

## ✅ Vérifications Pré-Déploiement

### 1. État actuel vérifié ✅

- ✅ **Schéma Prisma** : Aucun changement détecté → **Pas de risque pour la DB**
- ✅ **Modifications** : Principalement dans les composants UI (frontend)
- ✅ **Fichiers sensibles** : Aucun fichier `.env` ou clés privées à commiter

### 2. Modifications détectées

**Fichiers modifiés :**
- `app/projects/[id]/page.tsx`
- `components/collateral/*` (plusieurs composants)
- `components/projects/*` (composants projets)
- `components/projects/Projects.css`

**Nouveaux fichiers :**
- `app/api/data-analysis/`
- `app/collateral/[id]/`
- `app/data-analysis/`
- `components/collateral/collateralUtils.ts`
- `components/projects/PhotoGallery.tsx`
- `components/projects/ProjectCard.tsx`
- `components/projects/ProjectRoadmap.tsx`
- Plusieurs scripts et documentations

---

## 🚀 Méthode de Déploiement

### Option 1 : Script Automatique (Recommandé) ⭐

```bash
./scripts/deploy-safe.sh
```

Le script va :
1. ✅ Vérifier qu'aucun fichier sensible n'est commité
2. ✅ Vérifier que le schéma Prisma n'a pas changé
3. ✅ Créer une branche de sauvegarde automatique
4. ✅ Stager les fichiers (en excluant les fichiers de build)
5. ✅ Créer un commit
6. ✅ Push vers GitHub (avec confirmation)
7. ✅ Vérifier les variables Vercel

### Option 2 : Déploiement Manuel

Si vous préférez faire manuellement :

```bash
# 1. Créer une branche de sauvegarde
git branch backup-before-deploy-$(date +%Y%m%d-%H%M%S)

# 2. Vérifier les fichiers à commiter
git status

# 3. Stager les fichiers (exclure tsconfig.tsbuildinfo)
git add app/ components/ scripts/ *.md
git reset tsconfig.tsbuildinfo

# 4. Créer le commit
git commit -m "feat: deploy updates - $(date +%Y-%m-%d)"

# 5. Push vers GitHub
git push origin main
```

---

## 🔒 Sécurité - Base de Données

### ✅ Garanties

1. **Aucun changement de schéma Prisma** → Pas de migration nécessaire
2. **Aucune commande de migration** dans le script de build
3. **Variables d'environnement Vercel** → Restent inchangées
4. **DATABASE_URL de production** → Non modifiée

### ⚠️ Ce qui NE sera PAS fait

- ❌ Aucune migration Prisma ne sera appliquée
- ❌ Aucune modification du schéma de base de données
- ❌ Aucune modification des variables d'environnement Vercel
- ❌ Aucune modification des données existantes

### ✅ Ce qui SERA fait

- ✅ Déploiement du code frontend/backend mis à jour
- ✅ Déploiement des nouveaux composants
- ✅ Déploiement des nouvelles routes API
- ✅ Déploiement des scripts et documentations

---

## 📋 Checklist de Déploiement

### Avant le déploiement

- [x] Vérifier que le schéma Prisma n'a pas changé
- [x] Vérifier qu'aucun fichier sensible n'est commité
- [x] Vérifier les modifications avec `git status`
- [ ] Créer une branche de sauvegarde (automatique avec le script)

### Pendant le déploiement

- [ ] Exécuter le script de déploiement
- [ ] Confirmer le commit
- [ ] Confirmer le push

### Après le déploiement

- [ ] Vérifier le déploiement sur Vercel Dashboard
- [ ] Vérifier que l'application se charge correctement
- [ ] Tester les nouvelles fonctionnalités
- [ ] Vérifier les logs Vercel : `vercel logs`

---

## 🔍 Vérification Post-Déploiement

### 1. Vérifier le déploiement Vercel

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs
```

### 2. Tester l'application

1. Ouvrir l'URL de production : `https://hearstai.vercel.app`
2. Vérifier qu'il n'y a pas d'erreurs dans la console
3. Tester les nouvelles fonctionnalités :
   - `/data-analysis`
   - `/collateral/[id]`
   - Composants projets mis à jour

### 3. Vérifier la base de données

```bash
# Vérifier la connexion (localement)
npm run db:health

# Vérifier que les données existent toujours
npm run db:studio
```

---

## 🆘 En cas de problème

### Le déploiement échoue

1. **Vérifier les logs Vercel** : `vercel logs`
2. **Vérifier les variables d'environnement** : `vercel env ls`
3. **Vérifier le build local** : `npm run build`

### L'application ne fonctionne pas

1. **Vérifier les logs** : `vercel logs`
2. **Vérifier la console du navigateur**
3. **Vérifier que les routes API existent**

### Rollback si nécessaire

```bash
# Revenir à la branche de sauvegarde
git checkout backup-before-deploy-XXXXXX

# Ou revenir au dernier commit stable
git reset --hard HEAD~1
git push origin main --force
```

---

## 📊 Résumé des Garanties

| Aspect | Statut | Détails |
|--------|--------|---------|
| **Base de données** | ✅ **Sécurisée** | Aucun changement de schéma |
| **Variables Vercel** | ✅ **Préservées** | Non modifiées |
| **Données existantes** | ✅ **Préservées** | Aucune migration |
| **Code déployé** | ✅ **Mis à jour** | Nouveaux composants et routes |
| **Sauvegarde** | ✅ **Créée** | Branche de backup automatique |

---

## 🎯 Commandes Rapides

```bash
# Déploiement automatique
./scripts/deploy-safe.sh

# Vérifier l'état
git status

# Voir les logs Vercel
vercel logs

# Vérifier les variables
vercel env ls

# Vérifier la santé de la DB
npm run db:health
```

---

## 📝 Notes Importantes

1. **Le schéma Prisma n'a PAS changé** → Aucun risque pour la base de données
2. **Les modifications sont principalement frontend** → Pas d'impact sur la DB
3. **Une branche de sauvegarde est créée automatiquement** → Rollback possible
4. **Les variables d'environnement Vercel ne sont pas modifiées** → Configuration préservée

---

**Date de création :** $(date +%Y-%m-%d)  
**Dernière mise à jour :** $(date +%Y-%m-%d)

