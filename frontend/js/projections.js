// Projections Management - Mining Intelligence Platform
// Gère la navigation entre les différentes sections de projections

// Helper function pour obtenir le chemin correct des modules selon l'URL de base
// Les imports ES modules résolvent les chemins relatifs par rapport au fichier qui les importe
// Pour le serveur sur le port 3001, on utilise simplement le chemin relatif standard
function getModulePath(relativePath) {
    // Chemin relatif standard - fonctionne avec les imports ES modules
    // Le navigateur résout automatiquement le chemin par rapport à l'URL du script actuel
    return `./${relativePath}`;
}

// Helper function pour initialiser une section
function initializeSection(module, sectionId) {
    const initDelay = sectionId === 'results' ? 300 : 200;
    setTimeout(() => {
        try {
            const initMap = {
                'overview': module.initOverview,
                'calculator': module.initCalculator,
                'results': module.initResults,
                'charts': module.initCharts,
                'monte-carlo': module.initMonteCarlo,
                'projects': module.initProjectsList,
                'hardware': module.initHardware,
                'energy': module.initEnergy,
                'infrastructure': module.initInfrastructure
            };
            
            const initFunction = initMap[sectionId];
            if (initFunction) {
                initFunction();
            }
            
            // Apply global font styles
            applyGlobalFontStyles();
            
            // Fix responsive: Force override des styles inline sur mobile
            fixMobileResponsive();
        } catch (error) {
            console.error(`❌ Error initializing section ${sectionId}:`, error);
        }
    }, initDelay);
}

// Helper function pour afficher une erreur
function showError(container, sectionId, errorMessage, modulePath) {
    if (container) {
        container.innerHTML = `<div class="projection-section-placeholder" style="padding: 40px; text-align: center; color: #fff;">
            <p>Erreur lors du chargement de la section ${sectionId}: ${errorMessage}</p>
            <p style="font-size: 12px; color: #888; margin-top: 10px;">Module path: ${modulePath}</p>
        </div>`;
    }
}

