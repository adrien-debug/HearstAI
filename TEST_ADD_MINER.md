# Test - Ajout d'un Miner

## 🧪 Guide de test pour ajouter un miner

### Étapes de test

1. **Accéder à la page**
   - URL: http://localhost:6001/datas/miner
   - Vérifier que la page se charge correctement

2. **Cliquer sur "Ajouter une Machine"**
   - Le formulaire doit s'afficher avec les sections :
     - Photo de la Machine
     - Informations principales
     - Spécifications techniques
     - Prix
     - Notes supplémentaires

3. **Remplir le formulaire**

   **Informations principales :**
   - Nom de la Machine * : `Antminer S23 Hydro`
   - Fabricant : `Bitmain`
   - Modèle : `S23 Hydro`
   - Date de Sortie : `2024-01-15`

   **Spécifications techniques :**
   - Hashrate (TH/s) * : `605`
   - Consommation (W) * : `5870`
   - Efficacité (J/TH) : Calculé automatiquement (9.70)
   - Type de Refroidissement * : `Hydro Cooling`

   **Prix :**
   - Prix (USD) * : `8500`

   **Notes :**
   - Notes supplémentaires : `Machine de test`

4. **Ajouter une photo (optionnel)**
   - Cliquer sur la zone d'upload
   - Sélectionner une image (JPG, PNG, WEBP, max 5MB)
   - Vérifier la prévisualisation
   - Possibilité de supprimer avec le bouton ×

5. **Enregistrer**
   - Cliquer sur "Enregistrer"
   - Vérifier que le miner apparaît dans le tableau
   - Vérifier que la photo s'affiche (si ajoutée)

6. **Vérifier le tableau**
   - Le miner doit apparaître avec :
     - Photo (ou icône placeholder)
     - Nom
     - Hashrate
     - Consommation
     - Efficacité
     - Type de refroidissement (badge)
     - Prix
     - Boutons Modifier/Supprimer

7. **Tester la modification**
   - Cliquer sur "Modifier"
   - Modifier un champ
   - Enregistrer
   - Vérifier que les modifications sont sauvegardées

8. **Tester la suppression**
   - Cliquer sur "Supprimer"
   - Confirmer
   - Vérifier que le miner disparaît

## ✅ Points à vérifier

- [ ] Formulaire s'affiche correctement
- [ ] Validation des champs obligatoires fonctionne
- [ ] Calcul automatique de l'efficacité (Power / Hashrate)
- [ ] Upload de photo fonctionne
- [ ] Prévisualisation de la photo
- [ ] Sauvegarde dans localStorage
- [ ] Affichage dans le tableau
- [ ] Colonnes centrées
- [ ] Photo affichée (100x100px)
- [ ] Modification fonctionne
- [ ] Suppression fonctionne
- [ ] Filtrage par type de refroidissement fonctionne

## 🔍 Vérification localStorage

Ouvrir la console du navigateur (F12) et vérifier :

```javascript
// Vérifier les données sauvegardées
JSON.parse(localStorage.getItem('miners-data'))
```

## 📝 Données de test

Exemple de miner à ajouter :

```json
{
  "name": "Antminer S23 Hydro",
  "manufacturer": "Bitmain",
  "model": "S23 Hydro",
  "releaseDate": "2024-01-15",
  "hashrate": 605,
  "power": 5870,
  "efficiency": 9.70,
  "coolingType": "hydro",
  "price": 8500,
  "notes": "Machine de test"
}
```

