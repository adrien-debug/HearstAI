import { useState, useEffect } from 'react';
import { hostersService } from '@/services/hostersService';
import type { Hoster } from '@/types/datas';

export function useHosters(country?: string) {
  const [hosters, setHosters] = useState<Hoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHosters() {
      try {
        setLoading(true);
        setError(null);
        const data = await hostersService.getAll(country);
        setHosters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hosters');
      } finally {
        setLoading(false);
      }
    }

    fetchHosters();
  }, [country]);

  const createHoster = async (hoster: Omit<Hoster, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newHoster = await hostersService.create(hoster);
      setHosters(prev => [newHoster, ...prev]);
      return newHoster;
    } catch (err) {
      throw err;
    }
  };

  const updateHoster = async (id: number, updates: Partial<Hoster>) => {
    try {
      const updated = await hostersService.update(id, updates);
      setHosters(prev => prev.map(h => h.id === id ? updated : h));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteHoster = async (id: number) => {
    try {
      await hostersService.delete(id);
      setHosters(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    hosters,
    loading,
    error,
    createHoster,
    updateHoster,
    deleteHoster,
    refetch: () => {
      setLoading(true);
      hostersService.getAll(country)
        .then(setHosters)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    },
  };
}

