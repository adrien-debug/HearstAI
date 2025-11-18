// Projects View (Projestions) - HEARST STYLE
// Suit le même pattern que Cockpit et Settings
import { Icons } from '../icons.js';

export async function renderProjectsView(data = null) {
    return `
        <div class="projects-view">
            <div class="projects-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="projections-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const projectionsSectionTitles = {
    overview: { title: 'Overview', subtitle: 'Real-time market metrics and mining news' },
    calculator: { title: 'Projections', subtitle: 'Mining profitability calculator' },
    results: { title: 'Results', subtitle: 'Analysis results and financial metrics' },
    charts: { title: 'Charts', subtitle: 'Financial visualizations and projections' },
    'monte-carlo': { title: 'Monte Carlo', subtitle: 'Probabilistic risk analysis' },
    projects: { title: 'Projects', subtitle: 'Manage and compare mining scenarios' },
    hardware: { title: 'Hardware', subtitle: 'ASIC fleet configuration and optimization' },
    energy: { title: 'Energy', subtitle: 'Renewable energy integration and optimization' },
    infrastructure: { title: 'Infrastructure', subtitle: 'Facility design and cooling systems' }
};

export const projectsStyles = `
    <style>
        /* Projects View (Projestions) Styles - HEARST Design System */
        /* Note: Les styles de navigation sont dans projections.css */
        
        .projects-view {
            padding: 0;
            width: 100%;
        }

        .projects-content {
            width: 100%;
        }
    </style>
`;
