// Admin Panel Sections - HEARST Executive Cockpit Content

export function renderAdminPanelSection(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            return getDashboardSectionHTML();
        case 'structure':
            return getStructureSectionHTML();
        case 'health':
            return getHealthSectionHTML();
        case 'teams':
            return getTeamsSectionHTML();
        case 'actions':
            return getActionsSectionHTML();
        case 'finances':
            return getFinancesSectionHTML();
        case 'documents':
            return getDocumentsSectionHTML();
        case 'reports':
            return getReportsSectionHTML();
        case 'compliance':
            return getComplianceSectionHTML();
        default:
            return getDashboardSectionHTML();
    }
}

function getDashboardSectionHTML() {
    return `<!-- KPI GRID -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Revenu Total</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">$2.4M</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +12.5% vs mois dernier
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Clients Actifs</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">1,247</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +8.3% vs mois dernier
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Taux de Conversion</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">34.2%</div>
                            <div class="kpi-trend trend-negative">
                                ↘ -2.1% vs mois dernier
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Score Satisfaction</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">4.8/5</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +0.3 vs mois dernier
                            </div>
                        </div>
                    </div>

                    <!-- ACTIONS SECTION -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Actions Prioritaires</div>
                            <button class="btn btn-primary">Voir tout</button>
                        </div>

                        <div class="action-item">
                            <div class="action-content">
                                <div class="action-name">Validation budget Q2</div>
                                <div class="action-detail">CFO · Échéance: 18 Nov 2025</div>
                            </div>
                            <span class="action-status status-urgent">URGENT</span>
                        </div>

                        <div class="action-item">
                            <div class="action-content">
                                <div class="action-name">Révision stratégie marketing</div>
                                <div class="action-detail">CMO · Échéance: 22 Nov 2025</div>
                            </div>
                            <span class="action-status status-pending">EN COURS</span>
                        </div>

                        <div class="action-item">
                            <div class="action-content">
                                <div class="action-name">Recrutement Senior Dev</div>
                                <div class="action-detail">RH · Échéance: 15 Nov 2025</div>
                            </div>
                            <span class="action-status status-done">TERMINÉ</span>
                        </div>
                    </div>

                    <!-- STATISTICS TABLE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Performance par Département</div>
                            <button class="btn btn-secondary">Exporter</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Département</th>
                                    <th>Budget</th>
                                    <th>Dépenses</th>
                                    <th>Progression</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Engineering</td>
                                    <td>$850K</td>
                                    <td>$720K</td>
                                    <td>84.7%</td>
                                    <td><span class="badge badge-success">On Track</span></td>
                                </tr>
                                <tr>
                                    <td>Marketing</td>
                                    <td>$450K</td>
                                    <td>$410K</td>
                                    <td>91.1%</td>
                                    <td><span class="badge badge-warning">Attention</span></td>
                                </tr>
                                <tr>
                                    <td>Sales</td>
                                    <td>$320K</td>
                                    <td>$285K</td>
                                    <td>89.1%</td>
                                    <td><span class="badge badge-success">On Track</span></td>
                                </tr>
                                <tr>
                                    <td>Operations</td>
                                    <td>$280K</td>
                                    <td>$195K</td>
                                    <td>69.6%</td>
                                    <td><span class="badge badge-success">On Track</span></td>
                                </tr>
                                <tr>
                                    <td>Support</td>
                                    <td>$180K</td>
                                    <td>$172K</td>
                                    <td>95.6%</td>
                                    <td><span class="badge badge-danger">Risk</span></td>
                                </tr>
                            </tbody>
                        </table>`;
}

