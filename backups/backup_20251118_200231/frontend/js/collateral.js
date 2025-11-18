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
    vancelianGradient.addColorStop(0, 'rgba(123, 237, 159, 0.25)');
    vancelianGradient.addColorStop(0.5, 'rgba(123, 237, 159, 0.08)');
    vancelianGradient.addColorStop(1, 'rgba(123, 237, 159, 0)');

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
                    borderColor: '#7bed9f',
                    backgroundColor: vancelianGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#7bed9f',
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
                backgroundColor: ['#7bed9f', '#45D483', '#2D8A5A'],
                borderColor: ['#7bed9f', '#45D483', '#2D8A5A'],
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
                    titleColor: '#7bed9f',
                    bodyColor: '#CCCCCC',
                    borderColor: 'rgba(123, 237, 159, 0.3)',
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
        { id: 1, name: 'Alpha Capital', email: 'contact@alphacapital.com', btcWallet: 'bc1q...xyz123', erc20Wallet: '0x742d...abc456', positionValue: 809400, status: 'b2b' },
        { id: 2, name: 'Beta Ventures', email: 'info@betaventures.com', btcWallet: 'bc1q...abc456', erc20Wallet: '0x8a3f...def789', positionValue: 442800, status: 'b2c' },
        { id: 3, name: 'Gamma Holdings', email: 'team@gammahold.io', btcWallet: 'bc1q...ghi789', erc20Wallet: '0x5c2e...ghi012', positionValue: 261200, status: 'other' },
        { id: 4, name: 'Delta Partners', email: 'hello@deltapart.co', btcWallet: 'bc1q...jkl012', erc20Wallet: '0x9d7b...jkl345', positionValue: 136200, status: 'other' },
        { id: 5, name: 'Epsilon Fund', email: 'invest@epsilonfund.com', btcWallet: 'bc1q...mno345', erc20Wallet: '0x1a4c...mno678', positionValue: 885600, status: 'b2b' },
        { id: 6, name: 'Zeta Investments', email: 'deals@zetainvest.net', btcWallet: 'bc1q...pqr678', erc20Wallet: '0x6f8e...pqr901', positionValue: 505200, status: 'b2c' }
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
            <td style="font-family: Monaco, monospace; font-size: 10px; color: var(--text-secondary);">${customer.btcWallet}</td>
            <td style="font-family: Monaco, monospace; font-size: 10px; color: var(--text-secondary);">${customer.erc20Wallet}</td>
            <td style="color: #7bed9f; font-weight: 600; font-size: 12px;">$${customer.positionValue.toLocaleString()}</td>
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
                    <div style="font-size: 14px; color: #7bed9f; font-weight: 600;">$${customer.positionValue.toLocaleString()}</div>
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
window.showCustomerDetails = showCustomerDetails;
window.closeCustomerModal = closeCustomerModal;

