// Collateral Sections - HEARST Design System NEARST
// Toutes les sections du collateral avec design system NEARST (#7bed9f)

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

// Dashboard Section (Mining Page)
function getDashboardSectionHTML() {
    return `
        <div class="page-header">
            <h1 class="page-title">Customer Collateral Management</h1>
            <button class="btn btn-primary">Show details</button>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 16px; gap: 20px;">
            <div class="stat-card" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <div class="stat-label" style="font-size: 11px; margin-bottom: 8px;">TOTAL CLIENTS</div>
                        <div class="stat-value" style="font-size: 42px; line-height: 1; margin-bottom: 8px;">247</div>
                        <div class="stat-change" style="font-size: 12px;">+12 ce mois</div>
                    </div>
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, rgba(123, 237, 159, 0.2) 0%, rgba(69, 212, 131, 0.2) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7bed9f" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">ACTIFS</div>
                        <div style="font-size: 18px; font-weight: 700; color: #7bed9f;">235</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">INACTIFS</div>
                        <div style="font-size: 18px; font-weight: 700; color: var(--text-secondary);">12</div>
                    </div>
                </div>
            </div>
            
            <div class="stat-card" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <div class="stat-label" style="font-size: 11px; margin-bottom: 8px;">AVERAGE HEALTH</div>
                        <div class="stat-value" style="font-size: 42px; line-height: 1; margin-bottom: 8px; color: #7bed9f;">156%</div>
                        <div class="stat-change" style="font-size: 12px; color: #7bed9f;">↗ +3.2% vs last month</div>
                    </div>
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, rgba(123, 237, 159, 0.2) 0%, rgba(69, 212, 131, 0.2) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7bed9f" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">MIN</div>
                        <div style="font-size: 18px; font-weight: 700; color: var(--text-secondary);">98%</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">MAX</div>
                        <div style="font-size: 18px; font-weight: 700; color: #7bed9f;">285%</div>
                    </div>
                </div>
            </div>
            
            <div class="stat-card" style="padding: 24px; position: relative;">
                <div class="stat-label" style="font-size: 11px; margin-bottom: 16px;">CLIENT HEALTH STATUS</div>
                <div style="display: flex; align-items: center; justify-content: center;">
                    <canvas id="expositionChart" style="max-height: 160px; max-width: 160px;"></canvas>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div style="text-align: center;">
                        <div style="font-size: 20px; font-weight: 700; color: #7bed9f; margin-bottom: 2px;">198</div>
                        <div style="font-size: 9px; color: var(--text-muted);">HEALTHY</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 20px; font-weight: 700; color: #45D483; margin-bottom: 2px;">37</div>
                        <div style="font-size: 9px; color: var(--text-muted);">UNHEALTHY</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 20px; font-weight: 700; color: #2D8A5A; margin-bottom: 2px;">12</div>
                        <div style="font-size: 9px; color: var(--text-muted);">EXPOSED</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="cards-grid">
            <div class="kpi-card" style="grid-column: 1 / -1;">
                <div class="kpi-label">USDC & USDT Borrow Rates vs BTC - Provider Comparison</div>
                <div style="margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 19px;">
                    <!-- Vancelian -->
                    <div style="padding: 20px; background: var(--bg-secondary); border-radius: 9px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
                            <span>Vancelian</span>
                            <span style="font-size: 10px; padding: 4px 10px; background: rgba(123, 237, 159, 0.1); border-radius: 12px; color: #7bed9f;">ACTIVE</span>
                        </div>
                        <!-- USDC -->
                        <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #2775CA;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #2775CA; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">$</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDC</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #2775CA; line-height: 1;">3.42%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(39, 117, 202, 0.15); border-radius: 12px; color: #2775CA; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #2775CA; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.35%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.58%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.95%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- USDT -->
                        <div style="padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #26A17B;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #26A17B; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">₮</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDT</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #26A17B; line-height: 1;">3.18%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(38, 161, 123, 0.15); border-radius: 12px; color: #26A17B; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #26A17B; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.12%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.28%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.68%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Morpho -->
                    <div style="padding: 20px; background: var(--bg-secondary); border-radius: 9px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
                            <span>Morpho</span>
                            <span style="font-size: 10px; padding: 4px 10px; background: rgba(123, 237, 159, 0.1); border-radius: 12px; color: #7bed9f;">ACTIVE</span>
                        </div>
                        <!-- USDC -->
                        <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #2775CA;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #2775CA; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">$</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDC</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #2775CA; line-height: 1;">3.24%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(39, 117, 202, 0.15); border-radius: 12px; color: #2775CA; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #2775CA; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.18%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.45%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.82%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- USDT -->
                        <div style="padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #26A17B;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #26A17B; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">₮</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDT</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #26A17B; line-height: 1;">2.98%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(38, 161, 123, 0.15); border-radius: 12px; color: #26A17B; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #26A17B; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">2.85%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.12%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.54%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Compound -->
                    <div style="padding: 20px; background: var(--bg-secondary); border-radius: 9px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
                            <span>Compound</span>
                            <span style="font-size: 10px; padding: 4px 10px; background: rgba(123, 237, 159, 0.1); border-radius: 12px; color: #7bed9f;">ACTIVE</span>
                        </div>
                        <!-- USDC -->
                        <div style="margin-bottom: 16px; padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #2775CA;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #2775CA; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">$</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDC</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #2775CA; line-height: 1;">3.56%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(39, 117, 202, 0.15); border-radius: 12px; color: #2775CA; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #2775CA; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.48%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">3.72%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #2775CA;">4.15%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- USDT -->
                        <div style="padding: 16px; background: var(--bg-hover); border-radius: 8px; border-left: 3px solid #26A17B;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #26A17B; border-radius: 50%; font-size: 14px; font-weight: 700; color: white;">₮</span>
                                    <div>
                                        <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">USDT</div>
                                        <div style="font-size: 8px; color: var(--text-muted);">Current Rate</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                                        <div style="font-size: 24px; font-weight: 700; color: #26A17B; line-height: 1;">3.35%</div>
                                        <span style="font-size: 9px; padding: 3px 8px; background: rgba(38, 161, 123, 0.15); border-radius: 12px; color: #26A17B; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><span style="font-size: 8px;">●</span> LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div style="padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 8px; color: #26A17B; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px;">AVERAGE</div>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.22%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">6M</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.45%</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 2px;">1Y</div>
                                        <div style="font-size: 11px; font-weight: 600; color: #26A17B;">3.88%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="kpi-card" style="grid-column: 1 / -1;">
                <div class="kpi-label">Market Projections & Collateral</div>
                <div style="margin-top: 12px; display: flex; flex-direction: row; gap: 8px;">
                    <div style="padding: 8px; background: rgba(123, 237, 159, 0.05); border-radius: 6px; border-left: 3px solid #7bed9f; flex: 1; min-width: 0;">
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">NEXT 24H FORECAST</div>
                        <div style="font-size: 14px; font-weight: 700; color: #7bed9f;">+2.4%</div>
                        <div style="font-size: 8px; color: var(--text-muted);">Collateral variance</div>
                    </div>
                    <div style="padding: 8px; background: rgba(123, 237, 159, 0.05); border-radius: 6px; border-left: 3px solid #7bed9f; flex: 1; min-width: 0;">
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">7-DAY PROJECTION</div>
                        <div style="font-size: 14px; font-weight: 700; color: #7bed9f;">+5.8%</div>
                        <div style="font-size: 8px; color: var(--text-muted);">Based on Morpho data</div>
                    </div>
                    <div style="padding: 8px; background: rgba(123, 237, 159, 0.05); border-radius: 6px; border-left: 3px solid #7bed9f; flex: 1; min-width: 0;">
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">MONTH OUTLOOK</div>
                        <div style="font-size: 14px; font-weight: 700; color: #7bed9f;">+12.5%</div>
                        <div style="font-size: 8px; color: var(--text-muted);">Volatility: Low (±3.2%)</div>
                    </div>
                    <div style="padding: 8px; background: rgba(123, 237, 159, 0.05); border-radius: 6px; border-left: 3px solid #7bed9f; flex: 1; min-width: 0;">
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">YEAR PROJECTION</div>
                        <div style="font-size: 14px; font-weight: 700; color: #7bed9f;">+45.2%</div>
                        <div style="font-size: 8px; color: var(--text-muted);">Conservative estimate</div>
                    </div>
                </div>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <h2 class="chart-title">Performance Overview</h2>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-dot green"></span>
                            <span>With collateral</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot gray"></span>
                            <span>Without collateral</span>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="miningChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

// Collateral Section (Collateral Page)
function getCollateralSectionHTML() {
    return `
        <div class="page-header" style="margin-bottom: 36px;">
            <div>
                <h1 class="page-title" style="margin-bottom: 8px;">Collateral Management</h1>
                <p style="color: var(--text-muted); font-size: 12px; font-weight: 400;">Manage client positions and collateral across protocols</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" onclick="exportCollateral()" style="display: flex; align-items: center; gap: 8px; padding: 10px 20px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export Data
                </button>
                <button class="btn btn-primary" style="display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #7bed9f 0%, #45D483 100%); box-shadow: 0 4px 12px rgba(123, 237, 159, 0.3);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New Position
                </button>
            </div>
        </div>

        <div class="stats-grid" style="margin-bottom: 36px; gap: 19px;">
            <div class="stat-card" style="background: linear-gradient(135deg, #121212 0%, #161616 100%); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at center, rgba(123, 237, 159, 0.05) 0%, transparent 70%);"></div>
                <div class="stat-label" style="font-size: 11px; font-weight: 500; color: #A3A3A3; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Total BTC Collateral</div>
                <div class="stat-value" style="font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #7bed9f 0%, #45D483 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px;">124.8 BTC</div>
                <div class="stat-change" style="color: #CCCCCC; font-size: 11px; font-weight: 500;">≈ $11,830,400 USD</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #121212 0%, #161616 100%); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at center, rgba(123, 237, 159, 0.05) 0%, transparent 70%);"></div>
                <div class="stat-label" style="font-size: 11px; font-weight: 500; color: #A3A3A3; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">USDT Borrowed</div>
                <div class="stat-value" style="font-size: 32px; font-weight: 700; color: #E8E8E8; margin-bottom: 8px;">$4.2M</div>
                <div class="stat-change" style="color: #7bed9f; font-size: 11px; font-weight: 500;">+35.6% utilization</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #121212 0%, #161616 100%); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at center, rgba(123, 237, 159, 0.05) 0%, transparent 70%);"></div>
                <div class="stat-label" style="font-size: 11px; font-weight: 500; color: #A3A3A3; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">USDC Borrowed</div>
                <div class="stat-value" style="font-size: 32px; font-weight: 700; color: #E8E8E8; margin-bottom: 8px;">$3.6M</div>
                <div class="stat-change" style="color: #7bed9f; font-size: 11px; font-weight: 500;">+30.5% utilization</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #121212 0%, #161616 100%); border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at center, rgba(123, 237, 159, 0.05) 0%, transparent 70%);"></div>
                <div class="stat-label" style="font-size: 11px; font-weight: 500; color: #A3A3A3; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Avg Health Factor</div>
                <div class="stat-value" style="font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #7bed9f 0%, #45D483 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px;">1.68</div>
                <div class="stat-change" style="color: #7bed9f; font-size: 11px; font-weight: 500;">Safe Range</div>
            </div>
        </div>

        <div style="background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-panel-hover) 100%); border-radius: var(--radius-xl); padding: 32px; border: 1px solid rgba(255,255,255,0.05); box-shadow: var(--shadow-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
                <h2 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0;">Collateral Positions</h2>
                <div style="display: flex; gap: 8px;">
                    <button class="filter-btn active" data-filter="all" style="padding: 8px 16px; font-size: 11px;">All</button>
                    <button class="filter-btn" data-filter="safe" style="padding: 8px 16px; font-size: 11px;">Safe</button>
                    <button class="filter-btn" data-filter="at-risk" style="padding: 8px 16px; font-size: 11px;">At Risk</button>
                    <button class="filter-btn" data-filter="exposed" style="padding: 8px 16px; font-size: 11px;">Exposed</button>
                </div>
            </div>
            
            <div id="collateralPositions" style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Positions will be dynamically loaded -->
            </div>
        </div>
    `;
}

// Customers Section
function getCustomersSectionHTML() {
    return `
        <div class="page-header">
            <h1 class="page-title">Customer Management</h1>
            <div style="display: flex; gap: 9px;">
                <button class="btn btn-secondary" onclick="exportCustomers()">⬇ Export</button>
                <button class="btn btn-primary" onclick="addCustomer()">+ Add Customer</button>
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
                <div class="stat-value" style="color: #7bed9f;">235</div>
                <div class="stat-change">$12.4M locked</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Exposure</div>
                <div class="stat-value">$7.8M</div>
                <div class="stat-change">Across 3 protocols</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg. Health Factor</div>
                <div class="stat-value" style="color: #7bed9f;">156%</div>
                <div class="stat-change">Safe range</div>
            </div>
        </div>

        <div class="table-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="table-title">All Customers</h2>
                <div style="display: flex; gap: 9px; align-items: center;">
                    <input type="text" id="searchCustomers" placeholder="Search customers..." 
                        style="padding: 8px 13px; background: var(--bg-secondary); border: 1px solid rgba(255,255,255,0.05); 
                        border-radius: 6px; color: var(--text-primary); font-size: 11px; width: 250px;">
                    <div style="display: flex; gap: 6px;">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="b2c">B2C</button>
                        <button class="filter-btn" data-filter="b2b">B2B</button>
                        <button class="filter-btn" data-filter="other">Other</button>
                    </div>
                </div>
            </div>
            <table class="data-table">
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

        <!-- MODAL DÉTAILLÉ -->
        <div id="customerModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; overflow-y: auto;">
            <div style="max-width: 1400px; margin: 40px auto; padding: 0; background: var(--bg-panel); border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);">
                <!-- Le contenu sera généré dynamiquement -->
            </div>
        </div>
    `;
}

// API Management Section (DeFi Page)
function getAPIManagementSectionHTML() {
    return `
        <div class="page-header">
            <h1 class="page-title">API Management</h1>
        </div>

        <div class="stats-grid" style="margin-bottom: 32px;">
            <div class="stat-card">
                <div class="stat-label">Total API Calls Today</div>
                <div class="stat-value">24,847</div>
                <div class="stat-change">+18.2% vs yesterday</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Active Connections</div>
                <div class="stat-value" style="color: #7bed9f;">3 / 3</div>
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

        <div style="display: grid; gap: 19px;">
            <!-- Vancelian API -->
            <div class="api-block" style="background: var(--bg-panel-hover); border-radius: 10px; padding: 19px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 13px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Vancelian API</h3>
                        <span class="badge healthy" style="font-size: 8px;">ACTIVE</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked onchange="toggleAPI('vancelian', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">ENDPOINT</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">api.vancelian.io</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">CALLS TODAY</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">8,942</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">AVG RESPONSE</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">108ms</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">SUCCESS RATE</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">99.8%</div>
                    </div>
                </div>

                <div style="background: var(--bg-secondary); border-radius: 6px; padding: 13px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 9px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <span>📋</span> Recent Logs
                    </div>
                    <div id="vancelianLogs" style="font-family: Monaco, monospace; font-size: 8px; color: var(--text-muted); line-height: 1.6;">
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:18]</span> GET /rates/usdc - 200 OK - 95ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:15]</span> GET /rates/usdt - 200 OK - 102ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:10]</span> POST /collateral/update - 200 OK - 124ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:05]</span> GET /positions/list - 200 OK - 88ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:01]</span> GET /health - 200 OK - 45ms</div>
                    </div>
                </div>
            </div>

            <!-- Morpho API -->
            <div class="api-block" style="background: var(--bg-panel-hover); border-radius: 10px; padding: 19px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 13px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Morpho API</h3>
                        <span class="badge healthy" style="font-size: 8px;">ACTIVE</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked onchange="toggleAPI('morpho', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">ENDPOINT</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">api.morpho.org</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">CALLS TODAY</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">10,245</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">AVG RESPONSE</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">132ms</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">SUCCESS RATE</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">99.6%</div>
                    </div>
                </div>

                <div style="background: var(--bg-secondary); border-radius: 6px; padding: 13px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 9px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <span>📋</span> Recent Logs
                    </div>
                    <div id="morphoLogs" style="font-family: Monaco, monospace; font-size: 8px; color: var(--text-muted); line-height: 1.6;">
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:22]</span> GET /markets/rates - 200 OK - 118ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:19]</span> GET /borrow/usdc - 200 OK - 145ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:14]</span> GET /borrow/usdt - 200 OK - 128ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:09]</span> POST /positions/sync - 200 OK - 156ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:03]</span> GET /vault/info - 200 OK - 92ms</div>
                    </div>
                </div>
            </div>

            <!-- Compound API -->
            <div class="api-block" style="background: var(--bg-panel-hover); border-radius: 10px; padding: 19px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 13px;">
                        <h3 style="font-size: 14px; font-weight: 600; color: var(--text-primary);">Compound API</h3>
                        <span class="badge healthy" style="font-size: 8px;">ACTIVE</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" checked onchange="toggleAPI('compound', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">ENDPOINT</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">api.compound.finance</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">CALLS TODAY</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">5,660</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">AVG RESPONSE</div>
                        <div style="font-size: 10px; font-weight: 600; color: var(--text-secondary);">141ms</div>
                    </div>
                    <div>
                        <div style="font-size: 8px; color: var(--text-muted); margin-bottom: 4px;">SUCCESS RATE</div>
                        <div style="font-size: 10px; font-weight: 600; color: #7bed9f;">99.7%</div>
                    </div>
                </div>

                <div style="background: var(--bg-secondary); border-radius: 6px; padding: 13px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 9px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <span>📋</span> Recent Logs
                    </div>
                    <div id="compoundLogs" style="font-family: Monaco, monospace; font-size: 8px; color: var(--text-muted); line-height: 1.6;">
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:20]</span> GET /ctoken/cusdc - 200 OK - 135ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:17]</span> GET /ctoken/cusdt - 200 OK - 148ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:12]</span> GET /account/balances - 200 OK - 142ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:07]</span> POST /borrow/execute - 200 OK - 167ms</div>
                        <div style="margin-bottom: 6px;"><span style="color: #7bed9f;">[14:32:02]</span> GET /governance/proposals - 200 OK - 98ms</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

