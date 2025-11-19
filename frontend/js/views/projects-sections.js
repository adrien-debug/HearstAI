// Projects Sections - Mining Intelligence Platform
// Toutes les sections de projections avec design system HEARST (#C5FFA7)

import { Icons } from '../icons.js';

// Définir window.calculateProjection globalement dès le chargement du module
// pour qu'elle soit disponible même si initCalculator n'a pas encore tourné
if (typeof window !== 'undefined') {
    window.calculateProjection = () => {
        console.log('📊 Calculating projection from projects-sections...');
        // Navigate to results section
        if (window.showProjectionSection) {
            console.log('✅ showProjectionSection available, navigating to results...');
            window.showProjectionSection('results');
        } else {
            console.warn('⚠️ showProjectionSection not available yet, retrying...');
            setTimeout(() => {
                if (window.showProjectionSection) {
                    console.log('✅ showProjectionSection now available, retrying navigation...');
                    window.showProjectionSection('results');
                } else {
                    console.error('❌ showProjectionSection still not available after retry');
                }
            }, 100);
        }
    };
}

// Render projection section content
export function renderProjectionSection(sectionId) {
    const sections = {
        'overview': renderOverviewSection,
        'calculator': renderCalculatorSection,
        'results': renderResultsSection,
        'charts': renderChartsSection,
        'monte-carlo': renderMonteCarloSection,
        'projects': renderProjectsListSection,
        'hardware': renderHardwareSection,
        'energy': renderEnergySection,
        'infrastructure': renderInfrastructureSection
    };
    
    const renderer = sections[sectionId];
    if (renderer) {
        return renderer();
    }
    
    return `<div class="projection-section-placeholder">
        <p>Section ${sectionId} - En cours de développement...</p>
    </div>`;
}

// Helper function pour les cartes de projection (définie AVANT renderOverviewSection)
function renderProjectionCard(name, date, number, hashrate, btc) {
    return `
<div style="background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; cursor: pointer; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); transition: all 0.3s ease;" 
     onmouseover="this.style.borderColor='#C5FFA7'; this.style.transform='translateY(-2px)'" 
     onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">
    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <div>
            <div style="font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 4px;">Projection ${name}</div>
            <div style="font-size: 11px; color: #aaa;">${date}</div>
        </div>
        <div style="width: 32px; height: 32px; background: rgba(197, 255, 167, 0.2); border: 1px solid #C5FFA7; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #C5FFA7; font-weight: 600;">${number}</div>
    </div>
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 11px; color: #aaa;">Hashrate</span>
            <span style="font-size: 14px; font-weight: 600; color: #C5FFA7;">${hashrate}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 11px; color: #aaa;">BTC</span>
            <span style="font-size: 14px; font-weight: 600; color: #fff;">${btc}</span>
        </div>
    </div>
</div>
    `;
}

// Helper function pour les lignes du tableau (définie AVANT renderOverviewSection)
function renderProjectionTableRow(name, date, hashrate, btc, status) {
    const statusColors = {
        'active': { bg: 'rgba(197, 255, 167, 0.15)', color: '#C5FFA7', text: 'Active' },
        'completed': { bg: 'rgba(197, 255, 167, 0.1)', color: '#C5FFA7', text: 'Completed' },
        'pending': { bg: 'rgba(255, 255, 255, 0.1)', color: '#aaa', text: 'Pending' }
    };
    const statusStyle = statusColors[status] || statusColors.pending;
    
    return `
<tr style="cursor: pointer;" onmouseover="this.style.background='rgba(197, 255, 167, 0.03)'" onmouseout="this.style.background='transparent'">
    <td style="font-weight: 600; color: var(--text-primary);">Projection ${name}</td>
    <td style="color: var(--text-secondary);">${date}</td>
    <td style="color: #C5FFA7; font-weight: 600;">${hashrate}</td>
    <td style="color: var(--text-primary); font-weight: 600;">${btc}</td>
    <td>
        <span style="padding: 4px 10px; background: ${statusStyle.bg}; border: 1px solid ${statusStyle.color}; border-radius: 4px; font-size: 10px; font-weight: 700; color: ${statusStyle.color}; text-transform: uppercase;">
            ${statusStyle.text}
        </span>
    </td>
    <td>
        <div style="display: flex; gap: 8px;">
            <button style="padding: 6px 12px; background: rgba(197, 255, 167, 0.1); border: 1px solid #C5FFA7; border-radius: 6px; color: #C5FFA7; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;" 
                    onmouseover="this.style.background='rgba(197, 255, 167, 0.2)'" 
                    onmouseout="this.style.background='rgba(197, 255, 167, 0.1)'">
                View
            </button>
            <button style="padding: 6px 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; color: var(--text-secondary); font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s;" 
                    onmouseover="this.style.borderColor='#C5FFA7'; this.style.color='#C5FFA7'" 
                    onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.color='var(--text-secondary)'">
                Edit
            </button>
        </div>
    </td>
</tr>
    `;
}

// Overview Section - 5 dernières projections + liste complète
function renderOverviewSection() {
    try {
        return `
<div id="overview-section" style="padding: 20px; width: 100%;">
    <!-- Header avec logo -->
    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
        <img src="assets/images/logo.png" alt="HearstAI Logo" style="height: 40px; width: auto; display: block;" />
        <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0;">Lasts Projections</h2>
    </div>
    
    <!-- 5 Boxes des dernières projections -->
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 48px;">
        ${renderProjectionCard('Alpha', '2024-01-15', 1, '2.5 PH/s', '125 BTC')}
        ${renderProjectionCard('Beta', '2024-01-20', 2, '3.2 PH/s', '158 BTC')}
        ${renderProjectionCard('Gamma', '2024-01-25', 3, '1.8 PH/s', '92 BTC')}
        ${renderProjectionCard('Delta', '2024-02-01', 4, '4.1 PH/s', '203 BTC')}
        ${renderProjectionCard('Epsilon', '2024-02-10', 5, '2.9 PH/s', '145 BTC')}
    </div>
    
    <!-- Liste complète des projections -->
    <div style="margin-top: 48px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 700; color: #ffffff;">All Projections</h3>
            <select id="projection-history-select" style="padding: 12px 16px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: #fff; font-size: 14px; cursor: pointer;">
                <option value="">Select a projection from history...</option>
                <option value="proj-2024-01-15">Projection Alpha - 2024-01-15 (2.5 PH/s, 125 BTC)</option>
                <option value="proj-2024-01-20">Projection Beta - 2024-01-20 (3.2 PH/s, 158 BTC)</option>
                <option value="proj-2024-01-25">Projection Gamma - 2024-01-25 (1.8 PH/s, 92 BTC)</option>
                <option value="proj-2024-02-01">Projection Delta - 2024-02-01 (4.1 PH/s, 203 BTC)</option>
                <option value="proj-2024-02-10">Projection Epsilon - 2024-02-10 (2.9 PH/s, 145 BTC)</option>
                <option value="proj-2024-02-15">Projection Zeta - 2024-02-15 (3.5 PH/s, 172 BTC)</option>
                <option value="proj-2024-02-20">Projection Eta - 2024-02-20 (2.1 PH/s, 105 BTC)</option>
                <option value="proj-2024-03-01">Projection Theta - 2024-03-01 (4.8 PH/s, 238 BTC)</option>
                <option value="proj-2024-03-10">Projection Iota - 2024-03-10 (3.8 PH/s, 189 BTC)</option>
                <option value="proj-2024-03-20">Projection Kappa - 2024-03-20 (2.7 PH/s, 134 BTC)</option>
            </select>
        </div>
        
        <div class="table-container">
            <table class="table-premium">
                <thead>
                    <tr>
                        <th>Projection</th>
                        <th>Date</th>
                        <th>Hashrate</th>
                        <th>BTC</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderProjectionTableRow('Alpha', '2024-01-15', '2.5 PH/s', '125 BTC', 'active')}
                    ${renderProjectionTableRow('Beta', '2024-01-20', '3.2 PH/s', '158 BTC', 'active')}
                    ${renderProjectionTableRow('Gamma', '2024-01-25', '1.8 PH/s', '92 BTC', 'completed')}
                    ${renderProjectionTableRow('Delta', '2024-02-01', '4.1 PH/s', '203 BTC', 'active')}
                    ${renderProjectionTableRow('Epsilon', '2024-02-10', '2.9 PH/s', '145 BTC', 'active')}
                    ${renderProjectionTableRow('Zeta', '2024-02-15', '3.5 PH/s', '172 BTC', 'pending')}
                    ${renderProjectionTableRow('Eta', '2024-02-20', '2.1 PH/s', '105 BTC', 'completed')}
                    ${renderProjectionTableRow('Theta', '2024-03-01', '4.8 PH/s', '238 BTC', 'active')}
                    ${renderProjectionTableRow('Iota', '2024-03-10', '3.8 PH/s', '189 BTC', 'active')}
                    ${renderProjectionTableRow('Kappa', '2024-03-20', '2.7 PH/s', '134 BTC', 'pending')}
                </tbody>
            </table>
        </div>
    </div>
</div>
    `;
    } catch (error) {
        console.error('Error in renderOverviewSection:', error);
        return `<div id="overview-section" style="padding: 40px; text-align: center; color: #fff;">
            <p>Error rendering overview: ${error.message}</p>
        </div>`;
    }
}


