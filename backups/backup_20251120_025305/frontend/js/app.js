// Main Application Entry Point
import { renderDashboard as renderDashboardView } from './views/dashboard.js';
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
import { renderElectricityView } from './views/electricity.js'; // Styles moved to global CSS
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

// ========================================
// GLOBAL FONT STYLES APPLICATION
// ========================================
// Apply global font styles to all content areas
export function applyGlobalFontStyles() {
    // Get the global font family from CSS variables
    const globalFontFamily = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-primary')
        .trim() || "'FK Grotesk Trial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif";
    
    // Get mono font for code elements
    const monoFontFamily = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-mono')
        .trim() || "'Fira Code', 'Consolas', 'Monaco', monospace";
    
    // Apply to content area and all its children
    const contentArea = document.getElementById('content-area') || 
                       document.querySelector('.content-area-wrapper') ||
                       document.querySelector('main');
    if (!contentArea) return;
    
    // Apply font to content area itself
    contentArea.style.setProperty('font-family', globalFontFamily, 'important');
    
    // Apply font family to all text elements in the content area
    const textElements = contentArea.querySelectorAll('*');
    textElements.forEach(element => {
        // Skip script, style, and other non-text elements
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return;
        }
        
        // Check if element should use mono font (code, pre, etc.)
        const isCodeElement = element.tagName === 'CODE' || 
                             element.tagName === 'PRE' || 
                             element.classList.contains('code') ||
                             element.classList.contains('mono') ||
                             element.classList.contains('font-mono');
        
        // Check if element has inline font-family style that should be preserved
        const inlineStyle = element.getAttribute('style') || '';
        const hasInlineFont = inlineStyle.includes('font-family');
        
        // Apply appropriate font
        if (isCodeElement) {
            if (!hasInlineFont) {
                element.style.setProperty('font-family', monoFontFamily, 'important');
            }
        } else {
            // Apply global font to all other elements
            // Override inline styles if they don't match the global font
            const computedFont = window.getComputedStyle(element).getPropertyValue('font-family');
            if (!computedFont.includes('FK Grotesk') && !computedFont.includes('FK Grotesk Trial')) {
                element.style.setProperty('font-family', globalFontFamily, 'important');
            } else if (!hasInlineFont) {
                // Ensure it's set even if computed style shows it
                element.style.setProperty('font-family', globalFontFamily, 'important');
            }
        }
    });
}

// Make function globally available
window.applyGlobalFontStyles = applyGlobalFontStyles;

