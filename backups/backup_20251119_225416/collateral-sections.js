// Collateral Sections - HEARST Design System
// Toutes les sections du collateral

export function renderCollateralSection(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            return getDashboardSectionHTML();
        case 'collateral':
            return getCollateralSectionHTML();
        case 'customers':
            return getCustomersSectionHTML();
        case 'api-management':
            return getAPIManagementSectionHTML();
        default:
            return getDashboardSectionHTML();
    }
}

// Dashboard Section
function getDashboardSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div>
                    <h1 class="section-title">Customer Collateral Management</h1>
                    <p class="section-subtitle">Overview & KPIs</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">TOTAL CLIENTS</div>
                    <div class="stat-value">247</div>
                    <div class="stat-change">+12 ce mois</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">AVERAGE HEALTH</div>
                    <div class="stat-value green">156%</div>
                    <div class="stat-change">↗ +3.2% vs last month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">CLIENT HEALTH STATUS</div>
                    <div style="text-align: center; padding: var(--space-4);">
                        <canvas id="expositionChart" style="max-width: 200px; max-height: 200px;"></canvas>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center;">
                            <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--primary-green);">198</div>
                            <div style="font-size: var(--text-xs); color: var(--text-muted);">HEALTHY</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--cockpit-orange);">37</div>
                            <div style="font-size: var(--text-xs); color: var(--text-muted);">UNHEALTHY</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--cockpit-red);">12</div>
                            <div style="font-size: var(--text-xs); color: var(--text-muted);">EXPOSED</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Collateral Section
function getCollateralSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div>
                    <h1 class="section-title">Collateral Management</h1>
                    <p class="section-subtitle">Manage client positions and collateral across protocols</p>
                </div>
                <div style="display: flex; gap: var(--space-3);">
                    <button class="btn btn-secondary" onclick="exportCollateral()">Export Data</button>
                    <button class="btn btn-primary" onclick="addNewPosition()">New Position</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total BTC Collateral</div>
                    <div class="stat-value green">124.8 BTC</div>
                    <div class="stat-change">≈ $11,830,400 USD</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">USDT Borrowed</div>
                    <div class="stat-value">$4.2M</div>
                    <div class="stat-change">+35.6% utilization</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">USDC Borrowed</div>
                    <div class="stat-value">$3.6M</div>
                    <div class="stat-change">+30.5% utilization</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg Health Factor</div>
                    <div class="stat-value green">1.68</div>
                    <div class="stat-change">Safe Range</div>
                </div>
            </div>

            <div class="card">
                <div class="section-header">
                    <h2 class="card-title">Collateral Positions</h2>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="safe">Safe</button>
                        <button class="filter-btn" data-filter="at-risk">At Risk</button>
                        <button class="filter-btn" data-filter="exposed">Exposed</button>
                    </div>
                </div>
                <div id="collateralPositions">
                    <!-- Positions will be dynamically loaded -->
                </div>
            </div>
        </div>
    `;
}

// Customers Section
function getCustomersSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div>
                    <h1 class="section-title">Customer Management</h1>
                    <p class="section-subtitle">All customers</p>
                </div>
                <div style="display: flex; gap: var(--space-2);">
                    <button class="btn btn-secondary" onclick="exportCustomers()">Export</button>
                    <button class="btn btn-primary" onclick="addCustomer()">Add Customer</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Customers</div>
                    <div class="stat-value">247</div>
                    <div class="stat-change">+18 this month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Positions</div>
                    <div class="stat-value green">235</div>
                    <div class="stat-change">$12.4M locked</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Exposure</div>
                    <div class="stat-value">$7.8M</div>
                    <div class="stat-change">Across 3 protocols</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg. Health Factor</div>
                    <div class="stat-value green">156%</div>
                    <div class="stat-change">Safe range</div>
                </div>
            </div>

            <div class="card">
                <div class="section-header">
                    <h2 class="card-title">All Customers</h2>
                    <div style="display: flex; gap: var(--space-2); align-items: center;">
                        <input type="text" id="searchCustomers" name="search_customers" placeholder="Search customers..." 
                            style="padding: var(--space-2) var(--space-3); background: var(--primary-grey); border: 1px solid var(--grey-100); 
                            border-radius: var(--radius-md); color: var(--text-primary); font-size: var(--text-sm); width: 250px;">
                        <div style="display: flex; gap: var(--space-2);">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="b2c">B2C</button>
                            <button class="filter-btn" data-filter="b2b">B2B</button>
                            <button class="filter-btn" data-filter="other">Other</button>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>BTC Wallet</th>
                                <th>ERC-20 Wallet</th>
                                <th>Position Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="customersTable"></tbody>
                    </table>
                </div>
            </div>

            <div id="customerModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; overflow-y: auto;">
                <div style="max-width: 1400px; margin: var(--space-10) auto; padding: var(--space-8); background: var(--primary-grey); border-radius: var(--radius-lg); border: 1px solid var(--grey-100);">
                    <!-- Modal content will be generated dynamically -->
                </div>
            </div>
        </div>
    `;
}

