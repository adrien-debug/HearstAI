# API Endpoints - Section Data (Miners & Hosters)

## 📡 Endpoints disponibles

### Miners API

#### GET `/api/datas/miners`
Liste tous les miners

**Query parameters:**
- `coolingType` (optionnel) : Filtrer par type (`hydro`, `air`, `immersion`, `all`)

**Exemple:**
```bash
curl http://localhost:6001/api/datas/miners
curl http://localhost:6001/api/datas/miners?coolingType=hydro
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "miner-1764328797420",
      "name": "Antminer S23 Hydro",
      "hashrate": 605,
      "power": 5870,
      "efficiency": 9.70,
      "price": 8500,
      "coolingType": "hydro",
      "manufacturer": "Bitmain",
      "model": "S23 Hydro",
      "releaseDate": "2024-01-15",
      "photo": null,
      "notes": "",
      "createdAt": "2025-11-28T11:19:57.420Z"
    }
  ],
  "total": 1
}
```

#### POST `/api/datas/miners`
Crée un nouveau miner

**Body (JSON):**
```json
{
  "name": "Antminer S23 Hydro",
  "hashrate": 605,
  "power": 5870,
  "price": 8500,
  "coolingType": "hydro",
  "manufacturer": "Bitmain",
  "model": "S23 Hydro",
  "releaseDate": "2024-01-15",
  "photo": "data:image/jpeg;base64,...",
  "notes": "Notes optionnelles"
}
```

**Champs obligatoires:** `name`, `hashrate`, `power`, `price`, `coolingType`

**Exemple:**
```bash
curl -X POST http://localhost:6001/api/datas/miners \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Antminer S23 Hydro",
    "hashrate": 605,
    "power": 5870,
    "price": 8500,
    "coolingType": "hydro"
  }'
```

#### GET `/api/datas/miners/[id]`
Récupère un miner par ID

#### PUT `/api/datas/miners/[id]`
Met à jour un miner

**Body (JSON):** Champs à mettre à jour

#### DELETE `/api/datas/miners/[id]`
Supprime un miner

---

### Hosters API

#### GET `/api/datas/hosters`
Liste tous les hosters

**Query parameters:**
- `country` (optionnel) : Filtrer par pays

**Exemple:**
```bash
curl http://localhost:6001/api/datas/hosters
curl http://localhost:6001/api/datas/hosters?country=États-Unis
```

#### POST `/api/datas/hosters`
Crée un nouveau hoster

**Body (JSON):**
```json
{
  "name": "Bitmain Hosting",
  "country": "États-Unis",
  "location": "Texas, USA",
  "electricityPrice": 0.05,
  "additionalFees": 50,
  "deposit": 3,
  "photo": "data:image/jpeg;base64,...",
  "notes": "Notes optionnelles"
}
```

**Champs obligatoires:** `name`, `country`, `location`, `electricityPrice`, `additionalFees`, `deposit`

#### GET `/api/datas/hosters/[id]`
Récupère un hoster par ID

#### PUT `/api/datas/hosters/[id]`
Met à jour un hoster

#### DELETE `/api/datas/hosters/[id]`
Supprime un hoster

---

## 🧪 Tests

### Test complet Miners

```bash
# 1. Créer
MINER_ID=$(curl -s -X POST http://localhost:6001/api/datas/miners \
  -H "Content-Type: application/json" \
  -d '{"name":"Antminer S23","hashrate":605,"power":5870,"price":8500,"coolingType":"hydro"}' \
  | jq -r '.data.id')

# 2. Récupérer
curl http://localhost:6001/api/datas/miners/$MINER_ID

# 3. Modifier
curl -X PUT http://localhost:6001/api/datas/miners/$MINER_ID \
  -H "Content-Type: application/json" \
  -d '{"price":8200}'

# 4. Lister
curl http://localhost:6001/api/datas/miners

# 5. Supprimer
curl -X DELETE http://localhost:6001/api/datas/miners/$MINER_ID
```

### Test complet Hosters

```bash
# 1. Créer
HOSTER_ID=$(curl -s -X POST http://localhost:6001/api/datas/hosters \
  -H "Content-Type: application/json" \
  -d '{"name":"Bitmain Hosting","country":"États-Unis","location":"Texas","electricityPrice":0.05,"additionalFees":50,"deposit":3}' \
  | jq -r '.data.id')

# 2. Récupérer
curl http://localhost:6001/api/datas/hosters/$HOSTER_ID

# 3. Modifier
curl -X PUT http://localhost:6001/api/datas/hosters/$HOSTER_ID \
  -H "Content-Type: application/json" \
  -d '{"electricityPrice":0.06}'

# 4. Lister
curl http://localhost:6001/api/datas/hosters

# 5. Supprimer
curl -X DELETE http://localhost:6001/api/datas/hosters/$HOSTER_ID
```

## 📝 Notes

- **Stockage actuel:** En mémoire (perdu au redémarrage)
- **Production:** À remplacer par Prisma/PostgreSQL
- **Photo:** Format base64 (data:image/jpeg;base64,...)
- **Efficacité:** Calculée automatiquement si non fournie (power / hashrate)

## 🔄 Migration vers Prisma

Pour une persistance réelle, remplacer `lib/datas-storage.ts` par des appels Prisma :

```typescript
import { prisma } from '@/lib/db'

// Au lieu de minersStorage.create()
const newMiner = await prisma.miner.create({
  data: { ... }
})
```