function getStructureSectionHTML() {
    return `<!-- KPI STRUCTURE -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Effectif Total</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">247</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +15 ce trimestre
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Départements</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">12</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +2 ce trimestre
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Taux de Rétention</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">94.3%</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +2.1% vs année N-1
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Postes Ouverts</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">18</div>
                            <div class="kpi-trend trend-negative">
                                ↘ 6 en attente depuis 30j+
                            </div>
                        </div>
                    </div>

                    <!-- ORGANIGRAMME SECTION -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Organigramme Exécutif</div>
                            <button class="btn btn-secondary">Vue Détaillée</button>
                        </div>

                        <div class="org-chart">
                            <!-- CEO Level -->
                            <div class="org-level">
                                <div class="org-card org-card-ceo">
                                    <div class="org-avatar" style="background: linear-gradient(135deg, var(--primary-green) 0%, #6fdc66 100%);">JD</div>
                                    <div class="org-info">
                                        <div class="org-name">John Doe</div>
                                        <div class="org-title">CEO & Founder</div>
                                    </div>
                                    <div class="org-team">247 personnes</div>
                                </div>
                            </div>

                            <!-- C-Level -->
                            <div class="org-level org-level-2">
                                <div class="org-card">
                                    <div class="org-avatar">SA</div>
                                    <div class="org-info">
                                        <div class="org-name">Sarah Anderson</div>
                                        <div class="org-title">CTO</div>
                                    </div>
                                    <div class="org-team">78 personnes</div>
                                </div>

                                <div class="org-card">
                                    <div class="org-avatar">MJ</div>
                                    <div class="org-info">
                                        <div class="org-name">Michael Johnson</div>
                                        <div class="org-title">CFO</div>
                                    </div>
                                    <div class="org-team">32 personnes</div>
                                </div>

                                <div class="org-card">
                                    <div class="org-avatar">EW</div>
                                    <div class="org-info">
                                        <div class="org-name">Emily White</div>
                                        <div class="org-title">CMO</div>
                                    </div>
                                    <div class="org-team">45 personnes</div>
                                </div>

                                <div class="org-card">
                                    <div class="org-avatar">DL</div>
                                    <div class="org-info">
                                        <div class="org-name">David Lee</div>
                                        <div class="org-title">COO</div>
                                    </div>
                                    <div class="org-team">52 personnes</div>
                                </div>

                                <div class="org-card">
                                    <div class="org-avatar">LM</div>
                                    <div class="org-info">
                                        <div class="org-name">Lisa Martinez</div>
                                        <div class="org-title">CHRO</div>
                                    </div>
                                    <div class="org-team">18 personnes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DÉPARTEMENTS TABLE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Vue par Département</div>
                            <button class="btn btn-primary">Ajouter Département</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Département</th>
                                    <th>Responsable</th>
                                    <th>Effectif</th>
                                    <th>Budget Annuel</th>
                                    <th>Postes Ouverts</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Engineering</strong></td>
                                    <td>Sarah Anderson</td>
                                    <td>78</td>
                                    <td>$8.5M</td>
                                    <td>7</td>
                                    <td><span class="badge badge-success">Croissance</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Finance</strong></td>
                                    <td>Michael Johnson</td>
                                    <td>32</td>
                                    <td>$3.2M</td>
                                    <td>2</td>
                                    <td><span class="badge badge-success">Stable</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Marketing</strong></td>
                                    <td>Emily White</td>
                                    <td>45</td>
                                    <td>$4.5M</td>
                                    <td>4</td>
                                    <td><span class="badge badge-warning">Recrutement</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Operations</strong></td>
                                    <td>David Lee</td>
                                    <td>52</td>
                                    <td>$5.2M</td>
                                    <td>3</td>
                                    <td><span class="badge badge-success">Stable</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Human Resources</strong></td>
                                    <td>Lisa Martinez</td>
                                    <td>18</td>
                                    <td>$1.8M</td>
                                    <td>1</td>
                                    <td><span class="badge badge-success">Stable</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Sales</strong></td>
                                    <td>Robert Chen</td>
                                    <td>38</td>
                                    <td>$3.8M</td>
                                    <td>5</td>
                                    <td><span class="badge badge-warning">Expansion</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Product</strong></td>
                                    <td>Anna Schmidt</td>
                                    <td>28</td>
                                    <td>$2.8M</td>
                                    <td>3</td>
                                    <td><span class="badge badge-success">Croissance</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Customer Success</strong></td>
                                    <td>James Wilson</td>
                                    <td>24</td>
                                    <td>$2.4M</td>
                                    <td>2</td>
                                    <td><span class="badge badge-success">Stable</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Legal</strong></td>
                                    <td>Patricia Brown</td>
                                    <td>8</td>
                                    <td>$1.2M</td>
                                    <td>0</td>
                                    <td><span class="badge badge-success">Complet</span></td>
                                </tr>
                                <tr>
                                    <td><strong>IT & Security</strong></td>
                                    <td>Kevin Park</td>
                                    <td>15</td>
                                    <td>$1.8M</td>
                                    <td>1</td>
                                    <td><span class="badge badge-success">Stable</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- HIRING PIPELINE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Pipeline de Recrutement</div>
                            <button class="btn btn-secondary">Voir Candidats</button>
                        </div>

                        <div class="hiring-grid">
                            <div class="hiring-stage">
                                <div class="hiring-stage-header">
                                    <div class="hiring-stage-title">Postes Publiés</div>
                                    <div class="hiring-stage-count">18</div>
                                </div>
                                <div class="hiring-progress">
                                    <div class="hiring-progress-bar" style="width: 100%;"></div>
                                </div>
                            </div>

                            <div class="hiring-stage">
                                <div class="hiring-stage-header">
                                    <div class="hiring-stage-title">Candidatures Reçues</div>
                                    <div class="hiring-stage-count">142</div>
                                </div>
                                <div class="hiring-progress">
                                    <div class="hiring-progress-bar" style="width: 85%;"></div>
                                </div>
                            </div>

                            <div class="hiring-stage">
                                <div class="hiring-stage-header">
                                    <div class="hiring-stage-title">Entretiens Programmés</div>
                                    <div class="hiring-stage-count">38</div>
                                </div>
                                <div class="hiring-progress">
                                    <div class="hiring-progress-bar" style="width: 60%;"></div>
                                </div>
                            </div>

                            <div class="hiring-stage">
                                <div class="hiring-stage-header">
                                    <div class="hiring-stage-title">Offres Envoyées</div>
                                    <div class="hiring-stage-count">12</div>
                                </div>
                                <div class="hiring-progress">
                                    <div class="hiring-progress-bar" style="width: 40%;"></div>
                                </div>
                            </div>

                            <div class="hiring-stage">
                                <div class="hiring-stage-header">
                                    <div class="hiring-stage-title">Acceptées</div>
                                    <div class="hiring-stage-count">8</div>
                                </div>
                                <div class="hiring-progress">
                                    <div class="hiring-progress-bar" style="width: 25%;"></div>
                                </div>
                            </div>
                        </div>`;
}

