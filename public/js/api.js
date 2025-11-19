// API Module - Frontend to Backend Communication
// All API calls to the backend server

import CONFIG from './config.js';

const API_BASE_URL = CONFIG.API_BASE_URL;

class API {
    /**
     * Generic fetch wrapper with error handling
     */
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
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ==================== PROJECTS ====================
    
    static async getProjects(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/projects?${params}`);
    }

    static async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    static async createProject(data) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async updateProject(id, data) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== JOBS ====================
    
    static async getJobs(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/jobs?${params}`);
    }

    static async getJob(id) {
        return this.request(`/jobs/${id}`);
    }

    static async createJob(data) {
        return this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ==================== STATS ====================
    
    static async getStats() {
        return this.request('/stats');
    }

    // ==================== HEALTH ====================
    
    static async health() {
        return this.request('/health');
    }
}

export default API;
