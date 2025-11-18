// Admin Panel Management - HEARST Executive Cockpit
// Gère la navigation entre les différentes sections du panel admin

// Show admin panel section
export function showAdminPanelSection(sectionId) {
    const container = document.getElementById('admin-panel-sections-container');
    
    if (!container) {
        console.error('Admin Panel container not found');
        return;
    }
    
    // Importer dynamiquement la vue des sections
    import('./views/admin-panel-sections.js').then(module => {
        // Render section content
        const content = module.renderAdminPanelSection(sectionId);
        container.innerHTML = content;
        
        // Initialize section-specific functionality if needed
        setTimeout(() => {
            // Future: Add section-specific initialization here
        }, 200);
    }).catch(error => {
        console.error('Error loading admin panel section:', error);
        container.innerHTML = `<div class="card">
            <p style="color: var(--text-secondary);">Erreur lors du chargement de la section ${sectionId}</p>
        </div>`;
    });
    
    // Update navigation tabs in header
    const navTabs = document.querySelectorAll('.admin-panel-nav-tab[data-admin-section]');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-admin-section') === sectionId) {
            tab.classList.add('active');
        }
    });
}

// Initialize admin panel functionality
export function initAdminPanel() {
    console.log('⚙️ Initializing Admin Panel...');
    
    // Exposer la fonction globalement
    window.showAdminPanelSection = showAdminPanelSection;
    
    // Load default section (dashboard)
    showAdminPanelSection('dashboard');
}




