// Dashboard View Template - HEARST STYLE
// Basé sur le design de la capture d'écran
import { Icons } from '../icons.js';

export function renderDashboard(data) {
    return `
        <div class="dashboard-view">
            <div class="dashboard-content">
                <!-- Section Wallet -->
                <div class="wallet-section">
                    <!-- BTC Wallet Card -->
                    <div class="wallet-card">
                        <div class="wallet-card-header">
                            <h3 class="wallet-card-title">BTC Wallet</h3>
                        </div>
                        <div class="wallet-card-body">
                            <div class="wallet-balance">
                                <div class="wallet-balance-btc">0.031819 BTC</div>
                                <div class="wallet-balance-usd">$3,628.13 USD</div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Charts Container (2 colonnes) -->
                    <div class="wallet-charts-container">
                        <!-- Graphique Performance Overview existant -->
                        <div class="wallet-chart-section">
                            <div class="chart-header">
                                <h2 class="chart-title">Performance Overview</h2>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="legend-dot green"></span>
                                        <span>BTC Wallet</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot gray"></span>
                                        <span>Transactions</span>
                                    </div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="walletPerformanceChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Nouveau graphique Bar Chart -->
                        <div class="wallet-chart-section">
                            <div class="chart-header">
                                <h2 class="chart-title">Performance Bar Chart</h2>
                                <div class="chart-legend">
                                    <div class="legend-item">
                                        <span class="legend-dot green"></span>
                                        <span>BTC Wallet</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot gray"></span>
                                        <span>Transactions</span>
                                    </div>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="walletBarChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Wallet Incoming Transactions -->
                    <div class="transactions-section">
                        <div class="section-header-home">
                            <h3 class="section-title-home">Wallet incoming transactions</h3>
                        </div>
                        <div class="table-container">
                            <table class="table table-unified-grid">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>BTC Transaction</th>
                                        <th>Wallet adresse</th>
                                        <th>Trx Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2025-01-18</td>
                                        <td class="transaction-amount">0.006234 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>a1b2c3d4e5f6...</td>
                                    </tr>
                                    <tr>
                                        <td>2025-01-17</td>
                                        <td class="transaction-amount">0.005891 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>f6e5d4c3b2a1...</td>
                                    </tr>
                                    <tr>
                                        <td>2025-01-16</td>
                                        <td class="transaction-amount">0.005432 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>9z8y7x6w5v4u...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-15</td>
                                        <td class="transaction-amount">0.004876 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>3t4u5v6w7x8y...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-14</td>
                                        <td class="transaction-amount">0.004521 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>7m8n9o0p1q2r...</td>
                                    </tr>
                                    <tr class="row-hidden" data-table="wallet">
                                        <td>2025-01-13</td>
                                        <td class="transaction-amount">0.004198 BTC</td>
                                        <td>1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck</td>
                                        <td>5k6l7m8n9o0p...</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="see-more-container">
                                <button class="btn-see-more" data-table="wallet">
                                    <span class="see-more-text">See more</span>
                                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Transaction History -->
                <div class="transaction-history-section">
                    <div class="transaction-history-header">
                        <h2 class="transaction-history-title">Transaction history</h2>
                        <div class="transaction-history-controls">
                            <select class="date-range-select" id="date-range-select" name="date_range">
                                <option value="January 1, 2025 - January 31, 2025">January 1, 2025 - January 31, 2025</option>
                                <option value="December 1, 2024 - December 31, 2024">December 1, 2024 - December 31, 2024</option>
                                <option value="November 1, 2024 - November 30, 2024">November 1, 2024 - November 30, 2024</option>
                            </select>
                            <select class="contract-select" id="contract-select" name="contract">
                                <option value="Contracts AL01">Contracts AL01</option>
                                <option value="Contracts AL02">Contracts AL02</option>
                                <option value="Contracts AL03">Contracts AL03</option>
                            </select>
                            <button class="btn btn-primary btn-export-excel" id="btn-export-excel">
                                Export to excel
                            </button>
                        </div>
                    </div>

                    <!-- Transaction History Table -->
                    <div class="table-container transaction-history-table-container">
                        <table class="table transaction-history-table table-unified-grid">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Account</th>
                                    <th>Total Reward</th>
                                    <th>Hashrate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2025-01-18</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.084521 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr>
                                    <td>2025-01-17</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.083247 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr>
                                    <td>2025-01-16</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.082156 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-15</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.081892 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-14</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.080654 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                                <tr class="row-hidden" data-table="transaction-history">
                                    <td>2025-01-13</td>
                                    <td>AKT04</td>
                                    <td class="transaction-reward">0.079432 BTC</td>
                                    <td>2041.42 TH/s</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="see-more-container">
                            <button class="btn-see-more" data-table="transaction-history">
                                <span class="see-more-text">See more</span>
                                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Total Row -->
                    <div class="transaction-history-total">
                        <strong>Total: <span class="total-amount">0.491902 BTC</span></strong>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Styles moved to frontend/css/dashboard.css
// No longer injecting <style> blocks - all styles are now in global CSS

// Fonction pour copier l'adresse du wallet
window.copyWalletAddress = function() {
    const address = '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck';
    navigator.clipboard.writeText(address).then(() => {
        // Optionnel: afficher une notification
        console.log('Address copied to clipboard');
    });
};

// Fonction pour copier l'adresse du wallet
window.copyWalletAddress = function() {
    const address = '1Lzu8ieZUN7QDk6MTiPive2s2uhr2xzqqpck';
    navigator.clipboard.writeText(address).then(() => {
        // Optionnel: afficher une notification
        console.log('Address copied to clipboard');
    });
};

// Initialize See More buttons
function initSeeMoreButtons() {
    const seeMoreButtons = document.querySelectorAll('.btn-see-more');
    
    seeMoreButtons.forEach(button => {
        if (button.dataset.initialized) return;
        button.dataset.initialized = 'true';
        
        button.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table');
            const hiddenRows = document.querySelectorAll(`.row-hidden[data-table="${tableId}"]`);
            const isExpanded = this.classList.contains('expanded');
            
            hiddenRows.forEach(row => {
                if (isExpanded) {
                    row.classList.remove('visible');
                } else {
                    row.classList.add('visible');
                }
            });
            
            if (isExpanded) {
                this.classList.remove('expanded');
                this.querySelector('.see-more-text').textContent = 'See more';
            } else {
                this.classList.add('expanded');
                this.querySelector('.see-more-text').textContent = 'See less';
            }
        });
    });
}

// Initialize Wallet Performance Chart
function initWalletPerformanceChart() {
    try {
        const ctx = document.getElementById('walletPerformanceChart');
        if (!ctx) {
            return;
        }

        // Verify it's a canvas element
        if (ctx.tagName !== 'CANVAS') {
            console.warn('walletPerformanceChart element is not a canvas');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            setTimeout(initWalletPerformanceChart, 200);
            return;
        }

        // Create gradients
        const canvasContext = ctx.getContext('2d');
        if (!canvasContext) {
            console.warn('Could not get 2d context from canvas');
            return;
        }
        
        const btcGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        btcGradient.addColorStop(0, 'rgba(197, 255, 167, 0.3)');
        btcGradient.addColorStop(0.5, 'rgba(197, 255, 167, 0.1)');
        btcGradient.addColorStop(1, 'rgba(197, 255, 167, 0)');

        const transactionGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        transactionGradient.addColorStop(0, 'rgba(136, 136, 136, 0.25)');
        transactionGradient.addColorStop(0.5, 'rgba(136, 136, 136, 0.08)');
        transactionGradient.addColorStop(1, 'rgba(136, 136, 136, 0)');

        new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC Wallet',
                    data: [0.025, 0.027, 0.029, 0.031, 0.030, 0.032, 0.031, 0.030, 0.032, 0.031, 0.031, 0.032],
                    borderColor: '#C5FFA7',
                    backgroundColor: btcGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#C5FFA7',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Transactions',
                    data: [0.005, 0.0055, 0.0052, 0.0058, 0.0056, 0.0059, 0.0057, 0.0055, 0.0058, 0.0056, 0.0057, 0.0058],
                    borderColor: '#888888',
                    backgroundColor: transactionGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#888888',
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
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    titleFont: { size: 13, family: 'Inter', weight: '700' },
                    bodyColor: '#E8E8E8',
                    bodyFont: { size: 12, family: 'Inter', weight: '500' },
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6
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
                            return value.toFixed(3) + ' BTC';
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
    } catch (error) {
        console.warn('Error initializing Wallet Performance Chart:', error);
    }
}

function initWalletBarChart() {
    try {
        const ctx = document.getElementById('walletBarChart');
        if (!ctx) {
            return;
        }

        // Verify it's a canvas element
        if (ctx.tagName !== 'CANVAS') {
            console.warn('walletBarChart element is not a canvas');
            return;
        }

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet');
            setTimeout(initWalletBarChart, 200);
            return;
        }

        // Create gradients
        const canvasContext = ctx.getContext('2d');
        if (!canvasContext) {
            console.warn('Could not get 2d context from canvas');
            return;
        }

        const btcGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
        btcGradient.addColorStop(0, 'rgba(197, 255, 167, 0.8)');
        btcGradient.addColorStop(1, 'rgba(197, 255, 167, 0.3)');

        const transactionGradient = canvasContext.createLinearGradient(0, 0, 0, 201);
    transactionGradient.addColorStop(0, 'rgba(136, 136, 136, 0.8)');
    transactionGradient.addColorStop(1, 'rgba(136, 136, 136, 0.3)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'BTC Wallet',
                    data: [0.025, 0.027, 0.029, 0.031, 0.030, 0.032, 0.031, 0.030, 0.032, 0.031, 0.031, 0.032],
                    backgroundColor: btcGradient,
                    borderColor: '#C5FFA7',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                },
                {
                    label: 'Transactions',
                    data: [0.005, 0.0055, 0.0052, 0.0058, 0.0056, 0.0059, 0.0057, 0.0055, 0.0058, 0.0056, 0.0057, 0.0058],
                    backgroundColor: transactionGradient,
                    borderColor: '#888888',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
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
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: '#C5FFA7',
                    titleFont: { size: 13, family: 'Inter', weight: '700' },
                    bodyColor: '#E8E8E8',
                    bodyFont: { size: 12, family: 'Inter', weight: '500' },
                    borderColor: 'rgba(197, 255, 167, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 12,
                    boxHeight: 12,
                    boxPadding: 6
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
                            return value.toFixed(3) + ' BTC';
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
    } catch (error) {
        console.warn('Error initializing Wallet Bar Chart:', error);
    }
}

// Auto-initialize when dashboard is rendered
if (typeof window !== 'undefined') {
    // Initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initSeeMoreButtons();
            setTimeout(initWalletPerformanceChart, 200);
            setTimeout(initWalletBarChart, 200);
        });
    } else {
        // DOM already loaded, initialize after a short delay to ensure elements exist
        setTimeout(() => {
            initSeeMoreButtons();
            initWalletPerformanceChart();
            initWalletBarChart();
        }, 100);
    }
    
    // Also initialize when dashboard view is loaded
    window.initSeeMoreButtons = initSeeMoreButtons;
    window.initWalletPerformanceChart = initWalletPerformanceChart;
    window.initWalletBarChart = initWalletBarChart;
}

// Export alias for backward compatibility
export const dashboardTemplate = renderDashboard;
