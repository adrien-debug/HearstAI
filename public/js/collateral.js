// Collateral Management - HEARST Design System
// Gère la navigation entre les différentes sections du collateral

// Show collateral section
export function showCollateralSection(sectionId) {
    const container = document.getElementById('collateral-sections-container');
    
    if (!container) {
        console.error('Collateral container not found');
        return;
    }
    
    // Importer dynamiquement la vue des sections
    import('./views/collateral-sections.js').then(module => {
        // Render section content
        const content = module.renderCollateralSection(sectionId);
        container.innerHTML = content;
        
        // Initialize section-specific functionality if needed
        setTimeout(() => {
            // Initialize charts and interactions
            if (sectionId === 'dashboard') {
                initDashboardCharts();
            } else if (sectionId === 'collateral') {
                initCollateralSection();
            } else if (sectionId === 'customers') {
                initCustomersSection();
            } else if (sectionId === 'api-management') {
                initAPIManagementSection();
            }
        }, 200);
    }).catch(error => {
        console.error('Error loading collateral section:', error);
        container.innerHTML = `<div class="card">
            <p style="color: var(--text-secondary);">Erreur lors du chargement de la section ${sectionId}</p>
        </div>`;
    });
    
    // Update navigation tabs in header
    const navTabs = document.querySelectorAll('.collateral-nav-tab[data-collateral-section]');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-collateral-section') === sectionId) {
            tab.classList.add('active');
        }
    });
}

// Initialize collateral functionality
export function initCollateral() {
    console.log('⚙️ Initializing Collateral...');
    
    // Exposer la fonction globalement
    window.showCollateralSection = showCollateralSection;
    
    // Load default section (dashboard)
    showCollateralSection('dashboard');
}

// Initialize dashboard charts
function initDashboardCharts() {
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initMiningChart();
            initExpositionChart();
        } else {
            console.warn('Chart.js not loaded yet');
            setTimeout(() => {
                initDashboardCharts();
            }, 500);
        }
    }, 200);
}

// Initialize mining chart (Performance Overview)
function initMiningChart() {
    const ctx = document.getElementById('miningChart');
    if (!ctx) return;

    // Create gradients
    const btcGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    btcGradient.addColorStop(0, 'rgba(255, 149, 0, 0.3)');
    btcGradient.addColorStop(0.5, 'rgba(255, 149, 0, 0.1)');
    btcGradient.addColorStop(1, 'rgba(255, 149, 0, 0)');

    const vancelianGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    vancelianGradient.addColorStop(0, 'rgba(197, 255, 167, 0.25)');
    vancelianGradient.addColorStop(0.5, 'rgba(197, 255, 167, 0.08)');
    vancelianGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

    const morphoGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    morphoGradient.addColorStop(0, 'rgba(39, 117, 202, 0.25)');
    morphoGradient.addColorStop(0.5, 'rgba(39, 117, 202, 0.08)');
    morphoGradient.addColorStop(1, 'rgba(39, 117, 202, 0)');

    const compoundGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    compoundGradient.addColorStop(0, 'rgba(38, 161, 123, 0.25)');
    compoundGradient.addColorStop(0.5, 'rgba(38, 161, 123, 0.08)');
    compoundGradient.addColorStop(1, 'rgba(38, 161, 123, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC Price',
                    data: [102000, 105000, 108000, 112000, 115000, 118000, 116000, 114000, 117000, 119000, 118500, 119800],
                    borderColor: '#FF9500',
                    backgroundColor: btcGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#FF9500',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Vancelian',
                    data: [53550, 55125, 58320, 62496, 64630, 67338, 65488, 63270, 66573, 68782, 68970, 70093],
                    borderColor: 'var(--primary-green)',
                    backgroundColor: vancelianGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'var(--primary-green)',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Morpho',
                    data: [52836, 55125, 58104, 60704, 63825, 67024, 66352, 63954, 67275, 69139, 69684, 70922],
                    borderColor: '#2775CA',
                    backgroundColor: morphoGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#2775CA',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Compound',
                    data: [51510, 53760, 56700, 60256, 62215, 65156, 65540, 63612, 65754, 68425, 68605, 70442],
                    borderColor: '#26A17B',
                    backgroundColor: compoundGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#26A17B',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { 
                intersect: false, 
                mode: 'index' 
            },
            plugins: {
                legend: { 
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#E8E8E8',
                        font: { size: 13, family: 'Inter', weight: '600' },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#7bed9f',
                    titleFont: { size: 13, family: 'Inter', weight: '700' },
                    bodyColor: '#E8E8E8',
                    bodyFont: { size: 12, family: 'Inter', weight: '500' },
                    borderColor: 'rgba(123, 237, 159, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            var label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += '$' + context.parsed.y.toLocaleString();
                                if (context.datasetIndex > 0) {
                                    var btcPrice = context.chart.data.datasets[0].data[context.dataIndex];
                                    var percentage = ((context.parsed.y / btcPrice) * 100).toFixed(1);
                                    label += ' (' + percentage + '% of BTC)';
                                }
                            }
                            return label;
                        },
                        afterLabel: function(context) {
                            if (context.dataIndex > 0) {
                                var currentValue = context.parsed.y;
                                var previousValue = context.chart.data.datasets[context.datasetIndex].data[context.dataIndex - 1];
                                var change = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
                                var symbol = change >= 0 ? '↑' : '↓';
                                var color = change >= 0 ? '+' : '';
                                return symbol + ' ' + color + change + '%';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { 
                        display: true,
                        color: 'rgba(255, 255, 255, 0.02)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#A3A3A3', 
                        font: { size: 11, family: 'Inter', weight: '500' },
                        padding: 10
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    min: 50000,
                    max: 120000,
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.05)', 
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#CCCCCC', 
                        font: { size: 12, family: 'Inter', weight: '600' },
                        padding: 12,
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    },
                    border: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Initialize exposition chart (Client Health Status)
function initExpositionChart() {
    const ctx = document.getElementById('expositionChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Healthy', 'Unhealthy', 'Exposed'],
            datasets: [{
                data: [198, 37, 12],
                backgroundColor: ['var(--primary-green)', 'var(--cockpit-orange)', 'var(--cockpit-red)'],
                borderColor: ['var(--primary-green)', 'var(--cockpit-orange)', 'var(--cockpit-red)'],
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: 'var(--primary-green)',
                    bodyColor: '#CCCCCC',
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + Math.round(247 * value / total) + ' clients (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Initialize customers section
function initCustomersSection() {
    // Load customers data
    loadCustomersData();
    
    // Setup search functionality
    const searchInput = document.getElementById('searchCustomers');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#customersTable tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }

    // Setup filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const rows = document.querySelectorAll('#customersTable tr');
            rows.forEach((row, index) => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    const customer = window.customersData && window.customersData[index];
                    if (customer) {
                        row.style.display = customer.status === filter ? '' : 'none';
                    }
                }
            });
        });
    });
}