function getHealthSectionHTML() {
    return `<!-- KPI HEALTH -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Score Global</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">92/100</div>
                            <div class="kpi-trend trend-positive">
                                ↗ Excellent état général
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Systèmes Actifs</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">47/48</div>
                            <div class="kpi-trend trend-positive">
                                ↗ 98% disponibilité
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Incidents Actifs</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">3</div>
                            <div class="kpi-trend trend-negative">
                                ↘ 2 critiques en cours
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Temps de Résolution</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">2.4h</div>
                            <div class="kpi-trend trend-positive">
                                ↗ -15% vs mois dernier
                            </div>
                        </div>
                    </div>

                    <!-- SYSTEM HEALTH GRID -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">État des Systèmes</div>
                            <button class="btn btn-secondary">Rafraîchir</button>
                        </div>

                        <div class="health-grid">
                            <div class="health-card health-status-operational">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-success">Opérationnel</div>
                                </div>
                                <div class="health-name">API Gateway</div>
                                <div class="health-metric">
                                    <span class="health-value">99.98%</span>
                                    <span class="health-label">Uptime</span>
                                </div>
                                <div class="health-detail">Latence: 45ms</div>
                            </div>

                            <div class="health-card health-status-operational">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-success">Opérationnel</div>
                                </div>
                                <div class="health-name">Database Cluster</div>
                                <div class="health-metric">
                                    <span class="health-value">99.95%</span>
                                    <span class="health-label">Uptime</span>
                                </div>
                                <div class="health-detail">Charge: 67%</div>
                            </div>

                            <div class="health-card health-status-degraded">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-warning">Dégradé</div>
                                </div>
                                <div class="health-name">Cache Layer</div>
                                <div class="health-metric">
                                    <span class="health-value">94.2%</span>
                                    <span class="health-label">Performance</span>
                                </div>
                                <div class="health-detail">Hit ratio faible</div>
                            </div>

                            <div class="health-card health-status-operational">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-success">Opérationnel</div>
                                </div>
                                <div class="health-name">Message Queue</div>
                                <div class="health-metric">
                                    <span class="health-value">100%</span>
                                    <span class="health-label">Processing</span>
                                </div>
                                <div class="health-detail">0 messages en attente</div>
                            </div>

                            <div class="health-card health-status-operational">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                            <path d="M2 17l10 5 10-5"></path>
                                            <path d="M2 12l10 5 10-5"></path>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-success">Opérationnel</div>
                                </div>
                                <div class="health-name">CDN Network</div>
                                <div class="health-metric">
                                    <span class="health-value">99.99%</span>
                                    <span class="health-label">Uptime</span>
                                </div>
                                <div class="health-detail">23 PoP actifs</div>
                            </div>

                            <div class="health-card health-status-critical">
                                <div class="health-card-header">
                                    <div class="health-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <div class="health-status-badge badge-danger">Critique</div>
                                </div>
                                <div class="health-name">Security Firewall</div>
                                <div class="health-metric">
                                    <span class="health-value">Alert</span>
                                    <span class="health-label">DDoS détecté</span>
                                </div>
                                <div class="health-detail">Investigation en cours</div>
                            </div>
                        </div>
                    </div>

                    <!-- INCIDENTS TABLE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Incidents & Alertes</div>
                            <button class="btn btn-primary">Créer Incident</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Système</th>
                                    <th>Description</th>
                                    <th>Sévérité</th>
                                    <th>Assigné</th>
                                    <th>Durée</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>#INC-2847</strong></td>
                                    <td>Security Firewall</td>
                                    <td>Attaque DDoS détectée sur le endpoint /api</td>
                                    <td><span class="badge badge-danger">Critique</span></td>
                                    <td>Security Team</td>
                                    <td>12 min</td>
                                    <td><span class="badge badge-warning">En cours</span></td>
                                </tr>
                                <tr>
                                    <td><strong>#INC-2846</strong></td>
                                    <td>Cache Layer</td>
                                    <td>Performance dégradée - Hit ratio sous 95%</td>
                                    <td><span class="badge badge-warning">Moyen</span></td>
                                    <td>DevOps</td>
                                    <td>1h 24min</td>
                                    <td><span class="badge badge-warning">En cours</span></td>
                                </tr>
                                <tr>
                                    <td><strong>#INC-2845</strong></td>
                                    <td>Database Cluster</td>
                                    <td>Réplication lag détecté sur replica-03</td>
                                    <td><span class="badge badge-info">Faible</span></td>
                                    <td>DBA Team</td>
                                    <td>3h 15min</td>
                                    <td><span class="badge badge-warning">Investigation</span></td>
                                </tr>
                                <tr>
                                    <td><strong>#INC-2844</strong></td>
                                    <td>API Gateway</td>
                                    <td>Pic de latence sur endpoint /users</td>
                                    <td><span class="badge badge-warning">Moyen</span></td>
                                    <td>Backend Team</td>
                                    <td>Résolu</td>
                                    <td><span class="badge badge-success">Résolu</span></td>
                                </tr>
                                <tr>
                                    <td><strong>#INC-2843</strong></td>
                                    <td>CDN Network</td>
                                    <td>PoP Paris temporairement indisponible</td>
                                    <td><span class="badge badge-info">Faible</span></td>
                                    <td>Infrastructure</td>
                                    <td>Résolu</td>
                                    <td><span class="badge badge-success">Résolu</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- METRICS MONITORING -->
                    <div class="metrics-grid">
                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">CPU Usage</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">67%</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 67%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">8 cores / 12 cores utilisés</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Memory Usage</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">42%</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 42%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">13.4 GB / 32 GB utilisés</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Disk Usage</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">78%</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 78%; background: #ffa500;"></div>
                                </div>
                                <div class="metric-label">1.56 TB / 2 TB utilisés</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Network Throughput</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">5.2 Gbps</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 52%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">52% de la capacité max</div>
                            </div>
                        </div>`;
}

