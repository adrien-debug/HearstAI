// Projections Management - Mining Intelligence Platform
// Gère la navigation entre les différentes sections de projections

// Show projection section
export function showProjectionSection(sectionId) {
    const container = document.getElementById('projections-sections-container');
    
    if (!container) {
        console.error('Projections container not found');
        return;
    }
    
    // Importer dynamiquement la vue des sections
    import('./views/projects-sections.js').then(module => {
        // Render section content
        const content = module.renderProjectionSection(sectionId);
        container.innerHTML = content;
        
    // Initialize section-specific functionality
    setTimeout(() => {
        if (sectionId === 'overview' && module.initOverview) {
            module.initOverview();
        } else if (sectionId === 'calculator' && module.initCalculator) {
            module.initCalculator();
        } else if (sectionId === 'results' && module.initResults) {
            module.initResults();
        } else if (sectionId === 'charts' && module.initCharts) {
            module.initCharts();
        } else if (sectionId === 'monte-carlo' && module.initMonteCarlo) {
            module.initMonteCarlo();
        } else if (sectionId === 'projects' && module.initProjectsList) {
            module.initProjectsList();
        } else if (sectionId === 'hardware' && module.initHardware) {
            module.initHardware();
        } else if (sectionId === 'energy' && module.initEnergy) {
            module.initEnergy();
        } else if (sectionId === 'infrastructure' && module.initInfrastructure) {
            module.initInfrastructure();
        }
        
        // Apply global font styles
        applyGlobalFontStyles();
        
        // Fix responsive: Force override des styles inline sur mobile
        fixMobileResponsive();
    }, 200);
    }).catch(error => {
        console.error('Error loading projection section:', error);
        container.innerHTML = `<div class="projection-section-placeholder">
            <p>Erreur lors du chargement de la section ${sectionId}</p>
        </div>`;
    });
    
    // Update navigation tabs in header (avec retry si pas encore prêt)
    const updateNavTabs = () => {
        const navTabs = document.querySelectorAll('.cockpit-nav-tab[data-projection-section]');
        if (navTabs.length > 0) {
            navTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-projection-section') === sectionId) {
                    tab.classList.add('active');
                }
            });
        } else {
            // Retry après un court délai si la navigation n'est pas encore prête
            setTimeout(updateNavTabs, 50);
        }
    };
    updateNavTabs();
}

// Apply global font styles to projections sections
function applyGlobalFontStyles() {
    const container = document.getElementById('projections-sections-container');
    if (!container) return;
    
    // Get the global font family from CSS variables
    const globalFontFamily = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-primary')
        .trim() || "'FK Grotesk Trial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif";
    
    // Get mono font for code elements
    const monoFontFamily = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-family-mono')
        .trim() || "'Fira Code', 'Consolas', 'Monaco', monospace";
    
    // Apply font family to all text elements in the container
    const textElements = container.querySelectorAll('*');
    textElements.forEach(element => {
        // Skip script, style, and other non-text elements
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return;
        }
        
        // Check if element should use mono font (code, pre, etc.)
        const isCodeElement = element.tagName === 'CODE' || 
                             element.tagName === 'PRE' || 
                             element.classList.contains('code') ||
                             element.classList.contains('mono');
        
        // Check if element has inline font-family style
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
    
    // Also ensure the container itself has the font
    container.style.setProperty('font-family', globalFontFamily, 'important');
    
    // Apply to body if container is direct child
    if (container.parentElement === document.body || container.closest('.content-area')) {
        const contentArea = container.closest('.content-area') || document.body;
        contentArea.style.setProperty('font-family', globalFontFamily, 'important');
    }
}

// Fix responsive mobile - Force override des styles inline
function fixMobileResponsive() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Trouver toutes les divs avec des grilles inline
        const gridDivs = document.querySelectorAll('div[style*="grid-template-columns"]');
        gridDivs.forEach(div => {
            const style = div.getAttribute('style') || '';
            if (style.includes('grid-template-columns') && !style.includes('1fr !important')) {
                // Remplacer par 1 colonne sur mobile
                let newStyle = style.replace(/grid-template-columns:\s*[^;]+;?/g, '');
                newStyle += ' grid-template-columns: 1fr !important;';
                div.setAttribute('style', newStyle);
            }
        });
        
        // Fix pour les flex avec space-between
        const flexDivs = document.querySelectorAll('div[style*="justify-content: space-between"]');
        flexDivs.forEach(div => {
            const style = div.getAttribute('style') || '';
            if (style.includes('justify-content: space-between')) {
                div.style.setProperty('flex-direction', 'column', 'important');
                div.style.setProperty('align-items', 'flex-start', 'important');
                if (!style.includes('gap:')) {
                    div.style.setProperty('gap', '16px', 'important');
                }
            }
        });
        
        // Fix pour max-width
        const maxWidthDivs = document.querySelectorAll('div[style*="max-width: 1600px"]');
        maxWidthDivs.forEach(div => {
            div.style.setProperty('max-width', '100%', 'important');
            div.style.setProperty('padding', '24px 16px', 'important');
        });
        
        // Fix pour tous les conteneurs de projections
        const container = document.getElementById('projections-sections-container');
        if (container) {
            container.style.setProperty('width', '100%', 'important');
            container.style.setProperty('max-width', '100%', 'important');
            container.style.setProperty('overflow-x', 'hidden', 'important');
        }
        
        // Fix pour body et html
        document.body.style.setProperty('overflow-x', 'hidden', 'important');
        document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    }
}

// Initialize projections functionality
export function initProjections() {
    console.log('📊 Initializing Projections Mining Intelligence Platform...');
    
    // Exposer la fonction globalement
    window.showProjectionSection = showProjectionSection;
    
    // Overview est déjà chargé dans le template, juste initialiser la fonctionnalité
    const initOverviewFunctionality = () => {
        const container = document.getElementById('projections-sections-container');
        if (container) {
            // Importer et initialiser overview directement
            import('./views/projects-sections.js').then(module => {
                if (module.initOverview) {
                    setTimeout(() => {
                        module.initOverview();
                    }, 100);
                }
            });
        } else {
            // Retry si le container n'est pas encore prêt
            setTimeout(initOverviewFunctionality, 50);
        }
    };
    
    // Démarrer l'initialisation après un court délai
    setTimeout(initOverviewFunctionality, 100);
    
    // Apply global font styles and fix responsive au chargement
    setTimeout(() => {
        applyGlobalFontStyles();
        fixMobileResponsive();
    }, 300);
    
    // Fix responsive au resize (éviter les doublons)
    if (!window.projectionsResizeHandler) {
        let resizeTimeout;
        window.projectionsResizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                applyGlobalFontStyles();
                fixMobileResponsive();
            }, 250);
        };
        window.addEventListener('resize', window.projectionsResizeHandler);
    }
    
    // Setup event listeners for navigation tabs (déjà fait dans setupProjectionsHeaderNav)
    // Les event listeners sont déjà attachés dans app.js
}

