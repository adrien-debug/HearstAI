// Main Application Entry Point
import { dashboardTemplate, dashboardStyles } from './views/dashboard.js';
import { renderProjectsView, projectsStyles } from './views/projects.js';
import { renderJobsView, jobsStyles } from './views/jobs.js';
import { renderVersionsView, versionsStyles } from './views/versions.js';
import { renderPromptsView, promptsStyles } from './views/prompts.js';
import { renderLogsView, logsStyles } from './views/logs.js';
import { renderCockpitView, cockpitStyles } from './views/cockpit.js';
import { initCockpit } from './cockpit.js';
import { renderSettingsView, settingsStyles } from './views/settings.js';
import { initSettings } from './settings.js';
import { initProjections } from './projections.js';
import { renderElectricityView, electricityStyles } from './views/electricity.js';
import { initElectricity } from './electricity.js';
import { renderAdminPanelView, adminPanelStyles } from './views/admin-panel.js';
import { initAdminPanel } from './admin-panel.js';
import { renderCollateralView, collateralStyles } from './views/collateral.js';
import { initCollateral } from './collateral.js';
import API from './api.js';
import Modal from './components/modal.js';
import notify from './components/notification.js';
import CONFIG, { logEnvironment } from './config.js';
import themeManager from './theme.js';
import exportModule from './export.js';
import { Icons } from './icons.js';
import { showCreateProjectModal, showCreateJobModal } from './modals.js';

class ClaudeCockpitApp {
    constructor() {
        this.currentView = 'dashboard';
        this.contentArea = document.getElementById('content-area');
        this.pageTitle = document.getElementById('page-title');
        this.btnNewAction = document.getElementById('btn-new-action');
        
        // Check if required elements exist
        if (!this.contentArea) {
            console.error('❌ Content area element not found!');
            return;
        }
        
        console.log('✅ App constructor initialized');
        this.init();
    }
    
