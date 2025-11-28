import apiRequest from '@/lib/api-datas';
import type { Miner, ListResponse, DetailResponse, CreateUpdateResponse } from '@/types/datas';

const MINERS_ENDPOINT = '/api/datas/miners';

export const minersService = {
  // Récupérer tous les miners
  async getAll(coolingType?: string): Promise<Miner[]> {
    const endpoint = coolingType && coolingType !== 'all' 
      ? `${MINERS_ENDPOINT}?coolingType=${coolingType}`
      : MINERS_ENDPOINT;
    
    const response = await apiRequest<ListResponse<Miner>>(endpoint);
    return response.data;
  },

  // Récupérer un miner par ID
  async getById(id: number): Promise<Miner> {
    const response = await apiRequest<DetailResponse<Miner>>(`${MINERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Créer un miner
  async create(miner: Omit<Miner, 'id' | 'created_at' | 'updated_at' | 'efficiency'>): Promise<Miner> {
    const response = await apiRequest<CreateUpdateResponse<Miner>>(MINERS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(miner),
    });
    return response.data;
  },

  // Mettre à jour un miner
  async update(id: number, updates: Partial<Miner>): Promise<Miner> {
    const response = await apiRequest<CreateUpdateResponse<Miner>>(`${MINERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  // Supprimer un miner
  async delete(id: number): Promise<void> {
    await apiRequest<{ success: boolean; message: string }>(`${MINERS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  },
};

