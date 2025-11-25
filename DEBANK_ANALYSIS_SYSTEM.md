# 📊 Système d'Analyse DeBank - HearstAI

## ✅ Système Complet Créé

Un système complet a été créé pour analyser et afficher les données DeBank dans la plateforme.

### 🎯 Fonctionnalités

1. **Page d'analyse** (`/data-analysis`)
   - Interface pour entrer un identifiant
   - Support des adresses ERC20, noms de clients, identifiants personnalisés
   - Design cohérent avec le style Hearst

2. **Page de résultats** (`/data-analysis/[identifier]`)
   - Affichage détaillé des données DeBank
   - Métriques clés (Valeur totale, Dette, Health Factor)
   - Liste des positions avec détails
   - Informations client

3. **API Endpoint** (`/api/data-analysis/[identifier]`)
   - Récupération des données DeBank en temps réel
   - Support des adresses ERC20
   - Recherche dans la base de données pour les identifiants personnalisés

4. **Script d'analyse** (`scripts/analyze-identifier.js`)
   - Script CLI pour analyser un identifiant
   - Focus uniquement sur DeBank
   - Création/mise à jour automatique des customers

## 🚀 Utilisation

### Via l'interface web

1. Accédez à `/data-analysis`
2. Entrez un identifiant (adresse ERC20, nom de client, etc.)
3. Cliquez sur "Analyser"
4. Consultez les résultats détaillés

### Via le script CLI

```bash
# Analyser un identifiant
node scripts/analyze-identifier.js EanqSBKHd

# Analyser une adresse ERC20
node scripts/analyze-identifier.js 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### Via l'API

```bash
# GET /api/data-analysis/EanqSBKHd
curl http://localhost:6001/api/data-analysis/EanqSBKHd

# GET /api/data-analysis/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
curl http://localhost:6001/api/data-analysis/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## 📊 Données Affichées

### Métriques principales
- **Valeur Totale** : Total des actifs en USD
- **Dette Totale** : Total des dettes en USD
- **Health Factor** : Ratio de santé (collatéral/dette)
- **Nombre de Positions** : Nombre de positions actives

### Détails des positions
Pour chaque position :
- Asset (BTC, ETH, etc.)
- Protocole (Morpho, Aave, etc.)
- Chain (eth, arb, base, op)
- Valeur du collatéral
- Montant de la dette
- Health Factor

### Informations client
- Nom
- Tag
- Adresse ERC20
- Dernière mise à jour

## 🎨 Design

Le système utilise le design system Hearst :
- Couleur principale : `#C5FFA7` (Hearst Green)
- Thème sombre avec glassmorphism
- Responsive et moderne
- Cohérent avec le reste de la plateforme

## 🔧 Configuration

Assurez-vous que `DEBANK_ACCESS_KEY` est configurée dans `.env.local` :

```env
DEBANK_ACCESS_KEY=votre_cle_debank_ici
```

## 📝 Exemple d'utilisation

### Analyser "EanqSBKHd"

1. Si c'est un nom de client dans la DB :
   - Le système recherche dans la base de données
   - Si une adresse ERC20 est trouvée, récupère les données DeBank
   - Affiche les résultats

2. Si c'est une adresse ERC20 :
   - Récupération directe depuis DeBank
   - Affichage des données en temps réel

3. Si c'est un identifiant personnalisé :
   - Recherche dans la base de données
   - Si trouvé, récupération des données associées

## 🎯 Prochaines étapes possibles

- Ajouter des graphiques d'évolution temporelle
- Exporter les données en CSV/Excel
- Ajouter des alertes sur le health factor
- Historique des positions
- Comparaison entre plusieurs identifiants

## 📚 Fichiers créés/modifiés

- `app/data-analysis/page.tsx` - Page d'analyse
- `app/data-analysis/[identifier]/page.tsx` - Page de résultats
- `app/api/data-analysis/[identifier]/route.ts` - API endpoint
- `scripts/analyze-identifier.js` - Script CLI (simplifié pour DeBank uniquement)
- `GUIDE_ANALYSE_IDENTIFIANT.md` - Guide d'utilisation
- `DEBANK_ANALYSIS_SYSTEM.md` - Ce document

## ✅ Statut

✅ Système complet et fonctionnel
✅ Focus uniquement sur DeBank
✅ Interface web créée
✅ API endpoint opérationnel
✅ Script CLI disponible
✅ Documentation complète

