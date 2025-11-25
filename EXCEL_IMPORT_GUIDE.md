# 📥 Guide d'import de customers depuis Excel

## 🎯 Utilisation

```bash
node scripts/import-customers-from-excel.js <chemin-vers-fichier.xlsx>
```

## 📋 Format Excel attendu

Le script accepte les colonnes suivantes (insensible à la casse et aux espaces) :

### Colonnes requises
- **name** / **nom** / **customer** / **client** : Nom du customer (requis)
- **erc20Address** / **erc20** / **address** / **wallet** / **adresse** : Adresse ERC20 (requis, format: `0x...` avec 40 caractères hex)

### Colonnes optionnelles
- **tag** / **type** / **category** : Tag du customer (défaut: "Client")
- **chains** / **chain** / **blockchain** / **réseau** : Chaînes séparées par virgules (défaut: "eth")
  - Exemples: `eth`, `eth,arb,base`, `eth,arb`
- **protocols** / **protocol** / **protocole** : Protocoles séparés par virgules (défaut: vide)
  - Exemples: `morpho`, `morpho,aave`, `morpho,aave,compound`
- **email** / **e-mail** / **mail** : Email du customer (optionnel)
- **btcWallet** / **btc** / **bitcoin address** / **adresse btc** : Adresse Bitcoin (optionnel)

## 📝 Exemple de fichier Excel

| name | erc20Address | tag | chains | protocols | email |
|------|--------------|-----|--------|-----------|-------|
| Client Principal | 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 | VIP | eth,arb | morpho,aave | client1@example.com |
| Client Secondaire | 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb | Client | eth | morpho | client2@example.com |

## ✨ Fonctionnalités

- ✅ **Détection automatique des colonnes** : Le script reconnaît les colonnes même avec des noms différents
- ✅ **Validation des adresses ERC20** : Vérifie le format avant l'import
- ✅ **Récupération DeBank automatique** : Les données DeBank sont récupérées pour chaque customer créé
- ✅ **Gestion des doublons** : Les customers existants sont ignorés (pas d'erreur)
- ✅ **Rapport détaillé** : Affiche le résultat de chaque import

## 🔄 Processus d'import

1. **Lecture du fichier Excel** : Parse la première feuille
2. **Normalisation des données** : Convertit les colonnes en format attendu
3. **Validation** : Vérifie que les données sont valides
4. **Création via API** : Crée chaque customer via `/api/customers`
5. **Récupération DeBank** : Les données DeBank sont automatiquement récupérées
6. **Rapport** : Affiche un résumé des succès/échecs

## 📊 Exemple de sortie

```
╔════════════════════════════════════════════════════════════════════╗
║  📥 IMPORT CUSTOMERS DEPUIS EXCEL - HEARST AI                    ║
╚════════════════════════════════════════════════════════════════════╝

📖 Lecture du fichier: customers.xlsx
✅ 2 ligne(s) trouvée(s) dans "Sheet1"

📊 Traitement de 2 customer(s)...

1/2 - Traitement...
   Nom: Client Principal
   ERC20: 0xd8dA6BF26...
   Tag: VIP
   Chains: eth,arb
   ✅ Customer créé avec succès
   📊 Total Value: $7973.25
   📊 Health Factor: 999

2/2 - Traitement...
   Nom: Client Secondaire
   ERC20: 0x742d35Cc6...
   Tag: Client
   Chains: eth
   ✅ Customer créé avec succès
   📊 Total Value: $0
   📊 Health Factor: 0

======================================================================
📊 RAPPORT FINAL
======================================================================

✅ Succès: 2/2

🎉 Import terminé avec succès !
```

## ⚠️ Notes importantes

- Le fichier Excel doit être au format `.xlsx`
- La première feuille sera utilisée
- Les colonnes peuvent être dans n'importe quel ordre
- Les noms de colonnes sont insensibles à la casse et aux espaces
- Les adresses ERC20 doivent être valides (format: `0x` + 40 caractères hex)
- Les données DeBank sont récupérées automatiquement pour chaque customer

## 🚀 Prêt à utiliser

Placez votre fichier Excel dans le projet et exécutez :

```bash
node scripts/import-customers-from-excel.js chemin/vers/votre/fichier.xlsx
```