// Load customers data
function loadCustomersData() {
    const customersData = [
        { id: 1, name: 'Alpha Capital', email: 'contact@alphacapital.com', btcWallet: 'bc1qxy7z8w9v0u1t2s3r4q5p6o7n8m9l0k1j2i3h4g5f6', erc20Wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', positionValue: 4285600, status: 'b2b' },
        { id: 2, name: 'Beta Ventures', email: 'info@betaventures.com', btcWallet: 'bc1qab8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v', erc20Wallet: '0x8a3f5E7B9C1D2F4A6B8C0D1E3F5A7B9C1D2E4F6A8B', positionValue: 2703300, status: 'b2c' },
        { id: 3, name: 'Gamma Holdings', email: 'team@gammahold.io', btcWallet: 'bc1qgh9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b', erc20Wallet: '0x5c2e4F6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0F', positionValue: 3395840, status: 'b2b' },
        { id: 4, name: 'Delta Partners', email: 'hello@deltapart.co', btcWallet: 'bc1qjk0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e', erc20Wallet: '0x9d7b3E5F7A9C1D3E5F7A9B1C3D5E7F9A1B3C5D7E9F', positionValue: 1166670, status: 'other' },
        { id: 5, name: 'Epsilon Fund', email: 'invest@epsilonfund.com', btcWallet: 'bc1qmn1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0', erc20Wallet: '0x1a4c6E8F0A2B4C6E8F0A2B4C6E8F0A2B4C6E8F0A2B', positionValue: 825330, status: 'b2b' },
        { id: 6, name: 'Zeta Investments', email: 'deals@zetainvest.net', btcWallet: 'bc1qpq2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1', erc20Wallet: '0x6f8e0A2C4E6F8A0B2C4D6E8F0A2B4C6D8E0F2A4B', positionValue: 1432490, status: 'b2c' },
        { id: 7, name: 'Theta Group', email: 'info@thetagroup.io', btcWallet: 'bc1qrs3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2', erc20Wallet: '0x3b5d7F9A1C3E5F7A9B1C3D5E7F9A1B3C5D7E9F1A3', positionValue: 2156800, status: 'b2b' },
        { id: 8, name: 'Iota Capital', email: 'contact@iotacapital.com', btcWallet: 'bc1qst4u5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3', erc20Wallet: '0x7c9e1B3D5F7A9C1E3F5A7B9C1D3E5F7A9B1C3D5E7F', positionValue: 1892400, status: 'b2c' },
        { id: 9, name: 'Kappa Holdings', email: 'team@kappahold.io', btcWallet: 'bc1qtu5v6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4', erc20Wallet: '0x4d0f2A4C6E8F0A2B4C6D8E0F2A4B6C8D0E2F4A6B8', positionValue: 3125600, status: 'b2b' },
        { id: 10, name: 'Lambda Ventures', email: 'hello@lambdaventures.net', btcWallet: 'bc1quv6w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5', erc20Wallet: '0x8e1A3C5F7A9B1D3E5F7A9B1C3D5E7F9A1B3C5D7E9F', positionValue: 1678900, status: 'other' }
    ];
    
    window.customersData = customersData;
    
    const tbody = document.getElementById('customersTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    customersData.forEach(customer => {
        const tr = document.createElement('tr');
        tr.onclick = () => showCustomerDetails(customer);
        tr.innerHTML = `
            <td style="color: var(--text-muted); font-size: 11px; font-weight: 600;">#${customer.id}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 600; color: var(--text-primary);">${customer.name}</span>
                </div>
            </td>
            <td style="color: var(--text-muted); font-size: 11px;">${customer.email}</td>
            <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">${customer.btcWallet.substring(0, 12)}...${customer.btcWallet.substring(customer.btcWallet.length - 6)}</td>
            <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">${customer.erc20Wallet.substring(0, 8)}...${customer.erc20Wallet.substring(customer.erc20Wallet.length - 6)}</td>
            <td style="color: var(--primary-green); font-weight: 600; font-size: 12px;">$${customer.positionValue.toLocaleString()}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px; font-size: 10px;" 
                    onclick="event.stopPropagation(); showCustomerDetails(window.customersData[${customer.id - 1}])">
                    Details
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Initialize collateral section
function initCollateralSection() {
    // Load collateral positions data
    loadCollateralPositions();
    
    // Setup filter functionality
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            filterCollateralPositions(filter);
        });
    });
}

// Load collateral positions data
function loadCollateralPositions() {
    const positionsData = [
        {
            id: 1,
            customer: 'Alpha Capital',
            protocol: 'Vancelian',
            collateral: '45.2 BTC',
            collateralValue: '$4,285,600',
            borrowed: '$2,850,000 USDT',
            healthFactor: '1.85',
            status: 'safe',
            ltv: '66.5%'
        },
        {
            id: 2,
            customer: 'Beta Ventures',
            protocol: 'Morpho',
            collateral: '28.5 BTC',
            collateralValue: '$2,703,300',
            borrowed: '$1,650,000 USDC',
            healthFactor: '1.64',
            status: 'safe',
            ltv: '61.0%'
        },
        {
            id: 3,
            customer: 'Epsilon Fund',
            protocol: 'Compound',
            collateral: '35.8 BTC',
            collateralValue: '$3,395,840',
            borrowed: '$2,200,000 USDT',
            healthFactor: '1.54',
            status: 'safe',
            ltv: '64.8%'
        },
        {
            id: 4,
            customer: 'Gamma Holdings',
            protocol: 'Vancelian',
            collateral: '12.3 BTC',
            collateralValue: '$1,166,670',
            borrowed: '$850,000 USDC',
            healthFactor: '1.37',
            status: 'at-risk',
            ltv: '72.9%'
        },
        {
            id: 5,
            customer: 'Delta Partners',
            protocol: 'Morpho',
            collateral: '8.7 BTC',
            collateralValue: '$825,330',
            borrowed: '$720,000 USDT',
            healthFactor: '1.15',
            status: 'at-risk',
            ltv: '87.2%'
        },
        {
            id: 6,
            customer: 'Zeta Investments',
            protocol: 'Compound',
            collateral: '15.1 BTC',
            collateralValue: '$1,432,490',
            borrowed: '$1,350,000 USDC',
            healthFactor: '1.06',
            status: 'exposed',
            ltv: '94.2%'
        }
    ];
    
    window.collateralPositionsData = positionsData;
    renderCollateralPositions(positionsData);
}

// Render collateral positions
function renderCollateralPositions(positions) {
    const container = document.getElementById('collateralPositions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (positions.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: var(--space-8);">No positions found</p>';
        return;
    }
    
    positions.forEach(position => {
        const positionCard = document.createElement('div');
        positionCard.className = 'position-card';
        positionCard.style.cssText = `
            background: var(--primary-grey);
            border: 1px solid var(--grey-100);
            border-radius: var(--radius-md);
            padding: var(--space-5);
            margin-bottom: var(--space-3);
            transition: all var(--duration-fast) var(--ease-in-out);
            cursor: pointer;
        `;
        
        positionCard.onmouseenter = () => {
            positionCard.style.borderColor = 'var(--primary-green)';
            positionCard.style.transform = 'translateX(4px)';
        };
        
        positionCard.onmouseleave = () => {
            positionCard.style.borderColor = 'var(--grey-100)';
            positionCard.style.transform = 'translateX(0)';
        };
        
        const statusBadgeClass = position.status === 'safe' ? 'healthy' : position.status === 'at-risk' ? 'unhealthy' : 'at-risk';
        const statusLabel = position.status === 'safe' ? 'SAFE' : position.status === 'at-risk' ? 'AT RISK' : 'EXPOSED';
        
        positionCard.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); align-items: center;">
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">CUSTOMER</div>
                    <div style="font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--text-primary);">${position.customer}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-1);">${position.protocol}</div>
                </div>
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">COLLATERAL</div>
                    <div style="font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--primary-green);">${position.collateral}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">${position.collateralValue}</div>
                </div>
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">BORROWED</div>
                    <div style="font-size: var(--text-base); font-weight: var(--font-semibold); color: var(--text-primary);">${position.borrowed}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-muted);">LTV: ${position.ltv}</div>
                </div>
                <div>
                    <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">HEALTH FACTOR</div>
                    <div style="font-size: var(--text-xl); font-weight: var(--font-bold); color: ${position.status === 'safe' ? 'var(--primary-green)' : position.status === 'at-risk' ? 'var(--cockpit-orange)' : 'var(--cockpit-red)'};">${position.healthFactor}</div>
                </div>
                <div style="text-align: right;">
                    <span class="badge ${statusBadgeClass}">${statusLabel}</span>
                </div>
            </div>
        `;
        
        container.appendChild(positionCard);
    });
}