class ClaudeCockpitApp {
    constructor() {
        // Skip initialization ONLY in Next.js context
        // Check for Next.js indicators: #__next root or __NEXT_DATA__ global
        // DO NOT check for .cockpit-layout or .content-area-wrapper as these exist in our static HTML
        const isNextJS = 
            document.querySelector('#__next') || 
            document.querySelector('[data-nextjs-scroll-focus-boundary]') ||
            (typeof window !== 'undefined' && window.__NEXT_DATA__);
        
        if (isNextJS) {
            // Silently skip initialization in Next.js - React handles routing
            console.log('[ClaudeCockpitApp] Skipping initialization in Next.js context');
            return;
        }
        
        this.currentView = 'dashboard';
        this.contentArea = document.getElementById('content-area');
        this.pageTitle = document.getElementById('page-title');
        this.btnNewAction = document.getElementById('btn-new-action');
        this.headerClockInterval = null;
        
        // Check if required elements exist
        if (!this.contentArea) {
            // In legacy context, element is required - return silently to avoid console error
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
            
            // Setup clock and live badge in header-right (visible on all pages)
            this.setupHeaderClockAndLive();
            
            // Load initial view immediately (don't wait for API)
            // Render dashboard immediately with empty data
            this.renderDashboard({});
            
            // Apply global font styles after initial render
            setTimeout(() => {
                applyGlobalFontStyles();
            }, 200);
            
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
        
        // Setup Admin button in header
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = adminBtn.getAttribute('data-view');
                if (view) {
                    this.loadView(view);
                    // Update active state in sidebar
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('data-view') === view) {
                            item.classList.add('active');
                        }
                    });
                }
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
        
        // Ensure contentArea exists
        if (!this.contentArea) {
            this.contentArea = document.getElementById('content-area');
        }
        
        if (!this.contentArea) {
            console.error('content-area element not found');
            return;
        }
        
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
            
            // Apply global font styles to all content
            setTimeout(() => {
                applyGlobalFontStyles();
            }, 100);
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
        
        // Hide page title
        this.pageTitle.style.display = 'none';
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
                this.btnNewAction.className = 'btn-menu-premium';
                headerLeft.appendChild(this.btnNewAction);
                // Réattacher l'event listener
                this.setupHeaderButton();
            }
        }
        
        if (!this.btnNewAction) return;
        
        if (view === 'cockpit') {
            // Pour cockpit, on cache le bouton refresh
            this.btnNewAction.style.display = 'none';
            // Afficher le header-right
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
            }
            // Afficher le header-left pour le titre
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer TOUTES les autres navigations pour éviter les doublons
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const collateralNav = document.getElementById('collateral-header-nav');
            if (collateralNav) collateralNav.remove();
            // Supprimer aussi toutes les navigations cockpit existantes (doublons)
            const allCockpitNavs = document.querySelectorAll('#cockpit-header-nav');
            allCockpitNavs.forEach(nav => nav.remove());
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-admin-panel-nav', 'has-collateral-nav');
                header.classList.add('has-cockpit-nav');
            }
            // Créer la navigation cockpit (une seule fois)
            this.setupCockpitHeaderNav();
        } else if (view === 'projects') {
            // Supprimer TOUTES les navigations existantes
            this.cleanupAllHeaderNavs();
            
            // Pour projects, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) {
                this.btnNewAction.style.display = 'none';
                this.btnNewAction.style.visibility = 'hidden';
            }
            // Afficher le header-right (horloge et login restent visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
                // Masquer aussi le bouton dans header-right s'il existe
                const btnInHeader = headerRight.querySelector('#btn-new-action');
                if (btnInHeader) {
                    btnInHeader.style.display = 'none';
                    btnInHeader.style.visibility = 'hidden';
                }
            }
            // Afficher le header-left pour le titre "Projections"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer le bouton Export PDF s'il existe (créé dans la section else)
            const existingExportBtn = document.getElementById('header-export-btn');
            if (existingExportBtn) {
                existingExportBtn.remove();
            }
            const header = document.querySelector('.header');
            if (header) {
                header.classList.add('has-projections-nav');
            }
            // Créer la navigation projections (une seule fois)
            this.setupProjectionsHeaderNav();
            
            // Mettre à jour l'onglet actif et le titre directement (overview est déjà chargé dans le template)
            setTimeout(() => {
                const overviewTab = document.querySelector('[data-projection-section="overview"]');
                if (overviewTab) {
                    // Mettre à jour l'état actif sans déclencher le clic (pour éviter le rechargement)
                    const navTabs = document.querySelectorAll('.cockpit-nav-tab[data-projection-section]');
                    navTabs.forEach(tab => tab.classList.remove('active'));
                    overviewTab.classList.add('active');
                    
                    const pageTitle = document.getElementById('page-title');
                    if (pageTitle) {
                        pageTitle.innerText = 'Overview';
                    }
                }
            }, 100);
        } else if (view === 'settings') {
            // Pour settings, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Afficher le header-right (horloge et login restent visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
            }
            // Afficher le header-left pour le titre "Settings"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-projections-nav', 'has-electricity-nav');
                header.classList.add('has-settings-nav');
            }
            this.setupSettingsHeaderNav();
        } else if (view === 'electricity') {
            // Pour electricity, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Afficher le header-right (horloge et login restent visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
            }
            // Afficher le header-left pour le titre "Électricité"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer TOUTES les autres navigations pour éviter les doublons
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            const collateralNav = document.getElementById('collateral-header-nav');
            if (collateralNav) collateralNav.remove();
            // Supprimer aussi toutes les navigations electricity existantes (doublons)
            const allElectricityNavs = document.querySelectorAll('#electricity-header-nav');
            allElectricityNavs.forEach(nav => nav.remove());
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-projections-nav', 'has-settings-nav', 'has-admin-panel-nav', 'has-cockpit-nav', 'has-collateral-nav');
            }
            // Créer la navigation electricity (une seule fois)
            this.setupElectricityHeaderNav();
        } else if (view === 'admin-panel') {
            // Pour admin-panel, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Afficher le header-right (horloge et login restent visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
            }
            // Afficher le header-left pour le titre "Admin Panel"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer les autres navigations
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
                header.classList.remove('has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-collateral-nav');
                header.classList.add('has-admin-panel-nav');
            }
            this.setupAdminPanelHeaderNav();
        } else if (view === 'collateral') {
            // Pour collateral, on cache le bouton et on affiche la navigation
            if (this.btnNewAction) this.btnNewAction.style.display = 'none';
            // Afficher le header-right (horloge et login restent visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
            }
            // Afficher le header-left pour le titre "Collateral"
            const headerLeft = document.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.style.display = 'flex';
            }
            // Supprimer TOUTES les autres navigations pour éviter les doublons
            const projectionsNav = document.getElementById('projections-header-nav');
            if (projectionsNav) projectionsNav.remove();
            const settingsNav = document.getElementById('settings-header-nav');
            if (settingsNav) settingsNav.remove();
            const electricityNav = document.getElementById('electricity-header-nav');
            if (electricityNav) electricityNav.remove();
            const adminPanelNav = document.getElementById('admin-panel-header-nav');
            if (adminPanelNav) adminPanelNav.remove();
            const cockpitNav = document.getElementById('cockpit-header-nav');
            if (cockpitNav) cockpitNav.remove();
            // Supprimer aussi toutes les navigations collateral existantes (doublons)
            const allCollateralNavs = document.querySelectorAll('#collateral-header-nav');
            allCollateralNavs.forEach(nav => nav.remove());
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-admin-panel-nav', 'has-cockpit-nav');
            }
            // Créer la navigation collateral (une seule fois)
            this.setupCollateralHeaderNav();
        } else {
            // Supprimer TOUTES les navigations pour les vues sans sous-menu (dashboard, jobs, etc.)
            this.cleanupAllHeaderNavs();
            
            const buttonText = buttons[view] || '+ New';
            if (buttonText) {
                this.btnNewAction.style.display = 'flex';
                this.btnNewAction.style.visibility = 'visible';
                this.btnNewAction.innerHTML = `<span>${buttonText}</span>`;
            } else {
                this.btnNewAction.style.display = 'none';
            }
            
            // Gérer le header-right avec Admin et Export PDF (horloge et login toujours visibles)
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.style.display = 'flex';
                headerRight.style.alignItems = 'center';
                headerRight.style.gap = 'var(--space-4)';
                
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
            
            // Toutes les navigations ont déjà été supprimées par cleanupAllHeaderNavs()
            // Retirer toutes les classes du header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.remove('has-settings-nav', 'has-projections-nav', 'has-electricity-nav', 'has-admin-panel-nav', 'has-cockpit-nav', 'has-collateral-nav');
            }
            
            // Ne plus nettoyer l'horloge - elle reste visible sur toutes les pages
        }
    }
    
    setupHeaderClockAndLive() {
        // Attendre que le DOM soit prêt
        const setupClock = () => {
            const headerRight = document.querySelector('.header-right');
            if (!headerRight) {
                console.warn('⚠️ header-right not found, retrying...');
                setTimeout(setupClock, 100);
                return;
            }
            
            // S'assurer que le header-right est visible
            headerRight.style.display = 'flex';
            headerRight.style.alignItems = 'center';
            headerRight.style.gap = 'var(--space-4)';
            
            // Vérifier si l'horloge existe déjà
            const existingClock = headerRight.querySelector('.header-cockpit-clock-container');
            if (existingClock) {
                console.log('✅ Clock already exists');
                return;
            }
            
            // Créer le conteneur pour l'horloge et le badge LIVE
            const clockContainer = document.createElement('div');
            clockContainer.className = 'header-cockpit-clock-container';
            clockContainer.style.cssText = 'display: flex; align-items: center; gap: var(--space-3);';
            
            // Créer l'horloge
            const clock = document.createElement('div');
            clock.id = 'headerCockpitClock';
            clock.className = 'header-cockpit-clock';
            clock.style.cssText = 'font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--primary-green); font-variant-numeric: tabular-nums; font-family: var(--font-mono, monospace);';
            
            // Créer le badge LIVE
            const liveBadge = document.createElement('div');
            liveBadge.className = 'header-cockpit-live-badge';
            liveBadge.style.cssText = 'display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); background: rgba(197, 255, 167, 0.1); border: 1px solid rgba(197, 255, 167, 0.3); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--primary-green); text-transform: uppercase; letter-spacing: 0.5px;';
            
            const liveDot = document.createElement('span');
            liveDot.className = 'header-cockpit-live-dot';
            liveDot.style.cssText = 'width: 8px; height: 8px; background: var(--primary-green); border-radius: 50%; animation: pulse 2s infinite;';
            
            const liveText = document.createElement('span');
            liveText.textContent = 'LIVE';
            
            liveBadge.appendChild(liveDot);
            liveBadge.appendChild(liveText);
            
            clockContainer.appendChild(clock);
            clockContainer.appendChild(liveBadge);
            
            // Insérer avant le user-badge s'il existe, sinon à la fin
            const userBadge = headerRight.querySelector('.user-badge');
            if (userBadge) {
                headerRight.insertBefore(clockContainer, userBadge);
            } else {
                headerRight.appendChild(clockContainer);
            }
            
            console.log('✅ Clock and LIVE badge created');
            
            // Initialiser l'horloge
            this.initHeaderClock();
        };
        
        // Essayer immédiatement, puis avec un délai si nécessaire
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupClock);
        } else {
            setupClock();
        }
    }
    
    initHeaderClock() {
        // Nettoyer l'intervalle existant s'il y en a un
        this.cleanupHeaderClock();
        
        // Fonction pour mettre à jour l'horloge
        const updateClock = () => {
            const clockElement = document.getElementById('headerCockpitClock');
            if (clockElement) {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
        };
        
        // Mettre à jour immédiatement
        updateClock();
        
        // Mettre à jour toutes les secondes
        this.headerClockInterval = setInterval(updateClock, 1000);
    }
    
    cleanupHeaderClock() {
        if (this.headerClockInterval) {
            clearInterval(this.headerClockInterval);
            this.headerClockInterval = null;
        }
    }
    
    // Fonction utilitaire pour supprimer toutes les navigations du header
    cleanupAllHeaderNavs() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Supprimer TOUTES les navigations de header (tous types)
        const allHeaderNavs = header.querySelectorAll('.cockpit-header-nav');
        allHeaderNavs.forEach(nav => nav.remove());
        
        // Supprimer aussi par ID spécifique
        const existingNavs = document.querySelectorAll('#cockpit-header-nav, #projections-header-nav, #settings-header-nav, #electricity-header-nav, #admin-panel-header-nav, #collateral-header-nav');
        existingNavs.forEach(nav => nav.remove());
        
        // Retirer toutes les classes de navigation
        header.classList.remove('has-cockpit-nav', 'has-projections-nav', 'has-settings-nav', 'has-electricity-nav', 'has-admin-panel-nav', 'has-collateral-nav');
    }
    
    setupCockpitHeaderNav() {
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter la classe au header pour le positionnement
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
        
        // Insérer la navigation dans le header (au centre)
        header.appendChild(cockpitNav);
        
        // Setup event listeners
        const navTabs = cockpitNav.querySelectorAll('.cockpit-nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const sectionId = tab.getAttribute('data-cockpit-section');
                // TODO: Implémenter la logique de changement de section
                console.log('Cockpit section:', sectionId);
                
                // Update active state
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupProjectionsHeaderNav() {
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter la classe au header pour le positionnement
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
                    <span class="cockpit-nav-label">Calculator</span>
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
                if (sectionId) {
                    // Utiliser une fonction wrapper qui vérifie l'existence de showProjectionSection
                    const handleSectionChange = () => {
                        if (window.showProjectionSection) {
                            window.showProjectionSection(sectionId);
                            
                            // Update active state
                            navTabs.forEach(t => t.classList.remove('active'));
                            tab.classList.add('active');
                        } else {
                            // Retry après un court délai si la fonction n'est pas encore disponible
                            console.warn('⚠️ showProjectionSection not available yet, retrying...');
                            setTimeout(handleSectionChange, 100);
                        }
                    };
                    handleSectionChange();
                }
            });
        });
        
        // Recharger les icônes après insertion
        if (this.reloadIcons) {
            this.reloadIcons();
        }
    }
    
    setupSettingsHeaderNav() {
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter la classe au header pour le positionnement
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
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter la classe au header pour le positionnement
        header.classList.add('has-electricity-nav');
        
        // Créer un conteneur centré pour les onglets
        const electricityNav = document.createElement('div');
        electricityNav.id = 'electricity-header-nav';
        electricityNav.className = 'cockpit-header-nav';
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
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Ajouter la classe au header pour le positionnement
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
        // Supprimer TOUTES les navigations existantes
        this.cleanupAllHeaderNavs();
        
        const header = document.querySelector('.header');
        if (!header) {
            console.error('[Collateral Nav] Header not found');
            return;
        }
        
        // Ajouter la classe au header pour le positionnement
        header.classList.add('has-collateral-nav');
        
        // ÉTAPE 3 : Créer la structure HTML de la navigation
        const navContainer = document.createElement('div');
        navContainer.id = 'collateral-header-nav';
        navContainer.className = 'cockpit-header-nav';
        
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'cockpit-nav-tabs';
        
        // Définir les onglets avec leurs propriétés
        const tabs = [
            { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard || '' },
            { id: 'collateral', label: 'Collateral', icon: Icons.document || '' },
            { id: 'customers', label: 'Customers', icon: Icons.workers || '' },
            { id: 'api-management', label: 'API Management', icon: Icons.settings || '' }
        ];
        
        // Créer chaque onglet
        tabs.forEach((tab, index) => {
            const button = document.createElement('button');
            button.className = `cockpit-nav-tab collateral-nav-tab${index === 0 ? ' active' : ''}`;
            button.setAttribute('data-collateral-section', tab.id);
            button.type = 'button';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'cockpit-nav-icon';
            iconSpan.innerHTML = tab.icon;
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'cockpit-nav-label';
            labelSpan.textContent = tab.label;
            
            button.appendChild(iconSpan);
            button.appendChild(labelSpan);
            tabsContainer.appendChild(button);
        });
        
        navContainer.appendChild(tabsContainer);
        
        // ÉTAPE 4 : Insérer la navigation dans le header
        header.appendChild(navContainer);
        
        // ÉTAPE 5 : Attacher les event listeners
        const navButtons = navContainer.querySelectorAll('.collateral-nav-tab');
        navButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const sectionId = this.getAttribute('data-collateral-section');
                if (!sectionId) {
                    console.error('[Collateral Nav] No section ID on button');
                    return;
                }
                
                // Mettre à jour l'état actif visuellement
                navButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Appeler la fonction de changement de section
                if (typeof window.showCollateralSection === 'function') {
                    window.showCollateralSection(sectionId);
                } else {
                    console.error('[Collateral Nav] showCollateralSection not available');
                }
            });
        });
        
        // ÉTAPE 6 : Recharger les icônes
        if (this.reloadIcons && typeof this.reloadIcons === 'function') {
            setTimeout(() => {
                this.reloadIcons();
            }, 150);
        }
        
        // ÉTAPE 7 : Forcer l'affichage
        navContainer.style.display = 'flex';
        navContainer.style.visibility = 'visible';
        navContainer.style.opacity = '1';
        
        console.log('[Collateral Nav] Navigation initialized successfully');
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
            
            // Check if renderDashboardView is available
            if (typeof renderDashboardView !== 'function') {
                console.error('renderDashboardView is not a function:', typeof renderDashboardView);
                this.contentArea.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="text-danger">Dashboard Template Error</h3>
                            <p class="text-secondary">renderDashboardView is not available. Check console for details.</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            const template = renderDashboardView(data || {});
            // Styles are now in global CSS (dashboard.css), no need to inject them
            this.contentArea.innerHTML = template;
            
            // Apply global font styles
            setTimeout(() => {
                applyGlobalFontStyles();
            }, 100);
            
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
                    try {
                        window.initSeeMoreButtons();
                    } catch (error) {
                        console.warn('Error initializing See More buttons:', error);
                    }
                }, 150);
            }
            
            // Initialize Wallet Performance Chart (if exists)
            if (window.initWalletPerformanceChart && typeof window.initWalletPerformanceChart === 'function') {
                setTimeout(() => {
                    try {
                        window.initWalletPerformanceChart();
                    } catch (error) {
                        console.warn('Error initializing Wallet Performance Chart:', error);
                    }
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
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
        
        // Initialiser les projections après le rendu
        // Utiliser requestAnimationFrame pour s'assurer que le DOM est complètement rendu
        requestAnimationFrame(async () => {
            // Vérifier que le conteneur existe avant d'initialiser
            const checkContainer = (retries = 10) => {
                const container = document.getElementById('projections-sections-container');
                if (container) {
                    // Le conteneur existe, initialiser les projections
                    import('./projections.js').then(module => {
                        if (module.initProjections) {
                            try {
                                module.initProjections();
                            } catch (error) {
                                console.error('❌ Error initializing projections:', error);
                            }
                        }
                    }).catch(error => {
                        console.error('❌ Error importing projections module:', error);
                    });
                } else if (retries > 0) {
                    // Retry après un court délai
                    setTimeout(() => checkContainer(retries - 1), 50);
                } else {
                    console.warn('⚠️ Projections container not found after retries - initializing anyway');
                    // Initialiser quand même pour exposer les fonctions globales
                    import('./projections.js').then(module => {
                        if (module.initProjections) {
                            try {
                                module.initProjections();
                            } catch (error) {
                                console.error('❌ Error initializing projections:', error);
                            }
                        }
                    }).catch(error => {
                        console.error('❌ Error importing projections module:', error);
                    });
                }
            };
            checkContainer();
        });
    }
    
    async renderJobs() {
        const template = await renderJobsView();
        this.contentArea.innerHTML = jobsStyles + template;
        // exportJobs est déjà défini dans renderJobsView
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderVersions() {
        const template = await renderVersionsView();
        this.contentArea.innerHTML = versionsStyles + template;
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderPrompts() {
        const template = await renderPromptsView();
        this.contentArea.innerHTML = promptsStyles + template;
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderLogs(data) {
        const template = await renderLogsView(data);
        this.contentArea.innerHTML = logsStyles + template;
        
        // Reload icons after view render
        if (this.reloadIcons) {
            this.reloadIcons();
        }
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderCockpit(data) {
        const template = renderCockpitView();
        this.contentArea.innerHTML = cockpitStyles + template;
        
        // Initialize cockpit functionality
        initCockpit();
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderSettings(data) {
        const template = await renderSettingsView();
        this.contentArea.innerHTML = settingsStyles + template;
        
        // Initialize settings functionality
        initSettings();
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderElectricity(data) {
        const template = await renderElectricityView();
        // Styles are now in global CSS (electricity.css), no need to inject them
        this.contentArea.innerHTML = template;
        
        // Initialize electricity functionality
        initElectricity();
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderAdminPanel(data) {
        const template = await renderAdminPanelView();
        this.contentArea.innerHTML = adminPanelStyles + template;
        
        // Initialize admin panel functionality
        initAdminPanel();
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
    }
    
    async renderCollateral(data) {
        const template = await renderCollateralView();
        this.contentArea.innerHTML = collateralStyles + template;
        
        // Initialize collateral functionality
        initCollateral();
        
        // Apply global font styles
        setTimeout(() => {
            applyGlobalFontStyles();
        }, 100);
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
            
            // Apply global font styles
            setTimeout(() => {
                applyGlobalFontStyles();
            }, 100);
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
            const statProjects = document.getElementById('stat-projects');
            const statJobs = document.getElementById('stat-jobs');
            
            if (statProjects) {
                statProjects.textContent = stats.total_projects || '0';
            }
            if (statJobs) {
                statJobs.textContent = stats.active_jobs || stats.total_jobs || '0';
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Skip initialization ONLY if in Next.js context
        // Check for Next.js indicators: #__next root or __NEXT_DATA__ global
        // DO NOT check for .cockpit-layout or .content-area-wrapper as these exist in our static HTML
        const isNextJS = 
            document.querySelector('#__next') || 
            document.querySelector('[data-nextjs-scroll-focus-boundary]') ||
            (typeof window !== 'undefined' && window.__NEXT_DATA__);
        
        if (isNextJS) {
            // We're in Next.js, don't initialize legacy app
            console.log('[ClaudeCockpitApp] Skipping initialization in Next.js context');
            return;
        }
        
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
