// Prompts View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';
import { Icons } from '../icons.js';

export async function renderPromptsView() {
    try {
        // Pour l'instant, affichage simple
        // TODO: Implémenter API.getPrompts() dans le backend
        
        return `
            <div class="prompts-view">
                <div class="prompts-content">
                    <div class="section">
                        <div class="card-grid">
                            ${renderPromptsPlaceholder()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading prompts:', error);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading prompts</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderPromptsPlaceholder() {
    return `
        <div class="card">
            <div class="card-body text-center">
                <div class="placeholder-icon">${Icons.prompts}</div>
                <h3 class="text-primary mb-md">Prompt Templates</h3>
                <p class="text-secondary mb-md">
                    Save and reuse your best Claude prompts:
                </p>
                <ul class="feature-list">
                    <li>Create reusable prompt templates</li>
                    <li>Organize by categories (debug, refactor, etc.)</li>
                    <li>Use variables for dynamic content</li>
                    <li>Share prompts across projects</li>
                </ul>
                <p class="text-muted mt-md">
                    Coming soon: Build your prompt library for faster job creation.
                </p>
            </div>
        </div>
    `;
}

export const promptsStyles = `
<style>
.prompts-view {
    padding: 0;
    width: 100%;
}

.prompts-content {
    width: 100%;
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
}
</style>
`;