function getTeamsSectionHTML() {
    return `<!-- KPI TEAMS -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Équipes Actives</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">34</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +6 ce trimestre
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Membres Total</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">247</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +15 ce mois
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Performance Moyenne</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">4.2/5</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +0.3 vs trimestre N-1
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Taux de Collaboration</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">89%</div>
                            <div class="kpi-trend trend-positive">
                                ↗ Excellent engagement
                            </div>
                        </div>
                    </div>

                    <!-- TEAMS GRID -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Équipes Principales</div>
                            <button class="btn btn-primary">Créer Équipe</button>
                        </div>

                        <div class="teams-grid">
                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">SA</div>
                                        <div class="team-avatar">MK</div>
                                        <div class="team-avatar">JL</div>
                                        <div class="team-avatar-more">+12</div>
                                    </div>
                                </div>
                                <div class="team-name">Engineering Core</div>
                                <div class="team-lead">Lead: Sarah Anderson</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">15</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">24</div>
                                        <div class="team-stat-label">Projets</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">94%</div>
                                        <div class="team-stat-label">Performance</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">Backend</span>
                                    <span class="tag">API</span>
                                    <span class="tag">DevOps</span>
                                </div>
                            </div>

                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">EW</div>
                                        <div class="team-avatar">TC</div>
                                        <div class="team-avatar">RL</div>
                                        <div class="team-avatar-more">+8</div>
                                    </div>
                                </div>
                                <div class="team-name">Marketing Growth</div>
                                <div class="team-lead">Lead: Emily White</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">11</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">18</div>
                                        <div class="team-stat-label">Campagnes</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">91%</div>
                                        <div class="team-stat-label">Performance</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">Digital</span>
                                    <span class="tag">Content</span>
                                    <span class="tag">SEO</span>
                                </div>
                            </div>

                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">AS</div>
                                        <div class="team-avatar">BP</div>
                                        <div class="team-avatar">CN</div>
                                        <div class="team-avatar-more">+7</div>
                                    </div>
                                </div>
                                <div class="team-name">Product Design</div>
                                <div class="team-lead">Lead: Anna Schmidt</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">10</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">32</div>
                                        <div class="team-stat-label">Features</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">96%</div>
                                        <div class="team-stat-label">Performance</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">UI/UX</span>
                                    <span class="tag">Research</span>
                                    <span class="tag">Prototype</span>
                                </div>
                            </div>

                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">RC</div>
                                        <div class="team-avatar">DM</div>
                                        <div class="team-avatar">FK</div>
                                        <div class="team-avatar-more">+9</div>
                                    </div>
                                </div>
                                <div class="team-name">Sales Enterprise</div>
                                <div class="team-lead">Lead: Robert Chen</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">12</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">$2.4M</div>
                                        <div class="team-stat-label">Pipeline</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">88%</div>
                                        <div class="team-stat-label">Quota</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">B2B</span>
                                    <span class="tag">Enterprise</span>
                                    <span class="tag">Global</span>
                                </div>
                            </div>

                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">JW</div>
                                        <div class="team-avatar">LP</div>
                                        <div class="team-avatar">MT</div>
                                        <div class="team-avatar-more">+5</div>
                                    </div>
                                </div>
                                <div class="team-name">Customer Success</div>
                                <div class="team-lead">Lead: James Wilson</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">8</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">247</div>
                                        <div class="team-stat-label">Clients</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">4.8/5</div>
                                        <div class="team-stat-label">Satisfaction</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">Support</span>
                                    <span class="tag">Onboarding</span>
                                    <span class="tag">Training</span>
                                </div>
                            </div>

                            <div class="team-card">
                                <div class="team-header">
                                    <div class="team-avatar-group">
                                        <div class="team-avatar">KP</div>
                                        <div class="team-avatar">NR</div>
                                        <div class="team-avatar">OS</div>
                                        <div class="team-avatar-more">+3</div>
                                    </div>
                                </div>
                                <div class="team-name">Infrastructure</div>
                                <div class="team-lead">Lead: Kevin Park</div>
                                <div class="team-stats">
                                    <div class="team-stat">
                                        <div class="team-stat-value">6</div>
                                        <div class="team-stat-label">Membres</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">99.98%</div>
                                        <div class="team-stat-label">Uptime</div>
                                    </div>
                                    <div class="team-stat">
                                        <div class="team-stat-value">92%</div>
                                        <div class="team-stat-label">Performance</div>
                                    </div>
                                </div>
                                <div class="team-tags">
                                    <span class="tag">Cloud</span>
                                    <span class="tag">Security</span>
                                    <span class="tag">Network</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TOP PERFORMERS -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Top Performers du Mois</div>
                            <button class="btn btn-secondary">Voir Tous</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Rang</th>
                                    <th>Membre</th>
                                    <th>Équipe</th>
                                    <th>Projets Complétés</th>
                                    <th>Score</th>
                                    <th>Badge</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>🥇 1</strong></td>
                                    <td>Sarah Anderson</td>
                                    <td>Engineering Core</td>
                                    <td>12</td>
                                    <td>98/100</td>
                                    <td><span class="badge badge-success">MVP</span></td>
                                </tr>
                                <tr>
                                    <td><strong>🥈 2</strong></td>
                                    <td>Anna Schmidt</td>
                                    <td>Product Design</td>
                                    <td>10</td>
                                    <td>96/100</td>
                                    <td><span class="badge badge-success">Top Designer</span></td>
                                </tr>
                                <tr>
                                    <td><strong>🥉 3</strong></td>
                                    <td>Robert Chen</td>
                                    <td>Sales Enterprise</td>
                                    <td>8</td>
                                    <td>94/100</td>
                                    <td><span class="badge badge-success">Top Closer</span></td>
                                </tr>
                                <tr>
                                    <td><strong>4</strong></td>
                                    <td>Emily White</td>
                                    <td>Marketing Growth</td>
                                    <td>9</td>
                                    <td>92/100</td>
                                    <td><span class="badge badge-info">Rising Star</span></td>
                                </tr>
                                <tr>
                                    <td><strong>5</strong></td>
                                    <td>James Wilson</td>
                                    <td>Customer Success</td>
                                    <td>11</td>
                                    <td>91/100</td>
                                    <td><span class="badge badge-info">Customer Hero</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- TEAM PERFORMANCE -->
                    <div class="metrics-grid">
                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Vélocité</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">156</div>
                                <div class="metric-label">Story points / sprint</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Code Quality</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">A+</div>
                                <div class="metric-label">0 issues critiques</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Collaboration</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">89%</div>
                                <div class="metric-label">Taux de participation</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">Satisfaction</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">4.7/5</div>
                                <div class="metric-label">Score moyen équipe</div>
                            </div>
                        </div>`;
}