// API Management Section
function getAPIManagementSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <div>
                    <h1 class="section-title">API Management</h1>
                    <p class="section-subtitle">DeFi Protocol APIs</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total API Calls Today</div>
                    <div class="stat-value">24,847</div>
                    <div class="stat-change">+18.2% vs yesterday</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Connections</div>
                    <div class="stat-value green">3 / 3</div>
                    <div class="stat-change">All systems operational</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg Response Time</div>
                    <div class="stat-value">124ms</div>
                    <div class="stat-change">-12ms improvement</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Success Rate</div>
                    <div class="stat-value">99.7%</div>
                    <div class="stat-change">Excellent performance</div>
                </div>
            </div>

            <div style="display: grid; gap: var(--space-6);">
                <!-- Vancelian API -->
                <div class="card">
                    <div class="section-header">
                        <div style="display: flex; align-items: center; gap: var(--space-3);">
                            <h3 class="card-title" style="margin: 0;">Vancelian API</h3>
                            <span class="badge healthy">ACTIVE</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-vancelian" name="vancelian_enabled" checked onchange="toggleAPI('vancelian', this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4);">
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">ENDPOINT</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">api.vancelian.io</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">CALLS TODAY</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">8,942</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">AVG RESPONSE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">108ms</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">SUCCESS RATE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">99.8%</div>
                        </div>
                    </div>
                    <div style="background: var(--grey-100); border-radius: var(--radius-md); padding: var(--space-4);">
                        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-3);">Recent Logs</div>
                        <div id="vancelianLogs" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:18]</span> GET /rates/usdc - 200 OK - 95ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:15]</span> GET /rates/usdt - 200 OK - 102ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:10]</span> POST /collateral/update - 200 OK - 124ms</div>
                        </div>
                    </div>
                </div>

                <!-- Morpho API -->
                <div class="card">
                    <div class="section-header">
                        <div style="display: flex; align-items: center; gap: var(--space-3);">
                            <h3 class="card-title" style="margin: 0;">Morpho API</h3>
                            <span class="badge healthy">ACTIVE</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-morpho" name="morpho_enabled" checked onchange="toggleAPI('morpho', this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4);">
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">ENDPOINT</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">api.morpho.org</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">CALLS TODAY</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">10,245</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">AVG RESPONSE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">132ms</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">SUCCESS RATE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">99.6%</div>
                        </div>
                    </div>
                    <div style="background: var(--grey-100); border-radius: var(--radius-md); padding: var(--space-4);">
                        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-3);">Recent Logs</div>
                        <div id="morphoLogs" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:22]</span> GET /markets/rates - 200 OK - 118ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:19]</span> GET /borrow/usdc - 200 OK - 145ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:14]</span> GET /borrow/usdt - 200 OK - 128ms</div>
                        </div>
                    </div>
                </div>

                <!-- Compound API -->
                <div class="card">
                    <div class="section-header">
                        <div style="display: flex; align-items: center; gap: var(--space-3);">
                            <h3 class="card-title" style="margin: 0;">Compound API</h3>
                            <span class="badge healthy">ACTIVE</span>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="toggle-compound" name="compound_enabled" checked onchange="toggleAPI('compound', this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4);">
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">ENDPOINT</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">api.compound.finance</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">CALLS TODAY</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">5,660</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">AVG RESPONSE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary);">141ms</div>
                        </div>
                        <div>
                            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">SUCCESS RATE</div>
                            <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--primary-green);">99.7%</div>
                        </div>
                    </div>
                    <div style="background: var(--grey-100); border-radius: var(--radius-md); padding: var(--space-4);">
                        <div style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-3);">Recent Logs</div>
                        <div id="compoundLogs" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:20]</span> GET /ctoken/cusdc - 200 OK - 135ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:17]</span> GET /ctoken/cusdt - 200 OK - 148ms</div>
                            <div style="margin-bottom: var(--space-2);"><span style="color: var(--primary-green);">[14:32:12]</span> GET /account/balances - 200 OK - 142ms</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