// Market Metrics
function renderMarketMetrics() {
    return `
        <div class="section-premium">
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 40px;">
                <div style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 20px;">
                    <div style="width: 6px; height: 6px; background: #C5FFA7; border-radius: 50%; animation: pulse 2s infinite;"></div>
                    <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">Updated: <span id="lastUpdate" style="color: var(--text-primary);">Just now</span></span>
                </div>
            </div>
            <div class="metrics-grid">
                ${renderMetricCard('green', 'Bitcoin Price', '$95,000', 'Live market data via CoinGecko API', 'btc')}
                ${renderMetricCard('green', 'Network Hashrate', '742 EH/s', 'Total Bitcoin network computing power', 'hashrate')}
                ${renderMetricCard('green', 'Block Reward', '3.125 BTC', 'Current mining reward (post-halving 2024)', 'reward')}
                ${renderMetricCard('green', 'Average Block Time', '10 min', 'Target block confirmation interval', 'time')}
            </div>
        </div>
    `;
}

function renderMetricCard(color, label, value, description, icon) {
    return `
        <div class="metric-card ${color}">
            <div class="metric-icon-wrapper ${color}">
                <svg fill="#C5FFA7" height="17" viewBox="0 0 24 24" width="17">
                    ${getMetricIcon(icon)}
                </svg>
            </div>
            <span class="metric-label">${label}</span>
            <span class="metric-value ${color}" id="overview${icon}">${value}</span>
            <span class="metric-description">${description}</span>
        </div>
    `;
}

function getMetricIcon(type) {
    const icons = {
        btc: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"></path>',
        hashrate: '<path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>',
        reward: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"></path>',
        time: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>'
    };
    return icons[type] || icons.btc;
}

// Live News Feed
function renderLiveNewsFeed() {
    return `
        <div class="section-premium" style="margin-top: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, rgba(197, 255, 167, 0.2), rgba(197, 255, 167, 0.05)); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(197, 255, 167, 0.3);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5FFA7" stroke-width="2">
                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Live Mining News Feed</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Real-time updates from the mining industry</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(197, 255, 167, 0.1); border: 1px solid #C5FFA7; border-radius: 20px;">
                        <div style="width: 6px; height: 6px; background: #C5FFA7; border-radius: 50%; animation: pulse 2s infinite;"></div>
                        <span style="font-size: 11px; color: #C5FFA7; font-weight: 700;">8 NEW</span>
                    </div>
                    <button onclick="refreshNewsFeed()" class="btn btn-sm btn-secondary">
                        <span class="icon-inline">${getRefreshIcon()}</span> Refresh
                    </button>
                </div>
            </div>
            <div id="newsFeedContainer" style="display: grid; gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 8px;">
                ${renderNewsItems()}
            </div>
        </div>
    `;
}

function getRefreshIcon() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 4V10H7M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20.49 9C19.7969 6.64928 18.4561 4.55098 16.6291 2.97852C14.8021 1.40605 12.5715 0.428193 10.2318 0.165477C7.89212 -0.0972385 5.54415 0.359264 3.46658 1.48781C1.38901 2.61635 -0.33647 4.36619 -1.55929 6.51999M20.49 15C21.1831 17.3507 22.5239 19.449 24.3509 21.0215C26.1779 22.5939 28.4085 23.5718 30.7482 23.8345C33.0879 24.0972 35.4358 23.6407 37.5134 22.5122C39.591 21.3836 41.3165 19.6338 42.5393 17.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