function getActionsSectionHTML() {
    return `<!-- KPI ACTIONS -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Actions Totales</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">127</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +18 cette semaine
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">En Cours</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">45</div>
                            <div class="kpi-trend trend-positive">
                                ↗ 35% du total
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Urgentes</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">12</div>
                            <div class="kpi-trend trend-negative">
                                ↘ Attention requise
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Taux Complétion</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <polyline points="9 11 12 14 22 4"></polyline>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">87%</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +5% vs semaine N-1
                            </div>
                        </div>
                    </div>

                    <!-- ACTIONS BOARD -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Tableau des Actions</div>
                            <button class="btn btn-primary">Nouvelle Action</button>
                        </div>

                        <div class="kanban-board">
                            <!-- TO DO -->
                            <div class="kanban-column">
                                <div class="kanban-column-header">
                                    <div class="kanban-column-title">À Faire</div>
                                    <div class="kanban-column-count">28</div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-danger">Urgent</span>
                                        <span class="badge badge-info">Finance</span>
                                    </div>
                                    <div class="kanban-card-title">Validation budget Q2 2025</div>
                                    <div class="kanban-card-description">Révision et approbation du budget trimestriel avec le board</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">MJ</div>
                                            <span>Michael Johnson</span>
                                        </div>
                                        <div class="kanban-card-date">18 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-warning">Important</span>
                                        <span class="badge badge-info">Marketing</span>
                                    </div>
                                    <div class="kanban-card-title">Launch campagne Black Friday</div>
                                    <div class="kanban-card-description">Préparation et déploiement de la campagne marketing</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">EW</div>
                                            <span>Emily White</span>
                                        </div>
                                        <div class="kanban-card-date">20 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-info">Tech</span>
                                    </div>
                                    <div class="kanban-card-title">Migration base de données</div>
                                    <div class="kanban-card-description">Planification et exécution de la migration PostgreSQL</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">SA</div>
                                            <span>Sarah Anderson</span>
                                        </div>
                                        <div class="kanban-card-date">22 Nov</div>
                                    </div>
                                </div>
                            </div>

                            <!-- IN PROGRESS -->
                            <div class="kanban-column">
                                <div class="kanban-column-header">
                                    <div class="kanban-column-title">En Cours</div>
                                    <div class="kanban-column-count">45</div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-warning">Important</span>
                                        <span class="badge badge-info">Product</span>
                                    </div>
                                    <div class="kanban-card-title">Design nouveau dashboard</div>
                                    <div class="kanban-card-description">Refonte UI/UX du dashboard principal</div>
                                    <div class="kanban-card-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 65%;"></div>
                                        </div>
                                        <span class="progress-text">65%</span>
                                    </div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">AS</div>
                                            <span>Anna Schmidt</span>
                                        </div>
                                        <div class="kanban-card-date">19 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-info">Sales</span>
                                    </div>
                                    <div class="kanban-card-title">Négociation contrat Enterprise</div>
                                    <div class="kanban-card-description">Deal avec Acme Corp - $250K ARR</div>
                                    <div class="kanban-card-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 80%;"></div>
                                        </div>
                                        <span class="progress-text">80%</span>
                                    </div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">RC</div>
                                            <span>Robert Chen</span>
                                        </div>
                                        <div class="kanban-card-date">18 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-info">HR</span>
                                    </div>
                                    <div class="kanban-card-title">Recrutement Senior Developer</div>
                                    <div class="kanban-card-description">Process de recrutement pour poste backend senior</div>
                                    <div class="kanban-card-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 45%;"></div>
                                        </div>
                                        <span class="progress-text">45%</span>
                                    </div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">LM</div>
                                            <span>Lisa Martinez</span>
                                        </div>
                                        <div class="kanban-card-date">25 Nov</div>
                                    </div>
                                </div>
                            </div>

                            <!-- REVIEW -->
                            <div class="kanban-column">
                                <div class="kanban-column-header">
                                    <div class="kanban-column-title">En Revue</div>
                                    <div class="kanban-column-count">18</div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-info">Tech</span>
                                    </div>
                                    <div class="kanban-card-title">API v2.0 Documentation</div>
                                    <div class="kanban-card-description">Documentation technique complète de la nouvelle API</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">SA</div>
                                            <span>Sarah Anderson</span>
                                        </div>
                                        <div class="kanban-card-date">17 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-info">Marketing</span>
                                    </div>
                                    <div class="kanban-card-title">Blog post Q4 strategy</div>
                                    <div class="kanban-card-description">Article sur la stratégie produit Q4</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">EW</div>
                                            <span>Emily White</span>
                                        </div>
                                        <div class="kanban-card-date">16 Nov</div>
                                    </div>
                                </div>
                            </div>

                            <!-- DONE -->
                            <div class="kanban-column">
                                <div class="kanban-column-header">
                                    <div class="kanban-column-title">Terminé</div>
                                    <div class="kanban-column-count">36</div>
                                </div>

                                <div class="kanban-card kanban-card-done">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-success">Done</span>
                                        <span class="badge badge-info">Operations</span>
                                    </div>
                                    <div class="kanban-card-title">Mise en place monitoring</div>
                                    <div class="kanban-card-description">Déploiement du système de monitoring Grafana</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">DL</div>
                                            <span>David Lee</span>
                                        </div>
                                        <div class="kanban-card-date">15 Nov</div>
                                    </div>
                                </div>

                                <div class="kanban-card kanban-card-done">
                                    <div class="kanban-card-labels">
                                        <span class="badge badge-success">Done</span>
                                        <span class="badge badge-info">Finance</span>
                                    </div>
                                    <div class="kanban-card-title">Rapport mensuel Octobre</div>
                                    <div class="kanban-card-description">Compilation et envoi du rapport financier</div>
                                    <div class="kanban-card-footer">
                                        <div class="kanban-card-assignee">
                                            <div class="avatar-small">MJ</div>
                                            <span>Michael Johnson</span>
                                        </div>
                                        <div class="kanban-card-date">14 Nov</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ACTIONS LIST TABLE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Actions Urgentes</div>
                            <button class="btn btn-secondary">Exporter</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Assigné</th>
                                    <th>Département</th>
                                    <th>Priorité</th>
                                    <th>Échéance</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Validation budget Q2</strong></td>
                                    <td>Michael Johnson</td>
                                    <td>Finance</td>
                                    <td><span class="badge badge-danger">Critique</span></td>
                                    <td>18 Nov 2025</td>
                                    <td><span class="badge badge-warning">À Faire</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Audit sécurité annuel</strong></td>
                                    <td>Kevin Park</td>
                                    <td>IT Security</td>
                                    <td><span class="badge badge-danger">Critique</span></td>
                                    <td>19 Nov 2025</td>
                                    <td><span class="badge badge-warning">En Cours</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Renouvellement contrat AWS</strong></td>
                                    <td>David Lee</td>
                                    <td>Operations</td>
                                    <td><span class="badge badge-warning">Important</span></td>
                                    <td>20 Nov 2025</td>
                                    <td><span class="badge badge-warning">À Faire</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Présentation board Q4</strong></td>
                                    <td>John Doe</td>
                                    <td>Executive</td>
                                    <td><span class="badge badge-danger">Critique</span></td>
                                    <td>22 Nov 2025</td>
                                    <td><span class="badge badge-warning">En Préparation</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Review code base legacy</strong></td>
                                    <td>Sarah Anderson</td>
                                    <td>Engineering</td>
                                    <td><span class="badge badge-warning">Important</span></td>
                                    <td>25 Nov 2025</td>
                                    <td><span class="badge badge-warning">En Cours</span></td>
                                </tr>
                            </tbody>
                        </table>`;
}

