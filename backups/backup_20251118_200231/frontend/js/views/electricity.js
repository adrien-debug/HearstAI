// Electricity View - HEARST Mining Dashboard
import { Icons } from '../icons.js';

export async function renderElectricityView() {
    return `
        <div class="electricity-view">
            <div class="electricity-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="electricity-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const electricitySectionTitles = {
    home: { title: 'Home', subtitle: 'Dashboard overview' },
    mining: { title: 'Mining', subtitle: 'Mining operations' },
    electricity: { title: 'Electricity', subtitle: 'Provider summary' },
    contracts: { title: 'Contracts', subtitle: 'Contracts management' },
    analytics: { title: 'Analytics', subtitle: 'Analytics dashboard' }
};

export const electricityStyles = `
    <style>
        /* Electricity View Styles - HEARST Design System */
        .electricity-view {
            padding: var(--space-6);
            width: 100%;
            max-width: 100%;
            margin: 0;
        }

        .electricity-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: var(--space-8);
        }

        /* HEARST Design System Styles */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-8);
        }

        .stat-card {
            background: var(--primary-grey);
            border: var(--border-thin) solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--duration-normal) var(--ease-in-out);
            position: relative;
            overflow: hidden;
        }

        .stat-card:hover {
            border-color: var(--primary-green);
            box-shadow: var(--shadow-md);
            transform: translateY(-2px);
        }

        .stat-label {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            margin-bottom: var(--space-2);
        }

        .stat-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-1);
        }

        .stat-value.green {
            color: var(--primary-green);
        }

        .stat-change {
            font-size: var(--text-xs);
            color: var(--primary-green);
        }

        .section {
            margin-bottom: var(--space-8);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-6);
            flex-wrap: wrap;
            gap: var(--space-4);
        }

        .section-title {
            font-size: var(--text-xl);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
        }

        .card {
            background: var(--primary-grey);
            border: var(--border-thin) solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--duration-normal) var(--ease-in-out);
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            border-color: var(--primary-green);
            box-shadow: var(--shadow-md);
            transform: translateY(-2px);
        }

        .card-title {
            font-size: var(--text-xl);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            margin: 0 0 var(--space-4) 0;
        }

        .table-container {
            background: var(--primary-grey);
            border: var(--border-thin) solid var(--grey-100);
            border-radius: var(--radius-lg);
            overflow: hidden;
        }

        .table-container table {
            width: 100%;
            border-collapse: collapse;
            background: var(--primary-grey);
        }

        .table-container table thead {
            background: var(--grey-100);
        }

        .table-container table thead th {
            padding: var(--space-4);
            text-align: left;
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .table-container table td {
            padding: var(--space-4);
            border-top: var(--border-thin) solid var(--grey-100);
            color: var(--text-secondary);
            font-size: var(--text-base);
        }

        .table-container table tbody tr {
            transition: background var(--duration-fast) var(--ease-in-out);
        }

        .table-container table tbody tr:hover {
            background: var(--grey-200);
        }

        .filters {
            display: flex;
            gap: var(--space-4);
            align-items: flex-end;
            margin-bottom: var(--space-6);
            flex-wrap: wrap;
        }

        .filter-group {
            flex: 1;
            min-width: 200px;
        }

        .filter-group label {
            display: block;
            font-size: var(--text-sm);
            color: var(--text-secondary);
            margin-bottom: var(--space-2);
            font-weight: var(--font-medium);
        }

        .tabs {
            display: flex;
            gap: var(--space-1);
            border-bottom: var(--border-thin) solid var(--grey-100);
            margin-bottom: var(--space-6);
        }

        .tab {
            padding: var(--space-3) var(--space-5);
            background: transparent;
            color: var(--text-secondary);
            border: none;
            cursor: pointer;
            font-size: var(--text-sm);
            font-weight: var(--font-medium);
            transition: all var(--duration-normal) var(--ease-in-out);
            border-bottom: var(--border-medium) solid transparent;
        }

        .tab:hover {
            color: var(--primary-green);
        }

        .tab.active {
            color: var(--primary-green);
            border-bottom-color: var(--primary-green);
        }

        .chart-container {
            background: var(--primary-grey);
            border: var(--border-thin) solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            position: relative;
            overflow: hidden;
        }
    </style>
`;





