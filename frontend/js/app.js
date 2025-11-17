// Main Application Entry Point
import { dashboardTemplate, dashboardStyles } from './views/dashboard.js';
import { renderProjectsView, projectsStyles } from './views/projects.js';
import { renderJobsView, jobsStyles } from './views/jobs.js';
import { renderVersionsView, versionsStyles } from './views/versions.js';
import { renderPromptsView, promptsStyles } from './views/prompts.js';
import { renderLogsView, logsStyles } from './views/logs.js';
import API from './api.js';
import Modal from './components/modal.js';
import notify from './components/notification.js';
import CONFIG, { logEnvironment } from './config.js';
import themeManager from './theme.js';
import exportModule from './export.js';
import { showCreateProjectModal, showCreateJobModal } from './modals.js';

class ClaudeCockpitApp {
    constructor() {
        this.currentView = 'dashboard';
        this.contentArea = document.getElementById('content-area');
        this.pageTitle = document.getElementById('page-title');
        this.btnNewAction = document.getElementById('btn-new-action');
        
        this.init();
    }
    
    async init() {
        logEnvironment();
        console.log('🚀 Claude CI/CD Cockpit initialized');
        
        // Check backend connection
        try {
            const health = await API.health();
            console.log('✅ Backend connected:', health);
            notify.success('Backend connected successfully');
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            notify.error('Backend connection failed');
            this.showConnectionError();
            return;
        }
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup header button
        this.setupHeaderButton();
        
        // Load initial view
        this.loadView('dashboard');
        
        // Update stats periodically
        this.updateStats();
        setInterval(() => this.updateStats(), 30000); // Every 30s
    }
    
    showConnectionError() {
        this.contentArea.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger mb-md">❌ Backend Connection Failed</h3>
                    <p class="text-secondary mb-md">Cannot connect to backend server.</p>
                    <p class="text-secondary mb-md">Make sure the backend is running:</p>
                    <pre style="background: var(--bg-tertiary); padding: 16px; border-radius: 6px; color: var(--accent-primary);">cd backend
npm install
node server.js</pre>
                    <button class="btn btn-primary mt-md" onclick="location.reload()">Retry Connection</button>
                </div>
            </div>
        `;
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.loadView(view);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    setupHeaderButton() {
        this.btnNewAction.addEventListener('click', () => {
            this.handleNewAction();
        });
    }
    
    async loadView(viewName) {
        this.currentView = viewName;
        this.updatePageTitle(viewName);
        this.updateHeaderButton(viewName);
        
        // Show loading state
        this.contentArea.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading ${viewName}...</p>
            </div>
        `;
        
        // Load view data and render
        try {
            const data = await this.fetchViewData(viewName);
            this.renderView(viewName, data);
        } catch (error) {
            console.error('Error loading view:', error);
            this.contentArea.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h3 class="text-danger">Error loading ${viewName}</h3>
                        <p class="text-secondary">${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
    
    updatePageTitle(view) {
        const titles = {
            dashboard: 'Dashboard',
            projects: 'Projects',
            jobs: 'Jobs',
            versions: 'Versions',
            prompts: 'Prompt Profiles',
            logs: 'Activity Logs'
        };
        
        this.pageTitle.textContent = titles[view] || view;
    }
    
    updateHeaderButton(view) {
        const buttons = {
            dashboard: '+ New Project',
            projects: '+ New Project',
            jobs: '+ New Job',
            versions: '+ Import Version',
            prompts: '+ New Prompt',
            logs: '🔄 Refresh'
        };
        
        this.btnNewAction.innerHTML = `<span>${buttons[view] || '+ New'}</span>`;
    }
    
    handleNewAction() {
        const actions = {
            dashboard: () => window.showCreateProjectModal(),
            projects: () => window.showCreateProjectModal(),
            jobs: () => window.showCreateJobModal(),
            versions: () => Modal.alert('Coming Soon', 'Import version feature coming soon!'),
            prompts: () => Modal.alert('Coming Soon', 'Create prompt feature coming soon!'),
            logs: () => this.loadView('logs')
        };
        
        const action = actions[this.currentView];
        if (action) action();
    }
    
    async fetchViewData(view) {
        // Use REAL API calls
        const dataFetchers = {
            dashboard: async () => {
                const [stats, projects, jobs] = await Promise.all([
                    API.getStats(),
                    API.getProjects({ status: 'active' }),
                    API.getJobs({ limit: 10 })
                ]);
                return { ...stats, ...projects, ...jobs };
            },
            projects: async () => API.getProjects(),
            jobs: async () => API.getJobs(),
            versions: async () => ({ versions: [] }),
            prompts: async () => ({ prompts: [] }),
            logs: async () => ({ logs: [] })
        };
        
        const fetcher = dataFetchers[view];
        return fetcher ? await fetcher() : {};
    }
    
    async renderView(view, data) {
        const renderers = {
            dashboard: () => this.renderDashboard(data),
            projects: async () => this.renderProjects(),
            jobs: async () => this.renderJobs(),
            versions: async () => this.renderVersions(),
            prompts: async () => this.renderPrompts(),
            logs: async () => this.renderLogs()
        };
        
        const renderer = renderers[view];
        if (renderer) await renderer();
    }
    
    renderDashboard(data) {
        const template = dashboardTemplate(data);
        this.contentArea.innerHTML = dashboardStyles + template;
        
        // Make functions globally available for onclick handlers
        window.viewProject = (id) => console.log('View project:', id);
        window.createJob = (id) => window.showCreateJobModal(id);
        window.viewJob = (id) => console.log('View job:', id);
    }
    
    async renderProjects() {
        const template = await renderProjectsView();
        this.contentArea.innerHTML = projectsStyles + template;
    }
    
    async renderJobs() {
        const template = await renderJobsView();
        this.contentArea.innerHTML = jobsStyles + template;
    }
    
    async renderVersions() {
        const template = await renderVersionsView();
        this.contentArea.innerHTML = versionsStyles + template;
    }
    
    async renderPrompts() {
        const template = await renderPromptsView();
        this.contentArea.innerHTML = promptsStyles + template;
    }
    
    async renderLogs() {
        const template = await renderLogsView();
        this.contentArea.innerHTML = logsStyles + template;
    }
    
    renderPlaceholder(message) {
        this.contentArea.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-primary mb-md">${message}</h3>
                    <p class="text-secondary">This view will be implemented soon.</p>
                </div>
            </div>
        `;
    }
    
    async updateStats() {
        try {
            const { stats } = await API.getStats();
            document.getElementById('stat-projects').textContent = stats.total_projects || '-';
            document.getElementById('stat-jobs').textContent = stats.jobs_running || '-';
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ClaudeCockpitApp();
});
