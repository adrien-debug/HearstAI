// Admin Panel View - HEARST Executive Cockpit
import { Icons } from '../icons.js';

export async function renderAdminPanelView() {
    return `
        <div class="admin-panel-view">
            <div class="admin-panel-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="admin-panel-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const adminPanelSectionTitles = {
    dashboard: { title: 'Executive Dashboard', subtitle: 'Overview & KPIs' },
    structure: { title: 'Structure Organisationnelle', subtitle: 'Organigramme & Départements' },
    health: { title: 'Health Control', subtitle: 'État des Systèmes' },
    teams: { title: 'Gestion des Équipes', subtitle: 'Équipes & Performance' },
    actions: { title: 'Actions Prioritaires', subtitle: 'Kanban & Actions' },
    finances: { title: 'Vue Financière', subtitle: 'Revenus & Dépenses' },
    documents: { title: 'Documents', subtitle: 'Gestion documentaire' },
    reports: { title: 'Reports', subtitle: 'Rapports automatisés' },
    compliance: { title: 'Compliance Scan', subtitle: 'Audit de conformité' }
};

export const adminPanelStyles = `
    <style>
        /* Admin Panel View Styles - HEARST Design System */
        .admin-panel-view {
            padding: var(--space-6);
            padding-left: var(--space-4) !important;
            width: 100%;
            max-width: 100%;
            margin: 0;
        }

        .admin-panel-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: var(--space-8);
        }

        /* KPI Cards */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-8);
        }

        .kpi-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            transition: all var(--duration-normal) var(--ease-in-out);
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-green) 0%, #6fdc66 100%);
            opacity: 0;
            transition: opacity var(--duration-normal);
        }

        .kpi-card:hover {
            border-color: rgba(138, 253, 129, 0.3);
            box-shadow: var(--shadow-md);
            transform: translateY(-4px);
        }

        .kpi-card:hover::before {
            opacity: 1;
        }

        .kpi-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--space-4);
        }

        .kpi-label {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .kpi-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(138, 253, 129, 0.1);
            border-radius: var(--radius-md);
            border: 1px solid rgba(138, 253, 129, 0.2);
        }

        .kpi-icon svg {
            width: 18px;
            height: 18px;
            stroke: var(--primary-green);
            fill: none;
            stroke-width: 2.5;
        }

        .kpi-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
            letter-spacing: -0.02em;
        }

        .kpi-trend {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            padding: 4px 8px;
            border-radius: var(--radius-sm);
        }

        .trend-positive {
            background: rgba(138, 253, 129, 0.15);
            color: var(--primary-green);
        }

        .trend-negative {
            background: rgba(255, 68, 68, 0.15);
            color: #ff4444;
        }

        /* Sections */
        .section {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            margin-bottom: var(--space-6);
            box-shadow: var(--shadow-sm);
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-6);
            padding-bottom: var(--space-4);
            border-bottom: 1px solid var(--grey-100);
        }

        .section-title {
            font-size: var(--text-lg);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            letter-spacing: -0.01em;
        }

        /* Tables */
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-lg);
            overflow: hidden;
        }

        .stats-table thead {
            background: #141414;
            border-bottom: 1px solid var(--grey-100);
        }

        .stats-table th {
            padding: var(--space-4) var(--space-6);
            text-align: left;
            font-weight: var(--font-bold);
            font-size: var(--text-xs);
            color: var(--primary-green);
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .stats-table tbody tr {
            border-bottom: 1px solid var(--grey-100);
            transition: all var(--duration-fast);
        }

        .stats-table tbody tr:last-child {
            border-bottom: none;
        }

        .stats-table tbody tr:hover {
            background: rgba(138, 253, 129, 0.05);
        }

        .stats-table td {
            padding: var(--space-4) var(--space-6);
            font-size: var(--text-sm);
            color: var(--text-primary);
        }

        .stats-table td:first-child {
            font-weight: var(--font-semibold);
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            border-radius: var(--radius-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-success {
            background: rgba(138, 253, 129, 0.15);
            color: var(--primary-green);
            border: 1px solid rgba(138, 253, 129, 0.3);
        }

        .badge-warning {
            background: rgba(255, 165, 0, 0.15);
            color: #ffa500;
            border: 1px solid rgba(255, 165, 0, 0.3);
        }

        .badge-danger {
            background: rgba(255, 68, 68, 0.15);
            color: #ff4444;
            border: 1px solid rgba(255, 68, 68, 0.3);
        }

        .badge-info {
            background: rgba(52, 152, 219, 0.15);
            color: #3498db;
            border: 1px solid rgba(52, 152, 219, 0.3);
        }

        /* Action Items */
        .action-item {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            padding: var(--space-4);
            border-radius: var(--radius-md);
            transition: all var(--duration-fast);
            border: 1px solid transparent;
        }

        .action-item:hover {
            background: var(--grey-200);
            border-color: var(--grey-100);
        }

        .action-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .action-name {
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            font-size: var(--text-sm);
        }

        .action-detail {
            font-size: var(--text-xs);
            color: var(--text-secondary);
        }

        .action-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-urgent {
            background: rgba(255, 68, 68, 0.2);
            color: #ff4444;
            border: 1px solid rgba(255, 68, 68, 0.3);
        }

        .status-pending {
            background: rgba(255, 165, 0, 0.2);
            color: #ffa500;
            border: 1px solid rgba(255, 165, 0, 0.3);
        }

        .status-done {
            background: rgba(138, 253, 129, 0.2);
            color: var(--primary-green);
            border: 1px solid rgba(138, 253, 129, 0.3);
        }

        /* Kanban Board */
        .kanban-board {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-6);
            padding: var(--space-4) 0;
        }

        .kanban-column {
            background: #242424;
            border-radius: var(--radius-lg);
            padding: var(--space-4);
            min-height: 400px;
        }

        .kanban-column-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-4);
            padding-bottom: var(--space-4);
            border-bottom: 1px solid var(--grey-100);
        }

        .kanban-column-title {
            font-size: var(--text-sm);
            font-weight: var(--font-bold);
            text-transform: uppercase;
            color: var(--text-primary);
            letter-spacing: 0.5px;
        }

        .kanban-column-count {
            font-size: var(--text-sm);
            font-weight: var(--font-bold);
            color: var(--text-muted);
            background: rgba(255, 255, 255, 0.05);
            padding: 2px 8px;
            border-radius: 12px;
        }

        .kanban-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin-bottom: var(--space-4);
            transition: all var(--duration-fast);
            cursor: pointer;
        }

        .kanban-card:hover {
            border-color: rgba(138, 253, 129, 0.3);
            transform: translateX(2px);
        }

        .kanban-card-done {
            opacity: 0.7;
        }

        .kanban-card-labels {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
            margin-bottom: var(--space-3);
        }

        .kanban-card-title {
            font-size: var(--text-sm);
            font-weight: var(--font-semibold);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
        }

        .kanban-card-description {
            font-size: var(--text-xs);
            color: var(--text-secondary);
            margin-bottom: var(--space-4);
            line-height: 1.5;
        }

        .kanban-card-progress {
            margin-bottom: var(--space-3);
        }

        .progress-bar {
            height: 4px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 4px;
        }

        .progress-fill {
            height: 100%;
            background: var(--primary-green);
            border-radius: 2px;
            transition: width var(--duration-normal);
        }

        .progress-text {
            font-size: var(--text-xs);
            color: var(--text-muted);
        }

        .kanban-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: var(--space-3);
            border-top: 1px solid var(--grey-100);
        }

        .kanban-card-assignee {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--text-xs);
            color: var(--text-secondary);
        }

        .avatar-small {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            border: 1px solid var(--grey-100);
        }

        .kanban-card-date {
            font-size: var(--text-xs);
            color: var(--text-muted);
        }

        /* Health Cards */
        .health-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--space-6);
        }

        .health-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--duration-normal);
        }

        .health-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .health-status-operational {
            border-left: 3px solid var(--primary-green);
        }

        .health-status-degraded {
            border-left: 3px solid #ffa500;
        }

        .health-status-critical {
            border-left: 3px solid #ff4444;
        }

        .health-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-4);
        }

        .health-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(138, 253, 129, 0.1);
            border-radius: var(--radius-md);
        }

        .health-icon svg {
            width: 22px;
            height: 22px;
            stroke: var(--primary-green);
            stroke-width: 2.5;
        }

        .health-status-badge {
            font-size: var(--text-xs);
            padding: 4px 8px;
        }

        .health-name {
            font-size: var(--text-base);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
        }

        .health-metric {
            display: flex;
            align-items: baseline;
            gap: var(--space-2);
            margin-bottom: var(--space-2);
        }

        .health-value {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--primary-green);
        }

        .health-label {
            font-size: var(--text-xs);
            color: var(--text-secondary);
        }

        .health-detail {
            font-size: var(--text-xs);
            color: var(--text-muted);
        }

        /* Teams Grid */
        .teams-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: var(--space-6);
        }

        .team-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            transition: all var(--duration-normal);
        }

        .team-card:hover {
            transform: translateY(-4px);
            border-color: rgba(138, 253, 129, 0.3);
            box-shadow: 0 8px 24px rgba(138, 253, 129, 0.15);
        }

        .team-header {
            margin-bottom: var(--space-4);
        }

        .team-avatar-group {
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }

        .team-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            border: 2px solid var(--grey-100);
        }

        .team-avatar-more {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(138, 253, 129, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            color: var(--primary-green);
            border: 2px solid rgba(138, 253, 129, 0.3);
        }

        .team-name {
            font-size: var(--text-lg);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-2);
        }

        .team-lead {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            margin-bottom: var(--space-4);
        }

        .team-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-4);
            margin-bottom: var(--space-4);
            padding: var(--space-4);
            background: rgba(255, 255, 255, 0.02);
            border-radius: var(--radius-md);
        }

        .team-stat {
            text-align: center;
        }

        .team-stat-value {
            font-size: var(--text-xl);
            font-weight: var(--font-bold);
            color: var(--primary-green);
            display: block;
        }

        .team-stat-label {
            font-size: var(--text-xs);
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .team-tags {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
        }

        .tag {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 4px 8px;
            background: rgba(138, 253, 129, 0.1);
            color: var(--primary-green);
            border-radius: var(--radius-sm);
            border: 1px solid rgba(138, 253, 129, 0.2);
        }

        /* Revenue Cards */
        .revenue-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--space-6);
        }

        .revenue-card {
            display: flex;
            align-items: center;
            gap: var(--space-4);
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--duration-fast);
        }

        .revenue-card:hover {
            transform: translateY(-2px);
            border-color: rgba(138, 253, 129, 0.3);
        }

        .revenue-icon {
            width: 56px;
            height: 56px;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .revenue-icon svg {
            width: 28px;
            height: 28px;
            stroke-width: 2.5;
        }

        .revenue-info {
            flex: 1;
        }

        .revenue-label {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .revenue-value {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: 4px;
        }

        .revenue-percentage {
            font-size: var(--text-xs);
            color: var(--text-muted);
        }

        /* Metrics Grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--space-6);
        }

        .metric-chart {
            padding: var(--space-4);
        }

        .metric-value {
            font-size: var(--text-3xl);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: var(--space-4);
        }

        .metric-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: var(--space-2);
        }

        .metric-bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width var(--duration-normal);
        }

        .metric-label {
            font-size: var(--text-xs);
            color: var(--text-secondary);
        }

        /* Organigramme */
        .org-chart {
            padding: var(--space-6) 0;
        }

        .org-level {
            display: flex;
            justify-content: center;
            gap: var(--space-6);
            margin-bottom: var(--space-8);
            position: relative;
            flex-wrap: wrap;
        }

        .org-level-2 {
            margin-top: var(--space-8);
        }

        .org-card {
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            min-width: 200px;
            max-width: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-4);
            transition: all var(--duration-normal);
            position: relative;
        }

        .org-card-ceo {
            border: 2px solid var(--primary-green);
            box-shadow: 0 0 20px rgba(138, 253, 129, 0.3);
        }

        .org-card:hover {
            transform: translateY(-4px);
            border-color: rgba(138, 253, 129, 0.3);
            box-shadow: 0 8px 24px rgba(138, 253, 129, 0.15);
        }

        .org-avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: var(--font-bold);
            font-size: var(--text-lg);
            color: var(--text-primary);
            border: 2px solid var(--grey-100);
            transition: all var(--duration-fast);
        }

        .org-card:hover .org-avatar {
            border-color: var(--primary-green);
            box-shadow: 0 0 16px rgba(138, 253, 129, 0.3);
        }

        .org-info {
            text-align: center;
        }

        .org-name {
            font-size: var(--text-base);
            font-weight: var(--font-bold);
            color: var(--text-primary);
            margin-bottom: 4px;
            letter-spacing: -0.01em;
        }

        .org-title {
            font-size: var(--text-xs);
            font-weight: var(--font-semibold);
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .org-team {
            font-size: var(--text-xs);
            color: var(--text-muted);
            padding: 4px 12px;
            background: rgba(138, 253, 129, 0.1);
            border-radius: var(--radius-sm);
            border: 1px solid rgba(138, 253, 129, 0.2);
        }

        /* Hiring Pipeline */
        .hiring-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: var(--space-4);
        }

        .hiring-stage {
            background: #242424;
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            transition: all var(--duration-fast);
        }

        .hiring-stage:hover {
            border-color: rgba(138, 253, 129, 0.3);
            transform: translateY(-2px);
        }

        .hiring-stage-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-4);
        }

        .hiring-stage-title {
            font-size: var(--text-xs);
            font-weight: var(--font-bold);
            text-transform: uppercase;
            color: var(--text-secondary);
            letter-spacing: 0.5px;
        }

        .hiring-stage-count {
            font-size: var(--text-2xl);
            font-weight: var(--font-bold);
            color: var(--primary-green);
            letter-spacing: -0.02em;
        }

        .hiring-progress {
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
            overflow: hidden;
        }

        .hiring-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-green) 0%, #6fdc66 100%);
            border-radius: 3px;
            transition: width var(--duration-normal);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .org-level {
                gap: var(--space-4);
            }

            .org-card {
                min-width: 180px;
                max-width: 200px;
            }

            .hiring-grid, .teams-grid, .revenue-grid, .health-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .kanban-board {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .org-level {
                flex-direction: column;
                align-items: center;
            }

            .org-card {
                width: 100%;
                max-width: 300px;
            }

            .hiring-grid, .teams-grid, .revenue-grid, .health-grid {
                grid-template-columns: 1fr;
            }

            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
`;


