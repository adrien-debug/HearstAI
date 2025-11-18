// Cockpit View - Mining Operations Dashboard
// Layout exact du fichier de référence avec Style Guide Home Page (#C5FFA7 Dashboard Green)

export function renderCockpitView() {
    return `
        <div class="cockpit-container">
            
            <!-- Top Bar -->
            <div class="top-bar">
                <div>
                    <div class="page-title">Dashboard</div>
                    <div style="display: flex; align-items: center; gap: 16px; margin-top: 4px;">
                        <div class="header-clock" id="cockpitClock">00:00:00</div>
                        <div class="live-badge">
                            <span class="live-dot"></span>
                            <span>LIVE</span>
                        </div>
                    </div>
                    <div class="page-subtitle">Real-time overview of all operations</div>
                </div>
                
                <div class="top-actions">
                    <button class="action-btn">Refresh</button>
                </div>
            </div>

            <!-- KPI Grid -->
            <div class="kpi-grid">
                <div class="kpi-card neon-accent">
                    <div class="kpi-label">Global Hashrate</div>
                    <div class="kpi-value">0 PH/s</div>
                    <div class="kpi-subtext">Theoretical: 0 PH/s</div>
                    <div class="kpi-subtext positive">Performance: 0%</div>
                </div>

                <div class="kpi-card neon-accent">
                    <div class="kpi-label">BTC Production (24h)</div>
                    <div class="kpi-value">0</div>
                    <div class="kpi-subtext">≈ $0 USD</div>
                    <div class="kpi-subtext positive">+0% vs yesterday</div>
                </div>

                <div class="kpi-card neon-accent">
                    <div class="kpi-label">Total Miners</div>
                    <div class="kpi-value">0</div>
                    <div class="kpi-subtext">Fleet capacity</div>
                    <div class="kpi-subtext">Across 0 hosting providers</div>
                </div>

                <div class="kpi-card neon-accent">
                    <div class="kpi-label">Online Miners</div>
                    <div class="kpi-value text-success">0</div>
                    <div class="kpi-main">MAIN</div>
                    <div class="kpi-subtext positive">0% of fleet</div>
                    <div class="kpi-subtext">Optimal performance</div>
                </div>

                <div class="kpi-card orange-accent pulse">
                    <div class="kpi-label">Degraded Miners</div>
                    <div class="kpi-value text-warning">0</div>
                    <div class="kpi-main">MAIN</div>
                    <div class="kpi-subtext warning">0% of fleet</div>
                    <div class="kpi-subtext">Requires attention</div>
                </div>

                <div class="kpi-card red-accent pulse">
                    <div class="kpi-label">Offline Miners</div>
                    <div class="kpi-value text-danger">0</div>
                    <div class="kpi-main">MAIN</div>
                    <div class="kpi-subtext negative">0% of fleet</div>
                    <div class="kpi-subtext">Under maintenance</div>
                </div>
            </div>

            <!-- Mining Accounts Summary -->
            <div class="transactions-section">
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
                                <td colspan="6" style="text-align: center; padding: 32px 20px; color: rgba(255,255,255,0.4); font-size: 13px;">
                                    No mining accounts data
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Two Column Grid -->
            <div class="two-column-grid">
                <!-- Hosting Provider Status -->
                <div class="transactions-section">
                    <div class="section-header-home">
                        <h3 class="section-title-home">Hosting Provider Status Overview</h3>
                    </div>
                    <div class="table-container">
                        <table class="table table-unified-grid">
                            <thead>
                                <tr>
                                    <th>Hosting Provider</th>
                                    <th>Hashrate</th>
                                    <th>Clients</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #C5FFA7; border-radius: 50%; box-shadow: 0 0 8px rgba(197, 255, 167, 0.5);"></div>
                                            <span style="font-weight: 600;">Enegix</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #4a9eff; border-radius: 50%; box-shadow: 0 0 8px rgba(74, 158, 255, 0.5);"></div>
                                            <span style="font-weight: 600;">GoMining</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #ffa500; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);"></div>
                                            <span style="font-weight: 600;">Cryptominer</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #ff6b9d; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 107, 157, 0.5);"></div>
                                            <span style="font-weight: 600;">50blocks</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge orange">Degraded</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #9b59b6; border-radius: 50%; box-shadow: 0 0 8px rgba(155, 89, 182, 0.5);"></div>
                                            <span style="font-weight: 600;">Bitkern</span>
                                        </div>
                                    </td>
                                    <td>0 PH/s</td>
                                    <td>0 (0%)</td>
                                    <td><span class="status-badge green">Optimal</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #e74c3c; border-radius: 50%; box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);"></div>
                                            <span style="font-weight: 600;">Block Forge</span>
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
                <div class="transactions-section">
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
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #C5FFA7; border-radius: 50%; box-shadow: 0 0 8px rgba(197, 255, 167, 0.5);"></div>
                                            <span>System</span>
                                        </div>
                                    </td>
                                    <td>All miners operational - Optimal performance</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>13:18:42</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #4a9eff; border-radius: 50%; box-shadow: 0 0 8px rgba(74, 158, 255, 0.5);"></div>
                                            <span>Network</span>
                                        </div>
                                    </td>
                                    <td>Hashrate spike detected - Normalized</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>11:45:23</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #ffa500; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 165, 0, 0.5);"></div>
                                            <span>Warning</span>
                                        </div>
                                    </td>
                                    <td>Temperature threshold reached - Cooling active</td>
                                    <td><span class="status-badge orange">Monitoring</span></td>
                                </tr>
                                <tr>
                                    <td>09:12:07</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #ff6b9d; border-radius: 50%; box-shadow: 0 0 8px rgba(255, 107, 157, 0.5);"></div>
                                            <span>Maintenance</span>
                                        </div>
                                    </td>
                                    <td>Scheduled maintenance completed successfully</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>07:28:51</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #9b59b6; border-radius: 50%; box-shadow: 0 0 8px rgba(155, 89, 182, 0.5);"></div>
                                            <span>Update</span>
                                        </div>
                                    </td>
                                    <td>Firmware update applied - All systems stable</td>
                                    <td><span class="status-badge green">Resolved</span></td>
                                </tr>
                                <tr>
                                    <td>05:15:33</td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <div style="width: 8px; height: 8px; background: #e74c3c; border-radius: 50%; box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);"></div>
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

            <!-- Performance Charts Grid -->
            <div class="charts-grid">
                
                <!-- Hashrate Performance Chart -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <h2 class="card-title" style="margin: 0;">Live Up Time</h2>
                            <div style="display: flex; gap: 4px; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <button class="time-filter-btn active">Day</button>
                                <button class="time-filter-btn">Week</button>
                                <button class="time-filter-btn">Month</button>
                                <button class="time-filter-btn">Year</button>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="width: 12px; height: 12px; background: #C5FFA7; border-radius: 2px;"></div>
                                <span style="font-size: 12px; color: rgba(255,255,255,0.7);">Live Hashrate</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="width: 12px; height: 12px; background: #4a9eff; border-radius: 2px;"></div>
                                <span style="font-size: 12px; color: rgba(255,255,255,0.7);">Theoretical</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="position: relative; height: 280px; background: rgba(255,255,255,0.02); border-radius: 8px; padding: 16px;">
                        <svg id="chart1" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
                            <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" fill="none" stroke="#4a9eff" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.5" vector-effect="non-scaling-stroke"></polyline>
                            <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" fill="none" stroke="#C5FFA7" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
                        </svg>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">Current</div>
                            <div style="font-size: 18px; font-weight: 700; color: #C5FFA7;">0.0 PH/s</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">7-Day Avg</div>
                            <div style="font-size: 18px; font-weight: 700; color: #fff;">0.0 PH/s</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">Peak</div>
                            <div style="font-size: 18px; font-weight: 700; color: #fff;">0.0 PH/s</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">Efficiency</div>
                            <div style="font-size: 18px; font-weight: 700; color: #C5FFA7;">0%</div>
                        </div>
                    </div>
                </div>

                <!-- Bitcoin Revenue Chart -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <h2 class="card-title" style="margin: 0;">Live Hashrate</h2>
                            <div style="display: flex; gap: 4px; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <button class="time-filter-btn active">Day</button>
                                <button class="time-filter-btn">Week</button>
                                <button class="time-filter-btn">Month</button>
                                <button class="time-filter-btn">Year</button>
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="width: 12px; height: 12px; background: #ffa500; border-radius: 2px;"></div>
                                <span style="font-size: 12px; color: rgba(255,255,255,0.7);">BTC Mined</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="width: 12px; height: 12px; background: #f39c12; border-radius: 2px;"></div>
                                <span style="font-size: 12px; color: rgba(255,255,255,0.7);">Target</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="position: relative; height: 280px; background: rgba(255,255,255,0.02); border-radius: 8px; padding: 16px;">
                        <svg id="chart2" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
                            <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" fill="none" stroke="#f39c12" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.5" vector-effect="non-scaling-stroke"></polyline>
                            <polyline points="0,100 14.28,100 28.57,100 42.85,100 57.14,100 71.42,100 85.71,100 100,100" fill="none" stroke="#ffa500" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></polyline>
                        </svg>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">Today</div>
                            <div style="font-size: 18px; font-weight: 700; color: #ffa500;">0.00 BTC</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">7-Day Total</div>
                            <div style="font-size: 18px; font-weight: 700; color: #fff;">0.00 BTC</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">USD Value</div>
                            <div style="font-size: 18px; font-weight: 700; color: #fff;">$0</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px; text-transform: uppercase;">vs Target</div>
                            <div style="font-size: 18px; font-weight: 700; color: #C5FFA7;">0%</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    `;
}

export const cockpitStyles = '';