    async init() {
        try {
            logEnvironment();
            console.log('🚀 Claude CI/CD Cockpit initialized');
            
            // Empêcher le scroll automatique lors des changements d'ancre
            window.addEventListener('hashchange', (e) => {
                e.preventDefault();
                const hash = window.location.hash;
                if (hash) {
                    // Empêcher le scroll vers l'ancre
                    const target = document.querySelector(hash);
                    if (target) {
                        target.scrollIntoView = () => {};
                    }
                }
            }, false);
            
            // Load icons
            this.loadIcons();
            
            // Setup navigation FIRST (before backend check)
            this.setupNavigation();
            
            // Setup header button
            this.setupHeaderButton();
            
            // Load initial view immediately (don't wait for API)
            // Render dashboard immediately with empty data
            this.renderDashboard({});
            
            // Then try to load data in background
            this.loadView('dashboard').catch(error => {
                console.warn('Error loading dashboard data:', error);
                // Dashboard already rendered with empty data, so continue
            });
            
            // Check backend connection (non-blocking)
            try {
                const health = await API.health();
                console.log('✅ Backend connected:', health);
                notify.success('Backend connected successfully');
                // Update stats periodically
                this.updateStats();
                setInterval(() => this.updateStats(), 30000); // Every 30s
            } catch (error) {
                console.warn('⚠️ Backend connection failed (continuing anyway):', error);
                // Don't show error - just continue without backend
            }
        } catch (error) {
            console.error('❌ Fatal error during initialization:', error);
            // Show error but still try to render dashboard
            if (this.contentArea) {
                this.contentArea.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="text-danger">Initialization Error</h3>
                            <p class="text-secondary">${error.message}</p>
                            <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    loadIcons() {
        // Load icons for data-icon attributes
        const loadIconsFn = () => {
            document.querySelectorAll('[data-icon]').forEach(el => {
                const iconName = el.getAttribute('data-icon');
                if (Icons[iconName]) {
                    el.innerHTML = Icons[iconName];
                }
            });
        };
        
        loadIconsFn();
        
        // Store reload function for later use
        this.reloadIcons = loadIconsFn;
    }
    
    showConnectionError() {
        this.contentArea.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger mb-md"><span class="icon-inline">${Icons.error}</span> Backend Connection Failed</h3>
                    <p class="text-secondary mb-md">Cannot connect to backend server.</p>
                    <p class="text-secondary mb-md">Make sure the backend is running:</p>
                    <pre style="background: #141414; padding: 16px; border-radius: 12px; color: #C5FFA7; border: 1px solid #252525;">cd backend
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
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                // Empêcher le focus automatique qui peut causer un scroll
                item.blur();
                
                // Empêcher le scroll automatique
                const view = item.getAttribute('data-view');
                
                // Sauvegarder la position du scroll AVANT tout changement
                const sidebar = document.querySelector('.sidebar-nav');
                const sidebarScroll = sidebar ? sidebar.scrollTop : 0;
                const pageScroll = window.pageYOffset || document.documentElement.scrollTop;
                const bodyScroll = document.body.scrollTop || 0;
                
                // Bloquer temporairement le scroll pendant le changement de vue
                const originalOverflow = document.body.style.overflow;
                const originalSidebarOverflow = sidebar ? sidebar.style.overflow : '';
                
                if (sidebar) {
                    sidebar.style.overflow = 'hidden';
                }
                
                // Charger la vue
                this.loadView(view);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Restaurer immédiatement les positions de scroll (plusieurs fois pour être sûr)
                const restoreScroll = () => {
                    if (sidebar) {
                        sidebar.scrollTop = sidebarScroll;
                    }
                    window.scrollTo(0, pageScroll);
                    document.documentElement.scrollTop = pageScroll;
                    document.body.scrollTop = bodyScroll;
                };
                
                // Restaurer immédiatement
                restoreScroll();
                
                // Restaurer via requestAnimationFrame
                requestAnimationFrame(() => {
                    restoreScroll();
                    // Restaurer l'overflow après restauration du scroll
                    if (sidebar) {
                        sidebar.style.overflow = originalSidebarOverflow;
                    }
                    document.body.style.overflow = originalOverflow;
                });
                
                // Double vérification après un court délai
                setTimeout(() => {
                    restoreScroll();
                }, 10);
                
                // Triple vérification après un délai plus long
                setTimeout(() => {
                    restoreScroll();
                }, 100);
            });
        });
    }
    
    setupHeaderButton() {
        if (this.btnNewAction) {
            this.btnNewAction.addEventListener('click', () => {
                this.handleNewAction();
            });
        }
    }
    
    async loadView(viewName) {
        // Sauvegarder la position du scroll avant le changement
        const savedScroll = {
            page: window.pageYOffset || document.documentElement.scrollTop,
            body: document.body.scrollTop || 0,
            sidebar: (() => {
                const sidebar = document.querySelector('.sidebar-nav');
                return sidebar ? sidebar.scrollTop : 0;
            })()
        };
        
        this.currentView = viewName;
        this.updatePageTitle(viewName);
        this.updateHeaderButton(viewName);
        
        // Show loading state only if not already rendered
        const isAlreadyRendered = viewName === 'dashboard' && 
            this.contentArea && 
            this.contentArea.querySelector('.dashboard-view');
        
        if (!isAlreadyRendered) {
            this.contentArea.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading ${viewName}...</p>
                </div>
            `;
        }
        
        // Restaurer le scroll immédiatement après le changement de contenu
        const restoreScroll = () => {
            window.scrollTo(0, savedScroll.page);
            document.documentElement.scrollTop = savedScroll.page;
            document.body.scrollTop = savedScroll.body;
            const sidebar = document.querySelector('.sidebar-nav');
            if (sidebar) {
                sidebar.scrollTop = savedScroll.sidebar;
            }
        };
        
        restoreScroll();
        
        // Load view data and render
        try {
            // Use timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
            );
            
            const dataPromise = this.fetchViewData(viewName);
            const data = await Promise.race([dataPromise, timeoutPromise]).catch(() => {
                console.warn('Data fetch timeout or error, using empty data');
                return {};
            });
            
            await this.renderView(viewName, data);
            
            // Restaurer le scroll après le rendu (plusieurs fois pour être sûr)
            requestAnimationFrame(() => {
                restoreScroll();
            });
            
            setTimeout(() => {
                restoreScroll();
            }, 10);
            
            setTimeout(() => {
                restoreScroll();
            }, 50);
            
            // Reload icons after view render
            if (this.reloadIcons) {
                this.reloadIcons();
            }
        } catch (error) {
            console.error('Error loading view:', error);
            // Even on error, try to render with empty data
            try {
                await this.renderView(viewName, {});
            } catch (renderError) {
                console.error('Error rendering view:', renderError);
                this.contentArea.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="text-danger">Error loading ${viewName}</h3>
                            <p class="text-secondary">${error.message}</p>
                        </div>
                    </div>
                `;
            }
            restoreScroll();
        }
    }
    
    updatePageTitle(view) {
        if (!this.pageTitle) return;
        
        const titles = {
            dashboard: 'Dashboard',
            projects: 'Projestions',
            jobs: 'Jobs',
            versions: 'Versions',
            prompts: 'Prompt Profiles',
            logs: 'Activity Logs',
            cockpit: 'Cockpit',
            settings: 'Settings',
            electricity: 'Électricité',
            'admin-panel': 'Admin Panel',
            collateral: 'Collateral',
        };
        
        this.pageTitle.textContent = titles[view] || view;
        this.pageTitle.style.display = 'block';
    }
    
    updateHeaderButton(view) {
        const buttons = {
            dashboard: '+ New Project',
            projects: '+ New Project',
            jobs: '+ New Job',
            versions: '+ Import Version',
            prompts: '+ New Prompt',
            logs: `<span class="icon-inline">${Icons.refresh}</span> Refresh`,
            cockpit: `<span class="icon-inline">${Icons.refresh}</span> Refresh`,
        };
        
        // Créer le bouton s'il n'existe pas
        if (!this.btnNewAction) {
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                this.btnNewAction = document.createElement('button');
                this.btnNewAction.id = 'btn-new-action';
                this.btnNewAction.className = 'btn btn-primary';
                headerLeft.appendChild(this.btnNewAction);
                // Réattacher l'event listener
                this.setupHeaderButton();
            }
        }
        
        if (!this.btnNewAction) return;
        
        if (view === 'cockpit') {
            // Pour cockpit, on cache le bouton et on affiche la navigation
            this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Cockpit"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-projections-nav', 'has-settings-nav');
                header.classList.add('has-cockpit-nav');
            }
            this.setupCockpitHeaderNav();
        } else if (view === 'projects') {
            // Pour projects, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Projestions"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) cockpitHeaderInfo.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const collateralNav = document.getElementById('collateral-header-nav');
            if (collateralNav) collateralNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav', 'has-settings-nav', 'has-electricity-nav', 'has-admin-panel-nav', 'has-collateral-nav');
                header.classList.add('has-projections-nav');
            }
            this.setupProjectionsHeaderNav();
        } else if (view === 'settings') {
            // Pour settings, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Settings"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) cockpitHeaderInfo.remove();
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav', 'has-projections-nav', 'has-electricity-nav');
                header.classList.add('has-settings-nav');
            }
            this.setupSettingsHeaderNav();
        } else if (view === 'electricity') {
            // Pour electricity, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Électricité"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) cockpitHeaderInfo.remove();
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav', 'has-projections-nav', 'has-settings-nav', 'has-admin-panel-nav');
                header.classList.add('has-electricity-nav');
            }
            this.setupElectricityHeaderNav();
        } else if (view === 'admin-panel') {
            // Pour admin-panel, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Admin Panel"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) cockpitHeaderInfo.remove();
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const collateralNav = document.getElementById('collateral-header-nav');
            if (collateralNav) collateralNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav', 'has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-collateral-nav');
                header.classList.add('has-admin-panel-nav');
            }
            this.setupAdminPanelHeaderNav();
        } else if (view === 'collateral') {
            // Pour collateral, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Cacher le header-right (Admin)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'none';
            }
            // Afficher le header-left pour le titre "Collateral"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) cockpitHeaderInfo.remove();
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav', 'has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-admin-panel-nav');
                header.classList.add('has-collateral-nav');
            }
            this.setupCollateralHeaderNav();
        } else {
            const buttonText = buttons[view] || '+ New';
            if (buttonText) {
                this.btnNewAction.style.display = 'flex';
                this.btnNewAction.innerHTML = `<span>${buttonText}</span>`;
            } else {
                this.btnNewAction.style.display = 'none';
            }
            
            // Gérer le header-right avec Admin et Export PDF
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
                
                // Supprimer l'ancien bouton Export PDF s'il existe
                const existingExportBtn = document.getElementById('header-export-btn');
                if (existingExportBtn) {
                    existingExportBtn.remove();
                }
                
                // Ajouter le bouton Export PDF pour Projects et Jobs
                if (view === 'projects' || view === 'jobs') {
                    const exportBtn = document.createElement('button');
                    exportBtn.id = 'header-export-btn';
                    exportBtn.className = 'btn btn-sm btn-secondary';
                    exportBtn.innerHTML = `<span class="icon-inline">${Icons.document}</span> Export PDF`;
                    exportBtn.onclick = view === 'projects' ? () => {
                        if (window.exportProjects) window.exportProjects();
                    } : () => {
                        if (window.exportJobs) window.exportJobs();
                    };
                    
                    // Insérer avant le user-badge
                    const userBadge = headerRight.querySelector('.user-badge');
                    if (userBadge) {
                        headerRight.insertBefore(exportBtn, userBadge);
                    } else {
                        headerRight.appendChild(exportBtn);
                    }
                }
            }
            
            // Supprimer la navigation cockpit si elle existe
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) {
                cockpitNav.remove();
            }
            // Supprimer l'horloge et le badge LIVE
            const cockpitHeaderInfo = document.getElementById('cockpit-header-info');
            if (cockpitHeaderInfo) {
                cockpitHeaderInfo.remove();
            }
            // Supprimer la navigation settings si elle existe
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) {
                settingsNav.remove();
            }
            // Supprimer la navigation electricity si elle existe
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) {
                electricityNav.remove();
            }
            // Supprimer la navigation admin-panel si elle existe
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) {
                adminPanelNav.remove();
            }
            // Supprimer la navigation projections si elle existe
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) {
                projectionsNav.remove();
            }
            // Retirer la classe du header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-cockpit-nav');
                header.classList.remove('has-settings-nav');
                header.classList.remove('has-projections-nav');
                header.classList.remove('has-electricity-nav');
                header.classList.remove('has-admin-panel-nav');
            }
        }
    }
    
    setupCockpitHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('cockpit-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation cockpit dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-cockpit-nav');
        
        // Créer un conteneur centré pour les onglets
        const cockpitNav = document.createElement('div');
        cockpitNav.id = 'cockpit-header-nav';
        cockpitNav.className = 'cockpit-header-nav';
        cockpitNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab active" data-cockpit-section="dashboard">
                    <span class="cockpit-nav-icon">${Icons.dashboard}</span>
                    <span class="cockpit-nav-label">Dashboard</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="production">
                    <span class="cockpit-nav-icon">${Icons.production}</span>
                    <span class="cockpit-nav-label">Production</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="energy">
                    <span class="cockpit-nav-icon">${Icons.energy}</span>
                    <span class="cockpit-nav-label">Energy</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="incidents">
                    <span class="cockpit-nav-icon">${Icons.incidents}</span>
                    <span class="cockpit-nav-label">Incidents</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="clients">
                    <span class="cockpit-nav-icon">${Icons.clients}</span>
                    <span class="cockpit-nav-label">Clients</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="mining-accounts">
                    <span class="cockpit-nav-icon">${Icons.miningAccounts}</span>
                    <span class="cockpit-nav-label">Batch</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="workers">
                    <span class="cockpit-nav-icon">${Icons.workers}</span>
                    <span class="cockpit-nav-label">Activity</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="miners">
                    <span class="cockpit-nav-icon">${Icons.miners}</span>
                    <span class="cockpit-nav-label">Miners</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="reports">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Reports</span>
                </button>
                <button class="cockpit-nav-tab" data-cockpit-section="hosters">
                    <span class="cockpit-nav-icon">${Icons.hosters}</span>
                    <span class="cockpit-nav-label">Hosters</span>
                </button>
            </div>
        `;
        
        // Créer un conteneur pour l'horloge et le badge LIVE à droite
        const cockpitHeaderInfo = document.createElement('div');
        cockpitHeaderInfo.id = 'cockpit-header-info';
        cockpitHeaderInfo.className = 'cockpit-header-info';
        cockpitHeaderInfo.innerHTML = `
            <div class="header-clock" id="cockpitClock">00:00:00</div>
            <div class="live-badge">
                <span class="live-dot"></span>
                <span>LIVE</span>
            </div>
        `;
        
        // Insérer la navigation au centre du header
        header.appendChild(cockpitNav);
        
        // Insérer l'horloge et le badge LIVE à droite
        header.appendChild(cockpitHeaderInfo);
        
        // Setup event listeners
        const navTabs = cockpitNav.querySelectorAll('.cockpit-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-cockpit-section');
                if (sectionId && window.showCockpitSection) {
                    window.showCockpitSection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupProjectionsHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('projections-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation projections dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-projections-nav');
        
        // Créer un conteneur centré pour les onglets
        const projectionsNav = document.createElement('div');
        projectionsNav.id = 'projections-header-nav';
        projectionsNav.className = 'cockpit-header-nav'; // Réutiliser les styles cockpit
        projectionsNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab active" data-projection-section="overview">
                    <span class="cockpit-nav-icon">${Icons.overview}</span>
                    <span class="cockpit-nav-label">Overview</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="calculator">
                    <span class="cockpit-nav-icon">${Icons.calculator}</span>
                    <span class="cockpit-nav-label">Projections</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="results">
                    <span class="cockpit-nav-icon">${Icons.results}</span>
                    <span class="cockpit-nav-label">Results</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="charts">
                    <span class="cockpit-nav-icon">${Icons.charts}</span>
                    <span class="cockpit-nav-label">Charts</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="monte-carlo">
                    <span class="cockpit-nav-icon">${Icons.monteCarlo}</span>
                    <span class="cockpit-nav-label">Monte Carlo</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="projects">
                    <span class="cockpit-nav-icon">${Icons.projects}</span>
                    <span class="cockpit-nav-label">Projects</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="hardware">
                    <span class="cockpit-nav-icon">${Icons.hardware}</span>
                    <span class="cockpit-nav-label">Hardware</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="energy">
                    <span class="cockpit-nav-icon">${Icons.energy}</span>
                    <span class="cockpit-nav-label">Energy</span>
                </button>
                <button class="cockpit-nav-tab" data-projection-section="infrastructure">
                    <span class="cockpit-nav-icon">${Icons.infrastructure}</span>
                    <span class="cockpit-nav-label">Infrastructure</span>
                </button>
            </div>
        `;
        
        // Insérer la navigation au centre du header
        header.appendChild(projectionsNav);
        
        // Setup event listeners
        const navTabs = projectionsNav.querySelectorAll('.cockpit-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-projection-section');
                if (sectionId && window.showProjectionSection) {
                    window.showProjectionSection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupSettingsHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('settings-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation settings dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-settings-nav');
        
        // Créer un conteneur centré pour les onglets
        const settingsNav = document.createElement('div');
        settingsNav.id = 'settings-header-nav';
        settingsNav.className = 'cockpit-header-nav'; // Réutiliser les styles cockpit
        settingsNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab active" data-settings-section="versions">
                    <span class="cockpit-nav-icon">${Icons.versions}</span>
                    <span class="cockpit-nav-label">Versions</span>
                </button>
                <button class="cockpit-nav-tab" data-settings-section="prompts">
                    <span class="cockpit-nav-icon">${Icons.prompts}</span>
                    <span class="cockpit-nav-label">Prompts</span>
                </button>
                <button class="cockpit-nav-tab" data-settings-section="logs">
                    <span class="cockpit-nav-icon">${Icons.logs}</span>
                    <span class="cockpit-nav-label">Logs</span>
                </button>
            </div>
        `;
        
        // Insérer dans le header (centré)
        header.appendChild(settingsNav);
        
        // Attacher les event listeners
        const navTabs = settingsNav.querySelectorAll('.cockpit-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', async () => {
                const sectionId = tab.getAttribute('data-settings-section');
                if (sectionId && window.showSettingsSection) {
                    await window.showSettingsSection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Update page title
                    const sectionTitles = {
                        versions: 'Versions',
                        prompts: 'Prompt Profiles',
                        logs: 'Activity Logs'
                    };
                    if (this.pageTitle && sectionTitles[sectionId]) {
                        this.pageTitle.textContent = sectionTitles[sectionId];
                    }
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupElectricityHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('electricity-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation electricity dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-electricity-nav');
        
        // Créer un conteneur centré pour les onglets
        const electricityNav = document.createElement('div');
        electricityNav.id = 'electricity-header-nav';
        electricityNav.className = 'cockpit-header-nav'; // Réutiliser les styles cockpit
        electricityNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab electricity-nav-tab" data-electricity-section="home">
                    <span class="cockpit-nav-icon">${Icons.home}</span>
                    <span class="cockpit-nav-label">Home</span>
                </button>
                <button class="cockpit-nav-tab electricity-nav-tab" data-electricity-section="mining">
                    <span class="cockpit-nav-icon">${Icons.miners}</span>
                    <span class="cockpit-nav-label">Mining</span>
                </button>
                <button class="cockpit-nav-tab electricity-nav-tab active" data-electricity-section="electricity">
                    <span class="cockpit-nav-icon">${Icons.energy}</span>
                    <span class="cockpit-nav-label">Electricity</span>
                </button>
                <button class="cockpit-nav-tab electricity-nav-tab" data-electricity-section="contracts">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Contracts</span>
                </button>
                <button class="cockpit-nav-tab electricity-nav-tab" data-electricity-section="analytics">
                    <span class="cockpit-nav-icon">${Icons.charts}</span>
                    <span class="cockpit-nav-label">Analytics</span>
                </button>
            </div>
        `;
        
        // Insérer dans le header (centré)
        header.appendChild(electricityNav);
        
        // Attacher les event listeners
        const navTabs = electricityNav.querySelectorAll('.electricity-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-electricity-section');
                if (sectionId && window.showElectricitySection) {
                    window.showElectricitySection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupAdminPanelHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('admin-panel-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation admin-panel dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-admin-panel-nav');
        
        // Créer un conteneur centré pour les onglets
        const adminPanelNav = document.createElement('div');
        adminPanelNav.id = 'admin-panel-header-nav';
        adminPanelNav.className = 'cockpit-header-nav'; // Réutiliser les styles cockpit
        adminPanelNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab admin-panel-nav-tab active" data-admin-section="dashboard">
                    <span class="cockpit-nav-icon">${Icons.dashboard}</span>
                    <span class="cockpit-nav-label">Dashboard</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="structure">
                    <span class="cockpit-nav-icon">${Icons.projects}</span>
                    <span class="cockpit-nav-label">Structure</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="health">
                    <span class="cockpit-nav-icon">${Icons.incidents}</span>
                    <span class="cockpit-nav-label">Health</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="teams">
                    <span class="cockpit-nav-icon">${Icons.workers}</span>
                    <span class="cockpit-nav-label">Teams</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="actions">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Actions</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="finances">
                    <span class="cockpit-nav-icon">${Icons.charts}</span>
                    <span class="cockpit-nav-label">Finances</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="documents">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Documents</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="reports">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Reports</span>
                </button>
                <button class="cockpit-nav-tab admin-panel-nav-tab" data-admin-section="compliance">
                    <span class="cockpit-nav-icon">${Icons.incidents}</span>
                    <span class="cockpit-nav-label">Compliance</span>
                </button>
            </div>
        `;
        
        // Insérer dans le header (centré)
        header.appendChild(adminPanelNav);
        
        // Attacher les event listeners
        const navTabs = adminPanelNav.querySelectorAll('.admin-panel-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-admin-section');
                if (sectionId && window.showAdminPanelSection) {
                    window.showAdminPanelSection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupCollateralHeaderNav() {
        // Supprimer l'ancienne navigation si elle existe
        const existingNav = document.getElementById('collateral-header-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        // Créer la navigation collateral dans le header (centrée)
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter une classe au header pour le positionnement
        header.classList.add('has-collateral-nav');
        
        // Créer un conteneur centré pour les onglets
        const collateralNav = document.createElement('div');
        collateralNav.id = 'collateral-header-nav';
        collateralNav.className = 'cockpit-header-nav'; // Réutiliser les styles cockpit
        collateralNav.innerHTML = `
            <div class="cockpit-nav-tabs">
                <button class="cockpit-nav-tab collateral-nav-tab active" data-collateral-section="dashboard">
                    <span class="cockpit-nav-icon">${Icons.dashboard}</span>
                    <span class="cockpit-nav-label">Dashboard</span>
                </button>
                <button class="cockpit-nav-tab collateral-nav-tab" data-collateral-section="collateral">
                    <span class="cockpit-nav-icon">${Icons.document}</span>
                    <span class="cockpit-nav-label">Collateral</span>
                </button>
                <button class="cockpit-nav-tab collateral-nav-tab" data-collateral-section="customers">
                    <span class="cockpit-nav-icon">${Icons.workers}</span>
                    <span class="cockpit-nav-label">Customers</span>
                </button>
                <button class="cockpit-nav-tab collateral-nav-tab" data-collateral-section="api-management">
                    <span class="cockpit-nav-icon">${Icons.settings}</span>
                    <span class="cockpit-nav-label">API Management</span>
                </button>
            </div>
        `;
        
        // Insérer dans le header (centré)
        header.appendChild(collateralNav);
        
        // Attacher les event listeners
        const navTabs = collateralNav.querySelectorAll('.collateral-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-collateral-section');
                if (sectionId && window.showCollateralSection) {
                    window.showCollateralSection(sectionId);
                    
                    // Update active state
                    navTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    handleNewAction() {
        const actions = {
            dashboard: () => window.showCreateProjectModal(),
            projects: () => window.showCreateProjectModal(),
            jobs: () => window.showCreateJobModal(),
            versions: () => Modal.alert('Coming Soon', 'Import version feature coming soon!'),
            prompts: () => Modal.alert('Coming Soon', 'Create prompt feature coming soon!'),
            logs: () => this.loadView('logs'),
            cockpit: () => this.loadView('cockpit')
        };
        
        const action = actions[this.currentView];
        if (action) action();
    }
    
    async fetchViewData(view) {
        // Use REAL API calls with fallback to empty data
        const dataFetchers = {
            dashboard: async () => {
                try {
                    const [stats, projects, jobs] = await Promise.all([
                        API.getStats().catch(() => ({})),
                        API.getProjects({ status: 'active' }).catch(() => ({ projects: [] })),
                        API.getJobs({ limit: 10 }).catch(() => ({ jobs: [] }))
                    ]);
                    return { ...stats, ...projects, ...jobs };
                } catch (error) {
                    console.warn('Dashboard data fetch failed, using defaults:', error);
                    return { stats: {}, projects: [], jobs: [] };
                }
            },
            projects: async () => {
                try {
                    return await API.getProjects();
                } catch (error) {
                    return { projects: [] };
                }
            },
            jobs: async () => {
                try {
                    return await API.getJobs();
                } catch (error) {
                    return { jobs: [] };
                }
            },
            versions: async () => ({ versions: [] }),
            prompts: async () => ({ prompts: [] }),
            logs: async () => ({ logs: [] }),
            cockpit: async () => ({}),
            settings: async () => ({}),
            electricity: async () => ({}),
            'admin-panel': async () => ({}),
            collateral: async () => ({})
        };
        
        const fetcher = dataFetchers[view];
        if (fetcher) {
            try {
                return await fetcher();
            } catch (error) {
                console.warn(`Error fetching data for ${view}:`, error);
                return {};
            }
        }
        return {};
    }
    
    async renderView(view, data) {
        const renderers = {
            dashboard: () => this.renderDashboard(data),
            projects: async () => this.renderProjects(data),
            jobs: async () => this.renderJobs(data),
            versions: async () => this.renderVersions(data),
            prompts: async () => this.renderPrompts(data),
            logs: async () => this.renderLogs(data),
            cockpit: async () => this.renderCockpit(data),
            settings: async () => this.renderSettings(data),
            electricity: async () => this.renderElectricity(data),
            'admin-panel': async () => this.renderAdminPanel(data),
            collateral: async () => this.renderCollateral(data),
        };
        
        const renderer = renderers[view];
        if (renderer) await renderer();
    }
    
    renderDashboard(data) {
        try {
            if (!this.contentArea) {
                console.error('Content area not found');
                return;
            }
            
            // Check if dashboardTemplate is available
            if (typeof dashboardTemplate !== 'function') {
                console.error('dashboardTemplate is not a function:', typeof dashboardTemplate);
                this.contentArea.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="text-danger">Dashboard Template Error</h3>
                            <p class="text-secondary">dashboardTemplate is not available. Check console for details.</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            const template = dashboardTemplate(data || {});
            const styles = dashboardStyles || '';
            this.contentArea.innerHTML = styles + template;
            
            // Update header button (will create it if needed)
            this.updateHeaderButton('dashboard');
            
            // Show header title for dashboard
            if (this.pageTitle) {
                this.pageTitle.textContent = 'Transaction history';
                this.pageTitle.style.display = 'block';
            }
            if (this.btnNewAction) {
                this.btnNewAction.style.display = 'none';
            }
            
            // Reload icons after rendering
            if (this.reloadIcons) {
                setTimeout(() => {
                    this.reloadIcons();
                }, 100);
            }
            
            // Initialize See More buttons
            if (window.initSeeMoreButtons) {
                setTimeout(() => {
                    window.initSeeMoreButtons();
                }, 150);
            }
            
            // Initialize Wallet Performance Chart
            if (window.initWalletPerformanceChart) {
                setTimeout(() => {
                    window.initWalletPerformanceChart();
                }, 200);
            }
            
            // Make functions globally available for onclick handlers
            window.viewProject = (id) => console.log('View project:', id);
            window.createJob = (id) => window.showCreateJobModal(id);
            window.viewJob = (id) => console.log('View job:', id);
            
            console.log('✅ Dashboard rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering dashboard:', error);
            if (this.contentArea) {
                this.contentArea.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="text-danger">Error rendering dashboard</h3>
                            <p class="text-secondary">${error.message}</p>
                            <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    async renderProjects(data) {
        // Show header title and button for other views
        if (this.pageTitle) {
            this.pageTitle.style.display = 'block';
        }
        if (this.btnNewAction) {
            this.btnNewAction.style.display = 'flex';
        }
        
        // Rendre la vue Projects (Projestions)
        const template = await renderProjectsView(data);
        this.contentArea.innerHTML = projectsStyles + template;
        
        // Initialiser les projections après le rendu
        setTimeout(async () => {
            const { initProjections } = await import('./projections.js');
            if (initProjections) {
                initProjections();
            }
        }, 100);
    }
    
    async renderJobs() {
        const template = await renderJobsView();
        this.contentArea.innerHTML = jobsStyles + template;
        // exportJobs est déjà défini dans renderJobsView
    }
    
    async renderVersions() {
        const template = await renderVersionsView();
        this.contentArea.innerHTML = versionsStyles + template;
    }
    
    async renderPrompts() {
        const template = await renderPromptsView();
        this.contentArea.innerHTML = promptsStyles + template;
    }
    
    async renderLogs(data) {
        const template = await renderLogsView(data);
        this.contentArea.innerHTML = logsStyles + template;
        
        // Reload icons after view render
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    async renderCockpit(data) {
        const template = await renderCockpitView();
        this.contentArea.innerHTML = cockpitStyles + template;
        
        // Initialize cockpit functionality
        initCockpit();
    }
    
    async renderSettings(data) {
        const template = await renderSettingsView();
        this.contentArea.innerHTML = settingsStyles + template;
        
        // Initialize settings functionality
        initSettings();
    }
    
    async renderElectricity(data) {
        const template = await renderElectricityView();
        this.contentArea.innerHTML = electricityStyles + template;
        
        // Initialize electricity functionality
        initElectricity();
    }
    
    async renderAdminPanel(data) {
        const template = await renderAdminPanelView();
        this.contentArea.innerHTML = adminPanelStyles + template;
        
        // Initialize admin panel functionality
        initAdminPanel();
    }
    
    async renderCollateral(data) {
        const template = await renderCollateralView();
        this.contentArea.innerHTML = collateralStyles + template;
        
        // Initialize collateral functionality
        initCollateral();
    }
    
    async reloadCurrentView() {
        // Recharger la vue actuelle avec les données fraîches
        try {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Reloading view:', this.currentView);
            }
            const data = await this.fetchViewData(this.currentView);
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Data fetched:', data);
            }
            await this.renderView(this.currentView, data);
            // Recharger les icônes après le rendu
            if (this.reloadIcons) {
                this.reloadIcons();
            }
        } catch (error) {
            console.error('Error reloading view:', error);
            notify.error('Failed to reload view: ' + error.message);
        }
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
            const stats = await API.getStats();
            document.getElementById('stat-projects').textContent = stats.total_projects || '0';
            document.getElementById('stat-jobs').textContent = stats.active_jobs || '0';
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing app...');
        window.app = new ClaudeCockpitApp();
        
        // Make modal functions globally available
        if (typeof showCreateProjectModal !== 'undefined') {
            window.showCreateProjectModal = showCreateProjectModal;
        }
        if (typeof showCreateJobModal !== 'undefined') {
            window.showCreateJobModal = showCreateJobModal;
        }
        
        console.log('✅ App initialized');
    } catch (error) {
        console.error('❌ Fatal error initializing app:', error);
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h3 class="text-danger">Fatal Error</h3>
                        <p class="text-secondary">${error.message}</p>
                        <pre style="background: var(--primary-grey); padding: var(--space-4); border-radius: var(--radius-md); color: var(--text-secondary); font-size: var(--text-sm); overflow: auto;">${error.stack}</pre>
                        <button class="btn btn-primary mt-md" onclick="location.reload()">Reload Page</button>
                    </div>
                </div>
            `;
        }
    }
});
