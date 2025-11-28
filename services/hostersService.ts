import apiRequest from '@/lib/api-datas';
import type { Hoster, ListResponse, DetailResponse, CreateUpdateResponse } from '@/types/datas';

const HOSTERS_ENDPOINT = '/api/datas/hosters';

export const hostersService = {
  // Récupérer tous les hosters
  async getAll(country?: string): Promise<Hoster[]> {
    const endpoint = country && country !== 'all' 
      ? `${HOSTERS_ENDPOINT}?country=${encodeURIComponent(country)}`
      : HOSTERS_ENDPOINT;
    
    const response = await apiRequest<ListResponse<Hoster>>(endpoint);
    return response.data;
  },

  // Récupérer un hoster par ID
  async getById(id: number): Promise<Hoster> {
    const response = await apiRequest<DetailResponse<Hoster>>(`${HOSTERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Créer un hoster
  async create(hoster: Omit<Hoster, 'id' | 'created_at' | 'updated_at'>): Promise<Hoster> {
    const response = await apiRequest<CreateUpdateResponse<Hoster>>(HOSTERS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(hoster),
    });
    return response.data;
  },

  // Mettre à jour un hoster
  async update(id: number, updates: Partial<Hoster>): Promise<Hoster> {
    const response = await apiRequest<CreateUpdateResponse<Hoster>>(`${HOSTERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  },

  // Supprimer un hoster
  async delete(id: number): Promise<void> {
    await apiRequest<{ success: boolean; message: string }>(`${HOSTERS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  },
};

