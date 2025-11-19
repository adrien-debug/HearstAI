// Electricity Sections - HEARST Mining Dashboard Content

export function renderElectricitySection(sectionId) {
    switch (sectionId) {
        case 'home':
            return getHomeSectionHTML();
        case 'mining':
            return getMiningSectionHTML();
        case 'electricity':
            return getElectricitySectionHTML();
        case 'contracts':
            return getContractsSectionHTML();
        case 'analytics':
            return getAnalyticsSectionHTML();
        default:
            return getElectricitySectionHTML();
    }
}

function getHomeSectionHTML() {
    return `
        <div class="section">
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value green">$127,589</div>
                    <div class="stat-change">+12.5% from last month</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Workers</div>
                    <div class="stat-value">3,068</div>
                    <div class="stat-change">+5.2% uptime</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Hashrate</div>
                    <div class="stat-value">2,041 TH/s</div>
                    <div class="stat-change">Stable performance</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Electricity Cost</div>
                    <div class="stat-value">$0.063/kWh</div>
                    <div class="stat-change">Optimized rate</div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Recent Activity</h2>
                    <button class="btn btn-secondary">View All</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Contract</th>
                                <th>Workers</th>
                                <th>Revenue</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025-11-18</td>
                                <td>AKT02A</td>
                                <td>55</td>
                                <td>$1,474.70</td>
                                <td><span style="color: var(--primary-green)">Active</span></td>
                            </tr>
                            <tr>
                                <td>2025-11-18</td>
                                <td>AKT06A</td>
                                <td>111</td>
                                <td>$722.95</td>
                                <td><span style="color: var(--primary-green)">Active</span></td>
                            </tr>
                            <tr>
                                <td>2025-11-17</td>
                                <td>LR02</td>
                                <td>2</td>
                                <td>$0.00</td>
                                <td><span style="color: var(--text-muted)">Maintenance</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getMiningSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Mining Operations</h2>
                <button class="btn btn-primary">+ New Operation</button>
            </div>
            <div class="card">
                <p style="color: var(--text-secondary);">Mining operations dashboard coming soon...</p>
            </div>
        </div>
    `;
}

function getElectricitySectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Provider Summary</h2>
            </div>
            
            <div class="card">
                <!-- Filters -->
                <div class="filters">
                    <div class="filter-group">
                        <label for="electricity-start-date">Start Date</label>
                        <input type="date" id="electricity-start-date" name="start_date" value="2025-10-01">
                    </div>
                    <div class="filter-group">
                        <label for="electricity-end-date">End Date</label>
                        <input type="date" id="electricity-end-date" name="end_date" value="2025-10-31">
                    </div>
                    <button class="btn btn-primary">Generate Summary</button>
                    <button class="btn btn-secondary">Last Full Month</button>
                </div>
                
                <!-- Tabs -->
                <div class="tabs">
                    <button class="tab active">Olivier</button>
                    <button class="tab">Enegix</button>
                    <button class="tab">Cryptominers</button>
                    <button class="tab">Bitkern</button>
                </div>
                
                <!-- Table -->
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Contract</th>
                                <th>Hosting Company</th>
                                <th>Workers</th>
                                <th>Power (W)</th>
                                <th>Cost ($/kWh)</th>
                                <th>Uptime (%)</th>
                                <th>Total Cost ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>AKT02A</td>
                                <td>Hearst</td>
                                <td>55</td>
                                <td>3,068</td>
                                <td>$0.06300</td>
                                <td>18.65%</td>
                                <td>$1,474.70</td>
                            </tr>
                            <tr>
                                <td>AKT06A</td>
                                <td>Hearst</td>
                                <td>111</td>
                                <td>3,350</td>
                                <td>$0.06300</td>
                                <td>4.15%</td>
                                <td>$722.95</td>
                            </tr>
                            <tr style="background: rgba(197, 255, 167, 0.1);">
                                <td><strong>Total</strong></td>
                                <td>-</td>
                                <td><strong>166</strong></td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td><strong>$2,197.65</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Chart -->
            <div class="chart-container" style="margin-top: 2rem;">
                <h3 class="card-title">Total Electricity Cost by Contract</h3>
                <canvas id="electricityChart"></canvas>
            </div>
        </div>
    `;
}

function getContractsSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Contracts</h2>
                <button class="btn btn-primary">+ New Contract</button>
            </div>
            <div class="card">
                <p style="color: var(--text-secondary);">Contracts management coming soon...</p>
            </div>
        </div>
    `;
}

function getAnalyticsSectionHTML() {
    return `
        <div class="section">
            <div class="section-header">
                <h2 class="section-title">Analytics</h2>
            </div>
            <div class="card">
                <p style="color: var(--text-secondary);">Analytics dashboard coming soon...</p>
            </div>
        </div>
    `;
}

export function initElectricityChart() {
    const ctx = document.getElementById('electricityChart');
    if (ctx && typeof Chart !== 'undefined') {
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryGreen = rootStyles.getPropertyValue('--primary-green').trim();
        const primaryGrey = rootStyles.getPropertyValue('--primary-grey').trim();
        const textPrimary = rootStyles.getPropertyValue('--text-primary').trim();
        const textSecondary = rootStyles.getPropertyValue('--text-secondary').trim();
        const grey100 = rootStyles.getPropertyValue('--grey-100').trim();
        const radiusMd = rootStyles.getPropertyValue('--radius-md').trim();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AKT02A', 'AKT06A', 'LR02', 'LR06'],
                datasets: [{
                    label: 'Total Cost ($)',
                    data: [1474.70, 722.95, 0, 0],
                    backgroundColor: primaryGreen,
                    borderColor: primaryGreen,
                    borderWidth: 0,
                    borderRadius: parseInt(radiusMd) || 8,
                    hoverBackgroundColor: '#75fc6c',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: primaryGrey,
                        titleColor: textPrimary,
                        bodyColor: textSecondary,
                        borderColor: grey100,
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: parseInt(radiusMd) || 8,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textSecondary,
                            callback: value => '$' + value.toLocaleString()
                        },
                        grid: {
                            color: grey100,
                            drawBorder: false
                        },
                        border: { display: false }
                    },
                    x: {
                        ticks: { color: textSecondary },
                        grid: { display: false },
                        border: { display: false }
                    }
                }
            }
        });
    }
    
    // Initialize tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const parent = this.closest('.tabs');
            if (parent) {
                parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

export function initHome() {
    // Initialize home section if needed
}

