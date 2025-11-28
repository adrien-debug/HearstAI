import { useState, useEffect } from 'react';
import { minersService } from '@/services/minersService';
import type { Miner } from '@/types/datas';

export function useMiners(coolingType?: string) {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMiners() {
      try {
        setLoading(true);
        setError(null);
        const data = await minersService.getAll(coolingType);
        setMiners(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch miners');
      } finally {
        setLoading(false);
      }
    }

    fetchMiners();
  }, [coolingType]);

  const createMiner = async (miner: Omit<Miner, 'id' | 'created_at' | 'updated_at' | 'efficiency'>) => {
    try {
      const newMiner = await minersService.create(miner);
      setMiners(prev => [newMiner, ...prev]);
      return newMiner;
    } catch (err) {
      throw err;
    }
  };

  const updateMiner = async (id: number, updates: Partial<Miner>) => {
    try {
      const updated = await minersService.update(id, updates);
      setMiners(prev => prev.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteMiner = async (id: number) => {
    try {
      await minersService.delete(id);
      setMiners(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    miners,
    loading,
    error,
    createMiner,
    updateMiner,
    deleteMiner,
    refetch: () => {
      setLoading(true);
      minersService.getAll(coolingType)
        .then(setMiners)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    },
  };
}

