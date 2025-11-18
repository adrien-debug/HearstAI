// Versions View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';
import { Icons } from '../icons.js';

export async function renderVersionsView() {
    try {
        // Pour l'instant, affichage simple
        // TODO: Implémenter API.getVersions() dans le backend
        
        return `
            <div class="versions-view">
                <div class="versions-content">
                    <div class="section">
                        <div class="section-header">
                            <div class="filters">
                                <select class="filter-select" id="version-project-filter">
                                    <option value="">All Projects</option>
                                </select>
                                <select class="filter-select" id="version-status-filter">
                                    <option value="">All Statuses</option>
                                    <option value="stable">Stable Only</option>
                                    <option value="draft">Draft Only</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="card-grid">
                            ${renderVersionsPlaceholder()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading versions:', error);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading versions</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderVersionsPlaceholder() {
    return `
        <div class="card">
            <div class="card-body text-center">
                <div class="placeholder-icon">${Icons.versions}</div>
                <h3 class="text-primary mb-md">Versions Feature</h3>
                <p class="text-secondary mb-md">
                    Version management system allows you to:
                </p>
                <ul class="feature-list">
                    <li>Track code changes across iterations</li>
                    <li>Mark stable versions for production</li>
                    <li>Compare different versions</li>
                    <li>Rollback to previous versions</li>
                </ul>
                <p class="text-muted mt-md">
                    Versions are automatically created when jobs complete successfully.
                </p>
            </div>
        </div>
    `;
}

export const versionsStyles = `
<style>
.versions-view {
    padding: 0;
    width: 100%;
}

.versions-content {
    width: 100%;
}

.section-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.filters {
    display: flex;
    gap: var(--spacing-md);
}

.filter-select {
    padding: 12px 16px;
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid #252525;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 14px;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-in-out);
    backdrop-filter: blur(10px);
}

.filter-select:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px rgba(138, 253, 129, 0.2);
    background: rgba(26, 26, 26, 0.95);
}

.filter-select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(138, 253, 129, 0.1);
}

.placeholder-icon {
    font-size: 64px;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
    filter: drop-shadow(0 0 12px rgba(138, 253, 129, 0.3));
    transition: all var(--duration-normal) var(--ease-in-out);
}

.placeholder-icon:hover {
    opacity: 0.8;
    filter: drop-shadow(0 0 20px rgba(138, 253, 129, 0.5));
}

.feature-list {
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
    list-style: none;
    padding: 0;
}

.feature-list li {
    padding: 8px 0;
    padding-left: 24px;
    position: relative;
    color: var(--text-secondary);
}

.feature-list li::before {
    content: '';
    position: absolute;
    left: 0;
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6L9 17L4 12' stroke='%238afd81' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    color: var(--accent-primary);
    font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
    }
    
    .filters {
        flex-direction: column;
        width: 100%;
    }
    
    .filter-select {
        width: 100%;
    }
}
</style>
`;
