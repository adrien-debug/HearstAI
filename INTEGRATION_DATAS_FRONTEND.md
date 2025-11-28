# ✅ Intégration Frontend - Endpoints Data (Miners & Hosters)

## 📦 Structure créée

Tous les fichiers nécessaires ont été créés selon les instructions :

### ✅ Fichiers créés

1. **`lib/api-datas.ts`** - Client API pour les endpoints Data
2. **`types/datas.ts`** - Types TypeScript pour Miners et Hosters
3. **`services/minersService.ts`** - Service pour les opérations CRUD sur les miners
4. **`services/hostersService.ts`** - Service pour les opérations CRUD sur les hosters
5. **`hooks/useMiners.ts`** - Hook React pour gérer les miners
6. **`hooks/useHosters.ts`** - Hook React pour gérer les hosters

## 🚀 Utilisation

### Exemple avec le hook useMiners

```typescript
'use client';

import { useMiners } from '@/hooks/useMiners';

export default function MinersPage() {
  const { miners, loading, error, createMiner, updateMiner, deleteMiner } = useMiners();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      {miners.map(miner => (
        <div key={miner.id}>
          <h3>{miner.name}</h3>
          <p>Hashrate: {miner.hashrate} TH/s</p>
          <p>Prix: ${miner.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemple avec le service directement

```typescript
import { minersService } from '@/services/minersService';

// Récupérer tous les miners
const miners = await minersService.getAll();

// Créer un miner
const newMiner = await minersService.create({
  name: 'Antminer S23',
  hashrate: 605,
  power: 5870,
  price: 8500,
  cooling_type: 'hydro',
});
```

## 🔄 Migration de la page existante

La page `app/datas/miner/page.tsx` a déjà été modifiée pour utiliser l'API Railway directement. 

**Option 1 :** Continuer avec l'implémentation actuelle (fetch direct)
**Option 2 :** Migrer vers les nouveaux hooks/services (recommandé)

### Pour migrer vers les hooks :

```typescript
// Remplacer le useEffect actuel par :
const { miners, loading, error, createMiner, updateMiner, deleteMiner, refetch } = useMiners(
  activeCoolingType === 'all' ? undefined : activeCoolingType
);

// Dans handleSave :
if (isAdding) {
  await createMiner({
    name: formData.name!,
    hashrate: formData.hashrate!,
    power: formData.power!,
    price: formData.price!,
    cooling_type: formData.coolingType!,
    manufacturer: formData.manufacturer,
    model: formData.model,
    release_date: formData.releaseDate,
    photo: photoData,
    notes: formData.notes,
  });
}

// Dans handleDelete :
await deleteMiner(parseInt(id));
```

## 📝 Notes importantes

1. **IDs** : Les IDs sont des nombres (integers) depuis PostgreSQL, pas des strings
2. **Format des données** : L'API retourne `cooling_type` (snake_case), le frontend peut utiliser `coolingType` (camelCase) avec conversion
3. **Efficacité** : Calculée automatiquement par le backend (power / hashrate)

## ✅ Checklist

- [x] Fichier de configuration API créé
- [x] Services créés (minersService, hostersService)
- [x] Hooks React créés (useMiners, useHosters)
- [x] Types TypeScript définis
- [ ] Migrer la page miner vers les nouveaux hooks (optionnel)
- [ ] Migrer la page hoster vers les nouveaux hooks (optionnel)
- [x] Configuration Railway vérifiée

## 🧪 Test

```bash
# Test direct de l'API
curl https://hearstaibackend-production.up.railway.app/api/datas/miners
```

## 📚 Documentation complète

Voir le document original fourni pour tous les détails d'implémentation.

