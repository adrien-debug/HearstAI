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
        
        // Fix responsive: Force override des styles inline sur mobile
        fixMobileResponsive();
    }, 200);
    }).catch(error => {
        console.error('Error loading projection section:', error);
        container.innerHTML = `<div class="projection-section-placeholder">
            <p>Erreur lors du chargement de la section ${sectionId}</p>
        </div>`;
    });
    
    // Update navigation tabs in header
    const navTabs = document.querySelectorAll('.cockpit-nav-tab[data-projection-section]');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-projection-section') === sectionId) {
            tab.classList.add('active');
        }
    });
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
    
    // Set default section
    const defaultSection = 'overview';
    showProjectionSection(defaultSection);
    
    // Fix responsive au chargement
    setTimeout(() => {
        fixMobileResponsive();
    }, 300);
    
    // Fix responsive au resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            fixMobileResponsive();
        }, 250);
    });
    
    // Setup event listeners for navigation tabs (déjà fait dans setupProjectionsHeaderNav)
    // Les event listeners sont déjà attachés dans app.js
}