function getFinancesSectionHTML() {
    return `<!-- KPI FINANCES -->
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Revenu Annuel</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">$28.4M</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +22.5% vs N-1
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Marge Brute</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">68.3%</div>
                            <div class="kpi-trend trend-positive">
                                ↗ +3.2% vs N-1
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Trésorerie</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">$8.7M</div>
                            <div class="kpi-trend trend-positive">
                                ↗ Runway: 18 mois
                            </div>
                        </div>

                        <div class="kpi-card">
                            <div class="kpi-header">
                                <div class="kpi-label">Burn Rate</div>
                                <div class="kpi-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="kpi-value">$485K</div>
                            <div class="kpi-trend trend-positive">
                                ↗ -8% vs mois N-1
                            </div>
                        </div>
                    </div>

                    <!-- REVENUE BREAKDOWN -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Répartition des Revenus</div>
                            <button class="btn btn-secondary">Export PDF</button>
                        </div>

                        <div class="revenue-grid">
                            <div class="revenue-card">
                                <div class="revenue-icon" style="background: rgba(138, 253, 129, 0.15);">
                                    <svg viewBox="0 0 24 24" stroke="var(--primary-green)" fill="none">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                </div>
                                <div class="revenue-info">
                                    <div class="revenue-label">Abonnements SaaS</div>
                                    <div class="revenue-value">$18.2M</div>
                                    <div class="revenue-percentage">64% du total</div>
                                </div>
                            </div>

                            <div class="revenue-card">
                                <div class="revenue-icon" style="background: rgba(52, 152, 219, 0.15);">
                                    <svg viewBox="0 0 24 24" stroke="#3498db" fill="none">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div class="revenue-info">
                                    <div class="revenue-label">Services Pro</div>
                                    <div class="revenue-value">$6.8M</div>
                                    <div class="revenue-percentage">24% du total</div>
                                </div>
                            </div>

                            <div class="revenue-card">
                                <div class="revenue-icon" style="background: rgba(255, 165, 0, 0.15);">
                                    <svg viewBox="0 0 24 24" stroke="#ffa500" fill="none">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                                <div class="revenue-info">
                                    <div class="revenue-label">Licences Enterprise</div>
                                    <div class="revenue-value">$2.8M</div>
                                    <div class="revenue-percentage">10% du total</div>
                                </div>
                            </div>

                            <div class="revenue-card">
                                <div class="revenue-icon" style="background: rgba(142, 68, 173, 0.15);">
                                    <svg viewBox="0 0 24 24" stroke="#8e44ad" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                    </svg>
                                </div>
                                <div class="revenue-info">
                                    <div class="revenue-label">Autres</div>
                                    <div class="revenue-value">$0.6M</div>
                                    <div class="revenue-percentage">2% du total</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- EXPENSES TABLE -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Dépenses par Catégorie</div>
                            <button class="btn btn-primary">Ajouter Dépense</button>
                        </div>

                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Catégorie</th>
                                    <th>Budget Mensuel</th>
                                    <th>Dépensé Nov</th>
                                    <th>% Budget</th>
                                    <th>Variation</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Salaires & Avantages</strong></td>
                                    <td>$850K</td>
                                    <td>$847K</td>
                                    <td>99.6%</td>
                                    <td><span class="text-success">-0.4%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Infrastructure Cloud</strong></td>
                                    <td>$120K</td>
                                    <td>$132K</td>
                                    <td>110%</td>
                                    <td><span style="color: #ff4444;">+10%</span></td>
                                    <td><span class="badge badge-warning">Over</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Marketing & Ads</strong></td>
                                    <td>$200K</td>
                                    <td>$185K</td>
                                    <td>92.5%</td>
                                    <td><span class="text-success">-7.5%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                                <tr>
                                    <td><strong>R&D</strong></td>
                                    <td>$180K</td>
                                    <td>$176K</td>
                                    <td>97.8%</td>
                                    <td><span class="text-success">-2.2%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Bureaux & Locaux</strong></td>
                                    <td>$80K</td>
                                    <td>$78K</td>
                                    <td>97.5%</td>
                                    <td><span class="text-success">-2.5%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Software & Tools</strong></td>
                                    <td>$45K</td>
                                    <td>$52K</td>
                                    <td>115.6%</td>
                                    <td><span style="color: #ff4444;">+15.6%</span></td>
                                    <td><span class="badge badge-danger">Alert</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Legal & Compliance</strong></td>
                                    <td>$35K</td>
                                    <td>$28K</td>
                                    <td>80%</td>
                                    <td><span class="text-success">-20%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Autres</strong></td>
                                    <td>$25K</td>
                                    <td>$22K</td>
                                    <td>88%</td>
                                    <td><span class="text-success">-12%</span></td>
                                    <td><span class="badge badge-success">OK</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- FINANCIAL METRICS -->
                    <div class="metrics-grid">
                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">MRR (Monthly Recurring)</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">$2.37M</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 92%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">+12.5% MoM growth</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">ARR (Annual Recurring)</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">$28.4M</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 85%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">+22.5% YoY growth</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">CAC (Customer Acquisition)</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">$1,247</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 65%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">-8% vs last quarter</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-header">
                                <div class="section-title">LTV (Lifetime Value)</div>
                            </div>
                            <div class="metric-chart">
                                <div class="metric-value">$18,950</div>
                                <div class="metric-bar">
                                    <div class="metric-bar-fill" style="width: 95%; background: var(--primary-green);"></div>
                                </div>
                                <div class="metric-label">LTV/CAC ratio: 15.2x</div>
                            </div>
                        </div>
                    </div>

                    <!-- CASH FLOW -->
                    <div class="section">
                        <div class="section-header">
                            <div class="section-title">Cash Flow Prévisionnel</div>
                        </div>
                        <div class="cashflow-table">
                            <table class="stats-table">
                                <thead>
                                    <tr>
                                        <th>Mois</th>
                                        <th>Revenus</th>
                                        <th>Dépenses</th>
                                        <th>Net Cash Flow</th>
                                        <th>Trésorerie Fin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Novembre 2025</strong></td>
                                        <td>$2.37M</td>
                                        <td>$1.52M</td>
                                        <td style="color: var(--primary-green);">+$850K</td>
                                        <td>$8.70M</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Décembre 2025</strong></td>
                                        <td>$2.52M</td>
                                        <td>$1.68M</td>
                                        <td style="color: var(--primary-green);">+$840K</td>
                                        <td>$9.54M</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Janvier 2026</strong></td>
                                        <td>$2.48M</td>
                                        <td>$1.55M</td>
                                        <td style="color: var(--primary-green);">+$930K</td>
                                        <td>$10.47M</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Février 2026</strong></td>
                                        <td>$2.61M</td>
                                        <td>$1.58M</td>
                                        <td style="color: var(--primary-green);">+$1.03M</td>
                                        <td>$11.50M</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>`;
}

function getDocumentsSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div class="section-title">Documents</div>
            </div>
            <p style="color: var(--text-secondary); padding: var(--space-8); text-align: center;">
                Gestion documentaire complète - En développement
            </p>
        </div>
    `;
}

function getReportsSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div class="section-title">Reports</div>
            </div>
            <p style="color: var(--text-secondary); padding: var(--space-8); text-align: center;">
                Système de reporting automatisé - En développement
            </p>
        </div>
    `;
}

function getComplianceSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div class="section-title">Compliance Scan</div>
            </div>
            <p style="color: var(--text-secondary); padding: var(--space-8); text-align: center;">
                Audit de conformité réglementaire - En développement
            </p>
        </div>
    `;
}