// Show projection section
export function showProjectionSection(sectionId) {
    const container = document.getElementById('projections-sections-container');
    
    if (!container) {
        console.warn('⚠️ Projections container not found. Retrying...');
        // Retry avec plusieurs tentatives
        let retryCount = 0;
        const maxRetries = 5;
        const retryInterval = setInterval(() => {
            retryCount++;
            const retryContainer = document.getElementById('projections-sections-container');
            if (retryContainer) {
                clearInterval(retryInterval);
                showProjectionSection(sectionId);
            } else if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
                console.error('❌ Projections container not found after', maxRetries, 'retries');
            }
        }, 100);
        return;
    }
    
    // S'assurer que le container est visible
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    // Importer dynamiquement la vue des sections
    const modulePath = getModulePath('views/projects-sections.js');
    
    import(modulePath).then(module => {
        // Render section content
        const content = module.renderProjectionSection(sectionId);
        
        if (!content || content.trim() === '') {
            console.warn(`⚠️ Section ${sectionId} returned empty content`);
            container.innerHTML = `<div class="projection-section-placeholder" style="padding: 40px; text-align: center; color: #fff;">
                <p>Section ${sectionId} - En cours de développement...</p>
            </div>`;
            return;
        }
        
        // Vérifier et rendre visible les parents si nécessaire
        let parent = container.parentElement;
        while (parent && parent !== document.body) {
            const computedStyle = window.getComputedStyle(parent);
            if (computedStyle.display === 'none') {
                parent.style.display = 'block';
            }
            parent = parent.parentElement;
        }
        
        // Insérer le contenu
        container.innerHTML = content;
        
        // Initialize section-specific functionality
        initializeSection(module, sectionId);
    }).catch(error => {
        console.error('❌ Error loading projection section:', error);
        
        // Essayer avec un chemin alternatif si le premier échoue
        const fallbackPath = './views/projects-sections.js';
        if (modulePath !== fallbackPath) {
            console.log('🔄 Retrying with fallback path:', fallbackPath);
            import(fallbackPath).then(module => {
                const content = module.renderProjectionSection(sectionId);
                if (content && content.trim() !== '') {
                    container.innerHTML = content;
                    // Initialiser la section
                    initializeSection(module, sectionId);
                }
            }).catch(fallbackError => {
                console.error('❌ Fallback import also failed:', fallbackError);
                showError(container, sectionId, error.message, modulePath);
            });
        } else {
            showError(container, sectionId, error.message, modulePath);
        }
    });
    
    // Update navigation tabs in header (avec retry limité)
    let retryCount = 0;
    const maxRetries = 5;
    const updateNavTabs = () => {
        const navTabs = document.querySelectorAll('.cockpit-nav-tab[data-projection-section]');
        if (navTabs.length > 0) {
            navTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-projection-section') === sectionId) {
                    tab.classList.add('active');
                }
            });
        } else if (retryCount < maxRetries) {
            retryCount++;
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
    
    // Exposer la fonction globalement IMMÉDIATEMENT (avant même de vérifier le container)
    // Cela permet aux event listeners dans app.js de fonctionner même si le container n'est pas encore prêt
    window.showProjectionSection = showProjectionSection;
    
    // S'assurer que calculateProjection est toujours disponible (même si calculator n'est pas initialisé)
    // Cette fonction est utilisée dans le HTML généré via onclick="calculateProjection()"
    window.calculateProjection = () => {
        console.log('📊 Calculating projection...');
        if (window.showProjectionSection) {
            console.log('✅ showProjectionSection available, navigating to results...');
            window.showProjectionSection('results');
        } else {
            console.error('❌ showProjectionSection not available');
            // Retry après un court délai
            setTimeout(() => {
                if (window.showProjectionSection) {
                    console.log('✅ showProjectionSection now available, retrying...');
                    window.showProjectionSection('results');
                } else {
                    console.error('❌ showProjectionSection still not available after retry');
                }
            }, 100);
        }
    };
    
    // Vérifier l'existence du container avec retry limité
    let retryCount = 0;
    const maxRetries = 10; // 10 tentatives max (500ms total)
    const initOverviewFunctionality = () => {
        const container = document.getElementById('projections-sections-container');
        if (container) {
            console.log('✅ Projections container found, initializing overview...');
            // Importer et initialiser overview directement
            const modulePath = getModulePath('views/projects-sections.js');
            import(modulePath).then(module => {
                if (module.initOverview) {
                    setTimeout(() => {
                        try {
                            module.initOverview();
                        } catch (error) {
                            console.error('❌ Error in initOverview:', error);
                        }
                    }, 100);
                }
            }).catch(error => {
                console.error('❌ Error importing projects-sections:', error);
            });
            
            // Apply global font styles and fix responsive au chargement
            setTimeout(() => {
                try {
                    applyGlobalFontStyles();
                    fixMobileResponsive();
                } catch (error) {
                    console.error('❌ Error applying styles:', error);
                }
            }, 200);
        } else {
            retryCount++;
            if (retryCount < maxRetries) {
                // Retry si le container n'est pas encore prêt
                setTimeout(initOverviewFunctionality, 50);
            } else {
                console.warn('⚠️ Projections container not found after', maxRetries, 'retries. The view may not be fully initialized.');
            }
        }
    };
    
    // Démarrer l'initialisation immédiatement (pas besoin d'attendre)
    initOverviewFunctionality();
    
    // Fix responsive au resize (éviter les doublons)
    if (!window.projectionsResizeHandler) {
        let resizeTimeout;
        window.projectionsResizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                try {
                    applyGlobalFontStyles();
                    fixMobileResponsive();
                } catch (error) {
                    console.error('❌ Error in resize handler:', error);
                }
            }, 250);
        };
        window.addEventListener('resize', window.projectionsResizeHandler);
    }
    
    // Setup event listeners for navigation tabs (déjà fait dans setupProjectionsHeaderNav)
    // Les event listeners sont déjà attachés dans app.js
    console.log('✅ Projections initialization complete');
}

// Fonction pour déconnecter et reconnecter les projections
export function reconnectProjections() {
    console.log('🔄 Reconnecting Projections...');
    
    // Nettoyer le cache des modules si possible
    // Note: Les modules ES ne peuvent pas être "déchargés" facilement, 
    // mais on peut réinitialiser l'état
    
    // Réinitialiser le container
    const container = document.getElementById('projections-sections-container');
    if (container) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #fff;"><div class="spinner"></div><p>Reconnecting...</p></div>';
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
    }
    
    // Réexposer les fonctions globales
    window.showProjectionSection = showProjectionSection;
    window.calculateProjection = () => {
        console.log('📊 Calculating projection...');
        if (window.showProjectionSection) {
            console.log('✅ showProjectionSection available, navigating to results...');
            window.showProjectionSection('results');
        } else {
            console.error('❌ showProjectionSection not available');
        }
    };
    
    // Réinitialiser les projections
    setTimeout(() => {
        initProjections();
        
        // Recharger la section overview par défaut après reconnexion
        setTimeout(() => {
            if (window.showProjectionSection) {
                console.log('🔄 Reloading overview section...');
                window.showProjectionSection('overview');
            }
        }, 300);
    }, 100);
    
    console.log('✅ Projections reconnected');
}

// Exposer la fonction globalement pour pouvoir l'appeler depuis la console
window.reconnectProjections = reconnectProjections;

