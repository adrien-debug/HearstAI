// Collateral View - HEARST Design System
// Vue principale avec sous-menus : Dashboard, Collateral, Customers, API Management

export async function renderCollateralView() {
    return `
        <div class="collateral-view">
            <div class="collateral-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="collateral-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const collateralSectionTitles = {
    dashboard: { title: 'Customer Collateral Management', subtitle: 'Overview & KPIs' },
    collateral: { title: 'Collateral Management', subtitle: 'Manage client positions and collateral' },
    customers: { title: 'Customer Management', subtitle: 'All customers' },
    'api-management': { title: 'API Management', subtitle: 'DeFi Protocol APIs' }
};

export const collateralStyles = `
    <style>
        /* Collateral View Styles - HEARST Design System */
        .collateral-view {
            padding: var(--space-6);
            width: 100%;
            max-width: 100%;
            margin: 0;
        }

        .collateral-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: var(--space-8);
        }
    </style>
`;
