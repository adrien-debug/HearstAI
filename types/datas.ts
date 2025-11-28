// Types pour les endpoints Data (Miners & Hosters)

export interface Miner {
  id: number;
  name: string;
  hashrate: number; // TH/s
  power: number; // W
  efficiency: number; // W/TH
  price: number; // USD
  cooling_type: 'hydro' | 'air' | 'immersion';
  manufacturer?: string;
  model?: string;
  release_date?: string; // ISO date string
  photo?: string;
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

export interface Hoster {
  id: number;
  name: string;
  country: string;
  location: string;
  electricity_price: number; // USD/kWh
  additional_fees: number; // USD/month
  deposit: number; // USD
  photo?: string;
  notes?: string;
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

// Réponses API
export interface ListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
}

export interface DetailResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateUpdateResponse<T> {
  success: boolean;
  data: T;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

