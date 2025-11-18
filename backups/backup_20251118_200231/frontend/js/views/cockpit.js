// Cockpit View - Mining Operations Dashboard
// Recodé from scratch - Structure propre et modulaire

export function renderCockpitView() {
    return `
        <div class="cockpit-view">
            
            <!-- Top Bar -->
            <div class="cockpit-top-bar">
                <div class="cockpit-header">
                    <h1 class="cockpit-title">Claude CI/CD Cockpit</h1>
                    <div class="cockpit-header-meta">
                        <div class="cockpit-clock-container">
                            <div class="cockpit-clock" id="cockpitClock">00:00:00</div>
                            <div class="cockpit-live-badge">
                                <span class="cockpit-live-dot"></span>
                                <span>LIVE</span>
                            </div>
                        </div>
                        <p class="cockpit-subtitle">Real-time overview of all mining operations</p>
                    </div>
                </div>
                <div class="cockpit-actions">
                    <button class="btn btn-secondary cockpit-refresh-btn">
                        <span class="icon-inline" data-icon="refresh"></span>
                        Refresh
                    </button>
                </div>
            </div>

            <!-- KPI Grid - Ultra Premium Boxes -->
            <div class="cockpit-kpi-grid">
                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">Global Hashrate</div>
                        <div class="kpi-box-value">0 PH/s</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item">Theoretical: 0 PH/s</span>
                            <span class="kpi-box-meta-item positive">Performance: 0%</span>
                        </div>
                    </div>
                </div>

                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">BTC Production (24h)</div>
                        <div class="kpi-box-value">0</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item">≈ $0 USD</span>
                            <span class="kpi-box-meta-item positive">+0% vs yesterday</span>
                        </div>
                    </div>
                </div>

                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">Total Miners</div>
                        <div class="kpi-box-value">0</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item">Fleet capacity</span>
                            <span class="kpi-box-meta-item">Across 0 hosting providers</span>
                        </div>
                    </div>
                </div>

                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">Online Miners</div>
                        <div class="kpi-box-value">0</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item positive">0% of fleet</span>
                            <span class="kpi-box-meta-item">Optimal performance</span>
                        </div>
                    </div>
                </div>

                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">Degraded Miners</div>
                        <div class="kpi-box-value">0</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item positive">0% of fleet</span>
                            <span class="kpi-box-meta-item">Requires attention</span>
                        </div>
                    </div>
                </div>

                <div class="kpi-box">
                    <div class="kpi-box-glow"></div>
                    <div class="kpi-box-content">
                        <div class="kpi-box-label">Offline Miners</div>
                        <div class="kpi-box-value">0</div>
                        <div class="kpi-box-meta">
                            <span class="kpi-box-meta-item positive">0% of fleet</span>
                            <span class="kpi-box-meta-item">Under maintenance</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mining Accounts Summary -->
            <div class="cockpit-section">
                <div class="section-header-home">
                    <h3 class="section-title-home">Mining Accounts Summary</h3>
                </div>
                <div class="table-container">
                    <table class="table table-unified-grid">
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Miner Type</th>
                                <th>Real-time</th>
                                <th>Last 24h</th>
                                <th>Active</th>
                                <th>Inactive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="provider-with-dot">
                                        <div class="status-dot green"></div>
                                        <span class="provider-name">Enegix Account #1</span>
                                    </div>
                                </td>
                                <td>Antminer S19 Pro</td>
                                <td>110 TH/s</td>
                                <td>2.64 PH/s</td>
                                <td>24</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="provider-with-dot">
                                        <div class="status-dot green"></div>
                                        <span class="provider-name">GoMining Pool</span>
                                    </div>
                                </td>
                                <td>Antminer S21</td>
                                <td>200 TH/s</td>
                                <td>4.80 PH/s</td>
                                <td>24</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="provider-with-dot">
                                        <div class="status-dot green"></div>
                                        <span class="provider-name">Cryptominer Main</span>
                                    </div>
                                </td>
                                <td>Antminer S19 XP</td>
                                <td>140 TH/s</td>
                                <td>3.36 PH/s</td>
                                <td>24</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Two Column Grid: Hosting Providers & Recent Alerts -->
            <div class="cockpit-two-column-grid">
                
                <!-- Hosting Provider Status -->
                <div class="cockpit-section">
                    <div class="section-header-home">
                        <h3 class="section-title-home">Hosting Provider Status</h3>
                    </div>
                    <div class="table-container">
                        <table class="table table-unified-grid">
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Hashrate</th>
                                    <th>Clients</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">Enegix</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">GoMining</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">Cryptominer</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">50blocks</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">Bitkern</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span class="provider-name">Block Forge</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Alerts -->
                <div class="cockpit-section">
                    <div class="section-header-home">
                        <h3 class="section-title-home">Recent Alerts</h3>
                    </div>
                    <div class="table-container">
                        <table class="table table-unified-grid">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>14:32:15</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>System</span>
                                        </div>
                                    </td>
                                    <td>All miners operational - Optimal performance</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>13:18:42</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>Network</span>
                                        </div>
                                    </td>
                                    <td>Hashrate spike detected - Normalized</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>11:45:23</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>Warning</span>
                                        </div>
                                    </td>
                                    <td>Temperature threshold reached - Cooling active</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>09:12:07</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>Maintenance</span>
                                        </div>
                                    </td>
                                    <td>Scheduled maintenance completed successfully</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>07:28:51</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>Update</span>
                                        </div>
                                    </td>
                                    <td>Firmware update applied - All systems stable</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>05:15:33</td>
                                    <td>
                                        <div class="provider-with-dot">
                                            <div class="status-dot green"></div>
                                            <span>Critical</span>
                                        </div>
                                    </td>
                                    <td>Power fluctuation detected - Backup systems engaged</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- Charts Grid -->
            <div class="cockpit-charts-grid">
                
                <!-- Hashrate Performance Chart -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Live Hashrate</h2>
                        <div class="chart-controls">
                            <div class="time-filter-container">
                                <button class="time-filter-btn active" data-period="day">Day</button>
                                <button class="time-filter-btn" data-period="week">Week</button>
                                <button class="time-filter-btn" data-period="month">Month</button>
                                <button class="time-filter-btn" data-period="year">Year</button>
                            </div>
                            <div class="chart-legend">
                                <div class="chart-legend-item">
                                    <div class="chart-legend-dot green"></div>
                                    <span class="chart-legend-label">Live Hashrate</span>
                                </div>
                                <div class="chart-legend-item">
                                    <div class="chart-legend-dot blue"></div>
                                    <span class="chart-legend-label">Theoretical</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="280">
                                <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" 
                                    fill="none" stroke="rgba(74, 158, 255, 0.3)" stroke-width="0.5" 
                                    stroke-dasharray="2,2" opacity="0.5" vector-effect="non-scaling-stroke"></polyline>
                                <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" 
                                    fill="none" stroke="var(--primary-green)" stroke-width="0.8" 
                                    stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
                            </svg>
                        </div>
                        <div class="chart-stats-grid">
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">Current</div>
                                <div class="chart-stat-value green">0.0 PH/s</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">7-Day Avg</div>
                                <div class="chart-stat-value">0.0 PH/s</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">Peak</div>
                                <div class="chart-stat-value">0.0 PH/s</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">Efficiency</div>
                                <div class="chart-stat-value green">0%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bitcoin Revenue Chart -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">BTC Production</h2>
                        <div class="chart-controls">
                            <div class="time-filter-container">
                                <button class="time-filter-btn active" data-period="day">Day</button>
                                <button class="time-filter-btn" data-period="week">Week</button>
                                <button class="time-filter-btn" data-period="month">Month</button>
                                <button class="time-filter-btn" data-period="year">Year</button>
                            </div>
                            <div class="chart-legend">
                                <div class="chart-legend-item">
                                    <div class="chart-legend-dot orange"></div>
                                    <span class="chart-legend-label">BTC Mined</span>
                                </div>
                                <div class="chart-legend-item">
                                    <div class="chart-legend-dot orange-dark"></div>
                                    <span class="chart-legend-label">Target</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="280">
                                <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" 
                                    fill="none" stroke="rgba(255, 165, 0, 0.3)" stroke-width="0.5" 
                                    stroke-dasharray="2,2" opacity="0.5" vector-effect="non-scaling-stroke"></polyline>
                                <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" 
                                    fill="none" stroke="var(--cockpit-orange, #ffa500)" stroke-width="0.8" 
                                    stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
                            </svg>
                        </div>
                        <div class="chart-stats-grid">
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">Today</div>
                                <div class="chart-stat-value" style="color: var(--cockpit-orange, #ffa500);">0.00 BTC</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">7-Day Total</div>
                                <div class="chart-stat-value">0.00 BTC</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">USD Value</div>
                                <div class="chart-stat-value">$0</div>
                            </div>
                            <div class="chart-stat-item">
                                <div class="chart-stat-label">vs Target</div>
                                <div class="chart-stat-value green">0%</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    `;
}

export const cockpitStyles = '';
