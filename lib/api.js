// API Module for React components
// Wrapper around the existing API from frontend/js/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class API {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  static async getJobs(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/jobs?${params}`);
  }

  static async getJob(id) {
    return this.request(`/jobs/${id}`);
  }

  static async getProjects(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/projects?${params}`);
  }

  static async getStats() {
    return this.request('/stats');
  }
}

export default API;