function renderNewsItems() {
    const news = [
        { type: 'NEW ASIC', time: '2 hours ago', title: 'Bitmain Announces S23 Ultra: 700 TH/s at 8.5 J/TH', desc: 'New flagship miner sets industry record for efficiency. Pre-orders starting at $9,200. Expected delivery Q2 2025.', location: 'Beijing, China', company: 'Bitmain Technologies' },
        { type: 'DEPLOYMENT', time: '5 hours ago', title: 'Marathon Digital Expands Texas Facility with 50 MW Capacity', desc: 'Major public miner adds 12,000 new ASICs in West Texas. Secured electricity at $0.038/kWh through long-term PPA.', location: 'Texas, USA', company: 'Marathon Digital' },
        { type: 'MARKET', time: 'Yesterday', title: 'Global Mining Costs Average Drops to $0.065/kWh in Q4 2025', desc: 'Cambridge CBECI reports 12% decrease from Q3. Driven by increased renewable energy adoption.', location: 'CBECI Report', company: '' },
        { type: 'REGULATION', time: 'Yesterday', title: 'Kazakhstan Announces New Tax Incentives for Green Mining', desc: 'Government offers 50% tax reduction for mining operations using 100% renewable energy. Effective January 2026.', location: 'Astana, Kazakhstan', company: 'Government Policy' },
        { type: 'NETWORK', time: '2 days ago', title: 'Network Hashrate Reaches All-Time High of 742 EH/s', desc: 'Bitcoin network computing power continues record growth. Difficulty adjustment expected to increase 8.2%.', location: 'Network Stats', company: '' },
        { type: 'PRICE', time: '3 days ago', title: 'Whatsminer M60S++ Prices Drop 18% Amid Market Competition', desc: 'MicroBT adjusts pricing strategy. Now available at $5,800, down from $7,100. Strong demand from North American operators.', location: 'Shenzhen, China', company: 'MicroBT' }
    ];
    
    return news.map(item => `
        <div class="news-item" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#C5FFA7'" onmouseout="this.style.borderColor='var(--border-color)'">
            <div style="display: flex; gap: 14px;">
                <div style="width: 44px; height: 44px; background: rgba(197, 255, 167, 0.15); border: 1px solid rgba(197, 255, 167, 0.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5FFA7" stroke-width="1.5">
                        <rect x="2" y="4" width="20" height="4" rx="1" stroke-linejoin="round"/>
                        <rect x="2" y="10" width="20" height="4" rx="1" stroke-linejoin="round"/>
                        <rect x="2" y="16" width="20" height="4" rx="1" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                        <span style="padding: 3px 8px; background: rgba(197, 255, 167, 0.15); border: 1px solid #C5FFA7; border-radius: 4px; font-size: 9px; font-weight: 700; color: #C5FFA7; text-transform: uppercase; letter-spacing: 0.5px;">${item.type}</span>
                        <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">${item.time}</span>
                    </div>
                    <h3 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; line-height: 1.4;">${item.title}</h3>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">${item.desc}</p>
                    <div style="display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--text-muted);">
                        <span>📍 ${item.location}</span>
                        ${item.company ? `<span>•</span><span>🏢 ${item.company}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Mining Equipment Accordion
function renderMiningEquipment() {
    return `
        <div class="accordion-section collapsed">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <div class="accordion-title">
                    <svg class="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    Top Mining Equipment
                    <span class="accordion-badge">3 models</span>
                </div>
            </div>
            <div class="accordion-content">
                <p style="font-size: 14px; color: var(--text-muted); font-weight: 500; margin-bottom: 16px;">Latest generation ASIC miners (2025 specifications)</p>
                <div class="table-container">
                    <table class="table-premium">
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Hashrate</th>
                                <th>Efficiency</th>
                                <th>Power</th>
                                <th>Price (2025)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Antminer S23 Hydro</td>
                                <td>605 TH/s</td>
                                <td>9.7 J/TH</td>
                                <td>5,870 W</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$8,500</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Antminer S21 Pro</td>
                                <td>234 TH/s</td>
                                <td>15.0 J/TH</td>
                                <td>3,510 W</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$4,008</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Whatsminer M60S++</td>
                                <td>188 TH/s</td>
                                <td>18.5 J/TH</td>
                                <td>3,478 W</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$5,800</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Mining Pools Accordion
function renderMiningPools() {
    return `
        <div class="accordion-section collapsed">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <div class="accordion-title">
                    <svg class="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    Top Mining Pools
                    <span class="accordion-badge">5 pools</span>
                </div>
            </div>
            <div class="accordion-content">
                <p style="font-size: 14px; color: var(--text-muted); font-weight: 500; margin-bottom: 16px;">Largest Bitcoin mining pools by hashrate share</p>
                <div class="table-container">
                    <table class="table-premium">
                        <thead>
                            <tr>
                                <th>Pool Name</th>
                                <th>Hashrate Share</th>
                                <th>Blocks (24h)</th>
                                <th>Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Foundry USA</td>
                                <td>29.8%</td>
                                <td>42</td>
                                <td style="color: #C5FFA7;">0%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Antpool</td>
                                <td>24.1%</td>
                                <td>34</td>
                                <td>2.5%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">ViaBTC</td>
                                <td>12.3%</td>
                                <td>17</td>
                                <td>4%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">F2Pool</td>
                                <td>11.9%</td>
                                <td>17</td>
                                <td>2.5%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Binance Pool</td>
                                <td>8.2%</td>
                                <td>12</td>
                                <td>0%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Energy Costs Accordion
function renderEnergyCosts() {
    return `
        <div class="accordion-section collapsed">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <div class="accordion-title">
                    <svg class="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    Global Energy Costs
                    <span class="accordion-badge">By region</span>
                </div>
            </div>
            <div class="accordion-content">
                <p style="font-size: 14px; color: var(--text-muted); font-weight: 500; margin-bottom: 16px;">Average electricity costs for mining operations (2025)</p>
                <div class="table-container">
                    <table class="table-premium">
                        <thead>
                            <tr>
                                <th>Region</th>
                                <th>Average Cost</th>
                                <th>Range</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">North America</td>
                                <td>$0.045/kWh</td>
                                <td>$0.03 - $0.08</td>
                                <td><span style="color: #C5FFA7;">Stable</span></td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Central Asia</td>
                                <td>$0.038/kWh</td>
                                <td>$0.025 - $0.055</td>
                                <td><span style="color: #C5FFA7;">Growing</span></td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Europe</td>
                                <td>$0.085/kWh</td>
                                <td>$0.06 - $0.12</td>
                                <td><span style="color: #C5FFA7;">High</span></td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">South America</td>
                                <td>$0.052/kWh</td>
                                <td>$0.035 - $0.075</td>
                                <td><span style="color: #C5FFA7;">Stable</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Network Stats Accordion
function renderNetworkStats() {
    return `
        <div class="accordion-section collapsed">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                <div class="accordion-title">
                    <svg class="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    Network Statistics
                    <span class="accordion-badge">Live data</span>
                </div>
            </div>
            <div class="accordion-content">
                <p style="font-size: 14px; color: var(--text-muted); font-weight: 500; margin-bottom: 16px;">Bitcoin network performance metrics</p>
                <div class="table-container">
                    <table class="table-premium">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                                <th>Change (24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Total Hashrate</td>
                                <td>742 EH/s</td>
                                <td style="color: #C5FFA7;">+2.3%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Difficulty</td>
                                <td>107.3T</td>
                                <td style="color: #C5FFA7;">+1.8%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Avg Block Time</td>
                                <td>9.8 min</td>
                                <td style="color: var(--text-muted);">-0.2%</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Transactions/Block</td>
                                <td>3,247</td>
                                <td style="color: #C5FFA7;">+5.1%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Calculator Section (simplified - will be expanded)
function renderCalculatorSection() {
    return `
        <div class="projection-tab-content active" id="calculator-section">
            <div style="width: 100%; padding: 40px 20px;">
                <!-- Header avec logo -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
                    <img src="assets/images/logo.png" alt="HearstAI Logo" style="height: 40px; width: auto; display: block;" />
                    <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0;">Projection Calculator</h2>
                </div>
                
                <!-- STEPPER NAVIGATION -->
                <div class="stepper-container">
                    <div class="stepper">
                        <!-- Progress Line (behind circles) -->
                        <div class="progress-line-container">
                            <div class="progress-line-bg"></div>
                            <div class="stepper-progress" id="stepperProgress" style="width: 0%;"></div>
                        </div>
                        
                        <div class="step active" data-step="0" onclick="goToStep(0)">
                            <div class="step-circle">1</div>
                            <div class="step-label">CONTEXT &<br>SCENARIO</div>
                        </div>
                        
                        <div class="step" data-step="1" onclick="goToStep(1)">
                            <div class="step-circle">2</div>
                            <div class="step-label">MACHINE<br>SELECTION</div>
                        </div>
                        
                        <div class="step" data-step="2" onclick="goToStep(2)">
                            <div class="step-circle">3</div>
                            <div class="step-label">ENERGY & SITE</div>
                        </div>
                        
                        <div class="step" data-step="3" onclick="goToStep(3)">
                            <div class="step-circle">4</div>
                            <div class="step-label">SCALE &<br>SCHEDULE</div>
                        </div>
                        
                        <div class="step" data-step="4" onclick="goToStep(4)">
                            <div class="step-circle">5</div>
                            <div class="step-label">REVENUE</div>
                        </div>
                        
                        <div class="step" data-step="5" onclick="goToStep(5)">
                            <div class="step-circle">6</div>
                            <div class="step-label">OPEX & FEES</div>
                        </div>
                        
                        <div class="step" data-step="6" onclick="goToStep(6)">
                            <div class="step-circle">7</div>
                            <div class="step-label">FINANCING</div>
                        </div>
                        
                        <div class="step" data-step="7" onclick="goToStep(7)">
                            <div class="step-circle">8</div>
                            <div class="step-label">OUTPUTS</div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTENT AREA WITH GRID -->
                <div class="calculator-content">
                    <div class="calculator-steps">
                        ${renderCalculatorStep0()}
                        ${renderCalculatorStep1()}
                        ${renderCalculatorStep2()}
                        ${renderCalculatorStep3()}
                        ${renderCalculatorStep4()}
                        ${renderCalculatorStep5()}
                        ${renderCalculatorStep6()}
                        ${renderCalculatorStep7()}
                    </div>
                    
                    <!-- SIDEBAR SUMMARY -->
                    ${renderCalculatorSummary()}
                </div>
            </div>
        </div>
    `;
}

// Step 0: Context & Scenario
function renderCalculatorStep0() {
    return `
        <div class="step-content active" id="step-0">
            <div class="param-card">
                <div class="param-card-title">
                    PROJECT INFORMATION
                    <span class="badge badge-green">ALL EDITABLE</span>
                </div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label" for="project-name-input">Project Name</label>
                        <input type="text" id="project-name-input" name="project_name" class="form-input" placeholder="My Mining Project" value="Project Alpha">
                    </div>
                    
                    <div>
                        <label class="form-label" for="project-currency">Currency</label>
                        <select id="project-currency" name="currency" class="form-input">
                            <option value="USD" selected>USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AED">AED (د.إ)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="form-label" for="project-country">Country / Location</label>
                        <input type="text" id="project-country" name="country" class="form-input" placeholder="United States" value="United States">
                    </div>
                    
                    <div>
                        <label class="form-label">Total Budget (Optional)</label>
                        <input type="number" class="form-input" id="totalBudget" name="total_budget" placeholder="2500000" value="2500000">
                        <small style="color: var(--text-muted); font-size: 11px; margin-top: 4px; display: block;">
                            Will help compute max units after machine selection
                        </small>
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">OPERATION TYPE</div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="operationType" value="maas" checked>
                        <div class="radio-card-label">Mining as a Service</div>
                        <div class="radio-card-desc">Hosted by provider</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="operationType" value="self">
                        <div class="radio-card-label">Self-Mining</div>
                        <div class="radio-card-desc">Own operation</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="operationType" value="infra">
                        <div class="radio-card-label">Infrastructure Only</div>
                        <div class="radio-card-desc">Sell capacity</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="operationType" value="hybrid">
                        <div class="radio-card-label">Infra + Mining</div>
                        <div class="radio-card-desc">Mixed model</div>
                    </label>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">PROJECTION HORIZON</div>
                
                <div class="grid-2" style="margin-bottom: 16px;">
                    <div>
                        <label class="form-label">Mode</label>
                        <select class="form-input" id="horizonMode" name="horizon_mode">
                            <option value="YEARS" selected>Years</option>
                            <option value="MONTHS">Months</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="form-label">Duration</label>
                        <input type="number" class="form-input" id="horizonValue" name="horizon_value" value="4" min="1">
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px;" onclick="setHorizon('YEARS', 3)">3 Years</button>
                    <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px;" onclick="setHorizon('YEARS', 4)">4 Years</button>
                    <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px;" onclick="setHorizon('YEARS', 5)">5 Years</button>
                    <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px;" onclick="setHorizon('MONTHS', 12)">12 Months</button>
                    <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px;" onclick="setHorizon('MONTHS', 24)">24 Months</button>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-primary" onclick="nextStep()">Next: Machine Selection →</button>
            </div>
        </div>
    `;
}

// Step 1: Machine Selection
function renderCalculatorStep1() {
    return `
        <div class="step-content" id="step-1">
            <div class="param-card">
                <div class="param-card-title">
                    Select ASIC Model
                    <span class="badge">Market Snapshot: Nov 9, 2025</span>
                </div>
                <div class="param-card-subtitle">
                    Choose your mining hardware. Specs are pre-filled from market data but fully editable.
                </div>
                
                <div class="machine-grid">
                    <div class="machine-card selected" data-machine="s23hydro">
                        <div class="machine-card-header">
                            <div class="machine-name">Antminer S23 Hydro</div>
                            <div class="machine-badge">Popular</div>
                        </div>
                        <div class="machine-specs">
                            <div class="machine-spec">
                                <span class="machine-spec-label">Hashrate</span>
                                <span class="machine-spec-value">605 TH/s</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Power</span>
                                <span class="machine-spec-value">5,870 W</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Efficiency</span>
                                <span class="machine-spec-value">9.7 J/TH</span>
                            </div>
                        </div>
                        <div class="machine-price">
                            Unit Price: <span class="machine-price-value">$8,500</span>
                        </div>
                    </div>

                    <div class="machine-card" data-machine="s21pro">
                        <div class="machine-card-header">
                            <div class="machine-name">Antminer S21 Pro</div>
                            <div class="machine-badge">New</div>
                        </div>
                        <div class="machine-specs">
                            <div class="machine-spec">
                                <span class="machine-spec-label">Hashrate</span>
                                <span class="machine-spec-value">234 TH/s</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Power</span>
                                <span class="machine-spec-value">3,510 W</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Efficiency</span>
                                <span class="machine-spec-value">15.0 J/TH</span>
                            </div>
                        </div>
                        <div class="machine-price">
                            Unit Price: <span class="machine-price-value">$4,008</span>
                        </div>
                    </div>

                    <div class="machine-card" data-machine="m60s">
                        <div class="machine-card-header">
                            <div class="machine-name">Whatsminer M60S++</div>
                        </div>
                        <div class="machine-specs">
                            <div class="machine-spec">
                                <span class="machine-spec-label">Hashrate</span>
                                <span class="machine-spec-value">372 TH/s</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Power</span>
                                <span class="machine-spec-value">7,200 W</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Efficiency</span>
                                <span class="machine-spec-value">19.4 J/TH</span>
                            </div>
                        </div>
                        <div class="machine-price">
                            Unit Price: <span class="machine-price-value">$5,800</span>
                        </div>
                    </div>

                    <div class="machine-card" data-machine="custom">
                        <div class="machine-card-header">
                            <div class="machine-name">Custom Model</div>
                            <div class="machine-badge">Editable</div>
                        </div>
                        <div class="machine-specs">
                            <div class="machine-spec">
                                <span class="machine-spec-label">Hashrate</span>
                                <span class="machine-spec-value">? TH/s</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Power</span>
                                <span class="machine-spec-value">? W</span>
                            </div>
                            <div class="machine-spec">
                                <span class="machine-spec-label">Efficiency</span>
                                <span class="machine-spec-value">? J/TH</span>
                            </div>
                        </div>
                        <div class="machine-price">
                            Unit Price: <span class="machine-price-value">$0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Machine Specifications (Editable)</div>
                
                <div class="grid-4">
                    <div>
                        <label class="form-label">Hashrate (TH/s)</label>
                        <input type="number" class="form-input" id="machineHashrate" name="machine_hashrate" value="605">
                    </div>
                    
                    <div>
                        <label class="form-label">Power Draw (W)</label>
                        <input type="number" class="form-input" id="machinePower" name="machine_power" value="5870">
                    </div>
                    
                    <div>
                        <label class="form-label">Efficiency (J/TH)</label>
                        <input type="number" class="form-input" id="machineEfficiency" name="machine_efficiency" value="9.7" step="0.1">
                    </div>
                    
                    <div>
                        <label class="form-label">Unit Price ($)</label>
                        <input type="number" class="form-input" id="machinePrice" name="machine_price" value="8500">
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: Energy & Site →</button>
            </div>
        </div>
    `;
}

// Step 2: Energy & Site
function renderCalculatorStep2() {
    return `
        <div class="step-content" id="step-2">
            <div class="param-card">
                <div class="param-card-title">Energy Source</div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="energySource" value="grid" checked>
                        <div class="radio-card-label">Grid</div>
                        <div class="radio-card-desc">Standard utility</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="energySource" value="gas">
                        <div class="radio-card-label">Natural Gas</div>
                        <div class="radio-card-desc">On-site generation</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="energySource" value="hydro">
                        <div class="radio-card-label">Hydro</div>
                        <div class="radio-card-desc">Renewable</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="energySource" value="solar">
                        <div class="radio-card-label">Solar + Grid</div>
                        <div class="radio-card-desc">Hybrid</div>
                    </label>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Electricity Tariff (User-Provided)</div>
                
                <div class="grid-3">
                    <div>
                        <label class="form-label">Base Tariff ($/kWh)</label>
                        <input type="number" class="form-input" id="baseTariff" name="base_tariff" value="0.07" step="0.001">
                    </div>
                    
                    <div>
                        <label class="form-label">Demand Charge ($/kW/mo)</label>
                        <input type="number" class="form-input" id="demandCharge" name="demand_charge" value="0" step="0.1">
                    </div>
                    
                    <div>
                        <label class="form-label">Curtailment (% hours)</label>
                        <input type="number" class="form-input" id="curtailment" name="curtailment" value="0" min="0" max="100">
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Site Constraints</div>
                
                <div class="grid-3">
                    <div>
                        <label class="form-label">Max Available Power (MW)</label>
                        <input type="number" class="form-input" id="maxPower" name="max_power" value="10" step="0.1">
                    </div>
                    
                    <div>
                        <label class="form-label">PUE / Cooling Factor</label>
                        <input type="number" class="form-input" id="pue" name="pue" value="1.1" step="0.01">
                    </div>
                    
                    <div>
                        <label class="form-label">VAT on CAPEX (%)</label>
                        <input type="number" class="form-input" id="vatRate" name="vat_rate" value="0" step="0.1">
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: Scale & Schedule →</button>
            </div>
        </div>
    `;
}

// Step 3: Scale & Schedule
function renderCalculatorStep3() {
    return `
        <div class="step-content" id="step-3">
            <div class="param-card">
                <div class="param-card-title">Sizing Mode</div>
                
                <div class="radio-cards" style="grid-template-columns: 1fr 1fr;">
                    <label class="radio-card">
                        <input type="radio" name="sizingMode" value="budget" checked>
                        <div class="radio-card-label">Derive from Budget</div>
                        <div class="radio-card-desc">Auto-calculate unit count</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="sizingMode" value="manual">
                        <div class="radio-card-label">Manual Unit Count</div>
                        <div class="radio-card-desc">Specify exact number</div>
                    </label>
                </div>
            </div>

            <div class="param-card" id="budgetDerivedSection">
                <div class="param-card-title">Budget Allocation</div>
                <div class="param-card-subtitle">
                    Total Budget: $2,500,000 | Machine Price: $8,500/unit
                </div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Budget for Rigs (%)</label>
                        <input type="range" class="form-input" id="rigBudgetPercent" min="0" max="100" value="70">
                        <div style="text-align: center; margin-top: 8px; font-size: 18px; font-weight: 700; color: #C5FFA7;">
                            70% = $1,750,000
                        </div>
                        <div style="text-align: center; margin-top: 4px; font-size: 13px; color: var(--text-muted);">
                            ≈ 206 units
                        </div>
                    </div>
                    
                    <div>
                        <label class="form-label">Budget for Infrastructure (%)</label>
                        <input type="range" class="form-input" id="infraBudgetPercent" min="0" max="100" value="30">
                        <div style="text-align: center; margin-top: 8px; font-size: 18px; font-weight: 700; color: #C5FFA7;">
                            30% = $750,000
                        </div>
                        <div style="text-align: center; margin-top: 4px; font-size: 13px; color: var(--text-muted);">
                            Site, power, cooling
                        </div>
                    </div>
                </div>
            </div>

            <div class="param-card" id="manualCountSection" style="display: none;">
                <div class="param-card-title">Manual Configuration</div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Number of Units</label>
                        <input type="number" class="form-input" id="manualUnits" value="200" min="1">
                    </div>
                    
                    <div>
                        <label class="form-label" for="total-power-display">Total Power (MW)</label>
                        <input type="text" id="total-power-display" name="total_power" class="form-input" value="1.17" disabled>
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Deployment Phases</div>
                <div class="param-card-subtitle">
                    Define when and how many units come online
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid rgba(197, 255, 167, 0.15);">
                            <th style="text-align: left; padding: 10px; font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Phase</th>
                            <th style="text-align: right; padding: 10px; font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Units</th>
                            <th style="text-align: right; padding: 10px; font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Start Month</th>
                            <th style="text-align: right; padding: 10px; font-size: 12px; color: var(--text-muted); text-transform: uppercase;">Ramp (months)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid rgba(197, 255, 167, 0.15);">
                            <td style="padding: 10px; color: var(--text-primary);">Phase 1</td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase1-month" name="phase1_month" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="100"></td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase1-units" name="phase1_units" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="0"></td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase1-percent" name="phase1_percent" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="1"></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; color: var(--text-primary);">Phase 2</td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase2-month" name="phase2_month" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="106"></td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase2-units" name="phase2_units" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="3"></td>
                            <td style="padding: 10px; text-align: right;"><input type="number" id="phase2-percent" name="phase2_percent" style="width: 80px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 6px; padding: 6px; color: var(--text-primary); text-align: right;" value="2"></td>
                        </tr>
                    </tbody>
                </table>
                
                <button class="btn btn-secondary" style="margin-top: 12px; font-size: 12px; padding: 8px 16px;">+ Add Phase</button>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: Revenue →</button>
            </div>
        </div>
    `;
}

// Step 4: Revenue
function renderCalculatorStep4() {
    return `
        <div class="step-content" id="step-4">
            <div class="param-card">
                <div class="param-card-title">
                    BTC Price Scenario
                    <span class="badge">Market Snapshot: Nov 9, 2025</span>
                </div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="btcScenario" value="bear">
                        <div class="radio-card-label">Bear</div>
                        <div class="radio-card-desc">$60,000 → $50,000</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="btcScenario" value="flat" checked>
                        <div class="radio-card-label">Flat</div>
                        <div class="radio-card-desc">$95,000 (current)</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="btcScenario" value="bull">
                        <div class="radio-card-label">Bull</div>
                        <div class="radio-card-desc">$95,000 → $150,000</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="btcScenario" value="custom">
                        <div class="radio-card-label">Custom</div>
                        <div class="radio-card-desc">Define your own</div>
                    </label>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Custom BTC Price (Optional)</div>
                <div class="param-card-subtitle">
                    Define a custom BTC price trajectory over the projection horizon.
                </div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Start Price ($)</label>
                        <input type="number" class="form-input" id="customBtcStart" name="custom_btc_start" value="95000">
                    </div>
                    <div>
                        <label class="form-label">End Price ($)</label>
                        <input type="number" class="form-input" id="customBtcEnd" name="custom_btc_end" value="120000">
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Difficulty Adjustment</div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label" for="initial-difficulty-display">Initial Difficulty</label>
                        <input type="text" id="initial-difficulty-display" name="initial_difficulty" class="form-input" value="120 T" disabled>
                    </div>
                    <div>
                        <label class="form-label">Annual Growth (%)</label>
                        <input type="number" class="form-input" id="difficultyGrowth" name="difficulty_growth" value="10" min="0" max="100">
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: OPEX & Fees →</button>
            </div>
        </div>
    `;
}

// Step 5: OPEX & Fees
function renderCalculatorStep5() {
    return `
        <div class="step-content" id="step-5">
            <div class="param-card">
                <div class="param-card-title">Operational Expenses (Monthly)</div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Staffing ($)</label>
                        <input type="number" class="form-input" id="opexStaffing" name="opex_staffing" value="15000">
                    </div>
                    <div>
                        <label class="form-label">Rent / Site ($)</label>
                        <input type="number" class="form-input" id="opexRent" name="opex_rent" value="5000">
                    </div>
                    <div>
                        <label class="form-label">Maintenance ($)</label>
                        <input type="number" class="form-input" id="opexMaintenance" name="opex_maintenance" value="2000">
                    </div>
                    <div>
                        <label class="form-label">Software ($)</label>
                        <input type="number" class="form-input" id="opexSoftware" name="opex_software" value="1000">
                    </div>
                    <div>
                        <label class="form-label">Other ($)</label>
                        <input type="number" class="form-input" id="opexOther" name="opex_other" value="500">
                    </div>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Pool & Transaction Fees</div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Mining Pool Fee (%)</label>
                        <input type="number" class="form-input" id="poolFee" value="2.5" step="0.1" min="0" max="100">
                    </div>
                    <div>
                        <label class="form-label">Transaction Fee (BTC/block)</label>
                        <input type="number" class="form-input" id="txFee" value="0.000005" step="0.000001">
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: Financing →</button>
            </div>
        </div>
    `;
}

// Step 6: Financing
function renderCalculatorStep6() {
    return `
        <div class="step-content" id="step-6">
            <div class="param-card">
                <div class="param-card-title">Initial Capital</div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="capitalSource" value="equity" checked>
                        <div class="radio-card-label">Equity</div>
                        <div class="radio-card-desc">Self-funded / Investors</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="capitalSource" value="debt">
                        <div class="radio-card-label">Debt</div>
                        <div class="radio-card-desc">Loan / Credit</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="capitalSource" value="mixed">
                        <div class="radio-card-label">Mixed</div>
                        <div class="radio-card-desc">Equity + Debt</div>
                    </label>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Debt Details (If Applicable)</div>
                
                <div class="grid-2">
                    <div>
                        <label class="form-label">Loan Amount ($)</label>
                        <input type="number" class="form-input" id="loanAmount" name="loan_amount" value="0">
                    </div>
                    <div>
                        <label class="form-label">Interest Rate (%)</label>
                        <input type="number" class="form-input" id="interestRate" name="interest_rate" value="0" step="0.1" min="0" max="100">
                    </div>
                    <div>
                        <label class="form-label">Loan Term (Months)</label>
                        <input type="number" class="form-input" id="loanTerm" name="loan_term" value="0" min="0">
                    </div>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Next: Outputs →</button>
            </div>
        </div>
    `;
}

// Step 7: Outputs
function renderCalculatorStep7() {
    return `
        <div class="step-content" id="step-7">
            <div class="param-card">
                <div class="param-card-title">Output Preferences</div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="outputDetail" value="summary" checked>
                        <div class="radio-card-label">Summary</div>
                        <div class="radio-card-desc">Key metrics only</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="outputDetail" value="detailed">
                        <div class="radio-card-label">Detailed</div>
                        <div class="radio-card-desc">Full financial breakdown</div>
                    </label>
                </div>
            </div>

            <div class="param-card">
                <div class="param-card-title">Reporting Frequency</div>
                
                <div class="radio-cards">
                    <label class="radio-card">
                        <input type="radio" name="reportFrequency" value="monthly" checked>
                        <div class="radio-card-label">Monthly</div>
                        <div class="radio-card-desc">Granular data</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="reportFrequency" value="quarterly">
                        <div class="radio-card-label">Quarterly</div>
                        <div class="radio-card-desc">Standard business cycles</div>
                    </label>
                    
                    <label class="radio-card">
                        <input type="radio" name="reportFrequency" value="annually">
                        <div class="radio-card-label">Annually</div>
                        <div class="radio-card-desc">High-level overview</div>
                    </label>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="calculateProjection()">Calculate Projection</button>
            </div>
        </div>
    `;
}

// Summary Panel
function renderCalculatorSummary() {
    return `
        <div class="summary-panel">
            <div class="summary-title">Projection Summary</div>
            
            <div class="summary-item">
                <span class="summary-label">Project</span>
                <span class="summary-value">Project Alpha</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Machine</span>
                <span class="summary-value">S23 Hydro</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Units</span>
                <span class="summary-value">206</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Total Hashrate</span>
                <span class="summary-value">124.6 PH/s</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Total Power</span>
                <span class="summary-value">1.21 MW</span>
            </div>
            
            <div class="summary-item" style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #C5FFA7;">
                <span class="summary-label">Total Budget</span>
                <span class="summary-value highlight">$2,500,000</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Monthly Revenue</span>
                <span class="summary-value">$843,000</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Monthly OPEX</span>
                <span class="summary-value">$322,504</span>
            </div>
            
            <div class="summary-item" style="padding-top: 12px; margin-top: 12px; border-top: 1px solid #C5FFA7;">
                <span class="summary-label">Annual ROI</span>
                <span class="summary-value highlight">57.8%</span>
            </div>
            
            <div class="summary-item">
                <span class="summary-label">Payback</span>
                <span class="summary-value">18 months</span>
            </div>
        </div>
    `;
}

// Results Section
function renderResultsSection() {
    return `
        <div class="projection-tab-content active" id="results-section">
            <!-- ANALYSIS RESULTS HEADER -->
            <div class="section-premium">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <img src="assets/images/logo.png" alt="HearstAI Logo" style="height: 32px; width: auto; display: block;" />
                        <div>
                            <h2 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.5px;">Analysis Results</h2>
                            <p style="font-size: 13px; color: var(--text-muted); font-weight: 500;">Project Alpha • Nov 9, 2025 at 5:55 AM</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button class="btn btn-secondary" onclick="exportResultsPDF()">Export PDF</button>
                        <button class="btn btn-primary" onclick="shareResults()">Share</button>
                    </div>
                </div>

                <!-- KPI METRICS GRID -->
                <div class="metrics-grid">
                    <!-- ANNUAL ROI -->
                    <div class="metric-card green">
                        <div class="metric-icon-wrapper green">
                            ${Icons.results}
                        </div>
                        <span class="metric-label">Annual ROI</span>
                        <span class="metric-value green">57.8%</span>
                        <span class="metric-description">+12.3% vs baseline</span>
                    </div>

                    <!-- TOTAL HASHRATE -->
                    <div class="metric-card green">
                        <div class="metric-icon-wrapper green">
                            ${Icons.hashrate}
                        </div>
                        <span class="metric-label">Total Hashrate</span>
                        <span class="metric-value green">124.6 PH/s</span>
                        <span class="metric-description">206 units deployed</span>
                    </div>

                    <!-- PAYBACK PERIOD -->
                    <div class="metric-card green">
                        <div class="metric-icon-wrapper green">
                            ${Icons.clock}
                        </div>
                        <span class="metric-label">Payback Period</span>
                        <span class="metric-value green">18 mo</span>
                        <span class="metric-description">6 mo faster than baseline</span>
                    </div>

                    <!-- BREAK-EVEN -->
                    <div class="metric-card green">
                        <div class="metric-icon-wrapper green">
                            ${Icons.check}
                        </div>
                        <span class="metric-label">Break-even</span>
                        <span class="metric-value green">12 mo</span>
                        <span class="metric-description">Excellent performance</span>
                    </div>
                </div>
            </div>

            <!-- REVENUE & PROFITABILITY CHART -->
            <div class="section-premium" style="margin-top: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Revenue & Profitability Projection</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">12-month forecast</p>
                    </div>
                </div>
                <div style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px;">
                    <div style="position: relative; height: 400px;">
                        <canvas id="revenueChartAnalysis"></canvas>
                    </div>
                </div>
            </div>

            <!-- CASH FLOW AND COST BREAKDOWN -->
            <div class="section-premium" style="margin-top: 32px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <!-- CUMULATIVE CASH FLOW -->
                    <div style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px;">
                        <div style="margin-bottom: 20px;">
                            <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Cumulative Cash Flow</h3>
                            <p style="font-size: 12px; color: var(--text-muted);">Break-even analysis</p>
                        </div>
                        <div style="position: relative; height: 300px;">
                            <canvas id="cashflowChartAnalysis"></canvas>
                        </div>
                    </div>

                    <!-- COST BREAKDOWN -->
                    <div style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px;">
                        <div style="margin-bottom: 20px;">
                            <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Cost Breakdown</h3>
                            <p style="font-size: 12px; color: var(--text-muted);">CAPEX vs OPEX distribution</p>
                        </div>
                        <div style="position: relative; height: 300px;">
                            <canvas id="costChartAnalysis"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FINANCIAL METRICS TABLE -->
            <div class="section-premium" style="margin-top: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Financial Metrics</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">12-month projection summary</p>
                    </div>
                </div>
                <div class="table-container">
                    <table class="table-premium">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Year 1</th>
                                <th>Year 2</th>
                                <th>Year 3</th>
                                <th>Year 4</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Revenue</td>
                                <td>$10,111,200</td>
                                <td>$9,403,216</td>
                                <td>$8,750,861</td>
                                <td>$8,149,301</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$36,414,578</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">OPEX</td>
                                <td>$3,870,048</td>
                                <td>$3,870,048</td>
                                <td>$3,870,048</td>
                                <td>$3,870,048</td>
                                <td>$15,480,192</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">Net Profit</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$5,617,008</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$4,979,851</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$4,392,732</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$3,851,328</td>
                                <td style="color: #C5FFA7; font-weight: 600;">$18,840,919</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Charts Section
function renderChartsSection() {
    return `
        <div class="projection-tab-content active" id="charts-section">
            <div class="section-premium">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Financial Visualizations</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Interactive charts and projections</p>
                    </div>
                </div>
                <div id="chartsContent">
                    <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">Cumulative Cash Flow (12 Months)</h3>
                        <div style="position: relative; height: 400px;">
                            <canvas id="cashflowChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">Monthly Revenue vs Costs</h3>
                        <div style="position: relative; height: 400px;">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">ROI Sensitivity Analysis (BTC Price Impact)</h3>
                        <div style="position: relative; height: 400px;">
                            <canvas id="sensitivityChart"></canvas>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px; margin-top: 32px;">
                        <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px;">
                            <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">Monthly Cost Breakdown</h3>
                            <div style="position: relative; height: 300px;">
                                <canvas id="costBreakdownChart"></canvas>
                            </div>
                        </div>
                        <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px;">
                            <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">Network Hashrate Impact on Profitability</h3>
                            <div style="position: relative; height: 300px;">
                                <canvas id="hashrateImpactChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 32px;">
                        <button class="btn btn-secondary" onclick="exportChartsAsImages()">Export Charts as Images</button>
                        <button class="btn btn-secondary" onclick="window.showProjectionSection('results')">Back to Results</button>
                    </div>
                </div>
                <div id="noCharts" style="display: none; text-align: center; padding: 60px 20px;">
                    <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 24px;">No data to visualize. Please calculate ROI first.</p>
                    <button class="btn btn-primary" onclick="window.showProjectionSection('calculator')">Go to Calculator</button>
                </div>
            </div>
        </div>
    `;
}

// Monte Carlo Section
function renderMonteCarloSection() {
    return `
        <div class="projection-tab-content active" id="monte-carlo-section">
            <div class="section-premium">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Monte Carlo Simulation</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Probabilistic analysis with 10,000 scenarios</p>
                    </div>
                </div>
                <div style="background: rgba(197, 255, 167, 0.1); border: 1px solid #C5FFA7; border-radius: 12px; padding: 16px; margin-bottom: 32px;">
                    <strong style="color: #C5FFA7;">Stochastic Modeling:</strong> 
                    <span style="color: var(--text-secondary);">This simulation runs 10,000 iterations with randomized BTC price, network hashrate, and electricity cost variations to provide probability distributions of outcomes.</span>
                </div>
                <div class="param-card" style="max-width: 600px;">
                    <div class="param-card-title">Simulation Parameters</div>
                    <div class="grid-2" style="margin-bottom: 20px;">
                        <div>
                            <label class="form-label">BTC Price Volatility (±%)</label>
                            <div style="position: relative;">
                                <input type="number" class="form-input" id="btcVolatility" value="30" style="padding-right: 40px;">
                                <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px;">%</span>
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Hashrate Volatility (±%)</label>
                            <div style="position: relative;">
                                <input type="number" class="form-input" id="hashrateVolatility" value="20" style="padding-right: 40px;">
                                <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px;">%</span>
                            </div>
                        </div>
                        <div>
                            <label class="form-label">Number of Simulations</label>
                            <input type="number" class="form-input" id="numSimulations" max="50000" min="1000" step="1000" value="10000">
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="runMonteCarlo()">Run Simulation</button>
                </div>
                <div id="monteCarloResults" style="display: none; margin-top: 32px;">
                    <div class="param-card">
                        <div class="param-card-title">Simulation Results</div>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">Break-even time distribution across all scenarios</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
                            <div style="padding: 16px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.1); border-radius: 12px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">10th Percentile</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);" id="p10">-- months</div>
                            </div>
                            <div style="padding: 16px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.1); border-radius: 12px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">25th Percentile</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);" id="p25">-- months</div>
                            </div>
                            <div style="padding: 16px; background: rgba(197, 255, 167, 0.1); border: 1px solid #C5FFA7; border-radius: 12px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Median (50th)</div>
                                <div style="font-size: 24px; font-weight: 700; color: #C5FFA7;" id="p50">-- months</div>
                            </div>
                            <div style="padding: 16px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.1); border-radius: 12px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">75th Percentile</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);" id="p75">-- months</div>
                            </div>
                            <div style="padding: 16px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.1); border-radius: 12px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">90th Percentile</div>
                                <div style="font-size: 24px; font-weight: 700; color: var(--text-primary);" id="p90">-- months</div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container" style="background: #1A1A1A; border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 12px; padding: 24px; margin-top: 24px;">
                        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px;">ROI Distribution Histogram</h3>
                        <div style="position: relative; height: 400px;">
                            <canvas id="monteCarloChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Projects List Section
function renderProjectsListSection() {
    return `
        <div class="projection-tab-content active" id="projects-section">
            <div class="section-premium">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; letter-spacing: -0.5px;">Saved Projects</h2>
                        <p style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Manage and compare your mining scenarios</p>
                    </div>
                </div>
                <!-- PROJECTS TOOLBAR -->
                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
                    <input class="form-input" id="projectSearch" name="project_search" onkeyup="filterProjects()" placeholder="Search projects..." style="flex: 1; min-width: 250px;" type="text"/>
                    <select class="form-input" id="projectSortBy" name="project_sort_by" onchange="filterProjects()" style="width: 180px;">
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="roi-desc">Highest ROI</option>
                        <option value="roi-asc">Lowest ROI</option>
                        <option value="capex-desc">Highest CAPEX</option>
                        <option value="capex-asc">Lowest CAPEX</option>
                    </select>
                    <button class="btn btn-secondary" onclick="window.showProjectionSection('calculator')">
                        ${Icons.projects} New Project
                    </button>
                </div>
                <!-- PROJECTS GRID -->
                <div id="projectsList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
                    <!-- Projects will be loaded here -->
                </div>
                <div id="noProjects" style="text-align: center; padding: 60px 20px;">
                    <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: rgba(26, 26, 26, 0.9); border: 1px solid rgba(197, 255, 167, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        ${Icons.projects}
                    </div>
                    <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 8px;">No saved projects yet</p>
                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 40px;">Create your first mining analysis and save it</p>
                    <button class="btn btn-primary" onclick="window.showProjectionSection('calculator')">Create New Project</button>
                </div>
            </div>
        </div>
    `;
}

// Hardware Section
function renderHardwareSection() {
    return `
        <div class="projection-tab-content active" id="hardware-section">
            <div class="section-premium">
                <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Mining Hardware Management</h2>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 32px;">ASIC fleet configuration and optimization - 2025 Models</p>

                <!-- ASIC CATALOG -->
                <div class="accordion-section collapsed">
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <div class="accordion-title">
                            ${Icons.chevronDown}
                            ASIC Catalog 2025
                            <span class="accordion-badge">NEW MODELS</span>
                        </div>
                    </div>
                    <div class="accordion-content">
                        <p class="accordion-subtitle">Latest generation ASIC miners (2025 specifications)</p>
                        <div class="table-container">
                            <table class="table-premium">
                                <thead>
                                    <tr>
                                        <th>Model</th>
                                        <th>Hashrate</th>
                                        <th>Power</th>
                                        <th>Efficiency</th>
                                        <th>Price</th>
                                        <th>Daily Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">Antminer S21 Pro</td>
                                        <td>234 TH/s</td>
                                        <td>3,510W</td>
                                        <td>15 J/TH</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$5,600</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$7.80</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">Antminer S21 XP</td>
                                        <td>270 TH/s</td>
                                        <td>3,645W</td>
                                        <td>13.5 J/TH</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$6,450</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$9.20</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">Whatsminer M60S</td>
                                        <td>186 TH/s</td>
                                        <td>3,441W</td>
                                        <td>18.5 J/TH</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$3,400</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$5.22</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">Whatsminer M63S</td>
                                        <td>390 TH/s</td>
                                        <td>7,215W</td>
                                        <td>18.5 J/TH</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$5,100</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$10.50</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">Canaan Avalon Q</td>
                                        <td>120 TH/s</td>
                                        <td>3,200W</td>
                                        <td>26.7 J/TH</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$1,800</td>
                                        <td style="color: #C5FFA7; font-weight: 600;">$2.85</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- FLEET CALCULATOR -->
                <div class="accordion-section collapsed">
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <div class="accordion-title">
                            ${Icons.chevronDown}
                            Fleet Configuration Calculator
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="grid-2" style="margin-bottom: 20px;">
                            <div>
                                <label class="form-label">Select ASIC Model</label>
                                <select class="form-input" id="hw_asicModel" name="hw_asic_model" onchange="updateHardwareCalc()">
                                    <option value="s21pro">Antminer S21 Pro (234 TH/s)</option>
                                    <option value="s21xp">Antminer S21 XP (270 TH/s)</option>
                                    <option value="m60s">Whatsminer M60S (186 TH/s)</option>
                                    <option value="m63s">Whatsminer M63S (390 TH/s)</option>
                                    <option value="avalon">Canaan Avalon Q (120 TH/s)</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label">Number of Units</label>
                                <input type="number" class="form-input" id="hw_units" name="hw_units" value="10" min="1" onchange="updateHardwareCalc()">
                            </div>
                            <div>
                                <label class="form-label">Electricity Cost ($/kWh)</label>
                                <input type="number" class="form-input" id="hw_elecCost" name="hw_elec_cost" value="0.06" step="0.01" onchange="updateHardwareCalc()">
                            </div>
                            <div>
                                <label class="form-label">Operating Hours/Day</label>
                                <input type="number" class="form-input" id="hw_hours" name="hw_hours" value="24" min="1" max="24" onchange="updateHardwareCalc()">
                            </div>
                        </div>
                        <div style="background: rgba(26, 26, 26, 0.9); padding: 20px; border-radius: 12px; border: 1px solid rgba(197, 255, 167, 0.2);">
                            <h3 style="font-size: 14px; margin-bottom: 16px; color: #C5FFA7; font-weight: 700;">Calculation Results</h3>
                            <div class="grid-2">
                                <div>
                                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Total Hashrate</p>
                                    <p style="font-size: 20px; font-weight: 700; color: var(--text-primary);" id="hw_totalHash">2,340 TH/s</p>
                                </div>
                                <div>
                                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Power Consumption</p>
                                    <p style="font-size: 20px; font-weight: 700; color: #C5FFA7;" id="hw_totalPower">35.1 kW</p>
                                </div>
                                <div>
                                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Daily Revenue</p>
                                    <p style="font-size: 20px; font-weight: 700; color: #C5FFA7;" id="hw_dailyRev">$780.00</p>
                                </div>
                                <div>
                                    <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">Daily Profit</p>
                                    <p style="font-size: 20px; font-weight: 700; color: #C5FFA7;" id="hw_dailyProfit">$729.46</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Energy Section
function renderEnergySection() {
    return `
        <div class="projection-tab-content active" id="energy-section">
            <div class="section-premium">
                <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Energy Management System</h2>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 32px;">Renewable energy integration and optimization</p>

                <!-- ENERGY MIX -->
                <div class="accordion-section collapsed">
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <div class="accordion-title">
                            ${Icons.chevronDown}
                            Energy Mix Configuration
                            <span class="accordion-badge">RENEWABLE</span>
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="grid-2">
                            <div>
                                <h4 style="color: #C5FFA7; margin-bottom: 16px; font-weight: 700;">${Icons.sun} Solar Power</h4>
                                <div style="margin-bottom: 16px;">
                                    <label class="form-label">Installed Capacity (MW)</label>
                                    <input type="number" class="form-input" id="en_solarCap" value="10" min="0" step="0.1" onchange="updateEnergyMix()">
                                </div>
                                <div>
                                    <label class="form-label">Panel Efficiency</label>
                                    <select class="form-input" id="en_solarType" name="en_solar_type">
                                        <option>Monocrystalline (20%)</option>
                                        <option>Polycrystalline (17%)</option>
                                        <option>Thin Film (15%)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h4 style="color: #C5FFA7; margin-bottom: 16px; font-weight: 700;">${Icons.wind} Wind Power</h4>
                                <div style="margin-bottom: 16px;">
                                    <label class="form-label">Installed Capacity (MW)</label>
                                    <input type="number" class="form-input" id="en_windCap" value="15" min="0" step="0.1" onchange="updateEnergyMix()">
                                </div>
                                <div>
                                    <label class="form-label">Turbine Efficiency</label>
                                    <select class="form-input">
                                        <option>Horizontal Axis (50%)</option>
                                        <option>Vertical Axis (35%)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h4 style="color: #C5FFA7; margin-bottom: 16px; font-weight: 700;">${Icons.battery} Battery Storage</h4>
                                <div style="margin-bottom: 16px;">
                                    <label class="form-label">Storage Capacity (MWh)</label>
                                    <input type="number" class="form-input" id="en_batteryCap" value="20" min="0" step="0.5" onchange="updateEnergyMix()">
                                </div>
                                <div>
                                    <label class="form-label">Battery Type</label>
                                    <select class="form-input">
                                        <option>Li-ion</option>
                                        <option>LFP (LiFePO4)</option>
                                        <option>Flow Battery</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <h4 style="color: #C5FFA7; margin-bottom: 16px; font-weight: 700;">${Icons.energy} Grid Power</h4>
                                <div style="margin-bottom: 16px;">
                                    <label class="form-label">Grid Connection (MW)</label>
                                    <input type="number" class="form-input" id="en_gridCap" value="5" min="0" step="0.1" onchange="updateEnergyMix()">
                                </div>
                                <div>
                                    <label class="form-label">Grid Rate ($/kWh)</label>
                                    <input type="number" class="form-input" value="0.08" step="0.01">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Infrastructure Section
function renderInfrastructureSection() {
    return `
        <div class="projection-tab-content active" id="infrastructure-section">
            <div class="section-premium">
                <h2 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Infrastructure Planning</h2>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 32px;">Facility design and cooling systems</p>

                <!-- COOLING SYSTEMS -->
                <div class="accordion-section collapsed">
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <div class="accordion-title">
                            ${Icons.chevronDown}
                            Cooling Systems
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="grid-2">
                            <div>
                                <label class="form-label">Cooling Type</label>
                                <select class="form-input" id="inf_coolingType">
                                    <option value="air">Air Cooling</option>
                                    <option value="hydro">Hydro Cooling</option>
                                    <option value="immersion">Immersion Cooling</option>
                                    <option value="hybrid">Hybrid System</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label">Cooling Capacity (MW)</label>
                                <input type="number" class="form-input" id="inf_coolingCap" value="30" min="1">
                            </div>
                            <div>
                                <label class="form-label">Target PUE</label>
                                <input type="number" class="form-input" id="inf_pue" value="1.2" min="1.0" max="2.0" step="0.1">
                            </div>
                            <div>
                                <label class="form-label">Inlet Temperature (°C)</label>
                                <input type="number" class="form-input" value="25" min="15" max="35">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// Initialize Overview
export function initOverview() {
    console.log('Initializing Overview Section');
    
    // Setup projection history select
    const historySelect = document.getElementById('projection-history-select');
    if (historySelect) {
        historySelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            if (selectedValue) {
                console.log('Selected projection:', selectedValue);
                // TODO: Load projection details based on selected value
            }
        });
    }
}

// Initialize Calculator
export function initCalculator() {
    console.log('Initializing Calculator Section');
    
    // Stepper logic
    let currentStep = 0;
    const totalSteps = 8; // 0-indexed, so 8 steps total

    window.goToStep = (step) => {
        if (step >= 0 && step < totalSteps) {
            document.querySelectorAll('#calculator-section .step-content').forEach(content => {
                content.classList.remove('active');
            });
            const stepContent = document.getElementById('step-' + step);
            if (stepContent) {
                stepContent.classList.add('active');
            }

            document.querySelectorAll('#calculator-section .stepper .step').forEach((stepEl, index) => {
                stepEl.classList.remove('active', 'completed');
                if (index < step) {
                    stepEl.classList.add('completed');
                } else if (index === step) {
                    stepEl.classList.add('active');
                }
            });

            const progress = (step / (totalSteps - 1)) * 100;
            const progressBar = document.getElementById('stepperProgress');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            currentStep = step;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.nextStep = () => {
        if (currentStep < totalSteps - 1) {
            window.goToStep(currentStep + 1);
        }
    };

    window.prevStep = () => {
        if (currentStep > 0) {
            window.goToStep(currentStep - 1);
        }
    };

    window.setHorizon = (mode, value) => {
        const modeSelect = document.getElementById('horizonMode');
        const valueInput = document.getElementById('horizonValue');
        if (modeSelect) modeSelect.value = mode;
        if (valueInput) valueInput.value = value;
    };

    // Machine card selection
    setTimeout(() => {
        document.querySelectorAll('#calculator-section .machine-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('#calculator-section .machine-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                // Update machine specs based on selection
                const machineModel = this.getAttribute('data-machine');
                updateMachineSpecs(machineModel);
            });
        });
    }, 100);

    // Update machine specs function
    const updateMachineSpecs = (model) => {
        const specs = {
            's21pro': { hashrate: 234, power: 3510, efficiency: 15.0, price: 4007.85 },
            's23hydro': { hashrate: 605, power: 5870, efficiency: 9.7, price: 8500 },
            'm60s': { hashrate: 372, power: 7200, efficiency: 19.4, price: 5800 },
            'custom': { hashrate: 200, power: 3000, efficiency: 15.0, price: 5000 } // Default custom values
        };
        
        const spec = specs[model];
        if (spec) {
            const hashrateInput = document.getElementById('machineHashrate');
            const powerInput = document.getElementById('machinePower');
            const efficiencyInput = document.getElementById('machineEfficiency');
            const priceInput = document.getElementById('machinePrice');
            
            if (hashrateInput) hashrateInput.value = spec.hashrate;
            if (powerInput) powerInput.value = spec.power;
            if (efficiencyInput) efficiencyInput.value = spec.efficiency;
            if (priceInput) priceInput.value = spec.price;
        }
    };

    // Calculate projection function
    // Définir la fonction globalement pour qu'elle soit disponible même si initCalculator n'a pas encore tourné
    if (!window.calculateProjection) {
        window.calculateProjection = () => {
            console.log('Calculating projection...');
            // Navigate to results section
            if (window.showProjectionSection) {
                window.showProjectionSection('results');
            } else {
                console.warn('⚠️ showProjectionSection not available yet, retrying...');
                setTimeout(() => {
                    if (window.showProjectionSection) {
                        window.showProjectionSection('results');
                    } else {
                        console.error('❌ showProjectionSection still not available');
                    }
                }, 100);
            }
        };
    }

    // Initial setup
    setTimeout(() => {
        window.goToStep(0);
        updateMachineSpecs('s23hydro'); // Set default machine specs
    }, 200);
}

// Toggle accordion
window.toggleAccordion = function(element) {
    const section = element.closest('.accordion-section');
    if (section) {
        section.classList.toggle('collapsed');
    }
};

// Refresh news feed
window.refreshNewsFeed = function() {
    const container = document.getElementById('newsFeedContainer');
    if (container) {
        container.innerHTML = renderNewsItems();
    }
};

// Initialize Results
export function initResults() {
    console.log('📊 Initializing Results Section');
    
    // Initialize charts with 12 months of data
    let retryCount = 0;
    const maxRetries = 10;
    
    const tryInitCharts = () => {
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js not loaded yet, retrying...');
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitCharts, 500);
            } else {
                console.error('❌ Chart.js not loaded after', maxRetries, 'retries');
            }
            return;
        }
        
        // Vérifier que les éléments canvas existent
        const revenueCanvas = document.getElementById('revenueChartAnalysis');
        const cashflowCanvas = document.getElementById('cashflowChartAnalysis');
        const costCanvas = document.getElementById('costChartAnalysis');
        
        if (!revenueCanvas || !cashflowCanvas || !costCanvas) {
            console.warn('⚠️ Canvas elements not found yet, retrying...', {
                revenue: !!revenueCanvas,
                cashflow: !!cashflowCanvas,
                cost: !!costCanvas
            });
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitCharts, 200);
            } else {
                console.error('❌ Canvas elements not found after', maxRetries, 'retries');
            }
            return;
        }
        
        console.log('✅ All canvas elements found, initializing charts...');
        try {
            initRevenueChartAnalysis();
            initCashflowChartAnalysis();
            initCostChartAnalysis();
            console.log('✅ All charts initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing charts:', error);
        }
    };
    
    setTimeout(tryInitCharts, 200);
}

// Initialize Revenue & Profitability Chart (12 months)
function initRevenueChartAnalysis() {
    const ctx = document.getElementById('revenueChartAnalysis');
    if (!ctx) {
        console.warn('⚠️ revenueChartAnalysis canvas not found');
        return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create gradients
    const revenueGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    revenueGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
    revenueGradient.addColorStop(0.5, 'rgba(197, 255, 167, 0.1)');
    revenueGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    const profitGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    profitGradient.addColorStop(0, 'rgba(197, 255, 167, 0.25)');
    profitGradient.addColorStop(0.5, 'rgba(197, 255, 167, 0.08)');
    profitGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: [842600, 856200, 869800, 883400, 897000, 910600, 924200, 937800, 951400, 965000, 978600, 992200],
                    borderColor: '#C5FFA7',
                    backgroundColor: revenueGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8
                },
                {
                    label: 'Profit',
                    data: [468000, 475200, 482400, 489600, 496800, 504000, 511200, 518400, 525600, 532800, 540000, 547200],
                    borderColor: '#C5FFA7',
                    backgroundColor: profitGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#E8E8E8',
                        font: { size: 13, weight: '600' },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: true, color: 'rgba(255, 255, 255, 0.02)' },
                    ticks: { color: '#A3A3A3', font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { 
                        color: '#CCCCCC',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            }
        }
    });
}

// Initialize Cash Flow Chart (12 months)
function initCashflowChartAnalysis() {
    const ctx = document.getElementById('cashflowChartAnalysis');
    if (!ctx) {
        console.warn('⚠️ cashflowChartAnalysis canvas not found');
        return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const cashflowGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    cashflowGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
    cashflowGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Cumulative Cash Flow',
                data: [-2500000, -2031400, -1562800, -1094200, -625600, -157000, 311600, 780200, 1248800, 1717400, 2186000, 2654600],
                borderColor: '#C5FFA7',
                backgroundColor: cashflowGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: true, color: 'rgba(255, 255, 255, 0.02)' },
                    ticks: { color: '#A3A3A3', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { 
                        color: '#CCCCCC',
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            }
        }
    });
}

// Initialize Cost Breakdown Chart
function initCostChartAnalysis() {
    const ctx = document.getElementById('costChartAnalysis');
    if (!ctx) {
        console.warn('⚠️ costChartAnalysis canvas not found');
        return;
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['CAPEX', 'OPEX'],
            datasets: [{
                data: [2500000, 4644000],
                backgroundColor: ['#C5FFA7', 'rgba(197, 255, 167, 0.6)'],
                borderColor: ['#C5FFA7', '#C5FFA7'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#E8E8E8',
                        font: { size: 12 },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': $' + (value / 1000000).toFixed(2) + 'M (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Initialize Charts
export function initCharts() {
    console.log('Initializing Charts Section');
    
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initCashflowChart();
            initRevenueChart();
            initSensitivityChart();
            initCostBreakdownChart();
            initHashrateImpactChart();
        } else {
            console.warn('Chart.js not loaded yet');
            setTimeout(() => {
                initCharts();
            }, 500);
        }
    }, 200);
}

// Initialize Cash Flow Chart
function initCashflowChart() {
    const ctx = document.getElementById('cashflowChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const cashflowGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    cashflowGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
    cashflowGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Cumulative Cash Flow',
                data: [-2500000, -2031400, -1562800, -1094200, -625600, -157000, 311600, 780200, 1248800, 1717400, 2186000, 2654600],
                borderColor: '#C5FFA7',
                backgroundColor: cashflowGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)'
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.02)' }, ticks: { color: '#A3A3A3' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#CCCCCC' } }
            }
        }
    });
}

// Initialize Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    revenueGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
    revenueGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: [842600, 856200, 869800, 883400, 897000, 910600, 924200, 937800, 951400, 965000, 978600, 992200],
                    backgroundColor: '#C5FFA7',
                    borderColor: '#C5FFA7'
                },
                {
                    label: 'Costs',
                    data: [374600, 381000, 387400, 393800, 400200, 406600, 413000, 419400, 425800, 432200, 438600, 445000],
                    backgroundColor: 'rgba(197, 255, 167, 0.4)',
                    borderColor: 'rgba(197, 255, 167, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#E8E8E8' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)'
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.02)' }, ticks: { color: '#A3A3A3' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#CCCCCC' } }
            }
        }
    });
}

// Initialize Sensitivity Chart
function initSensitivityChart() {
    const ctx = document.getElementById('sensitivityChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['$70k', '$80k', '$90k', '$100k', '$110k', '$120k'],
            datasets: [{
                label: 'ROI %',
                data: [12.5, 28.3, 44.1, 57.8, 71.5, 85.2],
                borderColor: '#C5FFA7',
                backgroundColor: 'rgba(197, 255, 167, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#E8E8E8' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)'
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.02)' }, ticks: { color: '#A3A3A3' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#CCCCCC' } }
            }
        }
    });
}

// Initialize Cost Breakdown Chart
function initCostBreakdownChart() {
    const ctx = document.getElementById('costBreakdownChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Energy', 'Hardware', 'Infrastructure', 'Other'],
            datasets: [{
                data: [387000, 250000, 150000, 50000],
                backgroundColor: ['#C5FFA7', 'rgba(197, 255, 167, 0.7)', 'rgba(197, 255, 167, 0.5)', 'rgba(197, 255, 167, 0.3)'],
                borderColor: '#C5FFA7',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#E8E8E8' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)'
                }
            }
        }
    });
}

// Initialize Hashrate Impact Chart
function initHashrateImpactChart() {
    const ctx = document.getElementById('hashrateImpactChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['600 EH/s', '650 EH/s', '700 EH/s', '750 EH/s', '800 EH/s'],
            datasets: [{
                label: 'Monthly Profit',
                data: [420000, 380000, 340000, 300000, 260000],
                backgroundColor: '#C5FFA7',
                borderColor: '#C5FFA7'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    bodyColor: '#E8E8E8',
                    borderColor: 'rgba(197, 255, 167, 0.3)'
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.02)' }, ticks: { color: '#A3A3A3' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#CCCCCC' } }
            }
        }
    });
}

// Initialize Monte Carlo
export function initMonteCarlo() {
    console.log('Initializing Monte Carlo Section');
    
    window.runMonteCarlo = () => {
        console.log('Running Monte Carlo simulation...');
        const resultsDiv = document.getElementById('monteCarloResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            // Placeholder for actual simulation logic
            // This would run the actual Monte Carlo simulation
        }
    };
}

// Initialize Projects List
export function initProjectsList() {
    console.log('Initializing Projects List Section');
    
    window.filterProjects = () => {
        console.log('Filtering projects...');
        // Placeholder for project filtering logic
    };
}

// Initialize Hardware
export function initHardware() {
    console.log('Initializing Hardware Section');
    
    window.updateHardwareCalc = () => {
        console.log('Updating hardware calculations...');
        // Placeholder for hardware calculation logic
        // This would update the calculation results based on selected ASIC model and units
    };
}

// Initialize Energy
export function initEnergy() {
    console.log('Initializing Energy Section');
    
    window.updateEnergyMix = () => {
        console.log('Updating energy mix...');
        // Placeholder for energy mix calculation logic
    };
}

// Initialize Infrastructure
export function initInfrastructure() {
    console.log('Initializing Infrastructure Section');
    // Placeholder for infrastructure initialization
}

// Export/Share functions
window.exportResultsPDF = () => {
    console.log('Exporting results to PDF...');
    // Placeholder for PDF export logic
};

window.shareResults = () => {
    console.log('Sharing results...');
    // Placeholder for share functionality
};

window.exportChartsAsImages = () => {
    console.log('Exporting charts as images...');
    // Placeholder for chart export logic
};