// Filter collateral positions
function filterCollateralPositions(filter) {
    const allPositions = window.collateralPositionsData || [];
    
    if (filter === 'all') {
        renderCollateralPositions(allPositions);
    } else {
        const filtered = allPositions.filter(pos => pos.status === filter);
        renderCollateralPositions(filtered);
    }
}

// Initialize API management section
function initAPIManagementSection() {
    // Toggle API functionality is handled inline in the HTML
}

// Export functions for use in sections
export function toggleAPI(provider, isActive) {
    const status = isActive ? 'ACTIVE' : 'INACTIVE';
    const message = isActive 
        ? `✅ ${provider.toUpperCase()} API enabled\n\nConnection restored\nReal-time data flowing`
        : `⚠️ ${provider.toUpperCase()} API disabled\n\nConnection paused\nNo data requests will be sent`;
    alert(message);
}

// Make toggleAPI globally available
window.toggleAPI = toggleAPI;

// Export functions for use in sections
export function exportCollateral() {
    alert('Exporting collateral data...\nThis would generate a CSV file with all collateral positions.');
}

export function exportCustomers() {
    alert('Exporting all customer data...\nThis would generate a CSV file with all customer information.');
}

export function addCustomer() {
    alert('Opening new customer form...\nThis would show a form to add a new customer to the platform.');
}

