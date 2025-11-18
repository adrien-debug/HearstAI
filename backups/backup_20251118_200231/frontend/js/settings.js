// Settings Management
// Gère la navigation entre les différentes sections des settings

// Show settings section
export function showSettingsSection(sectionId) {
    const container = document.getElementById('settings-sections-container');
    
    if (!container) {
        console.error('Settings container not found');
        return;
    }
    
    // Load section content based on sectionId
    if (sectionId === 'versions') {
        import('./views/versions.js').then(async module => {
            const html = await module.renderVersionsView();
            container.innerHTML = html;
            // Reload icons
            if (window.app && window.app.reloadIcons) {
                window.app.reloadIcons();
            }
        });
    } else if (sectionId === 'prompts') {
        import('./views/prompts.js').then(async module => {
            const html = await module.renderPromptsView();
            container.innerHTML = html;
            // Reload icons
            if (window.app && window.app.reloadIcons) {
                window.app.reloadIcons();
            }
        });
    } else if (sectionId === 'logs') {
        import('./views/logs.js').then(async module => {
            const html = await module.renderLogsView();
            container.innerHTML = html;
            // Reload icons
            if (window.app && window.app.reloadIcons) {
                window.app.reloadIcons();
            }
        });
    }
    
    // Update navigation tabs in header
    const navTabs = document.querySelectorAll('.cockpit-nav-tab[data-settings-section]');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-settings-section') === sectionId) {
            tab.classList.add('active');
        }
    });
}

// Initialize settings functionality
export function initSettings() {
    console.log('⚙️ Initializing Settings...');
    
    // Exposer la fonction globalement
    window.showSettingsSection = showSettingsSection;
    
    // Set default section
    const defaultSection = 'versions';
    showSettingsSection(defaultSection);
}
