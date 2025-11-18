// Electricity Management - HEARST Mining Dashboard
// Gère la navigation entre les différentes sections du dashboard électricité

// Show electricity section
export function showElectricitySection(sectionId) {
    const container = document.getElementById('electricity-sections-container');
    
    if (!container) {
        console.error('Electricity container not found');
        return;
    }
    
    // Importer dynamiquement la vue des sections
    import('./views/electricity-sections.js').then(module => {
        // Render section content
        const content = module.renderElectricitySection(sectionId);
        container.innerHTML = content;
        
        // Initialize section-specific functionality
        setTimeout(() => {
            if (sectionId === 'electricity' && module.initElectricityChart) {
                module.initElectricityChart();
            } else if (sectionId === 'home' && module.initHome) {
                module.initHome();
            }
        }, 200);
    }).catch(error => {
        console.error('Error loading electricity section:', error);
        container.innerHTML = `<div class="card">
            <p style="color: var(--text-secondary);">Erreur lors du chargement de la section ${sectionId}</p>
        </div>`;
    });
    
    // Update navigation tabs in header
    const navTabs = document.querySelectorAll('.electricity-nav-tab[data-electricity-section]');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-electricity-section') === sectionId) {
            tab.classList.add('active');
        }
    });
}

// Initialize electricity functionality
export function initElectricity() {
    console.log('⚡ Initializing Electricity Dashboard...');
    
    // Exposer la fonction globalement
    window.showElectricitySection = showElectricitySection;
    
    // Set default section
    const defaultSection = 'electricity';
    showElectricitySection(defaultSection);
}

