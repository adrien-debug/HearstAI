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
        /* Collateral View Styles - HEARST Design System NEARST */
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

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-8);
        }

        .stat-card, .kpi-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            transition: all var(--duration-normal) var(--ease-in-out);
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .stat-card::before, .kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #7bed9f 0%, #6fdc66 100%);
            opacity: 0;
            transition: opacity var(--duration-normal);
        }

        .stat-card:hover, .kpi-card:hover {
            border-color: rgba(123, 237, 159, 0.3);
            box-shadow: var(--shadow-md);
            transform: translateY(-4px);
        }

        .stat-card:hover::before, .kpi-card:hover::before {
            opacity: 1;
        }

        .stat-label, .kpi-label {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: var(--space-2);
        }

        .stat-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
        }

        .stat-change {
            font-size: var(--text-xs);
            color: #7bed9f;
        }

        .kpi-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: #7bed9f;
            margin-bottom: var(--space-2);
        }

        .kpi-subtitle {
            font-size: var(--text-xs);
            color: var(--text-secondary);
        }

        /* Chart Section */
        .chart-section {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            box-shadow: var(--shadow-sm);
            margin-bottom: var(--space-6);
        }

        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-6);
        }

        .chart-title {
            font-size: var(--text-lg);
            font-weight: var(--font-bold);
            color: var(--text-primary);
        }

        .chart-legend {
            display: flex;
            gap: var(--space-6);
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-sm);
            color: var(--text-secondary);
        }

        .legend-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        .legend-dot.green {
            background: #7bed9f;
        }

        .legend-dot.gray {
            background: var(--text-muted);
        }

        .chart-container {
            position: relative;
            height: 268px;
            background: #111111;
            border-radius: var(--radius-md);
            padding: var(--space-4);
        }

        /* Table Section */
        .table-section {
            background: var(--primary-grey);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--grey-100);
        }

        .table-title {
            font-size: var(--text-lg);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-6);
        }

        .data-table {
            width: 100%;
            background: #151515;
            border-radius: var(--radius-md);
            overflow: hidden;
        }

        .data-table thead {
            background: #1A1A1A;
        }

        .data-table th {
            padding: var(--space-3) var(--space-4);
            text-align: left;
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .data-table th:last-child,
        .data-table td:last-child {
            text-align: right;
        }

        .data-table tbody tr {
            border-bottom: 1px solid #1E1E1E;
            transition: background var(--duration-fast);
        }

        .data-table tbody tr:nth-child(even) {
            background: #161616;
        }

        .data-table tbody tr:hover {
            background: #202020;
            cursor: pointer;
        }

        .data-table td {
            padding: var(--space-4);
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            color: var(--text-secondary);
        }

        .table-value-positive {
            color: #7bed9f;
            font-weight: var(--font-bold);
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 2px var(--space-3);
            border-radius: 838px;
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge.super {
            background: rgba(123, 237, 159, 0.15);
            color: #7bed9f;
        }

        .badge.healthy {
            background: rgba(123, 237, 159, 0.15);
            color: #7bed9f;
        }

        .badge.unhealthy {
            background: rgba(255, 165, 0, 0.15);
            color: #ffa500;
        }

        .badge.at-risk {
            background: rgba(255, 112, 112, 0.15);
            color: #ff7070;
        }

        /* Filter Buttons */
        .filter-btn {
            padding: var(--space-2) var(--space-4);
            border-radius: var(--radius-md);
            font-size: var(--text-xs);
            font-weight: var(--font-medium);
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--grey-100);
            cursor: pointer;
            transition: all var(--duration-fast);
        }

        .filter-btn.active {
            background: #7bed9f;
            color: #000000;
            border-color: #7bed9f;
        }

        .filter-btn:hover:not(.active) {
            background: var(--grey-200);
            color: var(--text-primary);
        }

        /* Toggle Switch */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 39px;
            height: 19px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #161616;
            border: 1px solid var(--grey-100);
            transition: 0.3s;
            border-radius: 19px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 3px;
            bottom: 3px;
            background-color: var(--text-muted);
            transition: 0.3s;
            border-radius: 50%;
        }

        input:checked + .toggle-slider {
            background-color: #7bed9f;
            border-color: #7bed9f;
        }

        input:checked + .toggle-slider:before {
            transform: translateX(24px);
            background-color: #000000;
        }

        /* Page Header */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-8);
        }

        .page-title {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        /* Cards Grid */
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-6);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .cards-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .stats-grid,
            .cards-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;

