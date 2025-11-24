// ===================================
// CONFIG.JS - Configuration centralisée
// ===================================

/**
 * Détection automatique de l'environnement
 */
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const isProduction = !isDevelopment;

/**
 * Configuration globale de l'application
 */
export const CONFIG = {
    // Environnement
    ENV: isDevelopment ? 'development' : 'production',
    IS_DEV: isDevelopment,
    IS_PROD: isProduction,
    
    // API
    API_BASE_URL: isDevelopment 
        ? 'http://localhost:4000/api'  // Dev: backend Express local
        : '/api',                       // Prod: routing Next.js
    
    // Timeouts
    API_TIMEOUT: 30000, // 30 secondes
    RETRY_DELAY: 2000,  // 2 secondes entre retry
    MAX_RETRIES: 3,
    
    // Refresh intervals
    STATS_REFRESH_INTERVAL: 30000,  // 30 secondes
    JOBS_REFRESH_INTERVAL: 10000,   // 10 secondes
    
    // UI
    TOAST_DURATION: 4000,           // 4 secondes
    MODAL_ANIMATION_DURATION: 300,  // 300ms
    
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    
    // Version
    APP_VERSION: '1.0.0',
    APP_NAME: 'Claude CI/CD Cockpit'
};

/**
 * Logs de debug (seulement en dev)
 */
export function debugLog(...args) {
    if (CONFIG.IS_DEV) {
        console.log('[DEBUG]', ...args);
    }
}

/**
 * Informations sur l'environnement
 */
export function logEnvironment() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION}`);
    console.log(`📍 Environment: ${CONFIG.ENV}`);
    console.log(`🌐 API Base URL: ${CONFIG.API_BASE_URL}`);
    console.log(`🖥️  Hostname: ${window.location.hostname}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

export default CONFIG;
