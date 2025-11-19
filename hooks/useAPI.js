import { useState, useEffect, useCallback } from 'react';
import API from '../lib/api';

/**
 * Custom hook for API calls with loading and error states
 */
export function useAPI(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await API.request(endpoint, options);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(options)]);

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for projects
 */
export function useProjects(filters = {}) {
  return useAPI('/projects', { method: 'GET' });
}

/**
 * Hook for a single project
 */
export function useProject(id) {
  return useAPI(id ? `/projects/${id}` : null);
}

/**
 * Hook for jobs
 */
export function useJobs(filters = {}) {
  const params = new URLSearchParams(filters);
  return useAPI(`/jobs?${params}`);
}

/**
 * Hook for stats
 */
export function useStats() {
  return useAPI('/stats');
}

/**
 * Hook for logs
 */
export function useLogs(filters = {}) {
  const params = new URLSearchParams(filters);
  return useAPI(`/logs?${params}`);
}

