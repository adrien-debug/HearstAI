// ===================================
// API MOCK - Mode standalone sans backend
// ===================================

// Mock data inline (no external dependency)
const MOCK_DATA = {
    projects: [
        {
            id: "proj-001",
            name: "Dashboard Analytics",
            description: "Dashboard de visualisation de données",
            type: "dashboard",
            repo_type: "local",
            local_path: "/projects/dashboard-analytics",
            stable_version_id: "ver-003",
            stable_version_label: "VERSION_03",
            last_job_status: "success",
            created_at: "2025-01-10T10:00:00Z",
            updated_at: "2025-01-20T14:30:00Z",
            status: "active",
            versions_count: 5,
            jobs_count: 12
        },
        {
            id: "proj-002",
            name: "Landing Page",
            description: "Site vitrine client",
            type: "html_static",
            repo_type: "github",
            repo_url: "https://github.com/user/landing-page",
            stable_version_id: "ver-007",
            stable_version_label: "VERSION_02",
            last_job_status: "success",
            created_at: "2025-01-15T09:00:00Z",
            updated_at: "2025-01-21T10:15:00Z",
            status: "active",
            versions_count: 3,
            jobs_count: 8
        }
    ],
    jobs: [
        {
            id: "job-001",
            project_id: "proj-001",
            type: "debug",
            status: "success",
            prompt_profile_id: "prompt-001",
            input_prompt: "Fix the responsive layout",
            output_summary: "Fixed CSS grid breakpoints",
            output_version_id: "ver-002",
            started_at: "2025-01-12T15:28:00Z",
            completed_at: "2025-01-12T15:30:15Z",
            duration_seconds: 135,
            created_at: "2025-01-12T15:28:00Z",
            project: { id: "proj-001", name: "Dashboard Analytics" }
        }
    ],
    versions: [
        {
            id: "ver-001",
            project_id: "proj-001",
            label: "VERSION_00_BASE",
            description: "Version initiale",
            parent_version_id: null,
            is_stable: false,
            file_count: 8,
            total_size_bytes: 125440,
            created_at: "2025-01-10T10:00:00Z"
        }
    ],
    prompts: [
        {
            id: "prompt-001",
            name: "Debug Standard",
            description: "Profil standard pour debug",
            type: "debugging",
            is_default: true,
            usage_count: 45
        }
    ],
    logs: [],
    stats: {
        total_projects: 2,
        total_versions: 5,
        total_jobs: 12,
        jobs_success_rate: 0.93,
        total_storage_mb: 145.2,
        last_7_days_jobs: 8
    }
};

// Simuler un délai réseau
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class APIMock {
    static async request(endpoint, options = {}) {
        await delay(200); // Simuler latence réseau
        
        const method = options.method || 'GET';
        const path = endpoint.split('?')[0];
        const params = new URLSearchParams(endpoint.split('?')[1] || '');
        
        // Projects
        if (path === '/projects' && method === 'GET') {
            let projects = [...MOCK_DATA.projects];
            
            // Filtres
            if (params.get('status')) {
                projects = projects.filter(p => p.status === params.get('status'));
            }
            if (params.get('type')) {
                projects = projects.filter(p => p.type === params.get('type'));
            }
            
            return projects;
        }
        
        if (path.startsWith('/projects/') && method === 'GET') {
            const id = path.split('/')[2];
            return MOCK_DATA.projects.find(p => p.id === id) || null;
        }
        
        if (path === '/projects' && method === 'POST') {
            const data = JSON.parse(options.body || '{}');
            const newProject = {
                id: `proj-${Date.now()}`,
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                versions_count: 0,
                jobs_count: 0,
                status: 'active'
            };
            MOCK_DATA.projects.push(newProject);
            return newProject;
        }
        
        if (path.startsWith('/projects/') && method === 'PUT') {
            const id = path.split('/')[2];
            const data = JSON.parse(options.body || '{}');
            const index = MOCK_DATA.projects.findIndex(p => p.id === id);
            if (index !== -1) {
                MOCK_DATA.projects[index] = { ...MOCK_DATA.projects[index], ...data, updated_at: new Date().toISOString() };
                return MOCK_DATA.projects[index];
            }
            return null;
        }
        
        if (path.startsWith('/projects/') && method === 'DELETE') {
            const id = path.split('/')[2];
            MOCK_DATA.projects = MOCK_DATA.projects.filter(p => p.id !== id);
            return null;
        }
        
        // Jobs
        if (path === '/jobs' && method === 'GET') {
            let jobs = [...MOCK_DATA.jobs];
            
            if (params.get('project_id')) {
                jobs = jobs.filter(j => j.project_id === params.get('project_id'));
            }
            if (params.get('status')) {
                jobs = jobs.filter(j => j.status === params.get('status'));
            }
            
            return jobs;
        }
        
        if (path.startsWith('/jobs/') && method === 'GET') {
            const id = path.split('/')[2];
            return MOCK_DATA.jobs.find(j => j.id === id) || null;
        }
        
        if (path === '/jobs' && method === 'POST') {
            const data = JSON.parse(options.body || '{}');
            const newJob = {
                id: `job-${Date.now()}`,
                ...data,
                status: 'running',
                started_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
            MOCK_DATA.jobs.push(newJob);
            
            // Simuler completion après 2 secondes
            setTimeout(() => {
                const jobIndex = MOCK_DATA.jobs.findIndex(j => j.id === newJob.id);
                if (jobIndex !== -1) {
                    MOCK_DATA.jobs[jobIndex] = {
                        ...MOCK_DATA.jobs[jobIndex],
                        status: 'success',
                        completed_at: new Date().toISOString(),
                        duration_seconds: 120
                    };
                }
            }, 2000);
            
            return newJob;
        }
        
        // Versions
        if (path.startsWith('/projects/') && path.endsWith('/versions') && method === 'GET') {
            const projectId = path.split('/')[2];
            return MOCK_DATA.versions.filter(v => v.project_id === projectId);
        }
        
        if (path.startsWith('/versions/') && method === 'GET') {
            const id = path.split('/')[2];
            return MOCK_DATA.versions.find(v => v.id === id) || null;
        }
        
        // Prompts
        if (path === '/prompts' && method === 'GET') {
            return MOCK_DATA.prompts;
        }
        
        if (path.startsWith('/prompts/') && method === 'GET') {
            const id = path.split('/')[2];
            return MOCK_DATA.prompts.find(p => p.id === id) || null;
        }
        
        // Logs
        if (path === '/logs' && method === 'GET') {
            let logs = [...MOCK_DATA.logs];
            
            if (params.get('job_id')) {
                logs = logs.filter(l => l.job_id === params.get('job_id'));
            }
            if (params.get('project_id')) {
                logs = logs.filter(l => l.project_id === params.get('project_id'));
            }
            
            return logs;
        }
        
        // Stats
        if (path === '/stats' && method === 'GET') {
            return MOCK_DATA.stats;
        }
        
        // Health
        if (path === '/health' && method === 'GET') {
            return { status: 'ok', mode: 'mock' };
        }
        
        // Diff
        if (path.includes('/diff') && method === 'GET') {
            return {
                added: [],
                modified: [],
                deleted: []
            };
        }
        
        console.warn(`[MOCK] Endpoint non géré: ${method} ${path}`);
        return null;
    }
    
    // Méthodes API identiques
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
    
    static async getStats() {
        return this.request('/stats');
    }
    
    static async health() {
        return this.request('/health');
    }
}

export default APIMock;
