// Projects View - Page supprimée
import { Icons } from '../icons.js';

export async function renderProjectsView(data = null) {
    return `
        <div class="projects-view">
            <div class="projects-content" style="padding: 40px; text-align: center;">
                <h2 style="color: var(--text-primary); margin-bottom: 20px;">Page supprimée</h2>
                <p style="color: var(--text-secondary);">Cette page a été supprimée.</p>
            </div>
        </div>
    `;
}


export const projectsStyles = `
    <style>
        .projects-view {
            padding: 0;
            width: 100%;
        }

        .projects-content {
            width: 100%;
        }
    </style>
`;