export function addNewPosition() {
    alert('Opening new position form...\nThis would show a form to create a new collateral position.');
}

export function showCustomerDetails(customer) {
    if (!customer) return;
    const modal = document.getElementById('customerModal');
    if (!modal) return;
    
    modal.style.display = 'block';
    const modalContent = modal.querySelector('div > div');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div style="padding: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="font-size: 24px; font-weight: 600; color: var(--text-primary);">${customer.name}</h2>
                <button onclick="closeCustomerModal()" style="padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; color: var(--text-secondary); cursor: pointer;">✕</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Email</div>
                    <div style="font-size: 14px; color: var(--text-primary);">${customer.email}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">Position Value</div>
                    <div style="font-size: 14px; color: var(--primary-green); font-weight: 600;">$${customer.positionValue.toLocaleString()}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">BTC Wallet</div>
                    <div style="font-size: 12px; font-family: Monaco, monospace; color: var(--text-secondary);">${customer.btcWallet}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">ERC-20 Wallet</div>
                    <div style="font-size: 12px; font-family: Monaco, monospace; color: var(--text-secondary);">${customer.erc20Wallet}</div>
                </div>
            </div>
        </div>
    `;
}

export function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make functions globally available
window.exportCollateral = exportCollateral;
window.exportCustomers = exportCustomers;
window.addCustomer = addCustomer;
window.addNewPosition = addNewPosition;
window.showCustomerDetails = showCustomerDetails;
window.closeCustomerModal = closeCustomerModal;

